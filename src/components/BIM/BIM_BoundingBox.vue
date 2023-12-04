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
            .then(() => {
                var a = this.tileset._root._boundingVolume._orientedBoundingBox.halfAxes;
                var center = this.tileset._root._boundingVolume._orientedBoundingBox.center;
                let originPoint1 = new Cesium.Entity({
                    id: 'ceshi1',
                    position: center,
                    point: {
                        color: Cesium.Color.YELLOW,
                        pixelSize: 10
                    }
                });
                this.viewer.entities.add(originPoint1);

                var x = new Cesium.Cartesian3();
                var y = new Cesium.Cartesian3();
                var z = new Cesium.Cartesian3();
                Cesium.Matrix3.getColumn(a, 0, x);
                Cesium.Matrix3.getColumn(a, 1, y);
                Cesium.Matrix3.getColumn(a, 2, z);
                var temp1 = new Cesium.Cartesian3();
                var temp2 = new Cesium.Cartesian3();
                var temp3 = new Cesium.Cartesian3();
                Cesium.Cartesian3.subtract(center, x, temp1)
                Cesium.Cartesian3.subtract(temp1, y, temp2)
                Cesium.Cartesian3.subtract(temp2, z, temp3)
          
                let originPoint2 = new Cesium.Entity({
                    id: 'ceshi2',
                    position: temp3,
                    point: {
                        color: Cesium.Color.RED,
                        pixelSize: 10
                    }
                });
                this.viewer.entities.add(originPoint2);

                var temp4 = new Cesium.Cartesian3();
                var temp5 = new Cesium.Cartesian3();
                var temp6 = new Cesium.Cartesian3();
                Cesium.Cartesian3.add(center, x, temp4)
                Cesium.Cartesian3.add(temp4, y, temp5)
                Cesium.Cartesian3.add(temp5, z, temp6)
   

                let originPoint3 = new Cesium.Entity({
                    id: 'ceshi3',
                    position: temp6,
                    point: {
                        color: Cesium.Color.BLUE,
                        pixelSize: 10
                    }
                });
                this.viewer.entities.add(originPoint3);

                //计算两个Cartesian3的分量差
                let boxCartesian3 = Cesium.Cartesian3.subtract(temp6, temp3, new Cesium.Cartesian3());
                boxCartesian3.x = Math.abs(boxCartesian3.x);
                boxCartesian3.y = Math.abs(boxCartesian3.y);
                boxCartesian3.z = Math.abs(boxCartesian3.z);
               
                this.viewer.entities.add({
                    position: center, //立方体的位置
                    box: {
                        dimensions: boxCartesian3, //长宽高
                        fill: true, //是否显示填充
                        material: Cesium.Color.fromCssColorString(`rgba(255,0,0,0.5)`), //立方体的颜色,
                        outline: false, //是否显示轮廓
                        outlineColor: Cesium.Color.fromCssColorString(`rgba(255,255,148,1)`), //立方体轮廓线的颜色,
                        outlineWidth: 1, //轮廓的跨度
                    },
                });
            })
    },

    methods: {}
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
