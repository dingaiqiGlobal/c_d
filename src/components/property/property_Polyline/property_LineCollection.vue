<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";

import PolylineArrowMaterialProperty from "../../utils/property/property_Polyline/PolylineArrowMaterial";
import PolylineEnergyTransMaterialProperty from "../../utils/property/property_Polyline/PolylineEnergyTransMaterial";
import PolylineLightingMaterialProperty from "../../utils/property/property_Polyline/PolylineLightingMaterial";
import PolylineLinkPulseMaterialProperty from "../../utils/property/property_Polyline/PolylineLinkPulseMaterial";
import PolylineMigrateMaterialProperty from "../../utils/property/property_Polyline/PolylineMigrateMaterial";
import PolylineSpriteMaterialProperty from "../../utils/property/property_Polyline/PolylineSpriteMaterial";
import PolylineSuperMaterialProperty from "../../utils/property/property_Polyline/PolylineSuperMaterial";
import PolylineTrailMaterialProperty from "../../utils/property/property_Polyline/PolylineTrailMaterial";
import PolylineTrialFlowMaterialProperty from "../../utils/property/property_Polyline/PolylineTrialFlowMaterial";
import PolylineVolumeTrialMaterialProperty from "../../utils/property/property_Polyline/PolylineVolumeTrialMaterial";

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
      destination: Cesium.Cartesian3.fromDegrees(116.82474, 40.37346, 1500),
    });
    this.viewer.scene.debugShowFramesPerSecond = true; //显示帧率

    this.add_PolylineArrowMaterial();
    this.add_PolylineEnergyTransMaterial();
    this.add_PolylineLightingMaterial();
    this.add_PolylineLinkPulseMaterial();
    this.add_PolylineMigrateMaterial();
    this.add_PolylineSpriteMaterial();
    this.add_PolylineSuperMaterial();
    this.add_PolylineTrailMaterial();
    this.add_PolylineTrialFlowMaterial();
    this.add_PolylineVolumeTrialMaterial();
  },

  methods: {
    add_PolylineArrowMaterial() {
      fetch("data/json/line/line_1.json")
        .then((res) => res.json())
        .then((data) => {
          let LinePositions = [];
          for (let i = 0; i < data.features[0].geometry.coordinates.length; i++) {
            let positionsArr = data.features[0].geometry.coordinates[i];
            for (let j = 0; j < positionsArr.length; j++) {
              LinePositions.push(positionsArr[j]);
            }
          }
          this.viewer.entities.add({
            name: "动态箭头线",
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArray(LinePositions),
              width: 12,
              material: new PolylineArrowMaterialProperty({
                color: Cesium.Color.AQUA,
                duration: 800,
                count: 3,
              }),
            },
          });
        });
    },
    add_PolylineEnergyTransMaterial() {
      fetch("data/json/line/line_2.json")
        .then((res) => res.json())
        .then((data) => {
          let LinePositions = [];
          for (let i = 0; i < data.features[0].geometry.coordinates.length; i++) {
            let positionsArr = data.features[0].geometry.coordinates[i];
            for (let j = 0; j < positionsArr.length; j++) {
              LinePositions.push(positionsArr[j]);
            }
          }
          this.viewer.entities.add({
            name: "动态传输线",
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArray(LinePositions),
              width: 12,
              material: new PolylineEnergyTransMaterialProperty({
                color: Cesium.Color.RED,
                duration: 2000,
                count: 3,
              }),
            },
          });
        });
    },
    add_PolylineLightingMaterial() {
      fetch("data/json/line/line_3.json")
        .then((res) => res.json())
        .then((data) => {
          let LinePositions = [];
          for (let i = 0; i < data.features[0].geometry.coordinates.length; i++) {
            let positionsArr = data.features[0].geometry.coordinates[i];
            for (let j = 0; j < positionsArr.length; j++) {
              LinePositions.push(positionsArr[j]);
            }
          }
          this.viewer.entities.add({
            name: "发光线",
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArray(LinePositions),
              width: 12,
              material: new PolylineLightingMaterialProperty(Cesium.Color.AQUA),
            },
          });
        });
    },
    add_PolylineLinkPulseMaterial() {
      fetch("data/json/line/line_4.json")
        .then((res) => res.json())
        .then((data) => {
          let LinePositions = [];
          for (let i = 0; i < data.features[0].geometry.coordinates.length; i++) {
            let positionsArr = data.features[0].geometry.coordinates[i];
            for (let j = 0; j < positionsArr.length; j++) {
              LinePositions.push(positionsArr[j]);
            }
          }
          this.viewer.entities.add({
            name: "脉冲线",
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArray(LinePositions),
              width: 12,
              material: new PolylineLinkPulseMaterialProperty({
                color: Cesium.Color.RED,
                duration: 5000,
              }),
            },
          });
        });
    },
    add_PolylineMigrateMaterial() {
      fetch("data/json/line/line_5.json")
        .then((res) => res.json())
        .then((data) => {
          let LinePositions = [];
          for (let i = 0; i < data.features[0].geometry.coordinates.length; i++) {
            let positionsArr = data.features[0].geometry.coordinates[i];
            for (let j = 0; j < positionsArr.length; j++) {
              LinePositions.push(positionsArr[j]);
            }
          }
          this.viewer.entities.add({
            name: "迁徙线",
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArray(LinePositions),
              width: 1,
              material: new PolylineMigrateMaterialProperty({
                color: new Cesium.Color(1, 0.79, 0.15, 1),
                duration: 2000,
              }),
            },
          });
        });
    },
    add_PolylineSpriteMaterial() {
      fetch("data/json/line/line_6.json")
        .then((res) => res.json())
        .then((data) => {
          let LinePositions = [];
          for (let i = 0; i < data.features[0].geometry.coordinates.length; i++) {
            let positionsArr = data.features[0].geometry.coordinates[i];
            for (let j = 0; j < positionsArr.length; j++) {
              LinePositions.push(positionsArr[j]);
            }
          }
          this.viewer.entities.add({
            name: "精灵线",
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArray(LinePositions),
              width: 2,
              material: new PolylineSpriteMaterialProperty({ duration: 2000 }),
            },
          });
        });
    },
    add_PolylineSuperMaterial() {
      this.viewer.entities.add({
        name: "超级线",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            116.82693,
            40.37506,
            116.83177,
            40.37506,
          ]),
          width: 5,
          material: new PolylineSuperMaterialProperty({
            color: Cesium.Color.RED,
            duration: 500,
          }),
        },
      });
    },
    add_PolylineTrailMaterial() {
      this.viewer.entities.add({
        name: "尾迹线",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            116.82693,
            40.37406,
            116.83177,
            40.37406,
          ]),
          width: 3,
          material: new PolylineTrailMaterialProperty({
            speed: 5 * Math.random(),
            color: Cesium.Color.CYAN,
            percent: 0.5,
            gradient: 0.01,
          }),
        },
      });
    },
    add_PolylineTrialFlowMaterial() {
      this.viewer.entities.add({
        name: "尾迹流动线",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            116.82693,
            40.37306,
            116.83177,
            40.37306,
          ]),
          width: 3,
          material: new PolylineTrialFlowMaterialProperty({
            speed: 6 * Math.random(),
            color: Cesium.Color.CYAN,
            percent: 0.1,
            gradient: 0.1,
          }),
        },
      });
    },
    add_PolylineVolumeTrialMaterial() {
      this.viewer.entities.add({
        name: "流动管线",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            116.82693,
            40.37206,
            116.83177,
            40.37206,
          ]),
          width: 3,
          material: new PolylineVolumeTrialMaterialProperty({
            color: Cesium.Color.RED,
            duration: 5000,
            count: 5,
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
