<template>
    <div>
        <div id="cesiumContainer"></div>
        <div class="control">
            <div class="context" ref="context"></div>
        </div>
    </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
export default {
    components: {},

    data() {
        return {
            viewer: null,
            tileset: null,
            featureArr: [],//要改变的样式的要素集合
            hightLighted: {//高亮样式、颜色
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
        let viewer = this.viewer;
        const hightLighted = {
            feature: undefined,
            originalColor: new Cesium.Color(),
        }
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            if (Cesium.defined(hightLighted.feature)) {
                hightLighted.feature.color = hightLighted.originalColor;
                hightLighted.feature = undefined;
            }
            const pickedFeature = viewer.scene.pick(movement.position);
            if (!Cesium.defined(pickedFeature)) {
                return;
            }
            hightLighted.feature = pickedFeature;
            Cesium.Color.clone(
                pickedFeature.color,
                hightLighted.originalColor
            );
            pickedFeature.color = Cesium.Color.YELLOW;
            //信息查询
            let propertyNames = pickedFeature.getPropertyNames();
            let length = propertyNames.length;
            let html;
            for (let i = 0; i < length; i++) {
                let propertyName = propertyNames[i];
                html += `
                    <table>
                        <tr>
                            <td>${propertyName}:</td>
                            <td>${pickedFeature.getProperty(propertyName)}</td>
                        </tr>
                    </table>
                `;
            }
            this.$refs.context.innerHTML = html;
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

.control .context {
    left: 10px;
    top: 10px;
    width: 400px;
    height: 650px;
    background: white;
    font-size: 2px;
    z-index: 2;
    overflow: auto;
}
</style>
