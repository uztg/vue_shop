import Vue from 'vue'
import Router from 'vue-router'

const Login = ()=>import('@/components/Login')
const Home = ()=>import('@/views/Home')
const Welcome = ()=>import('@/components/Welcome')
const Users = ()=>import('@/views/user/Users')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'',
      redirect:'/login'
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/home',
      component:Home,
      redirect:'/welcome',
      children:[{
        path:'/welcome',
        component:Welcome
      },
    {
      path:'/users',
      component:Users
    }]
    }
  ]
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
//to: Route: 即将要进入的目标 路由对象

//from: Route: 当前导航正要离开的路由

//next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数 表示放行
    //  next() 直接放行  next('/login') 强制放行、
  if(to.path ==='/login')  return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()

})
export default router