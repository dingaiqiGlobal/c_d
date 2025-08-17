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
        };
    },

    computed: {},

    mounted() {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
        this.viewer = new Cesium.Viewer("cesiumContainer", {
            infoBox: false
        })
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(116.828570, 40.353510, 2000),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-45),
                roll: 0
            }
        });

        this.poiIconLabelAdd(116.830370, 40.371430, '欢迎', Cesium.Color.IVORY, 'images/icon/icon_MiYun.png')
    },


    methods: {
        /**
         * 用于添加poi的icon和label的函数（分别是顶部的icon和label、底部的point和连接的polyline线）
         * @param {*} lon ：经度
         * @param {*} lat ：纬度
         * @param {*} name ：标签内容
         * @param {*} color ：底部圆和横线的颜色
         * @param {*} url ：icon地址
         */
        poiIconLabelAdd(lon, lat, name, color, url) {
            this.viewer.entities.add({
                name: name,
                position: Cesium.Cartesian3.fromDegrees(lon, lat, 300),
                // 图标
                billboard: {
                    image: url,
                    width: 100,
                    height: 100,
                },
                label: {
                    //文字标签
                    text: name,
                    font: '20px sans-serif',
                    style: Cesium.LabelStyle.FILL,
                    // 对齐方式(水平和竖直)
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                    pixelOffset: new Cesium.Cartesian2(20, -2),
                    showBackground: true,
                    backgroundColor: Cesium.Color.fromCssColorString('#FF0000').withAlpha(0.0),
                },
            });

            // 先画线后画点，防止线压盖点
            let linePositions = [];
            linePositions.push(new Cesium.Cartesian3.fromDegrees(lon, lat, 5));
            linePositions.push(new Cesium.Cartesian3.fromDegrees(lon, lat, 300));
            this.viewer.entities.add({
                polyline: {
                    positions: linePositions,
                    width: 0.5,
                    material: color,
                }
            })

            // 画点
            this.viewer.entities.add({
                // 给初始点位设置一定的离地高度，否者会被压盖
                position: Cesium.Cartesian3.fromDegrees(lon, lat, 5),
                point: {
                    color: color,
                    pixelSize: 5,
                }
            })
        }

    }
}
</script>
<style>
.control {
    position: absolute;
    z-index: 999;
    left: 10px;
    top: 10px;
}
</style>
