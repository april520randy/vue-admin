<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>

<script>

  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    mounted() {
      const _this = this;
      this.editor = UE.getEditor('editor', this.config); // 初始化UE
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
    },
    methods: {
      getUEContent() { // 获取内容方法
        console.info(33333);
        return this.editor.getContent()
      }
    },
    destroyed() {
      this.editor.destroy();
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
