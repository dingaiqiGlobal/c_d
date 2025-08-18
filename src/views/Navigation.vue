<!-- 下面导航栏  -->
<template>
  <div class="nav-wrap" ref="scrollContainer" @mousewheel="MouseWheel">
    <div class="column-wrap" v-for="(item, index) in list" :key="index">
      <router-link :to="item.path">
        {{ item.text }}
        <img :src="item.img" alt="" />
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      list: [
        {
          id: 1,
          img: "/images/nav/interaction/interaction_Stroke.jpg",
          text: "实体描边",
          path: "/interaction_Stroke",
        },
        {
          id: 1,
          img: "/images/nav/package/package_viewer.jpg",
          text: "封装包",
          path: "/package_viewer",
        },
        {
          id: 1,
          img: "/images/nav/interaction/interaction_Seclet.jpg",
          text: "实体选择",
          path: "/interaction_Seclet",
        },
        {
          id: 1,
          img: "/images/nav/tools/tools_Measure.jpg",
          text: "测量_长度&面积",
          path: "/tools_Measure",
        },
        {
          id: 1,
          img: "/images/nav/tools/tools_Angle.jpg",
          text: "测量_角度",
          path: "/tools_Angle",
        },
        {
          id: 1,
          img: "/images/nav/property/property_Point/property_PointCollection_two.jpg",
          text: "点效果集合",
          path: "/property_PointCollection_two",
        },
        {
          id: 1,
          img: "/images/nav/property/property_Point/property_PointCollection_one.jpg",
          text: "点效果集合",
          path: "/property_PointCollection_one",
        },
        {
          id: 1,
          img: "/images/nav/property/property_Polyline/property_LineCollection.jpg",
          text: "线效果集合",
          path: "/property_LineCollection",
        },
        {
          id: 1,
          img: "/images/nav/property/property_Polyline/property_ParabolaLine.jpg",
          text: "抛物线",
          path: "/property_ParabolaLine",
        },
        {
          id: 1,
          img: "/images/nav/property/property_Polyline/property_FlyLine.jpg",
          text: "竖直飞线",
          path: "/property_FlyLine",
        },
        {
          id: 1,
          img: "/images/nav/property/property_Polyline/property_FlickerLine.jpg",
          text: "闪烁线",
          path: "/property_FlickerLine",
        },
        {
          id: 1,
          img: "/images/nav/property/property_Polyline/property_FlowLine.jpg",
          text: "流动线",
          path: "/property_FlowLine",
        },
        {
          id: 1,
          img: "/images/nav/property/property_Polyline/property_WallCollection.jpg",
          text: "墙体集合",
          path: "/property_WallCollection",
        },
        {
          id: 1,
          img: "/images/nav/property/property_Polygon/property_Water.jpg",
          text: "动态水面",
          path: "/property_Water",
        },
        {
          id: 1,
          img: "/images/nav/project/project_ModelSplit.jpg",
          text: "模型拆解",
          path: "/project_ModelSplit",
        },
        {
          id: 1,
          img: "/images/nav/particleSystem/particleSystem_Fireworks.jpg",
          text: "粒子-烟花",
          path: "/particleSystem_Fireworks",
        },
        {
          id: 1,
          img: "/images/nav/particleSystem/particleSystem_Collection.jpg",
          text: "粒子系统集合",
          path: "/particleSystem_Collection",
        },
        {
          id: 1,
          img: "/images/nav/postProcessing/postProcessing_Weather.jpg",
          text: "后期-天气",
          path: "/postProcessing_Weather",
        },
        {
          id: 1,
          img: "/images/nav/postProcessing/postProcessing_Stroke.jpg",
          text: "后期描边",
          path: "/postProcessing_Stroke",
        },
        {
          id: 1,
          img: "/images/nav/postProcessing/postProcessing_Bloom.jpg",
          text: "后期泛光",
          path: "/postProcessing_Bloom",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_CustomShader.jpg",
          text: "3DTiles自定义shader",
          path: "/3DTiles_CustomShader",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_BuildingLight.jpg",
          text: "3DTiles建筑物光圈",
          path: "/3DTiles_BuildingLight",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3Dtiles_ContentNum.jpg",
          text: "3DTiles可视范围个数",
          path: "/3Dtiles_ContentNum",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_Matrix_modelMatrix.jpg",
          text: "3DTiles矩阵modelMatrix",
          path: "/3DTiles_Matrix_modelMatrix",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_Matrix_root.jpg",
          text: "3DTiles矩阵root",
          path: "/3DTiles_Matrix_root",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_AdjustHeight.jpg",
          text: "3DTiles高度调整",
          path: "/3DTiles_AdjustHeight",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_Pick.jpg",
          text: "3DTiles拾取",
          path: "/",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_ClippingPlanes.jpg",
          text: "3DTiles剪裁平面",
          path: "/3DTiles_ClippingPlanes",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_Format.jpg",
          text: "3DTiles多种加载",
          path: "/3DTiles_Format",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_Inspector.jpg",
          text: "3DTiles检查",
          path: "/3DTiles_Inspector",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_Event_Interactivity.jpg",
          text: "3DTiles事件交互",
          path: "/3DTiles_Event_Interactivity",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_Style_BatchTable.jpg",
          text: "3DTilesBatch样式",
          path: "/3DTiles_Style_BatchTable",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_Style_Building.jpg",
          text: "3DTiles建筑样式",
          path: "/3DTiles_Style_Building",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_Style_PointCloud.jpg",
          text: "3DTiles样式点云",
          path: "/3DTiles_Style_PointCloud",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_Monomer.jpg",
          text: "3DTiles单体化",
          path: "/3DTiles_Monomer",
        },
        {
          id: 1,
          img: "/images/nav/camera/camera_ChangeEvent.jpg",
          text: "相机事件(监听地图缩放)",
          path: "/camera_ChangeEvent",
        },
        {
          id: 1,
          img: "/images/nav/camera/camera_GlobeRotate.jpg",
          text: "旋转地球",
          path: "/camera_GlobeRotate",
        },
        {
          id: 1,
          img: "/images/nav/clock/clock_Class.jpg",
          text: "clock类封装",
          path: "/clock_Class",
        },
        {
          id: 1,
          img: "/images/nav/clock/clock_Keyboard_Roaming.jpg",
          text: "键盘漫游",
          path: "/clock_Keyboard_Roaming",
        },
        {
          id: 1,
          img: "/images/nav/clock/clock_TrackPlay_FirstView.jpg",
          text: "轨迹回放（漫游）",
          path: "/clock_TrackPlay_FirstView",
        },
        {
          id: 1,
          img: "/images/nav/clock/clock_TrackPlay_Globe.jpg",
          text: "轨迹回放(全局)",
          path: "/clock_TrackPlay_Globe",
        },
        {
          id: 1,
          img: "/images/nav/OGC/OGC_Terrain.jpg",
          text: "OGC_Terrain",
          path: "/OGC_Terrain",
        },
        {
          id: 1,
          img: "/images/nav/OGC/WMS_GetFeatureInfo.jpg",
          text: "WMS_GetFeatureInfo",
          path: "/WMS_GetFeatureInfo",
        },
        {
          id: 1,
          img: "/images/nav/OGC/OGC_Type.jpg",
          text: "OGC集合",
          path: "/OGC_Type",
        },
        {
          id: 1,
          img: "/images/nav/thirdParty/thirdParty_Echarts_Fly.jpg",
          text: "echarts飞行",
          path: "/thirdParty_Echarts_Fly",
        },
        {
          id: 1,
          img: "/images/nav/thirdParty/thirdParty_mapv.jpg",
          text: "mapv集合同理",
          path: "/thirdParty_mapv",
        },
        {
          id: 1,
          img: "/images/nav/thirdParty/thirdParty_HeatMap.jpg",
          text: "热力图",
          path: "/thirdParty_HeatMap",
        },
        {
          id: 1,
          img: "/images/nav/geojson/geojson_Cluster_Two.jpg",
          text: "geojson聚散",
          path: "/geojson_Cluster_Two",
        },
        {
          id: 1,
          img: "/images/nav/geojson/geojson_Cluster_One.jpg",
          text: "geojson聚散",
          path: "/geojson_Cluster_One",
        },
        {
          id: 1,
          img: "/images/nav/geojson/geojson_Water.jpg",
          text: "geojson水面",
          path: "/geojson_Water",
        },
        {
          id: 1,
          img: "/images/nav/geojson/geojson_Invert.jpg",
          text: "geojson反选",
          path: "/geojson_Invert",
        },
        {
          id: 1,
          img: "/images/nav/billboard/billboard_gif.jpg",
          text: "billboard_gif",
          path: "/billboard_gif",
        },
        {
          id: 1,
          img: "/images/nav/billboard/billboard_poiIconLabel.jpg",
          text: "billboard尾",
          path: "/billboard_poiIconLabel",
        },
        {
          id: 1,
          img: "/images/nav/primitives/primitives_ModelAnimation.jpg",
          text: "primitives_ModelAnimation",
          path: "/primitives_ModelAnimation",
        },
        {
          id: 1,
          img: "/images/nav/entity/entity_CallbackProperty.jpg",
          text: "entity_CallbackProperty",
          path: "/entity_CallbackProperty",
        },
        {
          id: 1,
          img: "/images/nav/entity/entity_PolylineVolume.jpg",
          text: "空心管、多边形",
          path: "/entity_PolylineVolume",
        },
        {
          id: 1,
          img: "/images/nav/entity/entity_Type_Collection.jpg",
          text: "entity类型集合",
          path: "/entity_Type_Collection",
        },
        {
          id: 1,
          img: "/images/nav/entity/entity_Billboards.jpg",
          text: "entity_Billboards",
          path: "/entity_Billboards",
        },
        {
          id: 1,
          img: "/images/nav/gltf/gltf_View_God.jpg",
          text: "上帝视角跟随",
          path: "/gltf_View_God",
        },
        {
          id: 1,
          img: "/images/nav/gltf/gltf_View_First.jpg",
          text: "第一视角跟随",
          path: "/gltf_View_First",
        },
        {
          id: 1,
          img: "/images/nav/gltf/gltf_hpr.jpg",
          text: "gltf_HPR",
          path: "/gltf_hpr",
        },
        {
          id: 1,
          img: "/images/nav/gltf/gltf_CallbackProperty_Move.jpg",
          text: "gltf移动Property",
          path: "/gltf_CallbackProperty_Move",
        },
        {
          id: 1,
          img: "/images/nav/gltf/gltf_Style.jpg",
          text: "gltf样式",
          path: "/gltf_Style",
        },
        {
          id: 1,
          img: "/images/nav/other/other_ContourLine.jpg",
          text: "等值线",
          path: "/other_ContourLine",
        },
        {
          id: 1,
          img: "/images/nav/other/other_FramesPerSecound.jpg",
          text: "帧率-调优",
          path: "/other_FramesPerSecound",
        },
        {
          id: 1,
          img: "/images/nav/other/other_Map.jpg",
          text: "底图集合",
          path: "/other_Map",
        },
        {
          id: 1,
          img: "/images/nav/other/other_ViewportQuad_Logo.jpg",
          text: "视口logo",
          path: "/other_ViewportQuad_Logo",
        },
        {
          id: 1,
          img: "/images/nav/control/control_2DLink3D.jpg",
          text: "控件-联动",
          path: "/control_2DLink3D",
        },
        {
          id: 1,
          img: "/images/nav/control/control_Navigation.jpg",
          text: "控件-导航",
          path: "/control_Navigation",
        },
        {
          id: 1,
          img: "/images/nav/control/control_HawkEye3DMap.jpg",
          text: "控件-鹰眼图",
          path: "/control_HawkEye3DMap",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_Mark.jpg",
          text: "BIM标记",
          path: "/BIM_Mark",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_Mark.jpg",
          text: "BIM标记",
          path: "/BIM_Mark",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_Mark_Billboard.jpg",
          text: "BIM标记Billboard",
          path: "/BIM_Mark_Billboard",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_3dtilesMeasure.jpg",
          text: "BIM测量",
          path: "/BIM_3dtilesMeasure",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_ComponentDirectoryTree.jpg",
          text: "构件目录树",
          path: "/BIM_ComponentDirectoryTree",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_Annotation.jpg",
          text: "BIM标注",
          path: "/BIM_Annotation",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_DataLoading.jpg",
          text: "BIM气泡框",
          path: "/BIM_DataLoading",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_WidgetInfo.jpg",
          text: "构件信息",
          path: "/BIM_WidgetInfo",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_KeyboardRoaming.jpg",
          text: "键盘控制地图场景漫游",
          path: "/BIM_KeyboardRoaming",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_2DLink3D.jpg",
          text: "二三维联动",
          path: "/BIM_2DLink3D",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_PrintScreen.jpg",
          text: "打印（截图）",
          path: "/BIM_PrintScreen",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_SplitScreenAnalysis.jpg",
          text: "构件状态同步",
          path: "/BIM_SplitScreenAnalysis",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_Navigation.jpg",
          text: "导航操作",
          path: "/BIM_Navigation",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_ModelAttributes.jpg",
          text: "模型属性",
          path: "/BIM_ModelAttributes",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_BoundingBox.jpg",
          text: "包围盒",
          path: "/BIM_BoundingBox",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_Coordinate.jpg",
          text: "模型坐标",
          path: "/BIM_Coordinate",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_addBackground.jpg",
          text: "背景与天空盒",
          path: "/BIM_addBackground",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_Camera.jpg",
          text: "模型相机",
          path: "/BIM_Camera",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_View.jpg",
          text: "视图操作",
          path: "/BIM_View",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_Color.jpg",
          text: "模型颜色设置",
          path: "/BIM_Color",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_Show.jpg",
          text: "构建选择操作",
          path: "/BIM_Show",
        },
        {
          id: 1,
          img: "/images/nav/BIM/BIM_Pick.jpg",
          text: "构建选择操作",
          path: "/BIM_Pick",
        },
      ],
    };
  },

  computed: {},

  mounted() { },

  methods: {
    //鼠标滚轮上下滑动时div左右滑动
    MouseWheel(e) {
      let eventDelta = -e.wheelDelta || -e.deltaY * 40;
      let $scrollWrapper = this.$refs.scrollContainer;
      // console.log($scrollWrapper.scrollLeft)
      // 0到scrollLeft为滚动区域隐藏部分
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
    },
  },
};
</script>
<style lang="less" scoped>
.nav-wrap {
  text-align: left;
  overflow: auto;
  white-space: nowrap;

  .column-wrap {
    font-size: 16px;
    display: inline-block;
    text-align: center;
    width: 170px;
    height: 130px;
    margin-top: 4px;
    margin-left: 10px;
    border: 1px solid #759dc0;
    padding: 2px 4px 4px 4px;
    background-color: #bcd8f4;
    background-image: linear-gradient(#ffffff 0px,
        rgba(255, 255, 255, 0) 3px,
        rgba(255, 255, 255, 0.75) 100%);
    box-sizing: content-box;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #86bdf2;
    }

    img {
      width: 150px;
      margin: 5px auto;
      height: 100px;
      display: block;
    }
  }

  /*包含以下四种的链接*/
  a {
    color: #000;
  }

  /*正常的未被访问过的链接*/
  a:link {
    text-decoration: none;
  }

  /*已经访问过的链接*/
  a:visited {
    text-decoration: none;
  }

  /*鼠标划过(停留)的链接*/
  a:hover {
    text-decoration: none;
  }

  /* 正在点击的链接*/
  a:active {
    text-decoration: none;
  }
}
</style>
