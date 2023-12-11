<!-- 3dtiles高度调整 -->
<template>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";

//cnpm install dat.gui --save
import * as dat from 'dat.gui';
export default {
  components: {},

  data() {
    return {
      viewer: null,
      tileset: null,

      gui: null,
      params: {
        tx: 116.830460,
        ty: 40.371720,
        tz: 0,
        rx: 0,
        ry: 0,   
        rz: 0,
        scale:1
      },
    };
  },

  computed: {},
  mounted() {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      shadows: true, // 开启阴影
    });
    this.viewer.scene.globe.depthTestAgainstTerrain = true; // 开启深度检测
    //this.addGUI()
    this.add3dTiles();
  },

  methods: {
    // addGUI(){
        
    //     //GUI
    //     this.gui = new dat.GUI();
    //     this.gui.domElement.style = 'position:absolute;top:10px;left:10px';
    //     const title = this.gui.addFolder('3dtiles矩阵变换');
    //     //平移
    //     //onChange相当于vue中watch
    //     const translation = title.addFolder('平移');
    //     translation.add(this.params, 'tx',).name('经度').onChange((value) => {
            
    //     })
    //     translation.add(this.params, 'ty',).name('维度').onChange((value) => {
            
    //     })
    //     translation.add(this.params, 'tz',).min(0).max(100).step(1).name('高度').onChange((value) => {
    //         this.params.tz=value;
    //         clg
    //     })
    //     //旋转
    //     const rotate = title.addFolder('旋转');
    //     rotate.add(this.params, 'rx',).min(0).max(360).step(1).name('x轴旋转').onChange((value) => {
            
    //     })
    //     rotate.add(this.params, 'ry',).min(0).max(360).step(1).name('y轴旋转').onChange((value) => {
            
    //     })
    //     rotate.add(this.params, 'rz',).min(0).max(360).step(1).name('z轴旋转').onChange((value) => {
            
    //     })
    //     const scale = title.addFolder('缩放');
    //     scale.add(this.params, 'scale',).min(0).max(10).step(1).name('缩放').onChange((value) => {
            
    //     })
    //         //打开面板
    //     title.open()
    //     translation.open()
    //     rotate.open()
    //     scale.open()

    // },
    // 添加3dtiles
    add3dTiles() {
      this.tileset = this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: "data/3dtiles/BuildingBlue/tileset.json",
        })
      );
      this.tileset.readyPromise
        .then(tileset => {
          this.viewer.zoomTo(
            tileset,
            new Cesium.HeadingPitchRange(-45, -0.5, tileset.boundingSphere.radius * 4.0)
          );
        })
        .then(()=>{
          this.tileset.root.transform = this.tileMatrix();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    tileMatrix(){
      //旋转
      let mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(this.params.rx));
      let my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(this.params.ry));
      let mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(this.params.rz));
      //旋转矩阵Matrix3
      let rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
      let rotationY = Cesium.Matrix4.fromRotationTranslation(my);
      let rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
      //平移旋转矩阵Matrix4
      let position = Cesium.Cartesian3.fromDegrees(this.params.tx, this.params.ty, this.params.tz);
      let m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      //缩放平移矩阵相乘
      let scale = Cesium.Matrix4.fromUniformScale(this.params.scale);
      Cesium.Matrix4.multiply(m, scale, m);
      //旋转、平移矩阵相乘
      Cesium.Matrix4.multiply(m, rotationX, m);
      Cesium.Matrix4.multiply(m, rotationY, m);
      Cesium.Matrix4.multiply(m, rotationZ, m);
      //赋值给tileset
      return m;
    }
    
  },
};
</script>
<style lang="less" scoped>

</style>
