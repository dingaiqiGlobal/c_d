import BaseLayer from "./BaseLayer";
import * as Cesium from "cesium/Cesium";

class Grid3DLayer extends BaseLayer {
  constructor(options) {
    super(options);
    this.url = options.url || "";
    this.name = options.name || "Grid3DLayer";
    this.dataSource = null;
    this.createLayer();
  }
  createLayer() {
    this.dataSource = new Cesium.GeoJsonDataSource(this.name);
    const grid = this.dataSource.load(this.url);
    grid.then((dataSource) => {
      const entities = dataSource.entities.values;
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        const { geohash, floor, height, color } = entity.properties;
        entity.name = geohash.getValue();
        entity.polygon.height = floor.getValue();
        entity.polygon.extrudedHeight = height.getValue();
        entity.polygon.fill = true;
        entity.polygon.material = new Cesium.ColorMaterialProperty(
          new Cesium.Color(0.165,0.165,0.165,0.2)
        );
        entity.polygon.outline = true;
        entity.polygon.outlineColor = Cesium.Color.fromCssColorString(
          color.getValue()
        );
        entity.polygon.outlineWidth = 1; //不起作用
        //解决单独设置线条样式
        // let positions = entity.polygon.hierarchy._value.positions;
        // entity.polyline = {
        //   positions: positions,
        //   width: 10,
        //   material: Cesium.Color.BLACK.withAlpha(1),
        // };
      }
    });
  }
  addTo(viewer) {
    super.addTo(viewer);
    this.viewer.dataSources.add(this.dataSource);
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        117.0854187,
        39.69669342,
        500.0
      ),
    });
  }
  remove() {
    if (this.viewer) {
      this.viewer.dataSources.remove(this.dataSource);
      super.remove(this.viewer);
    }
  }
  setVisible(flag) {
    super.setVisible(flag);
    this.dataSource.show = flag;
  }
  addEventListener(eventType, handler) {
    this.dataSource.evt = new Cesium.Event();
    this.dataSource.evt.addEventListener(handler, this);
  }
}
export default Grid3DLayer;
