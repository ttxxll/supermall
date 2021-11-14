<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']" 
                  @tabClick="tabClick" 
                  ref="tabControl1"
                  class="tab-control" v-show="isTabFixed"/>
    <!-- :probe-type="3"：不加冒号，传的值都是字符串；穿了值，把冒号里的当作变量传递 -->
    <!-- @scroll="contetnScroll"：监听子组件发出的事件scroll -->
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contetnScroll" 
            :pull-up-load="true" 
            @pullingUp="loadMore">
      <!-- 使用子组件时：通过绑定传递父组件属性给子组件 -->
      <home-swiper :propsbanners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :propsRecommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']" 
                    @tabClick="tabClick" 
                    ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <!-- 监听组件的原生事件：必须加上.native修饰符；v-show：当到达下滑临界值时才显示该图标 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!-- <ul>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
      <li>列表</li>
    </ul> -->
  </div>
</template>

<script>
import HomeSwiper from './childComponents/HomeSwiper'
import RecommendView from './childComponents/RecommendView.vue'
import FeatureView from './childComponents/FeatureView.vue'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import { getHomeMultiData, getHomeGoods } from 'network/home'
import {debounce} from "common/utils"
import {itemListnerMixin} from "common/mixin"

export default {
  name: 'Home',
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      currentType: 'pop',
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  //1.在组件一创建好（生命周期的created时），就要发送请求，请求数据：只调用，具体的逻辑放到methods中
  created() {
    console.log('created');
    //1.请求首页数据
    this.getHomeMultiData();

    //此时打印出的banner可能是空，因为getHomeMultiData是一个异步请求，很可能网络请求没完成，就打印了
    //console.log(this.banner);

    //2.请求商品数据
    this.getHomeGoods('pop');
    this.getHomeGoods('new');
    this.getHomeGoods('sell');
  },
  //混入：防抖函数
  mixins: [itemListnerMixin],
  //每次路由到其他组件时：该组件就会被销毁掉：怎么不让它随便销毁呢？用<keep-alive>包住<router-view/>
  destroyed() {
    console.log('destroyed');
  },
  //有缓存时keep-alive，才有这两个生命周期：activated，deactivated
  //激活这个组件
  activated() {
    console.log('activated');
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh();
  },
  //离开这个组件
  deactivated() {
    console.log('deactivated');
    //1.保存Y值，用于回到上一次离开的位置
    this.saveY = this.$refs.scroll.getScrollY();
    //2.取消监听事件：离开这个组件时，GoodsItem组件还会发这个事件，但是不需要监听再GoodsItem组件发出的这个事件了
    this.$bus.$off('itemImageLoaded', this.itemImgListener)
  },
  //1.组件都挂载到DOM上了：但是图片还没有全部加载完
  mounted() {
    // console.log('mounted');
    // //1.图片加载完成的时间监听：进行一个防抖节流处理
    // const refresh = debounce(this.$refs.scroll.refresh)
    // //2.保存监听函数
    // this.itemImgListener = () => {
    //   //在用refresh时，要保证mounted中初始化的scroll能够先实例化出来：
    //   //如果没有实例化出scroll对象的话，这里就会报错：所以将其放到mounted中。
    //   //this.$refs.scroll.refresh()：这样每次加载一个图片都会调用一下refresh()
    //   console.log('refresh=======');
    //   refresh()
    // }
    // //监听gooditem中图片加载完成：默认是没有$bus，需要我们在原型中加一个
    // this.$bus.$on('itemImageLoaded', this.itemImgListener)

    //2.获取tabControl的offsetTop：组件都挂载到DOM上了：但是图片还没有全部加载完，所以拿到的offsetTop不准确
    //所有的自定义组件都有一个属性$el：拿到组件上的根标签元素，用于获取其中的模板中的元素，
    //console.log(this.$refs.tabControl.$el.offsetTop);
  },
  methods: {
    /**
     * 网络请求相关的方法
     */
    getHomeMultiData() {
      //这个是导入的getHomeMultiData
      getHomeMultiData().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type) {
      //没有page=0的数据，数据从1开始
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        //push函数是可变参数；...arr将arr数组解构，放到可变参数位置。
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1; 
        
        this.$refs.scroll.finishPullUp();
      })
    },

    /**
     * 事件监听相关的方法
     */
    tabClick(index){
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break;
        case 2:
          this.currentType = 'sell'
          break;
      }

      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    //回到顶部事件
    backClick() {
      this.$refs.scroll.scroll.scrollTo(0,0,500);
      console.log(this.$refs.scroll.message);
    },

    //scroll子组件emit出来的scroll事件
    contetnScroll(position) {
      //1.是否隐藏回到顶部的小图标
      this.isShowBackTop = -position.y > 1000
      //2.决定tabControle是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },

    //scroll子组件emit出来的pullingUp事件
    loadMore() {
      this.getHomeGoods(this.currentType);
    },

    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    }
  }
}
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    /* position: relative; */
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }

  /* 因为有scoped属性，所以该样式只会当前组件中的.content起作用 */
  /* .content {
    scroll占据视图的100% - tabbar49px -  tab-control44px
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */
  .content {
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /* .fixed {
    position: fixed;
    left: 0;
    right: 0;
    top: 44px;
  } */
  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>