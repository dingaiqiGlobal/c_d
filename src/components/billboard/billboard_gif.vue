<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import SuperGif from "libgif";
export default {
  components: {},

  data() {
    return {
      viewer: null,
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      infoBox: false,
    });
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(116.82857, 40.35351, 2000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0,
      },
    });
    this.addGif();
  },

  methods: {
    //参考https://github.com/wangdunwen/Cesium_loadGIF
    addGif() {
      const gifDiv = document.createElement("div");
      const gifImg = document.createElement("img");
      // gif库需要img标签配置下面两个属性
      gifImg.setAttribute("rel:animated_src", "images/icon/cheer.gif");
      gifImg.setAttribute("rel:auto_play", "0");
      gifDiv.appendChild(gifImg);
      // 新建gif实例
      var rub = new SuperGif({ gif: gifImg });
      rub.load(() => {
        var img_list = [];

        // 获取 gif 图的每一帧图片
        for (var i = 1; i <= rub.get_length(); i++) {
          // 遍历gif实例的每一帧
          rub.move_to(i);
          img_list.push(rub.get_canvas().toDataURL());
        }

        let flag = 0;
        let len = img_list.length;
        // 创建图片实体(for循环增加多个实体)
        let gif_entity = this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(116.83044, 40.37087),
          billboard: {
            image: img_list[0], // default: undefined
            show: true, // default
            scale: 0.3, // default: 1.0
          },
        });
        // 循环更新 billboard
        setInterval(() => {
          flag++;
          if (flag >= len) {
            flag = 0;
          }
          gif_entity.billboard.image = img_list[flag];
        }, 1000 / 30);
      });
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
