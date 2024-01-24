import * as Cesium from "cesium/Cesium";
import RoamParticleSystem from './RoamParticleSystem';
class Roam {
    constructor(options) {
        this.modelUrl = options.modelUrl || '/data/model/Man.glb';
        this.viewer = options.viewer;
        //修改为北京时间
        this.startTime = Cesium.JulianDate.addHours(options.startTime, 8, new Cesium.JulianDate()) || Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
        this.stopTime = Cesium.JulianDate.addHours(options.stopTime, 8, new Cesium.JulianDate()) || Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 17));
        this.multiplie = options.multiplie || 1.3;
        this.dataRoam = options.dataRoam || [];

        this.roamModel = null;
        this.roamLine = null;
        this.RoamPS = null;//粒子效果
        this._trackView();
    }
    _trackView() {
        this.viewer.clock.startTime = this.startTime.clone();//时钟开启时间（复制）
        this.viewer.clock.stopTime = this.stopTime.clone();//结束时间
        this.viewer.clock.currentTime = this.startTime.clone();//当前时间
        this.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;//是否在结尾中循环
        this.viewer.clock.multiplier = this.multiplie;//倍数
        //this.viewer.timeline.zoomTo(this.startTime, this.stopTime)//将timeline设置为提供的时间

        //添加红色轨迹线
        let positionsArr = [];
        for (let i = 0; i < this.dataRoam.length; i++) {
            positionsArr.push([this.dataRoam[i].lng, this.dataRoam[i].lat])
        }
        this.roamLine = this.viewer.entities.add({
            name: 'roamLine',
            polyline: {
                //数组扁平
                positions: Cesium.Cartesian3.fromDegreesArray(positionsArr.flat()),
                width: 10,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.RED,
                }),
                clampToGround: true//贴地
            },
        })

        //模型轨迹
        let position = this._computeFlight(this.dataRoam);
        this.roamModel = this.viewer.entities.add({
            name: 'roamModel',
            position: position,
            //position: position.getValue(this.viewer.clock.currentTime),
            orientation: new Cesium.VelocityOrientationProperty(position),//根据速度计算方向角
            availability: new Cesium.TimeIntervalCollection([
                new Cesium.TimeInterval({
                    start: this.startTime,
                    stop: this.stopTime,
                }),
            ]),
            model: {
                uri: this.modelUrl,
                minimumPixelSize: 64,    
            },
            path: {
                leadTime: 0,//属性指定要显示的对象前面的秒数
                //trailTime属性指定要显示的对象前面的秒数
                resolution: 1,//该属性指定在采样位置时要步进的最大秒数
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.GREEN,
                }),
                width: 10,
            }
        })
        //this.viewer.trackedEntity = this.roamModel;//追随模型
        this.viewer.zoomTo(this.roamLine);//缩放到线范围

        this.RoamPS = new RoamParticleSystem({
            viewer: this.viewer,
            entity: this.roamModel
        });
    }

    //时间轴与位置绑定的函数
    _computeFlight(data) {
        let property = new Cesium.SampledPositionProperty();
        //插值算法
        property.setInterpolationOptions({
            interpolationDegree: 2,
            interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
        });
        for (let i = 0; i < data.length; i++) {
            let time = Cesium.JulianDate.addSeconds(
                this.startTime,
                // Cesium.JulianDate.secondsDifference(//秒差
                //     Cesium.JulianDate.addHours(
                //         Cesium.JulianDate.fromIso8601(data[i].time),
                //         8,
                //         new Cesium.JulianDate()
                //     ),
                //     this.startTime,
                // ),
                i,//匀速运行(this.positions是数据中的位置数组集合-节点，来平均分配时间)
                new Cesium.JulianDate()
            );
            let position = Cesium.Cartesian3.fromDegrees(
                data[i].lng,
                data[i].lat,
                0
            );//贴地
            // 添加位置，和时间对应
            property.addSample(time, position);
        }
        return property;
    }

    //视角切换
    // changeCamera() { 
    //     this.viewer.scene.preRender.addEventListener(this._renderListener)
    // }
    // _renderListener(e) {
    //     if (this.viewer.trackedEntity) {
    //         let ModelMatrix = this._getModelMatrix(this.viewer.trackedEntity, this.viewer.clock.currentTime, new Cesium.Matrix4());
    //         let transformX = 90; //距离运动点的距离（后方）
    //         let transformZ = 55; //距离运动点的高度（上方）
    //         let transformY = 0; //距离运动点的高度（侧方）
    //         this.viewer.camera.lookAtTransform(
    //             ModelMatrix,
    //             new Cesium.Cartesian3(-transformX, transformY, transformZ)
    //         );
    //     }
    // }
    // _getModelMatrix(entity, time, result) {
    //     //计算位置(getValueOrUndefined隐藏方法)
    //     let position = Cesium.Property.getValueOrUndefined(
    //         entity.position,
    //         time,
    //         new Cesium.Cartesian3()
    //     );
    //     if (!Cesium.defined(position)) {
    //         return undefined;
    //     }
    //     //计算朝向
    //     let orientation = Cesium.Property.getValueOrUndefined(
    //         entity.orientation,
    //         time,
    //         new Cesium.Quaternion()
    //     );
    //     if (!Cesium.defined(orientation)) {
    //         result = Cesium.Transforms.eastNorthUpToFixedFrame(
    //             position,
    //             undefined,
    //             result
    //         );
    //     } else {
    //         result = Cesium.Matrix4.fromRotationTranslation(
    //             Cesium.Matrix3.fromQuaternion(orientation, new Cesium.Matrix3()),
    //             position,
    //             result
    //         );
    //     }
    //     return result;
    // }
    //开始/暂停/继续
    pause() {
        this.viewer.clock.shouldAnimate = !this.viewer.clock.shouldAnimate;
    }
    //销毁
    destroy() {
        this.viewer.clock.shouldAnimate = false;
        this.viewer.trackedEntity = undefined;
        this.viewer.entities.remove(this.roamLine);
        this.viewer.entities.remove(this.roamModel);
        this.RoamPS.remove();//移除粒子效果
    }
    //倍速
    multipleChange(multiplie) {
        this.viewer.clock.multiplier = multiplie;
    }
}
export default Roam;