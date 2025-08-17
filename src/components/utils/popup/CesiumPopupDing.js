import * as Cesium from "cesium/Cesium";
class Popup {
    /**
     * 初始化
     * @param {object} info - 参数对象
     * @param {object} viewer - viewer
     * @param {string} info.geometry - 位置
     * @param {string} options.name - name(title)
     * @param {object} [options.properties] - 显示属性（对象）
     * @param {string} [options.html] - html
     */
    constructor(info) {
        if (document.getElementsByClassName("cesium-popup-panel").length > 0) {
            document.getElementsByClassName("cesium-popup-panel")[0].remove();
        }
        this.viewer = info.viewer;//弹窗创建的viewer
        this.geometry = info.geometry;//弹窗挂载的位置
        this.properties = info.properties;//显示属性

        this.ctn = document.createElement("div");
        this.ctn.classList.add("cesium-popup-panel");//添加类名集合
        this.id = 0;
        this.id = `popup${this.id++}`;
        this.ctn.id = this.id
        this.viewer.container.append(this.ctn);//将div添加到viewer中

        //可以传properties和html
        if (info.properties) {
            let content = this.createTable(info.properties);
            this.ctn.innerHTML = this.createHtml(info.name, content);
        } else {
            this.ctn.innerHTML = this.createHtml(info.name, info.html);
        }
        //渲染
        this.render();
        //拖动重新渲染位置监听
        this.renderListener = this.viewer.scene.postRender.addEventListener(
            this.render,
            this
        );
        //弹窗关闭按钮监听
        this.closeBtn = document.querySelector('.cesium-popup-close-btn');
        this.closeBtn.addEventListener('click', this.close.bind(this), false);
    }
    render() {
        if (this.geometry == null || this.geometry.x == null || this.geometry.y == null) return;
        let position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            this.viewer.scene,
            this.geometry
        )
        //偏移设置
        this.ctn.style.left = position.x - this.ctn.offsetWidth / 2 + "px";
        this.ctn.style.top = position.y - this.ctn.offsetHeight - 30 + "px";
    }
    createTable(properties) {
        //考虑video
        let html = `<table class="table-popup">`;
        for (let key in properties) {
            if (key == 'isVideo' || key == 'callback' || key == 'popup') continue;//对象头，跳出
            html += `<tr>
                        <td class="title-popup">${key}</td>
                        <td class="value-popup">${properties[key]}</td>
                    </tr>`;
        }
        html += `</table > `;
        if (this.properties.isVideo) {
            html = `<video style='width: 300px;height: 180px;' autoplay loop crossorigin controls>
                        <source src=${this.properties.url}  type='video/mp4'>
                    </video>`;
        }
        return html;
    }
    createHtml(header, content) {
        let html = `
        <div class="cesium-popup-header-panel">
            <div class="cesium-popup-close-btn" >
                X
            </div>
            <div class="cesium-poput-header-title">
                ${header}
            </div>
        </div>
        <div class="cesium-popup-content-panel" >
           ${content}
        </div>
        <div class="cesium-popup-tip-panel" >
            <div class="cesium-popup-tip-bottom" >
            </div>
        </div>
        `;
        return html;
    }
    close() {
        this.ctn.remove();
        this.renderListener = null;//解除监听
    }
    addClassName(className) {
        if (this.ctn) {
            this.ctn.classList.add(className)
        }
        return this;//链式调用
    }
    removeClass(className) {
        if (this.ctn) {
            this.ctn.classList.remove(className)
        }
        return this;
    }
}
export default Popup; 