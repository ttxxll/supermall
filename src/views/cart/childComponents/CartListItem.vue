<template>
  <div id="shop-item">
    <div class="item-selector">
      <!-- 组件的点击，要加上.native -->
      <check-button @click.native="checkClick" :is-check='itemInfo.checked'></check-button>
    </div>
    <div class="item-img">
      <img :src="itemInfo.image" alt="商品图片">
    </div>
    <div class="item-info">
      <div class="item-title">{{itemInfo.title}}</div>
      <div class="item-desc">{{itemInfo.desc}}</div>
      <div class="info-bottom">
        <div class="item-price left">￥{{itemInfo.price}}</div>
        <div class="item-count right">x{{itemInfo.count}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: "CartListItem",
    computed: {
      
    },
    components: {
      
    },
    props: {
      product: {
        type: Object,
        default() {
          return {}
        }
      }
    }
  }
</script>

<style scoped>
  
</style>