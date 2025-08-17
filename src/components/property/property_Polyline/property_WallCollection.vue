<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";

import "../../utils/property/property_Polyline/property_Wall_Dynamic";
import "../../utils/property/property_Polyline/property_Wall_Trail";
import "../../utils/property/property_Polyline/property_Wall_Diffuse";
import { WallRegularDiffuse } from "../../utils/property/property_Polyline/property_Wall_Zoom";
import * as turf from "@turf/turf";

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
      destination: Cesium.Cartesian3.fromDegrees(116.82474, 40.37346, 900),
    });
    this.viewer.scene.debugShowFramesPerSecond = true; //显示帧率
    this.addWall_Dynamic();
    this.addWall_Trail();
    this.addWall_Diffuse();
    this.addWall_Zoom();
    this.addWall_Turf();
    this.addWall_ImageMaterialProperty();
  },

  methods: {
    addWall_Dynamic() {
      fetch("data/json/line/line_1.json")
        .then((res) => res.json())
        .then((data) => {
          let trailWallPositions = [];
          for (let i = 0; i < data.features[0].geometry.coordinates.length; i++) {
            let positionsArr = data.features[0].geometry.coordinates[i];
            for (let j = 0; j < positionsArr.length; j++) {
              trailWallPositions.push(positionsArr[j]);
            }
          }
          this.viewer.entities.add({
            name: "立体墙",
            wall: {
              positions: Cesium.Cartesian3.fromDegreesArray(trailWallPositions),
              maximumHeights: new Array(trailWallPositions.length / 2).fill(50),
              minimumHeights: new Array(trailWallPositions.length / 2).fill(0),
              material: new Cesium.DynamicWallMaterialProperty({
                color: Cesium.Color.fromBytes(255, 96, 56).withAlpha(0.7),
                duration: 3000,
              }),
            },
          });
        });
    },
    addWall_Trail() {
      fetch("data/json/line/line_2.json")
        .then((res) => res.json())
        .then((data) => {
          let trailWallPositions = [];
          for (let i = 0; i < data.features[0].geometry.coordinates.length; i++) {
            let positionsArr = data.features[0].geometry.coordinates[i];
            for (let j = 0; j < positionsArr.length; j++) {
              trailWallPositions.push(positionsArr[j]);
            }
          }
          this.viewer.entities.add({
            name: "流动墙",
            wall: {
              positions: Cesium.Cartesian3.fromDegreesArray(trailWallPositions),
              // 设置高度
              maximumHeights: new Array(trailWallPositions.length / 2).fill(50), //[120,120,120,120]
              minimunHeights: new Array(trailWallPositions.length / 2).fill(0),
              material: new Cesium.TrailLineMaterialProperty({
                color: Cesium.Color.RED,
                duration: 18000,
              }),
            },
          });
        });
    },
    addWall_Diffuse() {
      fetch("data/json/line/line_3.json")
        .then((res) => res.json())
        .then((data) => {
          /**
           *entity方式加载
           */
          let trailWallPositions = [];
          for (let i = 0; i < data.features[0].geometry.coordinates.length; i++) {
            let positionsArr = data.features[0].geometry.coordinates[i];
            for (let j = 0; j < positionsArr.length; j++) {
              trailWallPositions.push(positionsArr[j]);
            }
          }
          this.viewer.entities.add({
            name: "渐变泛光",
            wall: {
              positions: Cesium.Cartesian3.fromDegreesArray(trailWallPositions),
              // 设置高度
              maximumHeights: new Array(trailWallPositions.length / 2).fill(50), //[120,120,120,120]
              minimunHeights: new Array(trailWallPositions.length / 2).fill(0),
              material: new Cesium.WallDiffuseMaterialProperty({
                color: Cesium.Color.RED,
              }),
            },
          });
        });
    },
    addWall_Zoom() {
      WallRegularDiffuse({
        viewer: this.viewer,
        center: [116.82415, 40.3709],
        radius: 100.0,
        edge: 7,
        height: 100.0,
        speed: 25.0,
        minRadius: 50,
      });
    },
    //CallbackProperty
    addWall_Turf() {
      //数据结构
      //   let Positions = [
      //     [
      //       [116.82485986100005, 40.37383587000005],
      //       [116.82623994800008, 40.37383587000005],
      //       [116.82623994800008, 40.37318625008054],
      //       [116.82623994800008, 40.37255096100006],
      //       [116.82485986100005, 40.37255096100006],
      //       [116.82485986100005, 40.37383587000005],
      //     ],
      //   ];
      fetch("data/json/line/line_4.json")
        .then((res) => res.json())
        .then((data) => {
          let Positions = [];
          let WallPositions = [];
          for (let i = 0; i < data.features[0].geometry.coordinates.length; i++) {
            let positionsArr = data.features[0].geometry.coordinates[i];
            WallPositions.push(positionsArr);
          }
          Positions.push(WallPositions);
          this.wallDiffuse(Positions, 1.2, 50.0, new Cesium.Color(1.0, 1.0, 0.0, 0.7));
        });
    },
    wallDiffuse(_positions, _scale, _height, _material) {
      let scale = 1;
      this.viewer.entities.add({
        name: "扩散墙",
        wall: {
          positions: new Cesium.CallbackProperty(() => {
            // 判断是放大还是缩小
            if (_scale >= 1) {
              scale += _scale / 100.0;
              if (scale >= _scale) {
                scale = 1.0;
              }
            } else {
              scale -= _scale / 100.0;
              if (scale <= _scale) {
                scale = 1;
              }
            }

            let polygon = turf.polygon(_positions);
            let scaledPolygon = turf.transformScale(polygon, scale);
            let newPositions = [];
            // 遍历多边形
            for (let i = 0; i < scaledPolygon.geometry.coordinates[0].length; i++) {
              // 遍历节点
              scaledPolygon.geometry.coordinates[0][i].forEach((item) => {
                newPositions.push(item);
              });
              newPositions.push(_height);
            }
            return Cesium.Cartesian3.fromDegreesArrayHeights(newPositions);
          }, false),
          material: _material,
        },
      });
    },

    addWall_ImageMaterialProperty() {
      fetch("data/json/line/line_6.json")
        .then((res) => res.json())
        .then((data) => {
          /**
           *entity方式加载
           */
          let WallPositions = [];
          for (let i = 0; i < data.features[0].geometry.coordinates.length; i++) {
            let positionsArr = data.features[0].geometry.coordinates[i];
            for (let j = 0; j < positionsArr.length; j++) {
              WallPositions.push(positionsArr[j]);
            }
          }
          this.viewer.entities.add({
            name: "颜色渐变",
            wall: {
              positions: Cesium.Cartesian3.fromDegreesArray(WallPositions),
              maximumHeights: new Array(WallPositions.length / 2).fill(50),
              minimunHeights: new Array(WallPositions.length / 2).fill(0),
              material: new Cesium.ImageMaterialProperty({
                image: this.getColorRamp([0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0], true),
                transparent: true,
              }),
            },
          });
        });
    },
    getColorRamp(elevationRamp) {
      var ramp = document.createElement("canvas");
      ramp.width = 1;
      ramp.height = 20;
      var ctx = ramp.getContext("2d");
      var values = elevationRamp;
      var grd = ctx.createLinearGradient(0, 0, 0, 20);
      grd.addColorStop(values[0], "#000000"); //black
      grd.addColorStop(values[1], "#2747E0"); //blue
      grd.addColorStop(values[2], "#D33B7D"); //pink
      grd.addColorStop(values[3], "#D33038"); //red
      grd.addColorStop(values[4], "#FF9742"); //orange
      //grd.addColorStop(values[5], '#ffd700'); //yellow
      grd.addColorStop(values[5], "transparent"); //透明度设置
      grd.addColorStop(values[6], "#ffffff"); //white

      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, 1, 20);
      return ramp;
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
