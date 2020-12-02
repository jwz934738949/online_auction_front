import Vue from "vue";
import VueRouter from "vue-router";
const Home = () => import("../views/Home");
const Login = () => import("../views/Login");
const Register = () => import("../views/Register");
const Main = () => import("../views/Main");

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
    children: [{ path: "/main", component: Main }],
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

export default router;
