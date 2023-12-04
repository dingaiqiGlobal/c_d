import * as Cesium from "cesium/Cesium";
export class RotateFly {
    constructor(viewer, amount, origin) {
        this._viewer = viewer;
        this._amount = amount;
        this._origin = origin;
    }

    // 绑定事件
    _bindEvent() {
        this._viewer.clock.onTick.addEventListener(this._rotateFly, this);
    }

    // 解除绑定
    _unbindEvent() {
        this._viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        this._viewer.clock.onTick.removeEventListener(this._rotateFly, this);
    }

    // 开始
    start() {
        this._viewer.clock.shouldAnimate = true;
        this._unbindEvent();
        this._bindEvent();
        return this;
    }

    // 停止
    stop() {
        this._unbindEvent();
        return this;
    }

    //绕点飞行与相机原地飞行
    _rotateFly() {
        let heading = this._viewer.camera.heading;
        heading += Cesium.Math.toRadians(this._amount);
        let pitch = Cesium.Math.toRadians(-45);// 相机看点的角度
        let distance = 300; //相机距离点多少距离

        this._viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(this._origin.lng, this._origin.lat, 0), // 点的坐标
            orientation: {
                heading: heading,
                pitch: pitch,

            }
        });
        this._viewer.camera.moveBackward(distance);//后退距离


        /**相机原地飞行和绕点飞行类似，不需要点的坐标和距离*/
        // let heading = this._viewer.camera.heading;
        // let pitch = this._viewer.camera.pitch;
        // let roll = this._viewer.camera.roll;

        // heading += Cesium.Math.toRadians(this._amount);
        // if (heading >= Math.PI * 2 || heading <= -Math.PI * 2) {
        //     heading = 0;
        // }

        // this._viewer.camera.setView({
        //     orientation: {
        //         heading: heading,
        //         pitch: pitch,
        //         roll: roll
        //     }
        // })
    }
}
