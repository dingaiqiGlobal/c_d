<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control"></div>
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
      _stRotation: 0,
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer");

    let ellipseRotate = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(116.38607, 39.90315),
      id: "ellipseRotateTest",
      ellipse: {
        semiMinorAxis: 800.0,
        semiMajorAxis: 1000.0,
        material: new Cesium.Color(1.0, 1.0, 1.0, 0.5),
      },
    });
    this.viewer.trackedEntity = ellipseRotate; //trackedEntity追随是赋值
    this.rotateEntity(ellipseRotate.ellipse, 0, 1);
  },

  methods: {
    rotateEntity(instance, _rotation, _amount) {
      instance.rotation = new Cesium.CallbackProperty(() => {
        _rotation += _amount;
        if (_rotation >= 360 || _rotation <= -360) {
          this._stRotation = 0;
        }
        return Cesium.Math.toRadians(_rotation);
      }, false);
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
