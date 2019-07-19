<template>
  <div class="my-upload" :style="styleObj">
    <img :src="item.showImageUrl" alt="">
    <input type="file" name="file" @click="select" :id="item.fileId">
    <div class="mask" v-show="item.progressShowStatus">
      <i class="el-icon-loading"></i>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      item: {
        type: Object,
        default: {}
      },
      size: {
        type: String,
        default: '178px'
      }
    },
    data() {
      return {
        styleObj: {
          width: this.size,
          height: this.size
        }
      }
    },
    methods: {
      select(e) {
        let input = e.target;
        input.onchange = (() => {
          this.$emit('change');
          input.value = '';
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .my-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: dodgerblue;
    }
    img {
      width: 100%;
      height: 100%;
    }
    input {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      top: 0;
      left: 0;
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, .7);
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 40px;
    }
  }
</style>
