<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control">
      <el-select
        v-model="selectData.name"
        placeholder="Add billboard"
        @change="handleChange"
      >
        <el-option
          v-for="item in selectData"
          :key="item.value"
          :label="item.name"
          :value="item.name"
        >
        </el-option>
      </el-select>
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
      selectData: [
        {
          value: 1,
          name: "Add billboard",
        },
        {
          value: 2,
          name: "Set billboard properties at creation",
        },
        {
          value: 3,
          name: "Change billboard properties",
        },
        {
          value: 4,
          name: "Size billboard in meters",
        },
        {
          value: 5,
          name: "Add multiple billboards",
        },
        {
          value: 6,
          name: "Scale by viewer distance",
        },
        {
          value: 7,
          name: "Fade by viewer distance",
        },
        {
          value: 8,
          name: "Offset by viewer distance",
        },
        {
          value: 9,
          name: "Add marker billboards",
        },
        {
          value: 10,
          name: "Disable the depth test when clamped to ground",
        },
      ],
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      selectionIndicator: false,
      timeline: false,
      sceneModePicker: false,
      sceneModePicker: false,
      navigationHelpButton: false,
    });
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(116.40125, 39.899, 15000.0),
    });
    this.addBillboard();
  },

  methods: {
    // 添加默认广告牌
    addBillboard() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.40125, 39.899),
        billboard: {
          image: "/images/icon/Cesium_Logo_overlay.png",
          //为防止billboard被3dtiles模型覆盖，
          //可在billboard参数中设置disableDepthTestDistance参数，
          //来禁止billboard的深度检测
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
    },
    // 在创建时设置广告牌属性
    setBillboardProperties() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.40125, 39.899),
        billboard: {
          image: "/images/icon/Cesium_Logo_overlay.png",
          show: true, // 这里可以不写，默认就是true
          pixelOffset: new Cesium.Cartesian3(0, -50), //设置屏幕空间中与此广告牌原点的像素偏移 x 负值向左 正值向右， y负值向上 正值向下
          eyeOffset: new Cesium.Cartesian3(0, 0, 0), //设置应用于此广告牌的眼睛坐标系中的三维笛卡尔偏移  不会用
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER, //设置此广告牌的水平原点  居中
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 设置此广告牌的垂直原点
          scale: 2.0, // 设置与广告牌图像大小（以像素为单位）相乘的统一比例  此为原始图片的两倍
          color: Cesium.Color.LIME, // 设置图片颜色
          rotation: Cesium.Math.PI_OVER_FOUR, // 设置图片旋转值  pi/4
          alignedAxis: Cesium.Cartesian3.ZERO, // 获取或设置世界空间中的对齐轴  一般不用
          width: 100, // 设置图片宽度
          height: 25, // 设置图片高度
        },
      });
    },
    //改变广告牌属性
    changeBillboardProperties() {
      // 添加广告牌实体
      const entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.40125, 39.899, 300000.0),
        billboard: {
          image: "/images/icon/Cesium_Logo_overlay.png",
        },
      });
      // 获取广告牌
      const billboard = entity.billboard;
      // 动态设置广告牌比例
      billboard.scale = 3.0;
      // 动态设置广告牌颜色
      billboard.color = Cesium.Color.WHITE.withAlpha(0.25);
    },
    // 以米为单位设置广告牌大小
    sizeBillboardInMeters() {
      const entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.40125, 39.899),
        billboard: {
          image: "/images/icon/Cesium_Logo_overlay.png",
          sizeInMeters: true, // 默认为false，false单位为像素，true单位为米，随着视野缩放大小也会缩放
        },
      });
      this.viewer.zoomTo(entity);
    },
    // 添加多个广告牌
    addMultipleBillboards() {
      const logoUrl = "/images/icon/Cesium_Logo_overlay.png";
      const facilityUrl = "/images/icon/facility.gif";
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: logoUrl,
        },
      });
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-80.5, 35.14),
        billboard: {
          image: facilityUrl,
        },
      });
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-80.12, 25.46),
        billboard: {
          image: facilityUrl,
        },
      });
    },
    // 按视距缩放
    scaleByDistance() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: "/images/icon/facility.gif",
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
        },
      });
    },
    // 按视距淡入显示
    fadeByDistance() {
      this.viewer.entities.add({
        position: new Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: "/images/icon/Cesium_Logo_overlay.png",
          translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
        },
      });
    },
    // 按视距偏移
    offsetByDistance() {
      //随着观众向设施广告牌靠近，
      //将CesiumLogo广告牌上的像素偏移量增加到此高度
      const facilityHeight = 100;
      //同一位置的广告牌，随着观众越来越近而分开
      this.viewer.entities.add({
        position: new Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: "/images/icon/Cesium_Logo_overlay.png",
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 水平居中
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直与底部对齐
        },
      });
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: "/images/icon/facility.gif",
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -facilityHeight), // 0点时的偏移量
          pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.0e3, 1.0, 1.5e6, 0.0), // 根据视距改变偏移量
          translucencyByDistance: new Cesium.NearFarScalar(1.0e3, 1.0, 1.5e6, 0.1), // 根据视距淡入
        },
      });
    },
    // 添加图标点，裁剪图片
    addMarkerBillboards() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: "/images/icon/whiteShapes.png",
          imageSubRegion: new Cesium.BoundingRectangle(49, 43, 18, 18), //(x,y,width,height)设置指定BoundingRectangle的属性，该属性定义用于广告牌的图像子区域，而不是整个图像，从左下角开始以像素为单位测量
          color: Cesium.Color.LIME,
        },
      });
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-84.0, 39.0),
        billboard: {
          image: "/images/icon/whiteShapes.png",
          imageSubRegion: new Cesium.BoundingRectangle(61, 23, 18, 18),
          color: new Cesium.Color(0, 0.5, 1.0, 1.0),
        },
      });
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-70.0, 41.0),
        billboard: {
          image: "/images/icon/whiteShapes.png",
          imageSubRegion: new Cesium.BoundingRectangle(67, 80, 14, 14),
          color: new Cesium.Color(0.5, 0.9, 1.0, 1.0),
        },
      });
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-73.0, 37.0),
        billboard: {
          image: "/images/icon/whiteShapes.png",
          imageSubRegion: new Cesium.BoundingRectangle(27, 103, 22, 22),
          color: Cesium.Color.RED,
        },
      });
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-79.0, 35.0),
        billboard: {
          image: "/images/icon/whiteShapes.png",
          imageSubRegion: new Cesium.BoundingRectangle(105, 105, 18, 18),
          color: Cesium.Color.YELLOW,
        },
      });
    },
    // 图片贴紧地形  关闭地形检测
    disableDepthTest() {
      this.viewer.terrainProvider = Cesium.createWorldTerrain(); // 添加全球地形
      this.viewer.scene.globe.depthTestAgainstTerrain = true; // 开启深度检测，开启则地形下的物体都看不到
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-122.1958, 46.1915),
        billboard: {
          image: "/images/icon/facility.gif",
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY, //是否启用深度检测 正无穷时不启用，0时启用 Number.POSITIVE_INFINITY 代表正无穷，所以这里不启用
        },
      });
      // 视角定位
      this.viewer.scene.camera.setView({
        destination: new Cesium.Cartesian3(
          -2357576.243142461,
          -3744417.5604860787,
          4581807.855903771
        ),
        orientation: new Cesium.HeadingPitchRoll(
          5.9920811504170475,
          -0.6032820429886212,
          6.28201303164098
        ),
      });
    },

    // 下拉框切换
    handleChange(value) {
      this.reset(); // 先重置
      switch (value) {
        case "Add billboard": // 添加默认广告牌
          this.addBillboard();
          break;
        case "Set billboard properties at creation": // 在创建时设置广告牌属性
          this.setBillboardProperties();
          break;
        case "Change billboard properties": // 改变广告牌属性
          this.changeBillboardProperties();
          break;
        case "Size billboard in meters": // 以米为单位设置广告牌大小
          this.sizeBillboardInMeters();
          break;
        case "Add multiple billboards": // 添加多个广告牌
          this.addMultipleBillboards();
          break;
        case "Scale by viewer distance": // 按视距缩放
          this.scaleByDistance();
          break;
        case "Fade by viewer distance": // 按视距淡入显示
          this.fadeByDistance();
          break;
        case "Offset by viewer distance": // 按数据偏移
          this.offsetByDistance();
          break;
        case "Add marker billboards": // 添加图标点
          this.addMarkerBillboards();
          break;
        case "Disable the depth test when clamped to ground": // 图片贴紧地形  关闭地形检测
          this.disableDepthTest();
          break;
        default:
          break;
      }
    },
    reset() {
      this.viewer.camera.flyHome();
      this.viewer.entities.removeAll(); // 删除场景中全部的实体
      //this.viewer.terrainProvider = undefined; // 删除场景中的地形
      this.viewer.scene.globe.depthTestAgainstTerrain = false; // 关闭地形检测
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
