<template>
  <div class="register_wrap">
    <div class="register_blur"></div>
    <div class="register_main">
      <div class="register_title">REGISTER</div>
      <el-form
        :model="registerVipForm"
        :rules="registerVipRules"
        ref="registerVipRef"
        label-width="100px"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerVipForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerVipForm.password"
            show-password
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="sex">
          <el-select
            v-model="registerVipForm.sex"
            clearable
            placeholder="请选择性别"
          >
            <el-option label="男" value="0"></el-option>
            <el-option label="女" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="registerVipForm.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            v-model="registerVipForm.phone"
            placeholder="请输入手机号码"
            onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item prop="birthday">
          <el-date-picker
            v-model="registerVipForm.birthday"
            type="date"
            placeholder="选择生日"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="address">
          <el-input
            v-model="registerVipForm.address"
            placeholder="请输入收货地址"
          ></el-input>
        </el-form-item>
        <el-form-item prop="nickname">
          <el-input
            v-model="registerVipForm.nickname"
            placeholder="请输入昵称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="avatar-uploader"
            action="http://auction.redarm.cn/api/front/VipUser/avatar"
            :limit="1"
            accept=".jpg,.png"
            :on-success="handleAvatarSuccess"
          >
            <img
              v-if="registerVipForm.avatarUrl"
              :src="registerVipForm.avatarUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="registerVip">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registerVipForm: {
        username: "",
        password: "",
        sex: "",
        email: "",
        address: "",
        phone: "",
        nickname: "",
        birthday: "",
        avatarUrl: "",
      },
      registerVipRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
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
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        birthday: [{ required: true, message: "请选择生日", trigger: "blur" }],
        address: [
          { required: true, message: "请输入收货地址", trigger: "blur" },
        ],
        nickname: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 图片上传成功
    handleAvatarSuccess(file) {
      this.registerVipForm.avatarUrl = file.data.avatarUrl
    },

    // 注册普通用户
    registerVip() {
      this.$refs.registerVipRef.validate(async valid => {
        if (valid) {
          const {data: res} = await this.$http.request({
            url: 'front/VipUser/register',
            method: 'post',
            data: this.registerVipForm
          })
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.$message.success("注册用户成功")
          this.$router.push('/login')
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
.register_wrap {
  width: 100%;
  height: 100vh;
  position: relative;

  .register_blur {
    z-index: -1;
    height: 100%;
    width: 100%;
    position: fixed;
    background: url("../assets/background.png") no-repeat center center;
    background-size: cover;
    background-attachment: fixed;
    filter: blur(5px);
  }

  .register_main {
    background-color: #fff;
    box-sizing: border-box;
    overflow: auto;
    width: 50%;
    height: 80%;
    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 35px;
    border-radius: 10px;
    box-shadow: 0 0 5px #ccc;
    opacity: 0.8;
    text-align: center;

    .register_title {
      margin: 10px;
      font-size: 35px;
      font-family: "Courier New", Courier, monospace;
      font-weight: bold;
    }

    .el-form {
      margin-left: -15%;

      .el-select {
        width: 100%;
      }

      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 100%;
      }

      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }

      .el-button {
        display: inline-block;
        width: 100%;
        margin: 10px 0;
      }
    }
  }
}
</style>
