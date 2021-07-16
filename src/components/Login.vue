<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/image/login.gif" alt="" />
      </div>

      <!-- 登录表单区域 -->
      <div>
        <el-form
          label-width="0px"
          ref="loginFromRef"
          class="login_form"
          :model="loginForm"
          :rules="loginFormRules"
        >
          <!-- 用户名 -->

          <el-form-item prop="username">
            <el-input
              prefix-icon="el-icon-user"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>

          <!-- 密码 -->

          <el-form-item prop="password">
            <el-input
              prefix-icon="el-icon-lock"
              v-model="loginForm.password"
              type="password"
            ></el-input>
          </el-form-item>

          <!-- 按钮 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //这是登录表单数据对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //验证规则对象
      loginFormRules: {
        //验证用户名是否合法

        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],

        //验证密码是否合法

        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    //重置登录
    resetLoginForm() {
      this.$refs.loginFromRef.resetFields()
    },
    login() {
      this.$refs.loginFromRef.validate(async (valid) => {
        if (!valid) return

        const { data: res } = await this.$http.post('login', this.loginForm)
        //解构赋值
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        //1.将登录成功之后的 token，保存在客户端的 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        //  1.1 项目中除了登录以外的其他API接口，必须在登录之后才能访问
        //  1.2 token 只应当在当前网站打开期间生效，所以将 token 保存在sessionStorage
        //2. 通过编程式导航跳转到后台主页，路由地址是 /home
        // console.log(res)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: relative;
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
