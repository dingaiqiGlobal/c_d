import BaseLayer from "./BaseLayer";
import * as Cesium from "cesium/Cesium";
/**
 * Geojson地图图层
 * @extends BaseLayer
 */
class GeojsonLayer extends BaseLayer{
    /**
     * 初始化
     * @param {object} options - 参数对象
     * @param {string} [options.id=uuid()] - 图层id标识
     * @param {string} [options.name] - 图层名称
     * @param {boolean} [options.show=true] - 图层是否显示
     * @param {string} [options.url] - geojson文件或服务url地址
     * @param {object} [options.data] - geojson格式规范数据对象，与url二选一即可
     * @param {object} [options.symbol] - 矢量数据的style样式
     * @param {Number} [options.symbol.markerSize] - 为每个点创建的地图默认大小（以像素为单位）。
     * @param {String} [options.symbol.markerSymbol] - 为每个点创建的地图默认符号。 https://labs.mapbox.com/maki-icons/
     * @param {Cesium.Color} [options.symbol.markerColor] - 为每个点创建的地图颜色。
     * @param {Cesium.Color} [options.symbol.stroke] - 折线和多边形轮廓的默认颜色。
     * @param {Cesium.Number} [options.symbol.strokeWidth] - 折线和多边形轮廓的默认宽度
     * @param {Cesium.Color} [options.symbol.fill] - 多边形内部的默认颜色
     * @param {boolean} [options.symbol.clampToGround=false] - 如果我们希望将要素固定在地面上，则为true
     */
    constructor(options){
        super(options);
        this.url=this.options.url ? this.options.url : "";
        this.symbol=this.options.symbol ? this.options.symbol : {};
        this.symbol.markerSize=this.symbol.markerSize ? this.symbol.markerSize : 48;
        this.symbol.markerSymbol=this.symbol.markerSymbol ? this.symbol.markerSymbol : "marker";
        this.symbol.markerColor=this.symbol.markerColor ? this.symbol.markerColor : Cesium.Color.ROYALBLUE;
        this.symbol.stroke=this.symbol.stroke ? this.symbol.stroke : Cesium.Color.BLACK;
        this.symbol.strokeWidth=this.symbol.strokeWidth ? this.symbol.strokeWidth : 2;
        this.symbol.fill=this.symbol.fill ? this.symbol.fill : Cesium.Color.YELLOW;
        this.symbol.clampToGround=this.symbol.clampToGround ? symbol.clampToGround : false;
        this.data=this.options.data;
        if(this.url === "" && this.data==null){
            console.log("数据和地址不可为空!");
            return;
        }
        this.center=this.options.center;
        this.createLayer(this.options);
    }

    createLayer(options){

        this.dataSource = new Cesium.GeoJsonDataSource(this.name);
        if(this.data)
            this.dataSource.load(this.data, this.symbol);
        else
            this.dataSource.load(this.url, this.symbol);
        this.dataSource.show=this.show;



    }

    /**
     * 添加到地图上
     * @param {Viewer} viewer - 地图对象
     * @param {boolean} flyTo=false - 加载完成数据后是否自动飞行定位到数据所在的区域
     */
    addTo(viewer,flyTo=false){
        super.addTo(viewer);
        this.viewer.dataSources.add(this.dataSource);
        if(flyTo&&this.center){
            this.viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(this.center.lng, this.center.lat, this.center.alt)
            });
        }
    }

    /**
     * 从地图上移除
     */
    remove(){
        if(this.viewer) {
            this.viewer.dataSources.remove(this.dataSource);
            super.remove(this.viewer);
        }
    }

    /**
     * @param {boolean} flag - 设置是否显示
     */
    setVisible(flag){
        super.setVisible(flag);
        this.dataSource.show=flag;
    }

    /**
     * @param {string} eventType - 事件类型
     * @param {function} handler - 事件相应的处理函数
     */
    addEventListener(eventType, handler){
        //自定义事件对象
        this.dataSource.evt = new Cesium.Event();
        //在需要的地方监听事件
        this.dataSource.evt.addEventListener(handler, this);
    }
}
export default GeojsonLayer;
