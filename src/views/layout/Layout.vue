<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <tags-view></tags-view>
      <main-content></main-content>
    </div>
  </div>
</template>

<script>

  import {Sidebar, Navbar, TagsView, MainContent} from './components'

  export default {
    name: 'layout',
    components: {Sidebar, Navbar, TagsView, MainContent},
    computed: {
      sidebar() {
        return this.$store.state.user.sidebar;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  @import "../../assets/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
