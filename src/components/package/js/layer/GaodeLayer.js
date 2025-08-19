import BaseLayer from "./BaseLayer";
import GaodeMercatorTilingScheme from "./GaodeMercatorTilingScheme";
import * as Cesium from "cesium/Cesium";
/**
 * 高德地图图层
 * @extends BaseLayer
 */
class GaodeLayer extends BaseLayer{
    /**
     * 初始化
     * @param {object} options - 参数对象
     * @param {string} [options.id=uuid()] - 图层id标识
     * @param {string} [options.name] - 图层名称
     * @param {boolean} [options.show=true] - 图层是否显示
     * @param {Number} [options.zIndex] - zIndex
     * @param {alpha} [options.alpha=1] - alpha
     * @param {layer} [options.layer=vec] - vec img ann
     */
    constructor(options){
        super(options);
        this.zIndex=this.options.zIndex;
        this.alpha=this.options.alpha ? this.options.alpha : 1;
        this.layer=this.options.layer ? this.options.layer : 'vec';
        this.center=this.options.center;
        this.createLayer(this.options);
    }

    createLayer(options){
        this.url='http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}';
        if(this.layer=='vec'){
            this.url='http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}';
        }else if(this.layer=='img'){
            this.url='https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
        }else if(this.layer=='ann'){
            this.url='http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8';
        }
        this.provider= new Cesium.UrlTemplateImageryProvider({
            url: this.url,
            tilingScheme:new GaodeMercatorTilingScheme(),
            maximumLevel:18
        })
        this.gaode=new Cesium.ImageryLayer(this.provider,{show:this.show,alpha:this.alpha});
    }

    /**
     * 添加到地图上
     * @param {Viewer} viewer - 地图对象
     * @param {boolean} flyTo=false - 加载完成数据后是否自动飞行定位到数据所在的区域
     */
    addTo(viewer,flyTo=false){
        super.addTo(viewer);
        if(this.zIndex)
            this.viewer.imageryLayers.add(this.gaode,this.zIndex);
        else
            this.viewer.imageryLayers.add(this.gaode);
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
            this.viewer.imageryLayers.remove(this.gaode);
            super.remove(this.viewer);
        }
    }

    /**
     * @param {boolean} flag - 设置是否显示
     */
    setVisible(flag){
        super.setVisible(flag);
        this.gaode.show=flag;
    }
}
export default GaodeLayer;
