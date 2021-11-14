<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'

	export default {
		name: "Scroll",
    data() {
      return {
        scroll: null,
        message: 'Scroll....',
      }
    },
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      //参数3：time如果没传就用默认值300ms
      //&&连接：如果this.scroll是null，就不会往后面走了
      scrollTo(x, y, time=300) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },

      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },

      refresh() {
        //&&连接：如果this.scroll是null，就不会往后面走了
        console.log('---');
        this.scroll && this.scroll.refresh();
      },

      getScrollY() {
        return this.scroll ? this.scroll.y : 0;
      }
    },
    mounted() {
      /**
       * this.scroll = new BScroll(document.querySelector('.wrapper'), {})
       * 注意：这样拿wrapper不好，因为document.querySelector('.wrapper')拿的时第一个wrapper，
       * 但是Vue包着Home包着Scroll，如果Vue或者Home中也有wrapper，那么拿到的就不是当前Scroll中的wrapper了。
       * 
       * 明确的拿一个标签：通过ref属性
       *  ref如果绑定在组件中的，那么通过this.$refs.refname获取到的是一个组件对象
       *  ref如果绑定在普通元素中，那么通过this.$refs.refname获取到的时一个元素对象。
       */
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })

      //2.监听滚动的位置
      if(this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
          // 因为每个组件有自己的监听逻辑，到底要干嘛：所以在子组件中将事件发出去，让父组件自己处理
          this.$emit('scroll', position);
        })
      }

      //3.监听上拉加载事件
      if(this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          // 因为每个组件有自己的监听逻辑，到底要干嘛：所以在子组件中将事件发出去，让父组件自己处理
          this.$emit('pullingUp')
        })
      }
    }
	}
</script>

<style scoped>

</style>
