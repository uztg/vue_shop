import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import '@/assets/css/global.css'
Vue.config.productionTip = false
import '@/assets/fonts/iconfont.css'
//引入图标样式
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
      // 在发送请求之前做些什么
      config.headers.Authorization = window.sessionStorage.getItem('token')
      console.log(config)
      return config;
  },
  function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
  }
);
Vue.prototype.$http = axios;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
