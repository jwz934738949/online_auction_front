<template>
  <div>
    <!-- 轮播图 -->
    <el-carousel height="450px" direction="vertical" autoplay loop>
      <el-carousel-item>
        <el-image
          :src="require('../assets/carousel_img1.png')"
          fit="fill"
        ></el-image>
      </el-carousel-item>
      <el-carousel-item>
        <el-image
          :src="require('../assets/carousel_img2.png')"
          fit="fill"
        ></el-image>
      </el-carousel-item>
      <el-carousel-item>
        <el-image
          :src="require('../assets/carousel_img3.png')"
          fit="fill"
        ></el-image>
      </el-carousel-item>
      <el-carousel-item>
        <el-image
          :src="require('../assets/carousel_img4.png')"
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
