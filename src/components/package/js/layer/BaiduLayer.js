import BaseLayer from "./BaseLayer";
import {BaiduImageryProvider} from "./BaiduImageryProvider";
import * as Cesium from "cesium/Cesium";
/**
 * 百度地图图层
 * @extends BaseLayer
 */
class BaiduLayer extends BaseLayer{
    /**
     * 初始化
     * @param {object} options - 参数对象
     * @param {string} [options.id=uuid()] - 图层id标识
     * @param {string} [options.name] - 图层名称
     * @param {boolean} [options.show=true] - 图层是否显示
     * @param {Number} [options.zIndex] - zIndex
     * @param {alpha} [options.alpha=1] - alpha
     * @param {string} [options.layer=vec] - layer vec矢量 img_d影像 img_z影响标注
     */
    constructor(options){
        super(options);
        this.layer=this.options.layer ? this.options.layer : 'vec';
        this.zIndex=this.options.zIndex;
        this.alpha=this.options.alpha ? this.options.alpha : 1;
        this.center=this.options.center;
        this.createLayer(this.options);
    }

    createLayer(options){
        var e;
        switch (options.layer) {
            case "vec":
            default:
                e = "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=" + (options.bigfont ? "ph" : "pl") + "&scaler = 1 & p = 1";
                break;
            case "img_d":
                e = "http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46";
                break;
            case "img_z":
                e = "http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=" + (options.bigfont ? "sh" : "sl") + "&v=020";
                break;
            case "custom":
                options.customid = options.customid || "midnight";
                e = "http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=" + options.customid;
                break;
        }
        this.url = e;
        options.crs="WGS84";
        options.url=this.url;
        this.provider= new BaiduImageryProvider(options);
        this.baidu=new Cesium.ImageryLayer(this.provider,{show:this.show,alpha:this.alpha});
    }

    /**
     * 添加到地图上
     * @param {Viewer} viewer - 地图对象
     * @param {boolean} flyTo=false - 加载完成数据后是否自动飞行定位到数据所在的区域
     */
    addTo(viewer,flyTo=false){
        super.addTo(viewer);
        if(this.zIndex)
            this.viewer.imageryLayers.add(this.baidu,this.zIndex);
        else
            this.viewer.imageryLayers.add(this.baidu);
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
            this.viewer.imageryLayers.remove(this.baidu);
            super.remove(this.viewer);
        }
    }

    /**
     * @param {boolean} flag - 设置是否显示
     */
    setVisible(flag){
        super.setVisible(flag);
        this.baidu.show=flag;
    }
}
export default BaiduLayer;
