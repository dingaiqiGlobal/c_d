import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/tools_Measure",
    name: "tools_Measure",
    component: () => import("../components/tools/tools_Measure.vue")
  },
  {
    path: "/tools_Angle",
    name: "tools_Angle",
    component: () => import("../components/tools/tools_Angle.vue")
  },
  {
    path: "/property_PointCollection_two",
    name: "property_PointCollection_two",
    component: () => import("../components/property/property_Point/property_PointCollection_two.vue")
  },
  {
    path: "/property_PointCollection_one",
    name: "property_PointCollection_one",
    component: () => import("../components/property/property_Point/property_PointCollection_one.vue")
  },
  {
    path: "/property_LineCollection",
    name: "property_LineCollection",
    component: () => import("../components/property/property_Polyline/property_LineCollection.vue")
  },
  {
    path: "/property_ParabolaLine",
    name: "property_ParabolaLine",
    component: () => import("../components/property/property_Polyline/property_ParabolaLine.vue")
  },
  {
    path: "/property_FlyLine",
    name: "property_FlyLine",
    component: () => import("../components/property/property_Polyline/property_FlyLine.vue")
  },
  {
    path: "/property_FlickerLine",
    name: "property_FlickerLine",
    component: () => import("../components/property/property_Polyline/property_FlickerLine.vue")
  },
  {
    path: "/property_FlowLine",
    name: "property_FlowLine",
    component: () => import("../components/property/property_Polyline/property_FlowLine.vue")
  },
  {
    path: "/property_WallCollection",
    name: "property_WallCollection",
    component: () => import("../components/property/property_Polyline/property_WallCollection.vue")
  },
  {
    path: "/property_Water",
    name: "property_Water",
    component: () => import("../components/property/property_Polygon/property_Water.vue")
  },
  {
    path: "/project_ModelSplit",
    name: "project_ModelSplit",
    component: () => import("../components/project/project_ModelSplit.vue")
  },
  {
    path: "/particleSystem_Fireworks",
    name: "particleSystem_Fireworks",
    component: () => import("../components/particleSystem/particleSystem_Fireworks.vue")
  },
  {
    path: "/particleSystem_Collection",
    name: "particleSystem_Collection",
    component: () => import("../components/particleSystem/particleSystem_Collection.vue")
  },
  {
    path: "/postProcessing_Weather",
    name: "postProcessing_Weather",
    component: () => import("../components/postProcessing/postProcessing_Weather.vue")
  },
  {
    path: "/postProcessing_Stroke",
    name: "postProcessing_Stroke",
    component: () => import("../components/postProcessing/postProcessing_Stroke.vue")
  },
  {
    path: "/postProcessing_Bloom",
    name: "postProcessing_Bloom",
    component: () => import("../components/postProcessing/postProcessing_Bloom.vue")
  },
  {
    path: "/3DTiles_BuildingLight",
    name: "3DTiles_BuildingLight",
    component: () => import("../components/3DTiles/3DTiles_BuildingLight.vue")
  },
  {
    path: "/3Dtiles_ContentNum",
    name: "3Dtiles_ContentNum",
    component: () => import("../components/3DTiles/3Dtiles_ContentNum.vue")
  },
  {
    path: "/3DTiles_Matrix_modelMatrix",
    name: "3DTiles_Matrix_modelMatrix",
    component: () => import("../components/3DTiles/3DTiles_Matrix_modelMatrix.vue")
  },
  {
    path: "/3DTiles_Matrix_root",
    name: "3DTiles_Matrix_root",
    component: () => import("../components/3DTiles/3DTiles_Matrix_root.vue")
  },
  {
    path: "/3DTiles_AdjustHeight",
    name: "3DTiles_AdjustHeight",
    component: () => import("../components/3DTiles/3DTiles_AdjustHeight.vue")
  },
  {
    path: '/',
    name: '3DTiles_Pick',
    component: () => import("../components/3DTiles/3DTiles_Pick.vue")
  },
  {
    path: "/3DTiles_ClippingPlanes",
    name: "3DTiles_ClippingPlanes",
    component: () => import("../components/3DTiles/3DTiles_ClippingPlanes.vue")
  },
  {
    path: "/3DTiles_Format",
    name: "3DTiles_Format",
    component: () => import("../components/3DTiles/3DTiles_Format.vue")
  },
  {
    path: "/3DTiles_Inspector",
    name: "3DTiles_Inspector",
    component: () => import("../components/3DTiles/3DTiles_Inspector.vue")
  },
  {
    path: "/3DTiles_Event_Interactivity",
    name: "3DTiles_Event_Interactivity",
    component: () => import("../components/3DTiles/3DTiles_Event_Interactivity.vue")
  },
  {
    path: "/3DTiles_Style_BatchTable",
    name: "3DTiles_Style_BatchTable",
    component: () => import("../components/3DTiles/3DTiles_Style_BatchTable.vue")
  },
  {
    path: "/3DTiles_Style_Building",
    name: "3DTiles_Style_Building",
    component: () => import("../components/3DTiles/3DTiles_Style_Building.vue")
  },
  {
    path: "/3DTiles_Style_PointCloud",
    name: "3DTiles_Style_PointCloud",
    component: () => import("../components/3DTiles/3DTiles_Style_PointCloud.vue")
  },
  {
    path: "/3DTiles_Monomer",
    name: "3DTiles_Monomer",
    component: () => import("../components/3DTiles/3DTiles_Monomer.vue")
  },
  {
    path: "/camera_GlobeRotate",
    name: "camera_GlobeRotate",
    component: () => import("../components/camera/camera_GlobeRotate.vue")
  },
  {
    path: "/clock_Keyboard_Roaming",
    name: "clock_Keyboard_Roaming",
    component: () => import("../components/clock/clock_Keyboard_Roaming.vue")
  },
  {
    path: "/clock_TrackPlay_FirstView",
    name: "clock_TrackPlay_FirstView",
    component: () => import("../components/clock/clock_TrackPlay_FirstView.vue")
  },
  {
    path: "/OGC_Terrain",
    name: "OGC_Terrain",
    component: () => import("../components/OGC/OGC_Terrain.vue")
  },
  {
    path: "/WMS_GetFeatureInfo",
    name: "WMS_GetFeatureInfo",
    component: () => import("../components/OGC/WMS_GetFeatureInfo.vue")
  },
  {
    path: "/OGC_Type",
    name: "OGC_Type",
    component: () => import("../components/OGC/OGC_Type.vue")
  },
  {
    path: "/thirdParty_mapv",
    name: "thirdParty_mapv",
    component: () => import("../components/thirdParty/thirdParty_mapv.vue")
  },
  {
    path: "/thirdParty_HeatMap",
    name: "thirdParty_HeatMap",
    component: () => import("../components/thirdParty/thirdParty_HeatMap.vue")
  },
  {
    path: "/geojson_Cluster_Two",
    name: "geojson_Cluster_Two",
    component: () => import("../components/geojson/geojson_Cluster_Two.vue")
  },
  {
    path: "/geojson_Cluster_One",
    name: "geojson_Cluster_One",
    component: () => import("../components/geojson/geojson_Cluster_One.vue")
  },
  {
    path: "/geojson_Water",
    name: "geojson_Water",
    component: () => import("../components/geojson/geojson_Water.vue")
  },
  {
    path: "/geojson_Invert",
    name: "geojson_Invert",
    component: () => import("../components/geojson/geojson_Invert.vue")
  },
  {
    path: "/billboard_poiIconLabel",
    name: "billboard_poiIconLabel",
    component: () => import("../components/billboard/billboard_poiIconLabel.vue")
  },
  {
    path: "/entity_CallbackProperty",
    name: "entity_CallbackProperty",
    component: () => import("../components/entity/entity_CallbackProperty.vue")
  },
  {
    path: "/entity_Type_Collection",
    name: "entity_Type_Collection",
    component: () => import("../components/entity/entity_Type_Collection.vue")
  },
  {
    path: "/entity_Billboards",
    name: "entity_Billboards",
    component: () => import("../components/entity/entity_Billboards.vue")
  },
  {
    path: "/gltf_View_God",
    name: "gltf_View_God",
    component: () => import("../components/gltf/gltf_View_God.vue")
  },
  {
    path: "/gltf_View_First",
    name: "gltf_View_First",
    component: () => import("../components/gltf/gltf_View_First.vue")
  },
  {
    path: "/gltf_hpr",
    name: "gltf_hpr",
    component: () => import("../components/gltf/gltf_hpr.vue")
  },
  {
    path: "/gltf_CallbackProperty_Move",
    name: "gltf_CallbackProperty_Move",
    component: () => import("../components/gltf/gltf_CallbackProperty_Move.vue")
  },
  {
    path: "/gltf_Style",
    name: "gltf_Style",
    component: () => import("../components/gltf/gltf_Style.vue")
  },
  {
    path: "/gltf_Matrix",
    name: "gltf_Matrix",
    component: () => import("../components/gltf/gltf_Matrix.vue")
  },
  {
    path: "/other_ContourLine",
    name: "other_ContourLine",
    component: () => import("../components/other/other_ContourLine.vue")
  },
  {
    path: "/other_FramesPerSecound",
    name: "other_FramesPerSecound",
    component: () => import("../components/other/other_FramesPerSecound.vue")
  },
  {
    path: "/other_Map",
    name: "other_Map",
    component: () => import("../components/other/other_Map.vue")
  },
  {
    path: "/other_ViewportQuad_Logo",
    name: "other_ViewportQuad_Logo",
    component: () => import("../components/other/other_ViewportQuad_Logo.vue")
  },
  {
    path: "/control_HawkEye3DMap",
    name: "control_HawkEye3DMap",
    component: () => import("../components/control/control_HawkEye3DMap.vue")
  },
  {
    path: "/BIM_Mark",
    name: "BIM_Mark",
    component: () => import("../components/BIM/BIM_Mark.vue")
  },
  {
    path: "/BIM_Mark_Billboard",
    name: "BIM_Mark_Billboard",
    component: () => import("../components/BIM/BIM_Mark_Billboard.vue")
  },
  {
    path: "/BIM_3dtilesMeasure",
    name: "BIM_3dtilesMeasure",
    component: () => import("../components/BIM/BIM_3dtilesMeasure.vue")
  },
  {
    path: "/BIM_ComponentDirectoryTree",
    name: "BIM_ComponentDirectoryTree",
    component: () => import("../components/BIM/BIM_ComponentDirectoryTree.vue")
  },
  {
    path: "/BIM_Annotation",
    name: "BIM_Annotation",
    component: () => import("../components/BIM/BIM_Annotation.vue")
  },
  {
    path: "/BIM_DataLoading",
    name: "BIM_DataLoading",
    component: () => import("../components/BIM/BIM_DataLoading.vue")
  },
  {
    path: "/BIM_DataLoading",
    name: "BIM_DataLoading",
    component: () => import("../components/BIM/BIM_DataLoading.vue")
  },
  {
    path: "/BIM_WidgetInfo",
    name: "BIM_WidgetInfo",
    component: () => import("../components/BIM/BIM_WidgetInfo.vue")
  },
  {
    path: "/BIM_KeyboardRoaming",
    name: "BIM_KeyboardRoaming",
    component: () => import("../components/BIM/BIM_KeyboardRoaming.vue")
  },
  {
    path: "/BIM_2DLink3D",
    name: "BIM_2DLink3D",
    component: () => import("../components/BIM/BIM_2DLink3D.vue")
  },
  {
    path: "/BIM_PrintScreen",
    name: "BIM_PrintScreen",
    component: () => import("../components/BIM/BIM_PrintScreen.vue")
  },
  {
    path: "/BIM_SplitScreenAnalysis",
    name: "BIM_SplitScreenAnalysis",
    component: () => import("../components/BIM/BIM_SplitScreenAnalysis.vue")
  },
  {
    path: "/BIM_Navigation",
    name: "BIM_Navigation",
    component: () => import("../components/BIM/BIM_Navigation.vue")
  },
  {
    path: "/BIM_ModelAttributes",
    name: "BIM_ModelAttributes",
    component: () => import("../components/BIM/BIM_ModelAttributes.vue")
  },
  {
    path: "/BIM_BoundingBox",
    name: "BIM_BoundingBox",
    component: () => import("../components/BIM/BIM_BoundingBox.vue")
  },
  {
    path: "/BIM_Coordinate",
    name: "BIM_Coordinate",
    component: () => import("../components/BIM/BIM_Coordinate.vue")
  },
  {
    path: "/BIM_addBackground",
    name: "BIM_addBackground",
    component: () => import("../components/BIM/BIM_addBackground.vue")
  },
  {
    path: "/BIM_Camera",
    name: "BIM_Camera",
    component: () => import("../components/BIM/BIM_Camera.vue")
  },
  {
    path: "/BIM_View",
    name: "BIM_View",
    component: () => import("../components/BIM/BIM_View.vue")
  },
  {
    path: "/BIM_Color",
    name: "BIM_Color",
    component: () => import("../components/BIM/BIM_Color.vue")
  },
  {
    path: "/BIM_Show",
    name: "BIM_Show",
    component: () => import("../components/BIM/BIM_Show.vue")
  },
  {
    path: "/BIM_Pick",
    name: "BIM_Pick",
    component: () => import("../components/BIM/BIM_Pick.vue")
  },

]

const router = new VueRouter({
  routes
})

export default router
