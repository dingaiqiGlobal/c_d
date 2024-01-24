import * as Cesium from "cesium/Cesium";
// 场景时钟类
export default class ClockClass {
    constructor(viewer) {
        this.viewer = viewer;
    }

    /**
     * 设置场景时钟
     * @param start 开始时间
     * @param stop 结束时间
     * @param multiplier 场景时间倍速,默认是 1 倍速
     */
    setSceneClock(start, stop, multiplier = 1) {
        const startTime = Cesium.JulianDate.fromDate(start);
        const stopTime = Cesium.JulianDate.fromDate(stop);

        this.viewer.clock.startTime = startTime.clone();
        this.viewer.clock.stopTime = stopTime.clone();
        this.viewer.clock.currentTime = startTime.clone();
        this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        this.viewer.clock.multiplier = multiplier;
        this.viewer.timeline.zoomTo(startTime.clone(), stopTime.clone())
        this.multiplier = multiplier;
    }

    /**
     * 快进时间
     * @param seconds 快进多少秒,默认30秒
     */
    stepUp(seconds = 30) {
        if (seconds <= 0) {
            return;
        }
        const currentTime = Cesium.JulianDate.addSeconds(
            this.viewer.clock.currentTime,
            seconds,
            new Cesium.JulianDate()
        );
        this.viewer.clock.currentTime = currentTime;
    }

    /**
     * 后退时间
     * @param seconds 后退多少秒,默认-30秒
     */
    stepBack(seconds = -30) {
        if (seconds >= 0) {
            return;
        }
        const currentTime = Cesium.JulianDate.addSeconds(
            this.viewer.clock.currentTime,
            seconds,
            new Cesium.JulianDate()
        );
        this.viewer.clock.currentTime = currentTime;
    }

    /**
     * 场景时间加速
     * @param multiplier 
     * @returns 当前场景倍速
     */
    accelerateClock(multiplier = 2) {
        this.viewer.clockViewModel.multiplier *= multiplier;
        return this.viewer.clockViewModel.multiplier
    }

    /**
     * 场景时间减速
     * @param multiplier 
     * @returns 当前场景倍速
     */
    decelerateClock(multiplier = 2) {
        this.viewer.clockViewModel.multiplier /= multiplier;
        return this.viewer.clockViewModel.multiplier
    }

    /**
     * 是否开启场景动画
     * @param state 
     */
    shouldAnimate(state) {
        this.viewer.clock.shouldAnimate = state;
    }

    // 重置场景时钟
    reset() {
        this.viewer.clock.shouldAnimate = false;
        this.viewer.clock.multiplier = this.multiplier;
        this.viewer.clock.currentTime = this.viewer.clock.startTime;
    }

    // 设置当前时间
    setCurrentTime(time) {
        this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(time);
    }
    /**
     * 获取当前场景时间
     * @param callback 回调函数接收当前场景时间
     */
    getCurrentScenarioTime(callback) {
        this.viewer.scene.preUpdate.addEventListener((s, time) => {
            callback(Cesium.JulianDate.toDate(time));
        })
    }
    // 设置当前速率
    setMultiplier(multiplier = 1) {
        this.viewer.clock.multiplier = multiplier;
    }

    /**
     * 获取场景的开始与结束时间
     * @returns 场景的开始与结束时间
     */
    getSceneTime() {
        const startTime = new Date(Cesium.JulianDate.toDate(this.viewer.clock.startTime)),
            stopTime = new Date(Cesium.JulianDate.toDate(this.viewer.clock.stopTime));

        //  转换为UTC时间,28800000(8小时)
        const startTimeUTC = new Date(startTime.getTime() - 28800000).format('yyyy-MM-dd hh:mm:ss'),
            endTimeUTC = new Date(stopTime.getTime() - 28800000).format('yyyy-MM-dd hh:mm:ss');

        return {
            startTimeUTC,
            endTimeUTC
        };
    }
}