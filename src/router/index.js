import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '3DTiles_Pick',
    component: () => import("../components/3DTiles/3DTiles_Pick.vue")
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
    path: "/gltf_Matrix",
    name: "gltf_Matrix",
    component: () => import("../components/gltf/gltf_Matrix.vue")
  },
  {
    path: "/BIM_Mark",
    name: "BIM_Mark",
    component: () => import("../components/BIM/BIM_Mark.vue")
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
