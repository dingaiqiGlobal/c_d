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
            shouldAnimate: true,//动画
        })
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(116.83074, 40.3591, 500),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-10),
                roll: 0
            }
        });
        //this.viewer.scene.globe.depthTestAgainstTerrain = true;//开启深度检


        let headingPitchRoll = new Cesium.HeadingPitchRoll();
        let position = new Cesium.Cartesian3.fromDegrees(116.830340, 40.370880, 10);
        //生成一个函数，该函数计算从给定原点为中心的参考系到给定椭球体的固定参考系的4x4变换矩阵
        let fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator("north", "west");

        let airplaneModel = this.viewer.scene.primitives.add(
            Cesium.Model.fromGltf({
                url: 'data/model/Cesium_Air.glb',
                scale: 10.0,
                //重要
                modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
                    position,
                    headingPitchRoll,
                    Cesium.Ellipsoid.WGS84,
                    fixedFrameTransform
                ),
                minimumPixelSize: 256,
            })
        )

        //飞行路径
        let speed = 50;//速度
        let speedVector = new Cesium.Cartesian3();//速度向量

        //渲染更新前阶段添加监听
        this.viewer.scene.preUpdate.addEventListener(() => {
            //将所提供的笛卡尔分量与所提供的标量相乘
            //Cesium.Cartesian3.multiplyByScalar(cartesian, scalar, result) → Cartesian3
            speedVector = Cesium.Cartesian3.multiplyByScalar(
                Cesium.Cartesian3.UNIT_X,//要缩放的笛卡尔坐标分量（X轴）
                speed / 10,//标量
                speedVector//结果Cartesian3
            );

            //变换后的位置
            //计算矩阵和笛卡尔矩阵的乘积（矩阵与向量的乘积）
            //Cesium.Matrix4.multiplyByPoint(matrix, cartesian, result) → Cartesian3
            position = Cesium.Matrix4.multiplyByPoint(
                airplaneModel.modelMatrix,
                speedVector,
                position
            );

            // 更新模型姿态与位置
            //从一个参考系计算一个4x4变换矩阵，
            //其轴从给定原点为中心的头 - 俯仰 - 滚转角计算到给定椭球体的固定参考系。
            //Cesium.Transforms.headingPitchRollToFixedFrame(origin, headingPitchRoll, ellipsoid, fixedFrameTransform, result) → Matrix4
            Cesium.Transforms.headingPitchRollToFixedFrame(
                position,
                headingPitchRoll,
                Cesium.Ellipsoid.WGS84,
                fixedFrameTransform,
                airplaneModel.modelMatrix//赋值给飞机
            )
            // 更新相机位置（第一视角）
            this.viewer.camera.lookAt(position, new Cesium.HeadingPitchRange(headingPitchRoll.heading, headingPitchRoll.pitch, 1000))
        })

    },

    methods: {


    }
};
</script>
<style></style>
