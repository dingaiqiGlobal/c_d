<template>
  <div>
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
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer");
    //this.viewer.scene.globe.depthTestAgainstTerrain = true;//开启深度检

    //跟着官方示例，在重构

    var dataSourceForCluster = new Cesium.CustomDataSource("cluster");
    var count = 100;
    for (var i = 0; i < count; ++i) {
      dataSourceForCluster.entities.add({
        id: "" + i,
        position: new Cesium.Cartesian3.fromDegrees(
          Math.random() * 100,
          Math.random() * 100,
          10000
        ),
        billboard: {
          image: "images/icon/icon_MiYun.png",
          height: 30,
          width: 30,
        },
      });
    }
    var dataSourcePromise = this.viewer.dataSources.add(dataSourceForCluster);

    dataSourcePromise.then(function (dataSource) {
      var pixelRange = 15;
      var minimumClusterSize = 3;
      var enabled = true;
      dataSource.clustering.enabled = enabled;
      dataSource.clustering.pixelRange = pixelRange;
      dataSource.clustering.minimumClusterSize = minimumClusterSize;

      var pinBuilder = new Cesium.PinBuilder(); //cesium自带的小尾巴
      var pin50 = pinBuilder.fromText("50+", Cesium.Color.RED, 48).toDataURL();
      var pin40 = pinBuilder.fromText("40+", Cesium.Color.ORANGE, 48).toDataURL();
      var pin30 = pinBuilder.fromText("30+", Cesium.Color.YELLOW, 48).toDataURL();
      var pin20 = pinBuilder.fromText("20+", Cesium.Color.GREEN, 48).toDataURL();
      var pin10 = pinBuilder.fromText("10+", Cesium.Color.BLUE, 48).toDataURL();

      var singleDigitPins = new Array(8);
      for (var i = 0; i < singleDigitPins.length; ++i) {
        singleDigitPins[i] = pinBuilder
          .fromText("" + (i + 2), Cesium.Color.VIOLET, 48)
          .toDataURL();
      }
      dataSource.clustering.clusterEvent.addEventListener(function (
        clusteredEntities,
        cluster
      ) {
        cluster.label.show = false;
        cluster.billboard.show = true;
        cluster.billboard.id = cluster.label.id;
        cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

        if (clusteredEntities.length >= 50) {
          cluster.billboard.image = pin50;
        } else if (clusteredEntities.length >= 40) {
          cluster.billboard.image = pin40;
        } else if (clusteredEntities.length >= 30) {
          cluster.billboard.image = pin30;
        } else if (clusteredEntities.length >= 20) {
          cluster.billboard.image = pin20;
        } else if (clusteredEntities.length >= 10) {
          cluster.billboard.image = pin10;
        } else {
          cluster.billboard.image = singleDigitPins[clusteredEntities.length - 2];
        }
      });
    });
  },

  methods: {},
};
</script>
<style></style>
