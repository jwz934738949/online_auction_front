<template>
  <div class="goods_item_wrap">
    <div class="img_wrap">
      <img :src="goodsList.image" alt="" />
    </div>

    <div class="goods_content">
      <div class="price_name">￥{{ goodsList.auctionPrice }}</div>
      <div class="name_content">
        <span class="name">{{ goodsList.name }}</span>
        <span class="remark">{{ goodsList.remark }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goodsList: {
      type: Object,
      default() {},
    },
  },
};
</script>

<style lang="less" scoped>
.goods_item_wrap {
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
      .remark {
        font-size: 15px;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
