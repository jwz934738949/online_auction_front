<template>
  <div class="login_wrap">
    <div class="login_blur"></div>
    <div class="login_main">
      <div class="login_title">LOGIN</div>
      <el-form
        :model="loginVipForm"
        :rules="loginVipRules"
        ref="loginVipRef"
        label-width="100px"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginVipForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginVipForm.password"
            show-password
            placeholder="请输入密码"
            @keyup.enter.native="loginVip()"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginVip">登录</el-button>
          <el-button type="success" @click="toRegisterPage">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginVipForm: {
        username: "",
        password: "",
      },
      loginVipRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 15,
            message: "长度在 5 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 登录普通用户
    loginVip() {
      this.$refs.loginVipRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.request({
            url: "front/VipUser/login",
            method: "post",
            data: this.loginVipForm,
          });
          if (res.code !== 200) {
            return this.$message.error(res.message);
          }
          this.$message.success("登录成功");
          let token = "Bearer" + res.data.auth;
          window.sessionStorage.setItem("token", token);
          let { avatarUrl, id } = res.data.user;
          window.sessionStorage.setItem("vipId", id);
          window.sessionStorage.setItem("avatarUrl", avatarUrl);
          this.$router.push("/home");
        }
      });
    },

    // 前往注册页面
    toRegisterPage() {
      return this.$router.push("/register");
    },
  },
};
</script>

<style lang="less" scoped>
.login_wrap {
  width: 100%;
  height: 100vh;
  position: relative;

  .login_blur {
    z-index: -1;
    height: 100%;
    width: 100%;
    position: absolute;
    background: url("../assets/background.png") no-repeat center center;
    background-size: cover;
    filter: blur(5px);
  }

  .login_main {
    background-color: #fff;
    width: 30%;
    height: 40%;
    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 50px;
    border-radius: 10px;
    box-shadow: 0 0 5px #ccc;
    opacity: 0.8;
    text-align: center;

    .login_title {
      margin: 10px;
      font-size: 35px;
      font-family: "Courier New", Courier, monospace;
      font-weight: bold;
    }

    .el-form {
      margin-left: -15%;

      .el-button {
        display: inline-block;
        width: 100%;
        margin: 10px 0;
      }
    }
  }
}
</style>
