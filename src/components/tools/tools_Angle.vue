<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control">
      <button id="angel">开始</button>
      <button id="clear">清除</button>
    </div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";

import { CesiumAngleUtil } from "../utils/tools/CesiumAngleUtil";
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
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(116.83024, 40.37188, 500),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0,
      },
    });
    let angelUtil = new CesiumAngleUtil(this.viewer);
    document.getElementById("angel").onclick = function () {
      angelUtil.active();
    };
    document.getElementById("clear").onclick = function () {
      angelUtil.deactive();
    };
  },

  methods: {},
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
