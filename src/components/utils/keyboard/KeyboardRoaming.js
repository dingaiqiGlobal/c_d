/**
 * 相机位置：W：向前；S：向后；D：向右；A：向左；Q：升高；E：降低；
 * 相机姿态：↑：抬头；↓：低头；←：左转；→：右转；0：顺时针；.：逆时针
 * 缩放：+：放大，-：缩小；
 */
class KeyboardRoaming {
    constructor(viewer) {
        this.viewer = viewer;
        this.flags = {//标记
            // 相机位置
            moveForward: false,
            moveBackward: false,
            moveLeft: false,
            moveRight: false,
            moveUp: false,
            moveDown: false,
            // 相机姿态
            lookUp: false,
            lookDown: false,
            lookLeft: false,
            lookRight: false,
            twistLeft: false,
            twistRight: false,
            // 缩放
            zoomIn: false,
            zoomOut: false
        };
        this.keyboardMapRoamingInit();
    }
    /**
     * @description: 使用键盘控制地图漫游初始化
     */
    keyboardMapRoamingInit() {
        // 添加键盘监听事件
        document.addEventListener('keydown', (e) => { this.keyDown(e) }, false);
        document.addEventListener('keyup', (e) => { this.keyUp(e) }, false);
        // 为每一帧添加监听事件
        this.viewer.clock.onTick.addEventListener(() => {
            this.keyboardMapRoamingRender();
        });
    }

    /**
     * @description: 根据键盘输入字符返回事件信息
     * @param {*} key
     * @return {*}
     */
    getFlagFromKeyboard(key) {
        switch (key) {
            // 按字符的Unicode编码
            // 相机位置
            case 87:
                return 'moveForward';
            case 83:
                return 'moveBackward';
            case 68:
                return 'moveRight';
            case 65:
                return 'moveLeft';
            case 81:
                return 'moveUp';
            case 69:
                return 'moveDown';
            // 相机姿态 
            case 38:
                return 'lookUp';
            case 40:
                return 'lookDown';
            case 37:
                return 'lookLeft';
            case 39:
                return 'lookRight';
            case 96:
                return 'twistLeft';
            case 110:
                return 'twistRight';
            // 缩放
            case 107:
                return 'zoomIn';
            case 109:
                return 'zoomOut';
            default:
                return undefined;
        }
    }

    /**
     * @description: 键盘按下
     * @param {*} event
     * @return {*}
     */
    keyDown(e) {
        let flagName = this.getFlagFromKeyboard(e.keyCode)
        if (typeof flagName !== 'undefined') {
            this.flags[flagName] = true;
        }
    }

    /**
     * @description: 键盘弹起
     * @param {*} event
     * @return {*}
     */
    keyUp(e) {
        let flagName = this.getFlagFromKeyboard(e.keyCode)
        if (typeof flagName !== 'undefined') {
            this.flags[flagName] = false;
        }
    }

    /**
     * @description: 根据事件调整相机
     */
    keyboardMapRoamingRender() {
        let camera = this.viewer.camera;
        let ellipsoid = this.viewer.scene.globe.ellipsoid;
        let cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
        let moveRate = cameraHeight / 20.0;//根据相机高度设置移动距离

        if (this.flags.moveForward) {
            camera.moveForward(moveRate);
        }
        if (this.flags.moveBackward) {
            camera.moveBackward(moveRate);
        }
        if (this.flags.moveLeft) {
            camera.moveLeft(moveRate);
        }
        if (this.flags.moveRight) {
            camera.moveRight(moveRate);
        }
        if (this.flags.moveUp) {
            camera.moveUp(moveRate);
        }
        if (this.flags.moveDown) {
            camera.moveDown(moveRate);
        }
        if (this.flags.lookUp) {
            camera.lookUp();
        }
        if (this.flags.lookDown) {
            camera.lookDown();
        }
        if (this.flags.lookLeft) {
            camera.lookLeft();
        }
        if (this.flags.lookRight) {
            camera.lookRight();
        }
        if (this.flags.twistLeft) {
            camera.twistLeft();
        }
        if (this.flags.twistRight) {
            camera.twistRight();
        }
        // 根据相机高度设置缩放参数
        if (this.flags.zoomIn) {
            camera.zoomIn(cameraHeight / 2);
        }
        if (this.flags.zoomOut) {
            camera.zoomOut(cameraHeight / 2);
        }
    }
}
export default KeyboardRoaming;