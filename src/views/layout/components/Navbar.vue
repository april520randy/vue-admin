<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="right-menu">
      <el-tooltip effect="dark" :content="$t('main.label.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>
      <lang-select class="international right-menu-item"></lang-select>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('main.label.logout')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>

  import {mapGetters} from 'vuex'
  import Screenfull from '@/components/Screenfull'
  import LangSelect from '@/components/LangSelect'
  import Hamburger from '@/components/Hamburger'
  import Breadcrumb from '@/components/Breadcrumb'
  import avatar from '@/assets/images/home/user.gif'
  import {login} from 'api'

  export default {
    components: {Screenfull, LangSelect, Hamburger, Breadcrumb},
    data() {
      return {
        avatar: avatar
      }
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar');
      },
      logout() {
        login.logout().then((response) => {
          if (response.data['code'] === '10000') {
            this.$router.push('/login');
          } else {
            let messageKey = this.global.getMessageKey(response.data['code']);
            this.$message({message: this.$t(messageKey), type: 'error'});
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
      outline: none;
    }
    .breadcrumb-container {
      float: left;
    }
    .right-menu {
      float: right;
      height: 100%;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international {
        vertical-align: top;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .avatar-wrapper {
          cursor: pointer;
          margin-top: 5px;
          position: relative;
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
