export default class EntityEdit {
    constructor(viewer) {
        this.viewer = viewer;
        this.tempPositions = []
        this.initEventHandler();
    }
    //鼠标事件
    initEventHandler() {
        this.eventHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

    }
    //激活编辑
    activate() {
        this.isEditing = false;
        this.deactivate();
        //鼠标左键点击事件 鼠标左键点击拾取需要编辑的对象
        this.initLeftClickEventHandler();
        //鼠标拖动事件
        this.initMoseMoveEventHandler();
        this.initRightClickEventHandler();
    }
    initRightClickEventHandler() {
        this.eventHandler.setInputAction(e => {

            if (this.isEditing) {
                let cartesian = this.viewer.scene.camera.pickEllipsoid(
                    e.position,
                    this.viewer.scene.globe.ellipsoid
                );
                if (cartesian) {
                    // console.log(, 30);
                    // this.entityPolyline.entity.position.setValue = this.tempPositions
                    let tempPositions = this.tempPositions


                    // this.entityPolyline.polyline.positions = this.tempPositions
                    this.entityPolyline.polyline.positions = new Cesium.CallbackProperty(e => {
                        return tempPositions;
                    }, false)
                    this.tempPositions = []

                }
                this.isEditing = false
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }
    //鼠标拖动事件
    initMoseMoveEventHandler() {
        this.eventHandler.setInputAction(e => {
            if (this.isEditing) {
                let cartesian = this.viewer.scene.camera.pickEllipsoid(
                    e.endPosition,
                    this.viewer.scene.globe.ellipsoid
                );
                if (cartesian) {
                    this.pickId.position = cartesian;
                    this.tempPositions[this.index] = cartesian
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    }
    //左键点击事件
    initLeftClickEventHandler() {
        this.eventHandler.setInputAction(e => {
            let id = this.viewer.scene.pick(e.position);
            if (id) {
                this.handlePickEditEntity(id);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    handlePickEditEntity(pickId) {

        if (pickId.collection) {
            this.pickId = pickId.id
            //通过点实体的_name属性找到 polyline实体并判断要编辑的是哪个线的位置
            this.entityPolyline = this.viewer.entities.getById(this.pickId._name + 'polyline');
            this.isEditing = true;
            if (this.entityPolyline.polyline._positions._value || this.entityPolyline.polyline.positions) {
                this.tempPositions = this.entityPolyline.polyline._positions._value || this.entityPolyline.polyline.positions.getValue(Cesium.JulianDate.now());
                this.tempPositions.forEach((item, index) => {
                    if (JSON.stringify(item) === JSON.stringify(this.pickId.position._value)) {
                        this.index = index;
                    }
                })
                this.entityPolyline.polyline.positions = new Cesium.CallbackProperty(e => {
                    return this.tempPositions;
                }, false)
            }

        }
    }

    //禁用编辑
    deactivate() {
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.unRegisterEvents();

    }
    handleEditEntity() {
        this.unRegisterEvents();
        let editEntity = this.editEntity;
        if (!editEntity) return;
        this.closeEntityEditMode();
        this.editEntity = undefined;
        if (!this.isEdited) return; //没有任何编辑 直接返回  
        //触发编辑事件  
        this.isEdited = false;
        this.isEditing = false;
    }
    //取消事件监听
    unRegisterEvents() {
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
}