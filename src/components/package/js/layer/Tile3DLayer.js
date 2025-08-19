import BaseLayer from "./BaseLayer";
import * as Cesium from "cesium/Cesium";
/**
 * 3dtiles 三维模型图层
 * @extends BaseLayer
 */
class Tile3DLayer extends BaseLayer {
    /**
     * 初始化
     * @param {object} options - 参数对象
     * @param {string} [options.id=uuid()] - 图层id标识
     * @param {string} [options.name] - 图层名称
     * @param {boolean} [options.show=true] - 图层是否显示
     * @param {string} options.url - url
     * @param {number} [options.maximumScreenSpaceError=16] - 用于驱动细节细化级别的最大屏幕空间错误。 数值加大，能让最终成像变模糊
     * @param {number} [options.maximumMemoryUsage=512] - tileset可以使用的最大内存量（MB）。
     * @param {boolean} [options.skipLevelOfDetail=false] -true 可以跳过一些级别，这样整体的效率会高一些，数据占用也会小一些
     * @param {boolean} [options.loadSiblings=false] -如果为true则不会在已加载完模型后，自动从中心开始超清化模型
     * @param {boolean} [options.cullRequestsWhileMoving=true] -不要请求可能因为相机的移动而返回时未使用的磁贴。
     * @param {number} [options.cullRequestsWhileMovingMultiplier=60]  -移动时剔除请求时使用的乘数。较大的是更具侵略性的剔除，较小的是不具侵略性的剔除。
     * @param {boolean} [options.preferLeaves=false] -配合skipLevelOfDetail=true来使用，此时设置preferLeaves=true。这样我们就能最快的看见符合当前视觉精度的块，
     * @param {number} [options.progressiveResolutionHeightFraction=0.3] -数值偏于0能够让初始加载变得模糊
     * @param {boolean} [options.dynamicScreenSpaceError=false] -true时会在真正的全屏加载完之后才清晰化模型
     * @param {boolean} [options.preloadWhenHidden=false] -tileset.show是false时，也去预加载数据
     * @param {boolean} [options.backFaceCulling=true] -背面绘制
     * @param {Object} [options.position] - 模型位置
     * @param {number} [options.position.tx] - 模型中心X轴坐标（经度，单位：十进制度）
     * @param {number} [options.position.ty] - 模型中心Y轴坐标（纬度，单位：十进制度）
     * @param {number} [options.position.tz] - 模型中心Z轴坐标（高程，单位：米）
     * @param {number} [options.position.rx] - X轴（经度）方向旋转角度（单位：度）
     * @param {number} [options.position.ry] - Y轴（纬度）方向旋转角度（单位：度）
     * @param {number} [options.position.rz] - Z轴（高程）方向旋转角度（单位：度）
     * @param {number} [options.position.scale] - 缩放比例
     * @param {number} [options.position.alpha] - 透明度
     */
    constructor(options) {
        super(options);
        this.url = this.options.url ? this.options.url : "";

        this.maximumScreenSpaceError = this.options.maximumScreenSpaceError ? this.options.maximumScreenSpaceError : 16;
        this.maximumMemoryUsage = this.options.maximumMemoryUsage ? this.options.maximumMemoryUsage : 512;
        this.skipLevelOfDetail = this.options.skipLevelOfDetail ? this.options.skipLevelOfDetail : false;
        this.loadSiblings = this.options.loadSiblings ? this.options.loadSiblings : false;
        this.cullRequestsWhileMoving = this.options.cullRequestsWhileMoving ? this.options.cullRequestsWhileMoving : true;
        this.cullRequestsWhileMovingMultiplier = this.options.cullRequestsWhileMovingMultiplier ? this.options.cullRequestsWhileMovingMultiplier : 60.0;
        this.preferLeaves = this.options.preferLeaves ? this.options.preferLeaves : false;
        this.progressiveResolutionHeightFraction = this.options.progressiveResolutionHeightFraction ? this.options.progressiveResolutionHeightFraction : 0.3;
        this.dynamicScreenSpaceError ? this.options.dynamicScreenSpaceError : false;
        this.preloadWhenHidden ? this.options.preloadWhenHidden : false;
        this.backFaceCulling ? this.options.backFaceCulling : false;

        this.position = this.options.position ? this.options.position : null;
        if (this.url === null || this.url === "") {
            console.log("三维模型切片地址不可为空!");
            return;
        }
        this.createLayer(this.options);
    }

    createLayer(options) {
        this.tileset = new Cesium.Cesium3DTileset({
            url: this.url,
            show: this.show
            // maximumScreenSpaceError: this.maximumScreenSpaceError,
            // maximumMemoryUsage: this.maximumMemoryUsage,
            // skipLevelOfDetail: this.skipLevelOfDetail,
            // loadSiblings: this.loadSiblings,
            // cullRequestsWhileMoving: this.cullRequestsWhileMoving,
            // cullRequestsWhileMovingMultiplier: this.cullRequestsWhileMovingMultiplier,
            // preferLeaves: this.preferLeaves,
            // progressiveResolutionHeightFraction: this.progressiveResolutionHeightFraction,
            // dynamicScreenSpaceError: this.dynamicScreenSpaceError,
            // preloadWhenHidden: this.preloadWhenHidden,
            // backFaceCulling: this.backFaceCulling
        });

        if (this.position) {
            var self = this;
            this.tileset.readyPromise.then(function (tileset) {
                self.update3dtilesMaxtrix(self.position);
            })
        }
    }

    /**
     * 添加到地图上
     * @param {Viewer} viewer - 地图对象
     * @param {boolean} flyTo=false - 加载完成数据后是否自动飞行定位到数据所在的区域
     */
    addTo(viewer, flyTo = false) {
        super.addTo(viewer);
        this.viewer.scene.primitives.add(this.tileset);
        if (flyTo) {
            this.viewer.flyTo(this.tileset);
        }
    }

    /**
     * 从地图上移除
     */
    remove() {
        if (this.viewer) {
            this.viewer.scene.primitives.remove(this.tileset);
            super.remove(this.viewer);
        }
    }

    /**
     * 设置是否显示
     * @param {boolean} flag - 设置是否显示
     */
    setVisible(flag) {
        super.setVisible(flag);
        this.tileset.show = flag;
    }
    /**
     * 设置贴地高度
     * @param {Number} height - 设置贴地高度
     */
    changeHeight(height) {

        this.tileset.readyPromise.then(function (tileset) {
            height = Number(height);
            if (isNaN(height)) {
                return;
            }

            var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
            var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
            var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
            var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        })
    }

    /**
     * 设置maxtrix
     * @param {object} params - 参数对象
     * @param {number} params.tx - 模型中心X轴坐标（经度，单位：十进制度）
     * @param {number} params.ty - 模型中心Y轴坐标（纬度，单位：十进制度）
     * @param {number} params.tz - 模型中心Z轴坐标（高程，单位：米）
     * @param {number} params.rx - X轴（经度）方向旋转角度（单位：度）
     * @param {number} params.ry - Y轴（纬度）方向旋转角度（单位：度）
     * @param {number} params.rz - Z轴（高程）方向旋转角度（单位：度）
     * @param {number} params.scale - 缩放比例
     * @param {number} params.alpha - 透明度
     */
    update3dtilesMaxtrix(params) {
        //旋转
        let mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
        let my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
        let mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
        let rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        let rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        let rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        //平移
        let position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
        let m = Cesium.Transforms.eastNorthUpToFixedFrame(position);

        let scale = Cesium.Matrix4.fromUniformScale(params.scale);
        //缩放
        Cesium.Matrix4.multiply(m, scale, m);
        //旋转、平移矩阵相乘
        Cesium.Matrix4.multiply(m, rotationX, m);
        Cesium.Matrix4.multiply(m, rotationY, m);
        Cesium.Matrix4.multiply(m, rotationZ, m);
        //赋值给tileset
        this.tileset._root.transform = m;
        this.tileset.style = new Cesium.Cesium3DTileStyle({
            color: "color('rgba(255,255,255," + params.alpha + ")')",
        });
    }

    /**
     * 模型泛光
     */
    setGlow() {
        this.tileset.readyPromise.then(function (tileset) {
            tileset.style = new Cesium.Cesium3DTileStyle({
                color: {
                    conditions: [
                        ["true", "color('rgb(51, 153, 255)',1)"]
                    ]
                }
            });
        })
        var customShader = new Cesium.CustomShader({
            lightingModel: Cesium.LightingModel.UNLIT,
            fragmentShaderText: `
			void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
				float _baseHeight = 0.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度
				float _heightRange = 30.0; // 高亮的范围(_baseHeight ~ _baseHeight + _      heightRange) 默认是 0-60米
				float _glowRange = 300.0; // 光环的移动范围(高度)
			    float vtxf_height = fsInput.attributes.positionMC.y-_baseHeight;
			    float vtxf_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
			    float vtxf_a12 = vtxf_height / _heightRange + sin(vtxf_a11) * 0.1;
			    material.diffuse*= vec3(vtxf_a12, vtxf_a12, vtxf_a12);
			    float vtxf_a13 = fract(czm_frameNumber / 360.0);
			    float vtxf_h = clamp(vtxf_height / _glowRange, 0.0, 1.0);
			    vtxf_a13 = abs(vtxf_a13 - 0.5) * 2.0;
			    float vtxf_diff = step(0.005, abs(vtxf_h - vtxf_a13));
			    material.diffuse += material.diffuse * (1.0 - vtxf_diff);
			}	 	
			`,
        })
        this.tileset.customShader = customShader;
    }

}
export default Tile3DLayer;
