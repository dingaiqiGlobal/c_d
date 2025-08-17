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

    this.tileset = this.viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: "data/3dtiles/BuildingBlue/tileset.json",
      })
    );
    this.tileset.readyPromise.then((tileset) => {
      this.viewer.zoomTo(
        tileset,
        new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 4.0)
      );
    });

    this.viewer.entities.add({
      id: "billboard",
      position: Cesium.Cartesian3.fromDegrees(116.392250,39.906310),
      billboard: {
        image: "/images/icon/Cesium_Logo_overlay.png",
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scale: 0.1,
      },
    });

    //自定义监听，billboard随着相机的变换大小变换
    this.viewer.camera.changed.addEventListener(() => {
      let height = this.viewer.camera.positionCartographic.height;
      let scale = 1;
      if (height < 800) {
        scale = 1;
      } else if (height >= 800 && height < 3000) {
        scale = 0.8;
      } else if (height >= 3000 && height <= 12000) {
        scale = 0.6;
      } else if (height >= 12000 && height <= 30000) {
        scale = 0.4;
      } else if (height >= 30000 && height <= 50000) {
        scale = 0.2;
      } else if (height >= 50000) {
        scale = 0.1;
      }

      let billboardEntity = this.viewer.entities.getById("billboard");
      billboardEntity.billboard.scale = scale;
      //   console.log(billboardEntity.billboard.scale);
    });
  },

  methods: {
    //监听地图缩放（方法3）
    cameraChanged() {
      this.viewer.camera.changed.addEventListener(() => {
        //优点：响应式，只有相机视野变化才触发
        //缺点：响应不灵敏，相机视野变化达到一定的幅度后才会触发一次
      });
    },
    clockOnTick() {
      this.viewer.clock.onTick.addEventListener(() => {
        //优点：响应灵敏，每个时钟都会执行，地图缩放变化能及时捕捉到
        //缺点：轮循式，无轮地图缩放是否有变化都会执行，可自己判断是否有变化，以决定执行业务代码
      });
    },
    wheel() {
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((wheelment) => {
        // 优点：响应式且响应灵敏
        //缺点：只能监听鼠标滚轮变化触发的地图缩放，如果是界面上按钮触发或直接代码触发等无法监听
      }, Cesium.ScreenSpaceEventType.WHEEL);
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
