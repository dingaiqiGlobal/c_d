/**
 * 平面测量
 */
import MeasureDistance from './MeasureDistance';
import MeasureArea from './MeasureArea';
let Measure = {
    init(viewer) {
        this.viewer = viewer;
        this.initMeasureTool();
    },
    initMeasureTool() {
        this.md = new MeasureDistance(this.viewer);
        this.ma = new MeasureArea(this.viewer);
    },
    //激活
    measureActivate(type) {
        if (type == "spatialDistance") {
            this.md.activate();
        } else if (type == "spatialArea") {
            this.ma.activate();
        }
    },
    //清除并禁用
    measureClear() {
        this.md.clear();
        this.md.deactivate();
        this.ma.clear();
        this.ma.deactivate();
    }
}
export default Measure;