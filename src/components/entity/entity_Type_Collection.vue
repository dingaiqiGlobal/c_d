<template>
    <div class="model-wrap">
        <div class="select-wrap">
            <a-select v-dark default-value="billboard" style="width: 220px" @change="handleChange">
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
                    name: "billboard",
                },
                {
                    name: "box",
                },
                {
                    name: "corridor",
                },
                {
                    name: "cylinder",
                },
                {
                    name: "ellipse",
                },
                {
                    name: "ellipsoid",
                },
                {
                    name: "label",
                },
                {
                    name: "model",
                },
                {
                    name: "tileset",
                },
                {
                    name: "plane",
                },
                {
                    name: "point",
                },
                {
                    name: "polygon",
                },
                {
                    name: "polyline",
                },
                {
                    name: "polylineVolume",
                },
                {
                    name: "rectangle",
                },
                {
                    name: "wall",
                }
            ]
        };
    },

    computed: {},

    mounted() {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
        this.viewer = new Cesium.Viewer("cesiumContainer")
        this.handleChange(0);
    },

    methods: {
        handleChange(index) {
            if (Cesium.defined(this.viewer.entities)) {
                this.viewer.entities.removeAll()
            }
            const item = this.selectData[index].name;
            let select = {
                billboard: this.addbillboard,
                box: this.addbox,
                corridor: this.addcorridor,
                cylinder: this.addcylinder,
                ellipse: this.addellipse,
                ellipsoid: this.addellipsoid,
                label: this.addlabel,
                model: this.addmodel,
                tileset: this.addtileset,
                //path1:this.addpath1,
                plane: this.addplane,
                point: this.addpoint,
                polygon: this.addpolygon,
                polyline: this.addpolyline,
                polylineVolume: this.addpolylineVolume,
                rectangle: this.addrectangle,
                wall: this.addwall,

            };
            select[item] && select[item]();

        },
        addbillboard() {
            let entity = new Cesium.Entity({
                id: "",
                name: "billboard",
                //show: true,
                description: "",//描述
                position: Cesium.Cartesian3.fromDegrees(116.389850, 39.905790),
                orientation: "",//方向
                billboard: {
                    show: true,
                    //当在.js文件中去引用本地图片，路径要通过require()的形式引入
                    image: 'images/icon/Cesium_Logo_overlay.png',
                    scale: 1.5,
                    pixelOffset: new Cesium.Cartesian2(100, -50),//像素偏移
                    eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),//眼睛偏移

                    /*水平对齐方式
                    type: HorizontalOrigin  
                    default: HorizontalOrigin.CENTER
                    CENTER 原点在对象的水平中心；
                    LEFT 原点在对象的左侧；
                    RIGHT 原点在对象的右侧
                    */
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,

                    /*垂直对齐方式  
                    type: VerticalOrigin  
                    default:VerticalOrigin.CENTER
                    CENTER 原点位于 BASELINE 和 TOP 之间的垂直中心;
                    BOTTOM 原点在对象的底部；
                    BASELINE 如果对象包含文本，则原点位于文本的基线，否则原点位于对象的底部；
                    TOP 原点在对象的顶部
                    */
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,

                    /*获取或设置此广告牌的高度参考(表示相对于地形的位置)    
                    type: HeightReference    d
                    efault:HeightReference.NONE
                    NONE 位置绝对；
                    CLAMP_TO_GROUND 位置固定在地形上；
                    RELATIVE_TO_GROUND 位置高度是指地形上方的高度
                    */
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,

                    color: Cesium.Color.LIME,
                    rotation: Cesium.Math.PI_OVER_FOUR,// 获取或设置以弧度为单位的旋转角度
                    alignedAxis: Cesium.Cartesian3.ZERO, // 获取或设置世界空间中的对齐轴
                    width: 100, // default: undefined
                    height: 25, // default: undefined

                    /*根据广告牌与相机的距离获取或设置广告牌的近和远缩放属性  
                    type: NearFarScalar
                    */
                    scaleByDistance: new Cesium.NearFarScalar(1.0e3, 2.0, 2.0e3, 1.0),

                    /*根据广告牌到相机的距离，获取或设置广告牌的近和远半透明属性
                    type:NearFarScalar
                    */
                    // translucencyByDistance: new Cesium.NearFarScalar(
                    //   1.0e3,
                    //   1.0,
                    //   1.5e6,
                    //   0.5
                    // ),

                    /*根据广告牌与摄像头的距离，获取或设置广告牌的近像素偏移量和远像素偏移量缩放属性  
                    type: NearFarScalar
                    */
                    pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
                        1.0e3,
                        1.0,
                        1.5e6,
                        0.0
                    ),

                    /*设置1000米和2000米之间可见  
                    type:DistanceDisplayCondition
                    */
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //     1.0e3,
                    //     2.0e3
                    // ),

                    /*设置为零时，将始终应用深度测试。
                    设置为Number.POSITIVE_INFINITY时，永远不会应用深度测试。
                    */
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                }
            })
            this.viewer.entities.add(entity);
            this.viewer.zoomTo(entity);

            // changeBillboardProperties
            var billboard = entity.billboard;
            billboard.scale = 3.0;
            billboard.color = Cesium.Color.WHITE.withAlpha(0.25);
        },
        addbox() {
            let entity = this.viewer.entities.add({
                name: "box",
                position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 3000.0),
                box: {
                    show: true,
                    //Cartesian3类型，用于指定框的长度，宽度和高度
                    dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 50000.0),
                    /**
                     * 指定距实体位置的高度是相对于什么的高度。
                     * default: HeightReference.NONE
                     * NONE	位置绝对；
                     * CLAMP_TO_GROUND	位置固定在地形上；
                     * RELATIVE_TO_GROUND 位置高度是指地形上方的高度。
                     */
                    heightReference: Cesium.HeightReference.NONE,
                    fill: true,
                    material: Cesium.Color.RED.withAlpha(1),
                    outline: false,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 1.0,
                    /**
                     * type:ShadowMode  default:ShadowMode.DISABLED
                     * DISABLED	对象不投射或接收阴影；
                     * ENABLED	对象投射并接收阴影；
                     * CAST_ONLY	对象仅投射阴影；
                     * RECEIVE_ONLY 该对象仅接收阴影。
                     */
                    shadows: Cesium.ShadowMode.DISABLED
                    /**
                     * 指定此框将显示在距离摄像机的距离
                     * 距离显示条件
                     * type:DistanceDisplayCondition,
                     */
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //   1.0e3,
                    //   2.0e3
                    // ),

                }
            });
            this.viewer.zoomTo(entity)
        },
        addcorridor() {
            /**
             * 走廊
             */
            let entity = this.viewer.entities.add({
                name: "corridor",
                corridor: {
                    show: true,
                    /**
                     * 指定定义走廊中心线的 Cartesian3 位置的数组  type: Cartesian3
                     */
                    positions: Cesium.Cartesian3.fromDegreesArray([
                        -80.0,
                        40.0,
                        -85.0,
                        40.0,
                        -85.0,
                        35.0,
                    ]),
                    width: 200000.0,
                    height: 200000.0,
                    heightReference: Cesium.HeightReference.NONE,
                    extrudedHeight: 100000.0,
                    extrudedHeightReference: Cesium.HeightReference.NONE,
                    /**
                     * 拐角的样式  
                     * type:CornerType  
                     * default:CornerType.ROUNDED
                     * ROUNDED	角有光滑的边缘；
                     * MITERED	拐角点是相邻边的交点；
                     * BEVELED	角被修剪
                     */
                    cornerType: Cesium.CornerType.ROUNDED,
                    /**
                     * 每个纬度和经度之间的距离
                     */
                    granularity: Cesium.Math.RADIANS_PER_DEGREE,
                    fill: true,
                    material: Cesium.Color.BLUE.withAlpha(0.5),
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 1.0,
                    /**
                     * type:ShadowMode  default:ShadowMode.DISABLED
                     * DISABLED	对象不投射或接收阴影；
                     * ENABLED	对象投射并接收阴影；
                     * CAST_ONLY	对象仅投射阴影；
                     * RECEIVE_ONLY 该对象仅接收阴影。
                     */
                    shadows: Cesium.ShadowMode.DISABLED,
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //   1.0e3,
                    //   2.0e3
                    // ),
                    /**
                     * 走廊在地面上时将对地形，3D tiles还是对两者进行分类 
                     * type:ClassificationType  
                     * default:ClassificationType.BOTH
                     * TERRAIN 将仅对地形进行分类;
                     * CESIUM_3D_TILE 将仅对3D Tiles进行分类;
                     * BOTH	将同时对Terrain和3D Tiles进行分类。
                     */
                    classificationType: Cesium.ClassificationType.BOTH,
                    zIndex: 1,
                }
            })
            this.viewer.zoomTo(entity)
        },
        addcylinder() {
            /**
             * 圆柱体
             */
            let entity = this.viewer.entities.add({
                name: "cylinder",
                position: Cesium.Cartesian3.fromDegrees(-105.0, 40.0, 200000.0),
                cylinder: {
                    show: true,
                    length: 400000.0, // 圆柱体长度
                    topRadius: 200000.0, // 圆柱体顶部半径
                    bottomRadius: 200000.0, // 圆柱体底部半径
                    heightReference: Cesium.HeightReference.NONE,
                    fill: true,
                    material: Cesium.Color.GREEN.withAlpha(0.5),
                    outline: true,
                    outlineColor: Cesium.Color.DARK_GREEN,
                    outlineWidth: 1.0,
                    /**
                     *沿轮廓的周长绘制的垂直线的数量 
                     */
                    numberOfVerticalLines: 16,
                    shadows: Cesium.ShadowMode.DISABLED,
                    /**
                     * 圆柱周围的边缘数量
                     */
                    slices: 128,
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //   1.0e3,
                    //   2.0e3
                    // ),
                },
            });
            this.viewer.zoomTo(entity);
        },
        addellipse() {
            /**
             * 圆或者椭圆   
             */
            let entity = this.viewer.entities.add({
                name: "Circles and Ellipses",
                position: Cesium.Cartesian3.fromDegrees(-95.0, 40.0, 100000.0),
                ellipse: {
                    show: true,
                    semiMajorAxis: 300000.0, // 长半轴距离
                    semiMinorAxis: 150000.0, // 短半轴距离
                    height: 20000.0,
                    heightReference: Cesium.HeightReference.NONE,
                    extrudedHeight: 20000.0,
                    extrudedHeightReference: Cesium.HeightReference.NONE,
                    /**
                     * 从北方逆时针旋转
                     */
                    rotation: Cesium.Math.toRadians(45),
                    /**
                     *纹理从北方逆时针旋转 
                     */
                    stRotation: 0.0,
                    /**
                     * 椭圆上各点之间的角距离
                     */
                    granularity: Cesium.Math.RADIANS_PER_DEGREE,
                    material: Cesium.Color.BLUE.withAlpha(0.5),
                    fill: true,
                    outline: true,
                    outlineColor: Cesium.Color.DARK_GREEN,
                    outlineWidth: 1.0,
                    /**
                     * 沿轮廓的周长绘制的垂直线的数量
                     */
                    numberOfVerticalLines: 16,
                    shadows: Cesium.ShadowMode.DISABLED,
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //   1.0e3,
                    //   2.0e3
                    // ),
                    classificationType: Cesium.ClassificationType.BOTH,
                    zIndex: 1,
                },
            });

            this.viewer.zoomTo(entity);
        },
        addellipsoid() {
            /**
             * 球体或者椭圆体
             */
            let entity = this.viewer.entities.add({
                name: "Spheres and Ellipsoids",
                position: Cesium.Cartesian3.fromDegrees(-100.0, 40.0, 300000.0),
                ellipsoid: {
                    show: true,
                    /**
                     *椭球半径 
                     */
                    radii: new Cesium.Cartesian3(200000.0, 200000.0, 300000.0),
                    //innerRadii: new Cesium.Cartesian3(0.0, 0.0, 0.0), // 椭球内部半径
                    minimumClock: 0.0, // 最小时钟角度
                    maximumClock: 2 * Math.PI, // 最大时钟角度
                    minimumCone: 0.0, // 最小圆锥角
                    maximumCone: Math.PI, // 最大圆锥角
                    heightReference: Cesium.HeightReference.NONE,
                    fill: true,
                    material: Cesium.Color.BLUE.withAlpha(0.5),
                    outline: true,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 1.0,
                    stackPartitions: 64, // 延纬度线切割的次数
                    slicePartitions: 64, // 延经度线切割的次数
                    subdivisions: 128, // 每个轮廓环的样本数，确定曲率的粒度
                    shadows: Cesium.ShadowMode.DISABLED,
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //   1.0e3,
                    //   2.0e3
                    // ),
                },
            });
            this.viewer.zoomTo(entity);
        },
        addlabel() {
            let entity = this.viewer.entities.add({
                name: "label",
                position: Cesium.Cartesian3.fromDegrees(
                    -75.1641667,
                    39.9522222,
                    300000.0
                ),
                label: {
                    show: true,
                    text: "label标签test",
                    font: "24px Helvetica",
                    /**
                     * type:LabelStyle default:LabelStyle.FILL
                     * FILL	填充；
                     * OUTLINE 只显示边框；
                     * FILL_AND_OUTLINE 既有填充又有边框
                     */
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    scale: 1.0,
                    showBackground: true,
                    backgroundColor: Cesium.Color.BLUE,
                    backgroundPadding: new Cesium.Cartesian2(7, 5),//背景填充
                    pixelOffset: Cesium.Cartesian2.ZERO,//指定像素偏移量
                    eyeOffset: Cesium.Cartesian3.ZERO,//指定眼偏移量
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,//水平对齐方式
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直对齐方式
                    heightReference: Cesium.HeightReference.NONE,
                    fillColor: Cesium.Color.SKYBLUE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    /**
                     * 与相机的距离设置半透明
                     */
                    translucencyByDistance: new Cesium.NearFarScalar(
                        1.0e3,
                        1.0,
                        1.5e6,
                        0.5
                    ),
                    /**
                     * 与相机的距离设置pixelOffset（像素偏移量）
                     */
                    pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
                        1.0e3,
                        1.0,
                        1.5e6,
                        0.0
                    ),
                    /**
                     * 与相机的距离设置缩放
                     */
                    scaleByDistance: new Cesium.NearFarScalar(1.0e3, 2.0, 2.0e3, 1.0),
                    /**
                     * 显示条件
                     * 指定该标签将显示在距离摄像机的距离
                     */
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //   1.0e3,
                    //   2.0e3
                    // ),

                    /**
                     * 禁用深度检测
                     */
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,//正无穷大
                },
            });
            this.viewer.zoomTo(entity);
        },
        addmodel() {
            /**
             * 构造callbackProperty
             */
            let position = Cesium.Cartesian3.fromDegrees(
                -123.0744619,
                44.0503706,
                5000.0
            );
            let heading = Cesium.Math.toRadians(135);
            let pitch = 0;
            let roll = 0;
            let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            let orientation = Cesium.Transforms.headingPitchRollQuaternion(//方向
                position,
                hpr
            );
            /*
            //在SampledProperty中存储轮子随时间的旋转
            let wheelAngleProperty = new Cesium.SampledProperty(Number);
            let rotationProperty = new Cesium.CallbackProperty(function (time, result) {
                //计算表示绕轴旋转的四元数 
                return Cesium.Quaternion.fromAxisAngle(
                    Cesium.Cartesian3.UNIT_X, //axis,地球的旋转轴
                    wheelAngleProperty.getValue(time), //angle角度
                    result
                );
            }, false);
            //节点变换
            let wheelTransformation = new Cesium.NodeTransformationProperty({
                rotation: rotationProperty,
            });
            //??
            let nodeTransformations = {
                Wheels: wheelTransformation,
                Wheels_mid: wheelTransformation,
                Wheels_rear: wheelTransformation,
            };
            */
            let entity = this.viewer.entities.add({
                name: "model",
                position: position,
                orientation: orientation,
                model: {
                    show: true,
                    uri: 'data/model/Cesium_Air.glb',
                    scale: 1.0,
                    minimumPixelSize: 128, // 模型的最小最小像素大小，而不考虑缩放
                    maximumScale: 20000, // 模型的最大比例尺大小。 minimumPixelSize的上限
                    incrementallyLoadTextures: true, // 确定在加载模型后纹理是否可以继续流进来
                    runAnimations: true, // 是否应启动模型中指定的glTF动画
                    clampAnimations: true, // glTF动画是否应在没有关键帧的持续时间内保持最后一个姿势
                    shadows: Cesium.ShadowMode.DISABLED,
                    heightReference: Cesium.HeightReference.NONE,
                    silhouetteColor: Cesium.Color.RED, // 轮廓的颜色
                    silhouetteSize: 0.0, // 轮廓的宽度
                    color: Cesium.Color.WHITE, // 模型的颜色
                    /**
                     * 指定颜色如何与模型混合（目标颜色和图元的源颜色之间混合的不同模式）
                     * HIGHLIGHT 将源颜色乘以目标颜色;
                     * REPLACE 将源颜色替换为目标颜色;
                     * MIX 将源颜色和目标颜色混合在一起
                     */
                    colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
                    /**
                     * 当colorBlendMode为MIX时，
                     * 指定颜色强度的数值属性。
                     * 值为0.0的结果是模型的渲染颜色，
                     * 值为1.0的结果是纯色，
                     * 任何介于两者之间的值都会导致两者的混合
                     */
                    colorBlendAmount: 0.5,
                    /**
                     * 指定基于漫反射和镜面反射的图像照明的贡献
                     */
                    imageBasedLightingFactor: new Cesium.Cartesian2(1.0, 1.0),
                    /**
                     * 为模型着色时指定浅色的属性。如果 undefined ，则使用场景的浅色。
                     */
                    lightColor: undefined,
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //   1.0e3,
                    //   2.0e3
                    // ),
                    /**
                     * 节点的转换
                     */
                    nodeTransformations: "",
                    /**
                     * 关节
                     * 对象，其中keys由
                     * an articulation name  一个关节名称
                     * a single space 一个单一空间
                     * a stage name 一个阶段名称
                     * 这些值是数值属性
                     */
                    articulations: {
                        "Fairing Open": {
                            epoch: "2019-06-01T16:00:00Z",
                            number: [0, 0, 600, 120],
                        },
                        "Fairing Separate": {
                            epoch: "2019-06-01T16:00:00Z",
                            number: [0, 0, 400, -50],
                        },
                        "Fairing Drop": {
                            epoch: "2019-06-01T16:00:00Z",
                            interpolationAlgorithm: "LAGRANGE",
                            interpolationDegree: 2,
                            number: [0, 0, 80, 0, 100, 0, 120, -1, 600, -120],
                        },
                    },
                    //裁剪面
                    clippingPlanes: new Cesium.ClippingPlaneCollection({
                        planes: [
                            new Cesium.ClippingPlane(
                                new Cesium.Cartesian3(0.0, 0.0, -1.0),
                                0.0
                            ),
                        ],
                        edgeWidth: 1.0,
                    }),
                },
            });
            //trackedEntity获取或设置摄像机当前跟踪的Entity实例
            this.viewer.trackedEntity = entity;

        },
        addtileset() {
            /**
             * 不用这种方式添加
             */
            let entity = this.viewer.entities.add({
                name: "3D Tiles",
                position: Cesium.Cartesian3.fromDegrees(116.00, 40.012258, 0),
                tileset: {
                    show: true,
                    uri: 'data/3dtiles/BatchedColors/tileset.json',
                },
            });
            this.viewer.trackedEntity = entity;
        },
        addpath1() {

        },
        addplane() {
            /**
             * 平面
             */
            let entity = this.viewer.entities.add({
                name: "plane",
                position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
                plane: {
                    show: true,
                    /**
                     * 用于指定平面的法线和距离
                     */
                    plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 0.0),
                    /**
                     * 指定平面的宽度和高度
                     */
                    dimensions: new Cesium.Cartesian2(400000.0, 300000.0),
                    fill: true,
                    material: Cesium.Color.BLUE,
                    outline: true,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 1.0,
                    shadows: Cesium.ShadowMode.DISABLED,
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //   1.0e3,
                    //   2.0e3
                    // ),
                },
            });
            this.viewer.zoomTo(entity);
        },
        addpoint() {
            let entity = this.viewer.entities.add({
                name: "Point",
                position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
                point: {
                    show: true,
                    pixelSize: 10, // 像素大小
                    heightReference: Cesium.HeightReference.NONE,
                    color: Cesium.Color.YELLOW,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 1,
                    /**
                     * 根据距离缩放点
                     */
                    scaleByDistance: new Cesium.NearFarScalar(1.0e3, 10.0, 2.0e3, 1.0),
                    /**
                     * 根据与相机的距离设置半透明
                     */
                    translucencyByDistance: new Cesium.NearFarScalar(
                        1.0e3,
                        1.0,
                        1.5e6,
                        0.5
                    ),
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //   1.0e3,
                    //   2.0e3
                    // ),
                    /**
                     * 获取或设置与相机的距离，在深度处禁用深度测试，例如，以防止剪切地形
                     * 设置为零时,将始终应用深度测试,设置为Number.POSITIVE_INFINITY时
                     * 永远不会应用深度测试
                     */
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
            });
            this.viewer.zoomTo(entity);
        },
        addpolygon() {
            let redPolygon = this.viewer.entities.add({
                name: "polygon",
                polygon: {
                    show: true,
                    // 指定PolygonHierarchy(多边形的层次结构)
                    hierarchy: Cesium.Cartesian3.fromDegreesArray([
                        -115.0,
                        37.0,
                        -115.0,
                        32.0,
                        -107.0,
                        33.0,
                        -102.0,
                        31.0,
                        -102.0,
                        35.0,
                    ]),
                    height: 0, // 多边形相对于椭球面的高度
                    heightReference: Cesium.HeightReference.NONE,
                    //extrudedHeight: 500000, //挤出
                    //extrudedHeightReference: Cesium.HeightReference.NONE,
                    stRotation: 0.0, // 多边形纹理从北方逆时针旋转
                    /**
                     * 每个纬度和经度点之间的角距离
                     */
                    granularity: Cesium.Math.RADIANS_PER_DEGREE,
                    fill: true,
                    material: Cesium.Color.RED,
                    outline: false,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 1.0,
                    /**
                     * 是否使用每个位置的高度
                     */
                    perPositionHeight: false,
                    /**
                     * 将挤出多边形的顶部保留为打开状态
                     */
                    closeTop: true,
                    /**
                     * 将挤出多边形的底部保留为打开状态
                     */
                    closeBottom: true,
                    /**
                     * 多边形边缘必须遵循的线型    
                     * type:ArcType 定义连接顶点应采用的路径。
                     * NONE 与椭圆表面不符的直线;
                     * GEODESIC 遵循测地路径;
                     * RHUMB	遵循大黄蜂或恶魔般的道路。
                     */
                    arcType: Cesium.ArcType.GEODESIC,
                    shadows: Cesium.ShadowMode.DISABLED,
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //   1.0e3,
                    //   2.0e3
                    // ),
                    /**
                     * 在地面上时将对地形，3D tiles还是对两者进行分类  
                     * type:ClassificationType  default:ClassificationType.BOTH
                     * TERRAIN 将仅对地形进行分类;
                     * CESIUM_3D_TILE 将仅对3D Tiles进行分类;
                     * BOTH	将同时对Terrain和3D Tiles进行分类。
                     */
                    classificationType: Cesium.ClassificationType.BOTH,
                    zIndex: 0,
                },
            });
            let purplePolygonUsingRhumbLines = this.viewer.entities.add({
                name: "Purple polygon using rhumb lines with outline",
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray([
                        -120.0,
                        45.0,
                        -80.0,
                        45.0,
                        -80.0,
                        55.0,
                        -120.0,
                        55.0,
                    ]),
                    extrudedHeight: 50000,
                    material: Cesium.Color.PURPLE,
                    outline: true,
                    outlineColor: Cesium.Color.MAGENTA,
                    arcType: Cesium.ArcType.RHUMB,
                },
            });
            let bluePolygon = this.viewer.entities.add({
                name: "Blue polygon with holes",
                polygon: {
                    hierarchy: {
                        positions: Cesium.Cartesian3.fromDegreesArray([
                            -99.0,
                            30.0,
                            -85.0,
                            30.0,
                            -85.0,
                            40.0,
                            -99.0,
                            40.0,
                        ]),
                        holes: [
                            {
                                positions: Cesium.Cartesian3.fromDegreesArray([
                                    -97.0,
                                    31.0,
                                    -97.0,
                                    39.0,
                                    -87.0,
                                    39.0,
                                    -87.0,
                                    31.0,
                                ]),
                                holes: [
                                    {
                                        positions: Cesium.Cartesian3.fromDegreesArray([
                                            -95.0,
                                            33.0,
                                            -89.0,
                                            33.0,
                                            -89.0,
                                            37.0,
                                            -95.0,
                                            37.0,
                                        ]),
                                        holes: [
                                            {
                                                positions: Cesium.Cartesian3.fromDegreesArray([
                                                    -93.0,
                                                    34.0,
                                                    -91.0,
                                                    34.0,
                                                    -91.0,
                                                    36.0,
                                                    -93.0,
                                                    36.0,
                                                ]),
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    material: Cesium.Color.BLUE.withAlpha(0.5),
                    height: 0,
                    outline: true, // height is required for outline to display
                },
            });
            this.viewer.zoomTo(redPolygon);
        },
        addpolyline() {
            let redLine = this.viewer.entities.add({
                name: "Red line on terrain",
                polyline: {
                    show: true,
                    /**
                     * 定义线条的 Cartesian3 位置的数组
                     *  Cesium.Cartesian3.fromDegreesArray()
                     *  Cesium.Cartesian3.fromDegreesArrayHeights()
                     */
                    positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
                    width: 5,
                    /**
                     * 如果arcType属性不是ArcType.NONE，则指定每个纬度和经度之间的角距离
                     */
                    // granularity: Cesium.Math.RADIANS_PER_DEGREE,
                    material: Cesium.Color.RED,
                    /**
                     * 线低于地形时用于绘制折线的材质
                     */
                    // depthFailMaterial: Cesium.Color.WHITE,
                    /**
                     * 折线段必须遵循的线型
                     */
                    // arcType: Cesium.ArcType.GEODESIC,
                    /**
                     * 是否贴地
                     */
                    clampToGround: true,
                    shadows: Cesium.ShadowMode.DISABLED,
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //   1.0e3,
                    //   2.0e3
                    // ),
                    classificationType: Cesium.ClassificationType.BOTH,
                    zIndex: 0,
                }
            });
            this.viewer.zoomTo(redLine)

        },
        addpolylineVolume() {
            function computeCircle(radius) {
                var positions = [];
                for (var i = 0; i < 360; i++) {
                    var radians = Cesium.Math.toRadians(i);
                    positions.push(
                        new Cesium.Cartesian2(
                            radius * Math.cos(radians),
                            radius * Math.sin(radians)
                        )
                    );
                }
                return positions;
            }
            var redTube = this.viewer.entities.add({
                name: "Red tube with rounded corners",
                polylineVolume: {
                    show: true,
                    /**
                     * 定义线带的 Cartesian3 位置的数组
                     */
                    positions: Cesium.Cartesian3.fromDegreesArray([
                        -85.0,
                        32.0,
                        -85.0,
                        36.0,
                        -89.0,
                        36.0,
                    ]),
                    /**
                     * 指定 Cartesian2 位置的数组，这些位置定义了要拉伸的形状
                     */
                    shape: computeCircle(60000.0),

                    /**
                     * 拐角的样式  
                     * type:CornerType
                     * ROUNDED	拐角有光滑的边缘（光滑）；
                     * MITERED 拐角点是相邻边的交点（直角）;
                     * BEVELED 拐角被修剪（梯形）；
                     */
                    cornerType: Cesium.CornerType.ROUNDED,
                    /**
                     * 如果arcType不是ArcType.NONE，
                     * 则指定每个纬度和经度之间的角距离
                     */
                    // granularity: Cesium.Math.RADIANS_PER_DEGREE,
                    fill: true,
                    material: Cesium.Color.RED,
                    outline: false,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 1.0,
                    shadows: Cesium.ShadowMode.DISABLED,
                    // type:DistanceDisplayCondition
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //   1.0e3,
                    //   2.0e3
                    // ),
                },
            });
            this.viewer.zoomTo(redTube)
        },
        addrectangle() {
            let redRectangle = this.viewer.entities.add({
                name: "Red translucent rectangle",
                rectangle: {
                    show: true,
                    coordinates: Cesium.Rectangle.fromDegrees(-110.0, 20.0, -80.0, 25.0),
                    // height: 0,
                    // heightReference: Cesium.HeightReference.NONE,
                    // extrudedHeight: 0,
                    // extrudedHeightReference: Cesium.HeightReference.NONE,
                    /**
                     * 矩形从北方向顺时针方向的旋转
                     */
                    rotation: 0.0,
                    /**
                     * 矩形纹理从北方逆时针旋转
                     */
                    stRotation: 0.0,
                    /**
                     * 指定矩形上各点之间的角度距离
                     */
                    granularity: Cesium.Math.RADIANS_PER_DEGREE,
                    fill: true,
                    material: Cesium.Color.RED.withAlpha(0.5),
                    outline: false,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 1.0,
                    shadows: Cesium.ShadowMode.DISABLED,
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //   1.0e3,
                    //   2.0e3
                    // ),
                    classificationType: Cesium.ClassificationType.BOTH,
                    zIndex: 0,
                },
            });
            this.viewer.zoomTo(redRectangle);

        },
        addwall() {
            let redWall = this.viewer.entities.add({
                name: "Red wall at height",
                wall: {
                    show: true,
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                        -115.0,
                        44.0,
                        200000.0,
                        -90.0,
                        44.0,
                        200000.0,
                    ]),
                    /**
                     * 用于墙底而不是球体表面的高度数组
                     */
                    minimumHeights: [100000.0, 100000.0],
                    /**
                     * 用于墙顶的高度数组，而不是每个位置的高度
                     */
                    // maximumHeights: [],
                    granularity: Cesium.Math.RADIANS_PER_DEGREE,
                    fill: true,
                    material: Cesium.Color.RED,
                    outline: false,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 1.0,
                    shadows: Cesium.ShadowMode.DISABLED,
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    //   1.0e3,
                    //   2.0e3
                    // ),
                },
            });
            this.viewer.zoomTo(redWall);
        },
    }
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
