<template>
  <div class="cart">
    <!-- 顶部导航 -->
    <nav-bar class="nar-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <!-- 商品列表 -->
    <cart-list></cart-list>
    <!-- 底部汇总 -->
    <cart-bottom-bar class="cart-bottom-bar"/>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartList from './childComponents/CartList.vue'
  import CartBottomBar from './childComponents/CartBottomBar.vue'
  import {mapGetters} from 'vuex'

  export default {
    name: 'Cart',
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      //...mapGetters(['cartLength', 'cartList'])
      //mapGetters辅助函数：将store中的getter映射到局部计算属性
      ...mapGetters({
        length: 'cartLength'
      })
    }
  }
</script>

<style scoped>
  .cart {
    height: 100vh;
  }

  .nar-bar {
    background-color: var(--color-tint);
    color: #fff;
  }

  /* .cart-bottom-bar {
    position: fixed;
    width: 100%;
    bottom: 49px;
    background-color: red;
    height: 40px;
    z-index: 9;
  } */
</style>