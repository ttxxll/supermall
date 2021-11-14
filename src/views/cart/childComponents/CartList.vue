<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item, index) in cartList" :product="item" :key="index"></cart-list-item>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll'
  import CartListItem from './CartListItem.vue'
  import { mapGetters } from 'vuex'

  export default {
    name: "CartList",
    computed: {
      ...mapGetters(['cartList'])
    },
    components: {
      Scroll,
      CartListItem
    },
    activated() {
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart-list {
    height: calc(100% -44px -49px);
  }
  .content {
    position: absolute;
    overflow: hidden;
    top: 47px;
    bottom: 53px;
    left: 0;
    right: 0;
    /* height: 100%;
    overflow: hidden; */
  }
</style>