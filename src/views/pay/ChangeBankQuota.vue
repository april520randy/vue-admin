<template>
  <div class="app-container">
    <section>
      <el-form :model="submitForm" ref="submitForm" id="submitForm" :rules="formRules">
        <!--银行账户-->
        <el-form-item prop="accountName" :label="$t('changeBankQuota.label.accountName')" :label-width="formLabelWidth">
          <el-input v-model="submitForm.accountName" @blur="getPaymentAccount();"></el-input>
        </el-form-item>
        <!--银行当前额度-->
        <el-form-item prop="localQuota" :label="$t('changeBankQuota.label.localQuota')" :label-width="formLabelWidth">
          <el-input v-model="submitForm.localQuota"></el-input>
        </el-form-item>
        <!--增加/扣除-->
        <el-form-item prop="changeType" :label="$t('changeBankQuota.label.changeType')" :label-width="formLabelWidth">
          <el-select v-model="submitForm.changeType" clearable :placeholder="$t('common.label.choose')">
            <el-option v-for="item in changeTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
          </el-select>
        </el-form-item>
        <!--额度记录类型-->
        <el-form-item prop="quotaRecordType" :label="$t('changeBankQuota.label.quotaRecordType')" :label-width="formLabelWidth">
          <el-select v-model="submitForm.quotaRecordType" clearable :placeholder="$t('common.label.choose')">
            <el-option v-for="item in quotaRecordTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
          </el-select>
        </el-form-item>
        <!--账户类型-->
        <el-form-item prop="accountType" :label="$t('changeBankQuota.label.accountType')" :label-width="formLabelWidth">
          <el-select v-model="submitForm.accountType" clearable :placeholder="$t('common.label.choose')" @change="changeAccountType">
            <el-option v-for="item in accountTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
          </el-select>
        </el-form-item>
        <!--额度记录类型-->
        <el-form-item prop="bankType" :label="$t('changeBankQuota.label.bankType')" :label-width="formLabelWidth">
          <el-select v-model="submitForm.bankType" clearable :placeholder="$t('common.label.choose')">
            <el-option v-for="item in bankTypeList" :label="item.itemValue" :value="item.itemCode" :key="item.itemCode"></el-option>
          </el-select>
        </el-form-item>
        <!--金额-->
        <el-form-item prop="amount" :label="$t('changeBankQuota.label.amount')" :label-width="formLabelWidth">
          <el-input v-model="submitForm.amount"></el-input>
        </el-form-item>
        <!--备注-->
        <el-form-item prop="remark" :label="$t('changeBankQuota.label.remark')" :label-width="formLabelWidth">
          <el-input v-model="submitForm.remark" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-left: 15%">
        <el-button @click="handleReset">{{$t('common.button.reset')}}</el-button>
        <el-button type="primary" @click.native="submit" :loading="submitLoading">{{$t('common.button.submit')}}</el-button>
      </div>
    </section>
  </div>
</template>

<script>
    import ChangeBankQuotaJS from "./ChangeBankQuota.js";

    export default ChangeBankQuotaJS;
</script>

<style lang="scss" rel="stylesheet/scss">
  #submitForm .el-form-item__content > div{
   width:30%;
  }

</style>
