<!-- 点云样式 -->
<template>
  <div class="model-wrap">
    <div class="select-wrap">
      <a-select
        v-dark
        default-value="No Style"
        style="width: 190px; margin-right: 10px"
        size="small"
        @change="onChange"
      >
        <a-select-option
          v-for="(item, index) in selectData"
          :value="item.name"
          :key="index"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
    </div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
export default {
  components: {},

  data() {
    return {
      selectData: [
        {
          name: "No Style"
        },
        {
          name: "Red"
        },
        {
          name: "Color Gradient"
        },
        {
          name: "Step Red/Blue"
        },
        {
          name: "Interpolate Red/Blue"
        },
        {
          name: "Color Ramp"
        },
        {
          name: "Transparency"
        },
        {
          name: "Hide Low Temperature"
        },
        {
          name: "Show Subsections"
        },
        {
          name: "Mod"
        },
        {
          name: "Abs"
        },
        {
          name: "Trigonometric Functions"
        },
        {
          name: "Arc Trigonometric Functions"
        },
        {
          name: "Sqrt"
        },
        {
          name: "Sign"
        },
        {
          name: "Rounding Functions"
        },
        {
          name: "Exp and Log Functions"
        },
        {
          name: "Fractional Part"
        },
        {
          name: "Pow"
        },
        {
          name: "Min and Max"
        },
        {
          name: "Clamp and Mix"
        },
        {
          name: "Secondary Color"
        },
        {
          name: "Use point colors"
        },
        {
          name: "Use point positions"
        },
        {
          name: "Color based on position"
        },
        {
          name: "Style point size"
        },
        {
          name: "Multiple defines"
        }
      ]
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {});
    this.scene = this.viewer.scene;
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    this.add3dtiles();
  },

  methods: {
    add3dtiles() {
      this.tileset = new Cesium.Cesium3DTileset({
        url: "/data/3dtiles/PointCloudWithPerPointProperties/tileset.json"
      });
      this.scene.primitives.add(this.tileset);
      this.viewer.zoomTo(
        this.tileset,
        new Cesium.HeadingPitchRange(0, -1.0, 50.0)
      );
    },
    onChange(value) {
      let style = {};
      switch (value) {
        case "Red":
          style = {
            color: "color('#ff0000')"
          };
          break;
        case "Color Gradient":
          style = {
            color: "color() * ${temperature}"
          };
          break;
        case "Step Red/Blue":
          style = {
            color: "${temperature} > 0.5 ? color('red') : color('blue)"
          };
          break;
        case "Interpolate Red/Blue":
          style = {
            color:
              "color('red') * ${temperature} + color('blue') * (1.0 - ${temperature})"
          };
          break;
        case "Color Ramp":
          style = {
            color: {
              conditions: [
                ["${temperature} < 0.1", "color('#000099')"],
                ["${temperature} < 0.2", "color('#00cc99', 1.0)"],
                ["${temperature} < 0.3", "color('#66ff33', 0.5)"],
                ["${temperature} < 0.4", "rgba(255, 255, 0, 0.1)"],
                ["${temperature} < 0.5", "rgb(255, 128, 0)"],
                ["${temperature} < 0.6", "color('red')"],
                ["${temperature} < 0.7", "color('rgb(255, 102, 102)')"],
                ["${temperature} < 0.8", "hsl(0.875, 1.0, 0.6)"],
                ["${temperature} < 0.9", "hsla(0.83, 1.0, 0.5, 0.1)"],
                ["true", "color('#FFFFFF', 1.0)"]
              ]
            }
          };
          break;
        case "Transparency":
          style = {
            color: "rgba(0, 255, 0, ${temperature})"
          };
          break;
        case "Hide Low Temperature":
          style = {
            color: "rgb(${temperature} * 255, 0, 0)",
            show: "${temperature} > 0.3"
          };
          break;
        case "Show Subsections":
          style = {
            show: "${id} === 1 || ${id} > 250 && ${id} < 300"
          };
          break;
        case "Mod":
          style = {
            show: "${id} % 2 === 0"
          };
          break;
        // abs返回绝对值
        case "Abs":
          style = {
            color: "color() * abs(${temperature} - 0.5)"
          };
          break;
        case "Trigonometric Functions":
          style = {
            color:
              "color() * radians(cos(${temperature})) + color() * sin(${temperature}) + color() * tan(${temperature})"
          };
          break;
        case "Arc Trigonometric Functions":
          style = {
            color:
              "color() * acos(degrees(${temperature})) + color() * asin(${temperature}) + color() * atan(${temperature}) + color() * atan2(${POSITION}[0],${temperature})"
          };
          break;
        case "Sqrt":
          style = {
            color: "color() * sprt(${temperature})"
          };
          break;
        case "Sign":
          style = {
            color:
              "rgb(sign(${POSITION}[0]) * 255, sign(${POSITION}[1]) * 255, sign(${POSITION}[2]) * 255)"
          };
          break;
        case "Rounding Functions":
          style = {
            color:
              "rgb(floor(${POSITION}[0]) * 255, ceil(${POSITION}[1]) * 255, round(${POSITION}[2]) * 255)"
          };
          break;
        case "Exp and Log Functions":
          style = {
            color:
              "rgb(log(${POSITION}[0]) * 255, log2(${POSITION}[1]) * 255 + exp2(${POSITION}[1]) * 255, exp(${POSITION}[2]) * 255)"
          };
          break;
        case "Fractional Part":
          style = {
            color:
              "rgb(fract(${POSITION}[0]) * 255, fract(${POSITION}[1]) * 255, fract(${POSITION}[2]) * 255)"
          };
          break;
        case "Pow":
          style = {
            color: "color() * pow(${temperature}, 3)"
          };
          break;
        case "Min and Max":
          style = {
            color:
              "rgb(min(${POSITION}.x, 0.75) * 255, max(${POSITION}.z, 0.25) * 255, 255)"
          };
          break;
        case "Clamp and Mix":
          style = {
            color: "color() * clamp(${temperature}, 0.1, 0.2)"
          };
          break;
        case "Secondary Color":
          style = {
            color: {
              conditions: [
                ["${id} < 250", "vec4(${secondaryColor}, 1.0)"],
                [
                  "${id} < 500",
                  "vec4(${secondaryColor} * ${secondaryColor}, 1.0)"
                ],
                ["${id} < 750", "vec4(${secondaryColor} / 5.0, 1.0)"],
                [
                  "${id} < 1000",
                  "rgb(0, 0, Number(${secondaryColor}.x < 0.5) * 255)"
                ]
              ]
            }
          };
          break;
        case "Use point colors":
          style = {
            color: "#{COLOR} * ${temperature} + rgb(128, 128, 128)"
          };
          break;
        case "Use point positions":
          style = {
            show:
              "${POSITION}[0] > 0.5 || ${POSITION}[1] > 0.5 || ${POSITION}[2] > 0.5"
          };
          break;
        case "Color based on position":
          style = {
            color: "vec4(${POSITION}, 1.0)"
          };
          break;
        case "Style point size":
          style = {
            color: "color('red')",
            pointSize: "${temperature}  * 10"
          };
          break;
        case "Multiple defines":
          style = {
            defines: {
              length: "length(${POSITION})",
              time: "${tiles3d_tileset_time} * 3.0"
            },
            color: {
              conditions: [
                ["${length} < 0.5", "${length} * color('red')"],
                [
                  "${length} < 1.0",
                  "vec4(vec3(${temperature} * fract(${time})), 1.0)"
                ],
                ["true", "${COLOR}"]
              ]
            },
            pointSize: "5.0 - ${length} * 2.0",
            show: "${length} < 2.0"
          };
          break;
        default:
          break;
      }
      this.tileset.style = new Cesium.Cesium3DTileStyle(style);
    }
  }
};
</script>
<style lang="less" scoped>
.select-wrap {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1;
}
</style>
