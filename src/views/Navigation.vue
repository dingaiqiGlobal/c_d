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
          img: "/images/nav/3DTiles/3DTiles_Pick.jpg",
          text: "3DTiles拾取",
          path: "/",
        },
                {
          id: 1,
          img: "/images/nav/postProcesing/postProcessing_Bloom.jpg",
          text: "后期泛光",
          path: "/postProcessing_Bloom",
        },
        {
          id: 1,
          img: "/images/nav/3DTiles/3DTiles_Monomer.jpg",
          text: "3DTiles单体化",
          path: "/3DTiles_Monomer",
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
          img: "/images/nav/OGC/WMS_GetFeatureInfo.jpg",
          text: "WMS_GetFeatureInfo",
          path: "/WMS_GetFeatureInfo",
        },
        {
          id: 1,
          img: "/images/nav/OGC/OGC.jpg",
          text: "OGC集合",
          path: "/OGC",
        },
        {
          id: 1,
          img: "/images/nav/entity/entity_Billboards.jpg",
          text: "entity_Billboards集合",
          path: "/entity_Billboards",
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
          img: "/images/nav/gltf/gltf_Matrix.jpg",
          text: "gltf矩阵",
          path: "/gltf_Matrix",
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

  mounted() {},

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
    background-image: linear-gradient(
      #ffffff 0px,
      rgba(255, 255, 255, 0) 3px,
      rgba(255, 255, 255, 0.75) 100%
    );
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
