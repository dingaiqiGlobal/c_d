<template>
  <div>
    <div class="content" ref="content">
      <div id="cesiumContainer"></div>
      <map-control class="control" :viewer="viewer"></map-control>
    </div>

  </div>
</template>

<script>
import ViewInit from "@/components/package/js/ViewInit";
//组件
import MapControl from "@/components/package/component/MapControl.vue";
export default {
  components: {
    MapControl,
  },

  data() {
    return {
      viewer: null,
      isFullScreen: false,//全屏开关
    };
  },

  computed: {},

  mounted() {
    ViewInit.initGlobe()
    this.viewer = ViewInit.viewer
  },

  methods: {},
};
</script>
<style lang="less" scoped>
.content {
  position: relative;

  .control {
    position: absolute;
    bottom: 80px;
    right: 40px;
  }
}
</style>
