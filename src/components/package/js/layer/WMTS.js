import BaseLayer from "./BaseLayer";
import * as Cesium from "cesium/Cesium";
class WMTS extends BaseLayer {
    /**
     * 初始化
     * @param {object} options - 参数对象
     * @param {string} [options.id=uuid()] - 图层id标识
     * @param {string} [options.name] - 图层名称
     * @param {boolean} [options.show=true] - 图层是否显示
     * @param {Number} [options.zIndex] - zIndex
     * @param {alpha} [options.alpha=1] - alpha
     * @param {string} options.url - url
     * @param {string} options.layer - layer
     * @param {string} [options.format='image/png'] - 瓦片格式
     * @param {string} [options.style=''] - 样式
     * @param {string} options.tileMatrixSetID - tileMatrixSetID 例如 EPSG:4326
     * @param {string} options.tileMatrixLabels - tileMatrixLabels 例如 ['EPSG:4326:0','EPSG:4326:1','EPSG:4326:2','EPSG:4326:3','EPSG:4326:4','EPSG:4326:5','EPSG:4326:6'] 
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
        this.layer = this.options.layer;
        this.format = this.options.format ? this.options.format : 'image/png';
        this.style = this.options.style ? this.options.style : '';
        this.tileMatrixSetID = this.options.tileMatrixSetID;
        this.tileMatrixLabels = this.options.tileMatrixLabels;
        this.tilingScheme = this.options.tilingScheme ? this.options.tilingScheme : new Cesium.WebMercatorTilingScheme();
        this.maximumLevel = this.options.maximumLevel? this.options.maximumLevel : 18;
        this.center = this.options.center;
        if (this.url === null || this.url === "") {
            console.log("wmts地址不可为空!");
            return;
        }
        this.createLayer(this.options);
    }

    createLayer(options) {
        this.provider = new Cesium.WebMapTileServiceImageryProvider({
            url: this.url,
            layer: this.layer,
            style: this.style,
            format: this.format,
            tileMatrixSetID: this.tileMatrixSetID,
            tileMatrixLabels: this.tileMatrixLabels,
            tilingScheme: this.tilingScheme,//切片方案
            maximumLevel : this.maximumLevel
        });

        // if (this.tileMatrixSetID.indexOf("4326")) {
        //     if (!this.tileMatrixLabels) {
        //         this.tileMatrixLabels = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19'];
        //     }
        //     this.provider = new Cesium.WebMapTileServiceImageryProvider({
        //         url: this.url,
        //         layer: this.layer,
        //         style: this.style,
        //         format: this.format,
        //         tileMatrixSetID: this.tileMatrixSetID,
        //         tileMatrixLabels: this.tileMatrixLabels,
        //         tilingScheme: new Cesium.GeographicTilingScheme()
        //     });
        // } else {
        //     this.provider = new Cesium.WebMapTileServiceImageryProvider({
        //         url: this.url,
        //         layer: this.layer,
        //         style: this.style,
        //         format: this.format,
        //         tileMatrixSetID: this.tileMatrixSetID,
        //         tileMatrixLabels: this.tileMatrixLabels,
        //         tilingScheme: new Cesium.WebMercatorTilingScheme()
        //     });
        // }

        this.wmts = new Cesium.ImageryLayer(this.provider, { show: this.show, alpha: this.alpha });
    }

    addTo(viewer, setView = false) {
        super.addTo(viewer);
        if (this.zIndex)
            this.viewer.imageryLayers.add(this.wmts, this.zIndex);
        else
            this.viewer.imageryLayers.add(this.wmts);
        if (setView && this.center) {
            this.viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(this.center.lng, this.center.lat, this.center.alt)
            });
        }
    }

    remove() {
        if (this.viewer) {
            this.viewer.imageryLayers.remove(this.wmts);
            super.remove(this.viewer);
        }
    }

    setVisible(flag) {
        super.setVisible(flag);
        this.wmts.show = flag;
    }
}
export default WMTS;
