import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import CesiumNavigation from "@/components/package/js/Navigation/CesiumNavigation.js";

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

    /**
     * 自定义罗盘
     * https://github.com/cesium-plugin/cesium-navigation-es6?tab=readme-ov-file
     * css可以自定义修改样式
     */
    let options = {};
    // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
    options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
    // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
    options.enableCompass = true;
    // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
    options.enableZoomControls = true;
    // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
    options.enableDistanceLegend = false;
    // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
    options.enableCompassOuterRing = true;
    //自定义放大缩小按钮图标
    options.resetSvg =
      '<svg   viewBox="0 0 1024 1024" version="1.1" xmlns="http:www.w3.org/2000/svg"  width="20" height="20"><path d="M951.168 526.154a30 30 0 0 1-42.427 0c-0.044-0.045-0.081-0.1-0.125-0.14l-0.007 0.007-382.545-382.54a20 20 0 0 0-28.284 0l-382.545 382.54a30 30 0 1 1-42.426-42.426L476.567 79.837a50 50 0 0 1 70.71 0l403.758 403.758-0.006 0.006c0.045 0.045 0.094 0.082 0.139 0.126a30 30 0 0 1 0 42.427z m-770.246 15.877a29.992 29.992 0 0 1 29.987 29.75h0.013v307a20 20 0 0 0 20 20h137v-235a50 50 0 0 1 50-50h188a50 50 0 0 1 50 50v235h137a20 20 0 0 0 20-20V575.836a29.984 29.984 0 1 1 59.656-4.3c0 0.084-0.012 0.166-0.012 0.25h0.356v336.995a50 50 0 0 1-50 50h-227V693.365a20 20 0 0 0-20-20h-128a20 20 0 0 0-20 20v265.416h-227a50 50 0 0 1-50-50v-337h0.013a29.992 29.992 0 0 1 29.987-29.75z" p-id="2079"></path></svg>';
    options.zoomInSvg = `<svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 63.1 (92452) - https://sketch.com -->
    <title>放大</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <rect id="path-1" x="0" y="0" width="32" height="32" rx="2"></rect>
        <filter x="-20.3%" y="-20.3%" width="140.6%" height="140.6%" filterUnits="objectBoundingBox" id="filter-2">
            <feGaussianBlur stdDeviation="6" in="SourceAlpha" result="shadowBlurInner1"></feGaussianBlur>
            <feOffset dx="0" dy="1" in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset>
            <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
            <feColorMatrix values="0 0 0 0 0.262745098   0 0 0 0 0.537254902   0 0 0 0 1  0 0 0 1 0" type="matrix" in="shadowInnerInner1"></feColorMatrix>
        </filter>
    </defs>
    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="数据中心-2.0展开" transform="translate(-1837.000000, -934.000000)">
            <g id="编组-21" transform="translate(1816.000000, 761.000000)">
                <g id="放大" transform="translate(21.000000, 173.000000)">
                    <g id="矩形">
                        <use fill-opacity="0.700393357" fill="#091C37" fill-rule="evenodd" xlink:href="#path-1"></use>
                        <use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use>
                    </g>
                    <g transform="translate(6.000000, 6.000000)" fill="#8DF8FD">
                        <rect id="矩形" x="3.17460317" y="8.63095238" width="12.6984127" height="1.78571429"></rect>
                        <path d="M9.52380952,4.35207426e-13 C14.7836643,4.35207426e-13 19.047619,4.26395476 19.047619,9.52380952 C19.047619,14.7836643 14.7836643,19.047619 9.52380952,19.047619 C4.26395476,19.047619 1.73448557e-12,14.7836643 1.73448557e-12,9.52380952 C1.73448557e-12,4.26395476 4.26395476,4.35207426e-13 9.52380952,4.35207426e-13 Z M9.52380952,1.42857143 C5.05293298,1.42857143 1.42857143,5.05293298 1.42857143,9.52380952 C1.42857143,13.9946861 5.05293298,17.6190476 9.52380952,17.6190476 C13.9946861,17.6190476 17.6190476,13.9946861 17.6190476,9.52380952 C17.6190476,5.05293298 13.9946861,1.42857143 9.52380952,1.42857143 Z" id="椭圆形" fill-rule="nonzero"></path>
                        <polygon id="矩形" transform="translate(9.523810, 9.523810) rotate(90.000000) translate(-9.523810, -9.523810) " points="3.17460317 8.80952381 15.8730159 8.80952381 15.8730159 10.2380952 3.17460317 10.2380952"></polygon>
                    </g>
                </g>
            </g>
        </g>
    </g>
    </svg>`;
    options.zoomOutSvg = `<svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 63.1 (92452) - https://sketch.com -->
    <title>缩小</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <rect id="path-1" x="0" y="0" width="32" height="32" rx="2"></rect>
        <filter x="-20.3%" y="-20.3%" width="140.6%" height="140.6%" filterUnits="objectBoundingBox" id="filter-2">
            <feGaussianBlur stdDeviation="6" in="SourceAlpha" result="shadowBlurInner1"></feGaussianBlur>
            <feOffset dx="0" dy="1" in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset>
            <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
            <feColorMatrix values="0 0 0 0 0.262745098   0 0 0 0 0.537254902   0 0 0 0 1  0 0 0 1 0" type="matrix" in="shadowInnerInner1"></feColorMatrix>
        </filter>
    </defs>
    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="数据中心-2.0展开" transform="translate(-1837.000000, -976.000000)">
            <g id="编组-21" transform="translate(1816.000000, 761.000000)">
                <g id="缩小" transform="translate(21.000000, 215.000000)">
                    <g id="矩形">
                        <use fill-opacity="0.700393357" fill="#091C37" fill-rule="evenodd" xlink:href="#path-1"></use>
                        <use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use>
                    </g>
                    <g id="编组-6" transform="translate(6.000000, 6.000000)" fill="#8DF8FD">
                        <rect id="矩形" x="3.17460317" y="8.63095238" width="12.6984127" height="1.78571429"></rect>
                        <path d="M9.52380952,4.35207426e-13 C14.7836643,4.35207426e-13 19.047619,4.26395476 19.047619,9.52380952 C19.047619,14.7836643 14.7836643,19.047619 9.52380952,19.047619 C4.26395476,19.047619 1.73448557e-12,14.7836643 1.73448557e-12,9.52380952 C1.73448557e-12,4.26395476 4.26395476,4.35207426e-13 9.52380952,4.35207426e-13 Z M9.52380952,1.42857143 C5.05293298,1.42857143 1.42857143,5.05293298 1.42857143,9.52380952 C1.42857143,13.9946861 5.05293298,17.6190476 9.52380952,17.6190476 C13.9946861,17.6190476 17.6190476,13.9946861 17.6190476,9.52380952 C17.6190476,5.05293298 13.9946861,1.42857143 9.52380952,1.42857143 Z" id="椭圆形" fill-rule="nonzero"></path>
                    </g>
                </g>
            </g>
        </g>
    </g>
    </svg>`;

    let navigation = new CesiumNavigation(viewer, options);
    let controlDiv = navigation.container.children[0];
    //禁用控件自带的home按钮
    controlDiv.children[1].children[1].style.display = "none";
    //修改罗盘控件的位置
    controlDiv.children[0].style.top = "unset";
    controlDiv.children[0].style.right = "9px";
    controlDiv.children[0].style.bottom = "258px";
    //修改放大缩小控件的位置
    controlDiv.children[1].style.top = "unset";
    controlDiv.children[1].style.right = "43px";
    controlDiv.children[1].style.bottom = "188px";
    //调整放大缩小控件的样式
    let htmlCollection = controlDiv.children[1].children;
    for (let i = 0; i < htmlCollection.length; i++) {
      htmlCollection[i].style.borderBottom = "unset";
    }
    /**
     * 影像图层
     */
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
