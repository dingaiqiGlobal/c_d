import Util from "./Util";

class BaseLayer {
  constructor(options) {
    this.options = options ? options : {};
    this.id = this.options.id ? this.options.id : Util.generateUUID();
    this.name = this.options.name ? this.options.name : this.id;
    this.show = this.options.show ? this.options.show : true;
  }
  addTo(viewer) {
    this.viewer = viewer;
  }
  remove() {
    this.viewer = null;
  }
  setVisible(flag) {
    this.show = flag;
  }
}
export default BaseLayer;
