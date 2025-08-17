<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control">
      <el-radio v-model="radio" label="ld" @change="changeRadio">楼栋</el-radio>
      <el-radio v-model="radio" label="lc" @change="changeRadio">楼层</el-radio>
      <div class="splice"></div>
      <div>
        <p id="selectedInfo"></p>
      </div>
    </div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import axios from "axios";
import Popup from "../utils/popup/CesiumPopupDing";
export default {
  components: {},

  data() {
    return {
      viewer: null,
      tileset: null,
      radio: "ld",
      ldCollection: new Cesium.PrimitiveCollection(),
      lcCollection: new Cesium.PrimitiveCollection(),
      url: "data/json/dayanta_vec.json",
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
    this.viewer.scene.globe.depthTestAgainstTerrain = true; //深度检查
    // 隐藏地球
    // this.viewer.scene.skyBox.show = false;
    // this.viewer.scene.backgroundColor = Cesium.Color.WHITE;
    // this.viewer.scene.sun.show = false;
    // this.viewer.scene.moon.show = false;
    // this.viewer.scene.globe.show = false;
    // this.viewer.scene.skyAtmosphere.show = false;

    let scene = this.viewer.scene;
    /**
     * 加载3dtiles
     */
    this.tileset = scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: "data/3dtiles/dayanta/tileset.json",
      })
    );
    this.tileset.readyPromise.then((tileset) => {
      this.viewer.zoomTo(tileset);
      this.changeHeight(-420); // 3dtiles模型高度
    });
    /**
     * 加载primitive
     */
    scene.primitives.add(this.ldCollection);
    scene.primitives.add(this.lcCollection);
    this.buildingHighlightLd(this.url);

    /**
     * 鼠标事件
     */
    let selected, primitive, color, r, attribute, infoBox; //声明变量
    this.viewer.screenSpaceEventHandler.setInputAction((movement) => {
      let pick = this.viewer.scene.pick(movement.endPosition);
      if (Cesium.defined(pick) && Cesium.defined(pick.id)) {
        if (pick.id === selected) return;
        //void纯净的 undefined
        Cesium.defined(selected) &&
          (((attribute = primitive.getGeometryInstanceAttributes(
            selected
          )).color = color),
          (attribute.show = r),
          (selected = void 0),
          (primitive = void 0),
          (color = void 0),
          (r = void 0));
        //console.log(selected, primitive, color, r, attribute);
      }
      //变量赋值
      Cesium.defined(pick) &&
      Cesium.defined(pick.primitive) &&
      Cesium.defined(pick.id) &&
      Cesium.defined(pick.primitive.getGeometryInstanceAttributes)
        ? ((selected = pick.id),
          (primitive = pick.primitive),
          (attribute = primitive.getGeometryInstanceAttributes(selected)), //selected为选中的id
          (color = attribute.color),
          (r = attribute.show),
          this.viewer.scene.invertClassification ||
            (attribute.color = [255, 0, 255, 128]), //color赋值
          (attribute.show = [1]))
        : Cesium.defined(selected) &&
          (((attribute = primitive.getGeometryInstanceAttributes(
            selected
          )).color = color),
          (attribute.show = r),
          (selected = void 0),
          (primitive = void 0),
          (color = void 0));
      /**
       * 鼠标move事件-弹框
       */
      if (Cesium.defined(pick) && Cesium.defined(pick.id)) {
        let ray = this.viewer.scene.camera.getPickRay(movement.endPosition);
        let cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        infoBox = new Popup({
          viewer: this.viewer,
          geometry: cartesian,
          name: "信息",
          html: pick.id,
        });
      } else {
        if (infoBox) {
          infoBox.close();
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.viewer.screenSpaceEventHandler.setInputAction((movement) => {
      let pickFeature = this.viewer.scene.pick(movement.position);
    //   if (Cesium.defined(pickFeature) && Cesium.defined(pickFeature.id)) {
    //     if (pickFeature.id === selected) return; //清空
    //     Cesium.defined(selected) && (selected = void 0);
    //   }
      if (
        Cesium.defined(pickFeature) &&
        Cesium.defined(pickFeature.primitive) &&
        Cesium.defined(pickFeature.id) &&
        Cesium.defined(pickFeature.primitive.getGeometryInstanceAttributes)
      ) {
        selected = pickFeature.id;
        let name = typeof selected == "string" ? selected : selected._name;
        let p = document.getElementById("selectedInfo");
        p.innerHTML=`建筑物:${name}`
      } else {
        Cesium.defined(selected) && (selected = void 0);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  },

  methods: {
    changeRadio() {
      this.ldCollection.removeAll();
      this.lcCollection.removeAll();
      if (this.radio == "ld") {
        this.buildingHighlightLd(this.url);
      } else if (this.radio == "lc") {
        this.buildingHighlightLc(this.url);
      }
    },
    buildingHighlightLd(url) {
      axios.get(url).then((res) => {
        let { ld } = res.data;
        ld.map((index, value) => {
          this.addLdPrimitive(index);
        });
      });
    },
    addLdPrimitive(e) {
      let { coordinates, height, name } = e;
      this.ldCollection.add(
        new Cesium.ClassificationPrimitive({
          geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({
              polygonHierarchy: new Cesium.PolygonHierarchy(
                Cesium.Cartesian3.fromDegreesArray(coordinates)
              ),
              extrudedHeight: height, //数据高度容易出现找不到
            }),
            attributes: {
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                //顶点着色器属性
                new Cesium.Color(Cesium.Color.AQUA)
              ),
              show: new Cesium.ShowGeometryInstanceAttribute(true), //确定是否显示几何实例
            },
            id: name,
          }),
          classificationType: Cesium.ClassificationType.BOTH, //是否影响地形(地形和 3D 瓦片都将被分类)
        })
      );
    },
    /**
     * 单层
     */
    buildingHighlightLc(url) {
      axios.get(url).then((res) => {
        let { lc } = res.data;
        lc.map((index, value) => {
          for (var i = 1; i <= index.floorNum; i++) {
            let center = [
              index.center[0],
              index.center[1],
              index.baseHeight + index.floorHeight * i,
            ];
            let dimensions = index.dimensions;
            let name = index.name ? index.name + ":" + i + "层" : i;
            this.addLcPrimitive(center, dimensions, name);
          }
        });
      });
    },
    addLcPrimitive(center, dimensions, name) {
      //计算矩阵
      let position = new Cesium.Cartesian3.fromDegrees(center[0], center[1], center[2]);
      let matrixT = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      let rotation = Cesium.Matrix3.fromHeadingPitchRoll(
        new Cesium.HeadingPitchRoll(0, 0, 0)
      );
      let matrixR = Cesium.Matrix4.fromRotationTranslation(
        rotation,
        new Cesium.Cartesian3(0, 0, 0)
      );
      let modelMatrix = Cesium.Matrix4.multiply(matrixT, matrixR, new Cesium.Matrix4());
      //添加
      this.lcCollection.add(
        new Cesium.ClassificationPrimitive({
          geometryInstances: new Cesium.GeometryInstance({
            geometry: Cesium.BoxGeometry.fromDimensions({
              vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT, //顶点格式
              dimensions: new Cesium.Cartesian3(
                dimensions[0],
                dimensions[1],
                dimensions[2]
              ),
            }),
            modelMatrix: modelMatrix,
            attributes: {
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                new Cesium.Color(Cesium.Color.AQUA)
              ),
              show: new Cesium.ShowGeometryInstanceAttribute(true),
            },
            id: name,
          }),
          classificationType: Cesium.ClassificationType.CESIUM_3D_TILE, //是否影响地形
        })
      );
    },
    changeHeight(height) {
      if (isNaN(height)) {
        return;
      }
      const carographic = Cesium.Cartographic.fromCartesian(
        this.tileset.boundingSphere.center
      );
      const surface = Cesium.Cartesian3.fromRadians(
        carographic.longitude,
        carographic.latitude,
        0.0
      );
      const offset = Cesium.Cartesian3.fromRadians(
        carographic.longitude,
        carographic.latitude,
        height
      );
      const translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
      );
      this.tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    },
  },
};
</script>
<style>
.control {
  position: absolute;
  min-width: 166px;
  background: rgba(48, 51, 54, 0.7);
  top: 10px;
  right: 10px;
  color: white;
  font-size: 14px;
  padding: 20px;
}

.splice {
  border: solid white 1px;
  margin: 6px 0;
}
/* pop框css*/
.cesium-popup-panel {
  opacity: 0.8;
  width: 200px;
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
