<template>
    <div>
        <div id="cesiumContainer"></div>
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
        const tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: 'data/3dtiles/bim/tileset.json',
            })
        );
        tileset.readyPromise
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

        //初始化选中的feature变量
        let selected = {
            feature: undefined,
            originalColor: new Cesium.Color()
        };

        // 创建一个实体，它保存有关当前所选feature的信息，以供信息框显示
        const selectedEntity = new Cesium.Entity();
        const clickHandler = this.viewer.screenSpaceEventHandler.getInputAction(
            Cesium.ScreenSpaceEventType.LEFT_CLICK
        );

        //如果支持轮廓，则鼠标悬停feature时 轮廓颜色为蓝色，鼠标单击时轮廓为绿色，
        //如果不支持轮廓，请将feature颜色更改为鼠标悬停时的黄色和单击时的绿色。
        if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(this.viewer.scene)) {
            // 设置鼠标悬停设置为蓝色
            const silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
            silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
            silhouetteBlue.uniforms.length = 0.01;
            silhouetteBlue.selected = [];
            // 鼠标单击设置为绿色
            const silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
            silhouetteGreen.uniforms.color = Cesium.Color.LIME;
            silhouetteGreen.uniforms.length = 0.01;
            silhouetteGreen.selected = [];
            this.viewer.scene.postProcessStages.add(
                Cesium.PostProcessStageLibrary.createSilhouetteStage([
                    silhouetteBlue,
                    silhouetteGreen
                ])
            );

            /**
             * 支持轮廓
             */
            this.viewer.screenSpaceEventHandler.setInputAction(movement => {
                silhouetteBlue.selected = [];
                const pickedFeature = this.viewer.scene.pick(movement.endPosition);
                if (pickedFeature !== selected.feature) {
                    silhouetteBlue.selected = [pickedFeature];
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            this.viewer.screenSpaceEventHandler.setInputAction(movement => {
                silhouetteGreen.selected = [];
                const pickedFeature = this.viewer.scene.pick(movement.position);
                if (!Cesium.defined(pickedFeature)) {
                    clickHandler(movement);
                    return;
                }
                if (silhouetteGreen.selected[0] === pickedFeature) {
                    return;
                }
                const hightlightedFeature = silhouetteBlue.selected[0];
                if (pickedFeature === hightlightedFeature) {
                    silhouetteBlue.selected = [];
                }
                silhouetteGreen.selected = [pickedFeature];
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        } else {
            let highlighted = {
                feature: undefined,
                originalColor: new Cesium.Color()
            };
            this.viewer.screenSpaceEventHandler.setInputAction(movement => {
                if (Cesium.defined(highlighted.feature)) {
                    highlighted.feature.color = highlighted.originalColor;
                    highlighted.feature = undefined;
                }
                const pickedFeature = this.viewer.scene.pick(movement.endPosition);
                if (pickedFeature !== selected.feature) {
                    highlighted.feature = pickedFeature;
                    Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
                    pickedFeature.color = Cesium.Color.YELLOW;
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            this.viewer.screenSpaceEventHandler.setInputAction(movement => {
                if (Cesium.defined(selected.feature)) {
                    selected.feature.color = selected.originalColor;
                    selected.feature = undefined;
                }
                const pickedFeature = this.viewer.scene.pick(movement.position);
                if (!Cesium.defined(pickedFeature)) {
                    clickHandler(movement);
                    return;
                }
                if (selected.feature === pickedFeature) {
                    return;
                }
                selected.feature = pickedFeature;
                if (pickedFeature === highlighted.feature) {
                    Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
                    highlighted.feature = undefined;
                } else {
                    Cesium.Color.clone(pickedFeature.color, selected.originalColor);
                }
                pickedFeature.color = Cesium.Color.LIME;
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }

    },

    methods: {}
};
</script>
<style></style>
