<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表区域-->
      <el-table :data="roleList" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <div slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop':'bdbottom' , 'vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
            <!--渲染一级权限-->
            <el-col :span="5">
              <el-tag>{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!--渲染二三级权限-->
            <el-col :span="19">
              <el-row :class="[i2 === 0 ? '':'bdtop' ,'vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                <!--二级权限-->
                <el-col :span="6">
                  <el-tag type="success">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i></el-col>
                <!--三级权限-->
                <el-col :span="18">
                  <el-tag
                    type="warning"
                    v-for="item3 in item2.children"
                    @close="removeRightById(scope.row, item3.id)"
                    closable
                    :key="item3.id">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
           </el-row>
          </div>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <div slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" @click="showSetRightDialog(scope.row)" icon="el-icon-setting">分配权限</el-button>
          </div>
        </el-table-column>
      </el-table>
    </el-card>
    <!--分配权限对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
      >
      <!--树形控件-->
      <el-tree :data="rightsList"
               show-checkbox
               :props="treeProps"
               default-expand-all
               :default-checked-keys="defKeys"
               ref="treeRef"
               node-key="id"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      roleList: [],
      // 控制分配权限对话框
      setRightDialogVisible: false,
      // 所有权限的列表
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点ID值数组
      defKeys: [],
      // 当前分配权限角色id
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色的列表
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.roleList = res.data
      console.log(this.roleList)
    },
    // 删除角色权限
    removeRightById (role, rightId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async (res) => {
        console.log(res)
        if (res === 'confirm') {
          const { data: result } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          console.log(result)
          if (result.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            role.children = result.data
          } else {
            this.$message({
              type: 'error',
              message: '删除权限失败!'
            })
          }
        }
      }).catch((err) => {
        console.log(err)
        if (err === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },
    // 分配角色权限
    async showSetRightDialog (role) {
      console.log(role)
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('权限获取失败！')
      }
      this.rightsList = res.data
      // 递归获取三级节点Id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 递归获取角色下所有三级权限ID，并保存到defkeys中
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听对话框关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 分配权限上传
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
  .bdtop{
    border-top: 1px solid #eee;
  }
  .bdbottom{
    border-bottom:1px solid #eee ;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
