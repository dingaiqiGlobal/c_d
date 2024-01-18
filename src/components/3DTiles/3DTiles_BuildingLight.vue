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
            tileset: null,
        };
    },

    computed: {},

    mounted() {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
        this.viewer = new Cesium.Viewer("cesiumContainer")
        //this.viewer.scene.globe.depthTestAgainstTerrain = true;//开启深度检查
        this.tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: 'data/3dtiles/BuildingWhite/tileset.json',
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
        // 加载3DTitle，并设置渐变光环
        this.tileset.tileVisible.addEventListener(function (tile) {
            let content = tile.content;
            let featuresLength = content.featuresLength;
            let feature;
            for (var i = 0; i < featuresLength; i += 2) {
                feature = content.getFeature(i);
                let _model = feature.content._model;
                _model._shouldRegenerateShaders = true;
                // getOwnPropertyNames:返回指定对象的所有自身属性的属性名组成的数组
                // forEach：对数组里的所有元素都执行一遍
                // Object.keys：返回
                Object.getOwnPropertyNames(_model._sourcePrograms).forEach(function (j) {
                    const _modelSourceP = _model._sourcePrograms[0];
                    _model._rendererResources.sourceShaders[_modelSourceP.fragmentShader] = `
                        varying vec3 v_positionEC;
                        void main(void){
                        vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
                        float glowRange = 100.0; // 光环的移动范围(高度)
                        gl_FragColor = vec4(0.0, 0.3, 0.8, 0.8); // 颜色
                        
                        // 小于20米的低楼都不再变暗
                        if(position.y > 20.0) {
                            gl_FragColor *= vec4(vec3(position.y / 20.0), 0.8); // 渐变
                        }
                        
                        // 动态光环
                        float time = fract(czm_frameNumber / 360.0);
                        time = abs(time - 0.5) * 6.0;
                        float diff = step(0.005, abs( clamp(position.y / glowRange, 0.0, 1.0) - time));
                        gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
                        }
                    `
                })
                _model._shouldRegenerateShaders = true;
            }
        })


    },

    methods: {


    }
};
</script>
<style></style>
