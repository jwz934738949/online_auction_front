<template>
  <div class="goods_list_wrap">
    <goods-list-item
      class="goods_list_item"
      v-for="item in secondGoodsList"
      :key="item.id"
      :goods-list="item"
    ></goods-list-item>
  </div>
</template>

<script>
import GoodsListItem from "../GoodsList/GoodsListItem";

export default {
  data() {
    return {
      // 二级分类数据
      secondGoodsList: [],
    };
  },
  props: {
    goodsId: {
      type: Number,
      default: 0,
    },
  },
  components: {
    GoodsListItem,
  },
  created() {
    this.getGoodsBySecondType();
  },
  methods: {
    // 获取二级分类中所有的物品数据
    async getGoodsBySecondType() {
      const { data: res } = await this.$http.request({
        url: "front/goods/showGoods",
        method: "post",
        data: {
          id: this.goodsId,
          pageSize: 10,
          pageStart: 1,
        },
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.secondGoodsList = res.data.goodsList;
    },
  },
};
</script>

<style lang="less" scoped>
.goods_list_wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
</style>
