<template>
    <div>
        <div id="cesiumContainer"></div>
        <div class="control">
            <button @click="setModelColor()">设置模型颜色</button>
            <button @click="resetModelColor()">重置模型颜色</button>
            <button @click="setWidgetColor()">设置构件颜色</button>
            <button @click="resetWidgetColor()">重置构件颜色</button>
        </div>
    </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
export default {
    components: {},

    data() {
        return {
            viewer: null,
            tileset: null,
            style: null,//模型样式
            featureArr: [],//要改变的样式的要素集合
            hightLighted: {//高亮样式、颜色
                feature: undefined,
                originalColor: new Cesium.Color(),
            }
        };
    },

    computed: {},

    mounted() {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
        this.viewer = new Cesium.Viewer("cesiumContainer", {
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            selectionIndicator: false,
            timeline: false,
            sceneModePicker: false,
            sceneModePicker: false,
            navigationHelpButton: false,
        })
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
        this.tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: 'data/3dtiles/bim/tileset.json',
            })
        );
        this.tileset.readyPromise
            .then(tileset => {
                this.viewer.zoomTo(
                    tileset,
                    new Cesium.HeadingPitchRange(
                        0.5,
                        -0.2,
                        tileset.boundingSphere.radius * 4.0
                    )
                );
            })
        const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        handler.setInputAction(movement => {
            // 清除之前的高亮元素
            if (Cesium.defined(this.hightLighted.feature)) {
                this.hightLighted.feature.color = this.hightLighted.originalColor;
                this.hightLighted.feature = undefined;
            }
            //保持颜色
            for (let i = 0; i < this.featureArr.length; i++) {
                this.featureArr[i].color = Cesium.Color.NAVY
            }

            // 选择新要素
            const pickedFeature = this.viewer.scene.pick(movement.position);
            if (!Cesium.defined(pickedFeature)) {
                return;
            }
            // 存储选中要素的信息
            this.hightLighted.feature = pickedFeature;
            Cesium.Color.clone(
                pickedFeature.color,
                this.hightLighted.originalColor
            );
            // 高亮选中元素
            pickedFeature.color = Cesium.Color.YELLOW;
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)


    },

    methods: {
        setModelColor() {
            this.featureArr = [];
            this.hightLighted = {
                feature: undefined,
                originalColor: new Cesium.Color(),
            };
            this.style = {
                color: "rgba(0, 255, 216, 0.8)"
            }
            this.tileset.style = new Cesium.Cesium3DTileStyle(this.style);
        },
        resetModelColor() {
            this.featureArr = [];
            this.hightLighted = {
                feature: undefined,
                originalColor: new Cesium.Color(),
            };
            this.style = {};
            this.tileset.style = new Cesium.Cesium3DTileStyle(this.style);
        },
        setWidgetColor() {
            if (!this.featureArr.includes(this.hightLighted.feature) && this.hightLighted.feature) {
                this.featureArr.push(this.hightLighted.feature);
                this.hightLighted.feature.color = Cesium.Color.NAVY;
            }
        },
        resetWidgetColor() {
            if (Cesium.defined(this.hightLighted.feature) && this.hightLighted.feature) {
                if (this.featureArr.includes(this.hightLighted.feature)) {
                    this.featureArr = this.featureArr.filter(item => item != this.hightLighted.feature);
                    //featureArr.splice(featureArr.indexOf(hightLighted.feature), 1)
                    this.hightLighted.feature.color = this.hightLighted.originalColor
                }

            }
        }

    }
};
</script>
<style>
.control {
    position: absolute;
    z-index: 999;
    left: 10px;
    top: 10px;
}
</style>
