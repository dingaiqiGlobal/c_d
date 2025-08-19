import * as Cesium from "cesium/Cesium";
import {BaiduImageryProvider} from './BaiduImageryProvider';
import GaodeMercatorTilingScheme from './GaodeMercatorTilingScheme';
import TdtLayer from './TdtLayer';
import XyzLayer from './XyzLayer';
import WMTSLayer from './WMTS';
/**
 * 底图图层
 */
class BaseMap{
    /**
     * 初始化
     * @param {object} options - 参数对象
     * @param {string} [options.serverType] - 底图服务类型
     * @param {string} [options.serverUrl] - 底图服务地址
     * @param {string} [options.coordinates] - 底图服务坐标系
     * @param {string} [options.param] - 底图服务参数
     * @param {string} [options.lonLat] - 底图服务中心点经纬度
     * @param {boolean} [options.show=true] - 图层是否显示
     * @param {Number} [options.zIndex] - zIndex
     * @param {alpha} [options.alpha=1] - alpha
     */
    constructor(options){
        this.options = options;
        this.serverType = this.options.serverType;
        this.serverUrl = this.options.serverUrl;
        this.coordinates = this.options.coordinates;
        this.params = this.options.param ? JSON.parse(this.options.param) : {};
        this.lonLat = this.options.lonLat;

        if(this.serverUrl === null || this.serverUrl === ""){
            console.log("底图服务地址不可为空!")
            return;
        }
        this.zIndex = this.options.zIndex;
        this.show = this.options.show ? this.options.show : true;
        this.alpha = this.options.alpha ? this.options.alpha : 1;

        this.provider = null;
        //这两个私有属性向外暴露
        this.layer = null;
        this.center = null;
    
        this.createBaseMap();//得到layer
        this.centerTransform();//得到center
    }

    createBaseMap(){
        var layer = null;
        var provider = null;
        var basemaplayer = null;
        switch(this.serverType) {
            case "WMTS":  //OGC WMTS Service      
                if(this.coordinates == 'CGCS2000'){
                    //天地图需要两个图层（包含注释）
                    layer = new TdtLayer({
                        type:'tdt',
                        url:this.serverUrl,
                        maximumLevel : this.params.maximumLevel,
                        crs:'EPSG:3857'//坐标系
                    });
                    //以下都是给img或者vec添加注释图层
                    var domain = this.serverUrl.split('/');//分割url
                    if(domain.length == 5){
                        var labelDomain3 = domain[3] == 'img_w' ? 'cia_w' : domain[3] == 'vec_w' ? 'cva_w' : '';//三元嵌套使用
                        var labelDomain4 = domain[4].substring(0,domain[4].indexOf('?'));//返回wmts
                        var queryParam = this.getQuery(domain[4]);//解析url，返回wmts请求参数
                        var layerName = queryParam.LAYER == 'img' ? 'cia' : queryParam.LAYER == 'vec' ? 'cva' : '';
                        queryParam.LAYER = layerName;
                        var paramStr = this.getValue(queryParam);//重组wmts请求参数
                        domain[3] = labelDomain3;
                        domain[4] = labelDomain4 + '?' + paramStr;
                    }
                    var labelUrl = domain.join('/');//重组url
                    var tdtLabel = new TdtLayer({//天地图注记
                        type:'tdt',
                        url:labelUrl,
                        maximumLevel : this.params.maximumLevel,
                        crs:'EPSG:3857'
                    })
                    provider = layer.provider;
                    basemaplayer = [layer.tdt,tdtLabel.tdt];
                }else{
                    layer = new WMTSLayer({
                        url: this.serverUrl,
                        layer : this.params.layer,
                        tileMatrixSetID : this.params.tileMatrixSetID,
                        maximumLevel : this.params.maximumLevel  
                    });
                    provider = layer.provider;
                    basemaplayer = layer.wmts;
                }  
                break;
            case "XYZ":  //XYZTILES Service
                if(this.coordinates == 'BD09'){
                    provider = new BaiduImageryProvider({
                        url: this.serverUrl,
                        type:'baidu',
                        layer:'vec',
                        maximumLevel : this.params.maximumLevel,
                    });
                    layer = new Cesium.ImageryLayer(provider,{show:true,alpha:1});
                    basemaplayer = layer;
                }else if(this.coordinates == 'GCJ02'){
                    provider= new Cesium.UrlTemplateImageryProvider({
                        url: this.serverUrl,
                        tilingScheme:new GaodeMercatorTilingScheme(),
                        maximumLevel : this.params.maximumLevel
                    })
                    layer = new Cesium.ImageryLayer(provider,{show:true,alpha:1});
                    basemaplayer = layer;
                }else{
                    layer = new XyzLayer({
                        url: this.serverUrl,
                        type:'xyz',
                        maximumLevel : this.params.maximumLevel,
                    });
                    provider = layer.provider;
                    basemaplayer = layer.xyz;
                }
                break;
        }
        this.provider = provider;
        this.layer = basemaplayer;
    }

    /**
     * 中心点坐标
     * @param center - 由经纬度转换为笛卡尔坐标后的中心点
     */
    centerTransform(){
        if(this.lonLat){
            var center = this.lonLat.split(",");    
            var position = Cesium.Cartesian3.fromDegrees(center[0]-0, center[1]-0, center[2]-0);
            var orientation = {
                heading : Cesium.Math.toRadians(0),
                pitch : Cesium.Math.toRadians(-90),
                roll : 0
            }
            this.center = {
                destination : position,
                orientation : orientation
            };
        }
    }
    //解析url
    getQuery(url) {
        //str为？之后的参数部分字符串
        const str = url.substr(url.indexOf('?') + 1);
        //arr每个元素都是完整的参数键值
        const arr = str.split('&');
        //result为存储参数键值的集合
        const result = {};
        for(let i = 0; i < arr.length; i++ ){
            //item的两个元素分别为参数名和参数值
            const item = arr[i].split('=');
            result[item[0]] = item[1];
        }
        return result 
    }

    getValue(obj) {
        var strs = '';
        for(let str in obj){
            strs += str + '=' + obj[str] + '&';
        }
        var result = strs.substring(0,strs.length - 1);
        return result
    }
}
export default BaseMap;
