<template>
  <div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>

import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import "../../utils/property/property_Polyline/property_FlowLine";
export default {
  components: {},

  data() {
    return {};
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZWQ4OGUyMS0zMzQ4LTQ1ZjAtOTcyMC1kZjE3NWZjMzkzMzMiLCJpZCI6MTI5ODUsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjIyODk1NTN9.5BF7xVHVIo2AcorTcH3cIs8hT2ZEbhwPe_uVeWYInF0";
    //初始化三维场景
    let viewer = new Cesium.Viewer("cesiumContainer");
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(116.217240,39.958680, 8000),
    });
    viewer.cesiumWidget.creditContainer.style.display = "none"; // 去除logo
    // window.viewer = viewer;//全局注册viewer

    Cesium.GeoJsonDataSource.load("data/json/road.json")
      .then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        let entities = dataSource.entities.values;
        let materialObj = {
          高速路: new Cesium.Spriteline1MaterialProperty(
            3000,
            "images/icon/flowLine_red.png"
          ),
          快速路: new Cesium.Spriteline1MaterialProperty(
            3000,
            "images/icon/flowLine_red.png"
          ),
          省道: new Cesium.Spriteline1MaterialProperty(
            3000,
            "images/icon/flowLine_orange.png"
          ),
          县道: new Cesium.Spriteline1MaterialProperty(
            3000,
            "images/icon/flowLine_blue.png"
          ),
          乡村道路: new Cesium.Spriteline1MaterialProperty(
            3000,
            "images/icon/flowLine_blue.png"
          ),
          其他路: new Cesium.Spriteline1MaterialProperty(
            3000,
            "images/icon/flowLine_green.png"
          ),
        };
        for (let i = 0; i < entities.length; i++) {
          let entity = entities[i];
          let name = entity.name;
          console.log(name);
          let material = materialObj[name];
          if (!material) {
            materialObj[name] = new Cesium.Spriteline1MaterialProperty(
              3000,
              "images/icon/flowLine_green.png"
            );
          }
          entity.polyline.width = 10;
          entity.polyline.material = material;
        }
      })
  },

  methods: {},
};
</script>
<style lang="less" scoped></style>
