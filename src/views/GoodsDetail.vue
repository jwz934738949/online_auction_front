<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>竞拍详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 竞拍详细内容 -->
    <div class="main_wrap">
      <img :src="detailInfoList.image" width="250" height="250"/>
      <div class="goods_info">
        <div class="deadline">{{ auctionTime }}</div>
        <div class="goods_title">{{ detailInfoList.name }}</div>
        <div class="goods_content">
          <div class="remark">
            <span class="iconfont icon-miaoshu">描述</span>
            {{ detailInfoList.remark }}
          </div>
          <div>
            <span class="iconfont icon-jiage">起拍价</span>
            {{ detailInfoList.bond }}
          </div>
          <div>
            <span class="iconfont icon-renshu">竞拍人数</span>
            {{ detailInfoList.participants }}
          </div>
          <div>
            <span class="iconfont icon-liulan">浏览人数</span>
            {{ detailInfoList.views }}
          </div>
        </div>
        <el-button :disabled="btnAbled" @click="auctionGoods"
        >竞拍商品
        </el-button
        >
        <!-- 打开竞拍价格界面 -->
        <el-drawer
            :visible.sync="drawer"
            size="25%"
            direction="rtl"
            :wrapperClosable="false"
            @closed="closeDrawer"
        >
          <div class="header">当前竞拍价: {{ price }}</div>
          <div class="content">
            <div class="wrap"></div>
          </div>
          <div class="footer">
            <el-button type="warning" round @click="auctionWebSocket"
            >竞拍
            </el-button
            >
          </div>
        </el-drawer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 保存竞拍信息
      detailInfoList: [],
      // 保存竞拍时间
      auctionTime: "",
      dateInterval: 0,
      // 竞拍商品ID
      auctionId: 0,
      // 竞拍价格
      price: 0,
      // 保存按钮是否可以点击
      btnAbled: true,
      // 控制drawer的显示与隐藏
      drawer: false,
      // websocket对象
      webSocket: null,
      // 用户名称
      nickname: "",
      // 用户头像
      avatarUrl: "",
      // 用户竞拍信息数组
      auctionUserList: []
    };
  },
  created() {
    this.addViews();
    this.getGoodsDetail();
    // 当用户登录之后允许点击
    if (window.sessionStorage.getItem("vipId")) {
      this.btnAbled = false;
    }
  },
  methods: {
    // 获取点击的商品的详细竞拍信息
    async getGoodsDetail() {
      let id = window.sessionStorage.getItem("goodsId");
      const {data: res} = await this.$http.request({
        url: "front/Config/showConfig",
        method: "post",
        data: {
          id,
        },
      });
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      if (res.data[1].length !== 0) {
        this.price = res.data[1][0].price
      }
      this.auctionId = res.data[0].auctionId;
      this.detailInfoList = res.data[0];
      if (res.data[1].length !== 0) {
        this.auctionUserList = res.data[1];
      }
      // 计算当前日期是否到达开始竞拍时间
      let startTime = new Date(this.detailInfoList.startTime);
      if (startTime - new Date() > 0) {
        //当前日期早于竞拍日期
        this.auctionTime = "竞拍未开始";
      } else {
        //当前日期晚于竞拍开始日期
        let timer = setInterval(() => {
          this.dateInterval--;
          this.auctionTime = this.getTime(
              new Date(),
              this.detailInfoList.endTime
          );
          if (this.auctionTime === "竞拍已结束") {
            clearInterval(timer);
          }
        }, 1000);
      }
    },

    // 用户每进入一次页面，浏览量加1
    async addViews() {
      let id = window.sessionStorage.getItem("goodsId");
      const {data: res} = await this.$http.request({
        url: "front/Config/views",
        method: "post",
        data: {
          id,
        },
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
    },

    //计算时间间隔
    getTime(time1, time2) {
      let startTime = new Date(time1); // 开始时间
      let endTime = new Date(time2); // 结束时间
      this.dateInterval = endTime.getTime() - startTime.getTime(); //获取时间差毫秒

      if (this.dateInterval < 0) {
        return "竞拍已结束";
      }
      // //计算出相差天数
      let days = Math.floor(this.dateInterval / (24 * 60 * 60 * 1000));
      //计算小时数
      let hourLevel = this.dateInterval % (24 * 60 * 60 * 1000);
      let hours = Math.floor(hourLevel / (60 * 60 * 1000));
      //计算分钟数
      let minutesLevel = hourLevel % (60 * 60 * 1000);
      let minutes = Math.floor(minutesLevel / (60 * 1000));
      //计算秒数
      let seconds = Math.round((minutesLevel % (60 * 1000)) / 1000);
      return (
          days + " 天 " + hours + " 时 " + minutes + " 分 " + seconds + " 秒 "
      );
    },

    // 打开竞拍界面
    auctionGoods() {
      this.drawer = true;
      this.initWebSocket();
    },

    // 使用websocket实现竞拍功能
    initWebSocket() {
      const path = "ws://auction.redarm.cn/web-socket";
      this.webSocket = new WebSocket(path);
      this.webSocket.onopen = this.websocketonopen;
      this.webSocket.onmessage = this.websocketonmessage;
      this.webSocket.onerror = this.websocketonerror;
      this.webSocket.onclose = this.websocketclose;
    },

    //连接建立之后执行send方法发送数据
    websocketonopen() {
      this.$message.success("成功打开webSocket!");
      if (this.auctionUserList.length !== 0) {
        this.auctionUserList.forEach(async item => {
          await this.showVipUser(item.vipUserId);
          let wrap = document.getElementsByClassName("wrap")[0];
          wrap.innerHTML += `
        <div class="user_info">
          <img src="${this.avatarUrl}" width="30" height="30" alt="">
          <span class="nickname">${this.nickname}</span>
        </div>
        <span class="price">${item.price}</span>
`
        })

      }
    },

    //连接建立失败重连
    websocketonerror() {
      this.initWebSocket();
    },

    //数据接收
    async websocketonmessage(e) {
      const redata = JSON.parse(e.data);
      await this.showVipUser(redata.vipUserId);
      let wrap = document.getElementsByClassName("wrap")[0];
      wrap.innerHTML += `
        <div class="user_info"> 
          <img src="${this.avatarUrl}" width="30" height="30" alt="">
          <span class="nickname">${this.nickname}</span>
        </div>
        <span class="price">${redata.price}</span>
      `;
    },

    //数据发送
    websocketsend(Data) {
      this.webSocket.send(Data);
    },

    //关闭
    websocketclose(e) {
      this.$message.success("成功关闭webSocket!");
    },

    // 关闭drawer
    closeDrawer() {
      this.webSocket.close();
      this.drawer = false;
    },

    // 上传竞拍价格
    auctionWebSocket() {
      this.price += 20500;
      let vipUserId = Number(window.sessionStorage.getItem("vipId"));
      let data = {
        type: 1,
        price: this.price,
        configId: this.auctionId,
        vipUserId,
      };
      this.websocketsend(JSON.stringify(data));
    },

    // 展示用户相关信息
    async showVipUser(id) {
      const {data: res} = await this.$http.request({
        url: "front/VipUser/showVipUserInfo",
        method: "post",
        data: {
          id,
        },
      });
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.nickname = res.data.nickname;
      this.avatarUrl = res.data.avatarUrl;
    },
  },
};
</script>

<style lang="less">
.main_wrap {
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    box-shadow: 0 0 4px #000;
    border-radius: 15px;
    margin: 25px;
  }

  .goods_info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .deadline {
      color: #ee9a00;
      font-size: 25px;
      font-weight: 600;
    }

    .goods_title {
      font-size: 20px;
      font-weight: 600;
      color: #363636;
    }

    .goods_content {
      color: #a9a9a9;
      font-size: 15px;

      div {
        margin: 5px 0;

        span {
          font-weight: bolder;
          color: #a1afc9;
        }
      }
    }

    .el-drawer {
      .header {
        width: 65%;
        margin-left: 50%;
        transform: translateX(-50%);
        font-size: 20px;
        font-weight: 600;
      }

      .content {
        margin: 15px 0;
        width: 100%;
        height: 480px;
        overflow: auto;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;

        .wrap {
          padding: 5px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          box-sizing: border-box;

          .user_info {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            img {
              margin: 5px;
            }
          }

          .price {
            margin-left: 15px;
            font-size: 20px;
            color: red;
          }
        }
      }

      .footer {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
