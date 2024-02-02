const customShader = new Cesium.CustomShader({
    //用户想要添加到着色器的任何自定义uniform
    //Uniform是一种在着色器程序中定义的全局变量，它们可以在着色器程序的任何地方使用，但它们的值在每个渲染周期中都是不变的
    //这些可以在运行时通过customShader.setUniform()进行更改
    uniforms: {
        u_time: {
            value: 0, // 初始值
            type: Cesium.UniformType.FLOAT
        },
        // 纹理可以从 URL、资源或类型数组加载（有关更多详细信息，请参阅Uniforms部分）
        u_externalTexture: {
            value: new Cesium.TextureUniform({
                url: "http://example.com/image.png"
            }),
            type: Cesium.UniformType.SAMPLER_2D
        }
    },
    //将出现在自定义顶点和片段着色器文本中的自定义变化
    varyings: {
        v_customTexCoords: Cesium.VaryingType.VEC2
    },
    //配置自定义着色器在片段着色器的材质/光照管线中的位置，更多内容见下文
    mode: Cesium.CustomShaderMode.MODIFY_MATERIAL,
    //PBR（基于物理的渲染）或 UNLIT，具体取决于所需的结果
    lightingModel: Cesium.LightingModel.PBR,
    //强制着色器渲染为透明，即使基元具有不透明材质
    translucencyMode: Cesium.CustomShaderTranslucencyMode.TRANSLUCENT,
    //自定义顶点着色器，这是模型空间 ->模型空间的函数.VertexInput输入记录如下
    vertexShaderText: `
    //重要说明：函数签名必须使用这些参数名称。这使运行时更容易生成着色器并进行优化
    void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
        //代码在这里……空的内容是无操作的
    }
  `,
    //自定义片元着色器
    //FragmentInput（片元）输入将被记录在下面 
    //无论模式如何，这里需要一个material（材质）并将其modifies（位置）放到位 
    fragmentShaderText: `
     // 重要提示：函数签名必须使用这些参数名称。这使运行时更容易生成着色器并进行优化。
    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        //代码在这里。例如将漫反射颜色设置为半透明的红色：
        material.diffuse = vec3(1.0, 0.0, 0.0);
        material.alpha = 0.5;
    }
  `,
});
