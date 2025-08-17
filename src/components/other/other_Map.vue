<template>
    <div class="model-wrap">
        <div class="select-wrap">
            <a-select v-dark default-value="createWorldImage" style="width: 220px" @change="handleChange">
                <a-select-option v-for="(item, index) in selectData" :value="index" :key="index">
                    {{ item.name }}
                </a-select-option>
            </a-select>
        </div>
        <div id="cesiumContainer"></div>
    </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import { BaiduImageryProvider } from "../utils/baseMap/BaiduImageryProvider";
import GaodeMercatorTilingScheme from "../utils/baseMap/GaodeMercatorTilingScheme";
/* global Cesium */
export default {
    components: {},

    data() {
        return {
            viewer: null,
            selectData: [
                {
                    name: "createWorldImage",
                },
                {
                    name: "ArcGisMapServer",
                },
                {
                    name: "BingMaps",
                },
                {
                    name: "GoogleEarthEnterprise",
                },
                {
                    name: "Grid",
                },
                {
                    name: "Ion",
                },
                {
                    name: "MapboxImageryProvider",
                },
                {
                    name: "MapboxStyleImageryProvider/常用",
                },
                {
                    name: "OSM",
                },
                {
                    name: "SingleTile",
                },
                {
                    name: "TileCoordinatesImageryProvider",
                },
                {
                    name: "BaiDu",
                },
                {
                    name: "GaoDe",
                },
                {
                    name: "TDT",
                },
                {
                    name: "TMS",
                },
                {
                    name: "URL"
                },

            ]
        };
    },

    computed: {},

    mounted() {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
        this.viewer = new Cesium.Viewer("cesiumContainer")
        this.handleChange(0);
    },

    methods: {
        handleChange(index) {
            if (Cesium.defined(this.viewer.imageryLayers)) {
                this.viewer.imageryLayers.removeAll();
            }
            const item = this.selectData[index].name;
            let select = {
                createWorldImage: this.addCreateWorldImage,
                ArcGisMapServer: this.addArcGisMapServer,
                BingMaps: this.addBingMaps,
                GoogleEarthEnterprise: this.addGoogleEarthEnterprise,
                Grid: this.addGrid,
                Ion: this.addIon,
                MapboxImageryProvider: this.addMapboxImageryProvider,
                MapboxStyleImageryProvider: this.addMapboxStyleImageryProvider,
                OSM: this.addOSM,
                SingleTile: this.addSingleTile,
                TileCoordinatesImageryProvider: this.addTileCoordinatesImageryProvider,
                BaiDu: this.addBaiDu,
                GaoDe: this.addGaoDe,
                TMS: this.TMS,
                URL: this.addURL,
            };
            select[item] && select[item]()
        },
        addCreateWorldImage() {
            let styles = [
                Cesium.IonWorldImageryStyle.AERIAL,
                Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
                Cesium.IonWorldImageryStyle.ROAD,
            ];
            let imageryProvider = Cesium.createWorldImagery({
                style: styles[2],
            });
            this.viewer.imageryLayers.addImageryProvider(imageryProvider);
        },
        addArcGisMapServer() {
            let esri = new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            });
            this.viewer.imageryLayers.addImageryProvider(esri);
        },
        addBingMaps() {
            let bingStyle = [
                Cesium.BingMapsStyle.AERIAL,
                Cesium.BingMapsStyle.AERIAL_WITH_LABELS,
                Cesium.BingMapsStyle.AERIAL_WITH_LABELS_ON_DEMAND,
                Cesium.BingMapsStyle.ROAD,
                Cesium.BingMapsStyle.ROAD_ON_DEMAND,
                Cesium.BingMapsStyle.CANVAS_DARK,
                Cesium.BingMapsStyle.CANVAS_LIGHT,
                Cesium.BingMapsStyle.CANVAS_GRAY,
                Cesium.BingMapsStyle.ORDNANCE_SURVEY,
                Cesium.BingMapsStyle.COLLINS_BART
            ]
            let bingMapProvider = new Cesium.BingMapsImageryProvider({
                url: "https://dev.virtualearth.net",
                key: "AmXdbd8UeUJtaRSn7yVwyXgQlBBUqliLbHpgn2c76DfuHwAXfRrgS5qwfHU6Rhm8",
                mapStyle: bingStyle[1],
            })
            this.viewer.imageryLayers.addImageryProvider(bingMapProvider)
        },
        addGoogleEarthEnterprise() {
            console.log("跨域");
            let geeMetadata = new Cesium.GoogleEarthEnterpriseMetadata(
                "http://www.earthenterprise.org/3d"
            );
            let googleEarthProvider = new Cesium.GoogleEarthEnterpriseImageryProvider({
                metadata: geeMetadata
            });
            this.viewer.imageryLayers.addImageryProvider(googleEarthProvider)
        },
        addGrid() {
            let gridProivder = new Cesium.GridImageryProvider({
                color: Cesium.Color.AQUA
            });
            let topLayer = this.viewer.imageryLayers.addImageryProvider(gridProivder)
            this.viewer.imageryLayers.raiseToTop(topLayer)//置顶
        },
        addIon() {
            let IonImageryProivder = new Cesium.IonImageryProvider({ assetId: 3954 });
            this.viewer.imageryLayers.addImageryProvider(IonImageryProivder)
        },
        addMapboxImageryProvider() {
            let mapIds = [
                "mapbox.satellite",
                "mapbox.streets",
                "mapbox.streets-basic",
                "mapbox.light",
                "mapbox.streets-satellite",
                "mapbox.wheatpaste",
                "mapbox.comic",
                "mapbox.outdoors",
                "mapbox.run-bike-hike",
                "mapbox.pencil",
                "mapbox.pirates",
                "mapbox.emerald",
                "mapbox.high-contrast",
            ];
            this.viewer.imageryLayers.addImageryProvider(
                new Cesium.MapboxImageryProvider({
                    mapId: mapIds[0],
                    accessToken:
                        "pk.eyJ1Ijoic2tiZXlvbmQiLCJhIjoiY2s5MmU1Y2RiMDR4aTNtcDh0MmgwaHQzcyJ9._tMktptrxVL-QNN5s2plzg",
                })
            );
        },
        addMapboxStyleImageryProvider() {
            let styleIds = [
                "streets-v11",
                "outdoors-v11",
                "light-v10",
                "dark-v10",
                "satellite-v9",
                "msatellite-streets-v11",
            ];
            this.viewer.imageryLayers.addImageryProvider(
                new Cesium.MapboxStyleImageryProvider({
                    styleId: styleIds[0],
                    accessToken:
                        "pk.eyJ1Ijoic2tiZXlvbmQiLCJhIjoiY2s5MmU1Y2RiMDR4aTNtcDh0MmgwaHQzcyJ9._tMktptrxVL-QNN5s2plzg",
                })
            );
        },
        addOSM() {
            console.log("网络原因");
            let osm = new Cesium.OpenStreetMapImageryProvider({
                url: "https://a.tile.openstreetmap.org/",
                minimumLevel: 0,
                maximumLevel: 18,
                fileExtension: "png",
            });
            this.viewer.imageryLayers.addImageryProvider(osm);
        },
        addSingleTile() {
            //SingleTileImageryProvider。单张图片的影像服务，
            //适合离线数据或对影像数据要求并不高的场景下
            let imagelayer = new Cesium.SingleTileImageryProvider({
                url: "../../../public/images/map/worldimage.jpg",
            });
            this.viewer.imageryLayers.addImageryProvider(imagelayer);
        },
        addTileCoordinatesImageryProvider() {
            let tileCoordinates = new Cesium.TileCoordinatesImageryProvider();
            this.viewer.imageryLayers.addImageryProvider(tileCoordinates);
        },
        addBaiDu() {
            let styleIds = [
                "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=ph&scaler = 1 & p = 1",//vec
                "http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",//img
                "http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sh&v=020"//lable
            ];
            let BaiDuImageryProvider = new BaiduImageryProvider({
                url: styleIds[0]
            });;
            this.viewer.imageryLayers.addImageryProvider(BaiDuImageryProvider);
        },
        addGaoDe() {
            let styleIds = [
                "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",//vec
                "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",//img
                "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"//ann
            ]
            let GaoDeImageryProvider = new Cesium.UrlTemplateImageryProvider({
                url: styleIds[0],
                tilingScheme: new GaodeMercatorTilingScheme()
            })
            this.viewer.imageryLayers.addImageryProvider(GaoDeImageryProvider);
        },
        addTMS() {
            //TileMapServiceImageryProvider（UrlTemplateImageryProvider常用）。
            //访问瓦片图的Rest接口。瓦片图被转换为MapTiler或GDAL2Tiles.
            //看文档是根据MapTiler规范，貌似是可以自己下载瓦片，发布服务，类似ArcGIS影像服务的过程
            let tms = new Cesium.TileMapServiceImageryProvider({
                url: '../images/cesium_maptiler/Cesium_Logo_Color',
                fileExtension: 'png',
                maximumLevel: 4,
                rectangle: new Cesium.Rectangle(
                    Cesium.Math.toRadians(-120.0),
                    Cesium.Math.toRadians(20.0),
                    Cesium.Math.toRadians(-60.0),
                    Cesium.Math.toRadians(40.0))
            });
            this.viewer.imageryLayers.addImageryProvider(tms);
        },
        addURL() {
            //TMS用这个方法添加
            let UTIP = new Cesium.UrlTemplateImageryProvider({
                url: "https://t0.tianditu.gov.cn/DataServer?T=img_c&x={x}&y={y}&z={z}",
            });
            this.viewer.imageryLayers.addImageryProvider(UTIP);
        },
    }
};
</script>
<style lang="less" scoped>
.select-wrap {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1;
}
</style>
