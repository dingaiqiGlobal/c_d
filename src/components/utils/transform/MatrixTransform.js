class MatrixTransform { 
    constructor() { 

    }
    /** 
    * @description: 从4*4矩阵中得到平移位置
    * @param {Matrix4} mat4 4*4矩阵
    * @return {Cartesian3} 返回位置信息
    */
    static getTranslationFromMatrix4(mat4, result) {
        if (!result) result = new Cesium.Cartesian3();
        return Cesium.Matrix4.getTranslation(mat4, result)
    }

    /** 
     * @description: 返回x,y,z方向的比例尺信息
     * @param {Matrix4} mat4 4*4矩阵
     * @param {Cartesian3} result 用于储存结果
     * @return {Cartesian3} 返回x,y,z方向的比例尺信息

     */

    static getScaleFromMatrix4(mat4, result) {
        if (!result) result = new Cesium.Cartesian3();
        return Cesium.Matrix4.getScale(mat4, result)
    }

    /** 
     * @description: 将3*3旋转矩阵转换成齐次坐标
     * @param {Matrix4} matrix 3*3矩阵
     * @param {Quaternion} result 储存结果
     * @return {Quaternion} 返回齐次坐标
     */
    static quaternionFromRotationMatrix(matrix, result) {
        return Cesium.Quaternion.fromRotationMatrix(matrix, result)
    }

    /** 
     * @description: 将欧拉角转成齐次坐标
     * @param {HeadingPitchRoll} headingPitchRoll
     * @param {Quaternion} result 储存结果
     * @return {Quaternion} 返回齐次坐标
     */

    static quaternionfromHeadingPitchRoll(headingPitchRoll, result) {
        return Cesium.Quaternion.fromHeadingPitchRoll(headingPitchRoll, result)
    }

    /** 
     * @description: 将齐次坐标转成欧拉角表示，和quaternionfromHeadingPitchRoll方法互逆
     * @param {Quaternion} quaternion 齐次坐标
     * @param {HeadingPitchRoll} result  储存结果
     * @return {HeadingPitchRoll} 返回欧拉角
     */
    static headingPitchRollFromQuaternion(quaternion, result) {
        return Cesium.HeadingPitchRoll.fromQuaternion(quaternion, result)
    }

    /**
     * @description: 从4*4矩阵中得到欧拉角
     * @param {Matrix4} transform 4*4矩阵
     * @param {Ellipsoid} ellipsoid 84椭球体
     * @param {Transforms.LocalFrameToFixedFrame} fixedFrameTransform 参考系，默认东-北-上参考系
     * @param {HeadingPitchRoll} result 储存结果
     * @return {HeadingPitchRoll}

     */

    static fixedFrameToHeadingPitchRoll(transform, ellipsoid, fixedFrameTransform, result) {
        return Cesium.Transforms.fixedFrameToHeadingPitchRoll(transform, ellipsoid, fixedFrameTransform, result)
    }

    /** 
     * @description: 将欧拉角转成3*3矩阵
     * @param {HeadingPitchRoll} headingPitchRoll
     * @param {Matrix3} result 储存结果
     * @return {Matrix3} 返回一个3*3矩阵
     */
    static matrixFromHeadingPitchRoll(headingPitchRoll, result) {
        return Cesium.Matrix3.fromHeadingPitchRoll(headingPitchRoll, result)
    }

    /** 
     * @description: 根据东-北-上方向参考系生成4*4矩阵,已知道地球上的某个位置，可以根据这个方法生成一个4*4矩阵
     * @param {Cartesian3} origin 原点坐标
     * @param {Ellipsoid} ellipsoid 84椭球体
     * @param {Matrix4} result 储存结果
     * @return {Matrix4} 返回4*4矩阵
     */
    static eastNorthUpToFixedFrame(origin, ellipsoid, result) {
        return Cesium.Transforms.eastNorthUpToFixedFrame(origin, ellipsoid, result)
    }

    /** 
     * @description: 根据原点和欧拉角生成4*4矩阵
     * @param {Cartesian3} origin 原点坐标
     * @param {HeadingPitchRoll} headingPitchRoll 欧拉角
     * @param {Ellipsoid} ellipsoid
     * @param {Transforms.LocalFrameToFixedFrame} fixedFrameTransform 参考系，默认为东-北-上参考系
     * @param {Matrix4} result 储存结果
     * @return {Matrix4} 返回4*4矩阵
     */
    static headingPitchRollToFixedFrame(origin, headingPitchRoll, ellipsoid, fixedFrameTransform, result) {
        return Cesium.Transforms.headingPitchRollToFixedFrame(origin, headingPitchRoll, ellipsoid, fixedFrameTransform, result)
    }

}