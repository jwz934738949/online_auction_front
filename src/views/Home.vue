<template>
  <div>
    <el-container>
      <el-header>
        <div class="header_wrap">
          <img src="../assets/Logo.png" alt="" />
          <h1>311网上竞拍系统</h1>
        </div>
        <div class="btn_group" v-if="!isLogin">
          请游客首先进行
          <el-button
            type="primary"
            size="small"
            class="login_btn"
            @click="loginVip"
            >登录</el-button
          >或者<el-button type="success" size="small" @click="registerVip"
            >注册</el-button
          >
        </div>
        <div class="isLogin_wrap" v-else>
          <el-avatar shape="square" :size="50" :src="avatarUrl"></el-avatar>
          <el-button type="danger">个人中心</el-button>
        </div>
      </el-header>
      <el-main>
        <!-- 导航栏 -->
        <el-menu :default-active="activeIndex" mode="horizontal" router>
          <el-menu-item index="/main">首页</el-menu-item>
          <el-menu-item index="/category">分类</el-menu-item>
          <el-menu-item index="/upload">物品上传</el-menu-item>
          <el-menu-item index="4">处理中心</el-menu-item>
        </el-menu>
        <!-- 页面主要内容 -->
        <el-card>
          <router-view></router-view>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "/main",
      isLogin: false,
      avatarUrl: "",
    };
  },
  created() {
    // 判断当前是否为已登录的状态
    let token = window.sessionStorage.getItem("token");
    if (token) {
      this.isLogin = true;
      this.avatarUrl = window.sessionStorage.getItem("avatarUrl");
    }
  },
  destroyed() {
    window.sessionStorage.clear();
  },
  methods: {
    // 登录按钮
    loginVip() {
      this.$router.push("/login");
    },
    // 注册按钮
    registerVip() {
      this.$router.push("/register");
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 3px;
  padding: 40px 10px;

  .header_wrap {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      height: 60px;
      width: 60px;
      border-radius: 50%;
      margin-right: 20px;
    }

    h1 {
      color: #fff;
      font-size: 30px;
    }
  }

  .isLogin_wrap {
    width: 15%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .login_btn {
    margin-right: 3px;
  }
}

.el-main {
  background-color: #e9eef3;
  height: calc(100vh - 80px);

  .el-menu {
    margin-top: 10px;
  }

  .el-card {
    margin-top: 10px;
    background-color: #fff;
  }
}
</style>
