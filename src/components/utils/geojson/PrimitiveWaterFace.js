import * as Cesium from "cesium/Cesium";
class PrimitiveWaterFace {
    constructor(viewer, options) {
        this.viewer = viewer
        this.normalMapUrl = options.normalMapUrl || 'images/icon/waterNormals.png'//水面图片
        this.geojsonUrl = options.geojsonUrl
        this.extrudedHeight = options.extrudeHeight || 0//拉伸高度

        this._initWater();
    }
    _initWater() {
        //entity转primitive添加
        let polygonHierarchyArray = [];
        Cesium.GeoJsonDataSource.load(this.geojsonUrl)
            .then((dataSource) => {
                let entities = dataSource.entities.values;
                for (var i = 0; i < entities.length; i++) {
                    let entity = entities[i];
                    let polygonHierarchy = entity.polygon.hierarchy.getValue().positions;
                    for (let j = 0; j < polygonHierarchy.length; j++) {
                        let cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(polygonHierarchy[j]);
                        let lat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(6))
                        let lng = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(6))
                        let alt = parseFloat((this.viewer.camera.positionCartographic.height / 100000).toFixed(2))
                        polygonHierarchyArray.push(lng)
                        polygonHierarchyArray.push(lat)
                        polygonHierarchyArray.push(alt)
                    }
                }

                let geometry = this._createGeometry(polygonHierarchyArray, this.extrudedHeight);
                let appearance = this._createAppearence(this.normalMapUrl);
                //primitives添加自定义材质
                this.viewer.scene.primitives.add(new Cesium.Primitive({
                    allowPicking: false,
                    geometryInstances: new Cesium.GeometryInstance({
                        geometry: geometry
                    }),
                    appearance: appearance,
                    asynchronous: false
                }))

            })
    }
    _createGeometry(_degreesArrayHeights, _extrudedHeight) {
        return new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(_degreesArrayHeights)),
            extrudedHeight: _extrudedHeight,
            perPositionHeight: true
        })
    }

    _createAppearence(url) {
        return new Cesium.EllipsoidSurfaceAppearance({//椭球表面外观
            material: new Cesium.Material({
                fabric: {
                    type: 'Water',
                    uniforms: {
                        normalMap: url,
                        frequency: 1000.0,
                        animationSpeed: 0.05,
                        amplitude: 10.0
                    }
                }
            }),
            fragmentShaderSource:
                'varying vec3 v_positionMC;\n' +
                'varying vec3 v_positionEC;\n' +
                'varying vec2 v_st;\n' +
                'void main()\n' +
                '{\n' +
                'czm_materialInput materialInput;\n' +
                'vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n' +
                '#ifdef FACE_FORWARD\n' +
                'normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n' +
                '#endif\n' +
                'materialInput.s = v_st.s;\n' +
                'materialInput.st = v_st;\n' +
                'materialInput.str = vec3(v_st, 0.0);\n' +
                'materialInput.normalEC = normalEC;\n' +
                'materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n' +
                'vec3 positionToEyeEC = -v_positionEC;\n' +
                'materialInput.positionToEyeEC = positionToEyeEC;\n' +
                'czm_material material = czm_getMaterial(materialInput);\n' +
                '#ifdef FLAT\n' +
                'gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n' +
                '#else\n' +
                'gl_FragColor = czm_phong(normalize(positionToEyeEC), material,czm_lightDirectionEC);\n' +
                'gl_FragColor.a = 0.5;\n' +
                '#endif\n' +
                '}\n'
        })
    }

}
export default PrimitiveWaterFace;