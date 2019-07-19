<template>
  <div class="upload">
    <input type="file" name="file" @click="select">
    <el-button type="primary">{{$t('common.button.import')}}</el-button>
  </div>
</template>

<script>

  export default {
    data() {
      return {}
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

  .upload {
    position: relative;
    width: 74px;
    height: 42px;
    overflow: hidden;
    cursor: pointer;
    input {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      top: 0;
      left: 0;
      cursor: pointer;
    }
  }
</style>
