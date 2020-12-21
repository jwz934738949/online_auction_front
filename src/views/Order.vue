<template>
  <div>
    <!--    订单表格数据-->
    <el-table
        :data="tableData.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
        stripe
        style="width: 100%">
      <el-table-column
          type="index"
          width="100">
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
          width="200"
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
          width="200">
      </el-table-column>
      <el-table-column
          prop="toname"
          label="买家"
          width="200">
      </el-table-column>
    </el-table>
    <div class="footer">
      <!--      分页组件-->
      <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          @current-change="currentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 保存获取的订单数据
      tableData: [],
      pageSize: 5,
      pageNum: 1,
      total: 0,
    }
  },
  created() {
    this.getOrderData();
  },
  methods: {
    // 根据id查询买家订单数据
    async getOrderData() {
      let toUserId = window.sessionStorage.getItem("vipId");
      const {data: res} = await this.$http.request({
        url: 'front/order/toUserShowOrder',
        method: 'post',
        data: {
          toUserId
        }
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.total = res.data.length;
      this.tableData = [];
      res.data.forEach(item => {
        let obj = {};
        obj.uuid = item.uuid;
        obj.bond = item.bond;
        obj.cateType = item.firsttype + ' / ' + item.secondtype;
        obj.image = item.image;
        obj.fromname = item.fromname;
        obj.toname = item.toname;
        obj.price = item.price;
        obj.name = item.name;
        this.tableData.push(obj);
      })
    },

    // 当前页码发生变化
    currentChange(pageNum) {
      this.pageNum = pageNum;
    }
  }
}
</script>

<style lang="less" scoped>
.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 15px;
}
</style>