<template>
    <div>
        <div id="cesiumContainer"></div>
        <div class="control">
            <button @click="changeBgColor">更改背景色</button>
            <button @click="changeSkyBox">更改天空盒</button>
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
        //背景透明
        this.viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);
        //关闭大气
        this.viewer.scene.skyAtmosphere.show = false
        //抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;

        //关闭天空月亮
        this.viewer.scene.sun.show = false; //在Cesium1.6(不确定)之后的版本会显示太阳和月亮，不关闭会影响展示
        this.viewer.scene.moon.show = false;
        this.viewer.scene.skyBox.show = false;//关闭天空盒，否则会显示天空颜色
        //隐藏地球
        this.viewer.scene.undergroundMode = true; //重要，开启地下模式，设置基色透明，这样就看不见黑色地球了
        this.viewer.scene.globe.show = false; //不显示地球，这条和地球透明度选一个就可以
    },

    methods: {
        changeBgColor() {
            this.viewer.scene.skyBox.show = false;
            this.viewer.scene.backgroundColor = Cesium.Color.DARKTURQUOISE;
        },
        changeSkyBox() {
            this.viewer.scene.skyBox = new Cesium.SkyBox({
                sources: {
                    negativeX: 'images/skyBox/two/tycho2t3_80_mx.jpg',
                    positiveX: 'images/skyBox/two/tycho2t3_80_px.jpg',
                    negativeY: 'images/skyBox/two/tycho2t3_80_my.jpg',
                    positiveY: 'images/skyBox/two/tycho2t3_80_py.jpg',
                    negativeZ: 'images/skyBox/two/tycho2t3_80_mz.jpg',
                    positiveZ: 'images/skyBox/two/tycho2t3_80_pz.jpg'
                }
            })
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
