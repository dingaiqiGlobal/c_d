<template>
    <div>
        <div id="cesiumContainerL" class="left">
            <div id="creditContainerL" style="display: none;"></div>
        </div>
        <div id="cesiumContainerR" class="right">
            <div id="creditContainerR" style="display: none;"></div>
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

        };
    },

    computed: {},

    mounted() {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
        let viewerL = new Cesium.Viewer('cesiumContainerL', {
            selectionIndicator: false,
            animation: false,
            shouldAnimate: false,
            homeButton: false,
            fullscreenButton: false,
            baseLayerPicker: false,
            geocoder: false,
            timeline: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            infoBox: false,
            requestRenderMode: false,
            scene3DOnly: false,
            sceneMode: 3,
            fullscreenElement: document.body,
            contextOptions: {
                webgl: {
                    alpha: false,
                }
            },
        });
        viewerL.cesiumWidget.creditContainer.style.display = "none";
        const tilesetL = viewerL.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: '../data/3dtiles/bim/tileset.json',
            })
        );
        tilesetL.readyPromise
            .then(tilesetL => {
                viewerL.zoomTo(
                    tilesetL,
                    new Cesium.HeadingPitchRange(
                        0,
                        0,
                        0
                    )
                );
            })

        let viewerR = new Cesium.Viewer('cesiumContainerR', {
            selectionIndicator: false,
            animation: false,
            shouldAnimate: false,
            homeButton: false,
            fullscreenButton: false,
            baseLayerPicker: false,
            geocoder: false,
            timeline: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            infoBox: false,
            requestRenderMode: false,
            scene3DOnly: false,
            sceneMode: 3,
            fullscreenElement: document.body,
            contextOptions: {
                webgl: {
                    alpha: false,
                }
            },
        });
        viewerR.cesiumWidget.creditContainer.style.display = "none";
        const tilesetR = viewerR.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: '../data/3dtiles/bim/tileset.json',
            })
        );
        tilesetL.readyPromise
            .then(tilesetR => {
                viewerR.zoomTo(
                    tilesetR,
                    new Cesium.HeadingPitchRange(
                        0,
                        0,
                        0
                    )
                );
            })

        let sceneL = viewerL.scene;
        let sceneR = viewerR.scene;

        //监听两个相机事件
        let handlerL = new Cesium.ScreenSpaceEventHandler(sceneL.canvas);
        let ellipsoidL = sceneL.globe.ellipsoid;
        let handlerR = new Cesium.ScreenSpaceEventHandler(sceneR.canvas);
        let ellipsoidR = sceneR.globe.ellipsoid;

        handlerL.setInputAction(function (movement) {
            isLeftTrigger = true;
            isRightTrigger = false;
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handlerR.setInputAction(function (movement) {
            isLeftTrigger = false;
            isRightTrigger = true;
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        let isLeftTrigger = false;
        let isRightTrigger = false;

        let syncViewerL = function () {
            if (isLeftTrigger) {
                viewerR.camera.flyTo({
                    destination: viewerL.camera.position,
                    orientation: {
                        heading: viewerL.camera.heading,
                        pitch: viewerL.camera.pitch,
                        roll: viewerL.camera.roll
                    },
                    duration: 0.0
                });
            }

        }

        viewerL.camera.changed.addEventListener(syncViewerL);
        viewerL.scene.preRender.addEventListener(syncViewerL);

        let syncViewerR = function () {
            if (isRightTrigger) {
                viewerL.camera.flyTo({
                    destination: viewerR.camera.position,
                    orientation: {
                        heading: viewerR.camera.heading,
                        pitch: viewerR.camera.pitch,
                        roll: viewerR.camera.roll
                    },
                    duration: 0.0
                });
            }
        }

        viewerL.camera.changed.addEventListener(syncViewerR);
        viewerL.scene.preRender.addEventListener(syncViewerR);

    },

    methods: {}
};
</script>
<style>
.left,
.right {
    width: 50%;
    height: 781px;
    float: left;
}
</style>
