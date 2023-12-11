<template>
  <div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
/**
 * 注意1：
 * tile由两处地方可以设置，
 * 一个是Cesium3DTileset.modelMatrix，
 * 一个是Cesium3DTileset.root.transform，
 * 实际应用的时候这两个矩阵会相乘。
 *
 * 注意2：
 * 模型的原点不一定是boundingSphere.center
 * 所以初始的this.tileset._root.transform与m = Cesium.Transforms.eastNorthUpToFixedFrame(surface) 不一样
 * 
 * 注意3：
 * tileset.modelMatrix只能实现平移矩阵，不能实现旋转缩放（方法暂时没找到）
 * 
 */
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
export default {
  components: {},

  data() {
    return {
      viewer: null,
      tileset: null,
      params: {
        lon: 116.83029,
        lat: 40.37153,
        height: 60,
        scale: 2,
        rx: 45,
        ry: 0,
        rz: 0,
      },
    };
  },

  computed: {},
  watch: {
    params: {
      handler: function () {
        this.changePosition();
      },
      immediate: false,
      deep: true,
    },
  },
  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      shadows: true, // 开启阴影
    });
    this.viewer.scene.globe.depthTestAgainstTerrain = true; // 开启深度检测
    this.add3dTiles();
  },

  methods: {
    // 加载模型
    add3dTiles() {
      this.tileset = this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: "data/3dtiles/BuildingBlue/tileset.json",
        })
      );
      this.tileset.readyPromise
        .then((tileset) => {
          this.viewer.zoomTo(
            tileset,
            new Cesium.HeadingPitchRange(-45, -0.5, tileset.boundingSphere.radius * 4.0)
          );
        })
        .then(() => {
          /**
           * 平移
           */
          const carographic = Cesium.Cartographic.fromCartesian(
            this.tileset.boundingSphere.center
          );
          const surface = Cesium.Cartesian3.fromRadians(
            carographic.longitude,
            carographic.latitude,
            0.0
          );
          const offset = Cesium.Cartesian3.fromDegrees(
            this.params.lon,
            this.params.lat,
            this.params.height
          );
          // 两个笛卡尔式分量差
          const translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
          );
          this.tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

          /**
           * 旋转(实现不了)
           */
          // let rotation = new Cesium.Matrix3();
          // rotation = Cesium.Matrix3.multiply(
          //   rotation,
          //   Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(this.params.rx)),
          //   new Cesium.Matrix3()
          // );
          // rotation = Cesium.Matrix3.multiply(
          //   rotation,
          //   Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(this.params.ry)),
          //   new Cesium.Matrix3()
          // );
          // rotation = Cesium.Matrix3.multiply(
          //   rotation,
          //   Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(this.params.rz)),
          //   new Cesium.Matrix3()
          // );
          //this.tileset.modelMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);

          /**
           * 缩放（实现不了）
           */
          // this.tileset.modelMatrix = Cesium.Matrix4.fromScale(
          //   new Cesium.Cartesian3(this.params.scale, this.params.scale, this.params.scale)
          // );

          /**
           * 定位
           */
          this.locatePos();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changePosition() {},

    // 定位
    locatePos() {
      this.viewer.zoomTo(
        this.tileset,
        new Cesium.HeadingPitchRange(-45, -0.5, this.tileset.boundingSphere.radius * 4.0)
      );
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
