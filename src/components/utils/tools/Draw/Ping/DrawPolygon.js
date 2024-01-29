/**
 * 面标绘
 */
var Cesium = require("cesium/Cesium");
 class DrawPolygon {
    /**
     * 初始化
     * @param {object} viewer - viewer
     * @param {object} [option] - option
     * @param {object} [option.line] - option.line
     * @param {String} [option.line.width] - line.width 线宽
     * @param {String} [option.line.color] - line.color #ff0000 rgba(0,255,0,0.3)
     * @param {object} [option.polygon] - option.polygon
     * @param {String} [option.polygon.color] - polygon.color #ff0000 rgba(0,255,0,0.3)
     * @param {function} [option.callback] - option.callback 回调函数
     */
    constructor(viewer,option) {
        this.viewer = viewer;
        // this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.initEvents();
        this.positions = [];
        this.tempPositions = [];
        this.vertexEntities = [];

        if(option&&option.line){
            this.lineWidth=option.line.width?option.line.width:1;
            this.lineColor=option.line.color?Cesium.Color.fromCssColorString(option.line.color):Cesium.Color.YELLOW
        }else {
            this.lineWidth=1;
            this.lineColor=Cesium.Color.YELLOW;
        }

        if(option&&option.polygon){
            this.polygonColor=option.polygon.color?Cesium.Color.fromCssColorString(option.polygon.color):Cesium.Color.RED.withAlpha(0.4);
        }else {
            this.polygonColor=Cesium.Color.RED.withAlpha(0.4);
        }
        if(option&&option.callback&&typeof(option.callback)==='function'){
            this.callback=option.callback;
        }
    }

    //初始化事件
    initEvents() {
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }

    /**
     * 激活
     */
    activate() {
        this.clear();
        this.deactivate();
        this.registerEvents(); //注册鼠标事件
        //设置鼠标状态
        this.viewer.enableCursorStyle = false;
        this.viewer._element.style.cursor = 'default';
        this.isMeasure = true;
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
        //清除线面对象
        this.viewer.entities.remove(this.polygonEntity);
        this.polygonEntity = undefined;

        //清除节点
        this.vertexEntities.forEach(item => {
            this.viewer.entities.remove(item);
        });
        this.vertexEntities = [];

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
                material: this.polygonColor,
                perPositionHeight: true,
                disableDepthTestDistance:50000
            },
            polyline: {
                positions: new Cesium.CallbackProperty(e => {
                    return this.tempPositions.concat(this.tempPositions[0]);
                }, false),
                width: this.lineWidth,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: this.lineColor,
                }),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: this.lineColor,
                }),
                disableDepthTestDistance: 50000,
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
                color: this.lineColor ? this.lineColor : Cesium.Color.FUCHSIA,
                pixelSize: 8,
                disableDepthTestDistance: 50000,
            },
        });
        this.vertexEntities.push(vertexEntity);
    }

    //注册鼠标事件
    registerEvents() {
        this.leftClickEvent();
        this.rightClickEvent();
        this.mouseMoveEvent();
        this.doubleClickEvent();
    }

    //左键点击事件
    leftClickEvent() {
        //单击鼠标左键画点点击事件
        this.handler.setInputAction(e => {
            this.viewer._element.style.cursor = 'default';
            let position = this.viewer.scene.pickPosition(e.position);
            // if (!position) {
                const ellipsoid = this.viewer.scene.globe.ellipsoid;
                position = this.viewer.scene.camera.pickEllipsoid(e.position, ellipsoid);
            // }
            if (!position) return;

            var cartographic = ellipsoid.cartesianToCartographic(position);
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            var lng = Cesium.Math.toDegrees(cartographic.longitude);
            var alt = cartographic.height+0.5;
            cartographic = Cesium.Cartographic.fromDegrees(lng,lat,alt);
            position = ellipsoid.cartographicToCartesian(cartographic);

            this.positions.push(position);
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
            // if (!position) {
                position = this.viewer.scene.camera.pickEllipsoid(e.startPosition, this.viewer.scene.globe.ellipsoid);
            // }
            if (!position) return;
            this.handleMoveEvent(position);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    //处理鼠标移动
    handleMoveEvent(position) {
        if (this.positions.length < 1) return;
        this.tempPositions = this.positions.concat(position);

        // this.polygonEntity.polyline = {
        //     positions: this.tempPositions.concat(this.tempPositions[0]),
        //     width: this.lineWidth,
        //     material: this.lineColor,
        //     depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
        //         color: this.lineColor,
        //     }),
        //     disableDepthTestDistance: 50000,
        // };
        //
        // this.polygonEntity.polygon= {
        //     hierarchy: new Cesium.PolygonHierarchy(this.tempPositions),
        //     material: this.polygonColor,
        //     perPositionHeight: true,
        //     disableDepthTestDistance: 50000
        // };
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
                    width: this.lineWidth,
                    material: this.lineColor,
                    depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                        color: this.lineColor,
                    }),
                    disableDepthTestDistance: 50000,
                };
                this.lastPositions=this.tempPositions;

                this.polygonEntity.polygon.hierarchy = new Cesium.PolygonHierarchy(this.tempPositions);
                this.drawEnd();
            }

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

     //双击左键事件
     doubleClickEvent() {
         this.handler.setInputAction(e => {
             if (!this.isMeasure || this.positions.length < 3) {
                 this.deactivate();
                 this.clear();
             } else {
                 this.tempPositions = [...this.positions];
                 this.polygonEntity.polyline = {
                     positions: this.positions.concat(this.positions[0]),
                     width: this.lineWidth,
                     material: this.lineColor,
                     depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                         color: this.lineColor,
                     }),
                     disableDepthTestDistance: 50000,
                 };
                 this.lastPositions=this.tempPositions;

                 this.polygonEntity.polygon.hierarchy = new Cesium.PolygonHierarchy(this.tempPositions);
                 this.drawEnd();
             }

         }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
     }

    //测量结束
    drawEnd() {
        if(this.callback)
            this.callback(this.positions);
        this.deactivate();
        // this.MeasureEndEvent.raiseEvent(this.measureArea); //触发结束事件 传入结果
    }

    //解除鼠标事件
    unRegisterEvents() {
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }

}
export default DrawPolygon;