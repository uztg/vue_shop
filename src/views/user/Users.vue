<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              v-model="scope.row.mg_state"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close='addDialogClosed'>
      <!-- 内容主体区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close='editDialogClosed'>
      <el-form
        :model="editForm"
        ref="editFormRef"
        :rules="editFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser" >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="SetRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
      ref='setRoleDialogRef'
      >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        分配新角色：
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
      //  验证邮箱规则
      var checkEmail =(rule, value, cb)=>{
        //验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

        if(regEmail.test(value)){
          //合法的邮箱
          return cb()
        }else{
          cb(new Error('请输入合法的邮箱'))
        }
      }
      //验证手机号规则
      var checkMoile =(rule, value, cb)=>{
        const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
        if(regMobile.test(value)){
          //合法的手机号
          return cb()
        }else{
          cb(new Error('请输入合法的手机号码'))
        }
      }
    return {
      //获取用户列表的参数
      queryInfo:{
        query:'',
        //当前页数
        pagenum:1,
        //当前每页显示多少条数据
        pagesize:2
      },
      userlist:[],
      // 需要被分配角色的用户信息
      userInfo:{},
      // 角色列表
      roleList:[],
      //已选中的角色ID值
      selectedRoleId:"",
      total:0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible:false,
      //定义修改用户的对话框
      editDialogVisible:false,
      //定义分配角色的对话框
      SetRoleDialogVisible:false,
      //添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //查询到的用户信息
      editForm:{},
      //添加表单验证规则对象
      addFormRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 5,
            max: 16,
            message: '长度在 5 到 16 个字符',
            trigger: 'blur',
          }
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {validator:checkMoile,trigger:'blur'}
        ]
      },
      editFormRules:{
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {validator:checkMoile,trigger:'blur'}
        ]
      }
    }
  },
  created(){
    this.getUserList()
  },
  methods:{
  async getUserList(){
    const {data : res} = await this.$http.get('users',{params:this.queryInfo})
    if(res.meta.status !== 200) return this.$message.error(res.msg);
    console.log(res)
    this.total = res.data.total
    this.userlist = res.data.users
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    //监听用户状态改变
    async userStateChanged(userinfo){
      //console.log(userinfo)
      const {data : res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if(res.meta.status !==200) {
        //因为前端已经更新掉了，但是后台更新失败 所以要重新将前台的改回来
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error("更新用户状态失败")}
      this.$message.success(`更新用户状态成功！`)
    },
    //监听用户对话框关闭事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮，添加新用户
    addUser(){
      this.$refs.addFormRef.validate(async (vaild)=>{
        //vaild 是一个布尔值
        if(!vaild) return
        //可以发送真正的网路请求
        const{data : res} = await this.$http.post('users',this.addForm)
        if(res.meta.status !==201) return this.$message.error("添加用户失败")
        this.$message.success(res.meta.msg)
        //隐藏添加用户对话框
        this.addDialogVisible = false
        //重新获取用户列表
        this.getUserList()
      })
    },
    //修改用户信息
    async showEditDialog(id){
      const {data : res} = await this.$http.get('users/'+id)
      if(res.meta.status !== 200){
         return this.$message.error('请求数据失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
      //console.log(this.editForm);
    },
    editUser(){
      this.$refs.editFormRef.validate(async (vaild)=>{
        if(!vaild) return
        //发起用户信息修改的请求
        const{data : res} = await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
        if(res.meta.status !==200) return this.$message.error('更新用户信息失败')
        //关闭对话框
        this.editDialogVisible = false
        //刷新数据列表
        this.getUserList()
        //提示修改成功
        this.$message.success('用户修改成功！')
      })
    },
    //监听修改用户表单关闭事件
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    async removeUserById(id){
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)
          //如果用户点击确认，则返回字符串 comfirm
          //如果用户点击取消，则返回字符串 cancel
      if(confirmResult==='confirm'){
        const { data : res} = await this.$http.delete('users/'+id)
        if(res.meta.status !== 200) return this.$message.error('删除数据失败')
        this.getUserList()
        this.$message.success(res.meta.msg)
      }else{
        return this.$message.info('取消删除操作')
      }
    },
    //展示分配角色的对话框
    async setRole(userInfo){

      this.userInfo = userInfo
      //获取角色列表
      const {data : res} = await this.$http.get('roles')
      if(res.meta.status !== 200){
          return this.$message.error('获取角色列表失败')
      }

      this.roleList = res.data
      //console.log(this.roleList);
      this.SetRoleDialogVisible = true

    },
    // 点击按钮，分配新角色
    async saveRoleInfo(){
      // 先判断先是否已经被分配角色
      if(!this.selectedRoleId){
        return this.$message.error('请选择要分配的角色！')
      }

      const { data : res } = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
      if(res.meta.status !== 200){
          return this.$message.error('更新角色失败')
      }
      this.$message.success(res.meta.msg)
      this.getUserList()
      this.SetRoleDialogVisible = false
    },
    // 监听 更新角色对话框的关闭事件
    setRoleDialogClosed(){
      this.selectedRoleId = []
      this.userInfo = {}
    }
  }
}
</script>

<style scoped>
</style>
