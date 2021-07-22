<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-table
            :data="rightsList"
            border
            style="width: 100%"
            stripe>
            <el-table-column
            type="index"
            label="#">
            </el-table-column>
            <el-table-column
            prop="authName"
            label="权限名称">
            </el-table-column>
            <el-table-column
            prop="path"
            label="路径">
            </el-table-column>
            <el-table-column
            prop="level"
            label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if='scope.row.level==0'>一级</el-tag>
                <el-tag v-else-if='scope.row.level==1' type="success">二级</el-tag>
                <el-tag v-else type="warning">三级</el-tag>
            </template>
            </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return {
            //所有的权限列表
            rightsList:[],
            tagType:{
                '0':'一级',
                '1':'二级',
                '2':'三级',
            }
        }
    },
    created(){
        this.getRightsList()
    },
    methods:{
       async getRightsList(){
        const {data : res}  = await this.$http.get('rights/list')
        if(res.meta.status !==200 ){
            return this.$message.error('获取权限列表失败')
        }
        this.rightsList = res.data
        }
    }
}
</script>

<style scoped>


</style>