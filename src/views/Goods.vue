<template>
  <div>
    <!-- 显示上传物品按钮 -->
    <el-row type="flex" justify="center" align="center">
      <el-col :span="4">
        <el-button
          type="text"
          icon="el-icon-circle-plus"
          @click="insertGoodsDialogVisible = true"
        >物品上传
        </el-button
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
            ref="insertGoodsFormRef"
            label-width="100px"
          >
            <el-form-item label="商品图片">
              <el-upload
                class="avatar-uploader"
                action="http://auction.redarm.cn/api/front/goods/image"
                :limit="1"
                accept=".png, .jpg"
                ref="uploadRef"
                :on-success="handleAvatarSuccess"
              >
                <img
                  v-if="goodsForm.image"
                  :src="goodsForm.image"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="goodsForm.name"></el-input>
            </el-form-item>
            <el-form-item label="竞拍起价￥" prop="auctionPrice">
              <el-input
                v-model="goodsForm.auctionPrice"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品描述">
              <el-input
                type="textarea"
                :rows="2"
                :autosize="{ maxRows: 4 }"
                placeholder="请输入描述内容"
                :show-word-limit="true"
                clearable
                v-model="goodsForm.remark"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="商品类别" prop="goodsSecondTypeId">
              <el-cascader
                v-model="value"
                :options="options"
                :props="{ expandTrigger: 'hover' }"
                clearable
                @change="getGoodsSecondTypeId"
              ></el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="insertGoodsDialogVisible = false"
            >取 消</el-button
            >
            <el-button type="primary" @click="insertGoods">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
    <!-- 显示查询表单 -->
    <el-row
      type="flex"
      justify="center"
      align="center"
      :gutter="10"
      style="margin: 5px 0;"
    >
      <el-col :span="6">
        <el-input v-model="goodsName" placeholder="请输入商品名称"></el-input>
      </el-col>
      <el-col :span="4">
        <el-cascader
          v-model="valueSelect"
          :options="options"
          :props="{ expandTrigger: 'hover' }"
          @change="getGoodsSecondTypeId"
          clearable
          placeholder="请选择要查询的分类"
        ></el-cascader>
      </el-col>
      <el-col :span="2">
        <el-button icon="el-icon-search" @click="getGoodsByParams"></el-button>
      </el-col>
    </el-row>
    <!-- 显示商品数据表格 -->
    <el-table :data="goodsDataList" stripe style="width: 100%">
      <el-table-column prop="name" label="商品名称" width="200" sortable>
      </el-table-column>
      <el-table-column prop="image" label="商品图片" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.image" alt="" width="60" height="60"/>
        </template>
      </el-table-column>
      <el-table-column prop="goodsTypeId" label="商品类别" width="150">
        <template slot-scope="scope">
          <el-tag type="success" effect="dark" size="small">
            {{ scope.row.firstname }} > {{ scope.row.secondname }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="商品描述"
        width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="250" sortable>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="info"
            size="small"
            @click="showConfigDialog(scope.row.id)"
          >竞拍配置
          </el-button
          >
          <el-dialog
            title="物品竞拍配置"
            :visible.sync="showConfigDialogVisible"
            width="45%"
          >
            <el-form
              :model="configForm"
              :rules="configFormRules"
              ref="configFormRef"
              label-width="100px"
            >
              <el-form-item label="起拍金额" prop="bond">
                <el-input type="number" v-model="configForm.bond"></el-input>
              </el-form-item>
              <el-form-item label="竞拍时间">
                <el-date-picker
                  v-model="timeRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  align="right"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @blur="timeChanged"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="竞拍间隔" prop="priceGrad">
                <el-input type="number" v-model="configForm.priceGrad"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="showConfigDialogVisible = false"
              >取 消</el-button
              >
              <el-button type="primary" @click="configGoods">确 定</el-button>
            </span>
          </el-dialog>
          <el-button
            size="small"
            @click="showOrderByGoodsId(scope.row.id)"
          >查看订单
          </el-button>
          <el-dialog
            title="物品订单数据"
            :visible.sync="showOrderDialogVisible"
            width="90%"
          >
            <!--    订单表格数据-->
            <el-table
              :data="tableData"
              stripe
              style="width: 100%">
              <el-table-column
                type="index"
                width="70">
              </el-table-column>
              <el-table-column
                prop="image"
                label="商品图片"
                width="150">
                <template slot-scope="scope">
                  <img :src="scope.row.image" alt="" width="50" height="50">
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="商品名称"
                width="170"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="cateType"
                label="商品分类"
                width="200">
                <template slot-scope="scope">
                  <el-tag type="success">{{ scope.row.cateType }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="bond"
                label="保证金"
                width="150">
              </el-table-column>
              <el-table-column
                prop="price"
                label="成交金额"
                width="150">
              </el-table-column>
              <el-table-column
                prop="fromname"
                label="卖家"
                width="150">
              </el-table-column>
              <el-table-column
                prop="toname"
                label="买家"
                width="200">
              </el-table-column>
            </el-table>
          </el-dialog>
          <el-button
            type="primary"
            round
            icon="el-icon-edit"
            size="small"
            @click="showUpdateGoodsDialog(scope.row)"
          >修改
          </el-button
          >
          <el-dialog
            title="物品修改"
            :visible.sync="updateGoodsDialogVisible"
            width="45%"
          >
            <el-form
              :model="goodsForm"
              :rules="goodsRules"
              ref="insertGoodsFormRef"
              label-width="100px"
            >
              <el-form-item label="商品图片">
                <el-upload
                  class="avatar-uploader"
                  action="http://auction.redarm.cn/api/front/goods/image"
                  :limit="1"
                  accept=".png, .jpg"
                  :on-success="handleAvatarSuccess"
                >
                  <img
                    v-if="goodsForm.image"
                    :src="goodsForm.image"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="商品名称" prop="name">
                <el-input v-model="goodsForm.name"></el-input>
              </el-form-item>
              <el-form-item label="竞拍起价￥" prop="auctionPrice">
                <el-input
                  v-model="goodsForm.auctionPrice"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品描述">
                <el-input
                  type="textarea"
                  :rows="2"
                  :autosize="{ maxRows: 4 }"
                  placeholder="请输入描述内容"
                  :show-word-limit="true"
                  clearable
                  v-model="goodsForm.remark"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="商品类别" prop="goodsSecondTypeId">
                <el-cascader
                  v-model="value"
                  :options="options"
                  :props="{ expandTrigger: 'hover' }"
                  clearable
                  @change="getGoodsSecondTypeId"
                ></el-cascader>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="updateGoodsDialogVisible = false"
              >取 消</el-button
              >
              <el-button type="primary" @click="updateGoods">确 定</el-button>
            </span>
          </el-dialog>
          <el-button
            type="danger"
            round
            icon="el-icon-delete"
            size="small"
            @click="deleteGoodsDialogVisible = true"
          >删除
          </el-button
          >
          <el-dialog
            title="物品删除"
            :visible.sync="deleteGoodsDialogVisible"
            width="45%"
          >
            <span>此操作将永久删除该文件, 是否继续?</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="deleteGoodsDialogVisible = false"
              >取 消</el-button
              >
              <el-button type="primary" @click="deleteGoods(scope.row.id)"
              >确 定</el-button
              >
            </span>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <div class="page_footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="10"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 显示查询商品名称
      goodsName: "",
      // 显示查询商品分类id
      goodsTypeId: 0,
      // 级联选择器选中的值
      value: [],
      valueSelect: [],
      // 显示级联选择器的内容
      options: [],
      // 保存商品表单数据
      goodsForm: {
        name: "",
        image: "",
        vipUserId: 0,
        goodsSecondTypeId: 0,
        auctionPrice: 0,
        remark: "",
        goodsId: 0,
      },
      // 商品验证规则
      goodsRules: {
        name: [{required: true, message: "请输入商品名称", trigger: "blur"}],
        auctionPrice: [
          {required: true, message: "请输入起拍价格", trigger: "blur"},
          {min: 2, max: 10, message: "价格必须为2-10位数", trigger: "blur"},
        ],
        goodsSecondTypeId: [
          {required: true, message: "请选择商品类别", trigger: "blur"},
        ],
      },
      // 保存商品竞拍配置表单
      configForm: {
        bond: "",
        goodsId: 0,
        startTime: "",
        endTime: "",
        priceGrad: 0,
      },
      configFormRules: {
        bond: [
          {required: true, message: "请输入起拍价格", trigger: "blur"},
          {
            min: 2,
            max: 8,
            message: "起拍价格在2 - 8位数之间",
            trigger: "blur",
          },
        ],
        priceGrad: [
          {required: true, message: "请输入竞拍间隔", trigger: "blur"},
          {
            min: 2,
            max: 8,
            message: "竞拍间隔在2 - 8位数之间",
            trigger: "blur",
          }
        ]
      },
      // 获取开始时间与结束时间数组数据
      timeRange: [],
      // 显示物品上传对话框的显示与隐藏
      insertGoodsDialogVisible: false,
      deleteGoodsDialogVisible: false,
      updateGoodsDialogVisible: false,
      showConfigDialogVisible: false,
      goodsDataList: [],
      // 数据总条数
      total: 0,
      tableData: [],
      // 显示订单信息对话框
      showOrderDialogVisible: false,
    };
  },
  created() {
    this.getCategoryType();
    this.goodsForm.vipUserId = window.sessionStorage.getItem("vipId");
    this.getGoodsByUserId();
  },
  methods: {
    // 获取分类类别数据
    async getCategoryType() {
      const {data: res} = await this.$http.request({
        url: "back/goods_type/showGoodsType",
        method: "post",
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
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
            // 二级分类id与一级分类id重复，修改二级分类id
            secondObj.value = item2.id + 1000;
            obj.children.push(secondObj);
          });
        }
        this.options.push(obj);
      });
    },

    // 获取二级分类类别数据
    async getCategorySecondType(id) {
      const {data: res} = await this.$http.request({
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

    // 获取当前用户上传的物品信息
    async getGoodsByUserId() {
      const id = window.sessionStorage.getItem("vipId");
      const {data: res} = await this.$http.request({
        url: "front/goods/showGoodsByUserId",
        method: "post",
        data: {
          vipUserId: id,
          goodsName: "",
          goodsTypeId: 0,
        },
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.total = res.data.length;
      this.goodsDataList = [];
      res.data.forEach((item) => {
        let obj = {};
        obj.id = item.id;
        obj.name = item.name;
        obj.image = item.image;
        obj.goodsTypeId = item.goodsTypeId;
        obj.firstname = item.firstname;
        obj.secondname = item.secondname;
        obj.remark = item.remark;
        obj.createTime = item.createTime;
        obj.firstId = item.firstId;
        obj.auctionPrice = item.auctionPrice;
        this.goodsDataList.push(obj);
      });
    },

    // 根据用户名或者分类id查询相应的物品信息
    async getGoodsByParams() {
      const id = window.sessionStorage.getItem("vipId");
      const {data: res} = await this.$http.request({
        url: "front/goods/showGoodsByUserId",
        method: "post",
        data: {
          vipUserId: id,
          goodsName: this.goodsName,
          goodsTypeId: this.goodsTypeId,
        },
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.goodsName = ""
      this.goodsDataList = [];
      res.data.forEach((item) => {
        let obj = {};
        obj.id = item.id;
        obj.name = item.name;
        obj.image = item.image;
        obj.goodsTypeId = item.goodsTypeId;
        obj.firstname = item.firstname;
        obj.secondname = item.secondname;
        obj.remark = item.remark;
        obj.createTime = item.createTime;
        this.goodsDataList.push(obj);
      });
    },

    // 图片上传成功回调
    handleAvatarSuccess(file) {
      this.goodsForm.image = file.data.imageUrl;
      this.$refs.uploadRef.clearFiles();
    },

    // 添加商品数据
    insertGoods() {
      this.$refs.insertGoodsFormRef.validate(async (valid) => {
        if (valid) {
          const {data: res} = await this.$http.request({
            url: "front/goods/addGoods",
            method: "post",
            data: this.goodsForm,
          });
          if (res.code !== 200) {
            return this.$message.error(res.message);
          }
          this.$message.success("添加商品成功");
          this.insertGoodsDialogVisible = false;
          await this.getGoodsByUserId();
          this.goodsForm = {
            name: "",
            image: "",
            vipUserId: 0,
            goodsSecondTypeId: 0,
            auctionPrice: 0,
            remark: "",
            goodsId: 0,
          }
        }
      });
    },

    // 获取时间区间事件
    timeChanged() {
      this.configForm.startTime = this.timeRange[0];
      this.configForm.endTime = this.timeRange[1];
    },

    // 显示物品竞拍配置对话框
    showConfigDialog(id) {
      this.showConfigDialogVisible = true;
      this.configForm.goodsId = id;
      this.timeRange = [new Date(), new Date()];
    },

    // 配置物品竞拍信息
    configGoods() {
      this.$refs.configFormRef.validate(async (valid) => {
        if (valid) {
          const {data: res} = await this.$http.request({
            url: "front/Config/addConfig",
            method: "post",
            data: this.configForm,
          });
          if (res.code !== 200) {
            return this.$message.erroe(res.message);
          }
          this.$message.success("竞拍配置成功");
          this.showConfigDialogVisible = false;
          this.$refs.configFormRef.resetFileds();
        }
      });
    },

    // 获取二级分类id
    getGoodsSecondTypeId() {
      this.goodsForm.goodsSecondTypeId = this.value[1] - 1000;
      this.goodsTypeId = this.valueSelect[1] - 1000;
    },

    // 显示更新物品对话框
    showUpdateGoodsDialog(goodsList) {
      this.updateGoodsDialogVisible = true;
      this.goodsForm.name = goodsList.name;
      this.goodsForm.remark = goodsList.remark;
      this.goodsForm.goodsId = goodsList.id;
      this.value = [goodsList.firstId, goodsList.goodsTypeId + 1000];
      this.goodsForm.image = goodsList.image;
      this.goodsForm.auctionPrice = goodsList.auctionPrice;
    },

    // 更新物品
    async updateGoods() {
      const {data: res} = await this.$http.request({
        url: "front/goods/upDateGoodsInfo",
        method: "post",
        data: {
          name: this.goodsForm.name,
          image: this.goodsForm.image,
          goodsId: this.goodsForm.goodsId,
          goodsTypeId: this.goodsForm.goodsSecondTypeId,
          auctionPrice: this.goodsForm.auctionPrice,
          remark: this.goodsForm.remark,
        },
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.$message.success("物品修改成功");
      this.updateGoodsDialogVisible = false;
      await this.getGoodsByUserId();
    },

    // 删除物品数据
    async deleteGoods(id) {
      const {data: res} = await this.$http.request({
        url: "front/goods/deleteGoodsByVipUser",
        method: "post",
        data: {
          goodsId: id,
        },
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.$message.success("删除成功");
      this.deleteGoodsDialogVisible = false;
      await this.getGoodsByUserId();
    },

    // 查看商品订单数据
    async showOrderByGoodsId(id) {
      const {data: res} = await this.$http.request({
        url: 'front/order/ShowOrderByGoodsId',
        method: 'post',
        data: {
          id
        }
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      if (res.data === null) {
        return this.$message.error("该物品没有进行竞拍")
      }
      this.tableData = [];
      let obj = {};
      obj.uuid = res.data.uuid;
      obj.bond = res.data.bond;
      obj.cateType = res.data.firsttype + ' / ' + res.data.secondtype;
      obj.image = res.data.image;
      obj.fromname = res.data.fromname;
      obj.toname = res.data.toname;
      obj.price = res.data.price;
      obj.name = res.data.name;
      this.tableData.push(obj);
      this.showOrderDialogVisible = true;
    },


    // 当前页码发生变化
    currentChange(pageNum) {
      this.pageNum = pageNum;
    }
  },
};
</script>

<style lang="less" scoped>
.el-dialog {
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
}

.page_footer {
  width: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.el-table {
  .el-button {
    margin-right: 5px;
  }
}
</style>
