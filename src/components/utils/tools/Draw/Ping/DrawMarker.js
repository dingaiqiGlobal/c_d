/**
 * 点标绘
 */
var Cesium = require("cesium/Cesium");
class DrawMarker {
     /**
      * 初始化
      * @param {object} viewer - viewer
      * @param {object} [option] - option
      * @param {object} [option.label] - label
      * @param {String} [option.label.text] - label.text
      * @param {String} [option.label.fillColor] - label.fillColor #ff0000 rgba(0,255,0,0.3)
      * @param {number} [option.label.verticalOrigin] - label.verticalOrigin CENTER = 0,BOTTOM = 1,BASELINE = 2,TOP = -1
      * @param {number} [option.label.horizontalOrigin] - label.horizontalOrigin CENTER = 0,LEFT = 1,RIGHT = -1
      * @param {number} [option.label.scale] - label.scale
      * @param {object} [option.image] - image
      * @param {String} [option.image.url] - image.url
      * @param {number} [option.image.scale] - image.scale
      * @param {number} [option.image.verticalOrigin] - image.verticalOrigin CENTER = 0,BOTTOM = 1,BASELINE = 2,TOP = -1
      * @param {number} [option.image.horizontalOrigin] - image.horizontalOrigin CENTER = 0,LEFT = 1,RIGHT = -1
      * @param {object} [option.point] - point
      * @param {String} [option.point.color] - point.color #ff0000 rgba(0,255,0,0.3)
      * @param {number} [option.point.pixelSize ] - point.pixelSize
      * @param {function} [option.callback] - option.callback 回调函数
      */
    constructor(viewer,option) {
        this.viewer = viewer;
        // this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.initEvents();
        this.vertexEntities = [];

        if(option&&option.label){
            this.label={
                text:option.label.text?option.label.text:"",
                scale:option.label.scale?option.label.scale:1,
                fillColor:option.label.fillColor?Cesium.Color.fromCssColorString(option.label.fillColor):Cesium.Color.WHITE,
                verticalOrigin:option.label.verticalOrigin?option.label.verticalOrigin:0,
                horizontalOrigin:option.label.horizontalOrigin?option.label.horizontalOrigin:0,
            }
        }else{
            this.label={}
        }
        if(option&&option.image){
             this.billboard={
                 image: option.image.url,
                 scale:option.image.scale?option.image.scale:1,
                 scaleByDistance: new Cesium.NearFarScalar(100, 1, 50000, 0.4), //设置随图缩放距离和比例
                 distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 50000), //设置可见距离 10000米可见
                 verticalOrigin: option.image.verticalOrigin?option.image.verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
                 horizontalOrigin: option.image.horizontalOrigin?option.image.horizontalOrigin:Cesium.HorizontalOrigin.CENTER,
                 disableDepthTestDistance:50000
             }
         }
         if(option&&option.point){
             this.point={
                 color:option.point.color?Cesium.Color.fromCssColorString(option.point.color):Cesium.Color.FUCHSIA,
                 pixelSize:option.point.pixelSize?option.point.pixelSize:10,
             }
         }else{
             this.point={}
         }

         if(option&&option.callback&&typeof(option.callback)==='function'){
             this.callback=option.callback;
         }
    }

    //初始化事件
    initEvents() {
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }

    //激活
    activate() {
        this.deactivate();
        this.registerEvents(); //注册鼠标事件
        //设置鼠标状态
        this.viewer.enableCursorStyle = false;
        this.viewer._element.style.cursor = 'default';
        this.isMeasure = true;
    }

    //禁用
    deactivate() {
        if (!this.isMeasure) return;
        this.unRegisterEvents();
        this.viewer._element.style.cursor = 'default';
        this.viewer.enableCursorStyle = true;
        this.isMeasure = false;
        this.position=null;
    }

    //清空绘制
    clear() {
        //清除节点
        this.vertexEntities.forEach(item => {
            this.viewer.entities.remove(item);
        });
        this.vertexEntities = [];
    }

    //创建起点
    createStartEntity(position) {
        let vertexEntity = this.viewer.entities.add({
            position: position,
            type: "MeasureDistanceVertex",
            label:this.label,
            billboard: this.billboard,
            point: this.point,
        });
        this.vertexEntities.push(vertexEntity);
    }

    //注册鼠标事件
    registerEvents() {
        this.leftClickEvent();
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
            this.position=position;
            this.createStartEntity(position);
            this.drawEnd();

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //测量结束
    drawEnd() {
        if(this.callback)
            this.callback(this.position);
        this.deactivate();
    }

    //解除鼠标事件
    unRegisterEvents() {
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
}
export default DrawMarker;