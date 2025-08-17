<template>
  <div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";

//所以需要在全局挂载 Cesium，若想写在一个文件内，
//还不能用 import，会提升，所以要用require
//然后只需要把 Demo 中的 baiduMapLayer 换成 cesiumMapLayer，第一个参数换成 viewer 即可。
//其他deom同理

window.Cesium = Cesium;
const mapv = require("../utils/thirdParty/mapv/mapv");
window.mapv = mapv;
const cesiumMapLayer = require("../utils/thirdParty/mapv/MapVLayer");

export default {
  components: {},

  data() {
    return {
      viewer: null,
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer");
    //this.viewer.scene.globe.depthTestAgainstTerrain = true;//开启深度检查
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(116.82518, 40.5078, 500000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0,
      },
    });

    fetch("data/json/park.json")
      .then((response) => response.json())
      .then((response) => {
        const { features } = response;
        let data = [];
        if (features.length > 0) {
          data = features.map((item) => {
            return {
              geometry: {
                type: "Point",
                coordinates: [item.geometry.coordinates[0], item.geometry.coordinates[1]],
              },
              count: 30 * Math.random(),
            };
          });
        }

        let dataSet = new mapv.DataSet(data);
        let options = {
          fillStyle: "rgba(55, 50, 250, 0.8)",
          shadowColor: "rgba(255, 250, 50, 1)",
          shadowBlur: 20,
          max: 100,
          size: 50,
          label: {
            show: true,
            fillStyle: "white",
            shadowColor: 'yellow',
            font: '10px Arial',
            shadowBlur: 10,
          },
          globalAlpha: 0.5,
          gradient: {
            0.25: "rgb(0,0,255)",
            0.55: "rgb(0,255,0)",
            0.85: "yellow",
            1.0: "rgb(255,0,0)",
          },
          draw: "honeycomb",
        };
        //特别注意
        let mapvLayer = new cesiumMapLayer.default(this.viewer, dataSet, options);
      });
  },

  methods: {},
};
</script>
<style></style>
