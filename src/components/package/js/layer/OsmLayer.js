import BaseLayer from "./BaseLayer";
import * as Cesium from "cesium/Cesium";
/**
 * OpenStreetMap地图图层
 * @extends BaseLayer
 */
class OsmLayer extends BaseLayer{
    /**
     * 初始化
     * @param {object} options - 参数对象
     * @param {string} [options.id=uuid()] - 图层id标识
     * @param {string} [options.name] - 图层名称
     * @param {boolean} [options.show=true] - 图层是否显示
     * @param {Number} [options.zIndex] - zIndex
     * @param {alpha} [options.alpha=1] - alpha
     * @param {string} [options.url=https://a.tile.openstreetmap.org/] - url https://a.tile.openstreetmap.org/
     */
    constructor(options){
        super(options);
        this.url=this.options.url ? this.options.url : "";
        if(this.url === null || this.url === ""){
            this.url='https://a.tile.openstreetmap.org/';
        }
        this.zIndex=this.options.zIndex;
        this.alpha=this.options.alpha ? this.options.alpha : 1;
        this.center=this.options.center;
        this.createLayer(this.options);
    }

    createLayer(options){
        this.provider= new Cesium.OpenStreetMapImageryProvider({
            url: this.url
        })
        this.osm=new Cesium.ImageryLayer(this.provider,{show:this.show,alpha:this.alpha});
    }

    /**
     * 添加到地图上
     * @param {Viewer} viewer - 地图对象
     * @param {boolean} flyTo=false - 加载完成数据后是否自动飞行定位到数据所在的区域
     */
    addTo(viewer,flyTo=false){
        super.addTo(viewer);
        if(this.zIndex)
            this.viewer.imageryLayers.add(this.osm,this.zIndex);
        else
            this.viewer.imageryLayers.add(this.osm);
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
            this.viewer.imageryLayers.remove(this.osm);
            super.remove(this.viewer);
        }
    }

    /**
     * @param {boolean} flag - 设置是否显示
     */
    setVisible(flag){
        super.setVisible(flag);
        this.osm.show=flag;
    }
}
export default OsmLayer;
