<template>

  <div>
    <video-player class="video-player vjs-custom-skin"
                  ref="videoPlayer"
                  :playsinline="true"
                  :options="playerOptions"
                  @play="onPlayerPlay($event)"
                  @pause="onPlayerPause($event)"
                  @ended="onPlayerEnded($event)"
                  @canplay="onPlayerCanplay($event)">
    </video-player>
  </div>
</template>

<script>
  import 'video.js/dist/video-js.css'
  import {videoPlayer} from 'vue-video-player'
  // import 'videojs-flash'
  import 'videojs-contrib-hls'

  export default {
    data() {
      return {

      }
    },
    props:{
      playUrl:{
        type:String,
        default:'https://videony.rhsj520.com/0704/SDNM-184/1500kb/hls/index.m3u8'
      }
    },
    computed: {
      playerOptions(){
        return {
          // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: true, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [
            {
              withCredentials: false,
              type: 'application/x-mpegURL',
              src:this.playUrl,
            }
          ],
          poster: "../../static/images/test.jpg", //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: true,
            fullscreenToggle: true  //全屏按钮
          }
        }

      }
    },
    created(){
    },
    mounted() {
    },
    methods: {
      onPlayerPlay(player) {
      },
      onPlayerPause(player) {
      },
      onPlayerCanplay(player) {
        player.play()
      }
    },
    components: {
      videoPlayer
    }
  }

</script>
<style>
  .video-js .vjs-big-play-button {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -1.5em;
    margin-top: -0.75em
  }
</style>
