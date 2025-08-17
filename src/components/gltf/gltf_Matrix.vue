<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="form">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="经度">
          <el-input v-model.number="form.lon"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model.number="form.lat"></el-input>
        </el-form-item>
        <el-form-item label="高度">
          <el-input v-model.number="form.height"></el-input>
        </el-form-item>
        <el-form-item label="缩放比例">
          <el-slider v-model.number="form.scale" :min="1" :max="50"></el-slider>
        </el-form-item>
        <el-form-item label="平移-X">
          <el-slider v-model.number="form.offsetX"></el-slider>
        </el-form-item>
        <el-form-item label="平移-Y">
          <el-slider v-model.number="form.offsetY"></el-slider>
        </el-form-item>
        <el-form-item label="平移-Z">
          <el-slider v-model.number="form.offsetZ"></el-slider>
        </el-form-item>
        <el-form-item label="航向角">
          <el-slider v-model.number="form.heading" :min="0" :max="360"></el-slider>
        </el-form-item>
        <el-form-item label="俯仰角">
          <el-slider v-model.number="form.pitch" :min="0" :max="360"></el-slider>
        </el-form-item>
        <el-form-item label="翻滚角">
          <el-slider v-model.number="form.roll" :min="0" :max="360"></el-slider>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="locatePos">定位</el-button>
        </el-form-item>
      </el-form>
    </div>
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
      model: null,
      form: {
        lon: 110,
        lat: 30,
        height: 300,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        offsetZ: 0,
        heading: 0,
        pitch: 0,
        roll: 0,
      },
    };
  },

  computed: {},
  watch: {
    form: {
      handler: function () {
        this.changePos();
      },
      immediate: false,
      deep: true,
    },
  },
  mounted() {
    this.initViewer();
    this.loadModel();
  },

  methods: {
    initViewer() {
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
      this.viewer = new Cesium.Viewer("cesiumContainer", {
        infoBox: false,
      });
    },
    // 加载模型
    loadModel() {
      let origin = Cesium.Cartesian3.fromDegrees(
        this.form.lon,
        this.form.lat,
        this.form.height
      );
      let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
      this.model = Cesium.Model.fromGltf({
        url: "data/model/Cesium_Air.glb",
        modelMatrix: modelMatrix,
      });
      this.model.readyPromise.then(function (model) {
        // Play all animations when the model is ready to render
        model.activeAnimations.addAll();
      });
      this.viewer.scene.primitives.add(this.model);
      this.locatePos();
    },
    // 改变位置
    changePos() {
      // 确定矩阵变化的原点
      let origin = Cesium.Cartesian3.fromDegrees(
        this.form.lon,
        this.form.lat,
        this.form.height
      );
      let transform = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
      // 缩放
      let scale = Cesium.Matrix4.fromScale(
        new Cesium.Cartesian3(this.form.scale, this.form.scale, this.form.scale)
      );
      Cesium.Matrix4.multiply(transform, scale, transform);//计算两个矩阵的乘积
      // 平移
      let translation = Cesium.Matrix4.fromTranslation(
        new Cesium.Cartesian3(this.form.offsetX, this.form.offsetY, this.form.offsetZ)
      );
      Cesium.Matrix4.multiply(transform, translation, transform);
      // 旋转
      let heading = Cesium.Math.toRadians(this.form.heading);
      let pitch = Cesium.Math.toRadians(this.form.pitch);
      let roll = Cesium.Math.toRadians(this.form.roll);
      let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      let matrix3 = Cesium.Matrix3.fromHeadingPitchRoll(hpr);
      let rotation = Cesium.Matrix4.fromRotationTranslation(matrix3);//四元数的几何意义：四元数可以表示一个物体的旋转
      Cesium.Matrix4.multiply(transform, rotation, transform);
      // 设置
      this.model.modelMatrix = transform;
    },
    // 定位
    locatePos() {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          this.form.lon,
          this.form.lat,
          this.form.height + 100
        ),
      });
    },
  },
};
</script>
<style>
.form {
  position: absolute;
  padding: 5px;
  top: 5px;
  right: 5px;
  background-color: rgba(225, 255, 255, 0.5);
}
</style>
