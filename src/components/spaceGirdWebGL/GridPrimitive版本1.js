/*
 * @Author: dys
 * @Date: 2025-11-19 09:27:46
 * @LastEditors: dys
 * @LastEditTime: 2025-11-19 15:56:22
 * @Descripttion: 基于Cesium Primitive的网格基元（实例化渲染版本）
 */
import * as Cesium from "cesium/Cesium";

class GridPrimitive {
  constructor(modelMatrix, instances) {
    this.drawCommand = null;
    this.modelMatrix = modelMatrix || Cesium.Matrix4.IDENTITY.clone();
    this.show = true;
    this.instances = instances || [];
    this.pickIds = []; // 存储所有pickId用于后续销毁
  }

  /**
   * 创建绘制命令
   * @param {Object} context - WebGL上下文
   */
  createCommand(context) {
    if (this.instances.length === 0) return;

    // 创建box几何数据（包含法线）
    let box = new Cesium.BoxGeometry({
      vertexFormat: Cesium.VertexFormat.POSITION_AND_NORMAL,
      maximum: new Cesium.Cartesian3(10, 10, 10),
      minimum: new Cesium.Cartesian3(-10, -10, -10),
    });
    let geometry = Cesium.BoxGeometry.createGeometry(box);

    // GeometryPipeline几何流水线功能
    // 创建顶点属性索引，key为属性名称，value为顶点属性缓冲区在同一个着色器程序中的索引
    var attributeLocations = Cesium.GeometryPipeline.createAttributeLocations(geometry);

    var maxAttribLocation = 0;
    for (var location in attributeLocations) {
      if (attributeLocations.hasOwnProperty(location)) {
        maxAttribLocation = Math.max(maxAttribLocation, attributeLocations[location]);
      }
    }

    var instances = this.instances;
    var instanceCount = instances.length;
    var matrixVertexSizeInFloats = 16;

    var modelMatrixBuffer = this.createInstancedMatrixBuffer(context);
    var pickColorBuffer = this.createInstancedPickColorBuffer(context);
    var colorBuffer = this.createInstancedColorBuffer(context);

    var componentSizeInBytes = Cesium.ComponentDatatype.getSizeInBytes(Cesium.ComponentDatatype.FLOAT);
    
    var instancedAttributes = {
      // 接下来4个属性分别传递modelMatrix的4行
      modelMatrixRow0: {
        index: maxAttribLocation + 1,
        vertexBuffer: modelMatrixBuffer,
        componentsPerAttribute: 4,
        componentDatatype: Cesium.ComponentDatatype.FLOAT,
        normalize: false,
        offsetInBytes: 0,
        strideInBytes: componentSizeInBytes * matrixVertexSizeInFloats,
        instanceDivisor: 1,
      },
      modelMatrixRow1: {
        index: maxAttribLocation + 2,
        vertexBuffer: modelMatrixBuffer,
        componentsPerAttribute: 4,
        componentDatatype: Cesium.ComponentDatatype.FLOAT,
        normalize: false,
        offsetInBytes: componentSizeInBytes * 4,
        strideInBytes: componentSizeInBytes * matrixVertexSizeInFloats,
        instanceDivisor: 1,
      },
      modelMatrixRow2: {
        index: maxAttribLocation + 3,
        vertexBuffer: modelMatrixBuffer,
        componentsPerAttribute: 4,
        componentDatatype: Cesium.ComponentDatatype.FLOAT,
        normalize: false,
        offsetInBytes: componentSizeInBytes * 8,
        strideInBytes: componentSizeInBytes * matrixVertexSizeInFloats,
        instanceDivisor: 1,
      },
      modelMatrixRow3: {
        index: maxAttribLocation + 4,
        vertexBuffer: modelMatrixBuffer,
        componentsPerAttribute: 4,
        componentDatatype: Cesium.ComponentDatatype.FLOAT,
        normalize: false,
        offsetInBytes: componentSizeInBytes * 12,
        strideInBytes: componentSizeInBytes * matrixVertexSizeInFloats,
        instanceDivisor: 1,
      },
      // 传递各个实例的颜色
      color: {
        index: maxAttribLocation + 5,
        vertexBuffer: colorBuffer,
        componentsPerAttribute: 4,
        componentDatatype: Cesium.ComponentDatatype.FLOAT,
        normalize: false,
        offsetInBytes: 0,
        strideInBytes: componentSizeInBytes * 4,
        instanceDivisor: 1,
      },
      // 传递各个实例的pickId，实现点选单个实例
      pickColor: {
        index: maxAttribLocation + 6,
        vertexBuffer: pickColorBuffer,
        componentsPerAttribute: 4,
        componentDatatype: Cesium.ComponentDatatype.FLOAT,
        normalize: false,
        offsetInBytes: 0,
        strideInBytes: componentSizeInBytes * 4,
        instanceDivisor: 1,
      },
    };

    var vertexArrayAttributes = [];
    for (var location in instancedAttributes) {
      if (instancedAttributes.hasOwnProperty(location)) {
        attributeLocations[location] = instancedAttributes[location].index;
        vertexArrayAttributes.push(instancedAttributes[location]);
      }
    }

    var va = Cesium.VertexArray.fromGeometry({
      context: context,
      geometry: geometry,
      attributeLocations: attributeLocations,
      vertexArrayAttributes: vertexArrayAttributes,
    });

    // 顶点着色器(shader)
    let vs = `
        attribute vec3 position;
        attribute vec3 normal;

        // 用4个4维向量存储实例化模型变换矩阵
        attribute vec4 modelMatrixRow0;
        attribute vec4 modelMatrixRow1;
        attribute vec4 modelMatrixRow2;
        attribute vec4 modelMatrixRow3;
        // 声明pickColor属性，接收实例pickId颜色
        attribute vec4 pickColor;
        // 声明color属性，接收实例的颜色
        attribute vec4 color;

        varying vec3 v_normal;
        varying vec4 v_color;
        varying vec4 v_pickColor;

        void main(){
            v_color = color;
            v_pickColor = pickColor;
            
            // 还原modelMatrix
            mat4 modelMatrix = mat4(
                modelMatrixRow0.x, modelMatrixRow1.x, modelMatrixRow2.x, modelMatrixRow3.x, 
                modelMatrixRow0.y, modelMatrixRow1.y, modelMatrixRow2.y, modelMatrixRow3.y, 
                modelMatrixRow0.z, modelMatrixRow1.z, modelMatrixRow2.z, modelMatrixRow3.z, 
                modelMatrixRow0.w, modelMatrixRow1.w, modelMatrixRow2.w, modelMatrixRow3.w
            );

            mat4 modelView = czm_view * modelMatrix;
            mat3 normalMatrix = mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz);
            v_normal = normalMatrix * normal;
        
            gl_Position = czm_projection * modelView * vec4(position, 1.0);
        }
    `;

    // 片元着色器(shader) - 修复版本
    let fs = `
        uniform bool czm_selected;  // 手动声明czm_selected
        varying vec4 v_pickColor;
        varying vec3 v_normal;
        varying vec4 v_color;

        void main(){
            // 拾取模式下使用pickColor，正常模式下使用实例颜色
            if (czm_selected) {
                gl_FragColor = v_pickColor;
            } else {
                // 简单光照计算
                vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
                float diffuse = max(dot(normalize(v_normal), lightDirection), 0.2);
                gl_FragColor = vec4(v_color.rgb * diffuse, v_color.a);
            }
        }
    `;

    // 着色器程序
    let shaderProgram = Cesium.ShaderProgram.fromCache({
      context: context,
      vertexShaderSource: vs,
      fragmentShaderSource: fs,
      attributeLocations: attributeLocations,
    });

    // 用于传递自定义uniform变量的值
    let uniformMap = {
      // 手动添加czm_selected到uniformMap
      czm_selected: function() {
        return false; // 默认值，Cesium会在拾取时自动设置
      }
    };

    // 渲染状态对象
    let renderState = Cesium.RenderState.fromCache({
      cull: {
        enabled: true,
        face: Cesium.CullFace.BACK,
      },
      depthTest: {
        enabled: true,
      },
    });

    // 初始化绘制命令
    this.drawCommand = new Cesium.DrawCommand({
      modelMatrix: this.modelMatrix,
      vertexArray: va,
      shaderProgram: shaderProgram,
      uniformMap: uniformMap,
      renderState: renderState,
      pass: Cesium.Pass.OPAQUE,
      instanceCount: instanceCount, // 指定实例数量
    });
  }

  /**
   * 处理 modelMatrix
   */
  createInstancedMatrixBuffer(context) {
    let instances = this.instances;
    let instanceCount = instances.length;
    let vertexSizeInFloats = 16;
    let bufferData = new Float32Array(instanceCount * vertexSizeInFloats);

    for (let i = 0; i < instanceCount; i++) {
      const instance = instances[i];
      const instanceMatrix = instance.matrix;
      const offset = i * vertexSizeInFloats;

      // 第一行
      bufferData[offset] = instanceMatrix[0];
      bufferData[offset + 1] = instanceMatrix[4];
      bufferData[offset + 2] = instanceMatrix[8];
      bufferData[offset + 3] = instanceMatrix[12];
      // 第二行
      bufferData[offset + 4] = instanceMatrix[1];
      bufferData[offset + 5] = instanceMatrix[5];
      bufferData[offset + 6] = instanceMatrix[9];
      bufferData[offset + 7] = instanceMatrix[13];
      // 第三行
      bufferData[offset + 8] = instanceMatrix[2];
      bufferData[offset + 9] = instanceMatrix[6];
      bufferData[offset + 10] = instanceMatrix[10];
      bufferData[offset + 11] = instanceMatrix[14];
      // 第四行
      bufferData[offset + 12] = instanceMatrix[3];
      bufferData[offset + 13] = instanceMatrix[7];
      bufferData[offset + 14] = instanceMatrix[11];
      bufferData[offset + 15] = instanceMatrix[15];
    }

    let vertexBuffer = Cesium.Buffer.createVertexBuffer({
      context: context,
      typedArray: bufferData,
      usage: Cesium.BufferUsage.STATIC_DRAW,
    });

    return vertexBuffer;
  }

  /**
   * 处理pickColor
   */
  createInstancedPickColorBuffer(context) {
    let instances = this.instances;
    let instanceCount = instances.length;
    let vertexSizeInFloats = 4;
    let bufferData = new Float32Array(instanceCount * vertexSizeInFloats);

    // 清空之前的pickIds
    this.pickIds.forEach(pickId => pickId.destroy());
    this.pickIds = [];

    for (let i = 0; i < instanceCount; i++) {
      const instance = instances[i];
      const instancePickId = context.createPickId({
        instance: instance,
        primitive: this,
        description: `实例id：${instance.id}`,
      });
      
      const pickColor = instancePickId.color;
      const offset = i * vertexSizeInFloats;
      
      instance.pickId = instancePickId;
      this.pickIds.push(instancePickId);

      bufferData[offset] = pickColor.red;
      bufferData[offset + 1] = pickColor.green;
      bufferData[offset + 2] = pickColor.blue;
      bufferData[offset + 3] = pickColor.alpha;
    }

    let vertexBuffer = Cesium.Buffer.createVertexBuffer({
      context: context,
      typedArray: bufferData,
      usage: Cesium.BufferUsage.STATIC_DRAW,
    });

    return vertexBuffer;
  }

  /**
   * 处理color
   */
  createInstancedColorBuffer(context) {
    let instances = this.instances;
    let instanceCount = instances.length;
    let vertexSizeInFloats = 4;
    let bufferData = new Float32Array(instanceCount * vertexSizeInFloats);

    for (let i = 0; i < instanceCount; i++) {
      const instance = instances[i];
      const instanceColor = instance.color || Cesium.Color.WHITE;
      const offset = i * vertexSizeInFloats;

      bufferData[offset] = instanceColor.red;
      bufferData[offset + 1] = instanceColor.green;
      bufferData[offset + 2] = instanceColor.blue;
      bufferData[offset + 3] = instanceColor.alpha;
    }

    let vertexBuffer = Cesium.Buffer.createVertexBuffer({
      context: context,
      typedArray: bufferData,
      usage: Cesium.BufferUsage.STATIC_DRAW,
    });

    return vertexBuffer;
  }

  /**
   * 实现Primitive接口，供Cesium内部在每一帧调用
   * @param {Object} frameState - 帧状态对象
   */
  update(frameState) {
    if (!this.show || this.instances.length === 0) return;
    
    if (!this.drawCommand) {
      this.createCommand(frameState.context);
    }
    
    if (this.drawCommand) {
      frameState.commandList.push(this.drawCommand);
    }
  }

  /**
   * 判断是否可见（可选实现）
   */
  isDestroyed() {
    return false;
  }

  /**
   * 销毁资源
   */
  destroy() {
    if (this.drawCommand) {
      this.drawCommand.shaderProgram && this.drawCommand.shaderProgram.destroy();
      this.drawCommand.vertexArray && this.drawCommand.vertexArray.destroy();
      this.drawCommand = null;
    }

    // 销毁所有pickId
    this.pickIds.forEach(pickId => {
      if (pickId && !pickId.isDestroyed()) {
        pickId.destroy();
      }
    });
    this.pickIds = [];
  }
}

export default GridPrimitive;