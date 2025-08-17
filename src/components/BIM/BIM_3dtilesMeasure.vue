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
      //测量
      point1: null,
      point2: null,
      point1GeoPosition: null, //点位置
      point2GeoPosition: null,
      polyline1: null, //连接线
      polyline2: null,
      polyline3: null,
      distanceLabel: null, //测量距离标签
      verticalLabel: null, //垂直距离标签
      horizontalLabel: null, //水平距离标签
      label: {
        font: "14px monospace",
        showBackground: true,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        pixelOffset: new Cesium.Cartesian2(0, 0),
        eyeOffset: new Cesium.Cartesian3(0, 0, -50),
        fillColor: Cesium.Color.WHITE,
        text: null,
      },
    };
  },

  computed: {},

  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      selectionIndicator: false,
      animation: false,
      shouldAnimate: false,
      homeButton: false,
      fullscreenButton: false,
      baseLayerPicker: false,
      geocoder: false,
      timeline: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      infoBox: false,
      requestRenderMode: false,
      scene3DOnly: false,
      sceneMode: 3,
      fullscreenElement: document.body,
      contextOptions: {
        webgl: {
          alpha: false,
        },
      },
    });
    //this.viewer.scene.globe.depthTestAgainstTerrain = true;//开启深度检查
    const tileset = this.viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: "data/3dtiles/bim/tileset.json",
      })
    );
    tileset.readyPromise.then((tileset) => {
      this.viewer.zoomTo(
        tileset,
        new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 4.0)
      );
    });

    /**
     * 鼠标样式
     */
    this.viewer.screenSpaceEventHandler.setInputAction((movement) => {
      const pickedFeature = this.viewer.scene.pick(movement.endPosition);
      if (pickedFeature) {
        this.viewer.enableCursorStyle = false;
        this.viewer._element.style.cursor = "";
        document.documentElement.style.cursor = "pointer";
        // document.body.classList.add('draw-cursor') // 设置为自定义的图标
      } else {
        this.viewer.enableCursorStyle = true;
        document.documentElement.style.cursor = "";
        // document.body.classList.remove('draw-cursor')
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    /**
     * 3dtiles测量
     */
    let points = this.viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection()); //点集合
    let polylines = this.viewer.scene.primitives.add(new Cesium.PolylineCollection()); //绘制线集合
    //单击事件
    let scene = this.viewer.scene;
    let globe = scene.globe;
    let camera = this.viewer.camera;
    let handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    let LINEPOINTCOLOR = Cesium.Color.RED; //线点颜色
    handler.setInputAction((click) => {
      if (scene.mode !== Cesium.SceneMode.MORPHING) {
        //2d,3d模式之间变换
        let pickedObject = scene.pick(click.position);
        if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
          let cartesian = this.viewer.scene.pickPosition(click.position); //点击位置坐标
          if (Cesium.defined(cartesian)) {
            //先移除(从新测量)
            if (points.length === 2) {
              points.removeAll();
              polylines.removeAll();
              this.viewer.entities.remove(this.distanceLabel);
              this.viewer.entities.remove(this.horizontalLabel);
              this.viewer.entities.remove(this.verticalLabel);
            }
            //添加第一个点(如果点集为空的情况下)
            if (points.length === 0) {
              this.point1 = points.add({
                position: new Cesium.Cartesian3(cartesian.x, cartesian.y, cartesian.z),
                color: LINEPOINTCOLOR,
              });
            } else if (points.length === 1) {
              //添加第二个点线
              this.point2 = points.add({
                position: new Cesium.Cartesian3(cartesian.x, cartesian.y, cartesian.z),
                color: LINEPOINTCOLOR,
              });
              //点123的几何位置
              this.point1GeoPosition = Cesium.Cartographic.fromCartesian(
                this.point1.position
              );
              this.point2GeoPosition = Cesium.Cartographic.fromCartesian(
                this.point2.position
              );
              this.point3GeoPosition = Cesium.Cartographic.fromCartesian(
                new Cesium.Cartesian3(
                  this.point2.position.x,
                  this.point2.position.y,
                  this.point1.position.z
                )
              );
              //计算线123坐标
              let pl1Positions = [
                new Cesium.Cartesian3.fromRadians(
                  this.point1GeoPosition.longitude,
                  this.point1GeoPosition.latitude,
                  this.point1GeoPosition.height
                ),
                new Cesium.Cartesian3.fromRadians(
                  this.point2GeoPosition.longitude,
                  this.point2GeoPosition.latitude,
                  this.point2GeoPosition.height
                ),
              ];
              let pl2Positions = [
                new Cesium.Cartesian3.fromRadians(
                  this.point2GeoPosition.longitude,
                  this.point2GeoPosition.latitude,
                  this.point2GeoPosition.height
                ),
                new Cesium.Cartesian3.fromRadians(
                  this.point2GeoPosition.longitude,
                  this.point2GeoPosition.latitude,
                  this.point1GeoPosition.height
                ),
              ];
              let pl3Positions = [
                new Cesium.Cartesian3.fromRadians(
                  this.point1GeoPosition.longitude,
                  this.point1GeoPosition.latitude,
                  this.point1GeoPosition.height
                ),
                new Cesium.Cartesian3.fromRadians(
                  this.point2GeoPosition.longitude,
                  this.point2GeoPosition.latitude,
                  this.point1GeoPosition.height
                ),
              ];
              //生成线123
              this.polyline1 = polylines.add({
                show: true,
                positions: pl1Positions,
                width: 1,
                material: new Cesium.Material({
                  fabric: {
                    type: "Color",
                    uniforms: {
                      color: LINEPOINTCOLOR,
                    },
                  },
                }),
              });
              this.polyline2 = polylines.add({
                show: true,
                positions: pl2Positions,
                width: 1,
                material: new Cesium.Material({
                  fabric: {
                    type: "PolylineDash",
                    uniforms: {
                      color: LINEPOINTCOLOR,
                    },
                  },
                }),
              });
              this.polyline3 = polylines.add({
                show: true,
                positions: pl3Positions,
                width: 1,
                material: new Cesium.Material({
                  fabric: {
                    type: "PolylineDash",
                    uniforms: {
                      color: LINEPOINTCOLOR,
                    },
                  },
                }),
              });
              //添加标签
              let labelZ; //Z标签的数值
              if (this.point2GeoPosition.height >= this.point1GeoPosition.height) {
                labelZ =
                  this.point1GeoPosition.height +
                  (this.point2GeoPosition.height - this.point1GeoPosition.height) / 2.0;
              } else {
                labelZ =
                  this.point2GeoPosition.height +
                  (this.point1GeoPosition.height - this.point2GeoPosition.height) / 2.0;
              }
              this.addDistanceLabel(this.point1, this.point2, labelZ);
            }
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  },

  methods: {
    addDistanceLabel(point1, point2, height) {
      //笛卡尔转WGS84弧度
      let ellipsoid = Cesium.Ellipsoid.WGS84;
      point1.cartographic = ellipsoid.cartesianToCartographic(point1.position);
      point2.cartographic = ellipsoid.cartesianToCartographic(point2.position);
      //WGS84弧度转WGS84经纬度
      point1.longitude = parseFloat(Cesium.Math.toDegrees(point1.position.x));
      point1.latitude = parseFloat(Cesium.Math.toDegrees(point1.position.y));
      point2.longitude = parseFloat(Cesium.Math.toDegrees(point2.position.x));
      point2.latitude = parseFloat(Cesium.Math.toDegrees(point2.position.y));

      //添加水平标签
      this.label.text = this.getHorizontalDistanceString(point1, point2);
      this.horizontalLabel = this.viewer.entities.add({
        position: this.getMidpoint(point1, point2, this.point1GeoPosition.height),
        label: this.label,
      });

      //添加垂直标签
      this.label.text = this.getVerticalDistanceString();
      this.verticalLabel = this.viewer.entities.add({
        position: this.getMidpoint(point2, point2, height),
        label: this.label,
      });

      //添加测量距离标签
      this.label.text = this.getDistanceString(point1, point2);
      this.distanceLabel = this.viewer.entities.add({
        position: this.getMidpoint(point1, point2, height),
        label: this.label,
      });
    },
    //获取水平标签距离数值
    getHorizontalDistanceString(point1, point2) {
      //EllipsoidGeodesic
      //是一种沿着地球表面的曲线，沿着该曲线移动最短距离，即大圆弧。
      //而不是直接在三维空间中画线连接两个点，
      //因为地球是一个椭球体，不能简单地将地球视为平面
      let geodesic = new Cesium.EllipsoidGeodesic();
      geodesic.setEndPoints(point1.cartographic, point2.cartographic);
      // surfaceDistance 方法来计算地球表面上两个点之间的测地线距离（单位为米）
      let meters = geodesic.surfaceDistance.toFixed(2);
      if (meters >= 1000) {
        return (meters / 1000).toFixed(1) + " км";
      }
      return meters + " м";
    },
    //获取垂直标签距离数值
    getVerticalDistanceString() {
      let heights = [this.point1GeoPosition.height, this.point2GeoPosition.height];
      let meters = Math.max.apply(Math, heights) - Math.min.apply(Math, heights);
      if (meters >= 1000) {
        return (meters / 1000).toFixed(1) + " км";
      }
      return meters.toFixed(2) + " м";
    },
    //获取测量距离标签距离数值
    getDistanceString(point1, point2) {
      let geodesic = new Cesium.EllipsoidGeodesic();
      geodesic.setEndPoints(point1.cartographic, point2.cartographic);
      let horizontalMeters = geodesic.surfaceDistance.toFixed(2);
      let heights = [this.point1GeoPosition.height, this.point2GeoPosition.height];
      let verticalMeters = Math.max.apply(Math, heights) - Math.min.apply(Math, heights);
      let meters = Math.pow(
        Math.pow(horizontalMeters, 2) + Math.pow(verticalMeters, 2),
        0.5
      );

      if (meters >= 1000) {
        return (meters / 1000).toFixed(1) + " км";
      }
      return meters.toFixed(2) + " м";
    },
    //获取中点
    getMidpoint(point1, point2, height) {
      let geodesic = new Cesium.EllipsoidGeodesic();
      let scratch = new Cesium.Cartographic();
      geodesic.setEndPoints(point1.cartographic, point2.cartographic);
      //interpolateUsingFraction()提供沿测地线在指定距离上点的位置
      let midpointCartographic = geodesic.interpolateUsingFraction(0.5, scratch);
      return Cesium.Cartesian3.fromRadians(
        midpointCartographic.longitude,
        midpointCartographic.latitude,
        height
      );
    },
  },
};
</script>
<style></style>
