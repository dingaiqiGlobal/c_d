<template>
    <div>
        <div id="cesiumContainer"></div>
        <div class="control">
            <button @click="hideAll()">隐藏所有构件</button>
            <button @click="showAll()">显示所有构件</button>
            <button @click="pickHide()">隐藏所选构件</button>
            <button @click="pickShow()">显示所选构件</button>
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
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)


    },

    methods: {
        hideAll() {
            this.tileset.show = false;
        },
        showAll() {
            for (let i = 0; i < this.featureArr.length; i++) {
                this.featureArr[i].show = true;
            }
            this.tileset.show = true;
            this.featureArr = []//清空
        },
        pickHide() {
            if (this.hightLighted.feature) {
                this.hightLighted.feature.show = false;
                this.featureArr.push(this.hightLighted.feature);
            }
        },
        pickShow() {
            if (this.hightLighted.feature) {
                this.hightLighted.feature.show = true;
            }
        },
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
