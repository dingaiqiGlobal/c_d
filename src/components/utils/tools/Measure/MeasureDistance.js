/**
 * 距离测量类
 */
import * as Cesium from "cesium/Cesium";
class MeasureDistance {
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
        this.measureDistance = 0; //测量结果
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
        this.measureDistance = 0;
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
    }

    /**
     * 清空绘制
     */
    clear() {
        //清除线对象
        this.viewer.entities.remove(this.lineEntity);
        this.lineEntity = undefined;

        //清除节点
        this.vertexEntities.forEach(item => {
            this.viewer.entities.remove(item);
        });
        this.vertexEntities = [];
    }

    //创建线对象
    createLineEntity() {
        this.lineEntity = this.viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(e => {
                    return this.tempPositions;
                }, false),
                width: 2,
                material: Cesium.Color.YELLOW,
                depthFailMaterial: Cesium.Color.YELLOW,
                disableDepthTestDistance: 50000
            }
        })
        this.vertexEntities.push(this.lineEntity);
    }

    //创建线节点
    createVertex() {
        let vertexEntity = this.viewer.entities.add({
            position: this.positions[this.positions.length - 1],
            id: "MeasureDistanceVertex" + this.positions[this.positions.length - 1],
            type: "MeasureDistanceVertex",
            label: {
                text: this.spaceDistance(this.positions) + "米",
                scale: 0.8,
                font: 'normal 24px MicroSoft YaHei',
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 500000000),
                scaleByDistance: new Cesium.NearFarScalar(100, 1, 500000000, 0.4),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -30),
                outlineWidth: 10,
                outlineColor: Cesium.Color.BLACK,
                disableDepthTestDistance: 50000
            },
            point: {
                color: Cesium.Color.FUCHSIA,
                pixelSize: 8,
                disableDepthTestDistance: 50000,
            },
        });
        this.vertexEntities.push(vertexEntity);
    }

    //创建起点
    createStartEntity() {
        let vertexEntity = this.viewer.entities.add({
            position: this.positions[0],
            type: "MeasureDistanceVertex",
            point: {
                color: Cesium.Color.FUCHSIA,
                pixelSize: 10,
                disableDepthTestDistance: 50000
            },
        });
        this.vertexEntities.push(vertexEntity);
    }

    //创建终点节点
    createEndEntity() {
        //结束时删除最后一个节点的距离标识
        let lastLabel = this.viewer.entities.getById("MeasureDistanceVertex" + this.positions[this.positions.length - 1]);
        this.viewer.entities.remove(lastLabel);
        this.viewer.entities.remove(this.moveVertexEntity);

        let vertexEntity = this.viewer.entities.add({
            position: this.positions[this.positions.length - 1],
            type: "MeasureDistanceVertex",
            label: {
                text: "总距离：" + this.spaceDistance(this.positions) + "米",
                scale: 0.8,
                font: 'normal 26px MicroSoft YaHei',
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 500000000),
                scaleByDistance: new Cesium.NearFarScalar(100, 1, 500000000, 0.4),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -50),
                outlineWidth: 10,
                outlineColor: Cesium.Color.BLACK,
                eyeOffset: new Cesium.Cartesian3(0, 0, -10),
                disableDepthTestDistance: 50000
            },
            point: {
                color: Cesium.Color.FUCHSIA,
                pixelSize: 10,
                disableDepthTestDistance: 50000
            },
        });
        this.vertexEntities.push(vertexEntity);
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
            if (this.positions.length == 1) { //首次点击
                this.createLineEntity();
                this.createStartEntity();
                return;
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
        this.tempPositions = this.positions.concat(position);
    }

    //右键事件
    rightClickEvent() {
        this.handler.setInputAction(e => {
            if (!this.isMeasure || this.positions.length < 1) {
                this.deactivate();
                this.clear();
            } else {
                this.createEndEntity();
                this.lineEntity.polyline = {
                    positions: this.positions,
                    width: 2,
                    material: Cesium.Color.YELLOW,
                    depthFailMaterial: Cesium.Color.YELLOW,
                    disableDepthTestDistance: 500000000
                };
                this.measureEnd();
            }

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //测量结束
    measureEnd() {
        this.deactivate();
        // this.MeasureEndEvent.raiseEvent(this.measureDistance); //触发结束事件 传入结果
    }

    //解除鼠标事件
    unRegisterEvents() {
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    spaceDistance(positions) {
        var total = 0;
        for (var i = 0; i < positions.length - 1; i++) {
            var distance = Cesium.Cartesian3.distance(positions[i], positions[i + 1]);
            total = total + distance;
        }
        return total.toFixed(2);
    }
}
export default MeasureDistance;