import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'
import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false
//会执行toast中的install方法，而且会将Vue实例传过去
Vue.use(toast)
// new Vue()实例作为事件总线
Vue.prototype.$bus = new Vue()
//解决移动端点击事件的300ms延迟
FastClick.attach(document.body)
//使用图片的懒加载：指定占位图片placeholder.png（当还没加载好时，显示的图片）
Vue.use(VueLazyLoad, {
  loading: require('./assets/img/common/placeholder.png')
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
