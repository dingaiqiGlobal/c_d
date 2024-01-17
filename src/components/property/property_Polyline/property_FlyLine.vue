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
import { LineFlowMaterialProperty } from '../../utils/property/property_Polyline/property_FlyLine'
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

        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(116.387440, 39.812280, 12000.0),
            orientation: {
                heading: Cesium.Math.toRadians(0), // east, default value is 0.0 (north)
                pitch: Cesium.Math.toRadians(-45),    // default value (looking down)
                roll: 0                             // default value
            }
        });

        this.lineFlowInit(this.viewer, [116.394310, 39.914740], 120)
    },

    methods: {
        generateRandomPosition(position, num) {
            let list = []
            for (let i = 0; i < num; i++) {
                // random产生的随机数范围是0-1，需要加上正负模拟
                let lon = position[0] + Math.random() * 0.04 * (i % 2 == 0 ? 1 : -1);
                let lat = position[1] + Math.random() * 0.04 * (i % 2 == 0 ? 1 : -1);
                list.push([lon, lat])
            }
            return list
        },
        lineFlowInit(_viewer, _center, _num) {
            let _positions = this.generateRandomPosition(_center, _num);
            _positions.forEach(item => {
                // 经纬度
                let start_lon = item[0];
                let start_lat = item[1];
                let startPoint = new Cesium.Cartesian3.fromDegrees(start_lon, start_lat, 0);
                // 随机高度
                let height = 5000 * Math.random();
                let endPoint = new Cesium.Cartesian3.fromDegrees(start_lon, start_lat, height);
                let linePositions = [];
                linePositions.push(startPoint);
                linePositions.push(endPoint);
                _viewer.entities.add({
                    polyline: {
                        positions: linePositions,
                        material: new LineFlowMaterialProperty({
                            color: new Cesium.Color(1.0, 1.0, 0.0, 0.8),
                            speed: 15 * Math.random(),
                            percent: 0.1,
                            gradient: 0.01
                        })
                    }
                })
            })
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
