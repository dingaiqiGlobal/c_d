<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import Grid3DLayer from './Grid3DLayer';
import createEdgeStage from "./interaction/createEdgeStage";

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
    //初始化Cesium
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      homeButton: false,
      vrButton: false,
      fullscreenButton: true,
      animation: true,
      geocoder: false,
      timeline: true,
      sceneModePicker: false,
      navigationHelpButton: false,
      infoBox: false,
      baseLayerPicker: false,
      selectionIndicator: true,
      shouldAnimate: true,
    });
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    this.viewer.animation.container.style.visibility = "hidden";
    this.viewer.timeline.container.style.visibility = "hidden";
    //底图
    this.addTdtLayer();
    //空域网格
    this.getData();
    //单机事件
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    handler.setInputAction((movement) => {
      let pickedFeature = this.viewer.scene.pick(movement.position);
      let pickedFeatureResult = this.pickFeatureFromScreen(pickedFeature);
      if (pickedFeatureResult) {
        let { type } = pickedFeatureResult;
        switch (type) {
          case "Entity":
            this.isEntity(pickedFeatureResult);
            break;
          case "Cesium3DTileset":
            this.isCesium3DTileset(pickedFeatureResult);
            break;
          case "Billboard":
            this.isBillboard(pickedFeatureResult);
            break;
          case "Primitive":
            this.isPrimitive(pickedFeatureResult);
            break;
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //悬浮事件
    handler.setInputAction((movement) => {
      let picked = this.viewer.scene.pick(movement.endPosition);
      if (picked) {
        this.viewer.enableCursorStyle = false;
        this.viewer._element.style.cursor = "";
        document.documentElement.style.cursor = "pointer";
      } else {
        this.viewer.enableCursorStyle = true;
        document.documentElement.style.cursor = "";
      }
      edgeStage.selected = [];
      edgeStage.enabled = false;
      if (picked && picked.primitive) {
        let primitive = picked.primitive;
        let pickIds = primitive._pickIds;
        let pickId = picked.pickId;
        let pickIdBillboard = primitive._pickId;
        if (!pickId && !pickIds && picked.content) {
          pickIds = picked.content._model._pickIds;
        }
        if (!pickId) {
          if (picked.id) {
            //entity
            if (pickIdBillboard) {
              pickId = pickIdBillboard;
            } else {
              pickId = pickIds.find((pickId) => {
                return pickId.object == picked;
              });
            }
          } else if (pickIdBillboard || pickIds) {
            //primitive
            if (pickIdBillboard) {
              pickId = pickIdBillboard;
            } else {
              pickId = pickIds[0];
            }
          }
        }
        if (pickId) {
          let pickObject = {
            pickId: pickId,
          };
          edgeStage.selected = [pickObject];
          cesiumStage.selected = [pickObject];
          edgeStage.enabled = !cesiumStage.enabled;
        } else {
          console.log("未找到pickId");
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //后期处理边缘
    let edgeStage = createEdgeStage();
    edgeStage.visibleEdgeColor = new Cesium.Color(1,1,1,0.1);
    edgeStage.hiddenEdgeColor = new Cesium.Color(1,1,1,0.1);
    edgeStage.selected = [];
    edgeStage.enabled = false;
    this.viewer.postProcessStages.add(edgeStage);
    var cesiumStage = Cesium.PostProcessStageLibrary.createSilhouetteStage();
    cesiumStage.enabled = false;
    this.viewer.postProcessStages.add(cesiumStage);
  },

  methods: {
    addTdtLayer() {
      let tdt = new Cesium.WebMapTileServiceImageryProvider({
        url: `http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=6eeb1c01782471ad6dcdd0551ff99894`,
        layer: 'tdt',
        style: "default",
        tileMatrixSetID: 'w',
        maximumLevel: 22
      });
      this.viewer.imageryLayers.addImageryProvider(tdt)
    },
    getData() {
      //Primitive
      // fetch(`data/json/geohash_grids1.geojson`)
      //   .then((res) => res.json())
      //   .then((res) => {
      //     let grid3DLayer = new Grid3DLayer(res);
      //     grid3DLayer.addTo(this.viewer)
      //   })
      let grid3DLayer = new Grid3DLayer({url:'data/json/geohash_grids1.geojson'});
      grid3DLayer.addTo(this.viewer)
    },
    isEntity(data) {
      console.log(data, "Entity");
    },
    isCesium3DTileset(data) {
      console.log(data, "Cesium3DTileset");
    },
    isBillboard(data) {
      console.log(data, "Billboard");
    },
    isPrimitive(data) {
      console.log(data, "Primitive");
    },
    pickFeatureFromScreen(feature) {
      let resp = {
        pickResult: null,
      };
      if (Cesium.defined(feature)) {
        resp.pickResult = feature;
        if (feature.hasOwnProperty("id") && feature.id instanceof Cesium.Entity) {
          resp.type = "Entity";
          resp.detailType = feature.primitive.constructor.name;
          resp.entity = feature.id;
        } else if (feature.primitive instanceof Cesium.Cesium3DTileset) {

          resp.type = "Cesium3DTileset";
        } else if (feature.primitive instanceof Cesium.Billboard) {
          resp.type = "Billboard";
          resp.id = feature.id;
          resp.billboardCollection = feature.collection;
          resp.billboard = feature.primitive;
        } else if (feature.primitive instanceof Cesium.Primitive) {
          resp.type = "Primitive";
          resp.primitive = feature.primitive;
        } else if (feature.primitive instanceof Cesium.Model) {
          resp.type = "Primitive";
          resp.detailType = "Model";
          resp.primitive = feature.primitive;
        }
      }
      return resp;
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
