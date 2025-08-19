/**
 * 图层类型
 * @enum {string}
 */
const LayerType = {
    /**
     * cesium
     * @type {String}
     * @constant
     */
    cesium: "cesium",
    /**
     * bing
     * @type {String}
     * @constant
     */
    bing: "bing",
    /**
     * tdt
     * @type {String}
     * @constant
     */
    tdt: "tdt",
    /**
     * osm
     * @type {String}
     * @constant
     */
    osm: "osm",
    /**
     * wms
     * @type {String}
     * @constant
     */
    wms: "wms",
    /**
     * wmts
     * @type {String}
     * @constant
     */
    wmts: "wmts",
    /**
     * mapbox
     * @type {String}
     * @constant
     */
    mapbox: "mapbox",
    /**
     * gaode
     * @type {String}
     * @constant
     */
    gaode: "gaode",
    /**
     * baidu
     * @type {String}
     * @constant
     */
    baidu: "baidu",
    /**
     * geojson
     * @type {String}
     * @constant
     */
    geojson: "geojson",
};
//Object.freeze()方法用于冻结一个对象，使其不可修改
export default Object.freeze(LayerType);
