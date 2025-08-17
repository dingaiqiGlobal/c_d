<template>
    <div>
        <div id="cesiumContainer"></div>
        <div class="control">
            <button @click="isZoom(false)">禁用缩放(zoom)导航操作</button>
            <button @click="isRotate(false)">禁用平移(translate)、旋转(rotate)导航操作</button>
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


    },

    methods: {
        //如果为false，则只能通过平移或旋转来改变摄像机的观看方向。此标志仅适用于3D和Columbus视图模式
        //scene.screenSpaceCameraController.enableLook = false;
        // 如果为ture，则允许用户旋转相机。此标志仅适用于2D和3D。
        //scene.screenSpaceCameraController.enableRotate = false;
        // 如果为ture，则允许用户平移地图。此标志仅适用于2D和Columbus视图模式。
        //scene.screenSpaceCameraController.enableTranslate = false;
        // 如果为ture，允许用户放大和缩小。
        //scene.screenSpaceCameraController.enableZoom = false;
        // 如果为ture，则允许用户倾斜相机。这个标志只适用于3D和哥伦布视图。
        // scene.screenSpaceCameraController.enableTilt = false;

        isZoom(disable) {
            this.viewer.scene.screenSpaceCameraController.enableZoom = disable;//禁止缩放
        },
        isRotate(disable) {
            this.viewer.scene.screenSpaceCameraController.enableRotate = disable;//禁止旋转
            this.viewer.scene.screenSpaceCameraController.enableTilt = disable;
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
