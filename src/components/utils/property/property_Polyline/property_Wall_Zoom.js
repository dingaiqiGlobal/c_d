/**
 * 实现正多变形动态扩散墙，
 * 首先需要根据扩散中心点和扩散半径计算多边形每个节点的坐标，
 * 通过回调函数callbackProerty实时更新多边形节点位置和高度。 
 */
import * as Cesium from "cesium/Cesium";
import { WallDiffuseMaterialProperty } from './property_Wall_Diffuse'

export const WallRegularDiffuse = function (options) {
    let _viewer = options.viewer;
    // 扩散中心点
    let _center = options.center;
    // 扩散半径半径
    let _radius = options.radius || 1000.0;
    // 扩散正多变形的边数
    let _edge = options.edge || 10;
    // 扩散速度
    let _speed = options.speed || 5.0;
    // 扩散高度
    let _height = options.height || 100.0;
    // 实时高度
    let _currentHeight = _height;
    // 最小半径
    let _minRadius = options.minRadius || 10;
    // 实时半径
    let _currentRadius = _minRadius;

    if (_edge < 3) {
        return false;
    }

    /**
     * @description: 获取当前多边形的节点位置和高度
     * @param {*} _center：多边形中心
     * @param {*} _edge：多边形边数
     * @param {*} _currentRadius：当前半径
     * @param {*} _currentHeight：当前高度
     * @return {*}
     */
    function _getPositions(_center, _edge, _currentRadius, _currentHeight) {
        let positions = [];
        let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
            Cesium.Cartesian3.fromDegrees(_center[0], _center[1], 0)
        );
        for (let i = 0; i < _edge; i++) {
            let angle = (i / _edge) * Cesium.Math.TWO_PI;
            let x = Math.cos(angle);
            let y = Math.sin(angle);
            let point = new Cesium.Cartesian3(
                x * _currentRadius,
                y * _currentRadius,
                _currentHeight
            )
            positions.push(Cesium.Matrix4.multiplyByPoint(modelMatrix, point, new Cesium.Cartesian3()));
        }
        // 封闭墙，首节点点需要存两次
        positions.push(positions[0]);
        return positions;
    }

    // 添加多边形
    _viewer.entities.add({
        wall: {
            // callbackProperty回调函数，实时更新
            positions: new Cesium.CallbackProperty(() => {
                let positions = [];
                _currentRadius += _radius * _speed / 1000.0;
                _currentHeight -= _height * _speed / 1000.0;

                // 判断扩散的实际半径和高度是否超出范围
                if (_currentRadius > _radius || _currentHeight < 0) {
                    _currentRadius = _minRadius;
                    _currentHeight = _height;
                }

                positions = _getPositions(_center, _edge, _currentRadius, _currentHeight);
                return positions;
            }, false),
            // 设置材质
            material: new WallDiffuseMaterialProperty({
                color: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
            })
        }
    })
}
