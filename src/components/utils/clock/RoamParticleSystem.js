import * as Cesium from "cesium/Cesium";
export default class RoamParticleSystem {
    constructor(options) {
        this.viewer = options.viewer;
        this.scene = this.viewer.scene;
        this.entity = options.entity,//跟随模型model
            //销毁初始化
        this.emitterModelMatrix = new Cesium.Matrix4();
        this.translation = new Cesium.Cartesian3();
        this.rotation = new Cesium.Quaternion();//旋转
        this.hpr = new Cesium.HeadingPitchRoll();
        this.trs = new Cesium.TranslationRotationScale();//平移旋转缩放
        //初始化
        this.init();
    }

    init() {
        this.particleSystem = this.scene.primitives.add(
            new Cesium.ParticleSystem({
                image: 'images/icon/particleSystem_fire.png',//生成所需粒子的图片路径
                startColor: Cesium.Color.fromCssColorString('rgba(75, 125, 172, 0.6)'),//粒子在生命周期开始时的颜色
                endColor: Cesium.Color.WHITE.withAlpha(0.0),//粒子在生命周期结束时的颜色           
                startScale: 0,//粒子在生命周期开始时初始比例     
                endScale: 5,//粒子在生命周期结束时比例              
                minimumParticleLife: 1,//粒子发射的最小速度               
                maximumParticleLife: 6,//粒子发射的最大速度   
                // minimumSpeed: 1,//粒子质量的最小界限               
                // maximumSpeed: 4,//粒子质量的最大界限               
                imageSize: new Cesium.Cartesian2(50, 50),//以像素为单位缩放粒子图像尺寸 
                // minimumImageSize: new Cesium.Cartesian2(0, 0),
                // maximumImageSize: new Cesium.Cartesian2(2, 2),
                emissionRate: 50,//每秒发射的粒子数         
                lifetime: 1, //粒子系统发射粒子的时间（秒）     
                loop: true,//粒子系统是否应该在完成时循环其爆发  
                sizeInMeters: true,//设置粒子的大小是否以米或像素为单位
                //系统的粒子发射器
                ////BoxEmitter 盒形发射器，ConeEmitter 锥形发射器，SphereEmitter 球形发射器，CircleEmitter圆形发射器
                emitter: new Cesium.CircleEmitter(2),

                //主模型参数(位置)，在声明周期中设置
                // modelMatrix: this._computeModelMatrix(entity, Cesium.JulianDate.now()),
                // emitterModelMatrix: this._computeEmitterModelMatrix(),

                // updateCallback: (particle, dt) => {//每一帧都要调用回调函数来更新一个粒子
                //     return this._applyGravity(particle, dt);
                // },
            })
        );

        //粒子系统和模型绑定，跟着模型跑
        this._preUpdateEvent()
    }
    //场景渲染事件
    _preUpdateEvent() {
        let _this = this;
        this.viewer.scene.preUpdate.addEventListener(function (scene, time) {
            //发射器地理位置
            _this.particleSystem.modelMatrix = _this._computeModelMatrix(_this.entity, time);
            //发射器局部位置
            _this.particleSystem.emitterModelMatrix = _this._computeEmitterModelMatrix();
        });
    }
    /**
     * 回调
     * @param {*} particle //粒子
     * @param {*} dt //延时
     */
    _applyGravity(particle, dt) {
        let gravityScratch = new Cesium.Cartesian3();//重力爪
        let position = particle.position
        //Cesium.Cartesian3.normalize(cartesian, result) → Cartesian3
        //计算笛卡尔坐标的标准化格式
        Cesium.Cartesian3.normalize(position, gravityScratch)
        //Cesium.Cartesian3.fromElements(x, y, z, result) → Cartesian3
        //从x, y和z坐标创建一个笛卡尔实例。
        Cesium.Cartesian3.fromElements(
            20 * dt,
            30 * dt,
            gravityScratch.y * dt,
            gravityScratch
        );
        //粒子速率
        //Cesium.Cartesian3.add(left, right, result) → Cartesian3
        //计算两个笛卡尔坐标的分量和
        particle.velocity = Cesium.Cartesian3.add(
            particle.velocity,
            gravityScratch,
            particle.velocity
        )
    }
    /**
     * 计算模型矩阵
     * @param {*} entity 
     * @param {*} time 
     * @returns 
     */
    _computeModelMatrix(entity, time) {
        //获取位置→ Cartesian3
        let position = Cesium.Property.getValueOrUndefined(
            entity.position,
            time,
            new Cesium.Cartesian3()
        );
        if (!Cesium.defined(position)) {
            return undefined;
        }
        //获取方向→ orientation
        let modelMatrix;
        let orientation = Cesium.Property.getValueOrUndefined(
            entity.orientation,
            time,
            new Cesium.Quaternion()
        );
        if (!Cesium.defined(orientation)) {
            modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(//ENU坐标系计算4*4矩阵
                position,
                undefined,
                new Cesium.Matrix4()
            );
        } else {
            //Cesium.Matrix4.fromRotationTranslation(rotation, translation, result) → Matrix4
            //从表示旋转的Matrix3和表示平移的Cartesian3计算一个Matrix4实例
            modelMatrix = Cesium.Matrix4.fromRotationTranslation(
                Cesium.Matrix3.fromQuaternion(
                    orientation,
                    new Cesium.Matrix3()
                ),
                position,
                new Cesium.Matrix4()
            );
        }
        return modelMatrix;
    }
    /**
     * 计算粒子发射矩阵（相对于模型）
     * @returns 
     */
    _computeEmitterModelMatrix() {
        this.hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, this.hpr);//方向
        this.trs.translation = Cesium.Cartesian3.fromElements(//平移设置
            -4.0,
            0.0,
            1.4,
            this.translation
        );
        this.trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(this.hpr, this.rotation);//旋转设置
        return Cesium.Matrix4.fromTranslationRotationScale(//矩阵计算
            this.trs,
            this.emitterModelMatrix
        );
    }

    removeEvent() {
        this.viewer.scene.preUpdate.removeEventListener(this._preUpdateEvent, this);
        this.emitterModelMatrix = undefined;
        this.translation = undefined;
        this.rotation = undefined;
        this.hpr = undefined;
        this.trs = undefined;
    }

    //移除粒子特效
    remove() {
        () => { return this.removeEvent() }; //清除事件
        this.viewer.scene.primitives.remove(this.particleSystem); //删除粒子对象
        this.viewer.entities.remove(this.entity); //删除entity
    }

}