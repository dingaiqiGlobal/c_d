import * as Cesium from "cesium/Cesium";
export function Spriteline1MaterialProperty(duration, image) {
    this._definitionChanged = new Cesium.Event()
    this.duration = duration//时长
    this.image = image//传入图片
    this._time = (new Date()).getTime();
}

//定义对象属性
Object.defineProperties(Spriteline1MaterialProperty.prototype, {
    //isConstant用来判断该属性是否会随时间变化，是一个布尔值
    isConstant: {
        get: function () {
            return false
        },
    },
    //definitionChanged是一个事件，可以通过该事件，来监听Property自身所发生的变化，比如数值发生修改
    definitionChanged: {
        get: function () {
            return this._definitionChanged
        },
    },
    color: Cesium.createPropertyDescriptor('color'),//创建property描述（类似私有属性）
    duration: Cesium.createPropertyDescriptor('duration')
})
//getValue是一个方法，用来获取某个时间点的特定属性值
Spriteline1MaterialProperty.prototype.getType = function (time) {
    return 'Spriteline1'
}
//getValue是一个方法，用来获取某个时间点的特定属性值
Spriteline1MaterialProperty.prototype.getValue = function (
    time,
    result
) {
    if (!Cesium.defined(result)) {
        result = {}
    }
    result.image = this.image
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration
    return result
}
//equals是一个方法，用来检测属性值是否相等
Spriteline1MaterialProperty.prototype.equals = function (e) {
    return (this === e ||
        (e instanceof Spriteline1MaterialProperty && this.duration === e.duration)
    )
}
Cesium.Spriteline1MaterialProperty = Spriteline1MaterialProperty
Cesium.Material.Spriteline1Type = 'Spriteline1'
Cesium.Material.Spriteline1Source = `
                                    czm_material czm_getMaterial(czm_materialInput materialInput)
                                    {
                                    czm_material material = czm_getDefaultMaterial(materialInput);
                                    vec2 st = materialInput.st;
                                    vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));
                                    material.alpha = colorImage.a;
                                    material.diffuse = colorImage.rgb * 1.5 ;
                                    return material;
                                    }
                                    `
// st :二维纹理坐标
// czm_material：保存可用于照明的材质信息
Cesium.Material._materialCache.addMaterial(Cesium.Material.Spriteline1Type, {
    fabric: {//面料
        type: Cesium.Material.Spriteline1Type,
        uniforms: {//表皮
            color: new Cesium.Color(1, 1, 1, 0.5),
            image: '',
            transparent: true,
            time: 20,
        },
        source: Cesium.Material.Spriteline1Source,
    },
    translucent: function (material) {//当为true或函数返回true时，此材料的几何形状将显示为半透明
        return true
    },
})