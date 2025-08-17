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
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer");
    //this.viewer.scene.globe.depthTestAgainstTerrain = true;//开启深度检

    /**
     * 方法1：
     * 官方示例中需要弃用timeline和animate来确定不同时刻模型的位置，进而实现动画。
     * 但是本人在开发中，禁用了timeline控件，所以就不能动态设置时刻及其位置。
     * 因此在这里采用回调函数CallbackProperty来动态更新模型的位置
     *
     * 方法2：
     * 使用Cartesian3的lerp方法：传送门
     * 计算起点与终点之间一定比例的线性插值坐标
     * Cesium.Cartesian3.lerp(start, end, t, result) → Cartesian3
     */
    let startPosition = new Cesium.Cartesian3.fromDegrees(116.8287, 40.37646);
    let endPosition = new Cesium.Cartesian3.fromDegrees(116.82806, 40.36723);
    let factor = 0;

    //模型方向旋转
    let position = Cesium.Cartesian3.fromDegrees(116.8287, 40.37646, 10);
    let heading = Cesium.Math.toRadians(90);
    let pitch = Cesium.Math.toRadians(0);
    let roll = Cesium.Math.toRadians(0);
    let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    let orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

    // 添加模型
    const vehicleEntity = this.viewer.entities.add({
      position: new Cesium.CallbackProperty(function () {
        if (factor > 5000) {
          factor = 0;
        }
        factor++;
        // 动态更新位置
        return Cesium.Cartesian3.lerp(
          startPosition,
          endPosition,
          factor / 5000.0,
          new Cesium.Cartesian3()
        );
      }, false),
      orientation: orientation, //方向
      model: {
        uri: "data/model/CesiumDrone.glb",
        scale: 10.0,
      },
    });
    this.viewer.trackedEntity = vehicleEntity;
  },

  methods: {},
};
</script>
<style></style>
