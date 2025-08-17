<template>
    <div>
        <div id="cesiumContainer"></div>
    </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import PrimitiveWaterFace from '../utils/geojson/PrimitiveWaterFace';
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
        this.viewer = new Cesium.Viewer("cesiumContainer")
        //this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(116.345210,39.915270, 20000),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-90),
                roll: 0
            }
        });
        let geojson = new PrimitiveWaterFace(this.viewer, {
            normalMapUrl:'images/icon/waterNormals.png',
            geojsonUrl:'http://152.136.111.30:8080/geoserver/developer_map_gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=developer_map_gis%3Axicheng&maxFeatures=500&outputFormat=application%2Fjson',
            extrudedHeight:50000,
        });
    },

    methods: {


    }
};
</script>
<style></style>
