<template>
  <div id="detail">
      <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
      <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
        <detail-swiper :top-images="topImages" @swiperdetailImageLoad="swiperdetailImageLoad"></detail-swiper>
        <detail-base-info :goods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo" @imgLoad="imageLoad"></detail-goods-info>
        <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
        <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
        <goods-list ref="recommend" :goods="recommend"></goods-list>
      </scroll>
      <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
      <back-top @click.native="backClick" v-show="isShowBackTop"/>   
      <!-- <toast :message="message" :show="show"/> -->
  </div>
</template>

<script>
  import DetailNavBar from '../detail/childComponents/DetailNavBar'
  import DetailSwiper from './childComponents/DetailSwiper'
  import DetailBaseInfo from './childComponents/DetailBaseInfo.vue'
  import DetailShopInfo from './childComponents/DetailShopInfo.vue'
  import DetailGoodsInfo from './childComponents/DetailGoodsInfo.vue'
  import DetailParamInfo from './childComponents/DetailParamInfo'
  import DetailCommentInfo from './childComponents/DetailCommentInfo.vue'
  import DetailBottomBar from './childComponents/DetailBottomBar.vue'

  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'
  import GoodsList from 'components/content/goods/GoodsList'

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail"
  import {debounce} from "common/utils"
  import {itemListnerMixin, backTopMixin} from "common/mixin"
  import { mapActions } from 'vuex'

  // import Toast from 'components/common/toast/Toast'

  export default {
    name: 'Detail',
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommend: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    mixins: [itemListnerMixin, backTopMixin],
    created() {
      //1.保存传递过来的商品id
      this.iid = this.$route.params.iid

      //2.根据id查询详情
      getDetail(this.iid).then(res => {
        console.log(res);
        const data = res.result;
        //1.获取轮播图
        this.topImages = data.itemInfo.topImages;
        //2.获取商品信息对象
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        //3.获取店铺信息的对象
        this.shop = new Shop(data.shopInfo);
        //4.保存商品详情数据
        this.detailInfo = data.detailInfo;
        //5.获取参数信息：注意这里的key名和视频中的相比变了，不是data.paramInfo而是data.itemParams
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);
        //6.获取评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }
        /**
         * 二.第二次获取参数的offSetTop，评论的offSetTop，推荐的offSetTop，值不对
         *  不对的原因：虽然拿到数据了，但是this.$refs.params.$el还没渲染完，渲染也是有时间的。
         */
        // this.themeTopYs = []
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // console.log(this.themeTopYs);

        /**
         * 三.第三次获取参数的offSetTop，评论的offSetTop，推荐的offSetTop，值不对
         *  再组件对应的DOM渲染好后，会调用这个方法，但是值仍然不对，因为目前拿到的offsetTop不包括图片的高度。
         *  图片还没有都加载出来，所以offsetTop值不对的时候，大概率是图片的问题。
         */
        // this.$nextTick(() => {
        //   this.themeTopYs = []
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        //   console.log(this.themeTopYs);
        // })
      }),

      //3.获取推荐数据
      getRecommend().then(res => {
        this.recommend = res.data.list;
      })

      //4.getThemeTopY防抖函数
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      }, 100)
    },
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      // Toast
    },
    methods: {
      ...mapActions(['addCart']),
      // 1.它的防抖是在DetailSwiper发出事件时就控制了：只发出一次事件
      swiperdetailImageLoad() {
        console.log('refresh');
        this.$refs.scroll.refresh();
      },
      // 2.它的防抖也在DetailGoodsInfo组件发出事件时就控制了：在所有图片都加载完时，才发出事件
      imageLoad() {
        console.log('refresh');
        this.$refs.scroll.refresh();
        //3.我们也可以不在DetailGoodsInfo组件中控制，直接用已经封装到mixin中的防抖函数：
        //this.refresh();

        /**
         * 四.第四次获取参数的offSetTop，评论的offSetTop，推荐的offSetTop
         *  在整个图片都加载完成时，再去获取offsetTop
         *  但是这里每次一个图片加载好之后，都会调用获取一次offsetTop，所以我们需要做防抖。
         *  其实我这里不会：因为DetailGoodsInfo组件在发出imageLoad事件时，已经做了防抖，此处它只会调用一次。
         */
        // this.themeTopYs = []
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // console.log(this.themeTopYs);

        //五：还是练习一下防抖
        this.getThemeTopY() 
      },
      // 3.DetailNavBar点击事件
      titleClick(index) {
        //themeTopYs[1]是参数的offSetTop，themeTopYs[2]是评论的offSetTop，themeTopYs[3]是推荐的offSetTop
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
        console.log(this.$store);
      },

      // 4.监听滚动事件
      contentScroll(position) {
        let positionY = -position.y;
        let length = this.themeTopYs.length;
        for(let i = 0; i < length; i++) {
          if(this.currentIndex !== i) {
            //因为i+1可能数组越界，所以最后一种情况单独判断
            if((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) 
            || (i === length - 1 && positionY >= this.themeTopYs[i])) {
              this.currentIndex = i;
              this.$refs.nav.currentIndex = this.currentIndex;
            }
          }
        }

        //4.2.回到顶部按钮是否显示
        this.isShowBackTop = -position.y > 1000
      },

      //5.监听添加到购物车事件
      addToCart() {
        //1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;
  
        //2.将商品添加到购物车
        //this.$store.commit('addcart', product)
        // this.$store.dispatch.addCart('addCart', product).then(res => {
        //   console.log(res)
        // })
        //运用mapActions将actions中的方法映射到当前组件的methods中
        this.addCart(product).then(res => {
          // this.show = true;
          // this.message = res;

          // setTimeout(() => {
          //   this.show = false;
          //   this.message = '';
          // }, 1000)
          console.log(this.$toast);
          this.$toast.show(res, 1500)
        })
      }
    },
    //因为Detail和Home组件中的这部分代码一样，所以为了抽取这部分，用mixin将其封装。
    mounted() {
      // //1.图片加载完成的事件监听：进行一个防抖节流处理
      // const refresh = debounce(this.$refs.scroll.refresh)
      // //2.保存监听函数
      // this.itemImgListener = () => {
      //   console.log('refresh=======');
      //   refresh()
      // }
      // //监听gooditem中图片加载完成：默认是没有$bus，需要我们在原型中加一个
      // this.$bus.$on('itemImageLoaded', this.itemImgListener)

      /**
       * 一.第一次拿themeTopYs[1]是参数的offSetTop，themeTopYs[2]是评论的offSetTop，themeTopYs[3]是推荐的offSetTop
       * 得到的是undefined：
       *  因为所有的自定义组件都有一个属性'$el'：拿到组件上的根标签元素，用于获取其中的模板中的元素。
       *  this.$refs.params.$el：拿DetailParamInfo组件中templated标签里的跟标签div，
       *  但是这个div标签在请求到数据时才会创建渲染（渲染也是有一个过程的，所以在数据都复制后再拿也可能会出现undefined）：v-if="Object.keys(paramInfo).length !== 0"
       *  所以我们在mounted中来拿offSetTop是不合理的，因为虽然组件挂载了，但是此时数据可能还没请求到，导致完整的组件还没有加载出来
       *  
       * 可以将其放到updated生命周期中：保证都渲染完成了再拿
       */
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    },
    updated() {
      // this.themeTopYs = [];
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      // console.log(this.themeTopYs);
    },
    //因为没有keep-alive，所以没有deactivated生命周期
    destoryed() {
      //1.取消监听事件：离开这个组件时，GoodsItem组件还会发这个事件，但是不需要监听再GoodsItem组件发出的这个事件了
      this.$bus.$off('itemImageLoaded', this.itemImgListener)
    }
  }
</script>

<style scoped>
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  #detail {
    position: relative;
    z-index: 1;
    background-color: #fff;
    /* 100%的视图高度 */
    height: 100vh;
  }

  /* 100%是相对于父元素的高度，所以父元素也得设置高度 */
  .content {
    height: calc(100% - 44px - 49px);
  }
</style>