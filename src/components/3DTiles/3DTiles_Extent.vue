<template>
    <div>
        <div id="cesiumContainer"></div>
    </div>
</template>

<script>
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
        this.viewer = new Cesium.Viewer("cesiumContainer")

        this.tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: 'data/3dtiles/BuildingBlue/tileset.json',
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

        //回调范围
        //https://hpugis.blog.csdn.net/article/details/99569545
        this.viewer.clock.onTick.addEventListener(() => {
            let west = 999;
            let south = 999;
            let east = -999;
            let north = -999;
            // 获取要渲染切片封装对象，一个切片封装对象有多个切片
            let tilesToRender = this.viewer.scene.globe._surface.tileProvider._tilesToRenderByTextureCount;
            if (Cesium.defined(tilesToRender)) {
                let numArrays = tilesToRender.length;
                for (let j = 0; j < numArrays; ++j) {
                    let quadtrees = tilesToRender[j];
                    if (Cesium.defined(quadtrees)) {
                        let numTrees = quadtrees.length;
                        for (let i = 0; i < numTrees; ++i) {
                            let rectangle = quadtrees[i].rectangle;
                            west = Math.min(west, rectangle.west);
                            south = Math.min(south, rectangle.south);
                            east = Math.max(east, rectangle.east);
                            north = Math.max(north, rectangle.north);
                        }
                    }
                }
            }
        })
    },

    methods: {


    }
};
</script>
<style></style>
