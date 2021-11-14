<template>
  <div id="app">
    <!-- 我们想让详情页不缓存下来，每次路由到都创建一个新的详情页 -->
    <keep-alive exclude="Detail">
      <router-view/>
    </keep-alive>
    <main-tab-bar/>
  </div>
</template>

<script>

import MainTabBar from 'components/content/mainTabbar/MainTabBar'

export default {
  name: 'app',
  components: {
    MainTabBar
  }
}
</script>

<style>
  @import 'assets/css/base.css'
</style>
