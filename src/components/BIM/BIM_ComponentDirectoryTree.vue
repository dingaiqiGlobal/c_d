<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control" ref="control"></div>
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
      featureMap: new Map(), //3dtiles要素结合
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
    //this.viewer.scene.globe.depthTestAgainstTerrain = true;//开启深度检查
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
    /**
     * 加载完成，遍历3Dtiles中所有的feature
     * 存储featureMap
     */
    this.tileset.tileLoad.addEventListener((tile) => {
      let content = tile.content; //return Batched3DModel3DTileContent
      if (content && content.featuresLength > 0) {
        const featuresLength = content.featuresLength;
        let featuresName =
          content.getFeature(0).getPropertyNames() ||
          content.getFeature(1).getPropertyNames();
        for (let i = 0; i < featuresLength; ++i) {
          const feature = content.getFeature(i); // return Cesium3DTileFeature
          let name = feature.getProperty("name") || feature.getProperty("id");
          if (!this.featureMap.get(name)) {
            this.featureMap.set(name, feature);
          }
        }
      }
      //创建dom
      for (let [key, pickedFeature] of this.featureMap) {
        let button = document.createElement("button");
        button.innerHTML = key;
        button.onclick = () => {
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
          if (!Cesium.defined(pickedFeature)) {
            return;
          }
          // 存储选中要素的信息
          this.hightLighted.feature = pickedFeature;
          Cesium.Color.clone(pickedFeature.color, this.hightLighted.originalColor);
          // 高亮选中元素
          pickedFeature.color = Cesium.Color.YELLOW;

          //突出显示
          this.queryWidgetByName(key)
        };
        this.$refs.control.appendChild(button);
      }
    });
  },

  methods: {
    queryWidgetByName(widgetName) {
            let selectcontent = "${name} === \'" + widgetName + "\'";//提前拼接
            this.tileset.style = new Cesium.Cesium3DTileStyle({
                color: {
                    conditions: [
                        [selectcontent, "rgb(255,255,255)"],
                        ["true", "rgba(0,0,0,0.1)"]//true表示剩余的显示的对象
                    ]
                },
            });
        }
  },
};
</script>
<style>
.control {
  position: absolute;
  z-index: 999;
  left: 10px;
  top: 10px;
  width: 200px;
  height: 650px;
  overflow: scroll;
}
</style>
