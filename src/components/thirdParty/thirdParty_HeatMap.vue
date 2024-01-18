<template>
  <div>
    <div class="control">
      <button @click="onClear">清除</button>
    </div>

    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import { CesiumHeatmap } from "../utils/thirdParty/heatMap/CesiumHeatMap";
export default {
  components: {},

  data() {
    return {
      viewer: null,
      cesiumHeatMap: null,
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer");
    //this.viewer.scene.globe.depthTestAgainstTerrain = true;//开启深度检查
    fetch("data/json/park.json")
      .then((response) => response.json())
      .then((response) => {
        const { features } = response;
        let heatData = [];
        if (features.length > 0) {
          heatData = features.map((item) => {
            return {
              x: item.geometry.coordinates[0],
              y: item.geometry.coordinates[1],
              value: item.properties.num,
            };
          });
        }
        this.cesiumHeatMap = new CesiumHeatmap(this.viewer, {
          zoomToLayer: true,
          points: heatData,
          //heatmapDataOptions: { max: 1, min: 0 },
          heatmapOptions: {
            radius: 10, //热力图半径
            maxOpacity: 0.9, //透明度
            minOpacity: 0.1, //透明度
          },
        });
      });
  },

  methods: {
    onClear() {
      if (this.cesiumHeatMap) {
        this.cesiumHeatMap.remove();
      }
    },
  },
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
