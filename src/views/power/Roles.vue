<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
      <el-card>
          <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
            <el-table
            :data="roleList"
            border
            style="width: 100%">
            <!-- 展开列 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row v-for="(item,index) in scope.row.children" :key="item.id" :class="['bdbottom',index===0 ? 'bdtop' : '','vcenter']">
                        <!-- 渲染一级权限 -->
                        <el-col :span='5'>
                            <el-tag closable @close='removeRightById(scope.row,item.id)'>{{item.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二级三级权限 -->
                        <el-col :span='19'>
                            <!-- 通过for循环嵌套渲染二级权限 -->
                            <el-row v-for="(item2,index) in item.children" :key='item2.id' :class="[index===0 ? '' : 'bdtop','vcenter']">
                                <el-col :span="6">
                                    <el-tag type="success" closable @close='removeRightById(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18" >
                                    <el-tag type="warning" closable v-for="(item3,index) in item2.children" :key='item3.id' @close='removeRightById(scope.row,item3.id)'>{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
            prop="roleName"
            label="角色名称">
            </el-table-column>
            <el-table-column
            prop="roleDesc"
            label="角色描述">
            </el-table-column>
            <el-table-column
            label="操作">
                <template slot-scope="scope">
                    <!-- 修改按钮 -->
                    <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="showEditRole(scope.row.id)"
                    >编辑</el-button>
                    <!-- 删除按钮 -->
                    <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="removeRoleById(scope.row.id)"
                    >删除</el-button>
                    <!-- 分配权限按钮 -->
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
                    >分配权限</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
      </el-card>
      <!-- 添加角色对象对话框 -->
      <el-dialog title="添加角色" :visible.sync="addRolesDialogVisible" width="30%">
        <el-form :model="roleForm" :rules="roleRules" ref="roleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addRolesDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
          <!-- 修改角色对话框 -->
      <el-dialog title="修改角色" :visible.sync="editRolesDialogVisible" width="30%">
        <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editRolesDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
            roleList:[],
            addRolesDialogVisible:false,
            editRolesDialogVisible:false,
            //获取角色列表
            roleForm:{
                roleName:'',
                roleDesc:''
            },
            //修改角色表单数据
            editForm:{},
            roleRules:{
                roleName:[
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                ]
            },
            editRules:{
                roleName:[
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                ]
            }
        }
    },
    created(){
      this.getRolesList()
    },
    methods:{
            //获取角色列表
        async getRolesList(){
            const {data : res} = await this.$http.get('roles')
            if(res.meta.status !== 200){
                return this.$message.error('获取角色列表失败')
            }
            this.roleList = res.data
            },
            //添加新角色
        async addRoles(){
                const {data : res} = await this.$http.post('roles',this.roleForm)
                //console.log(res);
                if(res.meta.status !== 201){
                    return this.$message.error('添加角色失败')
                }
                this.$message.success('添加角色成功')
                this.getRolesList()
                this.addRolesDialogVisible = false
            },
        async showEditRole(id){
            const {data : res} = await this.$http.get('roles/'+id)
            if(res.meta.status !== 200){
                return this.$message.error('请求数据失败')
            }
            this.editForm = res.data
            this.editRolesDialogVisible = true
            console.log(this.editForm);
        },
        async editRoles(){
            this.$refs.editFormRef.validate(async (vaild)=>{
                if(!vaild) return
                //发起用户信息修改的请求
                const{data : res} = await this.$http.put('roles/'+this.editForm.roleId,{roleName:this.editForm.roleName,roleDesc:this.editForm.roleDesc})
                console.log(res);
                if(res.meta.status !==200) return this.$message.error(res.meta.msg)
                //关闭对话框
                this.editRolesDialogVisible = false
                //刷新数据列表
                this.getRolesList()
                //提示修改成功
                this.$message.success('角色修改成功！')
            })
        },
        async removeRoleById(id){
          const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).catch(err => err)

          if(confirmResult==='confirm'){
              const { data : res} = await this.$http.delete('roles/'+id)
              if(res.meta.status !== 200) return this.$message.error('删除数据失败')
              this.getRolesList()
              this.$message.success(res.meta.msg)
          }else{
              return this.$message.info('取消删除操作')
          }
        },
        //根据Id删除对应的权限
        async removeRightById(role,rightId){
          //弹框提示是否确认删除
          const confirmResult = await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err=>err)
          if(confirmResult !== 'confirm'){
            return this.$message.info('取消了删除')
          }
          //console.log(roleId,rightId);
          const {data : res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          if(res.meta.status !== 200){
            return this.$message.error('删除权限失败')
          }
          //给角色权限重新赋值，避免了重新渲染页面
          role.children = res.data
          this.$message.success(res.meta.msg)
        }
    }
}
</script>

<style  scoped>
.vcenter{
  display: flex;
  align-items: center;
}
</style>
