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
        let url = `data/json/data_MiYun.json`;
        fetch(url)
            .then(response => response.json())
            .then(response => {
                let positionArray = [];
                let features = response.features;
                for (let i = 0; i < features[0].geometry.coordinates[0][0].length; i++) {
                    let coor = features[0].geometry.coordinates[0][0][i];
                    positionArray.push(coor[0]);
                    positionArray.push(coor[1]);
                }

                // 遮罩（PolygonHierarchy）
                //Cesium.Cartesian3.fromDegreesArray
                let polygonEntity = new Cesium.Entity({
                    polygon: {
                        hierarchy: {
                            // 添加外部区域为1/4半圆，设置为180会报错
                            positions: Cesium.Cartesian3.fromDegreesArray([0, 0, 0, 90, 179, 90, 179, 0]),
                            // 中心挖空的“洞”，只能是数组
                            holes: [{
                                positions: Cesium.Cartesian3.fromDegreesArray(positionArray)
                            }]
                        },
                        material: new Cesium.Color(15 / 255.0, 38 / 255.0, 84 / 255.0, 0.7)
                    }
                })
                // 边界线
                let lineEntity = new Cesium.Entity({
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArray(positionArray),
                        width: 5,
                        material: Cesium.Color.YELLOW,
                    }
                })
                this.viewer.entities.add(polygonEntity);
                this.viewer.entities.add(lineEntity);
                this.viewer.zoomTo(lineEntity);
            })
            .catch(error => console.log('Error:', error));


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
