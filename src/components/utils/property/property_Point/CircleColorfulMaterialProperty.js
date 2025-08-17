/*
 * @Description: 多彩圆效果（参考开源代码）e
 */
import * as Cesium from "cesium/Cesium";
export class CircleColorfulMaterialProperty {
    constructor(options) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._speed = undefined;
        this.color = options.color;
        this.speed = options.speed;
    };

    get isConstant() {
        return false;
    }

    get definitionChanged() {
        return this._definitionChanged;
    }

    getType(time) {
        return Cesium.Material.CircleColorfulMaterialType;
    }

    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }

        result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
        result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 10, result.speed);
        return result
    }

    equals(other) {
        return (this === other ||
            (other instanceof CircleColorfulMaterialProperty &&
                Cesium.Property.equals(this._color, other._color) &&
                Cesium.Property.equals(this._speed, other._speed))
        )
    }
}

Object.defineProperties(CircleColorfulMaterialProperty.prototype, {
    color: Cesium.createPropertyDescriptor('color'),
    speed: Cesium.createPropertyDescriptor('speed')
})

Cesium.CircleColorfulMaterialProperty = CircleColorfulMaterialProperty;
Cesium.Material.CircleColorfulMaterialProperty = 'CircleColorfulMaterialProperty';
Cesium.Material.CircleColorfulMaterialType = 'CircleColorfulMaterialType';
Cesium.Material.CircleColorfulMaterialSource = `
                                                uniform vec4 color;
                                                uniform float speed;

                                                czm_material czm_getMaterial(czm_materialInput materialInput){
                                                czm_material material = czm_getDefaultMaterial(materialInput);
                                                vec2 st = materialInput.st  * 2.0 - 1.0;
                                                float time =czm_frameNumber * speed / 1000.0;
                                                float radius = length(st);
                                                float angle = atan(st.y/st.x);
                                                float radius1 = sin(time * 2.0) + sin(40.0*angle+time)*0.01;
                                                float radius2 = cos(time * 3.0);
                                                vec3 fragColor = 0.2 + 0.5 * cos( time + color.rgb + vec3(0,2,4));
                                                float inten1 = 1.0 - sqrt(abs(radius1 - radius));
                                                float inten2 = 1.0 - sqrt(abs(radius2 - radius));
                                                material.alpha = pow(inten1 + inten2 , 5.0) ;
                                                material.diffuse = fragColor * (inten1 + inten2);
                                                return material;
                                                }`

Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleColorfulMaterialType, {
    fabric: {
        type: Cesium.Material.CircleColorfulMaterialType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
            speed: 10.0
        },
        source: Cesium.Material.CircleColorfulMaterialSource
    },
    translucent: function (material) {
        return true;
    }
})
