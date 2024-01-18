<template>
  <div>
    <div id="cesiumContainer"></div>
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
      cesiumHeatMap: null,
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer");
    this.viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度检查
    let terrainProvider = Cesium.createWorldTerrain({
      requestWaterMask: true, // 请求水体效果所需要的海岸线数据
      requestVertexNormals: true, // 请求地形照明数据
    });
    this.viewer.terrainProvider = terrainProvider;
    this.viewer.scene.globe.depthTestAgainstTerrain = true; //地形遮挡效果开关，打开后地形会遮挡看不到的区域
    this.viewer.scene.globe.enableLighting = true; //对大气和雾启用动态照明效果

    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(116.82518, 40.5078, 20000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0,
      },
    });

    /**
     * 首先要开启地形，这里使用cesium自带的地形数据
     * cesium的material类自带了等高线的材质ElevationContour
     */
    let globe = this.viewer.scene.globe;
    let contourUniforms = {};
    // 使用等高线材质
    let material = Cesium.Material.fromType("ElevationContour");
    contourUniforms = material.uniforms;
    contourUniforms.width = 2.0; // 线宽2.0px
    contourUniforms.spacing = 150; // 高度间隔为150米
    contourUniforms.color = Cesium.Color.RED;
    globe.material = material; // 设置材质
  },

  methods: {},
};
</script>
<style></style>
