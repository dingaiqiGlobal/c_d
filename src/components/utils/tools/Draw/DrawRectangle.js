/*
绘制矩形
 */
export class DrawRectangle {
    constructor(arg) {

        this.viewer = arg.viewer;
        this.Cesium = arg.Cesium;
        this.callback=arg.callback;
        this.floatingPoint = null;//标识点
        this._rectangle = null; //活动矩形
        this._rectangleLast = null; //最后一个矩形
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_rectangle = [];  //脏数据
        this._rectangleData = null; //用于构造矩形数据
    }

    //返回最后图形
    get line() {
        return this._rectangleLast;
    }

    //返回矩形数据
    getData() {
        return this._rectangleData;
    }

    //加载
    loadRectangle(data) {
        var $this = this;
        var shape = this.viewer.entities.add({
            name: "rectangle",
            rectangle: {
                coordinates: $this.Cesium.Rectangle.fromCartesianArray(data),
                material: $this.Cesium.Color.RED.withAlpha(0.5)
            }
        });
        $this._entities_rectangle.push(shape);
        return shape;
    }

    //开始创建
    startCreate() {
        var $this = this;
        
        this.handler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
       
        this.handler.setInputAction(function (evt) { //单机开始绘制
           
            //屏幕坐标转地形上坐标
            var cartesian = $this.getCatesian3FromPX(evt.position);
           
            if ($this._positions.length == 0) {
                $this._positions.push(cartesian.clone());
                $this.floatingPoint = $this.createPoint(cartesian);
                $this.createPoint(cartesian);// 绘制点
            }
            $this._positions.push(cartesian);
            $this.viewer.scene.forceRender();
        }, $this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(function (evt) { //移动时绘制线
            if ($this._positions.length < 3) return;
            var cartesian = $this.getCatesian3FromPX(evt.endPosition);
            if (!$this.Cesium.defined($this._rectangle)) {
                $this._rectangle = $this.createRectangle();
            }
            $this.floatingPoint.position.setValue(cartesian);
            if ($this._rectangle) {
                $this._positions.pop();
                $this._positions.push(cartesian);
            }
            $this.viewer.scene.forceRender();
        }, $this.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.setInputAction(function (evt) {
            if (!$this._rectangle) return;
            var cartesian = $this.getCatesian3FromPX(evt.position);
            $this._positions.pop();
            $this._positions.push(cartesian);
            $this.createPoint(cartesian);// 绘制点
            $this._rectangleData = $this._positions.concat();
            $this.viewer.entities.remove($this._rectangle); //移除
            $this._rectangle = null;
            $this._positions = [];
            $this.floatingPoint.position.setValue(cartesian);
            var rectangle = $this.loadRectangle($this._rectangleData); //加载
            $this._entities_rectangle.push(rectangle);
            $this._rectangleLast = rectangle;
            if(typeof $this.callback=="function"){
                $this.callback(rectangle);
            }
            $this.destroy();
            $this.viewer.scene.forceRender();
        }, $this.Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        return this;
    }

    //创建点
    createPoint(cartesian) {
       
        var $this = this;
        var point = this.viewer.entities.add({
            position: cartesian,
            point: {
                pixelSize: 10,
                color: $this.Cesium.Color.YELLOW,
            }
        });
        $this._entities_point.push(point);
        $this.viewer.scene.forceRender();
        return point;
    }
    //创建矩形
    createRectangle() {

        var $this = this;
      
        var shape = this.viewer.entities.add({
            name: "rectangle",
            rectangle: {
                coordinates: new $this.Cesium.CallbackProperty(()=>{
                    if($this.checkPositions()){
                        var obj = $this.Cesium.Rectangle.fromCartesianArray($this._positions);
                        return obj;
                    }
                    
                }, false),
                material: $this.Cesium.Color.RED.withAlpha(0.5)
            }
        });
        $this._entities_rectangle.push(shape);
        $this.viewer.scene.forceRender();
        return shape;
    }

    //销毁
    destroy() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
            this.viewer.scene.forceRender();
        }
    }
    //清空实体对象
    clear() {
        for (var i = 0; i < this._entities_point.length; i++) {
            this.viewer.entities.remove(this._entities_point[i]);
        }
        for (var i = 0; i < this._entities_rectangle.length; i++) {
            this.viewer.entities.remove(this._entities_rectangle[i]);
        }
        this.floatingPoint = null;//标识点
        this._rectangle = null; //活动矩形
        this._rectangleLast = null; //最后一个矩形
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_rectangle = [];  //脏数据
        this._rectangleData = null; //用于构造矩形数据
        this.viewer.scene.forceRender();
    }
    checkPositions(){
        let flag = true;
        for(let item of this._positions){
            if(!item || !item.x){
                flag = false;
                break;
            }
        }
       
        return flag;
    }
    getCatesian3FromPX(px) {
       
        var cartesian;
        var ray = this.viewer.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        return cartesian;
    }
}


/*
绘制圆
 */
export class DrawCircle {
    constructor(arg) {
        this.viewer = arg.viewer;
        this.Cesium = arg.Cesium;
        this.callback=arg.callback;
        this._cicle = null; //活动圆
        this.floatingPoint = null;
        this._cicleLast = null; //最后一个圆
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_cicle = [];  //脏数据
        this._cicleData = null; //用于构造圆形数据
    }

    get cicle() {
        return this._cicleLast;
    }

    //加载圆
    loadCicle(data) {
        var that = this;
        var position = data[0];
        var value = data;
        var r = Math.sqrt(
            Math.pow(value[0].x - value[value.length - 1].x, 2) +
            Math.pow(value[0].y - value[value.length - 1].y, 2)
        );
        var shape = this.viewer.entities.add({
            position: position,
            name: "circle",
            type: "circle",
            ellipse: {
                semiMinorAxis: r,
                semiMajorAxis: r,
                material: that.Cesium.Color.RED.withAlpha(0.5),
                outline: true
            }
        });
        return shape;
    }

    //返回数据
    getData() {
        return this._cicleData;
    }

    startCreate() {
        this.handler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        var $this = this;
        this.handler.setInputAction(function (evt) { //单机开始绘制
            $this.viewer.scene.globe.depthTestAgainstTerrain = true;
            //屏幕坐标转地形上坐标
            var cartesian = $this.getCatesian3FromPX(evt.position);
            if ($this._positions.length == 0) {
                $this._positions.push(cartesian.clone());
                $this.floatingPoint = $this.createPoint(cartesian);
            }
            if (!$this._cicle) {
                $this.createPoint(cartesian);// 绘制点
            }
            $this._positions.push(cartesian);
        }, $this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(function (evt) { //移动时绘制圆
            if ($this._positions.length < 1) return;
            var cartesian = $this.viewer.scene.pickPosition(evt.endPosition);// $this.getCatesian3FromPX(evt.endPosition);
            if (!$this.Cesium.defined($this._cicle)) {
                $this._cicle = $this.createCicle();
            }
            $this.floatingPoint.position.setValue(cartesian);
            if ($this._cicle) {
                $this._positions.pop();
                $this._positions.push(cartesian);
            }
        }, $this.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.setInputAction(function (evt) {
            if (!$this._cicle) return;
            $this.viewer.scene.globe.depthTestAgainstTerrain = false;
            var cartesian = $this.viewer.scene.pickPosition(evt.position); // $this.getCatesian3FromPX(evt.position);
            $this._positions.pop();
            $this._positions.push(cartesian);
            $this._cicleData = $this._positions.concat();
            $this.viewer.entities.remove($this._cicle); //移除
            $this._cicle = null;
            $this._positions = [];
            $this.floatingPoint.position.setValue(cartesian);
            var cicle = $this.loadCicle($this._cicleData); //加载
            $this._entities_cicle.push(cicle);
            $this._cicleLast = cicle;
            $this.clearPoint();
            if(typeof $this.callback=="function"){
                $this.callback(cicle);
            }
            $this.destroy();
        }, $this.Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        return this;
    }
    checkPositions(){
        let flag = true;
        for(let item of this._positions){
            if(!item || !item.x){
                flag = false;
                break;
            }
        }
       
        return flag;
    }
    //创建圆
    createCicle() {
        // if(this.checkPositions()){
            var that = this;
            var shape = this.viewer.entities.add({
                position: that._positions[0],
                name: "circle",
                type: "circle",
                ellipse: {
                    semiMinorAxis: new that.Cesium.CallbackProperty( ()=>{
                        //半径 两点间距离
                        if(that.checkPositions()){
                            var r = Math.sqrt(
                                Math.pow(that._positions[0].x - that._positions[that._positions.length - 1].x, 2) +
                                Math.pow(that._positions[0].y - that._positions[that._positions.length - 1].y, 2)
                            );
                            return r ? r : r + 1;
                        }

                    }, false),
                    semiMajorAxis: new that.Cesium.CallbackProperty( ()=> {
                        if(that.checkPositions()){
                            var r = Math.sqrt(
                                Math.pow(that._positions[0].x - that._positions[that._positions.length - 1].x, 2) +
                                Math.pow(that._positions[0].y - that._positions[that._positions.length - 1].y, 2)
                            );
                            return r ? r : r + 1;
                        }
     
                    }, false),
                    material: that.Cesium.Color.RED.withAlpha(0.5),
                    outline: true
                }
            });
            that._entities_cicle.push(shape);
            return shape;
        // }

    }

    //创建点
    createPoint(cartesian) {
        var $this = this;
        var point = this.viewer.entities.add({
            position: cartesian,
            point: {
                pixelSize: 10,
                color: $this.Cesium.Color.YELLOW,
            }
        });;
        $this._entities_point.push(point);
        return point;
    }

    getCatesian3FromPX(px) {
        var cartesian;
        var ray = this.viewer.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        return cartesian;
    }

    destroy() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
    }

    clearPoint(){
        for (var i = 0; i < this._entities_point.length; i++) {
            this.viewer.entities.remove(this._entities_point[i]);
        }
        this._entities_point = [];  //脏数据
    }
    clear() {

        for (var i = 0; i < this._entities_point.length; i++) {
            this.viewer.entities.remove(this._entities_point[i]);
        }

        for (var i = 0; i < this._entities_cicle.length; i++) {
            this.viewer.entities.remove(this._entities_cicle[i]);
        }
        this._cicle = null; //活动圆
        this.floatingPoint = null;
        this._cicleLast = null; //最后一个圆
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_cicle = [];  //脏数据
        this._cicleData = null; //用于构造圆形数据
    }
}

/*
绘制面
 */
export class DrawPolygon {
    constructor(arg) {
        this.viewer = arg.viewer;
        this.Cesium = arg.Cesium;
        this.callback=arg.callback;
        this._polygon = null;  //活动面
        this._polygonLast = null;  //最后一个面
        this._positions = []; //活动点
        this._entities_point = [];  //脏数据
        this._entities_polygon = [];  //脏数据
        this._polygonData = null; //用户构造面
    }

    //返回最后活动面
    get polygon() {
        return this._polygonLast;
    }

    //返回面数据用于加载面
    getData() {
        return this._polygonData;
    }

    //加载面
    loadPolygon(data) {
        var $this = this;
        return this.viewer.entities.add({
            polygon: {
                hierarchy: new $this.Cesium.PolygonHierarchy(data),
                clampToGround: true,
                show: true,
                fill: true,
                material: $this.Cesium.Color.RED.withAlpha(0.5),
                width: 3,
                outlineColor: $this.Cesium.Color.BLACK,
                outlineWidth: 1,
                outline: false
            }
        });
    }
    checkPositions(){
        let flag = true;
        for(let item of this._positions){
            if(!item || !item.x){
                flag = false;
                break;
            }
        }
       
        return flag;
    }
    //开始绘制
    startCreate() {
        var $this = this;
        this.handler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.handler.setInputAction(function (evt) { //单机开始绘制
            var cartesian = $this.getCatesian3FromPX(evt.position);
            if ($this._positions.length == 0) {
                $this._positions.push(cartesian.clone());
            }
            $this.createPoint(cartesian);
            $this._positions.push(cartesian);
        }, $this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(function (evt) { //移动时绘制面
            if ($this._positions.length < 1) return;
            var cartesian = $this.getCatesian3FromPX(evt.endPosition);
            if ($this._positions.length == 3) {
                if (!$this.Cesium.defined($this._polygon)) {
                    $this._polygon = $this.createPolygon();
                }
            }
            $this._positions.pop();
            $this._positions.push(cartesian);
        }, $this.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.setInputAction(function (evt) {
            if (!$this._polygon) return;
            var cartesian = $this.getCatesian3FromPX(evt.position);
            $this._positions.pop();
            $this._positions.push(cartesian);
            $this.createPoint(cartesian);
            $this._polygonData = $this._positions.concat();
            $this.viewer.entities.remove($this._positions); //移除
            $this._positions=null;
            $this._positions = [];
            var Polygon = $this.loadPolygon($this._polygonData);
            $this._entities_polygon.push(Polygon);
            $this._polygonLast = Polygon;
            if(typeof $this.callback=="function"){
                $this.callback(Polygon);
            }
            $this.destroy();
        }, $this.Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        return this;
    }

    //创建面
    createPolygon() {
            var $this = this;
        
            var polygon = this.viewer.entities.add({
                polygon: {
                    hierarchy: new $this.Cesium.CallbackProperty(()=> {
                        if($this.checkPositions()) {
                            return new $this.Cesium.PolygonHierarchy($this._positions);
                        }
                        
                    }, false),
                    clampToGround: true,
                    show: true,
                    fill: true,
                    material: $this.Cesium.Color.RED.withAlpha(0.5),
                    width: 3,
                    outlineColor: $this.Cesium.Color.BLACK,
                    outlineWidth: 1,
                    outline: false
                }
            });
            $this._entities_polygon.push(polygon);
            return polygon;
        

    }

    //创建点
    createPoint(cartesian) {
        var $this = this;
        var point = this.viewer.entities.add({
            position: cartesian,
            point: {
                pixelSize: 10,
                color: $this.Cesium.Color.YELLOW,
            }
        });
        $this._entities_point.push(point);
        return point;
    }


    //销毁事件
    destroy() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
    }

    //清空实体对象
    clear() {
        for (var i = 0; i < this._entities_point.length; i++) {
            this.viewer.entities.remove(this._entities_point[i]);
        }
        for (var i = 0; i < this._entities_polygon.length; i++) {
            this.viewer.entities.remove(this._entities_polygon[i]);
        }
        this._polygon = null;  //活动面
        this._polygonLast = null;  //最后一个面
        this._positions = []; //活动点
        this._entities_point = [];  //脏数据
        this._entities_polygon = [];  //脏数据
        this._polygonData = null; //用户构造面
    }

    getCatesian3FromPX(px) {
        var cartesian;
        var ray = this.viewer.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        return cartesian;
    }
}
/*
调用
 */
callbackFun(obj) {
    console.log('画完了~~', obj)
    this.entity = obj;
    this.drawsObj.destroy()//销毁handler事件交互
},

clearDraw() {
    this.viewer.entities.removeAll()
},
createShape(str) {
    this.clearDraw()

    let obj;
    let params = {
        viewer: this.viewer,
        Cesium: this.Cesium,
        callback: this.callbackFun
    };
    switch (str) {
        case 'square':
            obj = new DrawRectangle(params);
            break;
        case 'circular':
            obj = new DrawCircle(params);
            break;
        case 'polygon':
            obj = new DrawPolygon(params);
            break;
    }
    
    this.drawsObj = obj.startCreate();
    this.rectCon[str] = this.drawsObj;//缓存图形数据
}