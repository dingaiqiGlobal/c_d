<template>
  <div>
    <div class="playbox">
      <button @click="start">播放</button>
      <button @click="stop">停止</button>
    </div>
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
      entityModle: null,
      trackLine: [
        [116.40113804712058, 39.89872477006594, 0],
        [116.40127108918759, 39.898728022963574, 0],
        [116.40128011513528, 39.89878027453858, 0],
        [116.40147303920422, 39.89877586198455, 0],
        [116.40142387037469, 39.898695269438505, 0],
        [116.40161439002969, 39.89869146627381, 0],
        [116.40168321828108, 39.89869590949241, 0],
      ],
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url:
          "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/",
      }),
      shouldAnimate: true,
      timeline: true,
      animation: false,
    });
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
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
    // const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    // handler.setInputAction((movement) => {
    //   //添加弹框
    //   let position = this.viewer.scene.pickPosition(movement.position);
    //   let cartographic = Cesium.Cartographic.fromCartesian(position);
    //   let lon = Cesium.Math.toDegrees(cartographic.longitude);
    //   let lat = Cesium.Math.toDegrees(cartographic.latitude);
    //   let height = cartographic.height;
    //   console.log(lon, lat, height);
    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    /*scene中的render 方法，每一帧都被会调用，用于场景的重绘
        此处的preRender在render方法之前执行，也是每一帧被调用
        由于每一帧调用renderListener方法时
        获取在场景更新后和立即呈现场景之前将引发的事件。
        事件的订阅者接收Scene实例作为第一个参数，接收当前时间作为第二个参数。
        this.renderListener为事件不加()
        */
    this.viewer.scene.preRender.addEventListener(this.renderListener);
  },

  methods: {
    trackView(pos) {
      let start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
      //Cesium.JulianDate.addSeconds(julianDate, seconds, result)
      //将所提供的秒数添加到所提供的日期实例。
      let stop = Cesium.JulianDate.addSeconds(
        start,
        pos.length - 1, //秒数
        new Cesium.JulianDate()
      );
      this.viewer.clock.startTime = start.clone(); //时钟开启时间（复制）
      this.viewer.clock.stopTime = stop.clone(); //结束时间
      this.viewer.clock.currentTime = start.clone(); //当前时间
      this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //确定当到达clock #startTime或clock #stopTime时时钟应该如何表现(在结尾中循环)
      this.viewer.clock.multiplier = 0.7; //倍数
      this.viewer.timeline.zoomTo(start, stop); //将timeline设置为提供的时间

      //计算环形飞行
      function computeCirclularFlight() {
        let property = new Cesium.SampledPositionProperty();
        //设置插入选项
        property.setInterpolationOptions({
          interpolationDegree: 2, //插值度
          interpolationAlgorithm: Cesium.HermitePolynomialApproximation, //插值算法
        });

        //为每个位置添加property
        for (let i = 0; i < pos.length; i++) {
          let time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
          let position = Cesium.Cartesian3.fromDegrees(pos[i][0], pos[i][1], 5);
          //addSamples(times, positions, derivatives)
          //添加一个新示例。
          property.addSample(time, position);
        }
        return property;
      }

      let position = computeCirclularFlight(); //返回property类型
      this.entityModle = this.viewer.entities.add({
        name: "trackModle",
        position: position,
        //根据位置移动自动计算方向
        //方向：根据所提供的PositionProperty的速度计算为四元数旋转。
        //new Cesium.VelocityOrientationProperty(position, ellipsoid)
        orientation: new Cesium.VelocityOrientationProperty(position),
        //时间间隔：将实体可用性设置为与仿真时间相同的间隔
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: start,
            stop: stop,
          }),
        ]),
        model: {
          uri: "/data/model/Man.glb",
          scale: 0.5,
          minimumPixelSize: 32,
        },
        path: {
          resolution: 1, //该属性指定在采样位置时要步进的最大秒数
          material: new Cesium.PolylineGlowMaterialProperty({
            //获取或设置指定用于绘制路径的材料的属性
            glowPower: 0.1,
            color: Cesium.Color.YELLOW,
          }),
          width: 16,
        },
      });
      this.viewer.trackedEntity = this.entityModle; //追随模型
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
    renderListener(e) {
      if (this.viewer.trackedEntity) {
        //console.log(e);//e为场景：实施更新
        let ModelMatrix = this.getModelMatrix(
          this.viewer.trackedEntity,
          this.viewer.clock.currentTime,
          new Cesium.Matrix4()
        );
        let transformX = 4; //距离运动点的距离（后方）
        let transformZ = 0.4; //距离运动点的高度（上方）
        let transformY = 0; //距离运动点的高度（侧方）
        this.viewer.camera.lookAtTransform(
          ModelMatrix,
          new Cesium.Cartesian3(-transformX, transformY, transformZ)
        );
      }
    },
    start() {
      if (this.entityModle) {
        this.viewer.entities.remove(this.entityModle);
      }
      this.viewer.clock.shouldAnimate = true;
      this.trackView(this.trackLine);
    },
    stop() {
      this.viewer.trackedEntity = undefined;
      this.viewer.clock.shouldAnimate = false;
      if (this.entityModle) {
        this.viewer.entities.remove(this.entityModle);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.playbox {
  position: absolute;
  top: 30px;
  left: 49%;
  z-index: 99;
  display: flex;
  justify-content: space-around;
}
</style>
