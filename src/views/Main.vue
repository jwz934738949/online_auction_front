<template>
  <div>
    <!-- 轮播图 -->
    <el-carousel height="450px" direction="vertical" autoplay loop>
      <el-carousel-item>
        <el-image
          src="http://oss.gorld.cn/20181225.jpg"
          fit="fill"
        ></el-image>
      </el-carousel-item>
      <el-carousel-item>
        <el-image
          src="http://oss.gorld.cn/R5LATjltFBFiaO.jpg"
          fit="fill"
        ></el-image>
      </el-carousel-item>
      <el-carousel-item>
        <el-image
          src="http://oss.gorld.cn/2327989714191135897.jpg"
          fit="fill"
        ></el-image>
      </el-carousel-item>
      <el-carousel-item>
        <el-image
          src="http://oss.gorld.cn/siz999910000.jpg"
          fit="fill"
        ></el-image>
      </el-carousel-item>
    </el-carousel>
    <div class="main_content" v-for="item in goodsTypeList" :key="item.id">
      <div class="title">{{ item.name }}</div>
      <goods-list :goods-id="item.id"></goods-list>
    </div>
  </div>
</template>

<script>
import GoodsList from "../components/GoodsList/GoodsList";

export default {
  data() {
    return {
      // 保存获取的第一分类数据
      goodsTypeList: [],
    };
  },
  components: {
    GoodsList,
  },
  created() {
    this.getGoodsType();
  },
  methods: {
    // 获取相应的分类数据
    getGoodsByGoodsId() {},

    // 展示所有第一分类数据
    async getGoodsType() {
      const { data: res } = await this.$http.request({
        url: "back/goods_type/showGoodsType",
        method: "post",
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      // console.log(res);
      this.goodsTypeList = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
.el-image {
  width: 1400px;
  height: 450px;
}

.main_content {
  .title {
    border-left: 5px solid #ed1941;
    text-align: left;
    color: #000;
    font-size: 25px;
    padding: 10px;
  }
}
</style>
