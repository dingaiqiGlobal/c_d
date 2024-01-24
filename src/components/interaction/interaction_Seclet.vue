<template>
    <div>
        <div id="cesiumContainer"></div>
        <div class="control">
        </div>
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
            tileset: null,
        };
    },

    computed: {},

    mounted() {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
        this.viewer = new Cesium.Viewer("cesiumContainer", {
            infoBox: false
        })
        //primitive_3dtiles
        this.tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: 'data/3dtiles/BuildingBlue/tileset.json',
            })
        );
        this.tileset.readyPromise
            .then(tileset => {
                this.viewer.zoomTo(
                    tileset,
                    new Cesium.HeadingPitchRange(
                        0.5,
                        -0.2,
                        tileset.boundingSphere.radius * 4.0
                    )
                );
            })

        //Primitive_gltf
        const Primitive_gltf = this.viewer.scene.primitives.add(
            Cesium.Model.fromGltf({
                url: 'data/model/Cesium_Air.glb',
                show: true,
                scale: 2.0,
                minimumPixelSize: 128,
                maximumScale: 20000,
                allowPicking: true,
                debugShowBoundingVolume: false,
                debugWireframe: false,
                modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
                    Cesium.Cartesian3.fromDegrees(116.384100, 39.907840)
                ),
            })
        );

        //Primitive_billboard
        let Primitive_billboard = this.viewer.scene.primitives.add(new Cesium.BillboardCollection());
        Primitive_billboard.add({
            image: 'images/icon/radar.png',
            scale: 0.1,
            sizeInMeters: true, //图像的尺寸被指定成图像实际的尺寸
            translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.2),//透明度
            position: Cesium.Cartesian3.fromDegrees(116.387590, 39.909670)
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
                        center: Cesium.Cartesian3.fromDegrees(116.391580, 39.906890),
                        radius: 15.0,
                        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                    }),
                    attributes: {
                        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                            Cesium.Color.YELLOW
                        ),
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
                            116.377270,
                            39.905720,
                            116.405300,
                            39.906380,
                        ]),
                        width: 10.0,
                        vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
                    }),
                }),
                appearance: new Cesium.PolylineMaterialAppearance({
                    material: Cesium.Material.fromType(
                        Cesium.Material.PolylineGlowType
                    ),
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
                            116.392360, 39.908280, 0,
                            116.392390, 39.907470, 0,
                            116.394690, 39.907550, 0,
                            116.394660, 39.908350, 0
                        ]),
                    }),
                    attributes: {
                        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                            Cesium.Color.YELLOW
                        ),
                    }
                }),
                appearance: new Cesium.PerInstanceColorAppearance({
                    translucent: false,
                    closed: false,
                }),

            })
        );

        //Entity_gltf
        const Entity_gltf = this.viewer.entities.add({
            id: 2,
            name: "Entity_gltf",
            position: new Cesium.Cartesian3.fromDegrees(116.384200, 39.903150),
            model: {
                uri: 'data/model/CesiumDrone.glb',
                minimumPixelSize: 128,
                maxumunScale: 20000,
            },
        });

        //Entity_billboard
        let Entity_billboard = this.viewer.entities.add({
            id: 4,
            name: 'Entity_billboard',
            show: true,
            position: new Cesium.Cartesian3.fromDegrees(116.386370, 39.903700),
            billboard: {
                image: 'images/icon/icon_Red.png',
                scale: 0.5,
                sizeInMeters: true, //图像的尺寸被指定成图像实际的尺寸
                translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.2),//透明度
            }
        })

        //Entity_point
        let Entity_point = this.viewer.entities.add({
            id: 5,
            name: 'Entity_point',
            position: Cesium.Cartesian3.fromDegrees(116.389650, 39.903500),
            point: {
                pixelSize: 10,
                color: Cesium.Color.RED,
            },
        })

        //Entity_polyline
        let Entity_polyline = this.viewer.entities.add({
            id: 6,
            name: 'Entity_polyline',
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([116.376560, 39.904240, 116.405250, 39.905190]),
                width: 5,
                material: Cesium.Color.RED,
                clampToGround: true,
            }
        })

        //Entity_polygon
        let Entity_polygon = this.viewer.entities.add({
            id: 7,
            name: 'Entity_polyline',
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray([
                    116.394390, 39.904160,
                    116.394440, 39.903130,
                    116.396650, 39.903200,
                    116.396630, 39.904250

                ]),
                material: Cesium.Color.RED,
            }
        })


        //单击事件(pick只选中最上层的feature)
        const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        handler.setInputAction(movement => {
            let pickedFeature = this.viewer.scene.pick(movement.position);
            let pickedFeatureResult = this.pickFeatureFromScreen(pickedFeature);
            if (pickedFeatureResult) {
                let { type } = pickedFeatureResult;
                switch (type) {
                    case 'Entity':
                        this.isEntity(pickedFeatureResult);
                        break;
                    case 'Cesium3DTileset':
                        this.isCesium3DTileset(pickedFeatureResult);
                        break;
                    case 'Billboard':
                        this.isBillboard(pickedFeatureResult);
                        break;
                    case 'Primitive':
                        this.isPrimitive(pickedFeatureResult);
                        break;
                }
            }
            // let nowIsEntity = false;
            // let pickedEntity = null;
            // if (Cesium.defined(pickedFeature)) {
            //     console.log(pickedFeature);
            //     //如果是entity
            //     if (typeof (pickedFeature.id) !== "undefined") {
            //         pickedEntity = entityCollection.getById(pickedFeature.id.id);
            //         pickedEntity.model.color = Cesium.Color.RED;
            //         pickedEntity.model.colorBlendAmount = 0.5;
            //         nowIsEntity = true;
            //     }
            //     //如果是primitive
            //     else if (typeof (pickedFeature.id) == "undefined") {
            //         this.lastPrimitiveColor = pickedFeature.color;
            //         console.log(`this.lastPrimitiveColor为:${this.lastPrimitiveColor}`);
            //         pickedFeature.color = Cesium.Color.RED;
            //         console.log(pickedFeature.getProperty("name"));
            //     }

            //     //第一次点击，则只需要记住当前物体，以便点击其他物体时候恢复改物体颜色
            //     if (this.pickedEntity === null && nowIsEntity) {
            //         this.pickedEntity = pickedEntity;
            //         this.lastIsEntity = true;
            //         return;
            //     } else if (this.lastFeature === null && !nowIsEntity) {
            //         this.lastFeature = pickedFeature;
            //         this.lastIsEntity = false;
            //         return;
            //     }

            //     //不是第一次点击，则需将上一次点击的物体恢复原本的颜色
            //     if (nowIsEntity) {
            //         this.pickedEntity.model.colorBlendAmount = 0;//设置模型颜色与透明度
            //         this.pickedEntity = pickedEntity;
            //         this.lastIsEntity = true;
            //         return;
            //     } else if (!nowIsEntity) {
            //         this.lastFeature.color = this.lastPrimitiveColor;
            //         console.log(`this.lastFeature.tileset.color为:${this.lastFeature.tileset.color}`);
            //         this.lastFeature = pickedFeature;
            //         this.lastIsEntity = false;
            //         return;
            //     }

            // }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)


    },


    methods: {
        isEntity(data) {
            console.log(data, 'Entity');
        },
        isCesium3DTileset(data) {
            console.log(data, 'Cesium3DTileset');
        },
        isBillboard(data) {
           console.log(data, 'Billboard');
        },
        isPrimitive(data) {
            console.log(data, 'Primitive');
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
            }
            // 判断拾取结果
            if (Cesium.defined(feature)) {
                resp.pickResult = feature // 拾取结果
                //hasOwnProperty(propertyName)方法 是用来检测属性是否为对象的自有属性，如果是，返回true，否者false; 
                if (feature.hasOwnProperty('id') && feature.id instanceof Cesium.Entity) {
                    // 是entity: {collection, id, primitive}
                    resp.type = 'Entity'
                    resp.detailType = feature.primitive.constructor.name//entity的细节分类再去做判断
                    resp.entity = feature.id
                } else if (feature.primitive instanceof Cesium.Cesium3DTileset) {
                    // 是3DTile: {content, primitive}
                    resp.type = 'Cesium3DTileset'
                } else if (feature.primitive instanceof Cesium.Billboard) {
                    // 是primitive-billboard: {collection, id, primitive}
                    resp.type = 'Billboard'
                    resp.id = feature.id
                    resp.billboardCollection = feature.collection
                    resp.billboard = feature.primitive
                } else if (feature.primitive instanceof Cesium.Primitive) {
                    // 是primitive: { primitive}
                    resp.type = 'Primitive'
                    resp.primitive = feature.primitive
                } else if (feature.primitive instanceof Cesium.Model) {
                    // 是mode
                    resp.type = 'Primitive'
                    resp.detailType = 'Model'
                    resp.primitive = feature.primitive
                }
            }
            return resp
        },


    }
}
</script>
<style>
.control {
    position: absolute;
    z-index: 999;
    left: 10px;
    top: 10px;
}
</style>
