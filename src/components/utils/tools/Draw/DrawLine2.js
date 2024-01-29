export default class EntityDraw {
    constructor(viewer) {
        this.viewer = viewer;
        this.index = 0
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }
    //激活
    activate() {
        this.deactivate();
        this.clear();
        // 创建Date对象
        var currentDate = new Date();
        // 获取当前时间的时间戳作为ID
        this.initId = currentDate.getTime();
        this.positions = [];
        this.tempPositions = [];
        this.registerEvents(); //注册鼠标事件 
        this.viewer.enableCursorStyle = false;
        this.viewer._element.style.cursor = 'default';
    }
    //清空绘制
    clear() {
        if (this.drawEntity) {
            this.viewer.entities.remove(this.drawEntity);
            this.drawEntity = undefined;
        }
    }

    //禁用
    deactivate() {
        this.unRegisterEvents();
        this.drawEntity = undefined;
        this.viewer._element.style.cursor = 'pointer';
        this.viewer.enableCursorStyle = true;
    }
    registerEvents() {
        this.leftClickEvent();
        this.rightClickEvent();
        this.mouseMoveEvent();
    }

    leftClickEvent() {
        this.handler.setInputAction(e => {
            this.viewer._element.style.cursor = 'default';
            let position = this.viewer.scene.pickPosition(e.position);
            if (!position) {
                position = this.viewer.scene.camera.pickEllipsoid(e.position, this.viewer.scene.globe.ellipsoid);
            }
            if (!position) return;
            this.index++
            this.createPoint(position)
            this.positions.push(position);

            if (this.positions.length == 1) {
                this.generatePolyline();
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    rightClickEvent() {
        this.handler.setInputAction(e => {
            if (!this.drawEntity) {
                this.deactivate()
                return;
            }
            let tempPositions = this.tempPositions.slice(0, this.positions.length)
            this.drawEntity.polyline.positions = new Cesium.CallbackProperty(e => {
                return tempPositions;
            }, false)
            //两点成线
            this.minPositionCount = 2;
            if (this.positions.length < this.minPositionCount) {
                this.clear();
                this.deactivate();
                return;
            }
            this.index = 0
            this.drawEnd();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    mouseMoveEvent() {
        this.handler.setInputAction(e => {

            this.viewer._element.style.cursor = 'default'; //由于鼠标移动时 Cesium会默认将鼠标样式修改为手柄 所以移动时手动设置回来
            let position = this.viewer.scene.pickPosition(e.endPosition);
            if (!position) {
                position = this.viewer.scene.camera.pickEllipsoid(e.startPosition, this.viewer.scene.globe.ellipsoid);

            }
            if (!position) return;
            if (!this.drawEntity) return;
            this.tempPositions = this.positions.concat([position]);

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
    createPoint(position) {
        return this.viewer.entities.add({
            position: position,
            _name: this.initId,
            point: {
                pixelSize: 10,
                color: Cesium.Color.RED,
                outlineWidth: 2,
                outlineColor: Cesium.Color.DARKRED,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: 99000000,
                clampToGround: true,
            },
            label: {
                text: `${this.index}`,
                fillColor: Cesium.Color.WHITE,
                font: '14px',
                pixelOffset: new Cesium.Cartesian2(10, 10),
                heightReference: Cesium.HeightReference.NONE, // 修改高度参考
                disableDepthTestDistance: Number.POSITIVE_INFINITY, // 禁用深度测试距离
                clampToGround: true,
            },
            show: true
        });
    }







    //解除鼠标事件
    unRegisterEvents() {
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
    //绘制结束 触发结束事件
    drawEnd() {

        this.drawEntity.remove = () => {
            this.viewer.entities.remove(this.drawEntity);
        }
        this.deactivate();
    }
    generatePolyline() {
        this.drawEntity = this.viewer.entities.add({
            id: this.initId + 'polyline',
            polyline: {
                positions: new Cesium.CallbackProperty(e => {
                    return this.tempPositions;
                }, false),
                width: 2,
                material: Cesium.Color.YELLOW,
                depthFailMaterial: Cesium.Color.YELLOW,
                clampToGround: true,

            },
        })
    }


}