import BaseLayer from "./BaseLayer";
import * as Cesium from "cesium/Cesium";
class ModelLayer extends BaseLayer {
    constructor(options) {
        super(options);
        this.url = this.options.url ? this.options.url : "";
        this.scale = this.options.scale ? this.options.scale : 1;
        this.minimumPixelSize = this.options.minimumPixelSize ? this.options.minimumPixelSize : 128;
        this.maximumScale = this.options.maximumScale ? this.options.maximumScale : 20000;

        this.position = this.options.position || {
            lng: 116.142312,
            lat: 40.119501,
            height: 0,
        };

        if (this.url === null || this.url === "") {
            console.log("gltf模型地址不可为空!");
            return;
        }
        this.createLayer(this.options);
    }
    createLayer(options) {
        let position = Cesium.Cartesian3.fromDegrees(this.position.lng, this.position.lat, this.position.height)
        let heading = Cesium.Math.toRadians(0);
        let roll = 0;
        let pitch = 0;
        let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            hpr
        );

        this.modelEntity = new Cesium.Entity({
            position: position,
            orientation: orientation,
            model: {
                uri: this.url,
                show: this.show,
                scale: this.scale,
                minimumPixelSize: this.minimumPixelSize,
                maximumScale: this.maximumScale,
            },
        })
    }

    addTo(viewer, zoomTo = false) {
        super.addTo(viewer);
        this.viewer.entities.add(this.modelEntity)
        if (zoomTo) {
            this.viewer.zoomTo(this.modelEntity);
        }
    }

    remove() {
        if (this.viewer) {
            this.viewer.entities.remove(this.modelEntity)
            super.remove(this.viewer);
        }
    }
    setVisible(flag) {
        super.setVisible(flag);
        this.dataSource.show = flag;
    }
}
export default ModelLayer;