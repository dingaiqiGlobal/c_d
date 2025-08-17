
import * as Cesium from "cesium/Cesium";
import createEdgeStage from "./CesiumEdgeStage/createEdgeStage";

var viewer = new Cesium.Viewer('cesiumContainer', {
    animation: false,
    selectionIndicator: false,
    geocoder: false
})

viewer.resolutionScale = devicePixelRatio;
viewer.postProcessStages.fxaa.enabled = true
viewer.scene.globe.depthTestAgainstTerrain = true
  
//entities
var box = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(106.647382019240, 26.620452464821, 50),
    box: {
        dimensions: new Cesium.Cartesian3(100, 100, 100),
        material: Cesium.Color.GREY
    }
})
viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(106.647482019240, 26.621452464821, 50),
    ellipsoid: {
        radii: new Cesium.Cartesian3(50, 50, 50),
        material: Cesium.Color.GREY
    }
})
 
//3d tiles
var tileset = new Cesium.Cesium3DTileset({
    url: Cesium.IonResource.fromAssetId(40866),
});
viewer.scene.primitives.add(tileset);
tileset.readyPromise.then(() => {
    viewer.flyTo(tileset)
})

viewer.homeButton.viewModel.command.beforeExecute.addEventListener(e => {
    viewer.flyTo(box)
    e.cancel = true
})

//鼠标点击，拾取对象并高亮显示
viewer.screenSpaceEventHandler.setInputAction((e) => {
    var mousePosition = e.position;
    var picked = viewer.scene.pick(mousePosition)

    edgeStage.selected = []
    edgeStage.enabled = false

    if (picked && picked.primitive) {
        console.log(picked)
        let primitive = picked.primitive
        let pickIds = primitive._pickIds;
        let pickId = picked.pickId;

        //gltf
        if (!pickId && !pickIds && picked.content) {
            pickIds = picked.content._model._pickIds;
        }
        //entity:point&polyline&polygon
        if (!pickId) {
            if (picked.id) {
                pickId = pickIds.find(pickId => {
                    return pickId.object == picked;
                })
            } else if (pickIds) {
                pickId = pickIds[0]
            }
        }
        //primitive:point&polyline&polygon
        if (pickId) {
            let pickObject = {
                pickId: pickId
            }
            edgeStage.selected = [pickObject]
            cesiumStage.selected = [pickObject]
            edgeStage.enabled = !cesiumStage.enabled
        } else {
            $message.alert('未找到pickId')
        }

    }

}, Cesium.ScreenSpaceEventType.LEFT_CLICK)

//
var edgeStage = createEdgeStage()
edgeStage.visibleEdgeColor = Cesium.Color.fromCssColorString('#a8a8e0')
edgeStage.hiddenEdgeColor = Cesium.Color.fromCssColorString('#4d4d4d')
edgeStage.selected = []
edgeStage.enabled = false
viewer.postProcessStages.add(edgeStage);

var cesiumStage = Cesium.PostProcessStageLibrary.createSilhouetteStage()
cesiumStage.enabled = false;
viewer.postProcessStages.add(cesiumStage);
