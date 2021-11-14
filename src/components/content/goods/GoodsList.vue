<template>
  <div class="goods">
    <goods-item v-for="item in goods" :goods-item="item"/>
  </div>
</template>


<script>
  import GoodsItem from './GoodsItem.vue'

  export default {
    name: 'GoodsList',
    components: {
      GoodsItem
    },
    props: {
      goods: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .goods{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
</style>
