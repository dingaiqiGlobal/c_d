import * as Cesium from "cesium/Cesium";
export default class CesiumPopupBillboard {
    constructor(options) {
        //参数
        this.offset = options.offset || [0, 0];//偏移
        //共有属性
        this._panelContainer = null;
        this._renderListener = null;
        this._viewer = null;
    }
    addTo(viewer) {
        this._viewer = viewer
        this.initPanle();
        if (this.position) {
            this._panelContainer.style.display = 'block'
            this._renderListener = this._viewer.scene.postRender.addEventListener(this.render, this)
        }
        return this
    }
    initPanle() {
        //面板容器
        this._panelContainer = document.createElement('div')
        this._panelContainer.classList.add('cesium-popup-panel')
        this._panelContainer.innerHTML = this.content
        // 添加到viewer
        this._viewer.cesiumWidget.container.appendChild(this._panelContainer)
    }
    setHTML(html) {
        if (this._panelContainer) {
            this._panelContainer.innerHTML = html
        }
        this.content = html
        return this;
    }
    render() {
        let geometry = this.position
        if (!geometry) return
        let position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this._viewer.scene, geometry)
        if (!position) {
            return
        }
        if (this._panelContainer) {
            this._panelContainer.style.left = position.x - this._panelContainer.offsetWidth / 2 + this.offset[0] + 'px';
            this._panelContainer.style.top = position.y - this._panelContainer.offsetHeight - 10 + this.offset[1] + 'px';
        }

    }
    setPosition(cartesian3) {
        this.position = cartesian3
        return this;
    }
}