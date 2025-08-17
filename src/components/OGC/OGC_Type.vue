<template>
  <div class="model-wrap">
    <div class="select-wrap">
      <a-select v-dark default-value="WFS" style="width: 220px" @change="handleChange">
        <a-select-option v-for="(item, index) in selectData" :value="index" :key="index">
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
      viewer: null,
      selectData: [
        {
          name: "WFS",
        },
        {
          name: "WMS",
        },
        {
          name: "WMTS",
        },
        {
          name: "WMTS_GeoServer",
        },
      ],
    };
  },

  computed: {},

  mounted() {
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
    
    this.handleChange(1);
  },

  methods: {
    handleChange(index) {
      if (
        Cesium.defined(this.viewer.imageryLayers) ||
        Cesium.defined(this.viewer.dataSources)
      ) {
        this.viewer.imageryLayers.removeAll();
        this.viewer.dataSources.removeAll();
        this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(116.388470, 39.916850, 555000.0),
        });
      }
      const item = this.selectData[index].name;
      let select = {
        WFS: this.addWFS,
        WMS: this.addWMS,
        WMTS: this.addWMTS,
        WMTS_GeoServer: this.addWMTS_GeoServer,
      };
      select[item] && select[item]();
    },
    addWFS() {
      //promise方式
      let promise = Cesium.GeoJsonDataSource.load(
        "http://152.136.111.30:8080/geoserver/developer_map_gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=developer_map_gis%3Abeijing&maxFeatures=5000&outputFormat=application%2Fjson"
      );
      promise.then((dataSource) => {
        this.viewer.dataSources.add(dataSource);
        this.viewer.flyTo(dataSource); //flyTo(target, options)
        let colorHash = {};
        let entities = dataSource.entities.values;
        for (let i = 0; i < entities.length; i++) {
          let entity = entities[i];
          let name = entity.name;
          let color = colorHash[name];
          if (!color) {
            //如果不存在颜色
            color = Cesium.Color.fromRandom({ alpha: 1.0 }); //随机颜色
            colorHash[name] = color; //随机色赋值给颜色哈希值对象
          }
          entity.polygon.material = color; //设置多边形材质为我们的随机颜色
          entity.polygon.outline = false; //移除outline
        }
      });
    },
    addWMS() {
      let wms = new Cesium.WebMapServiceImageryProvider({
        url: "http://152.136.111.30:8080/geoserver/developer_map_gis/ows",
        layers: "developer_map_gis:beijing",
        //proxy: new Cesium.DefaultProxy('https://nationalmap.gov.au/proxy/'),//一个简单的代理，它将所需资源作为唯一的查询参数附加到给定的代理URL
        parameters: {
          //在GetMap URL中传递给WMS服务器的附加参数（OGC标准中）
          format: "image/png",
          transparent: true,
        },
        //getFeatureInfoParameters:{},//在GetFeatureInfo URL中传递给WMS服务器的附加参数（OGC标准中）
        //getFeatureInfoFormats:[]//WMS GetFeatureInfo请求的格式
      });
      this.viewer.imageryLayers.addImageryProvider(wms);
    },
    addWMTS() {
      let tdt = new Cesium.WebMapTileServiceImageryProvider({
        //layer属性对应vec_w中的vec,tileMatrixSetID对应vec_w后面的w
        url: "http://t0.tianditu.gov.cn/vec_w/wmts?tk=f6616fa13df718e2cd6280af4c45f5a2",
        layer: "vec",
        style: "default",
        format: "tiles",
        tileMatrixSetID: "w",
        tilingScheme: new Cesium.WebMercatorTilingScheme(), //对应于TileMatrixSet中切片组织的切片方案
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"], //天地图8个服务器
      });
      this.viewer.imageryLayers.addImageryProvider(tdt);
    },
    addWMTS_GeoServer() {
      const tileMatrixLabels = new Array(18);
      for (let z = 0; z < 18; z++) {
        tileMatrixLabels[z] = "EPSG:900913:" + z; //geoserver专用
      }
      let geoWMTS = new Cesium.WebMapTileServiceImageryProvider({
        url: "http://152.136.111.30:8080/geoserver/gwc/service/wmts",
        layer: "developer_map_gis:haidian",
        style: "", //没有样式为空
        tileMatrixSetID: "EPSG:900913",
        format: "image/png", //以下可选
        tileMatrixLabels: tileMatrixLabels,
      });
      this.viewer.imageryLayers.addImageryProvider(geoWMTS);
    },
  },
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
