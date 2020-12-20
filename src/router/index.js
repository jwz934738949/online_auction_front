import Vue from "vue";
import VueRouter from "vue-router";

const Home = () => import("../views/Home");
const Login = () => import("../views/Login");
const Register = () => import("../views/Register");
const Main = () => import("../views/Main");
const Goods = () => import("../views/Goods");
const Category = () => import("../views/Category");
const Mine = () => import("../views/Mine");
const GoodsDetail = () => import("../views/GoodsDetail");
const Order = () => import("../views/Order");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: Home,
    redirect: "/main",
    children: [
      {path: "/main", component: Main},
      {path: "/goods", component: Goods},
      {path: "/category", component: Category},
      {path: "/mine", component: Mine},
      {path: "/goodsDetail", component: GoodsDetail},
      {path: "/order", component: Order},
    ],
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
];
const router = new VueRouter({
  routes,
});

// 为路由器添加导航守卫
router.beforeEach((to, from, next) => {
  // to代表要去哪个路径
  // from代表从哪个路径来
  // next代表跳转 next() 直接跳转 next('/xxx') 强制跳转到该路径
  if (to.path === "/goods" || to.path === "/order") {
    // 获取token值
    const tokenStr = window.sessionStorage.getItem("token");
    if (!tokenStr) {
      return next("/login");
    }
    next();
  } else {
    return next();
  }

});

export default router;
