/*
 * @Description: 超级线材质
 */
import * as Cesium from "cesium/Cesium";
export default class PolylineSuperMaterialProperty {
    constructor(options) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = options.color;
        this.duration = options.duration;
        this.count = options.count;
        this.url = options.url || 'images/icon/polyline/PolylineSuperMaterial.png';
        this._time = (new Date()).getTime();
    }
}



Object.defineProperties(PolylineSuperMaterialProperty.prototype, {
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

PolylineSuperMaterialProperty.prototype.getType = function (time) {
    return 'PolylineSuper';
};

PolylineSuperMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = this.url;
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    result.count = this.count || 4;
    return result;
};

PolylineSuperMaterialProperty.prototype.equals = function (other) {
    return this === other ||
        (other instanceof PolylineSuperMaterialProperty &&
            Cesium.Property.equals(this._color, other._color) &&
            this.duration == other.duration &&
            this.count == other.count &&
            this.url == other.url
        );

};

Cesium.Material.PolylineSuperType = 'PolylineSuper';
Cesium.Material.PolylineSuperSource = `
        czm_material czm_getMaterial(czm_materialInput materialInput){
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            vec4 colorImage = texture2D(image, vec2(fract( count * st.s - time),fract(st.t)));
            material.alpha =  colorImage.a * color.a;
            material.diffuse =  color.rgb * 1.5;
            return material;
        }
    `

Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineSuperType, {
    fabric: {
        type: Cesium.Material.PolylineSuperType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: '',
            time: 20,
            count: 4
        },
        source: Cesium.Material.PolylineSuperSource
    },
    translucent: function (material) {
        return true;
    }
});

