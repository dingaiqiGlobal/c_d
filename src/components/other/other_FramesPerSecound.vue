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
      fullscreenButton: false,
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

    /**
     * 性能调优测试
     */
    //帧率开启***
    this.viewer.scene.debugShowFramesPerSecond = true; //显示帧率
    //GPU***
    this.viewer.resolutionScale = 0.9; //调整画面精度设置分辨率
    this.viewer.targetFrameRate = 30; //场景元素较多，可以适当降低帧率，避免过高的帧率导致卡顿和性能下降
    this.viewer.scene.requestRenderMode = true;
    //如果 requestRenderMode 为 true，则此值定义在请求渲染之前允许的模拟时间的最大变化
    //此值定义在请求渲染之前允许的模拟时间的最大变化。较低的值会增加渲染的帧数，而较高的值会减少渲染的帧数
    this.viewer.scene.maximumRenderTimeChange = Infinity; //无穷大
    // 隐藏其他控件***
    this.viewer.scene.skyBox.show = false;
    this.viewer.scene.backgroundColor = Cesium.Color.BLACK;
    this.viewer.scene.sun.show = false;
    this.viewer.scene.moon.show = false;
    this.viewer.scene.globe.show = false;
    this.viewer.scene.skyAtmosphere.show = false;

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

    //3DTiles调优***
    this.tileset.tileLoad.addEventListener((tileset) => {
      tileset.maximumMemoryUsage = 1024 * 8; //内存建议显存大小的50%左右
      tileset.maximumScreenSpaceError = 16; // 设置3D Tiles的屏幕空间误差,数值加大，能让最终成像变模糊
      tileset.skipLevelOfDetail = true; //跳过一些级别，这样整体的效率会高一些，数据占用也会小一些
      tileset.preferLeaves = true; //这样我们就能最快的看见符合当前视觉精度的块，对于提升大数据以及网络环境不好的前提下有一点点改善意义。
      tileset.cullRequestsWhileMoving = true; //不要请求由于相机移动而在返回时可能未使用的图块。这种优化只适用于静止的瓦片集。
      tileset.cullRequestsWhileMovingMultiplier = 120; //默认60;移动时用于剔除请求的乘数。较大的是更积极的剔除，较小的较不积极的剔除。默认60
      tileset.dynamicScreenSpaceError = true; // true时会在真正的全屏加载完之后才清晰化模型
      tileset.dynamicScreenSpaceErrorDensity = 1; //默认0.00278;调整动态屏幕空间误差的密度，类似于 Fog ;数值加大，能让周边加载变快
    });

    /**
     * FPS
     * FPS是图像领域中的定义，是指画面每秒传输帧数，通俗来讲就是指动画或视频的画面数。
     * FPS是测量用于保存、显示动态视频的信息数量。
     * 每秒钟帧数越多，所显示的动作就会越流畅。
     * 通常，要避免动作不流畅的最低是30。
     * FPS也可以理解为我们常说的-刷新率（单位为Hz）。
     * 
     * MS查过一些资料加上自己理解：帧渲染的延时时间，
     * 一帧可以看做是一张的独立图片，
     * 60帧每秒就意味着:16ms=1000/60Hz，相当于60fps。
     * 这就是上面说的16ms。
     */
  },

  methods: {},
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
