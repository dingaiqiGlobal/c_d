<template>
    <div>
        <div id="cesiumContainer"></div>
        <div class="control">
            <button id="measureDistance">测距</button>
            <button id="measureArea">测面积</button>
            <button id="clearAll">清除</button>
        </div>
    </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import Measure from '../utils/tools/Measure/Measure'
export default {
    components: {},

    data() {
        return {
            viewer: null,
        };
    },

    computed: {},

    mounted() {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
        this.viewer = new Cesium.Viewer("cesiumContainer", {
            infobox: false,
            selectionIndicator: false,
        })
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(116.830240, 40.371880, 500),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-90),
                roll: 0
            }
        });
        //测量
        Measure.init(this.viewer)
        document.getElementById('measureDistance').onclick = function () {
            Measure.measureActivate('spatialDistance')
        }
        document.getElementById('measureArea').onclick = function () {
            Measure.measureActivate('spatialArea')
        }
        document.getElementById('clearAll').onclick = function () {
            Measure.measureClear()
        }

    },

    methods: {


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
