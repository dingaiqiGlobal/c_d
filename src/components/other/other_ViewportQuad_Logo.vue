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
        return {};
    },

    computed: {},

    mounted() {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
        let viewer = new Cesium.Viewer("cesiumContainer", {
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            vrButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: false,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
        })
        viewer._cesiumWidget._creditContainer.style.display = "none";

        //可以用div代替
        var viewportQuad = new Cesium.ViewportQuad();
        viewportQuad.rectangle = new Cesium.BoundingRectangle(5, 5, 80, 92);
        viewer.scene.primitives.add(viewportQuad);

        viewportQuad.material = new Cesium.Material({
            fabric: {
                type: "Image",
                uniforms: {
                    color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
                    image: Cesium.buildModuleUrl("Assets/Images/google_earth_credit.png"),
                },
            },
        });

    },
    methods: {}
};
</script>
<style lang="less" scoped></style>
