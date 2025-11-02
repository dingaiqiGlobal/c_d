<!--
 * @Author: dys
 * @Date: 2025-10-28 16:41:42
 * @LastEditors: dys
 * @LastEditTime: 2025-11-02 20:13:39
 * @Descripttion: 
-->
<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="panel">
      <button @click="drawActivate('Point')">绘制点</button>
      <button @click="drawActivate('Polyline')">绘制线</button>
      <button @click="drawActivate('Polygon')">绘制面</button>
      <button @click="clearDraw">清空绘制</button>
    </div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import drawEditObj from "./drawEditObj.js";
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
      fullscreenButton: false,
      animation: true, // 是否显示动画控件
      geocoder: false, // 是否显示地名查找控件
      timeline: true, // 是否显示时间线控件
      sceneModePicker: false, // 是否显示投影方式控件
      navigationHelpButton: false, // 是否显示帮助信息控件
      infoBox: false, // 是否显示点击要素之后显示的信息
      baseLayerPicker: false, // 是否显示图层选择控件
      selectionIndicator: false, // Disable selection indicator
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

    /**
     * 气象开启
     */
    this.viewer.resolutionScale = 1.0;
    this.viewer.scene.msaaSamples = 4;
    this.viewer.postProcessStages.fxaa.enabled = true;
    this.viewer.scene.globe.depthTestAgainstTerrain = false; //深度检测

    //鼠标移动事件样式
    this.viewer.screenSpaceEventHandler.setInputAction((movement) => {
      let pickedFeature = this.viewer.scene.pick(movement.endPosition);
      if (pickedFeature) {
        this.viewer.enableCursorStyle = false;
        this.viewer._element.style.cursor = "";
        document.documentElement.style.cursor = "pointer";
      } else {
        this.viewer.enableCursorStyle = true;
        document.documentElement.style.cursor = "";
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //定位
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(116.37656, 39.90424, 2000.0),
    });
    //添加实体
    this.addEntity();

    //鼠标事件
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.hightLighted = {
      feature: undefined,
      originalColor: new Cesium.Color(),
    };
    this.saveSelectGrid = {
      feature: undefined,
      color: new Cesium.Color(),
    };
    this.handler.setInputAction((movement) => {
      let picked = this.viewer.scene.pick(movement.position);
      if (!Cesium.defined(picked)) {
        if (this.saveSelectGrid.feature) {
          this.saveSelectGrid.feature.polygon.material.color =
            this.saveSelectGrid.color;
        }
      }
      if (Cesium.defined(picked)) {
        if (picked.id && picked.id instanceof Cesium.Entity) {
          let Type = picked.id.Type;
          if (Type === undefined) return; //绘图判断
          if (Type.includes("Grid")) {
            let grid = picked.id;
            //存储选中颜色及其要素
            this.saveSelectGrid = {
              feature: grid,
              color: grid.polygon.material.color.getValue(),
            };
            //颜色
            if (Cesium.defined(this.hightLighted.feature)) {
              this.hightLighted.feature.polygon.material =
                this.hightLighted.originalColor;
              this.hightLighted.feature = undefined;
            }
            this.hightLighted.feature = grid;

            Cesium.Color.clone(
              grid.polygon.material.color.getValue(),
              this.hightLighted.originalColor
            );
            grid.polygon.material = Cesium.Color.fromCssColorString(
              "rgba(255, 255, 255, 1)"
            );
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    drawEditObj.init(this.viewer);
  },

  methods: {
    addEntity() {
      //Entity_polygon
      let Entity_polygon = this.viewer.entities.add({
        Type: "Grid",
        id: 7,
        name: "Entity_polyline",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            116.39439, 39.90416, 116.39444, 39.90313, 116.39665, 39.9032,
            116.39663, 39.90425,
          ]),
          material: Cesium.Color.RED,
        },
      });
    },
    drawActivate(type) {
      drawEditObj.drawActivate(type);
    },

    clearDraw() {
      drawEditObj.clearDraw();
    },
  },
};
</script>
<style>
.panel {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 250px;
  height: 30px;
  border: 1px solid red;
}
</style>
