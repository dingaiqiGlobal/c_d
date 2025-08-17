<template>
    <div>
        <div id="cesiumContainer"></div>
        <div class="control">
        </div>
    </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import { LineFlickerMaterialProperty } from '../../utils/property/property_Polyline/property_FlickerLine'
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
            infoBox: false
        })

        // 道路闪烁线
        Cesium.GeoJsonDataSource.load("data/json/flowLine.json").then((dataSource) => {
            this.viewer.dataSources.add(dataSource);
            const entities = dataSource.entities.values;
            this.viewer.zoomTo(entities);
            for (let i = 0; i < entities.length; i++) {
                let entity = entities[i];
                entity.polyline.width = 3.0;
                // 设置材质
                entity.polyline.material = new LineFlickerMaterialProperty({
                    color: Cesium.Color.fromCssColorString('#08e3f7'),
                    // 设置随机变化速度
                    speed: 50 * Math.random(),
                })
            }
        });


    },

    methods: {}
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
