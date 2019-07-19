<template>
  <el-select v-model="item.productCode" clearable :placeholder="$t('common.label.choose')">
    <el-option v-for="item in productList" :label="item.name" :value="item.code" :key="item.code"></el-option>
  </el-select>
</template>

<script>

  import {product} from 'api'

  export default {
    name: 'productSelect',
    props: {
      item: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        productList: []
      }
    },
    created() {
      this.getProductList()
    },
    methods: {
      getProductList() {
        product.queryList().then((response) => {
          if (response.data['code'] === '10000') {
            this.productList = response.data['data'];
          }
        })
      }
    }
  }
</script>
