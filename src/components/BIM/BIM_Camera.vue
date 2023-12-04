<template>
    <div>
        <div id="cesiumContainer"></div>
        <div class="control">
            <button @click="zoomIn">放大</button>
            <button @click="zoomOut">缩小</button>
            <button @click="moveLeft">左移</button>
            <button @click="moveRight">右移</button>
            <button @click="moveUp">上移</button>
            <button @click="moveDown">下移</button>
            <button @click="rotate">旋转</button>
            <button @click="rotateAnimate">绕点飞行</button>
            <button @click="reset">复位</button>
        </div>
    </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import { RotateFly } from '../utils/view/rotateFly'
export default {
    components: {},

    data() {
        return {
            viewer: null,
            tileset: null,
            camera: null,
            moveRate: null,
            rotateFly: null,

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

        this.camera = this.viewer.scene.camera;
        let position = this.camera.position;
        let ellipsoid = this.viewer.scene.globe.ellipsoid;//获取椭球
        let cartographic = ellipsoid.cartesianToCartographic(position);
        let cameraHeight = cartographic.height;
        this.moveRate = cameraHeight / 200000;

    },

    methods: {
        zoomIn() {
            //camera.zoomIn(moveRate);//方法1
            this.camera.moveForward(this.moveRate);//方法2
        },
        zoomOut() {
            this.camera.zoomOut(this.moveRate);//方法1
            //camera.moveBackward(moveRate);//方法2
        },
        moveLeft() {
            this.camera.moveLeft(this.moveRate)
        },
        moveRight() {
            this.camera.moveRight(this.moveRate)
        },
        moveUp() {
            this.camera.moveUp(this.moveRate)
        },
        moveDown() {
            this.camera.moveDown(this.moveRate)
        },
        rotate() {
            this.camera.rotate(
                Cesium.Cartesian3.fromDegrees(116.401750, 39.898700, 0),
                Cesium.Math.toRadians(30)
            )
        },
        rotateAnimate() {
            this.rotateFly = new RotateFly(this.viewer, 1, { lng: 116.401750, lat: 39.898700 });
            this.rotateFly.start();
        },
        reset() {
            this.viewer.zoomTo(
                this.tileset,
                new Cesium.HeadingPitchRange(
                    0,
                    0,
                    0,
                )
            )
            if (this.rotateFly) {
                this.rotateFly.stop()
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
