<template>
    <div id="controlContainer">
        <ul class="controlList">
            <li v-for="item in controlList" :key="item.id" :title="item.name" @click="handleClick(item)"
                class="controlItem">
                <img class="controlIcon" :src="item.iconUrl" />
            </li>
        </ul>
        <div id="mapdropdown" v-show="dropdownIsOpen" ref="mapdropdown">
            <div class="container">
                <div v-for="item in mapItems" :key="item.id" :title="item.mapName" class="mapItem"
                    @click="changeMap(item)">
                    <img class=" mapImage" :src="item.thumbnail" />
                    <p class="mapTitle">{{ item.mapName }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';//正式环境API
import BaseMap from '@/components/package/js/layer/BaseMap.js'
export default {
    name: "MapControl",
    components: {},
    props: ['viewer'],
    data() {
        return {
            dropdownIsOpen: false,
            fullscreenIsOpen: false,
            controlList: [
                {
                    id: "basemapPicker",
                    name: "底图切换",
                    iconUrl: require('@/assets/mapControIcon/basemap.png')
                }, {
                    id: "fullscreen",
                    name: "全屏",
                    iconUrl: require('@/assets/mapControIcon/fullscreen.png')
                }, {
                    id: "home",
                    name: "初始视图",
                    iconUrl: require('@/assets/mapControIcon/cs.png')
                },
            ],
            mapItems: [],
        };
    },
    watch: {
        dropdownIsOpen(val) {
            if (val) {
                this.getBaseMapList();
                setTimeout(() => {
                    document.addEventListener('click', this.checkClick);
                }, 0);
            } else {
                document.removeEventListener('click', this.checkClick);
            }
        }
    },
    computed: {},
    methods: {
        handleClick(item) {
            this.viewerCenter = window.viewerCenter;
            switch (item.id) {
                case "basemapPicker":
                    this.dropdownIsOpen = !this.dropdownIsOpen;
                    break;
                case "fullscreen":
                    this.fullscreenIsOpen = !this.fullscreenIsOpen;
                    this.fullscreenIsOpen ? this.openFullscreen() : this.exitFullscreen();
                    break;
                case "home":
                    if (this.viewerCenter) {
                        this.viewer.camera.flyTo(this.viewerCenter);
                    }
            }
        },
        openFullscreen() {
            this.$parent.isFullScreen = true;
            /* 获取(<html>)元素以全屏显示页面 */
            const full = this.$parent.$refs.content;
            if (full.RequestFullScreen) {
                full.RequestFullScreen()
                //兼容Firefox
            } else if (full.mozRequestFullScreen) {
                full.mozRequestFullScreen()
                //兼容Chrome, Safari and Opera等
            } else if (full.webkitRequestFullScreen) {
                full.webkitRequestFullScreen()
                //兼容IE/Edge
            } else if (full.msRequestFullscreen) {
                full.msRequestFullscreen()
            }
        },
        exitFullscreen() {
            this.$parent.isFullScreen = false;
            if (document.exitFullScreen) {
                document.exitFullScreen();
                //兼容Firefox
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
                //兼容Chrome, Safari and Opera等
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
                //兼容IE/Edge
            } else if (element.msExitFullscreen) {
                element.msExitFullscreen();
            }
        },
        getBaseMapList() {
            //正式环境API(针对不同wmts，请求参数可在数据中设置传)
            axios.get('/data/package/baseMap.json')
                .then(response => {
                    this.mapItems = response.data;
                }).catch(err => {
                    console.log(err);
                })
        },
        //检查点击dom相交
        checkClick(e) {
            let dom = this.$refs.mapdropdown;
            if (!dom.contains(e.target)) {
                // 不在菜单范围，隐藏即可
                if (this.dropdownIsOpen) {
                    this.dropdownIsOpen = false;
                    document.removeEventListener('click', this.checkClick);
                }
            }
        },
        changeMap(item) {
            this.removeAllBaseMap();//清除之前的底图
            let basemap = new BaseMap(item);
            //layer、center是baseMap的私有属性
            let basemapLayer = basemap.layer;
            let basemapCenter = basemap.center;
            //添加到ImageryLayerCollection并将置于底部
            let imageryLayers = this.viewer.imageryLayers;
            if (item.serverType == "WMTS" && item.coordinates == 'CGCS2000') {
                basemapLayer[0].id = item.id;//底图图层
                if (basemapLayer.length > 1) {
                    basemapLayer[1].id = item.id + '_1';//注记图层
                }
                for (let item of basemapLayer) {
                    item.type = 'BaseMap';
                    this.viewer.imageryLayers.add(item);
                }
                //设置底图层级为最底层
                var tdtLayer = this.getTargetImageryLayer(item.id);
                var tdtLabelLayer = this.getTargetImageryLayer(item.id + '_1');
                if (tdtLabelLayer) {
                    imageryLayers.lowerToBottom(tdtLabelLayer);
                }
                if (tdtLayer) {
                    imageryLayers.lowerToBottom(tdtLayer);
                }
            } else {
                basemapLayer.id = item.id;//底图图层
                basemapLayer.type = 'BaseMap';
                imageryLayers.add(basemapLayer);
                let targetImageryLayer = this.getTargetImageryLayer(item.id);
                if (targetImageryLayer) {
                    imageryLayers.lowerToBottom(targetImageryLayer);
                }
            }
            //定位
            if (basemapCenter) {
                this.viewer.camera.flyTo(basemapCenter);
            } else {
                this.viewer.camera.flyTo(this.viewerCenter);//初始化已经挂着到window
            }
        },
        removeAllBaseMap() {
            //不能用removeAll方法，会删除wms服务
            //地图要加标记BaseMap
            let basemapArr = [];
            let imageryLayers = this.viewer.imageryLayers;
            for (let i = 0; i < imageryLayers.length; i++) {
                let imageryLayer = imageryLayers.get(i);
                if (imageryLayer.type && imageryLayer.type == 'BaseMap') {
                    basemapArr.push(imageryLayer);
                }
            }
            for (let i = 0; i < basemapArr.length; i++) {
                let basemap = basemapArr[i];
                imageryLayers.remove(basemap);
            }
        },
        getTargetImageryLayer(id) {
            let targetImageryLayer = null;
            let imageryLayers = this.viewer.imageryLayers;
            for (let i = 0; i < imageryLayers.length; i++) {
                var imageryLayer = imageryLayers.get(i);
                if (imageryLayer.id && imageryLayer.id === id) {
                    targetImageryLayer = imageryLayer;
                }
            }
            return targetImageryLayer;
        },
    },
    //卸载事件
    unmounted() {
        document.removeEventListener('click', checkClick);
    }
};
</script>
<style lang="less" scoped>
.controlList {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
        width: 100%;
        height: 38px;
        line-height: 38px;
        text-align: center;

        .controlIcon {
            display: inline-block;
            vertical-align: middle;
        }
    }
}

#mapdropdown {
    width: 320px;
    height: auto;
    position: absolute;
    right: 61px;
    bottom: 5px;
    background: rgba(9, 28, 55, 0.7);
    box-shadow: inset 0px 1px 12px 0px #4389FF;

    .container {
        padding: 10px;
        max-height: 375px;
        min-width: 324px;
        overflow-y: auto;

        .mapItem {
            width: 80px;
            display: inline-block;
            margin: 10px 10px 0 10px;

            .mapImage {
                width: 80px;
                height: 80px;
                box-shadow: inset 0px 1px 12px 0px #4389FF;
            }

            .mapTitle {
                height: 22px;
                font-size: 12px;
                font-weight: 400;
                color: #fff;
                line-height: 22px;
                text-align: center;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                margin-bottom: 0px;
            }
        }
    }

    .container::-webkit-scrollbar {
        width: 4px;
        height: 4px;
        border-radius: 6px;
    }

    .container::-webkit-scrollbar-thumb {
        border-radius: 4px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, .2);
        background: #1785ff;
    }
}
</style>