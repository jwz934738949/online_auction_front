<template>
  <div>
    <!-- <el-cascader
      v-model="value"
      :options="options"
      :props="{ expandTrigger: 'hover' }"
    ></el-cascader> -->
    <!-- 显示上传物品按钮 -->
    <el-row type="flex" justify="center" align="center">
      <el-col :span="4">
        <el-button
          type="text"
          icon="el-icon-circle-plus"
          @click="insertGoodsDialogVisible = true"
          >物品上传</el-button
        >
        <!-- 物品上传对话框 -->
        <el-dialog
          title="物品上传"
          :visible.sync="insertGoodsDialogVisible"
          width="45%"
        >
          <el-form
            :model="goodsForm"
            :rules="goodsRules"
            ref="goodsFormRef"
            label-width="100px"
          >
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="goodsForm.goodsname"></el-input> </el-form-item
          ></el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="insertGoodsDialogVisible = false"
              >取 消</el-button
            >
            <el-button type="primary">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
    <!-- 显示查询表单 -->
    <el-row type="flex" justify="space-around" align="center" :gutter="24">
      <el-col>
        <el-input
          v-model="goodsForm.goodsName"
          placeholder="请输入商品名称"
        ></el-input>
      </el-col>
      <el-col>
        <el-input v-model="goodsForm.goodsName"></el-input>
      </el-col>
      <el-col>
        <el-button icon="el-icon-search"></el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 级联选择器选中的值
      value: [],
      // 显示级联选择器的内容
      options: [],
      // 保存商品表单数据
      goodsForm: {
        goodsName: "",
      },
      // 商品验证规则
      goodsRules: {
        goodsName: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
      },
      // 显示物品上传对话框的显示与隐藏
      insertGoodsDialogVisible: false,
    };
  },
  created() {
    this.getCategoryType();
  },
  methods: {
    // 获取分类类别数据
    async getCategoryType() {
      const { data: res } = await this.$http.request({
        url: "back/goods_type/showGoodsType",
        method: "post",
      });
      if (res.code !== 200) {
        return;
      }
      this.options = [];
      res.data.forEach(async (item) => {
        let obj = {};
        obj.label = item.name;
        obj.value = item.id;
        obj.children = [];
        let secondArr = await this.getCategorySecondType(item.id);
        if (secondArr !== null) {
          secondArr.forEach((item2) => {
            let secondObj = {};
            secondObj.label = item2.secondName;
            secondObj.value = item2.id;
            obj.children.push(secondObj);
          });
        }
        this.options.push(obj);
      });
    },

    // 获取二级分类类别数据
    async getCategorySecondType(id) {
      const { data: res } = await this.$http.request({
        url: "back/goods_type/showGoodsSecondType",
        method: "post",
        data: {
          id,
        },
      });
      if (res.code === 200) {
        return res.data;
      }
      return null;
    },
  },
};
</script>

<style lang="less" scoped></style>
