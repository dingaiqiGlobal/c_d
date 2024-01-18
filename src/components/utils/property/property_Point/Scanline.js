// 点效果集合 父类
import * as Cesium from "cesium/Cesium";
class Effect {
    viewer;
    id;
    duration;
    maxRadius;
    pointDraged;
    leftDownFlag;
    update_position;
    constructor(viewer, id) {
        this.viewer = viewer
        this.id = id
        this.duration = 1000
        this.maxRadius = 1000
        this.pointDraged = null
        this.leftDownFlag = false
    }
    change_duration(d) {
        this.duration = d
    }
    change_color(val) {
        const curEntity = this.viewer.entities.getById(this.id)
        curEntity._ellipse._material.color = new Cesium.Color.fromCssColorString(
            val
        )
    }
    change_position(p) {
        const cartesian3 = Cesium.Cartesian3.fromDegrees(
            parseFloat(p[0]),
            parseFloat(p[1]),
            parseFloat(p[2])
        )
        const curEntity = this.viewer.entities.getById(this.id)
        curEntity.position = cartesian3
    }
    del() {
        this.viewer.entities.removeById(this.id)
    }
    add(
        position,
        color,
        maxRadius,
        duration,
        isEdit = false
    ) {
        const _this = this
        this.duration = duration
        this.maxRadius = maxRadius
        if (!isEdit) {
            return
        }

        function leftDownAction(e) {
            _this.pointDraged = _this.viewer.scene.pick(e.position) // 选取当前的entity
            if (
                _this.pointDraged &&
                _this.pointDraged.id &&
                _this.pointDraged.id.id === _this.id
            ) {
                _this.leftDownFlag = true
                _this.viewer.scene.screenSpaceCameraController.enableRotate = false // 锁定相机
            }
        }

        function leftUpAction(e) {
            _this.leftDownFlag = false
            _this.pointDraged = null
            _this.viewer.scene.screenSpaceCameraController.enableRotate = true // 解锁相机
        }

        function mouseMoveAction(e) {
            if (
                _this.leftDownFlag === true &&
                _this.pointDraged !== null &&
                _this.pointDraged !== undefined
            ) {
                const ray = _this.viewer.camera.getPickRay(e.endPosition)
                const cartesian = _this.viewer.scene.globe.pick(ray, _this.viewer.scene)
                _this.pointDraged.id.position = cartesian // 此处根据具体entity来处理，也可能是pointDraged.id.position=cartesian;
                // 这里笛卡尔坐标转 经纬度
                const ellipsoid = _this.viewer.scene.globe.ellipsoid
                const cartographic = ellipsoid.cartesianToCartographic(cartesian)
                const lat = Cesium.Math.toDegrees(cartographic.latitude)
                const lng = Cesium.Math.toDegrees(cartographic.longitude)
                let alt = cartographic.height
                alt = alt < 0 ? 0 : alt
                if (_this.update_position) {
                    _this.update_position([lng.toFixed(8), lat.toFixed(8), alt])
                }
            }
        }
        this.viewer.screenSpaceEventHandler.setInputAction(
            leftDownAction,
            Cesium.ScreenSpaceEventType.LEFT_DOWN
        )
        this.viewer.screenSpaceEventHandler.setInputAction(
            leftUpAction,
            Cesium.ScreenSpaceEventType.LEFT_UP
        )
        this.viewer.screenSpaceEventHandler.setInputAction(
            mouseMoveAction,
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
        )
    }
}


/**
 * 线圈发光效果
 * 包括发光材质scanlineMaterialProperty和类scanline.js
 */

// 线圈发光扩散效果
export class Scanline extends Effect {
    constructor(viewer, id) {
        super(viewer, id)
    }
    change_duration(d) {
        super.change_duration(d)
        const curEntity = this.viewer.entities.getById(this.id)
        curEntity._ellipse._material.speed = d
    }
    add(position, color, maxRadius, speed, isedit = false) {
        super.add(position, color, maxRadius, speed, isedit)
        const _this = this
        this.viewer.entities.add({
            id: _this.id,
            position: Cesium.Cartesian3.fromDegrees(
                position[0],
                position[1],
                position[2]
            ),
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(function (n) {
                    return _this.maxRadius
                }, false),
                semiMajorAxis: new Cesium.CallbackProperty(function (n) {
                    return _this.maxRadius
                }, false),
                material: new Cesium.ScanlineMaterialProperty(
                    new Cesium.Color.fromCssColorString(color),
                    speed
                ),
                classificationType: Cesium.ClassificationType.BOTH,
            },
        })
    }
}


function ScanlineMaterialProperty(color, speed) {
    this._definitionChanged = new Cesium.Event()
    this.color = color || Cesium.Color.YELLOW
    this.speed = speed || 10
}

Object.defineProperties(ScanlineMaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false
        },
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged
        },
    },
    color: Cesium.createPropertyDescriptor('color'),
    speed: Cesium.createPropertyDescriptor('speed'),
})

ScanlineMaterialProperty.prototype.getType = function (_time) {
    return Cesium.Material.ScanlineType
}
ScanlineMaterialProperty.prototype.getValue = function (
    time,
    result
) {
    if (!Cesium.defined(result)) {
        result = {}
    }
    result.color = Cesium.Property.getValueOrClonedDefault(
        this._color,
        time,
        Cesium.Color.WHITE,
        result.color
    )
    result.speed = this.speed
    return result
}

ScanlineMaterialProperty.prototype.equals = function (other) {
    const reData =
        this === other ||
        (other instanceof ScanlineMaterialProperty &&
            Cesium.Property.equals(this.color, other.color) &&
            Cesium.Property.equals(this.speed, other.speed))
    return reData
}
Cesium.ScanlineMaterialProperty = ScanlineMaterialProperty
Cesium.Material.ScanlineType = 'Scanline'
Cesium.Material.ScanlineSource = `
  uniform vec4 color;
  uniform float speed;
  float circle(vec2 uv, float r, float blur) {
    float d = length(uv) * 1.0; /* 2.0 */
    float c = smoothstep(r+blur, r, d);
    return c;
  }
  czm_material czm_getMaterial(czm_materialInput materialInput)
  {
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st - 0.5;
    material.diffuse = 2.8 * color.rgb;
    material.emission = vec3(0);
    float t = fract(czm_frameNumber * (11000.0 - speed) / 500000.0);
    float s = 0.3;
    float radius1 = smoothstep(.0, s, t) * 0.5;
    float alpha1 = circle(st, radius1, 0.01) * circle(st, radius1, -0.01);
    float alpha2 = circle(st, radius1, 0.01 - radius1) * circle(st, radius1, 0.01);
    float radius2 = 0.5 + smoothstep(s, 1.0, t) * 0.5;
    float alpha3 = circle(st, radius1, radius2 + 0.01 - radius1) * circle(st, radius1, -0.01);
    material.alpha = smoothstep(1.0, s, t) * (alpha1 + alpha2*0.1 + alpha3*0.1);
    material.alpha *= color.a ;
    return material;
  }
  `
Cesium.Material._materialCache.addMaterial(Cesium.Material.ScanlineType, {
    fabric: {
        type: Cesium.Material.ScanlineType,
        uniforms: {
            color: new Cesium.Color(1, 0, 0, 0.5),
            time: 0,
            speed: 10,
        },
        source: Cesium.Material.ScanlineSource,
    },
    translucent: function (t) {
        return true
    },
})
