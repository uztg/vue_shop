import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'
//导入弹框提示
Vue.use(Button)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Form)
Vue.prototype.$message = Message//这个比较特殊，要挂载。