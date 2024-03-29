/**
 * @description: 点聚合功能效果
 * @param {*} viewer
 * @return {*}
 */
import * as Cesium from "cesium/Cesium";
export const initCluster = function (viewer, geojson) {
    new Cesium.GeoJsonDataSource().load(geojson).then(dataSource => {
        viewer.dataSources.add(dataSource);
        // 设置聚合参数
        dataSource.clustering.enabled = true;
        dataSource.clustering.pixelRange = 60;
        dataSource.clustering.minimumClusterSize = 2;

        // foreach用于调用数组的每个元素，并将元素传递给回调函数。
        dataSource.entities.values.forEach(entity => {
            // 将点拉伸一定高度，防止被地形压盖
            entity.position._value.z += 50.0;
            // 使用大小为64*64的icon，缩小展示poi
            entity.billboard = {
                image: 'images/icon/icon_Red.png',
                width: 16,
                height: 20,
            };
            entity.label = {
                text: '学校',
                font: 'bold 6px Microsoft YaHei',
                // 竖直对齐方式
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                // 水平对齐方式
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                // 偏移量
                pixelOffset: new Cesium.Cartesian2(15, 0),
            }
        });

        // 添加监听函数
        dataSource.clustering.clusterEvent.addEventListener(
            function (clusteredEntities, cluster) {
                // 关闭自带的显示聚合数量的标签
                cluster.label.show = false;
                cluster.billboard.show = true;
                cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

                // 根据聚合数量的多少设置不同层级的图片以及大小
                // 64-调节图层填充canvas
                // 
                if (clusteredEntities.length >= 20) {
                    cluster.billboard.image = combineIconAndLabel('images/icon/cluster_4.png', clusteredEntities.length, 64);
                    cluster.billboard.width = 72;
                    cluster.billboard.height = 72;
                } else if (clusteredEntities.length >= 12) {
                    cluster.billboard.image = combineIconAndLabel('images/icon/cluster_3.png', clusteredEntities.length, 64);
                    cluster.billboard.width = 56;
                    cluster.billboard.height = 56;
                } else if (clusteredEntities.length >= 8) {
                    cluster.billboard.image = combineIconAndLabel('images/icon/cluster_2.png', clusteredEntities.length, 64);
                    cluster.billboard.width = 48;
                    cluster.billboard.height = 48;
                } else {
                    cluster.billboard.image = combineIconAndLabel('images/icon/cluster_1.png', clusteredEntities.length, 64);
                    cluster.billboard.width = 40;
                    cluster.billboard.height = 40;
                }
            }
        )
    });
}


/**
 * @description: 将图片和文字合成新图标使用（参考Cesium源码）
 * @param {*} url：图片地址
 * @param {*} label：文字
 * @param {*} size：画布大小
 * @return {*} 返回canvas
 */
function combineIconAndLabel(url, label, size) {
    // 创建画布对象
    let canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    let ctx = canvas.getContext("2d");

    let promise = new Cesium.Resource.fetchImage(url).then(image => {
        // 异常判断
        try {
            ctx.drawImage(image, 0, 0);
        } catch (e) {
            console.log(e);
        }

        // 渲染字体
        // font属性设置顺序：font-style, font-variant, font-weight, font-size, line-height, font-family
        ctx.fillStyle = Cesium.Color.WHITE.toCssColorString();
        ctx.font = 'bold 20px Microsoft YaHei';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, size / 2, size / 1.9);//调节文字在图片的位置

        return canvas;
    });
    return promise;
}

