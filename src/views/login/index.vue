<template>
  <div class="main">
    <div class="bluebg"></div>
    <el-form id="loginForm" :model="loginForm" ref="loginForm" :rules="rules" label-width="0">
      <h4 :class="loginTitle">{{$t('login.label.systemname')}}</h4>
      <div class="logoBlock home-ico-bg"></div>
      <div class="logoBlockWrap"></div>
      <lang-select class="set-language"></lang-select>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username">
              <template slot="prepend">{{$t('login.label.username')}}</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="password">
            <el-input :type="passwordType" v-model="loginForm.password">
              <template slot="prepend">{{$t('login.label.password')}}</template>
            </el-input>
            <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="margin-bottom22">
          <div class="el-input-group__prepend el-input-title-special">{{$t('login.label.productcode')}}</div>
          <el-form-item prop="productCode" class="el-input-select-special">
            <product-select :item="loginForm"></product-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="verificationCodeWrap">
          <el-form-item prop="imageCode">
            <el-input v-model="loginForm.imageCode">
              <template slot="prepend">{{$t('login.label.verificationcode')}}</template>
            </el-input>
            <img class="verificationCodeImg" v-bind:src="verificationCodeImgUrl" @click="handleVerificationCode"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button class="loginBtn" @click.native.prevent="handleLogin">{{$t('common.button.login')}}</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

  import LoginJS from './Login.js'

  export default LoginJS
</script>

<style rel="stylesheet/scss" lang="scss">

  @import "../../assets/styles/mixin.scss";
  @import "../../assets/styles/login.scss";
</style>
