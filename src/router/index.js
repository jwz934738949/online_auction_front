import Vue from "vue";
import VueRouter from "vue-router";
const Home = () => import("../views/Home");
const Login = () => import("../views/Login");
const Register = () => import("../views/Register");
const Main = () => import("../views/Main");
const Goods = () => import("../views/Goods");

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
      { path: "/main", component: Main },
      { path: "/goods", component: Goods },
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
  if (to.path !== '/goods') {
    return next()
  }
  // 获取token值
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router;
