<template>
  <div class="feature">
    <a href="">
      <!-- 注意：这里路径中用到别名assets时，要用~ -->
      <img src="~assets/img/home/recommend_bg.jpg" alt="">
    </a>
  </div>
</template>

<script>
  export default {
    name: "FeatureView"
  }
</script>

<style scoped>
  .feature img {
    width: 100%;
  }
</style>
