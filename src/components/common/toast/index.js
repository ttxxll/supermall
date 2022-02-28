//自定义一个toast插件
import Vue from 'vue';
import Toast from './Toast'

const obj = {}

obj.install = function() {
  console.log('执行了obj的install方法');

  /**
   * 注意：这样拿不到Toast.$el，因为此时Toast还没有挂载
   */
  // document.body.appendChild(Toast.$el)
  // Vue.prototype.$toast = Toast;

  //换一种方式
  //1.创建组件构造器对象
  const toastConstructor = Vue.extend(Toast);
  //2.new一个新的Toast组件
  const toast = new toastConstructor()
  //3.将得到的组件，挂载到一个新的div上
  toast.$mount(document.createElement('div'))
  //4.toast.$el就是对应的div：这个时候就挂载到dom上了
  document.body.appendChild(toast.$el)
  //5.加到原型上
  Vue.prototype.$toast = toast;
}

export default obj