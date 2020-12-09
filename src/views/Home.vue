<template>
  <div>
    <el-container>
      <el-header>
        <div class="header_wrap">
          <img src="../assets/logo.png" alt="" />
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
          <el-button type="danger" @click="$router.push('/mine')"
            >个人中心</el-button
          >
          <el-button
            type="info"
            @click="logout"
            circle
            icon="el-icon-close"
          ></el-button>
        </div>
      </el-header>
      <el-main>
        <!-- 导航栏 -->
        <el-menu :default-active="activeIndex" mode="horizontal" router>
          <el-menu-item
            v-for="(item, index) in indexList"
            :key="index"
            :index="item.index"
            @click="saveNavPath(item.index)"
            >{{ item.title }}</el-menu-item
          >
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
      // 保存导航栏相应的跳转路径
      indexList: [
        { title: "首页", index: "/main" },
        { title: "分类", index: "/category" },
        { title: "商品管理", index: "/goods" },
        { title: "1234", index: "/m123" },
      ],
    };
  },
  created() {
    this.activeIndex =
      window.sessionStorage.getItem("activePath") || this.activeIndex;
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

    // 保存当前路径
    saveNavPath(index) {
      this.activeIndex = index;
      window.sessionStorage.setItem("activePath", index);
    },

    // 退出登录
    logout() {
      window.sessionStorage.clear();
      this.$router.go(0);
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
    width: 18%;
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
