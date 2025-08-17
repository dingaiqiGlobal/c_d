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
    this.createModel("data/model/Cesium_Man.glb");
  },

  methods: {
    /**
     * ModelAnimationCollection
     * ModelAnimation
     * ModelAnimationLoop
     */
    createModel(url, height, heading, pitch, roll) {
      height = Cesium.defaultValue(height, 0.0); //defaultValue如果未定义，则返回第一个参数，否则返回第二个参数
      heading = Cesium.defaultValue(heading, 0.0);
      pitch = Cesium.defaultValue(pitch, 0.0);
      roll = Cesium.defaultValue(roll, 0.0);
      let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      let origin = Cesium.Cartesian3.fromDegrees(116.82857, 40.35351, height);
      let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin, hpr);

      this.viewer.scene.primitives.removeAll();
      let model = this.viewer.scene.primitives.add(
        Cesium.Model.fromGltf({
          url: url,
          modelMatrix: modelMatrix,
          minimumPixelSize: 128,
        })
      );

      model.readyPromise.then((model) => {
        //以半速播放和循环所有动画
        model.activeAnimations.addAll({
          //ModelAnimationCollection的方法
          multiplier: 5, //乘数
          loop: Cesium.ModelAnimationLoop.REPEAT, //循环播放动画
        });
        let camera = this.viewer.camera;
        // Zoom to model
        let controller = this.viewer.scene.screenSpaceCameraController; //获取用于摄像机输入处理的控制器
        let r = 2.0 * Math.max(model.boundingSphere.radius, camera.frustum.near); //模型在其局部坐标系中的边界球半径//
        controller.minimumZoomDistance = r * 0.5; //变焦时相机位置的最大大小
        //Cesium.Matrix4.multiplyByPoint (matrix, cartesian, result) 计算矩阵与 Cartesian3 的乘积
        let center = Cesium.Matrix4.multiplyByPoint(
          model.modelMatrix,
          model.boundingSphere.center, //重心
          new Cesium.Cartesian3()
        );
        let heading = Cesium.Math.toRadians(230.0);
        let pitch = Cesium.Math.toRadians(-20.0);
        camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, r * 2.0));
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
