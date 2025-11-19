/*
 * @Author: dys
 * @Date: 2025-11-19 09:27:46
 * @LastEditors: dys
 * @LastEditTime: 2025-11-19 14:07:24
 * @Descripttion: 基于Cesium Primitive的网格基元
 */
import * as Cesium from "cesium/Cesium";

class GridPrimitive {
  constructor(modelMatrix, show) {
    this.drawCommand = null;
    this.modelMatrix = modelMatrix || Cesium.Matrix4.IDENTITY.clone();
    this.show = show || true;
  }

  /**
   * 创建绘制命令
   * @param {Object} context - WebGL上下文
   */
  createCommand(context) {
    // 创建box几何数据
    let box = new Cesium.BoxGeometry({
      vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
      maximum: new Cesium.Cartesian3(25, 25, 25),
      minimum: new Cesium.Cartesian3(-25, -25, -25),
    });
    let geometry = Cesium.BoxGeometry.createGeometry(box);

    // GeometryPipeline几何流水线功能
    // 创建顶点属性索引，key为属性名称，value为顶点属性缓冲区在同一个着色器程序中的索引
    let attributeLocations =
      Cesium.GeometryPipeline.createAttributeLocations(geometry);

    // 创建顶点数组对象
    let vertexArray = Cesium.VertexArray.fromGeometry({
      context: context, // 使用传入的context参数
      geometry: geometry,
      attributeLocations: attributeLocations,
    });

    // 顶点着色器(shader)
    let vs = `
        attribute vec3 position;
        void main(){
            gl_Position = czm_projection * czm_modelView * vec4(position, 1.0);
        }
    `;

    // 片元着色器(shader)
    let fs = `
        uniform vec3 color;
        void main(){
            gl_FragColor = vec4(color, 1.0);
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
      color() {
        return Cesium.Color.BLUE;
      },
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
      vertexArray: vertexArray,
      shaderProgram: shaderProgram,
      uniformMap: uniformMap,
      renderState: renderState,
      pass: Cesium.Pass.OPAQUE, // 不透明的
    });
  }

  /**
   * 实现Primitive接口，供Cesium内部在每一帧调用
   * @param {Object} frameState - 帧状态对象
   */
  update(frameState) {
    if (!this.show) return; //显示隐藏
    if (!this.drawCommand) {
      this.createCommand(frameState.context); // 传递context参数
    }
    frameState.commandList.push(this.drawCommand);
  }

  /**
   * 判断是否可见（可选实现）
   */
  isDestroyed() {
    return false;
  }

  /**
   * 销毁资源（可选实现）
   */
  destroy() {
    if (this.drawCommand) {
      this.drawCommand.shaderProgram &&
        this.drawCommand.shaderProgram.destroy();
      this.drawCommand.vertexArray && this.drawCommand.vertexArray.destroy();
    }
  }
}

export default GridPrimitive;
