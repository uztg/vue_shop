<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="@/assets/image/logo.jpg" alt="" />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '56px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router = "true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu  v-for="item in menulist" :key="item.id" :index="item.id+''">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.path+''" @click="saveNavState(subItem.path)">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧布局 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
      return {
          menulist:[],
          iconsObj:{
              '125':'iconfont icon-user',
              '103':'iconfont icon-tijikongjian',
              '101':'iconfont icon-shangpin',
              '102':'iconfont icon-danju',
              '145':'iconfont icon-baobiao',
          },
          //是否折叠
          isCollapse:false,
          activePath:''
      }
    },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //点击按钮切换侧栏折叠与展开
    toggleCollapse(){
        this.isCollapse = !this.isCollapse
    },
    async getMenuList(){
     const {data:res} = await this.$http.get('menus')
     if(res.meta.status!==200) return this.$message.error(res.meta.msg)
     this.menulist = res.data 
     console.log(res.data)
    },
    //保存链接的激活状态
    saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath
    }
  },
}
</script>

<style scoped>
.home-container {
  height: 100vh;
}
.el-header {
  background-color: #373d41;
  display: flex;
  padding-left: 0;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-button {
  margin-left: auto;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  margin-left: 15px;
}

.el-header div img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont{
    margin-right: 10px;
}
.el-aside .el-menu{
    border: none;
}
.toggle-button{
    background-color: #4A5064;
    color: #fff;
    text-align: center;
    font-size: 10px;
    line-height: 24px;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>