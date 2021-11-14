<template>
  <swiper class="detail-swiper">
    <swiper-item v-for="item in topImages" class="swiper-item">
      <img :src="item" alt="" @load="detailImageLoad">
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'

  export default {
    name: "DetailSwiper",
    data() {
      return {
        isLoad: false
      }
    },
    props: {
      topImages: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      Swiper, 
      SwiperItem
    },
    methods: {
      detailImageLoad() {
        if(!this.isLoad) {
          // 轮播图只需要加载出来一张图片就确定了高度，所以只需要发送一次事件
          this.$emit('swiperdetailImageLoad')
          this.isLoad = true
        }
      }
    }
  }
</script>

<style scoped>
  .detail-swiper {
    height: 300px;
    overflow: hidden;
  }
</style>
