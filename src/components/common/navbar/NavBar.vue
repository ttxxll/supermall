<template>
  <div class="nav-bar">
    <!-- 
      插槽也需要布局：
        但是不能直接在插槽中布局，因为插槽替换时，里面的布局代码也被整体替换掉了。
        所以用一个div再包起来，在div中布局
    -->
    <div class="left"><slot name="left"></slot></div>
    <div class="center"><slot name="center"></slot></div>
    <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<script>
export default {
  name: "NavBar"
}
</script>

<style scoped>
  .nav-bar {
    display: flex;
    height: 44px;
    line-height: 44px;
    text-align: center;
    box-shadow: 0 1px 1px rgba(100, 100, 100, .1);
  }

  .left, .right {
    width: 60px;
  }

  .center {
    flex: 1;
  }
</style>

