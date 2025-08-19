import BaseLayer from "./BaseLayer";
import * as Cesium from "cesium/Cesium";
class WMS extends BaseLayer {
    /**
     * 初始化
     * @param {object} options - 参数对象
     * @param {string} [options.id=uuid()[ - 图层id标识
     * @param {string} [options.name] - 图层名称
     * @param {boolean} [options.show=true] - 图层是否显示
     * @param {Number} [options.zIndex] - zIndex
     * @param {alpha} [options.alpha=1] - alpha
     * @param {string} options.url - url
     * @param {string} options.layers - layers
     * @param {object} options.parameters - parameters
        * @param {string} [options.parameters.format='image/png'] - 瓦片格式
        * @param {boolean} [options.parameters.transparent=true] - 是否透明
        * @param {string} [options.parameters.service='WMS'] - 服务类型
        * @param {string} [options.parameters.version='1.1.1'] - 服务版本
        * @param {string} [options.parameters.request='GetMap'] - 请求方法
        * @param {string} [options.parameters.styles=''] - 样式
        * @param {string} [options.parameters.SRS='EPSG:4326'] - SRS: EPSG:4326
     * @param {object} [options.center] - 图层自定义定位视角
        * @param {Number} options.center.lng - 经度值, 180 - 180
        * @param {Number} options.center.lat - 纬度值, -90 - 90
        * @param {Number} options.center.alt - 高度值
     */
    constructor(options) {
        super(options);
        this.url = this.options.url ? this.options.url : "";
        this.zIndex = this.options.zIndex;
        this.alpha = this.options.alpha ? this.options.alpha : 1;
        this.layers = this.options.layers;
        this.parameters = this.options.parameters ? this.options.parameters : {};
        this.center = this.options.center;
        if (this.url === null || this.url === "") {
            console.log("wms地址不可为空!");
            return;
        }
        this.createLayer(this.options);
    }

    createLayer(options) {
        this.provider = new Cesium.WebMapServiceImageryProvider({
            url: this.url,
            layers: this.layers,
            parameters: {
                token: this.parameters.token ? this.parameters.token : '',
                service: this.parameters.service ? this.parameters.service : 'WMS',
                format: this.parameters.format ? this.parameters.format : 'image/png',
                transparent: this.parameters.transparent ? this.parameters.transparent : true,
                version: this.parameters.version ? this.parameters.version : '1.1.1',
                request: this.parameters.request ? this.parameters.request : 'GetMap',
                style: this.parameters.styles ? this.parameters.styles : '',
                SRS: this.parameters.SRS ? this.parameters.SRS : 'EPSG:4326'
            }
        });

        this.wms = new Cesium.ImageryLayer(this.provider, { show: this.show, alpha: this.alpha });
    }

    addTo(viewer, setView = false) {
        super.addTo(viewer);
        if (this.zIndex)
            this.viewer.imageryLayers.add(this.wms, this.zIndex);
        else
            this.viewer.imageryLayers.add(this.wms);
        if (setView && this.center) {
            this.viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(this.center.lng, this.center.lat, this.center.alt)
            });
        }
    }

    remove() {
        if (this.viewer) {
            this.viewer.imageryLayers.remove(this.wms);
            super.remove(this.viewer);
        }
    }

    setVisible(flag) {
        super.setVisible(flag);
        this.wms.show = flag;
    }
}
export default WMS;
