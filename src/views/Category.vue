<template>
  <div>
    <div class="header_wrap">
      <!-- 选择分类数据 -->
      <el-cascader
        v-model="valueSelect"
        :options="options"
        :props="{ expandTrigger: 'hover', checkStrictly: true }"
        @change="getGoodsSecondTypeId"
        clearable
        placeholder="请选择要查询的分类"
      ></el-cascader>
      <!-- 根据物品名称进行查询 -->
      <el-input
        placeholder="请输入内容"
        v-model="goodsName"
        class="input-with-select"
        @keyup.enter.native="getCategoryByName"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getCategoryByName"
        ></el-button>
      </el-input>
    </div>
    <div class="main_content">
      <div class="goods_item" v-for="(item, index) in goodsList" :key="item.id">
        <div class="img_wrap">
          <img :src="item.image" alt="" />
        </div>
        <div class="goods_content">
          <div class="price_name">￥{{ item.auctionPrice }}</div>
          <div class="name_content">
            <span class="name">{{ item.name }}</span>
            <span class="remark">{{ item.remark }}</span>
            <el-button type="text" @click="toDetail(index)"
              >查看详细 >>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <!-- 分页内容 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="20"
        :total="total"
        :current-page="pageStart"
        @current-change="pageStartChanged"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 保存商品分类id
      goodsId: 1,
      pageStart: 1,
      pageSize: 20,
      total: 0,
      // 保存商品数据数组
      goodsList: [],
      valueSelect: [],
      // 显示级联选择器的内容
      options: [],
      // 要查询的商品名称
      goodsName: "",
    };
  },
  created() {
    this.getCategoryType();
    this.getCategory();
  },
  methods: {
    // 默认获取分类数据
    async getCategory() {
      const { data: res } = await this.$http.request({
        url: "front/goods/showGoods",
        method: "post",
        data: {
          id: this.goodsId,
          pageSize: this.pageSize,
          pageStart: this.pageStart,
        },
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.total = res.data.总数;
      this.goodsList = res.data.goodsList;
    },

    // 查询第二分类的商品数据
    async getSecCategory() {
      const { data: res } = await this.$http.request({
        url: "front/goods/showGoodsBySecondType",
        method: "post",
        data: {
          id: this.goodsId,
          pageSize: this.pageSize,
          pageStart: this.pageStart,
        },
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.total = res.data.总数;
      this.goodsList = res.data.goodsList;
    },

    // 根据商品名称进行查询
    async getCategoryByName() {
      const { data: res } = await this.$http.request({
        url: "front/goods/getGoodsByGoodsName",
        method: "post",
        data: {
          name: this.goodsName,
          goodsTypeId: "",
        },
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.goodsList = res.data;
      this.goodsName = "";
    },

    // 获取分类类别数据
    async getCategoryType() {
      const { data: res } = await this.$http.request({
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

    // 获取二级分类id
    getGoodsSecondTypeId() {
      if (this.pageStart > 1) {
        this.pageStart = 1;
      }
      if (this.valueSelect.length === 1) {
        this.goodsId = this.valueSelect[0];
        this.getCategory();
      } else {
        this.goodsId = this.valueSelect[1] - 1000;
        this.getSecCategory();
      }
    },

    // 页码发生改变
    pageStartChanged(pageNum) {
      this.pageStart = pageNum;
      if (this.valueSelect.length === 2) {
        this.goodsId = this.valueSelect[1] - 1000;
        this.getSecCategory();
      } else {
        this.goodsId = this.valueSelect[0] || 1;
        this.getCategory();
      }
    },

    // 进入竞拍详情界面
    toDetail(index) {
      let id = this.goodsList[index].id;
      window.sessionStorage.setItem("goodsId", id);
      this.$router.push("/goodsDetail");
    },
  },
};
</script>

<style lang="less" scoped>
.header_wrap {
  display: flex;
  justify-content: center;
  align-items: center;

  .el-cascader {
    width: 20%;
    margin-right: 20px;
  }

  .el-input {
    width: 40%;
  }
}

.main_content {
  margin: 15px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .goods_item {
    width: 200px;
    height: 200px;
    display: flex;
    flex-direction: column;
    background-color: #909399;
    margin: 15px;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 0 2px #ccc;

    .img_wrap {
      text-align: center;
      margin: 10px;
      img {
        box-shadow: 0 0 2px #000;
        width: 100px;
        height: 100px;
      }
    }

    .goods_content {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .price_name {
        font-size: 20px;
        font-weight: bold;
        margin-left: 5px;
        color: rgb(211, 20, 68);
      }

      .name_content {
        margin-left: 10px;
        display: flex;
        flex-direction: column;

        .name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .remark {
          font-size: 15px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .el-button {
          margin-top: -10px;
          text-align: left;
        }
      }
    }
  }
}

.footer {
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
