export default class CesiumPopup {
    constructor(options) {
        //参数
        this.className = options.className || ''
        this.title = options.title || ''
        this.offset = options.offset || [0, 0]
        this.closeHander = this.closeHander.bind(this)
        //共有属性
        this._panelContainer = null
        this._contentContainer = null
        this._closeBtn = null
        this._renderListener = null
        this._viewer = null
    }
    addTo(viewer) {
        //两种判断方法第一种bug没解决
        // if (this._viewer) {
        //     this.remove()
        // }
        if (document.getElementsByClassName("cesium-popup-panel").length > 0) {
            document.getElementsByClassName("cesium-popup-panel")[0].remove();
        }

        this._viewer = viewer
        this.initPanle();
        //关闭按钮
        this._closeBtn.addEventListener('click', this.closeHander, false)
        if (this.position) {
            this._panelContainer.style.display = 'block'
            this._renderListener = this._viewer.scene.postRender.addEventListener(this.render, this)
        }
        return this
    }
    initPanle() {
        let closeBtnIcon = 'x'
        this._panelContainer = document.createElement('div')
        this._panelContainer.classList.add('cesium-popup-panel')
        if (this.className && this.className !== '') {
            this._panelContainer.classList.add(this.className)
        }
        this._closeBtn = document.createElement('div')
        this._closeBtn.classList.add('cesium-popup-close-btn')
        this._closeBtn.innerHTML = closeBtnIcon
        // 头部容器
        let headerContainer = document.createElement('div')
        headerContainer.classList.add('cesium-popup-header-panel')
        this.headerTitle = document.createElement('div')
        this.headerTitle.classList.add('cesium-poput-header-title')
        this.headerTitle.innerHTML = this.title
        headerContainer.appendChild(this.headerTitle)
        this._panelContainer.appendChild(this._closeBtn)
        this._panelContainer.appendChild(headerContainer)
        // 内容容器
        this._contentContainer = document.createElement('div')
        this._contentContainer.classList.add('cesium-popup-content-panel')
        this._contentContainer.innerHTML = this.content
        this._panelContainer.appendChild(this._contentContainer)
        //tip容器
        let tipContaienr = document.createElement('div')
        tipContaienr.classList.add('cesium-popup-tip-panel')
        let tipDiv = document.createElement('div')
        tipDiv.classList.add('cesium-popup-tip-bottom')
        tipContaienr.appendChild(tipDiv)
        this._panelContainer.appendChild(tipContaienr)
        this._panelContainer.style.display = 'none'
        // 添加到viewer
        this._viewer.cesiumWidget.container.appendChild(this._panelContainer)
    }
    setHTML(html) {
        if (this._contentContainer) {
            this._contentContainer.innerHTML = html
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
    addClassName(className) {
        if (this._panelContainer) {
            this._panelContainer.classList.add(className)
        }
        return this;
    }
    removeClass(className) {
        if (this._panelContainer) {
            this._panelContainer.classList.remove(className)
        }
        return this;
    }
    setTitle(title) {
        this.headerTitle.innerHTML = title
        return this;
    }
    setOffset(offset) {
        this.offset = offset
        return this;
    }
    closeHander() {
        this.remove()
    }
    remove() {
        this._closeBtn.removeEventListener('click', this.closeHander, false)
        if (this._closeBtn) {
            this._closeBtn.parentNode.removeChild(this._closeBtn)
            this._closeBtn = null
        }
        if (this._contentContainer) {
            this._contentContainer.parentNode.removeChild(this._contentContainer)
            this._contentContainer = null
        }
        if (this._panelContainer) {
            this._panelContainer.parentNode.removeChild(this._panelContainer)
            this._panelContainer = null
        }
        if (this._renderListener) {
            this._renderListener()
            this._renderListener = null
        }
        if (this._viewer) {
            this._viewer = null
        }
    }
}