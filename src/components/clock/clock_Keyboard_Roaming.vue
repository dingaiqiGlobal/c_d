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
      flag: {
        moveUp: false,
        moveDown: false,
        moveLeft: false,
        moveRight: false,
      },
      speed: 0.4, //速度
      speedVector: new Cesium.Cartesian3(), //速度矢量
      radian: Cesium.Math.toRadians(2.0), //弧度
      hpr: new Cesium.HeadingPitchRoll(), //hpr
      position: Cesium.Cartesian3.fromDegrees(116.40152901123024,39.89882783727751,0), //位置
      run: false, //模型动画
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      infoBox: false,
      shouldAnimate: true,//必须为true
      timeline: false,
      animation: false,
    });
    this.tileset = this.viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: "data/3dtiles/bim/tileset.json",
      })
    );
    this.tileset.readyPromise.then((tileset) => {
      this.viewer.zoomTo(
        tileset,
        new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 4.0)
      );
    });
    this.addModel();
    this.viewer.scene.preRender.addEventListener(this.renderListener);
  },

  methods: {
    addModel() {
      let manModel = this.viewer.entities.add({
        position: new Cesium.CallbackProperty(this.getPos, false), //位置
        orientation: new Cesium.CallbackProperty(this.getOri, false), //方向
        model: {
          uri: "/data/model/Man.glb",
          // runAnimations: true,
          scale: 0.5,
          minimumPixelSize: 32,
          runAnimations: new Cesium.CallbackProperty(this.getRun, false),
        },
      });
      this.viewer.trackedEntity = manModel;

      /**
       * 键盘按下
       */
      document.addEventListener("keydown", (e) => {
        this.setFlagStatus(e, true);
        if (e.which === 40 || e.which === 39 || e.which === 38 || e.which === 37) {
          if (!this.run) {
            this.run = true;
          }
        }
      });

      document.addEventListener("keyup", (e) => {
        this.setFlagStatus(e, false);
        if (e.which === 40 || e.which === 39 || e.which === 38 || e.which === 37) {
          if (
            this.flag.moveUp ||
            this.flag.moveDown ||
            this.flag.moveLeft ||
            this.flag.moveRight
          ) {
            return;
          } else {
            this.run = false;
          }
        }
      });
      let count = 0;
      this.viewer.clock.onTick.addEventListener((clock) => {
        if (this.flag.moveUp) {
          if (this.flag.moveLeft) {
            this.hpr.heading -= this.radian;
            count += 2;
          }
          if (this.flag.moveRight) {
            this.hpr.heading += this.radian;
            count -= 2;
          }
          this.moveModel(1);
        } else if (this.flag.moveDown) {
          if (this.flag.moveLeft) {
            this.hpr.heading -= this.radian;
            count += 2;
          }
          if (this.flag.moveRight) {
            this.hpr.heading += this.radian;
            count -= 2;
          }
          this.moveModel(-1);
        } else {
          if (this.flag.moveLeft) {
            this.hpr.heading -= this.radian;
            count += 2;
            this.moveModel(0);
          }
          if (this.flag.moveRight) {
            this.hpr.heading += this.radian;
            count -= 2;
            this.moveModel(0);
          }
        }
      });
    },
    setFlagStatus(key, value) {
      switch (key.keyCode) {
        case 37:
          // 左
          this.flag.moveLeft = value;
          break;
        case 38:
          // 上
          this.flag.moveUp = value;
          break;
        case 39:
          // 右
          this.flag.moveRight = value;
          break;
        case 40:
          this.flag.moveDown = value;
          // 下
          break;
      }
    },
    moveModel(isUP) {
      // 计算速度矩阵
      if (isUP > 0) {
        this.speedVector = Cesium.Cartesian3.multiplyByScalar(
          Cesium.Cartesian3.UNIT_X,
          this.speed,
          this.speedVector
        );
      } else if (isUP < 0) {
        this.speedVector = Cesium.Cartesian3.multiplyByScalar(
          Cesium.Cartesian3.UNIT_X,
          -this.speed,
          this.speedVector
        );
      } else {
        this.speedVector = Cesium.Cartesian3.multiplyByScalar(
          Cesium.Cartesian3.UNIT_X,
          0,
          this.speedVector
        );
      }
      // 根据速度计算出下一个位置的坐标
      let fixedFrameTransforms = Cesium.Transforms.localFrameToFixedFrameGenerator(
        "east",
        "north"
      );
      let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        this.position,
        this.hpr,
        Cesium.Ellipsoid.WGS84,
        fixedFrameTransforms
      );
      this.position = Cesium.Matrix4.multiplyByPoint(
        modelMatrix,
        this.speedVector,
        this.position
      );
    },
    getPos() {
      return this.position;
    },
    getOri() {
      return Cesium.Transforms.headingPitchRollQuaternion(this.position, this.hpr);
    },
    getRun() {
      return this.run;
    },
    renderListener(e) {
      if (this.viewer.trackedEntity) {
        //console.log(e);//e为场景：实施更新
        let ModelMatrix = this.getModelMatrix(
          this.viewer.trackedEntity,
          this.viewer.clock.currentTime,
          new Cesium.Matrix4()
        );
        let transformX = 4; //距离运动点的距离（后方）
        let transformZ = 0.8; //距离运动点的高度（上方）
        let transformY = 0; //距离运动点的高度（侧方）
        this.viewer.camera.lookAtTransform(
          ModelMatrix,
          new Cesium.Cartesian3(-transformX, transformY, transformZ)
        );
      }
    },
    getModelMatrix(entity, time, result) {
      /**
       * 计算当前时间点飞机模型的位置矩阵
       */
      //计算位置(getValueOrUndefined隐藏方法)
      let position = Cesium.Property.getValueOrUndefined(
        entity.position,
        time,
        new Cesium.Cartesian3()
      );
      if (!Cesium.defined(position)) {
        return undefined;
      }
      //计算朝向
      let orientation = Cesium.Property.getValueOrUndefined(
        entity.orientation,
        time,
        new Cesium.Quaternion()
      );
      if (!Cesium.defined(orientation)) {
        result = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, result);
      } else {
        result = Cesium.Matrix4.fromRotationTranslation(
          Cesium.Matrix3.fromQuaternion(orientation, new Cesium.Matrix3()),
          position,
          result
        );
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
