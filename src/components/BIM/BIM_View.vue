<template>
    <div>
        <div id="cesiumContainer"></div>
        <div class="control">
            <select id="type">
                <option value="none">无</option>
                <option value="front">前视图</option>
                <option value="back">后视图</option>
                <option value="left">左视图</option>
                <option value="right">右视图</option>
                <option value="top">顶视图</option>
                <option value="bottom">底视图</option>
            </select>
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
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        let typeSelect = document.getElementById('type');
        typeSelect.onchange = () => {
            let value = typeSelect.value;
            switch (value) {
                case "front":
                    this.zoomModelTo(Cesium.Math.toRadians(0), Cesium.Math.toRadians(0), this.tileset.boundingSphere.radius * 4.0);
                    break;
                case "back":
                    this.zoomModelTo(Cesium.Math.toRadians(180), Cesium.Math.toRadians(0), this.tileset.boundingSphere.radius * 4.0);
                    break;
                case "left":
                    this.zoomModelTo(Cesium.Math.toRadians(90), Cesium.Math.toRadians(0), this.tileset.boundingSphere.radius * 4.0);
                    break;
                case "right":
                    this.zoomModelTo(Cesium.Math.toRadians(-90), Cesium.Math.toRadians(0), this.tileset.boundingSphere.radius * 4.0);
                    break;
                case "top":
                    this.zoomModelTo(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-90), this.tileset.boundingSphere.radius * 4.0);
                    break;
                case "bottom":
                    this.zoomModelTo(Cesium.Math.toRadians(0), Cesium.Math.toRadians(90), this.tileset.boundingSphere.radius * 4.0);
                    break;
                default:
                    this.zoomModelTo(0.5, -0.2, this.tileset.boundingSphere.radius * 4.0)
            }
        }

    },

    methods: {
        zoomModelTo(Heading, Pitch, Range) {
            this.viewer.zoomTo(
                this.tileset,
                new Cesium.HeadingPitchRange(
                    Heading,
                    Pitch,
                    Range,
                )
            );
        }
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
</style>
