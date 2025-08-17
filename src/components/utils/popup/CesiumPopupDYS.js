
// class BaseEvent {
//     constructor() {
//         // 事件集,用来存储后期需要存储的方法
//         this.handles = {};
//     }

//     // 订阅事件
//     on(eventType, handle) {
//         if (!this.handles.hasOwnProperty(eventType)) {
//             this.handles[eventType] = [];
//         }
//         if (typeof handle == 'function') {
//             this.handles[eventType].push(handle);
//         } else {
//             throw new Error('缺少回调函数');
//         }
//         return this; // 实现链式操作
//     }
//     // 发布事件
//     emit(eventType, ...args) {
//         if (this.handles.hasOwnProperty(eventType)) {
//             this.handles[eventType].forEach((item, key, arr) => {
//                 item.apply(null, args);
//             });
//         } else {
//             throw new Error(eventType + "事件未注册");
//         }
//         return this; // 实现链式操作
//     }
//     取消订阅
//     off(eventType, handle) {
//         if (!this.handles.hasOwnProperty(eventType)) {
//             throw new Error(eventType + "事件未注册");
//         } else {
//             this.handles[eventType].forEach((item, key, arr) => {
//                 if (item == handle) {
//                     arr.splice(key, 1);
//                 }
//             });
//         }
//         return this; // 实现链式操作
//     }
// }

/**
 * CesiumPopup
 */
let _panelContainer = null
let _closeBtn = null
let _renderListener = null
let _viewer = null

class CesiumPopup {
    constructor() {
        this.position = null
    }
    addTo(viewer) {
        //先移除
        if (_viewer) {
            this.remove()
        }
        _viewer = viewer;//赋值
        this.initPanle();//初始化面板

        //dom中关闭面板，添加事件监听，false冒泡传递
        _closeBtn = document.querySelector('.cesium-popup-close-btn');
        _closeBtn.addEventListener('click', this.remove, false);
        //如果存在位置，面板显示、场景渲染事件
        if (this.position) {
            _panelContainer.style.display = 'block';
            //cesium中addEventListener(listener, scope)
            _renderListener = _viewer.scene.postRender.addEventListener(this.render, this)//this改变指向
        }
        return this;//链式调用

    }
    remove() {
        //移除事件监听
        // _closeBtn.removeEventListener('click', this.closeHander, false);
        if (_closeBtn) {
            _closeBtn.parentNode.removeChild(_closeBtn)//获取父节点移除子节点（就是删除自己）
            _closeBtn = null
        }
        if (_panelContainer) {
            _panelContainer.parentNode.removeChild(_panelContainer)
            _panelContainer = null
        }
        //移除场景事件监听
        if (_renderListener) {
            _renderListener()
            _renderListener = null
        }
        if (_viewer) {
            _viewer = null
        }
    }
    initPanle() {
        let html = `
                <div class="cesium-popup-close-btn">
                    <button>X</button>
                </div>
                <div class="cesium-popup-header-panel">
                    <div class="cesium-poput-header-title">
                    </div>
                </div>
                <div class="cesium-popup-content-panel">
                </div>
                <div class="cesium-popup-tip-panel">
                    <div class="cesium-popup-tip-bottom">
                    </div>
                </div>
                `
        _panelContainer = document.createElement("div");
        _panelContainer.classList.add('cesium-popup-panel');
        _panelContainer.innerHTML = html;
        _panelContainer.style.display = 'none'
        _viewer.container.appendChild(_panelContainer);

    }
    setPosition(cartesian3) {
        this.position = cartesian3;
        return this;//链式调用
    }
    render() {
        let geometry = this.position
        if (!geometry) return
        let position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            _viewer.scene,
            geometry
        )
        if (!position) {
            return
        }
        if (_panelContainer) {
            _panelContainer.style.left = position.x - _panelContainer.offsetWidth / 2 + 'px';
            _panelContainer.style.top = position.y - _panelContainer.offsetHeight - 30 + 'px';
        }
    }

}
export { CesiumPopup };