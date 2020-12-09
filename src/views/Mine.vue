<template>
  <div>
    <el-form
      :model="vipUserForm"
      :rules="vipUserFormrules"
      ref="vipUserFormRef"
      label-width="100px"
    >
      <el-form-item label="用户名">
        <el-input v-model="vipUserForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="vipUserForm.sex" clearable @change="refresh">
          <el-option label="男" :value="0">男</el-option>
          <el-option label="女" :value="1">女</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户头像">
        <el-upload
          class="avatar-uploader"
          action="http://auction.redarm.cn/api/front/VipUser/avatar"
          :limit="1"
          accept=".jpg,.png"
          :on-success="handleAvatarSuccess"
        >
          <img
            v-if="vipUserForm.avatarUrl"
            :src="vipUserForm.avatarUrl"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="vipUserForm.nickname" @input="refresh"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="vipUserForm.phone"
          onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
          maxlength="11"
          @input="refresh"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="vipUserForm.email" @input="refresh"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="vipUserForm.address" @input="refresh"></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="vipUserForm.birthday"
          align="right"
          type="date"
          placeholder="选择日期"
          clearable
          @blur="refresh"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" round @click="updateVipUser"
          >修改信息</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 保存用户信息表单数据
      vipUserForm: {
        username: "",
        sex: "",
        avatarUrl: "",
        nickname: "",
        phone: "",
        email: "",
        address: "",
        birthday: "",
      },
      // 保存表单验证规则
      vipUserFormrules: {
        sex: [
          { required: true, message: "请选择要修改的性别", trigger: "blur" },
        ],
        nickname: [
          { required: true, message: "请输入修改后的昵称", trigger: "blur" },
          {
            min: 5,
            max: 50,
            message: "用户昵称在5 - 50字符之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
        address: [
          {
            required: true,
            message: "请输入修改后的收件地址",
            trigger: "blur",
          },
        ],
        birthday: [
          {
            required: true,
            message: "请选择修改后的生日日期",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getVipInfo();
  },
  methods: {
    // 获取当前用户信息
    async getVipInfo() {
      let id = window.sessionStorage.getItem("vipId");
      const { data: res } = await this.$http.request({
        url: "front/VipUser/showVipUserInfo",
        method: "post",
        data: {
          id,
        },
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.vipUserForm = {};
      this.vipUserForm.username = res.data.username;
      this.vipUserForm.sex = res.data.sex;
      this.vipUserForm.avatarUrl = res.data.avatarUrl;
      this.vipUserForm.nickname = res.data.nickname;
      this.vipUserForm.email = res.data.email;
      this.vipUserForm.address = res.data.address;
      this.vipUserForm.phone = res.data.phone;
      this.vipUserForm.birthday = res.data.birthday;
    },

    // 使用该方法手动强制刷新
    refresh() {
      this.$forceUpdate();
    },

    handleAvatarSuccess(file) {
      this.vipUserForm.avatarUrl = file.data.avatarUrl;
      // 强制刷新
      this.refresh();
    },

    // 修改会员信息
    updateVipUser() {
      this.$refs.vipUserFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.request({
            url: "front/VipUser/upDateVipUser",
            method: "post",
            data: this.vipUserForm,
          });
          if (res.code !== 200) {
            return this.$message.error(res.message);
          }
          this.$message.success("修改用户信息成功");
          this.getVipInfo();
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-form {
  box-shadow: 0 0 2px #000;
  border-radius: 25px;
  padding: 35px;
  width: 40%;
  margin: 15px auto;

  .el-select {
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

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }

  .el-button {
    width: 60%;
    margin: 0 15%;
  }
}
</style>
