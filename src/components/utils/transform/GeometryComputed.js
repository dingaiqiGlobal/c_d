//import * as turf from '@turf/turf'

/**
 * 计算多面的面积
 * @param {*} polygon 
 * @returns 
 */
export const computeArea=(polygon)=> {
   let turfArray = [];
   let geometry = polygon.geometryInstances.geometry;
   let coordidates = geometry._polygonHierarchy.positions;
    for (let i = 0; i < coordidates.length; i++) {
       let radians = Cesium.Cartographic.fromCartesian(coordidates[i]);
       let lat = Cesium.Math.toDegrees(radians.latitude)
       let lng = Cesium.Math.toDegrees(radians.longitude)
        turfArray.push([lng, lat]);//设置一个空数组存储经纬度
    }
   let tPolygon = turf.polygon([turfArray]);
   let area = turf.area(tPolygon);
    return area;
}

/**
 * 距离（米）转换为经度  一米对应的经度与所在有关纬度
 * @param {*} meter 距离
 * @param {*} lat 所在纬度
 * @returns {number}
 */
export const meter2Lng = (meter, lat) => {
    let pi = Math.PI;
    let latInMeter = (Math.cos((lat * pi) / 180) * 6371 * 2 * pi) / 360;
    return meter / latInMeter / 1000;
}

/**
 * 距离（米）转换为纬度  一米对应的纬度为定值
 * @param {*} meter 距离
 * @returns {number} 
 */
export const meter2Lat = (meter) => {
    let pi = Math.PI;
    let lngInMeter = (6371 * 2 * pi) / 360;
    return meter / lngInMeter / 1000;
};

/**
 * 获取两点之间的距离
 * @param {*} p1 
 * @param {*} p2 
 * @returns 
 */
export const getDistance = (p1, p2) => {
    p1 = Cesium.Cartesian3.fromDegrees(p1.lng, p1.lat, p1.alt || 0);//Cartesian3
    p2 = Cesium.Cartesian3.fromDegrees(p2.lng, p2.lat, p2.alt || 0);
    return Math.sqrt(
        Math.pow(p1.x - p2.x, 2) +
        Math.pow(p1.y - p2.y, 2) +
        Math.pow(p1.z - p2.z, 2)
    );

}

/**
 * 点到线段的最短距离
 * @param {*} a 线段上一点
 * @param {*} b 线段上另一个点
 * @param {*} s 该点到ab的最短距离
 * @returns {number}
 */
export const point2LineMinDistance = (a, b, s) => {
    a = Cesium.Cartesian3.fromDegrees(a.lng, a.lat, a.alt || 0);//Cartesian3
    b = Cesium.Cartesian3.fromDegrees(b.lng, b.lat, b.alt || 0);
    s = Cesium.Cartesian3.fromDegrees(s.lng, s.lat, s.alt || 0);
    let ab = Math.sqrt(
        Math.pow(a.x - b.x, 2.0) +
        Math.pow(a.y - b.y, 2.0) +
        Math.pow(a.z - b.z, 2.0)
    );
    let as = Math.sqrt(
        Math.pow(a.x - s.x, 2.0) +
        Math.pow(a.y - s.y, 2.0) +
        Math.pow(a.z - s.z, 2.0)
    );
    let bs = Math.sqrt(
        Math.pow(s.x - b.x, 2.0) +
        Math.pow(s.y - b.y, 2.0) +
        Math.pow(s.z - b.z, 2.0)
    );
    let cos_A =
        (Math.pow(as, 2.0) + Math.pow(ab, 2.0) - Math.pow(bs, 2.0)) / (2 * ab * as);
    let sin_A = Math.sqrt(1 - Math.pow(cos_A, 2.0));
    let t =
        ((a.x - s.x) * (a.x - b.x) +
            (a.y - s.y) * (a.y - b.y) +
            (a.z - s.z) * (a.z - b.z)) /
        (Math.pow(a.x - b.x, 2.0) +
            Math.pow(a.y - b.y, 2.0) +
            Math.pow(a.z - b.z, 2.0));
    if (t < 0) {
        return as;
    } else if (t <= 1 && t >= 0) {
        return as * sin_A;
    } else if (t > 1) {
        return bs;
    }
};

/**
 * 求三角形面积;返回-1为不能组成三角形;
 * @param {*} a 
 * @param {*} b 
 * @param {*} c 
 * @returns 
 */
export const countTriangleArea = (a, b, c) => {
    a = Cesium.Cartesian3.fromDegrees(a.lng, a.lat, a.alt || 0);//Cartesian3
    b = Cesium.Cartesian3.fromDegrees(b.lng, b.lat, b.alt || 0);
    c = Cesium.Cartesian3.fromDegrees(c.lng, c.lat, c.alt || 0);
    let area = -1;
    let side = []; //存储三条边的长度;
    side[0] = Math.sqrt(
        Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)
    );
    side[1] = Math.sqrt(
        Math.pow(a.x - c.x, 2) + Math.pow(a.y - c.y, 2) + Math.pow(a.z - c.z, 2)
    );
    side[2] = Math.sqrt(
        Math.pow(c.x - b.x, 2) + Math.pow(c.y - b.y, 2) + Math.pow(c.z - b.z, 2)
    );
    //不能构成三角形;
    if (
        side[0] + side[1] <= side[2] ||
        side[0] + side[2] <= side[1] ||
        side[1] + side[2] <= side[0]
    ) {
        return area;
    }
    //利用海伦公式。area =sqr(p*(p-a)(p-b)(p-c));
    let p = (side[0] + side[1] + side[2]) / 2; //半周长;
    area = Math.sqrt(p * (p - side[0]) * (p - side[1]) * (p - side[2]));
    return area;
};