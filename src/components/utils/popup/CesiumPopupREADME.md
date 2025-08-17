CesiumPopup都需要css加持

一、CesiumPopup.js为es5封装，采用链式调用，添加了消息订阅与发布（观察作用），调用方式如下
let a = new CesiumPopup({
    title: '信息'
}).setPosition(position).setHTML(html).addTo(this.viewer).setTitle('详细信息框');

二、CesiumPopupDing.js（最好用）
整合了所有气泡框的优点，采用了viewer.scene.postRender.addEventListener的事件监听
new Popup({
    viewer: this.viewer,
    geometry: position,
    name: '详细信息',
    html: html
})

三、CesiumPopupDYS.js
模仿一

四、CesiumPopupLZP.js
志平封装，采用viewer.clock.onTick.addEventListener的事件监听

五、CesiumPopupES6
模仿一，ES6版本
