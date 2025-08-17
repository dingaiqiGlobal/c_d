<template>
    <div>
        <div id="cesiumContainer"></div>
        <div class="coordinateContent"></div>
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


            //坐标打印
            let cartesian2 = movement.position;
            let cartesian3 = this.viewer.scene.pickPosition(cartesian2);
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            lat = lat.toFixed(5)
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            lng = lng.toFixed(5)
            let height = cartographic.height;
            height = height.toFixed(5)

            let html = `
                        <span>屏幕坐标：${cartesian2}</span>
                        <br />
                        <span>经纬度：${lng},${lat}</span>
                        <br />
                        <span>高度：${height}</span>
                    `
            document.querySelector(".coordinateContent").innerHTML = html;
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)


    },

    methods: {}
};
</script>
<style>
.coordinateContent {
    background-color: #fff;
    position: absolute;
    top: 1px;
    left: 1px;
    height: 50px;
    width: 200px;
    background-color: #fff;
    z-index: 2;
    font-size: 10px;
}
</style>
