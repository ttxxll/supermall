import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'

Vue.config.productionTip = false
// new Vue()实例作为事件总线
Vue.prototype.$bus = new Vue()
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
