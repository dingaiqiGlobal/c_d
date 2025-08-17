<template>
    <div>
        <div id="view3D"></div>
        <div id="view2D"></div>
    </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
export default {
    components: {},

    data() {
        return {
            view3D: null,
            view2D: null,
        };
    },

    computed: {},

    mounted() {

        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
        this.view2D = new Cesium.Viewer("view2D", {
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
            sceneMode: Cesium.SceneMode.SCENE2D
        });
        this.view2D._cesiumWidget._creditContainer.style.display = "none";
        this.view3D = new Cesium.Viewer("view3D", {
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
        });
        this.view3D._cesiumWidget._creditContainer.style.display = "none";
        //percentageChanged在引发已更改事件之前，相机必须更改的数量。取值为[0,1]范围内的百分比。
        this.view3D.camera.percentageChanged = 0.01;
        // 监听三维地图变化
        this.view3D.camera.changed.addEventListener(this.sync2D);
    },
    methods: {
        sync2D() {
            // 三维地图中心点
            let center = new Cesium.Cartesian2(
                Math.floor(this.view3D.canvas.clientWidth / 2),
                Math.floor(this.view3D.canvas.clientHeight / 2)
            );
            // 转为世界坐标系
            let position = this.view3D.scene.camera.pickEllipsoid(center);
            // 判断中心点是否在椭球体上
            if (Cesium.defined(position)) {
                // 获取三维地图中心点与相机之间的距离
                let distance = Cesium.Cartesian3.distance(
                    position,
                    this.view3D.scene.camera.positionWC
                );
                // 更新二维地图
                this.view2D.scene.camera.lookAt(
                    position,
                    new Cesium.Cartesian3(0.0, 0.0, distance)
                )
            }
        }
    }
};
</script>
<style>
#view3D {
    display: inline-block;
    height: 780px;
    width: 50%;
}

#view2D {
    height: 780px;
    display: inline-block;
    width: 50%;
}
</style>
