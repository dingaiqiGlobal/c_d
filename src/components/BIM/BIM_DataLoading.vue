<template>
    <div>
        <div id="cesiumContainer"></div>
        <div class="control">
        </div>
    </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import Popup from "../utils/popup/CesiumPopupDing";
export default {
    components: {},

    data() {
        return {
            viewer: null,
            tileset: null,
            //移除要素集合
            featureArr: [],
            // 高亮元素
            hightLighted: {
                feature: undefined,
                originalColor: new Cesium.Color(),
            }
        };
    },

    computed: {},

    mounted() {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
        this.viewer = new Cesium.Viewer("cesiumContainer", {
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            selectionIndicator: false,
            timeline: false,
            sceneModePicker: false,
            sceneModePicker: false,
            navigationHelpButton: false,
        })
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
        this.tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: 'data/3dtiles/bim/tileset.json',
            })
        );
        this.tileset.readyPromise
            .then(tileset => {
                this.viewer.zoomTo(
                    tileset,
                    new Cesium.HeadingPitchRange(
                        0.5,
                        -0.2,
                        tileset.boundingSphere.radius * 4.0
                    )
                );
            })

        const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        handler.setInputAction(movement => {
            // 清除之前的高亮元素
            if (Cesium.defined(this.hightLighted.feature)) {
                this.hightLighted.feature.color = this.hightLighted.originalColor;
                this.hightLighted.feature = undefined;
            }

            // 选择新要素
            const pickedFeature = this.viewer.scene.pick(movement.position);
            if (!Cesium.defined(pickedFeature)) {
                return;
            }
            // 存储选中要素的信息
            this.hightLighted.feature = pickedFeature;
            Cesium.Color.clone(
                pickedFeature.color,
                this.hightLighted.originalColor
            );
            // 高亮选中元素
            pickedFeature.color = Cesium.Color.YELLOW;
            let position = this.viewer.scene.pickPosition(movement.position);
            if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
                let html = '自定义物联网请求（AJAX）+图表Chart渲染'
                let info = new Popup({
                    viewer: this.viewer,
                    geometry: position,
                    name: '详细信息',
                    html: html
                })
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    methods: {

    }
};
</script>
<style>
.control {
    position: absolute;
    z-index: 999;
    left: 10px;
    top: 10px;
}

/* pop框css*/
.cesium-popup-panel {
    opacity: 0.8;
    width: 312px;
    position: absolute;
    z-index: 999;
    color: #00fcf9;

    background: rgba(23, 50, 108, 0.6);
    border: 1px solid #4674d6;
}

.cesium-popup-tip-panel {
    width: 40px;
    height: 20px;
    position: absolute;
    left: 50%;
    bottom: -20px;
    margin-left: -20px;
    overflow: hidden;
    pointer-events: none;
    opacity: 0.8;
}

.cesium-popup-tip-bottom {
    width: 17px;
    background: rgba(23, 50, 108, 0.8);
    border-bottom: 1px solid #4674d6;
    height: 17px;
    padding: 1px;
    margin: -10px auto 0;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}

.cesium-popup-header-panel {
    /* display: flex; */
    /* justify-content: space-between; */
    align-items: center;
    font-size: 14px;
    padding: 5px 15px;
    background: rgba(23, 50, 108, 0.8);

    border-bottom: 1px solid #4674d6;
}

.cesium-poput-header-title {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
}

.cesium-popup-content-panel {
    padding: 18px;
    text-align: left;
    line-height: 30px;
}

.cesium-popup-close-btn {
    float: right;
    position: relative;
    right: 10px;
}

.cesium-popup-close-btn,
.cesium-popup-close-btn:focus {
    cursor: pointer;
}

cesium-popup-close-btn>svg:hover {
    color: #00fcf9 !important;
}

.cesium-popup-close-btn>svg {
    user-select: auto;
    color: #4674d6;
    cursor: pointer;
    width: 15px;
    /* height: 15px; */
}
</style>
