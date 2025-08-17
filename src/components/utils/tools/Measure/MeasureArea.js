/**
 * 面积测量类
 */
//  var turf = require("@turf/turf");
import * as Cesium from "cesium/Cesium";
import * as turf from "@turf/turf";
class MeasureArea {
    /**
     * 初始化
     * @param {object} viewer
     */
    constructor(viewer) {
        this.viewer = viewer;
        this.initEvents();
        this.positions = [];
        this.tempPositions = [];
        this.vertexEntities = [];
        this.labelEntity = undefined;
        this.measureArea = 0; //测量结果
        // this.viewer.scene.globe.depthTestAgainstTerrain = true;
    }

    //初始化事件
    initEvents() {
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        // this.MeasureStartEvent = new Cesium.Event(); //开始事件
        // this.MeasureEndEvent = new Cesium.Event(); //结束事件
    }

    /**
     * 激活
     */
    activate() {
        this.deactivate();
        this.registerEvents(); //注册鼠标事件
        //设置鼠标状态
        this.viewer.enableCursorStyle = false;
        this.viewer._element.style.cursor = 'default';
        this.isMeasure = true;
        this.measureArea = 0;
    }

    /**
     * 禁用
     */
    deactivate() {
        if (!this.isMeasure) return;
        this.unRegisterEvents();
        this.viewer._element.style.cursor = 'default';
        this.viewer.enableCursorStyle = true;
        this.isMeasure = false;
        this.tempPositions = [];
        this.positions = [];
        // this.height = undefined;
    }

    /**
     * 清空绘制
     */
    clear() {
        //清除线面对象
        this.viewer.entities.remove(this.polygonEntity);
        this.polygonEntity = undefined;

        //清除节点
        this.vertexEntities.forEach(item => {
            this.viewer.entities.remove(item);
        });
        this.vertexEntities = [];

        this.viewer.entities.remove(this.mesureResultEntity);
        this.mesureResultEntity = undefined;

        // this.height = undefined;
    }

    //创建面对象
    createPolygonEntity() {
        this.polygonEntity = this.viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.CallbackProperty(e => {
                    return new Cesium.PolygonHierarchy(this.tempPositions);
                    //使用最新1.72的时候 必须返回PolygonHierarchy类型 Cannot read property 'length' of undefined
                    //低版本好像都可以
                }, false),
                material: Cesium.Color.RED.withAlpha(0.4),
                perPositionHeight: true,
                disableDepthTestDistance: 50000
            },
            polyline: {
                positions: new Cesium.CallbackProperty(e => {
                    return this.tempPositions.concat(this.tempPositions[0]);
                }, false),
                width: 1,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
                disableDepthTestDistance: 50000
            }

        })
        this.vertexEntities.push(this.polygonEntity);
    }

    //创建节点
    createVertex() {
        let vertexEntity = this.viewer.entities.add({
            position: this.positions[this.positions.length - 1],
            type: "MeasureAreaVertex",
            point: {
                color: Cesium.Color.FUCHSIA,
                pixelSize: 8,
                disableDepthTestDistance: 50000,
            },
        });
        this.vertexEntities.push(vertexEntity);
    }

    //测量结果标签
    createResultLabel() {
        var _this = this;

        this.mesureResultEntity = this.viewer.entities.add({
            position: new Cesium.CallbackProperty(e => {
                return this.getCenterPosition()
            }, false),
            type: "MeasureAreaResult",
            label: {
                text: new Cesium.CallbackProperty(e => {
                    return "面积" + _this.computeArea(_this.tempPositions) + "平方米";
                }, false),
                scale: 0.8,
                font: 'normal 28px MicroSoft YaHei',
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 500000000),
                scaleByDistance: new Cesium.NearFarScalar(100, 1, 500000000, 0.4),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -30),
                outlineWidth: 9,
                outlineColor: Cesium.Color.BLACK,
                disableDepthTestDistance: 50000
            },
        });

    }

    //获取节点的中心点
    getCenterPosition() {
        let points = [];
        if (this.tempPositions.length < 3) return this.tempPositions[0];
        this.tempPositions.forEach(position => {
            const point3d = this.cartesian3ToPoint3D(position);
            points.push([point3d.x, point3d.y]);
        })

        //构建turf.js  lineString
        let geo = turf.lineString(points);
        let bbox = turf.bbox(geo);
        let bboxPolygon = turf.bboxPolygon(bbox);
        let pointOnFeature = turf.center(bboxPolygon);
        let lonLat = pointOnFeature.geometry.coordinates;
        var height = this.cartesian3ToPoint3D(this.tempPositions[0]).z;
        return Cesium.Cartesian3.fromDegrees(lonLat[0], lonLat[1], height + 0.3);
    }


    //注册鼠标事件
    registerEvents() {
        this.leftClickEvent();
        this.rightClickEvent();
        this.mouseMoveEvent();
    }

    //左键点击事件
    leftClickEvent() {
        //单击鼠标左键画点点击事件
        this.handler.setInputAction(e => {
            this.viewer._element.style.cursor = 'default';
            let position = this.viewer.scene.pickPosition(e.position);
            if (!position) {
                const ellipsoid = this.viewer.scene.globe.ellipsoid;
                position = this.viewer.scene.camera.pickEllipsoid(e.position, ellipsoid);
            }
            if (!position) return;


            var ellipsoid = this.viewer.scene.globe.ellipsoid;
            var cartographic = ellipsoid.cartesianToCartographic(position);
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            var lng = Cesium.Math.toDegrees(cartographic.longitude);
            var alt = cartographic.height + 0.5;
            cartographic = Cesium.Cartographic.fromDegrees(lng, lat, alt);
            position = ellipsoid.cartographicToCartesian(cartographic);

            this.positions.push(position);
            // this.height = this.unifiedHeight(this.positions, this.height);
            if (this.positions.length == 1) { //首次点击
                this.createPolygonEntity();
            }
            this.createVertex();

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //鼠标移动事件
    mouseMoveEvent() {
        this.handler.setInputAction(e => {
            if (!this.isMeasure) return;
            this.viewer._element.style.cursor = 'pointer';
            let position = this.viewer.scene.pickPosition(e.endPosition);
            if (!position) {
                position = this.viewer.scene.camera.pickEllipsoid(e.startPosition, this.viewer.scene.globe.ellipsoid);
            }
            if (!position) return;
            this.handleMoveEvent(position);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    //处理鼠标移动
    handleMoveEvent(position) {
        if (this.positions.length < 1) return;
        // this.height = this.unifiedHeight(this.positions, this.height);
        this.tempPositions = this.positions.concat(position);
        if (this.tempPositions.length >= 3 && !this.mesureResultEntity) {
            this.createResultLabel();
        }
    }

    //统一节点的高度
    unifiedHeight(positions, height) {
        if (!height) height = this.getPositionHeight(positions[0]); //如果没有指定高度 就用第一个的高度
        let point3d;
        for (let i = 0; i < positions.length; i++) {
            const element = positions[i];
            point3d = this.cartesian3ToPoint3D(element);
            positions[i] = Cesium.Cartesian3.fromDegrees(point3d.x, point3d.y, height)
        }
        return height;
    }

    //获取某个点的高度
    getPositionHeight(position) {
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        return cartographic.height;
    }

    cartesian3ToPoint3D(position) {
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const lon = Cesium.Math.toDegrees(cartographic.longitude);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        return { x: lon, y: lat, z: cartographic.height };
    }


    //右键事件
    rightClickEvent() {
        this.handler.setInputAction(e => {
            if (!this.isMeasure || this.positions.length < 3) {
                this.deactivate();
                this.clear();
            } else {
                this.tempPositions = [...this.positions];
                this.polygonEntity.polyline = {
                    positions: this.positions.concat(this.positions[0]),
                    width: 2,
                    material: Cesium.Color.YELLOW,
                    depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                        color: Cesium.Color.YELLOW,
                    }),
                    disableDepthTestDistance: 50000
                };

                this.polygonEntity.polygon.hierarchy = new Cesium.PolygonHierarchy(this.tempPositions);
                this.mesureResultEntity.position = this.getCenterPosition();

                this.mesureResultEntity.label.text = "总面积" + this.computeArea(this.positions) + "平方米"
                this.measureEnd();
            }

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //测量结束
    measureEnd() {
        this.deactivate();
        // this.MeasureEndEvent.raiseEvent(this.measureArea); //触发结束事件 传入结果
    }

    //解除鼠标事件
    unRegisterEvents() {
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    computeArea(positions) {
        if (positions.length < 3) return 0;
        let totalArea = 0;
        var pts = [];
        var first;
        for (let i = 0; i < positions.length; i++) {
            const element = positions[i];
            var point3d = this.cartesian3ToPoint3D(element);
            var pt = [point3d.x, point3d.y];
            pts.push(pt);
            if (i == 0) first = [point3d.x, point3d.y];
        }
        pts.push(first);
        var polygon = turf.polygon([pts]);
        totalArea = turf.area(polygon);
        return totalArea.toFixed(1)//平方米
        //return (totalArea / 1000000.0).toFixed(5);//平方千米
    }
    computeArea2(points) {
        var area = 0;
        for (let i = 0; i < points.length; i++) {
            let j = (i + 1) % points.length;
            area += points[i].x * points[j].y;
            area -= points[i].y * points[j].x;
        }
        area /= 2;
        return (Math.abs(area) / 1000000).toFixed(2);
    }

    computeArea3(positions) {
        if (positions.length < 3) return 0;
        let totalArea = 0;
        let i0, i1, i2;
        let cartographic;
        let bottomP1, bottomP2, bottomP3;
        let granularity = Math.PI / Math.pow(2, 11);
        granularity = granularity / 64;
        const polygonGeometry = Cesium.PolygonGeometry.fromPositions({
            positions: positions,
            vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
            granularity: granularity,
        });
        const scratchCartesian1 = new Cesium.Cartesian3();
        const scratchCartesian2 = new Cesium.Cartesian3();
        const scratchCartesian3 = new Cesium.Cartesian3();
        let subTrianglePositions;
        const geom = Cesium.PolygonGeometry.createGeometry(polygonGeometry);
        if (geom == null || geom.indices == null) return 0;
        for (let i = 0; i < geom.indices.length; i += 3) {
            i0 = geom.indices[i];
            i1 = geom.indices[i + 1];
            i2 = geom.indices[i + 2];

            subTrianglePositions = geom.attributes.position.values;
            if (subTrianglePositions) {
                scratchCartesian1.x = subTrianglePositions[i0 * 3];
                scratchCartesian1.y = subTrianglePositions[i0 * 3 + 1];
                scratchCartesian1.z = subTrianglePositions[i0 * 3 + 2];
            }

            cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian1);
            const height = this.viewer.scene.globe.getHeight(cartographic);
            bottomP1 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);

            if (subTrianglePositions) {
                scratchCartesian2.x = subTrianglePositions[i1 * 3];
                scratchCartesian2.y = subTrianglePositions[i1 * 3 + 1];
                scratchCartesian2.z = subTrianglePositions[i1 * 3 + 2];
            }
            cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian2);
            const height1 = this.viewer.scene.globe.getHeight(cartographic);
            bottomP2 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height1);

            if (subTrianglePositions) {
                scratchCartesian3.x = subTrianglePositions[i2 * 3];
                scratchCartesian3.y = subTrianglePositions[i2 * 3 + 1];
                scratchCartesian3.z = subTrianglePositions[i2 * 3 + 2];
            }
            cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian3);
            const height2 = this.viewer.scene.globe.getHeight(cartographic);
            bottomP3 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height2);

            totalArea += this.computeAreaOfTriangle(bottomP1, bottomP2, bottomP3);
        }
        return (totalArea / 1000000).toFixed(2);
    }

    computeAreaOfTriangle(pos1, pos2, pos3) {
        const a = Cesium.Cartesian3.distance(pos1, pos2);
        const b = Cesium.Cartesian3.distance(pos2, pos3);
        const c = Cesium.Cartesian3.distance(pos3, pos1);

        const s = (a + b + c) / 2;

        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }
}
export default MeasureArea;