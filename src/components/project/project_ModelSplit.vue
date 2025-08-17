<template>
    <div>
        <div id="cesiumContainer"></div>
        <div>
            <div class="model-Split">
                <div class="modelfile-th">
                    <span class="tsls">gltf模型拆解</span>
                </div>
                <div class="modelfile-td">
                    <div class="infoview">
                        <div class="floorWhole">
                            整体控制：
                            <button class="btn btn-primary" @click="openAll(10, 3000, 100)">展开</button>
                            <button class="btn btn-primary" @click="resetAll">重置</button>
                        </div>
                        <div class="floorSingle">
                            显示指定楼层：
                            <button class="btn btn-primary"
                                @click="openFloorModel(50, 1000, 100, 'groundFloor')">-1层</button>
                            <button class="btn btn-primary" @click="openFloorModel(50, 1000, 100, 'fristFloor')">1层</button>
                            <button class="btn btn-primary" @click="openFloorModel(50, 1000, 100, 'roof')">楼顶</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { ModelSplit } from './modelSplit'
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
export default {
    components: {},

    data() {
        return {
            models: [],
            timers: [],
            oriHeight: null,//原始高度
            currentHeight: null,//当前高度
        };
    },

    computed: {},

    mounted() {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZWQ4OGUyMS0zMzQ4LTQ1ZjAtOTcyMC1kZjE3NWZjMzkzMzMiLCJpZCI6MTI5ODUsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjIyODk1NTN9.5BF7xVHVIo2AcorTcH3cIs8hT2ZEbhwPe_uVeWYInF0';
        //初始化三维场景
        let viewer = new Cesium.Viewer('cesiumContainer', {
            // contextOptions: {
            //     requestWebgl1: true,
            //     webgl: {
            //         alpha: true,
            //     }
            // },

        })
        // 隐藏天空大气
        viewer.scene.skyAtmosphere.show = false;
        // 隐藏球
        viewer.scene.globe.show = false;
        //
        viewer.scene.skyBox = new Cesium.SkyBox({
            sources: {
                negativeX: 'data/skyBox/one/tycho2t3_80_mx.jpg',
                positiveX: 'data/skyBox/one/tycho2t3_80_px.jpg',
                negativeY: 'data/skyBox/one/tycho2t3_80_my.jpg',
                positiveY: 'data/skyBox/one/tycho2t3_80_py.jpg',
                negativeZ: 'data/skyBox/one/tycho2t3_80_mz.jpg',
                positiveZ: 'data/skyBox/one/tycho2t3_80_pz.jpg'
            }
        })
        //动画进入
        // viewer.camera.flyTo({
        //     destination: Cesium.Cartesian3.fromDegrees(116.142312, 40.119501, 500)
        // });

        //锁定
        var center = Cesium.Cartesian3.fromDegrees(116.142312, 40.119501);
        var heading = Cesium.Math.toRadians(50.0);
        var pitch = Cesium.Math.toRadians(-20.0);
        var range = 200.0;
        viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range));
        viewer.cesiumWidget.creditContainer.style.display = "none";// 去除logo
        viewer.scene.globe.depthTestAgainstTerrain = true;//开启地形检测
        window.viewer = viewer;//全局注册viewer

        /**
         * 添加模型
         */
        let groundFloor = this.addModePrimitive({
            name: 'groundFloor',
            url: 'data/modelSplit/groundFloor.glb',
            lng: 116.142312,
            lat: 40.119501,
            height: 0, //模型带有地基（相对）高度
            rotationz: -86,
            scale: 1,
        })
        this.models.push(groundFloor);

        let fristFloor = this.addModePrimitive({
            name: 'fristFloor',
            url: 'data/modelSplit/fristFloor.glb',
            lng: 116.142312,
            lat: 40.119501,
            height: 0,
            rotationz: -86,
            scale: 1,
        })
        this.models.push(fristFloor)

        let roof = this.addModePrimitive({
            name: 'roof',
            url: 'data/modelSplit/roof.glb',
            lng: 116.142312,
            lat: 40.119501,
            height: 0,
            rotationz: -86,
            scale: 1,
        })
        this.models.push(roof)

    },

    methods: {

        /**
         * 矩阵变换(注意：模型必须在（0,0,0）中心点)
         * @param {*} lng 
         * @param {*} lat 
         * @param {*} height 
         * @param {*} rotate 
         */
        matrixTransform(lng, lat, height, rotate) {
            let origin = Cesium.Cartesian3.fromDegrees(lng, lat, height);
            let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);//平移
            //Cesium.Matrix3.fromRotationZ(angle, result) → Matrix3
            //创建围绕z轴的旋转矩阵
            let mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotate));//旋转
            //Cesium.Matrix4.fromRotationTranslation(rotation, translation, result) → Matrix4
            //从表示旋转的Matrix3和表示平移的Cartesian3计算一个Matrix4实例
            let rotationz = Cesium.Matrix4.fromRotationTranslation(mz);
            //Cesium.Matrix4.multiply(left, right, result) → Matrix4
            //计算两个矩阵的乘积
            return Cesium.Matrix4.multiply(modelMatrix, rotationz, modelMatrix);
        },

        /**
         * 添加模型
         * @param {*} options 
         */
        addModePrimitive(options) {
            this.oriHeight = options.height;
            this.currentHeight = options.height;


            //let color = Cesium.Color.fromCssColorString('#4399ba');
            let modelPrimitive = viewer.scene.primitives.add(
                Cesium.Model.fromGltf({
                    url: options.url,
                    show: true,
                    scale: options.scale,//模型缩放（缩放）
                    minimumPixelSize: 128,
                    maximumScale: 20000,
                    scene: viewer.scene,
                    //color: Cesium.Color.fromAlpha(color, 0.9)

                })
            );
            //添加name、type
            modelPrimitive.name = options.name;
            modelPrimitive.type = "model"
            modelPrimitive.modelMatrix = this.matrixTransform(options.lng, options.lat, options.height, options.rotationz)
            //Promise添加动画
            modelPrimitive.readyPromise.then(function (model) {//为模型中的每个动画创建并添加具有指定初始属性的动画。
                model.activeAnimations.addAll({
                    speedup: 0.5,
                    loop: Cesium.ModelAnimationLoop.REPEAT//是否循环
                });
            });
            return modelPrimitive;
        },
        /**
         * 打开全部模型
         * @param {*} splitHeight 
         * @param {*} time 
         * @param {*} interval 
         */
        openAll(splitHeight, time, interval) {//interval间隔
            let that = this;
            this.resetAll();
            this.clearFloorTimers()
            for (let i = 0; i < this.models.length; i++) {
                let model = this.models[i]
                let changeRate = Number((i * splitHeight)) * (interval / time)//改变比率
                if (i != 0) {
                    let count = 1;
                    let timer = setInterval(function () {
                        let add = 3 + changeRate * (count++)
                        model.modelMatrix = that.matrixTransform(116.142312, 40.119501, add, -86);
                        if (count >= (time / interval)) {
                            this.currentHeight = add;
                            clearInterval(timer)//解除定时器
                            timer = null;
                        }
                    }, interval)
                    this.timers.push(timer)
                }
            }
        },
        /**
         * 重置
         */
        resetAll() {
            let that = this;
            this.clearFloorTimers()
            for (let i = 0; i < this.models.length; i++) {
                let model = this.models[i];
                model.modelMatrix = that.matrixTransform(116.142312, 40.119501, this.oriHeight, -86);
                this.currentHeight = this.oriHeight//赋值当前高度
                model.show = true;
            }
        },
        /**
         * 清除定时器
         */
        clearFloorTimers() {
            if (this.timers.length > 0) {
                this.timers.forEach(t => {
                    if (t) {
                        clearInterval(t)
                    }
                })
            }
            this.timers = [];
        },
        /**
         * 显示指定楼层
         * @param {Number} maxHeight 指定从顶部落下的高度
         * @param {Number} [time=1000] 楼层下落需要时间,单位:毫秒
         * @param {Number} [interval=100] 楼层下落触发间隔时间,单位:毫秒
         * @return {void}  无
         */
        openFloorModel(maxHeight, time, interval, name) {
            let that = this;
            this.clearFloorTimers();
            for (let i = 0; i < this.models.length; i++) {
                let model = this.models[i];
                model.show = false;
                if (model.name === name) {
                    model.show = true;
                    model.modelMatrix = that.matrixTransform(116.142312, 40.119501, this.oriHeight + maxHeight, -86);
                    this.currentHeight = this.oriHeight + maxHeight
                    if (this.currentHeight == this.oriHeight) {
                        continue;
                    }
                    let currentHeight = this.oriHeight + maxHeight;
                    let changeRate = maxHeight * (interval / time)
                    let count = 1;
                    let timer = setInterval(function () {
                        let add = currentHeight - changeRate * (count++)
                        model.modelMatrix = that.matrixTransform(116.142312, 40.119501, add, -86);
                        if (count >= (time / interval)) {
                            model.modelMatrix = that.matrixTransform(116.142312, 40.119501, this.oriHeight, -86);
                            this.currentHeight = this.oriHeight
                            clearInterval(timer)
                        }
                    }, interval)
                    this.timers.push(timer)
                }
            }
        }
    }
};
</script>
<style lang="less" scoped>
.model-Split {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: aliceblue;
}
</style>
