import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "./assets/css/iconfont.css";

Vue.config.productionTip = false;

axios.defaults.baseURL = "http://auction.redarm.cn/api/";

// 显示右上角螺旋加载提示
NProgress.configure({ showSpinner: false });

// 添加请求拦截器
axios.interceptors.request.use((config) => {
  // 将进度条插件打开
  NProgress.start();
  // 添加token值
  if (window.sessionStorage.getItem("token")) {
    config.headers.token = window.sessionStorage.getItem("token");
  }
  return config;
});

// 添加响应拦截器
axios.interceptors.response.use((response) => {
  // 将进度条插件关闭
  NProgress.done();
  return response;
});

Vue.prototype.$http = axios;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
