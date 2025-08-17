<template>
    <div>
        <div id="cesiumContainer" ref="cesiumContainer"></div>
        <div class="control">
        </div>
    </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import Tooltip from "../utils/tooltip/Tooltip";
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

            //消息框
            let cartesian2 = movement.position;
            let cartesian3 = this.viewer.scene.pickPosition(cartesian2);
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            lat = lat.toFixed(5)
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            lng = lng.toFixed(5)

            let viewerDiv = this.$refs.cesiumContainer;
            let TooltipCesium = new Tooltip(viewerDiv);
            TooltipCesium.showAt(cartesian2, `标注`);

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    methods: {

    }
};
</script>
<style>
.control {
    position: absolute;
    z-index:9;
    left: 10px;
    top: 10px;
}
.tooltipdiv-right{
    position: absolute;
    z-index:10;
    background-color: aliceblue;
}
</style>
