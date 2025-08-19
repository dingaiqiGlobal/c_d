import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";

let ViewInit = {
  viewer: null,
  async initGlobe() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    let viewer = new Cesium.Viewer("cesiumContainer", {
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
      // imageryProvider: new Cesium.SingleTileImageryProvider({
      //   url: require("@/assets/mapControIcon/world_b.jpg"),
      //   rectangle: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
      // }),
    });
    viewer._cesiumWidget._creditContainer.style.display = "none";
    viewer.animation.container.style.visibility = "hidden"; // 不显示动画控件
    viewer.timeline.container.style.visibility = "hidden"; // 不显示时间控件
    viewer.imageryLayers.removeAll();

    this.viewer = viewer; //赋值对象viewer
    this.setCenter({});
  },
  setCenter(options) {
    let lon = options.lon || 116.39156;
    let lat = options.lat || 39.9071;
    let alt = options.alt || 1000000;
    let heading = options.heading || 0;
    let pitch = options.pitch || -90;
    let roll = options.roll || 0;
    let position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
    let orientation = {
      heading: Cesium.Math.toRadians(heading),
      pitch: Cesium.Math.toRadians(pitch),
      roll: roll,
    };
    this.viewer.camera.setView({
      destination: position,
      orientation: orientation,
    });
    //挂在window上
    window.viewerCenter = {
      destination: position,
      orientation: orientation,
    };
  },
};
export default ViewInit;
