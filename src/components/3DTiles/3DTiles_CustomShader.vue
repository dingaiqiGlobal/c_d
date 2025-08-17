<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control"></div>
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

    /**
     * 自定义shader设置
     */
    Cesium.ExperimentalFeatures.enableModelExperimental = true; //启用模型实验
    const bloom = this.viewer.scene.postProcessStages.bloom; //启用泛光
    bloom.enabled = true;

    // 隐藏地球
    // this.viewer.scene.skyBox.show = false;
    // this.viewer.scene.backgroundColor = Cesium.Color.WHITE;
    // this.viewer.scene.sun.show = false;
    // this.viewer.scene.moon.show = false;
    // this.viewer.scene.globe.show = false;
    // this.viewer.scene.skyAtmosphere.show = false;

    this.tileset = this.viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: "data/3dtiles/BuildingWhite/tileset.json",
      })
    );
    this.tileset.readyPromise.then((tileset) => {
      this.viewer.zoomTo(
        tileset,
        new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 4.0)
      );
    });

    this.setTexture("images/icon/building.png");
    //this.setGlow();
  },

  methods: {
    setTexture(imgurl) {
      const customShader = new Cesium.CustomShader({
        lightingModel: Cesium.LightingModel.UNLIT,
        varyings: {
          v_mars3d_normalMC: Cesium.VaryingType.VEC3,
        },
        uniforms: {
          u_mars3d_texture: {
            value: new Cesium.TextureUniform({
              url: imgurl,
            }),
            type: Cesium.UniformType.SAMPLER_2D,
          },
        },
        vertexShaderText: `
          void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput){
              v_mars3d_normalMC = vsInput.attributes.normalMC;
            }`,
        fragmentShaderText: `
          void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
            vec3 positionMC = fsInput.attributes.positionMC;
            if (dot(vec3(0.0, 1.0, 0.0), v_mars3d_normalMC) > 0.95) {
              //处理楼顶:统一处理成深色。
              material.diffuse = vec3(0.001, 0.001, 0.01);
            } else {
              //处理四个侧面: 贴一样的图
              float mars3d_width = 10.0;
              float mars3d_height = 10.0;
              float mars3d_textureX = 0.0;
              float mars3d_dotXAxis = dot(vec3(1.0, 0.0, 0.0), v_mars3d_normalMC);
              if (mars3d_dotXAxis > 0.52 || mars3d_dotXAxis < -0.52) {
                mars3d_textureX = mod(positionMC.x, mars3d_width) / mars3d_width;
              } else {
                mars3d_textureX = mod(positionMC.y, mars3d_width) / mars3d_width;
              }
              float mars3d_textureY = mod(positionMC.y, mars3d_height) / mars3d_height;
			        vec3 rgb = texture2D(u_mars3d_texture, vec2(mars3d_textureX, mars3d_textureY)).rgb;
              material.diffuse = rgb;
            }
          }`,
      });
      this.tileset.customShader = customShader;
    },

    setGlow() {
      const customShader = new Cesium.CustomShader({
        lightingModel: Cesium.LightingModel.UNLIT,
        fragmentShaderText: `
          void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
              float _baseHeight = 0.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度
              float _heightRange = 60.0; // 高亮的范围(_baseHeight ~ _baseHeight + _      heightRange) 默认是 0-60米
              float _glowRange = 300.0; // 光环的移动范围(高度)
              float vtxf_height = fsInput.attributes.positionMC.z-_baseHeight;
              float vtxf_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
              float vtxf_a12 = vtxf_height / _heightRange + sin(vtxf_a11) * 0.1;
              material.diffuse*= vec3(vtxf_a12, vtxf_a12, vtxf_a12);
              float vtxf_a13 = fract(czm_frameNumber / 360.0);
              float vtxf_h = clamp(vtxf_height / _glowRange, 0.0, 1.0);
              vtxf_a13 = abs(vtxf_a13 - 0.5) * 2.0;
              float vtxf_diff = step(0.005, abs(vtxf_h - vtxf_a13));
              material.diffuse += material.diffuse * (1.0 - vtxf_diff);
          }       
          `,
      });
      this.tileset.customShader = customShader;
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
