<template>
  <div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import GridPrimitive from "./GridPrimitive";
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
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      // scene3DOnly:true,
      homeButton: false, // 是否显示home控件
      vrButton: false,
      fullscreenButton: true,
      animation: true, // 是否显示动画控件
      geocoder: false, // 是否显示地名查找控件
      timeline: true, // 是否显示时间线控件
      sceneModePicker: false, // 是否显示投影方式控件
      navigationHelpButton: false, // 是否显示帮助信息控件
      infoBox: false, // 是否显示点击要素之后显示的信息
      baseLayerPicker: false, // 是否显示图层选择控件
      selectionIndicator: true, // Disable selection indicator
      shouldAnimate: true,
      // requestRenderMode: true
    });
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    this.viewer.animation.container.style.visibility = "hidden"; // 不显示动画控件
    this.viewer.timeline.container.style.visibility = "hidden"; // 不显示时间控件
    this.viewer.scene.globe.depthTestAgainstTerrain = false; // 关闭地形深度测试，地形将不再遮挡任何对象

    // 隐藏地球
    // this.viewer.scene.skyBox.show = false;
    // this.viewer.scene.backgroundColor = Cesium.Color.WHITE;
    // this.viewer.scene.sun.show = false;
    // this.viewer.scene.moon.show = false;
    // this.viewer.scene.globe.show = false;
    // this.viewer.scene.skyAtmosphere.show = false;

    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(114.25653, 22.59111, 5000),
    });
    this.addGrid();
  },

  methods: {
    addGrid() {
      let origin = Cesium.Cartesian3.fromDegrees(114.25653, 22.59111, 0);
      let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
      let primitive = new GridPrimitive(modelMatrix);
      this.viewer.scene.primitives.add(primitive);
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
