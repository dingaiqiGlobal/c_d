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
        this.viewer = new Cesium.Viewer("cesiumContainer");
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(116.830490, 40.370510, 500),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-90),
                roll: 0
            }
        });
        this.viewer.entities.add({
            name: 'Red tube with rounded corners',
            polylineVolume: {
                positions: Cesium.Cartesian3.fromDegreesArray([116.830020, 40.371430, 116.830360, 40.369450, 116.831830, 40.369620]),
                shape: this.computeCircle(6),
                //shape:this.computeStar(7, 7, 5),
                //颜色回调
                material: new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function () {
                    return Cesium.Color.fromRandom({
                        minimumRed: 0.75,
                        minimumGreen: 0.75,
                        minimumBlue: 0.75,
                        alpha: 1.0
                    });
                }, false))
            }
        });

    },

    methods: {
        //实心管
        computeCircleFill(radius) {
            // radius = Number(radius) / 1000;
            // radius = radius / 2;
            let positions = [];
            for (let i = 0; i < 360; i++) {
                let radians = Cesium.Math.toRadians(i);
                positions.push(
                    new Cesium.Cartesian2(
                        radius * Math.cos(radians),
                        radius * Math.sin(radians)
                    )
                )
            }
            return positions;
        },
        //空心管
        computeCircle(radius) {
            // radius = Number(radius) / 1000;
            // radius = radius / 2;
            let startAngle = 0;
            let endAngle = 360;
            let hd = radius / 3;
            let positions = [];
            for (let i = startAngle; i <= endAngle; i++) {
                let radians = Cesium.Math.toRadians(i);
                positions.push(
                    new Cesium.Cartesian2(
                        radius * Math.cos(radians),
                        radius * Math.sin(radians))
                )
            }
            for (let i = endAngle; i >= startAngle; i--) {
                let radians = Cesium.Math.toRadians(i);
                positions.push(
                    new Cesium.Cartesian2(
                        (radius - hd) * Math.cos(radians),
                        (radius - hd) * Math.sin(radians)
                    )
                );
            }
            return positions;
        },
        //多边形
        computeStar(arms, rOuter, rInner) {
            let angle = Math.PI / arms;
            let length = 2 * arms;
            let positions = new Array(length);
            for (let i = 0; i < length; i++) {
                let r = i % 2 === 0 ? rOuter : rInner;
                positions[i] = new Cesium.Cartesian2(
                    Math.cos(i * angle) * r,
                    Math.sin(i * angle) * r
                );
            }
            return positions;
        }


    }
};
</script>
<style></style>
