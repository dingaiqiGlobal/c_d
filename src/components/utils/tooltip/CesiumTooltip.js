class CesiumTooltip {
    constructor(viewer) {
        this.viewer = viewer;
        //共有属性
        this.isInit = false;//开关
        this.labelEntity;
        this.initTool();
    }

    /**
     * 初始化提示框
     */
    initTool() {
        if (this.isInit) {
            return;
        }
        this.labelEntity = this.viewer.entities.add({
            id: Cesium.createGuid(),//唯一id
            position: Cesium.Cartesian3.fromDegrees(0, 0),
            label: {
                text: '提示',
                font: '15px sans-serif',
                pixelOffset: new Cesium.Cartesian2(8, 8),//y大小根据行数和字体大小改变
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                showBackground: true,
                backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 1.0)
            }
        })
        this.labelEntity.show = false;
        this.isInit = true;
    }

    /**
     * 设置显隐
     * @param {*} visible 
     * 
     */
    setVisible(visible) {
        if (!this.isInit) {
            return;
        }
        this.labelEntity.show = visible ? true : false;
    }

    /**
     * 显示屏幕坐标
     * @param {*} position 
     * @param {*} message 
     * 
     */
    showScreenCoordinates(position, message) {
        if (!this.isInit) {
            return;
        }
        if (position && message) {
            this.labelEntity.show = true;
            let cartesian = this.viewer.camera.pickEllipsoid(position, this.viewer.scene.globe.ellipsoid);
            if (cartesian) {
                this.labelEntity.position = cartesian;
                this.labelEntity.show = true;
                this.labelEntity.label.text = message;
            } else {
                this.labelEntity.show = false;
            }
        }
    }

}