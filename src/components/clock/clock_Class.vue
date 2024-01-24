<template>
    <div>
        <div id="cesiumContainer"></div>
        <div class="control">
            <button @click="setSceneClock">设置时间</button>
            <button @click="stepUp">快进</button>
            <button @click="stepBack">快退</button>
            <button @click="accelerateClock">加速</button>
             <button @click="decelerateClock">减速</button>
              <button @click="getCurrentScenarioTime">获取当前场景时间</button>
        </div>
    </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import ClockClass from '../utils/clock/ClockClass';
export default {
    components: {},

    data() {
        return {
            viewer: null,
            clock: null,
        };
    },

    computed: {},

    mounted() {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
        this.viewer = new Cesium.Viewer("cesiumContainer")
        this.clock = new ClockClass(this.viewer);

    },

    methods: {
        setSceneClock() {
            let startTime = new Date("01/02/2024 9:00:00");
            let stopTime = new Date("01/02/2024 18:00:00");
            this.clock.setSceneClock(startTime, stopTime)
        },
        stepUp() {
            this.clock.stepUp()
        },
        stepBack() { 
            this.clock.stepBack()
        },
        accelerateClock() { 
            this.clock.accelerateClock()
        },
        decelerateClock() { 
            this.clock.decelerateClock()
        },
        //回调函数：把函数当作一个参数传到另外一个函数中，当需要用这个函数是，再回调运行()这个函数
        getCurrentScenarioTime() {
            this.clock.getCurrentScenarioTime((time)=> { 
                console.log(time);
            }) 
            
        }

    }
};
</script>
<style>
.control {
    position: absolute;
    z-index: 999;
    left: 10px;
    top: 10px;
}
</style>
