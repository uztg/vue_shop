import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import '@/assets/css/global.css'
Vue.config.productionTip = false

axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'

Vue.prototype.$http = axios;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
