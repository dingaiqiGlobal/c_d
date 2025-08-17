/*
 * @Description: 动态脉冲线材质
 */
import * as Cesium from "cesium/Cesium";
export default class PolylineLinkPulseMaterialProperty {
    constructor(options) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = options.color;
        this.duration = options.duration;
        this.url = options.url || 'images/icon/polyline/PolylineLinkPulseMaterial.png';
        this._time = (new Date()).getTime();
    }
}


Object.defineProperties(PolylineLinkPulseMaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false;
        }
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged;
        }
    },
    color: Cesium.createPropertyDescriptor('color')
});

PolylineLinkPulseMaterialProperty.prototype.getType = function (time) {
    return 'PolylineLinkPulse';
};

PolylineLinkPulseMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = this.url;
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    return result;
};

PolylineLinkPulseMaterialProperty.prototype.equals = function (other) {
    return this === other ||
        (other instanceof PolylineLinkPulseMaterialProperty &&
            Cesium.Property.equals(this._color, other._color));

};

Cesium.Material.PolylineLinkPulseType = 'PolylineLinkPulse';
Cesium.Material.PolylineLinkPulseSource = `
        czm_material czm_getMaterial(czm_materialInput materialInput){
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));
            material.alpha = colorImage.a * color.a;
            material.diffuse = (colorImage.rgb + color.rgb)* 2.5;
            return material;
        }
    `

// 'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
// { czm_material material = czm_getDefaultMaterial(materialInput); vec2 st = materialInput.st;\n\
// vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));\n\
// material.alpha = colorImage.a * color.a;\n\
// material.diffuse = (colorImage.rgb + color.rgb)* 2.5 ;\n\
// return material;}';

Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineLinkPulseType, {
    fabric: {
        type: Cesium.Material.PolylineLinkPulseType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: '',
            time: 20
        },
        source: Cesium.Material.PolylineLinkPulseSource
    },
    translucent: function (material) {
        return true;
    }
});


