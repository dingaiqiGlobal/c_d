class CesiumCoordTransform {
    constructor() {      
    }
    /** 
     * @description:弧度转度
     * @param {Number} value 
     * @return {Number} 
     */
    static toDegrees(value) {
        return Cesium.Math.toDegrees(value)
    }

    /**
     * @description:度转弧度
     */
    static toRadians(value) {
        return Cesium.Math.toRadians(value)
    }

    /**
     * @description:经纬度（度）转世界坐标
     * @param {Degrees} degrees.longitude 经度 degrees.latitude 纬度 degrees.height高度
     * @return {Cartesian3} 世界坐标
     */
    static degreesToCartesian(degrees) {
        return Cesium.Cartesian3.fromDegrees(degrees.longitude, degrees.latitude, degrees.height)
    }

    /**
    * @description:世界坐标转经纬度（度）
    * @param {Cartesian3} cartesian 世界坐标
    * @return {Cartographic}  返回转换之后的经纬度
    */
    static degreesFromCartesian(cartesian) {
        let cartographic = this.cartographicFromCartesian(cartesian);
        return this.degreesFromCartographic(cartographic);
    }

    /**
     * @description:经纬度（度）转经纬度（弧度）
     * @param {*} degrees
     * @return {*}
     */

    static degreesToCartographic(degrees) {
        degrees.longitude = this.toRadians(degrees.longitude);
        degrees.latitude = this.toRadians(degrees.latitude);
        return degrees;
    }

    /**
     * @description:经纬度（弧度）转经纬度（度）
     * @param {Cartographic} cartographic
     * @return {*} 返回经纬度（度）
     */
    static degreesFromCartographic(cartographic) {
        cartographic.longitude = this.toDegrees(cartographic.longitude);
        cartographic.latitude = this.toDegrees(cartographic.latitude);
        return cartographic;
    }

    /** 
     * @description:经纬度（度）坐标转web墨卡托坐标
     * @param {Cartographic} degrees
     * @return {Cartesian3} web墨卡托坐标
     */
    static degreesToWebMercatorProjection(degrees) {
        var webMercatorProjection = new Cesium.WebMercatorProjection();
        //project(cartographic, result) → Cartesian3
        return webMercatorProjection.project(this.degreesToCartesian(degrees))
    }

    /** 
     * @description:web墨卡托转经纬度（度）
     * @param {Cartesian3} cartesian
     * @return {Cartographic} 经纬度（度）坐标
     */

    static degreesFromWebMercatorProjection(cartesian) {
        var webMercatorProjection = new Cesium.WebMercatorProjection();
        return this.degreesFromCartographic(webMercatorProjection.unproject(cartesian))
    }

    /**
     * @description:弧度坐标转世界坐标
     * @param {Cartographic} cartographic.longitude 经度
     * @param {Cartographic} cartographic.latitude 纬度
     * @param {Cartographic} cartographic.height 高度
     * @return {Cartesian3} 世界坐标
     */
    static cartographicToCartesian(cartographic) {
        return Cesium.Cartographic.toCartesian(cartographic)
    }

    /**
     * @description:世界坐标转经纬度弧度
     * @param {Cartesian3} cartesian 世界坐标
     * @return {Cartographic} 返回转换之后的经纬度弧度坐标
     */
    static cartographicFromCartesian(cartesian) {
        return Cesium.Cartographic.fromCartesian(cartesian)
    }

    /**
     * @description:经纬度度转经纬度弧度
     * @param {Degrees} degrees.longitude经度 degrees.latitude纬度 degrees.height高度
     * @return {*}
     */
    static cartographicFromDegrees(degrees) {
        return this.degreesToCartographic(degrees)
    }

    /**
     * @description:经纬度（弧度）转经纬度（度）
     * @param {Cartographic} cartographic
     * @return {*} 返回经纬度（度）
    */
    static cartographicToDegrees(cartographic) {
        return this.degreesFromCartographic(cartographic)
    }

    /** 
     * @description:经纬度（弧度）坐标转web墨卡托坐标
     * @param {Cartographic} cartographic
     * @return {Cartesian3} web墨卡托坐标
     */
    static cartographicToWebMercatorProjection(cartographic) {
        var webMercatorProjection = new Cesium.WebMercatorProjection();
        return webMercatorProjection.project(cartographic)
    }

    /** 
     * @description:web墨卡托转经纬度（弧度）
     * @param {Cartesian3} cartesian
     * @return {Cartographic} 弧度坐标
     */
    static cartographicFromWebMercatorProjection(cartesian) {
        var webMercatorProjection = new Cesium.WebMercatorProjection();
        return webMercatorProjection.unproject(cartesian)
    }

    /** 
     * @description:世界坐标转经纬度（度）
     * @param {Cartesian3} cartesian 世界坐标
     * @return {Cartographic}  返回转换之后的经纬度
     */
    static cartesianToDegrees(cartesian) {
        return this.degreesFromCartesian(cartesian)
    }

    /**
     * @description:经纬度（度）转世界坐标
     * @param {Degrees} degrees.longitude 经度 degrees.latitude 纬度 degrees.height高度
     * @return {Cartesian3} 世界坐标
     */
    static cartesianFormDegrees(degrees) {
        return this.degreesToCartesian(degrees)
    }

    /**
     * @description:世界坐标转经纬度(弧度)
     * @param {Cartesian3} cartesian 世界坐标
     * @return {Cartographic}  返回转换之后的经纬度弧度坐标
     */
    static cartesianToCartographic(cartesian) {
        return this.cartographicFromCartesian(cartesian)
    }

    /**
     * @description:弧度坐标转世界坐标
     * @param {Cartographic}  cartographic.longitude 经度
     * @param {Cartographic}  cartographic.latitude 纬度
     * @param {Cartographic}  cartographic.height 高度
     * @return {Cartesian3} 世界坐标
     */
    static cartesianFromCartographic(cartographic) {
        return this.cartographicToCartesian(cartographic)
    }

    /**
     * @description:世界坐标坐标转web墨卡托坐标
     * @param {Cartographic} degrees
     * @return {Cartesian3} web墨卡托坐标
     */
    static cartesianToWebMercatorProjection(cartesian) {
        var webMercatorProjection = new Cesium.WebMercatorProjection();
        return webMercatorProjection.project(this.cartesianToCartographic(cartesian))
    }

    /** 
     * @description:web墨卡托转世界坐标
     * @param {Cartesian3} cartesian
     * @return {Cartographic} 世界坐标
     */
    static cartesianFromWebMercatorProjection(cartesian) {
        var webMercatorProjection = new Cesium.WebMercatorProjection();
        return this.cartesianFromCartographic(webMercatorProjection.unproject(cartesian))
    }

    /** 
     * @description:世界坐标转屏幕坐标
     * @param {Cartesian3} cartesian
     * @return {Cartesian2} 屏幕坐标
     */
    static cartesianToWindowCoordinates(scene, cartesian) {
        return Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, cartesian)
    }
}
