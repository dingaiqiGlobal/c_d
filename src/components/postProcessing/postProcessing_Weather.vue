<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control">
      <el-select v-model="current" placeholder="请选择" @change="handleChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import { SnowEffect } from "../utils/postProcessing/postProcessing_SnowEffect";
import { RainEffect } from "../utils/postProcessing/postProcessing_RainEffect";
import { FogEffect } from "../utils/postProcessing/postProcessing_FogEffect";
export default {
  components: {},

  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "雪",
        },
        {
          value: "选项2",
          label: "雨",
        },
        {
          value: "选项3",
          label: "雾",
        },
      ],
      current: "",
      viewer: null,
      snow: "",
      rain: "",
      fog: "",
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      infoBox: false,
    });
    this.viewer.scene.debugShowFramesPerSecond = true; //显示帧率
  },

  methods: {
    handleChange(e) {
      //移除
      if (Cesium.defined(this.viewer.scene.postProcessStages)) {
        this.viewer.scene.postProcessStages.removeAll();
      }
      let currentValue = this.options.filter((cur, i, old) => {
        if (cur.value == this.current) {
          return cur;
        }
      });
      let item = currentValue[0].label;
      //switch
      let select = {
        雪: this.addSnowEffect,
        雨: this.addRainEffect,
        雾: this.addFogEffect,
      };
      select[item] && select[item]();
    },
    addSnowEffect() {
      this.snow = new SnowEffect(this.viewer, {
        snowSize: 0.02, // 雪花大小
        snowSpeed: 60.0, // 雪速
      });
    },
    addRainEffect() {
      this.rain = new RainEffect(this.viewer, {
        tiltAngle: -0.6, //倾斜角度
        rainSize: 0.6, // 雨大小
        rainSpeed: 120.0, // 雨速
      });
    },
    addFogEffect() {
      this.fog = new FogEffect(this.viewer, {
        visibility: 0.2,
        color: new Cesium.Color(0.8, 0.8, 0.8, 0.3),
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
