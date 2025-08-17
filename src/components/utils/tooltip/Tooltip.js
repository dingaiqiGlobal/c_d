class Tooltip {
    constructor(frameDiv) {
        //css样式组件中控制
        let div = document.createElement('DIV');
        div.className = "tooltipdiv-right";

        let arrow = document.createElement('DIV');
        arrow.className = "tooltipdiv-arrow";
        div.appendChild(arrow);

        let title = document.createElement('DIV');
        title.className = "tooltipdiv-inner";
        div.appendChild(title);

        frameDiv.appendChild(div);

        this._div = div;
        this._title = title;
    }

    /**
     * 设置提示框可见
     * @param {boolean} visible 
     */
    setVisible(visible) {
        this._div.style.display = visible ? 'block' : 'none';
    }

    /**
     * 设置显示位置
     * @param {Object} position 
     * @param {String} message 
     */
    showAt(position, message) {
        if (position && message) {
            this.setVisible(true);
            this._title.innerHTML = message;
            this._div.style.left = position.x + 10 + "px";
            this._div.style.top = (position.y - this._div.clientHeight / 2) + "px";
        }
    }

}
export default Tooltip;