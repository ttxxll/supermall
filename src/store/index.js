import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

//1.安装插件
Vue.use(Vuex)

//2.创建Store对象
const state = {
  cartList: [],
  name: 'zhangsan',
  info: {
    age: 12
  }
}
const store = new Vuex.Store({
  state, 
  /**
   * mutations的一些原则：
   *  mutations唯一的目的就是修改state中的状态
   *  mutations中的每个方法尽可能完成的事件比较单一一点
   *  尽量把网络请求，异步操作，逻辑操作放到actions中
   */
  mutations,
  actions,
  getters
})

//3.挂载Vue实例上
export default store



