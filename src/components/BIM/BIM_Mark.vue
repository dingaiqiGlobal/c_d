<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import CesiumPopupBillboard from "../utils/popup/CesiumPopupBillboard";
export default {
  components: {},

  data() {
    return {
      viewer: null,
      tileset: null,
      style: null, //模型样式
      featureArr: [], //要改变的样式的要素集合
      hightLighted: {
        //高亮样式、颜色
        feature: undefined,
        originalColor: new Cesium.Color(),
      },
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      infoBox: false,
    });
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
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    handler.setInputAction((movement) => {
      // 清除之前的高亮元素
      if (Cesium.defined(this.hightLighted.feature)) {
        this.hightLighted.feature.color = this.hightLighted.originalColor;
        this.hightLighted.feature = undefined;
      }
      //保持颜色
      for (let i = 0; i < this.featureArr.length; i++) {
        this.featureArr[i].color = Cesium.Color.NAVY;
      }

      // 选择新要素
      const pickedFeature = this.viewer.scene.pick(movement.position);
      if (!Cesium.defined(pickedFeature)) {
        return;
      }
      // 存储选中要素的信息
      this.hightLighted.feature = pickedFeature;
      Cesium.Color.clone(pickedFeature.color, this.hightLighted.originalColor);
      // 高亮选中元素
      pickedFeature.color = Cesium.Color.RED;

      //添加弹框
      let position = this.viewer.scene.pickPosition(movement.position);

      //自定义html
      let icon_background = "images/icon/BIM/icon_background.png";
      let icon_line = "images/icon/BIM/icon_line.png";
      let icon_anchor = "images/icon/BIM/icon_anchor.png";
      let text = "墙体检查";
      let html = `<div>
            <div class="cesium-popup-text" style=background-image:url(${icon_background})>
                ${text}
            </div>
            <br />
            <div class="cesium-popup-line">
                 <img src="${icon_line}"/>
            </div>
            <br />
            <div class="cesium-popup-anchor">
                <img src="${icon_anchor}"/>
            </div>
        </div>`;
      if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
        new CesiumPopupBillboard({})
          .setPosition(position)
          .addTo(this.viewer)
          .setHTML(html);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
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
/* pop框css*/
.cesium-popup-panel {
  user-select: none;
  position: absolute;
  height: 100px;
  width: 100px;
  z-index: 2;
  color: #ffffff;
  /* background: rgba(23, 50, 108, 0.6);
  border: 1px solid #4674d6; */
  margin-top: 20px;
}
.cesium-popup-text {
  position: relative;
  top: 60px;
  left: 72px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  font-size:12px;
  padding:5px;
}
.cesium-popup-line {
  position: absolute;
  width: 100%;
  margin-left: 15px;
  margin-top: 13px;
}
.cesium-popup-anchor {
  position: absolute;
  height: 100px;
  width: 100%;
}
</style>
