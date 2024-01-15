<template>
    <div class="model-wrap">
        <div class="select-wrap">
            <a-select v-dark default-value="createWorldTerrain" style="width: 220px" @change="handleChange">
                <a-select-option v-for="(item, index) in selectData" :value="index" :key="index">
                    {{ item.name }}
                </a-select-option>
            </a-select>
        </div>
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
            selectData: [
                {
                    name: "createWorldTerrain",
                },
                {
                    name: "ArcGISTiledElevationTerrainProvider",
                },
                {
                    name: "CesiumTerrainProvider",
                },
                {
                    name: "GoogleEarthEnterpriseMetadata",
                },
                {
                    name: "VRTheWorldTerrainProvider",
                },
                {
                    name: "EllipsoidTerrainProvider",
                },

            ]
        };
    },

    computed: {},

    mounted() {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
        this.viewer = new Cesium.Viewer("cesiumContainer")
        this.handleChange(0);
    },

    methods: {
        handleChange(index) {
            this.viewer.terrainProvider = null;//清空(地形赋值)
            const item = this.selectData[index].name;
            let select = {
                createWorldTerrain: this.addcreateWorldTerrain,
                ArcGISTiledElevationTerrainProvider: this.addArcGISTiledElevationTerrainProvider,
                CesiumTerrainProvider: this.addCesiumTerrainProvider,
                GoogleEarthEnterpriseMetadata: this.addGoogleEarthEnterpriseMetadata,
                VRTheWorldTerrainProvider: this.addVRTheWorldTerrainProvider,
                EllipsoidTerrainProvider: this.addEllipsoidTerrainProvider,
            };
            select[item] && select[item]();
            //定位
            let target = new Cesium.Cartesian3(
                300770.50872389384,
                5634912.131394585,
                2978152.2865545116
            );
            let offset = new Cesium.Cartesian3(
                6344.974098678562,
                -793.3419798081741,
                2499.9508860763162
            );
            this.viewer.camera.lookAt(target, offset);
            this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

        },
        addcreateWorldTerrain() {
            let terrainProvider = Cesium.createWorldTerrain({
                requestWaterMask: true, // 请求水体效果所需要的海岸线数据
                requestVertexNormals: true, // 请求地形照明数据
            });

            this.viewer.terrainProvider = terrainProvider;

            //this.viewer.scene.setTerrainExaggeration(2.0); // 地形夸张
            this.viewer.scene.globe.depthTestAgainstTerrain = true; // 启用深度测试，让地形后面的东西消失。
            this.viewer.scene.globe.enableLighting = true; // 对大气和雾启用动态照明效果
        },
        addArcGISTiledElevationTerrainProvider() {
            let terrainProvider = new Cesium.ArcGISTiledElevationTerrainProvider({
                url:
                    "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
                token:
                    "KED1aF_I4UzXOHy3BnhwyBHU4l5oY6rO6walkmHoYqGp4XyIWUd5YZUC1ZrLAzvV40pR6gBXQayh0eFA8m6vPg..",
            });
            this.viewer.terrainProvider = terrainProvider;
        },
        addCesiumTerrainProvider() {
            let terrainProvider = new Cesium.CesiumTerrainProvider({
                url: Cesium.IonResource.fromAssetId(3956),
                requestWaterMask: true,
                requestVertexNormals: true,
            });
            this.viewer.terrainProvider = terrainProvider;
        },
        addGoogleEarthEnterpriseMetadata() {
            let geeMetadata = new Cesium.GoogleEarthEnterpriseMetadata(
                "http://www.earthenterprise.org/3d"
            );
            let terrainProvider = new Cesium.GoogleEarthEnterpriseTerrainProvider({
                metadata: geeMetadata,
            });
            this.viewer.terrainProvider = terrainProvider;
        },
        addVRTheWorldTerrainProvide() {
            let terrainProvider = new Cesium.VRTheWorldTerrainProvider({
                url: "http://www.vr-theworld.com/vr-theworld/tiles1.0.0/73/",
                credit: "Terrain data courtesy VT MÄK",
            });
            this.viewer.terrainProvider = terrainProvider;
        },
        addEllipsoidTerrainProvider() {
            let ellipsoidProvider = new Cesium.EllipsoidTerrainProvider();
            this.viewer.terrainProvider = ellipsoidProvider;
        }

    }
};
</script>
<style lang="less" scoped>
.select-wrap {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1;
}
</style>
