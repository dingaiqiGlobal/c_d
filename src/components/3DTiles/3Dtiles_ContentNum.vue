<template>
    <div>
        <div id="cesiumContainer"></div>
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
        };
    },

    computed: {},

    mounted() {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
        this.viewer = new Cesium.Viewer("cesiumContainer")
        //this.viewer.scene.globe.depthTestAgainstTerrain = true;//开启深度检查
        this.tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: 'data/3dtiles/BuildingBlue/tileset.json',
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
        //获取全部要素
        // this.tileset.tileLoad.addEventListener(function (tile) {
        //     let content = tile.content;
        //     let featuresLength = content.featuresLength;
        //     console.log("要素数量为：");
        //     console.log(featuresLength);
        //     console.log("第一个要素为：");
        //     let feature = content.getFeature(0);
        //     console.log(feature);
        // })

        /**
         * 当前可视范围内3D tiles的feature数量
         * 原本是想通过Cesium3DTileFeature的位置信息与当前可视范围进行判断来确定，
         * 但是发现其并不存储位置坐标信息，
         * 所以需要在前置的数据处理过程中，
         * 将要素中心点坐标写入属性表中再切片成3D Tiles。
         */
        let content = undefined;
        // 设置瓦片加载完成监听事件
        this.tileset.tileLoad.addEventListener(function (tile) {
            content = tile.content;
        })
        // 监听相机移动事件
        this.viewer.camera.moveEnd.addEventListener(() => {
            try {
                // 计算当前可视范围矩形
                let viewRectangle = this.viewer.camera.computeViewRectangle();
                // 遍历所有要素
                let featuresLength = content.featuresLength;
                let count = 0;
                for (let i = 0; i < featuresLength; i++) {
                    let feature = content.getFeature(i);
                    let lon = feature.getProperty('lon');
                    let lat = feature.getProperty('lat');
                    let centerCartographic = new Cesium.Cartographic(Cesium.Math.toRadians(Number(lon)), Cesium.Math.toRadians(Number(lat)));
                    // 通过Rectangle类的contains方法判断当前点（弧度坐标）是否在矩形范围内
                    if (Cesium.Rectangle.contains(viewRectangle, centerCartographic)) {
                        count++;
                    }
                }
                // 输出
                console.log("当前可视范围内的要素数量为:");
                console.log(count);
            } catch {
                console.log("无法获取");
            }
        })

    },

    methods: {


    }
};
</script>
<style></style>
