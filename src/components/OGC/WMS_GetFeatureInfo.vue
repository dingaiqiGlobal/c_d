<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import Popup from "../utils/popup/CesiumPopupDing";
export default {
  components: {},

  data() {
    return {
      viewer: null,
    };
  },

  computed: {},

  mounted() {
    /**
     * camera和globel中的pick：这两个里面的pick一般搭配使用，通过camera中的getPickRay获取ray（射线），然后通过globel中的pick方法，获取世界坐标：
     * 通过pick进行地形上的坐标的获取
     * 这个是常用的方法，当你想获取当前鼠标位置的三维坐标时，经常使用到这个方法：
     * 第一步：通过camera的getPickRay，将当前的屏幕坐标转为ray（射线）；
     * viewer.camera.getPickRay(windowCoordinates);
     * 第二步：找出ray和地形的交点，即可求出三维世界坐标
     * globe.pick(ray, scene);
     */
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
      destination: Cesium.Cartesian3.fromDegrees(116.38847, 39.91685, 555000.0),
    });

    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    handler.setInputAction((movement) => {
      const pickRay = this.viewer.camera.getPickRay(movement.position);
      const position = this.viewer.scene.globe.pick(pickRay, this.viewer.scene);
      const featuresPromise = this.viewer.imageryLayers.pickImageryLayerFeatures(
        pickRay,
        this.viewer.scene
      );
      if (Cesium.defined(featuresPromise)) {
        featuresPromise.then((features) => {
          if (features.length > 0) {
            let html = `<div>${features[0].name}</div>`;
            new Popup({
              viewer: this.viewer,
              geometry: position,
              name: "WMS区县",
              html: html,
            });
          }
        });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.addWMS();
  },
  methods: {
    addWMS() {
      let gfif = new Cesium.GetFeatureInfoFormat("json", "application/json");
      let wms = new Cesium.WebMapServiceImageryProvider({
        name: "developer_map_gis:beijing",
        url: "http://152.136.111.30:8080/geoserver/developer_map_gis/ows",
        layers: "developer_map_gis:beijing",
        //proxy: new Cesium.DefaultProxy('https://nationalmap.gov.au/proxy/'),//一个简单的代理，它将所需资源作为唯一的查询参数附加到给定的代理URL
        parameters: {
          //在GetMap URL中传递给WMS服务器的附加参数（OGC标准中）
          request: "GetMap",
          format: "image/png",
          transparent: true,
        },
        //getFeatureInfoParameters写就layers要一致，要么就不写
        getFeatureInfoParameters: {
          //在GetFeatureInfo URL中传递给WMS服务器的附加参数（OGC标准中）
          request: "GetFeatureInfo",
          layers: "developer_map_gis:beijing",
        },
        getFeatureInfoFormats: [gfif], //WMS GetFeatureInfo请求的格式，注意是格式
      });
      this.viewer.imageryLayers.addImageryProvider(wms);
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

/* pop框css*/
.cesium-popup-panel {
  opacity: 0.8;
  width: 312px;
  position: absolute;
  z-index: 999;
  color: #00fcf9;

  background: rgba(23, 50, 108, 0.6);
  border: 1px solid #4674d6;
}

.cesium-popup-tip-panel {
  width: 40px;
  height: 20px;
  position: absolute;
  left: 50%;
  bottom: -20px;
  margin-left: -20px;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.8;
}

.cesium-popup-tip-bottom {
  width: 17px;
  background: rgba(23, 50, 108, 0.8);
  border-bottom: 1px solid #4674d6;
  height: 17px;
  padding: 1px;
  margin: -10px auto 0;
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.cesium-popup-header-panel {
  /* display: flex; */
  /* justify-content: space-between; */
  align-items: center;
  font-size: 14px;
  padding: 5px 15px;
  background: rgba(23, 50, 108, 0.8);

  border-bottom: 1px solid #4674d6;
}

.cesium-poput-header-title {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #ffffff;
}

.cesium-popup-content-panel {
  padding: 18px;
  text-align: left;
  line-height: 30px;
}

.cesium-popup-close-btn {
  float: right;
  position: relative;
  right: 10px;
}

.cesium-popup-close-btn,
.cesium-popup-close-btn:focus {
  cursor: pointer;
}

cesium-popup-close-btn > svg:hover {
  color: #00fcf9 !important;
}

.cesium-popup-close-btn > svg {
  user-select: auto;
  color: #4674d6;
  cursor: pointer;
  width: 15px;
  /* height: 15px; */
}
</style>
