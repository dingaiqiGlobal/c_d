<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import { LineFlowMaterialProperty } from '../../utils/property/property_Polyline/property_FlyLine'
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
      destination: Cesium.Cartesian3.fromDegrees(113.9236839, 22.08061, 50000.0),
      orientation: {
        heading: Cesium.Math.toRadians(0), // east, default value is 0.0 (north)
        pitch: Cesium.Math.toRadians(-45), // default value (looking down)
        roll: 0, // default value
      },
    });
    // 抛物飞线效果
    this.parabolaFlowInit(this.viewer, 3);
  },

  methods: {
    parabolaFlowInit(_viewer, _num) {
      let _center = [113.9236839, 22.528061];
      let _positions = [
        [113.8236839, 22.528061],
        [114.0236839, 22.528061],
        [113.9236839, 22.428061],
        [113.9236839, 22.628061],
        [113.8236839, 22.428061],
        [114.0236839, 22.628061],
        [113.8236839, 22.628061],
        [114.0236839, 22.428061],
      ];
      _positions.forEach((item) => {
        let _siglePositions = this.parabola(_center, item, 5000);
        // 创建飞线
        for (let i = 0; i < _num; i++) {
          _viewer.entities.add({
            polyline: {
              positions: _siglePositions,
              material: new LineFlowMaterialProperty({
                color: Cesium.Color.fromCssColorString('#07e4f2').withAlpha(0.9),
                speed: 15 * Math.random(),
                percent: 0.1,
                gradient: 0.01,
              }),
            },
          });
        }
        // 创建轨迹线
        _viewer.entities.add({
          polyline: {
            positions: _siglePositions,
            material: new Cesium.Color(1.0, 1.0, 0.0, 0.2),
          },
        });
      });
    },
    parabola(startPosition, endPosition, height = 0, count = 50) {
      //方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
      let result = [];
      height = Math.max(+height, 100);
      count = Math.max(+count, 50);
      let diffLon = Math.abs(startPosition[0] - endPosition[0]);
      let diffLat = Math.abs(startPosition[1] - endPosition[1]);
      let L = Math.max(diffLon, diffLat);
      let dlt = L / count;
      if (diffLon > diffLat) {
        //base on lon
        let delLat = (endPosition[1] - startPosition[1]) / count;
        if (startPosition[0] - endPosition[0] > 0) {
          dlt = -dlt;
        }
        for (let i = 0; i < count; i++) {
          let h =
            height -
            (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height) / Math.pow(L, 2);
          let lon = startPosition[0] + dlt * i;
          let lat = startPosition[1] + delLat * i;
          let point = new Cesium.Cartesian3.fromDegrees(lon, lat, h);
          result.push(point);
        }
      } else {
        //base on lat
        let delLon = (endPosition[0] - startPosition[0]) / count;
        if (startPosition[1] - endPosition[1] > 0) {
          dlt = -dlt;
        }
        for (let i = 0; i < count; i++) {
          let h =
            height -
            (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height) / Math.pow(L, 2);
          let lon = startPosition[0] + delLon * i;
          let lat = startPosition[1] + dlt * i;
          let point = new Cesium.Cartesian3.fromDegrees(lon, lat, h);
          result.push(point);
        }
      }
      return result;
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
