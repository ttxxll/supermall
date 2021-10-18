<template>
  <div class="tab-bar-item" v-on:click="itemClick()">
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <!-- 为什么要一个Div包裹这个插槽：因为这个插槽会被外层组件替换掉，所以其中的v-bind:语法也会被覆盖 -->
    <div v-bind:style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
  export default {
    name: "TabBarItem",
    data() {
      return {
        // isActive: true
      }
    },
    computed: {
      isActive() {
        //路由跳转时会传递path="/home"，如果route中的path属性有传递的path参数的话，那么就返回true。这样就只会让一个组件激活active样式
        return this.$route.path.indexOf(this.path) != -1;
      },
      activeStyle() {
        return this.isActive ? {color: this.activeColor} : {}
      }
    },
    props: {
      path: String,
      activeColor: {
        type: String,
        default: 'red'
      }
    },
    methods: {
      itemClick() {
        this.$router.replace(this.path)
      }
    }
  }
</script>

<style scoped>
  .tab-bar-item {
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14;
  }

  .tab-bar-item img {
    width: 24px;
    height: 24px;
    margin-top: 3px;
    vertical-align: middle;
  }

  /* .active {
    color: red;
  } */
</style>
