//常用
// 创建一个3X3 的旋转矩阵
let m3 = new Cesium.Matrix3(
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
)

// 通过一个旋转角度创建一个3X3的旋转矩阵
let m3 = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(60));

// 创建一个4X4 旋转平移变换矩阵
let m4 = new Cesium.Matrix4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
)

// 通过一个平移向量Cartesian3，创建一个4X4矩阵
let translation = new Cesium.Cartesian3(20, 15, 0);
let m4 = Cesium.Matrix4.fromTranslation(translation);

// 通过一个3X3的旋转矩阵创建一个4x4的矩阵
let rotationZ = Cesium.Matrix4.fromRotationTranslation(m3);

//根据不同方向的缩放比例生成缩放矩阵
const m = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(7.0, 8.0, 9.0));

//相同的缩放比例生成缩放矩阵
const m = Cesium.Matrix4.fromUniformScale(2.0);

//计算当参考系是局部坐标时，此位置为原点的局部坐标系，到世界坐标的转换矩阵（eastNorthUpToFixedFrame）
let m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
