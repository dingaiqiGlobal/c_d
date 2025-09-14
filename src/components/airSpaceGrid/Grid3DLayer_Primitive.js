import BaseLayer from "./BaseLayer";
import * as Cesium from "cesium/Cesium";
import GeoJSON from "ol/format/GeoJSON";

class Grid3DLayer extends BaseLayer {
  constructor(options) {
    super(options);
    // this.lonlat = options.degrees || [0, 0];
    // this.height = options.height || 30;
    // this.extrudedHeight = options.extrudedHeight || 30;
    // this.name = options.name || this.id;
    // this.color = options.color || "#ffffff";
    this.primitive = null;
    this.geometryInstances = null; //数组
    this.createGeometryInstance(options);
  }
  createGeometryInstance(options) {
    const geojson = new GeoJSON();
    let features = geojson.readFeatures(options);
    this.geometryInstances = features.map((item) => {
      const { floor, height, geohash, color } = item.getProperties();
      const lonlat = item
        .getGeometry()
        .getCoordinates()
        .flat(2)
        .filter((_, index) => index % 3 !== 2);
      let pars = {
        lonlat,
        extrudedHeight: height,
        color,
        height: height + floor,
        name: geohash,
      };
      return this.createInstance(pars);
    });
  }
  createInstance(options) {
    return new Cesium.GeometryInstance({
      id: options.name,
      geometry: new Cesium.PolygonOutlineGeometry({
        polygonHierarchy: {
          positions: Cesium.Cartesian3.fromDegreesArray(options.lonlat),
        },
        extrudedHeight: options.extrudedHeight,
        height: options.height,
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          new Cesium.Color.fromCssColorString(options.color)
        ),
      },
    });
  }
  addTo(viewer) {
    super.addTo(viewer);
    this.primitive = new Cesium.Primitive({
      geometryInstances: this.geometryInstances,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true,
        translucent: false,
        renderState: {
          lineWidth: 1,
        },
      }),
      show: true,
    });
    this.viewer.scene.primitives.add(this.primitive);
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        117.0854187,
        39.69669342,
        500.0
      ),
    });
  }
  setVisible(flag) {
    super.setVisible(flag);
    this.primitive.show = flag;
  }
  remove() {
    if (this.viewer) {
      this.viewer.scene.primitives.remove(this.primitive);
      this.primitive.destroy();
      super.remove(this.viewer);
    }
  }
  addEventListener(eventType, handler) {
    this.primitive.evt = new Cesium.Event();//自定义事件对象
    this.primitive.evt.addEventListener(handler, this);//在需要的地方监听事件
  }
}
export default Grid3DLayer;
