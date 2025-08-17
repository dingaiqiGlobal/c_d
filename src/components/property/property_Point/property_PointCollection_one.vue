<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import { HexagonSpread } from "../../utils/property/property_Point/HexagonSpread";
import { CircleScanMaterialProperty } from "../../utils/property/property_Point/CircleScanMaterialProperty";
import { CircleRippleMaterialProperty } from "../../utils/property/property_Point/CircleRippleMaterialProperty";
import { CircleDiffuseMaterilaProperty } from "../../utils/property/property_Point/CircleDiffuseMaterilaProperty";
import { CircleFadeMaterialProperty } from "../../utils/property/property_Point/CircleFadeMaterialProperty";
import { CircleBlurMaterialProperty } from "../../utils/property/property_Point/CircleBlurMaterialProperty";
import { CircleSpiralMaterialProperty } from "../../utils/property/property_Point/CircleSpiralMaterialProperty";
import { CircleColorfulMaterialProperty } from "../../utils/property/property_Point/CircleColorfulMaterialProperty";
import { CirclePulseMaterialProperty } from "../../utils/property/property_Point/CirclePulseMaterialProperty";
// import {  } from "../../utils/property/property_Point/";

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
      infoBox: false,
    });
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(116.832430,40.370910, 3000.0),
    });
    this.viewer.scene.debugShowFramesPerSecond = true; //显示帧率

    this.addPoint_HexagonSpread();
    this.addPoint_CallbackProperty_Rotate();
    this.addPoint_CircleScan();
    this.addPoint_CircleRipple();
    this.addPoint_CircleDiffuse();
    this.addPoint_CircleFade();
    this.addPoint_CircleBlur();
    this.addPoint_CricleSpiral();
    this.addPoint_CricleColor();
    this.addPoint_CirclePulse();
  },

  methods: {
    //多边形扩散
    addPoint_HexagonSpread() {
      const hexagonSpread = new HexagonSpread(this.viewer, "hexagonSpread_id_1");
      hexagonSpread.add([116.826, 40.374, 0], "#0099BF", 100, 9500);
    },
    //CallbackProperty
    addPoint_CallbackProperty_Rotate() {
      let image = "images/icon/circle_rotate.png";
      let circleRotate = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.829, 40.374),
        id: "旋转圆CallbackProperty",
        ellipse: {
          semiMinorAxis: 100.0,
          semiMajorAxis: 100.0,
          material: new Cesium.ImageMaterialProperty({
            image: image,
          }),
        },
      });
      this.rotateMaterial(circleRotate.ellipse, 0, 1);
    },
    rotateMaterial(instance, _stRotation, _amount) {
      instance.stRotation = new Cesium.CallbackProperty(function () {
        _stRotation += _amount;
        if (_stRotation >= 360 || _stRotation <= -360) {
          _stRotation = 0;
        }
        return Cesium.Math.toRadians(_stRotation);
      }, false);
    },
    //扫描圆
    addPoint_CircleScan() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.832, 40.374),
        name: "扫描圆",
        ellipse: {
          semiMajorAxis: 100.0,
          semiMinorAxis: 100.0,
          material: new Cesium.CircleScanMaterialProperty({
            color: new Cesium.Color(1.0, 1.0, 0.0, 0.7),
            speed: 20.0,
          }),
        },
      });
    },
    //波纹圆
    addPoint_CircleRipple() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.835, 40.374),
        name: "波纹圆",
        ellipse: {
          semiMinorAxis: 100.0,
          semiMajorAxis: 100.0,
          material: new Cesium.CircleRippleMaterialProperty({
            color: new Cesium.Color(1, 1, 0, 0.7),
            speed: 12.0,
            count: 4,
            gradient: 0.2,
          }),
        },
      });
    },
    //红色扩散圆
    addPoint_CircleDiffuse() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.838, 40.374),
        name: "扩散圆",
        ellipse: {
          semiMinorAxis: 100.0,
          semiMajorAxis: 100.0,
          material: new Cesium.CircleDiffuseMaterialProperty({
            color: new Cesium.Color(1, 0.2, 0, 0.7),
            speed: 12.0,
          }),
        },
      });
    },
    //消隐圆
    addPoint_CircleFade() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.826, 40.371),
        name: "消隐圆",
        ellipse: {
          semiMinorAxis: 100.0,
          semiMajorAxis: 100.0,
          material: new Cesium.CircleFadeMaterialProperty({
            color: new Cesium.Color(1, 0.3, 0, 0.2),
            speed: 12.0,
          }),
        },
      });
    },
    //模糊圆
    addPoint_CircleBlur() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.829, 40.371),
        name: "模糊圆",
        ellipse: {
          semiMinorAxis: 100.0,
          semiMajorAxis: 100.0,
          material: new Cesium.CircleBlurMaterialProperty({
            color: new Cesium.Color(1, 1, 0, 0.7),
            speed: 12.0,
          }),
        },
      });
    },
    //螺旋圆
    addPoint_CricleSpiral() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.832, 40.371),
        name: "螺旋圆",
        ellipse: {
          semiMinorAxis: 100.0,
          semiMajorAxis: 100.0,
          material: new Cesium.CircleSpiralMaterialProperty({
            color: new Cesium.Color(0.6, 1, 0, 0.7),
            speed: 12.0,
          }),
        },
      });
    },
    //多彩圆
    addPoint_CricleColor() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.835, 40.371),
        name: "多彩圆",
        ellipse: {
          semiMinorAxis: 100.0,
          semiMajorAxis: 100.0,
          material: new Cesium.CircleColorfulMaterialProperty({
            color: new Cesium.Color(0.6, 1, 0, 0.7),
            speed: 12.0,
          }),
        },
      });
    },
    //脉冲圆
    addPoint_CirclePulse() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.838, 40.371),
        name: "脉冲圆",
        ellipse: {
          semiMinorAxis: 100.0,
          semiMajorAxis: 100.0,
          material: new Cesium.CirclePulseMaterialProperty({
            color: new Cesium.Color(0.4, 1, 0, 0.7),
            speed: 50.0,
          }),
        },
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
