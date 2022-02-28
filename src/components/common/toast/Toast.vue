<template>
  <div class="toast" v-show="isShow">
    <div>{{message}}</div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    // message:String,
    // isShow: {
    //   type: Boolean,
    //   default () {
    //     return false
    //   }
    // }
  },
  data () {
    return {
      message: '',
      isShow: false
    }
  },
  methods: {
    show(message, duration=1000) {
    //   duration = duration || 2000
      this.isShow = true;
      this.message = message;
      
      setTimeout(() => {
        this.isShow =false
        this.message = ''
      },duration)
    }
  }
}
</script>

<style>
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 10px;
    z-index: 99;
    color: #fff;
    background: rgba(0, 0, 0, .75);
  }
</style>