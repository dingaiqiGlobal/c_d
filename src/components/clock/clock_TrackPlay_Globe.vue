<template>
  <div>
    <div id="cesiumContainer"></div>

    <div class="TrackReplay">
      <div class="dateBox">
        <div class="title">
          <p>轨迹回放</p>
          <span @click="handleClose">X</span>
        </div>
        <div class="contentBox">
          <p class="firstTitle">时间选择</p>
          <div class="calendarBox">
            <a-range-picker :show-time="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm" :placeholder="['开始时间', '结束时间']"
              @change="onChange" @ok="onOk" />
          </div>
        </div>
      </div>
      <div class="infoBox">
        <div class="title">
          <p>属性信息</p>
        </div>
        <div class="contentBox">
          <ul class="infoUl">
            <li class="infoLi">
              <span class="label">时间：</span><span class="info">{{ trackInfo.time }}</span>
            </li>
            <li class="infoLi">
              <span class="label">定位：</span><span class="info">{{ trackInfo.lonlat }}</span>
            </li>
            <li class="infoLi">
              <span class="label">位置：</span><span class="info">{{ trackInfo.address }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="playerBox">
        <a-button type="primary" shape="circle" v-show="!isPlay" @click="handlePlay"><a-icon
            type="caret-right" /></a-button>
        <a-button type="primary" shape="circle" v-show="isPlay" @click="handlePause"><a-icon type="pause" /></a-button>
        <a-slider v-model="currentTime" :min="0" :max="totalduration" :step="1" />
        <a-select v-model="multiple" @change="multipleChange">
          <a-select-option v-for="item in multipleOptions" :key="item" :value="item">{{ item }}X</a-select-option>
        </a-select>
        <a-divider type="vertical" />
        <span class="durationText">{{ duration }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import Roam from '../utils/clock/Roam'
export default {
  name: "TrackReplay",
  props: [],
  data() {
    return {
      viewer: null,
      roam: null,
      startTime: null,
      stopTime: null,

      isPlay: false,
      currentTime: 0,
      timer: null,
      trackInfo: {
        time: '2023年07月26日 9:00:12',
        lonlat: '120.29684,31.57885',
        address: '济南历城'
      },
      speed: 1000,//1倍速的播放速度，单位为毫秒
      multiple: 1,//倍速
      multipleOptions: [1, 2, 5, 10, 20, 50],
      duration: '00:00:00',
      totalduration: 0//运动总时间
    }
  },
  created() {

  },
  mounted() {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjI1YWYwNS00ODJiLTQzOTYtYTA3My0zMzI3ODFiZTdkYzAiLCJpZCI6MjAzOTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzczNDAzMjN9.s1TyB5DYncqM_xAF-ekua_P4fcZmmyeVR4hA9ec9G4Q";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      timeline: true,
      animation: true,

      shouldAnimate: true,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      selectionIndicator: false,
      sceneModePicker: false,
      navigationHelpButton: false,
    })
    // this.viewer.scene.postUpdate.addEventListener(
    //   console.log(this.viewer.clock.currentTime)
    // )
  },
  beforeDestroy() {

  },
  computed: {
    interval() {
      return this.speed * this.multiple;
    }
  },
  methods: {

    handleClose() {

    },
    onChange(value, dateString) {

    },
    onOk(value) {
      if (this.roam) {
        this.roam.destroy()
      }
      let timeString1 = value[0].format();
      let timeString2 = value[1].format();
      this.startTime = Cesium.JulianDate.fromIso8601(timeString1);;
      this.stopTime = Cesium.JulianDate.fromIso8601(timeString2);
      //接口请求
      //参数：startTime,stopTime
      fetch('data/json/data_Roam.json').then(res => {
        return res.json()
      })
        .then(res => {
          let { dataRoam } = res;
          //构造
          this.roam = new Roam({
            viewer: this.viewer,
            startTime: this.startTime,
            stopTime: this.stopTime,
            multiplie: this.multiple,
            dataRoam: dataRoam,
          });
        })
        .catch(error => {
          console.log(error);
        })

      let timeNumber1 = Date.parse(value[0]);
      let timeNumber2 = Date.parse(value[1]);
      let number = (timeNumber2 - timeNumber1);
      let duration = this.millisecondToDate(number);
      let totalduration = parseFloat(number) / 1000;
      this.duration = duration;
      this.totalduration = totalduration;
    },
    handlePlay() {
      if (this.totalduration > 0) {
        this.isPlay = true;
        this.roam.pause()//ding     
        this.timer = setInterval(() => {
          if (this.currentTime == this.totalduration) {
            this.currentTime = 1;
          } else {
            this.currentTime += 1;
          }
        }, this.interval)//设置速度

      }
    },
    handlePause() {
      this.isPlay = false;
      this.roam.pause()//ding
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    multipleChange(value) {
      this.multiplie = value
      this.roam.multipleChange(this.multiplie);
    },
    millisecondToDate(msd) {
      var time = parseFloat(msd) / 1000;
      if (null != time && "" != time) {
        if (time > 60 && time < 60 * 60) {
          let mNum1 = parseInt(time / 60.0);
          let sNum1 = parseInt((parseFloat(time / 60.0) -
            parseInt(time / 60.0)) * 60);
          let m1 = mNum1 > 10 ? mNum1 : '0' + mNum1;
          let s1 = sNum1 > 10 ? sNum1 : '0' + sNum1;
          time = '00' + ':' + m1 + ':' + s1;
        } else if (time >= 60 * 60) {
          let hNum = parseInt(time / 3600.0);
          let mNum2 = parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60);
          let sNum2 = parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
            parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60);
          let h = hNum > 10 ? hNum : '0' + hNum;
          let m2 = mNum2 > 10 ? mNum2 : '0' + mNum2;
          let s2 = sNum2 > 10 ? sNum2 : '0' + sNum2;
          time = h + ':' + m2 + ':' + s2;
        } else {
          time = parseInt(time);
        }
      } else {
        time = "00:00:00";
      }
      return time;
    },
  }
}
</script>
<style scoped lang="less">
.TrackReplay {
  .dateBox {
    width: 340px;
    position: absolute;
    left: 40px;
    top: 40px;
    background: #FFFFFF;
    box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.0500), 0px 6px 16px 0px rgba(0, 0, 0, 0.0800), 0px 3px 6px -4px rgba(0, 0, 0, 0.1200);
    z-index: 999;

    .title {
      width: 100%;
      height: 56px;
      line-height: 56px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;

      p {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.84);
      }

      span {
        color: rgba(0, 0, 0, 0.45);
        cursor: pointer;
      }
    }

    .contentBox {
      padding: 10px;

      .firstTitle {
        text-align: left;
        padding: 0;
        margin: 0 0 10px 10px;
        font-size: 14px;
      }

      .calendarBox {
        .ant-calendar-picker {
          width: 300px !important;

          .ant-calendar-picker-input {
            width: 300px;
          }
        }

      }

      .btn {
        text-align: right;
        padding: 10px;
        margin-top: 10px;

        .cancelBtn {
          width: 80px;
        }

        .submitBtn {
          width: 80px;
          margin-left: 10px;
        }
      }
    }
  }

  .infoBox {
    width: 320px;
    position: absolute;
    right: 40px;
    top: 40px;
    background: #FFFFFF;
    box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.0500), 0px 6px 16px 0px rgba(0, 0, 0, 0.0800), 0px 3px 6px -4px rgba(0, 0, 0, 0.1200);
    z-index: 999;

    .title {
      width: 100%;
      line-height: 56px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;

      p {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.84);
        margin-bottom: 0;
      }

      span {
        color: rgba(0, 0, 0, 0.45);
        cursor: pointer;
      }
    }

    .contentBox {
      .infoUl {
        padding: 0 20px;
        list-style: none;

        .infoLi {
          text-align: left;
          padding: 5px 0;
        }
      }
    }
  }

  .playerBox {
    width: 530px;
    height: 50px;
    line-height: 50px;
    position: absolute;
    left: 40%;
    bottom: 40px;
    padding: 0 15px;
    background: #FFFFFF;
    border-radius: 25px;
    text-align: left;
    box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.0500), 0px 6px 16px 0px rgba(0, 0, 0, 0.0800), 0px 3px 6px -4px rgba(0, 0, 0, 0.1200);
    z-index: 999;

    .ant-btn {
      .anticon {
        vertical-align: middle;
        font-size: large;
      }
    }

    .ant-slider {
      width: 300px;
      margin: 0 10px;
      display: inline-block;
    }

    .durationText {
      padding: 0 5px;
    }
  }
}
</style>
