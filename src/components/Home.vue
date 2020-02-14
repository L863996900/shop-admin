<template>
  <el-container class="home-container">
    <!--头部-->
    <el-header>
      <div>
        <img class="logo" src="../assets/timg.jpg" alt="">
        <span>EC电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapsed ? '64px':'200px'" >
        <!--折叠栏-->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--侧边栏菜单区域-->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            :unique-opened="true"
            :collapse="isCollapsed"
            :collapse-transition="false"
            router
            :default-active="activePath"
            active-text-color="#409EFF">
            <!--一级菜单区域-->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <!--一级菜单模板区域-->
              <template slot="title">
                <!--图标-->
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!--二级菜单区域-->
              <el-menu-item
                :index="'/'+subItem.path"
                @click="saveName('/'+subItem.path)"
                v-for="subItem in item.children"
                :key="subItem.id" >
                <!--二级菜单模板区域-->
                <template >
                  <!--图标-->
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
      </el-aside>
      <!--右侧主体-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // 获取左侧菜单数据
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 默认不折叠菜单
      isCollapsed: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  methods: {
    // 退出按钮
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单数据
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      // const res = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 点击按钮 折叠展开菜单
    toggleCollapse () {
      this.isCollapsed = !this.isCollapsed
    },
    saveName (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
 .el-header{
   background-color: #373d41;
   display: flex;
   justify-content: space-between;
   align-items: center;
   color: #fff;
   font-size: 20px;
   > div {
     display: flex;
     align-items: center;
     > span {
       padding-left: 15px;
     }
   }
 }
 .logo{
   width: 40px;
   height: 40px;
   border-radius: 50%;
   border: 2px solid #373d41;
 }
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right:none ;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2rem;
    cursor:pointer;
  }
</style>
