<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="control"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";

import createEdgeStage from "../utils/interaction/createEdgeStage";
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
      infoBox: false,
      selectionIndicator: false,
      geocoder: false,
    });
    this.viewer.resolutionScale = devicePixelRatio;
    this.viewer.postProcessStages.fxaa.enabled = true;
    // this.viewer.scene.globe.depthTestAgainstTerrain = true;
    this.viewer.scene.logarithmicDepthBuffer = false; //防止面片闪烁

    //primitive_3dtiles
    this.tileset = this.viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: "data/3dtiles/BuildingBlue/tileset.json",
      })
    );
    this.tileset.readyPromise.then((tileset) => {
      this.viewer.zoomTo(
        tileset,
        new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 4.0)
      );
    });

    //Primitive_gltf
    const Primitive_gltf = this.viewer.scene.primitives.add(
      Cesium.Model.fromGltf({
        url: "data/model/Cesium_Air.glb",
        show: true,
        scale: 2.0,
        minimumPixelSize: 128,
        maximumScale: 20000,
        allowPicking: true,
        debugShowBoundingVolume: false,
        debugWireframe: false,
        modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
          Cesium.Cartesian3.fromDegrees(116.3841, 39.90784)
        ),
      })
    );

    //Primitive_billboard
    let Primitive_billboard = this.viewer.scene.primitives.add(
      new Cesium.BillboardCollection()
    );
    Primitive_billboard.add({
      image: "images/icon/radar.png",
      scale: 0.1,
      sizeInMeters: true, //图像的尺寸被指定成图像实际的尺寸
      translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.2), //透明度
      position: Cesium.Cartesian3.fromDegrees(116.38759, 39.90967),
    });

    //Primitive_point1//方式1
    // let Primitive_point1 = this.viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
    // Primitive_point1.add({
    //     position: new Cesium.Cartesian3.fromDegrees(116.389030, 39.907500),
    //     color: Cesium.Color.YELLOW
    // });

    //Primitive_point2//方式2
    let Primitive_point2 = this.viewer.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.CircleGeometry({
            center: Cesium.Cartesian3.fromDegrees(116.39158, 39.90689),
            radius: 30.0,
            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
          }),
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLACK),
          },
        }),
        appearance: new Cesium.PerInstanceColorAppearance({
          closed: true,
        }),
      })
    );

    //Primitive_polyline(PolylineCollection略)
    let Primitive_polyline = this.viewer.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.PolylineGeometry({
            positions: Cesium.Cartesian3.fromDegreesArray([
              116.37727,
              39.90572,
              116.4053,
              39.90638,
            ]),
            width: 10.0,
            vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
          }),
        }),
        appearance: new Cesium.PolylineMaterialAppearance({
          material: Cesium.Material.fromType(Cesium.Material.PolylineGlowType),
        }),
      })
    );

    //Primitive_polygon
    let Primitive_polygon = this.viewer.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: Cesium.CoplanarPolygonGeometry.fromPositions({
            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              116.39236,
              39.90828,
              0,
              116.39239,
              39.90747,
              0,
              116.39469,
              39.90755,
              0,
              116.39466,
              39.90835,
              0,
            ]),
          }),
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLACK),
          },
        }),
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: false,
          closed: false,
        }),
      })
    );

    //Entity_gltf
    const Entity_gltf = this.viewer.entities.add({
      id: 1,
      name: "Entity_gltf",
      position: new Cesium.Cartesian3.fromDegrees(116.3842, 39.90315),
      model: {
        uri: "data/model/Cesium_Air.glb",
        minimumPixelSize: 128,
        maxumunScale: 20000,
      },
    });

    //Entity_billboard
    let Entity_billboard = this.viewer.entities.add({
      id: 2,
      name: "Entity_billboard",
      show: true,
      position: new Cesium.Cartesian3.fromDegrees(116.38637, 39.9037),
      billboard: {
        image: "images/icon/icon_Red.png",
        scale: 0.5,
        sizeInMeters: true, //图像的尺寸被指定成图像实际的尺寸
        translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.2), //透明度
      },
    });

    //Entity_point
    //point的方式识别不到
    //ellipsoid的方式可以

    // let Entity_point = this.viewer.entities.add({
    //     id: 3,
    //     name: 'Entity_point',
    //     position: Cesium.Cartesian3.fromDegrees(116.389650, 39.903500),
    //     point: {
    //         pixelSize: 50,
    //         color: Cesium.Color.fromCssColorString('#ee0000'),
    //     },
    // })

    let Entity_point = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(116.38965, 39.9035),
      ellipsoid: {
        radii: new Cesium.Cartesian3(15, 15, 0.1),
        material: Cesium.Color.RED,
      },
    });

    //Entity_polyline
    let Entity_polyline = this.viewer.entities.add({
      id: 4,
      name: "Entity_polyline",
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          116.37656,
          39.90424,
          116.40525,
          39.90519,
        ]),
        width: 2,
        material: Cesium.Color.RED,
        //clampToGround: true, //（接地）鼠标滑动显示边框不能添加这个属性
      },
    });

    //Entity_polygon
    let Entity_polygon = this.viewer.entities.add({
      id: 5,
      name: "Entity_polygon",
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray([
          116.39439,
          39.90416,
          116.39444,
          39.90313,
          116.39665,
          39.9032,
          116.39663,
          39.90425,
        ]),
        // 填充的颜色，withAlpha透明度
        material: Cesium.Color.RED,
        // 恒定高度
        height: 1, //（必须）鼠标滑动显示边框不能添加这个属性
      },
    });

    //单击事件(pick只选中最上层的feature)
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    handler.setInputAction((movement) => {
      let pickedFeature = this.viewer.scene.pick(movement.position);
      let pickedFeatureResult = this.pickFeatureFromScreen(pickedFeature);
      if (pickedFeatureResult) {
        let { type } = pickedFeatureResult;
        switch (type) {
          case "Entity":
            this.isEntity(pickedFeatureResult);
            break;
          case "Cesium3DTileset":
            this.isCesium3DTileset(pickedFeatureResult);
            break;
          case "Billboard":
            this.isBillboard(pickedFeatureResult);
            break;
          case "Primitive":
            this.isPrimitive(pickedFeatureResult);
            break;
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    /**
     * 悬浮事件
     */

    //方式1：后期处理（支持Entity、Primitive方式添加的Model、Billboard、Point）
    // const fragmentShaderSource = "uniform sampler2D colorTexture;\n" +
    //     "varying vec2 v_textureCoordinates;\n" +
    //     "uniform vec4 highlight;\n" +
    //     "void main() {\n" +
    //     "    vec4 color = texture2D(colorTexture, v_textureCoordinates);\n" +
    //     "    if (czm_selected()) {\n" +
    //     "        vec3 highlighted = highlight.a * highlight.rgb + (1.0 - highlight.a) * color.rgb;\n" +
    //     "        gl_FragColor = vec4(highlighted, 1.0);\n" +
    //     "    } else { \n" +
    //     "        gl_FragColor = color;\n" +
    //     "    }\n" +
    //     "}\n";
    // let stage = this.viewer.scene.postProcessStages.add(
    //     new Cesium.PostProcessStage({
    //         fragmentShader: fragmentShaderSource,
    //         uniforms: {
    //             highlight: function () {
    //                 return new Cesium.Color(1.0, 1.0, 1.0, 0.5);
    //             },
    //         },
    //     })
    // );
    // stage.selected = [];
    // handler.setInputAction(movement => {
    //     const pickedObject = this.viewer.scene.pick(movement.endPosition);
    //     if (Cesium.defined(pickedObject)) {
    //         stage.selected = [pickedObject.primitive];
    //     } else {
    //         stage.selected = [];
    //     }
    // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    //方式2 Three+后期处理方式
    handler.setInputAction((movement) => {
      let picked = this.viewer.scene.pick(movement.endPosition);
      //鼠标手势
      if (picked) {
        // 鼠标滑过模型
        this.viewer.enableCursorStyle = false;
        this.viewer._element.style.cursor = "";
        document.documentElement.style.cursor = "pointer";
        // document.body.classList.add('draw-cursor') // 设置为自定义的图标
      } else {
        // 鼠标滑过场景
        this.viewer.enableCursorStyle = true;
        document.documentElement.style.cursor = "";
        // document.body.classList.remove('draw-cursor')
      }

      edgeStage.selected = [];
      edgeStage.enabled = false;

      /**
       * Cesium后期处理两个类都提供selected属性，
       * 用来生成选中对象id查询纹理。
       * selected接受的对象只有一个要求：包含pickId或者pickIds属性。
       * 凡是可以通过Cesium.Scene pick方法拾取到的对象，都可以找到对应的pickId，反过来，
       * 如果想要被pick到，也需要在创建DrawCommand的时候生成pickId。
       * 底层不同对象构建pickId的逻辑差别很大，导致获取pickId的方法也不尽相同。
       *
       *
       * Entity和Primitive 从picked.primitive._pickIds查找;
       * (billboard好像是picked.primitive._pickId)
       * 3D Tiles要素 已单体化的要素：picked.pickId；
       * 未单体化的瓦片：picked.content._model._pickIds;
       */
      if (picked && picked.primitive) {
        let primitive = picked.primitive;
        let pickIds = primitive._pickIds; //Entity、Primitive
        let pickId = picked.pickId; //已经单体化的3D Tiles或者其他pickObject本身带有pickId属性的情况
        let pickIdBillboard = primitive._pickId; //Billboard特殊
        //未单体化的3DTiles
        if (!pickId && !pickIds && picked.content) {
          pickIds = picked.content._model._pickIds;
        }
        //entity&&primitive
        //（有时候选不中billboard是因为cesium角度的问题）
        if (!pickId) {
          if (picked.id) {
            //entity
            if (pickIdBillboard) {
              pickId = pickIdBillboard;
            } else {
              pickId = pickIds.find((pickId) => {
                return pickId.object == picked;
              });
            }
          } else if (pickIdBillboard || pickIds) {
            //primitive
            if (pickIdBillboard) {
              pickId = pickIdBillboard;
            } else {
              pickId = pickIds[0];
            }
          }
        }
        //单体化的3DTiles
        if (pickId) {
          let pickObject = {
            pickId: pickId,
          };
          edgeStage.selected = [pickObject];
          cesiumStage.selected = [pickObject];
          edgeStage.enabled = !cesiumStage.enabled;
        } else {
          console.log("未找到pickId");
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    var edgeStage = createEdgeStage();
    edgeStage.visibleEdgeColor = Cesium.Color.fromCssColorString("#ffe404");
    edgeStage.hiddenEdgeColor = Cesium.Color.fromCssColorString("#ffe404");
    edgeStage.selected = [];
    edgeStage.enabled = false;
    this.viewer.postProcessStages.add(edgeStage);

    var cesiumStage = Cesium.PostProcessStageLibrary.createSilhouetteStage();
    cesiumStage.enabled = false;
    this.viewer.postProcessStages.add(cesiumStage);
  },

  methods: {
    isEntity(data) {
      console.log(data, "Entity");
    },
    isCesium3DTileset(data) {
      console.log(data, "Cesium3DTileset");
    },
    isBillboard(data) {
      console.log(data, "Billboard");
    },
    isPrimitive(data) {
      console.log(data, "Primitive");
    },

    /**
     * cesium鼠标拾取要素，并判断要素类别
     * 支持Entity(包含entity方式添加的Billboard、model等)、Cesium3DTileset、Primitive-Billboard、Primitive、Model
     * 不支持Collection添加的点、线、面（可以扩展，不常用）
     */
    pickFeatureFromScreen(feature) {
      // 存放拾取结果
      let resp = {
        pickResult: null,
      };
      // 判断拾取结果
      if (Cesium.defined(feature)) {
        resp.pickResult = feature; // 拾取结果
        //hasOwnProperty(propertyName)方法 是用来检测属性是否为对象的自有属性，如果是，返回true，否者false;
        if (feature.hasOwnProperty("id") && feature.id instanceof Cesium.Entity) {
          // 是entity: {collection, id, primitive}
          resp.type = "Entity";
          resp.detailType = feature.primitive.constructor.name; //entity的细节分类再去做判断
          resp.entity = feature.id;
        } else if (feature.primitive instanceof Cesium.Cesium3DTileset) {
          // 是3DTile: {content, primitive}
          resp.type = "Cesium3DTileset";
        } else if (feature.primitive instanceof Cesium.Billboard) {
          // 是primitive-billboard: {collection, id, primitive}
          resp.type = "Billboard";
          resp.id = feature.id;
          resp.billboardCollection = feature.collection;
          resp.billboard = feature.primitive;
        } else if (feature.primitive instanceof Cesium.Primitive) {
          // 是primitive: { primitive}
          resp.type = "Primitive";
          resp.primitive = feature.primitive;
        } else if (feature.primitive instanceof Cesium.Model) {
          // 是mode
          resp.type = "Primitive";
          resp.detailType = "Model";
          resp.primitive = feature.primitive;
        }
      }
      return resp;
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
