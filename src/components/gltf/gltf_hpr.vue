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
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      shouldAnimate: true, //动画
    });
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(116.83074, 40.3591, 500),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-10),
        roll: 0,
      },
    });
    //this.viewer.scene.globe.depthTestAgainstTerrain = true;//开启深度检

    /**
     * 1.使用Tranforms类的headingPitchRollToFixedFrame方法设置模型的变化矩阵modelMatrix
     * 将姿态和位置变化后的模型转换到WGS84椭球的位置上
     * 2.键盘事件
     * ↑	抬头
     * ↓	低头
     * ←	左转
     * →	右转
     * 0	顺时针转
     * .	逆时针转
     * +	加速
     * -	减速
     * 3.监听scene的preUpdate事件，当事件发生时，更新模型的姿态和位置
     */

    let headingPitchRoll = new Cesium.HeadingPitchRoll();
    let position = new Cesium.Cartesian3.fromDegrees(116.83034, 40.37088, 10);
    //局部坐标系变换（？？？）
    //生成一个函数，该函数计算从给定原点为中心的参考系到给定椭球体的固定参考系的4x4变换矩阵
    let fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator(
      "north",
      "west"
    );
    let deltaRadians = Cesium.Math.toRadians(5.0); //每次操作姿态变化为5度

    let airplaneModel = this.viewer.scene.primitives.add(
      Cesium.Model.fromGltf({
        url: "data/model/Cesium_Air.glb",
        scale: 10.0,
        //重要
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
          position,
          headingPitchRoll,
          Cesium.Ellipsoid.WGS84,
          fixedFrameTransform
        ),
        minimumPixelSize: 256,
      })
    );

    // 添加键盘监听事件
    document.addEventListener("keydown", function (e) {
      switch (e.keyCode) {
        // 抬头
        case 38:
          headingPitchRoll.pitch += deltaRadians;
          // 判断是否超过2π范围
          if (headingPitchRoll.pitch > Cesium.Math.TWO_PI) {
            headingPitchRoll.pitch -= Cesium.Math.TWO_PI;
          }
          console.log("抬头：pitch+");
          break;

        // 低头
        case 40:
          headingPitchRoll.pitch -= deltaRadians;
          if (headingPitchRoll.pitch < -Cesium.Math.TWO_PI) {
            headingPitchRoll.pitch += Cesium.Math.TWO_PI;
          }
          console.log("低头：pitch-");

          break;

        // 左转
        case 37:
          headingPitchRoll.heading -= deltaRadians;
          // 判断是否超过2π范围
          if (headingPitchRoll.heading < -Cesium.Math.TWO_PI) {
            headingPitchRoll.heading += Cesium.Math.TWO_PI;
          }
          console.log("左转：heading+");
          break;

        // 右转
        case 39:
          headingPitchRoll.heading += deltaRadians;
          // 判断是否超过2π范围
          if (headingPitchRoll.heading > Cesium.Math.TWO_PI) {
            headingPitchRoll.heading -= Cesium.Math.TWO_PI;
          }
          console.log("右转：heading-");
          break;

        // 顺时针
        case 96:
          headingPitchRoll.roll += deltaRadians;
          // 判断是否超过2π范围
          if (headingPitchRoll.roll > Cesium.Math.TWO_PI) {
            headingPitchRoll.roll -= Cesium.Math.TWO_PI;
          }
          console.log("顺时针翻滚：roll+");
          break;

        // 逆时针
        case 110:
          headingPitchRoll.roll -= deltaRadians;
          // 判断是否超过2π范围
          if (headingPitchRoll.roll < -Cesium.Math.TWO_PI) {
            headingPitchRoll.roll += Cesium.Math.TWO_PI;
          }
          console.log("逆时针翻滚：roll-");
          break;

        // 加速
        case 107:
          speed += 10;
          speed = Math.min(speed, 10000);
          console.log("加速:" + speed);
          break;
        // 减速
        case 109:
          speed -= 10;
          speed = Math.max(speed, 100);
          console.log("减速:" + speed);
          break;

        default:
          break;
      }
    });

    //飞行路径
    let speed = 50; //速度
    let speedVector = new Cesium.Cartesian3(); //速度向量
    const pathPosition = new Cesium.SampledPositionProperty();
    const entityPath = this.viewer.entities.add({
      position: pathPosition,
      name: "飞行路径",
      path: {
        show: true,
        leadTime: 0,
        trailTime: 60,
        width: 20,
        resolution: 1,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.3,
          taperPower: 0.3,
          color: Cesium.Color.PALEGOLDENROD,
        }),
      },
    });

    //渲染更新前阶段添加监听
    this.viewer.scene.preUpdate.addEventListener(() => {
      //（？？？）
      //将所提供的笛卡尔分量与所提供的标量相乘
      //Cesium.Cartesian3.multiplyByScalar(cartesian, scalar, result) → Cartesian3
      speedVector = Cesium.Cartesian3.multiplyByScalar(
        Cesium.Cartesian3.UNIT_X, //要缩放的笛卡尔坐标分量（X轴）
        speed / 10, //标量
        speedVector //结果Cartesian3
      );

      //变换后的位置
      //计算矩阵和笛卡尔矩阵的乘积（矩阵与向量的乘积）
      //Cesium.Matrix4.multiplyByPoint(matrix, cartesian, result) → Cartesian3
      position = Cesium.Matrix4.multiplyByPoint(
        airplaneModel.modelMatrix,
        speedVector,
        position
      );

      // 将点添加到路径中
      //addSample(time, position, derivatives)
      pathPosition.addSample(Cesium.JulianDate.now(), position);

      // 更新模型姿态与位置
      //从一个参考系计算一个4x4变换矩阵，
      //其轴从给定原点为中心的头 - 俯仰 - 滚转角计算到给定椭球体的固定参考系。
      //Cesium.Transforms.headingPitchRollToFixedFrame(origin, headingPitchRoll, ellipsoid, fixedFrameTransform, result) → Matrix4
      Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        headingPitchRoll,
        Cesium.Ellipsoid.WGS84,
        fixedFrameTransform,
        airplaneModel.modelMatrix //赋值给飞机
      );
    });
  },

  methods: {},
};
</script>
<style></style>
