<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";

import { CircleWave } from "../../utils/property/property_Point/CircleWaveMaterialProperty";
import { Scanline } from "../../utils/property/property_Point/Scanline";
import { RadarScanMaterialProperty } from "../../utils/property/property_Point/RadarScanMaterialProperty";
import { RadarLineMaterialProperty } from "../../utils/property/property_Point/RadarLineMaterialProperty";
import { RadarWaveMaterialProperty } from "../../utils/property/property_Point/RadarWaveMaterialProperty";
import { RadarSolidScan } from "../../utils/property/property_Point/RadarSolidScan";
import { EllipsoidElectricMaterialProperty } from "../../utils/property/property_Point/EllipsoidElectricMaterialProperty";
import { EllipsoidTrailMaterialProperty } from "../../utils/property/property_Point/EllipsoidTrailMaterialProperty";
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
      destination: Cesium.Cartesian3.fromDegrees(116.83243, 40.37091, 3000.0),
    });
    this.viewer.scene.debugShowFramesPerSecond = true; //显示帧率

    this.addPoint_CircleWave();
    this.addPoint_Scanline();
    this.addPoint_RadarScan();
    this.addPoint_RadarLine();
    this.addPoint_RadarWave();
    this.addPoint_ImageMaterialProperty();
    this.addPoint_RadarSolidScan();
    this.addPoint_EllipsoidTrail();
    this.addPoint_EllipsoidElectric();
  },

  /**
   * 116.826, 40.374
   * 116.829, 40.374
   * 116.832, 40.374
   * 116.835, 40.374
   * 116.838, 40.374
   *
   * 116.826, 40.371
   * 116.829, 40.371
   * 116.832, 40.371
   * 116.835, 40.371
   * 116.838, 40.371
   */
  methods: {
    //波纹圆
    addPoint_CircleWave() {
      let circleWave = new CircleWave(this.viewer, "cirCleWave1");
      circleWave.add([116.826, 40.374, 0], "#1FA8E3", 100, 3000);
    },
    //线圈发光
    addPoint_Scanline() {
      let scanLine = new Scanline(this.viewer, "scanLine");
      scanLine.add([116.829, 40.374, 0], "#CE1374", 100, 15);
    },
    //雷达半透明扫描
    addPoint_RadarScan() {
      let rader = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.832, 40.374),
        name: "雷达半透明扫描",
        ellipse: {
          semiMajorAxis: 100.0,
          semiMinorAxis: 100.0,
          material: new Cesium.RadarScanMaterialProperty({
            color: new Cesium.Color(0.3, 0.5, 0.3, 0.7),
            speed: 20.0,
          }),
          height: 20.0,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          outline: true,
          outlineColor: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
        },
      });
    },
    //雷达线
    addPoint_RadarLine() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.835, 40.374),
        name: "雷达线",
        ellipse: {
          semiMajorAxis: 100.0,
          semiMinorAxis: 100.0,
          material: new Cesium.RadarLineMaterialProperty({
            color: new Cesium.Color(1.0, 1.0, 0.0, 0.7),
            speed: 20.0,
          }),
        },
      });
    },
    //雷达波纹
    addPoint_RadarWave() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.838, 40.374),
        name: "波纹雷达",
        ellipse: {
          semiMajorAxis: 100.0,
          semiMinorAxis: 100.0,
          material: new Cesium.RadarWaveMaterialProperty({
            color: new Cesium.Color(1.0, 1.0, 0.0, 0.7),
            speed: 20.0,
          }),
        },
      });
    },
    //雷达图片旋转
    addPoint_ImageMaterialProperty() {
      let rader = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.826, 40.371),
        name: "图片雷达",
        ellipse: {
          semiMajorAxis: 100,
          semiMinorAxis: 100,
          material: new Cesium.ImageMaterialProperty({
            image: "images/icon/radar.png",
            color: new Cesium.Color(1.0, 1.0, 0.0, 0.7),
          }),
          // 不设置高度则无法渲染外框线
          height: 20.0,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          outline: true,
          outlineColor: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
        },
      });
      this.rotateMaterial(rader.ellipse, 0, -3);
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

    //固体雷达
    addPoint_RadarSolidScan() {
      new RadarSolidScan({
        viewer: this.viewer,
        id: "id_1",
        shortwaveRange: 100.0,
        position: [116.829, 40.371],
      });
    },

    //轨迹球体
    addPoint_EllipsoidTrail() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.832, 40.371),
        name: "轨迹球体",
        ellipsoid: {
          radii: new Cesium.Cartesian3(100.0, 100.0, 100.0),
          material: new Cesium.EllipsoidTrailMaterialProperty({
            color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
            speed: 10.0,
          }),
        },
      });
    },

    //电弧球体
    addPoint_EllipsoidElectric() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.835, 40.371),
        name: "电弧球体",
        ellipsoid: {
          radii: new Cesium.Cartesian3(100.0, 100.0, 100.0),
          material: new Cesium.EllipsoidElectricMaterialProperty({
            color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
            speed: 10.0,
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
