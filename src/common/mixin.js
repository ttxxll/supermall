import {debounce} from "common/utils"
import BackTop from 'components/content/backTop/BackTop'

export const itemListnerMixin = {
  //组件，方法，变量，生命周期钩子都可以抽取成公共的混入
  components: {},
  methods: {},
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  //抽取出来的防抖函数，注意是只监听itemImageLoaded事件的防抖函数，这个事件是从GoodsItem中发出来的：放在mounted周期中
  mounted() {
    //1.图片加载完成的时间监听：进行一个防抖节流处理
    this.refresh = debounce(this.$refs.scroll.refresh)
    //2.保存监听函数
    this.itemImgListener = () => {
      console.log("混入mixin");
      this.refresh()
    }
    //监听gooditem中图片加载完成：默认是没有$bus，需要我们在原型中加一个
    this.$bus.$on('itemImageLoaded', this.itemImgListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },

  data() {
    return {
      isShowBackTop: false
    }
  },

  methods: {
    //回到顶部事件
    backClick() {
      this.$refs.scroll.scroll.scrollTo(0,0,500);
    }
  }
}