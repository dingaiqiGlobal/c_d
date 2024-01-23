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
      modelMatrix: null,
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      shouldAnimate: true, //显示动画
    });
    this.viewer.scene.debugShowFramesPerSecond = true; //显示每秒的帧数和帧之间的时间。
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(116.83074, 40.3591, 500),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-10),
        roll: 0,
      },
    });

    //粒子系统的modelMatrix
    this.modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
      Cesium.Cartesian3.fromDegrees(116.83069, 40.37127)
    );

    let xMin = -100.0;
    let xMax = 100.0;
    let yMin = -80.0;
    let yMax = 100.0;
    let zMin = -50.0;
    let zMax = 50.0;

    //颜色设置
    let colorOptions = [
      {
        minimumRed: 0.75,
        green: 0.0,
        minimumBlue: 0.8,
        alpha: 1.0,
      },
      {
        red: 0.0,
        minimumGreen: 0.75,
        minimumBlue: 0.8,
        alpha: 1.0,
      },
      {
        red: 0.0,
        green: 0.0,
        minimumBlue: 0.8,
        alpha: 1.0,
      },
      {
        minimumRed: 0.75,
        minimumGreen: 0.75,
        blue: 0.0,
        alpha: 1.0,
      },
    ];
    let numberOfFireworks = 5; //烟花的数量
    for (let i = 0; i < numberOfFireworks; ++i) {
      //遍历烟花数量
      let x = Cesium.Math.randomBetween(xMin, xMax);
      let y = Cesium.Math.randomBetween(yMin, yMax);
      let z = Cesium.Math.randomBetween(zMin, zMax);
      let offset = new Cesium.Cartesian3(x, y, z);
      let color = Cesium.Color.fromRandom(colorOptions[i % colorOptions.length]); //大小、位置、颜色随机

      let bursts = [];
      for (let j = 0; j < 3; ++j) {
        bursts.push(
          new Cesium.ParticleBurst({
            //表示在系统生命周期中给定时间来自粒子系统的粒子爆发
            time: Cesium.Math.nextRandomNumber() * 10,
            minimum: 400,
            maximum: 400,
          })
        );
      }
      this.createFirework(offset, color, bursts);
    }

    /**
     * 相机操作
     */
    // let camera = this.viewer.scene.camera;
    // let cameraOffset = new Cesium.Cartesian3(-300.0, 0.0, 0.0);
    // camera.lookAtTransform(this.modelMatrix, cameraOffset);
    // camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

    // let toFireworks = Cesium.Cartesian3.subtract(
    //     new Cesium.Cartesian3(0.0, 0.0, 100.0),//发射器的初始化位置
    //     cameraOffset,
    //     new Cesium.Cartesian3()
    // );
    // Cesium.Cartesian3.normalize(toFireworks, toFireworks);
    // let angle =
    //     Cesium.Math.PI_OVER_TWO -
    //     Math.acos(
    //         Cesium.Cartesian3.dot(toFireworks, Cesium.Cartesian3.UNIT_Z)
    //     );
    // camera.lookUp(angle);
  },

  methods: {
    //设置Canvas画布
    getImage() {
      let particleCanvas; //颗粒Canvas
      if (!Cesium.defined(particleCanvas)) {
        particleCanvas = document.createElement("canvas"); //文档canvas赋值给颗粒canvas
        particleCanvas.width = 20;
        particleCanvas.height = 20;
        let context2D = particleCanvas.getContext("2d"); //上下文2d模式
        context2D.beginPath(); //要开始一个新路径了
        context2D.arc(8, 8, 8, 0, Cesium.Math.TWO_PI, true); //绘制个圆弧
        context2D.closePath(); //闭合路径
        context2D.fillStyle = "rgb(255, 255, 255)"; //填充
        context2D.fill(); //填充完毕
      }
      return particleCanvas;
    },
    //创建烟花params：偏移，颜色，炸裂
    createFirework(offset, color, bursts) {
      let position = Cesium.Cartesian3.add(
        new Cesium.Cartesian3(0.0, 0.0, 100.0),
        offset,
        new Cesium.Cartesian3()
      ); //位置
      let emitterModelMatrix = Cesium.Matrix4.fromTranslation(
        position,
        new Cesium.Matrix4()
      ); //发射器模型矩阵
      let particleToWorld = Cesium.Matrix4.multiply(
        this.modelMatrix,
        emitterModelMatrix,
        new Cesium.Matrix4()
      ); //粒子的世界坐标系
      let worldToParticle = Cesium.Matrix4.inverseTransformation(
        particleToWorld,
        particleToWorld
      ); //	矩阵求逆
      let size = Cesium.Math.randomBetween(30, 100); //size在一个范围区间内
      let particlePositionScratch = new Cesium.Cartesian3(); //粒子位置
      let force = function (particle) {
        //力量-参数是粒子
        let position = Cesium.Matrix4.multiplyByPoint(
          worldToParticle,
          particle.position,
          particlePositionScratch
        );
        if (Cesium.Cartesian3.magnitudeSquared(position) >= size * size) {
          //笛卡尔平方强度
          Cesium.Cartesian3.clone(
            //复制
            Cesium.Cartesian3.ZERO,
            particle.velocity
          );
        }
      };
      let normalSize = (size - 30) / (100 - 30); //标准大小
      let minLife = 0.3; //最小寿命
      let maxLife = 1.0; //最大寿命
      let life = normalSize * (maxLife - minLife) + minLife; //寿命
      //添加粒子系统
      this.viewer.scene.primitives.add(
        new Cesium.ParticleSystem({
          //粒子系统
          image: this.getImage(),
          startColor: color, //开始颜色
          endColor: color.withAlpha(0.0), //结束颜色
          particleLife: life, //粒子寿命
          speed: 100.0, //速度-该值覆盖minimumSpeed和maximumSpeed输入。
          imageSize: new Cesium.Cartesian2(7.0, 7.0), //颗粒像素大小,
          emissionRate: 0, //每秒要发射的粒子数
          emitter: new Cesium.SphereEmitter(0.1), //粒子发射器
          bursts: bursts, //在周期性的时间发射粒子爆发
          lifetime: 10, //寿命-粒子系统发射粒子的时间
          updateCallback: force, //回调
          modelMatrix: this.modelMatrix, //将粒子系统从模型转换为世界坐标。
          emitterModelMatrix: emitterModelMatrix, //转换粒子系统局部坐标系内的粒子系统发射器。
        })
      );
    },
  },
};
</script>
<style></style>
