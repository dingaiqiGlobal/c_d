<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import EchartsLayer from "../utils/thirdParty/echarts/EchartsLayer";
//版本为echars4.8.0
//cnpm i echarts@4.8.0 --save
export default {
  components: {},

  data() {
    return {
      viewer: null,
      tileset: null,
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

    // 隐藏地球
    // this.viewer.scene.skyBox.show = false;
    // this.viewer.scene.backgroundColor = Cesium.Color.WHITE;
    // this.viewer.scene.sun.show = false;
    // this.viewer.scene.moon.show = false;
    // this.viewer.scene.globe.show = false;
    // this.viewer.scene.skyAtmosphere.show = false;

    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(116.82518, 40.5078, 5000000),
    });
    this.renderEcharts(this.viewer);
  },

  methods: {
    renderEcharts(viewer) {
      // 渲染 echarts（这里的 animation 和 GLMap 参数是必备的）
      var echartsLayer = new EchartsLayer(viewer, {
        animation: false,
        GLMap: {},
        series: [
          {
            type: "lines",
            coordinateSystem: "GLMap",
            zlevel: 2,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.1,
              symbol: "arrow",
              symbolSize: 5,
            },
            lineStyle: {
              normal: { color: "#60ff44", width: 1, opacity: 0.4, curveness: 0.2 },
            },
            data: [
              {
                fromName: "北京",
                toName: "无锡",
                coords: [
                  [116.4551, 40.2539],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "上海",
                toName: "无锡",
                coords: [
                  [121.4648, 31.2891],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "广州",
                toName: "无锡",
                coords: [
                  [113.5107, 23.2196],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "大连",
                toName: "无锡",
                coords: [
                  [122.2229, 39.4409],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "青岛",
                toName: "无锡",
                coords: [
                  [120.4651, 36.3373],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "石家庄",
                toName: "无锡",
                coords: [
                  [114.4995, 38.1006],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "南昌",
                toName: "无锡",
                coords: [
                  [116.0046, 28.6633],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "合肥",
                toName: "无锡",
                coords: [
                  [117.29, 32.0581],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "呼和浩特",
                toName: "无锡",
                coords: [
                  [111.4124, 40.4901],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "宿州",
                toName: "无锡",
                coords: [
                  [117.5535, 33.7775],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "曲阜",
                toName: "无锡",
                coords: [
                  [117.323, 35.8926],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "杭州",
                toName: "无锡",
                coords: [
                  [119.5313, 29.8773],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "武汉",
                toName: "无锡",
                coords: [
                  [114.3896, 30.6628],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "深圳",
                toName: "无锡",
                coords: [
                  [114.5435, 22.5439],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "珠海",
                toName: "无锡",
                coords: [
                  [113.7305, 22.1155],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "福州",
                toName: "无锡",
                coords: [
                  [119.4543, 25.9222],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "西安",
                toName: "无锡",
                coords: [
                  [109.1162, 34.2004],
                  [120.3442, 31.5527],
                ],
              },
              {
                fromName: "赣州",
                toName: "无锡",
                coords: [
                  [116.0046, 25.6633],
                  [120.3442, 31.5527],
                ],
              },
            ],
          },
          {
            type: "effectScatter",
            coordinateSystem: "GLMap",
            zlevel: 2,
            rippleEffect: { brushType: "stroke" },
            label: { normal: { show: true, position: "right", formatter: "{b}" } },
            itemStyle: { normal: { color: "#60ff44" } },
            data: [
              { name: "北京", value: [116.4551, 40.2539, 100] },
              { name: "上海", value: [121.4648, 31.2891, 30] },
              { name: "广州", value: [113.5107, 23.2196, 20] },
              { name: "大连", value: [122.2229, 39.4409, 10] },
              { name: "青岛", value: [120.4651, 36.3373, 20] },
              { name: "石家庄", value: [114.4995, 38.1006, 20] },
              { name: "南昌", value: [116.0046, 28.6633, 10] },
              { name: "合肥", value: [117.29, 32.0581, 30] },
              { name: "呼和浩特", value: [111.4124, 40.4901, 10] },
              { name: "宿州", value: [117.5535, 33.7775, 10] },
              { name: "曲阜", value: [117.323, 35.8926, 10] },
              { name: "杭州", value: [119.5313, 29.8773, 10] },
              { name: "武汉", value: [114.3896, 30.6628, 10] },
              { name: "深圳", value: [114.5435, 22.5439, 10] },
              { name: "珠海", value: [113.7305, 22.1155, 10] },
              { name: "福州", value: [119.4543, 25.9222, 20] },
              { name: "西安", value: [109.1162, 34.2004, 60] },
              { name: "赣州", value: [116.0046, 25.6633, 10] },
            ],
          },
        ],
      });

      // 单击单击事件集成了
      echartsLayer._chart.on("click", (params) => {
        console.log(params, "点击事件");
      });
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
