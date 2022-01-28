import Vue from "vue";
import VueRouter from "vue-router";
import { flatten } from "lodash";
import Layout from "@/layout/index.vue";

Vue.use(VueRouter);

const rts = require.context("./modules", true, /\.js$/); // webpack引入方式
export const pageRoutes = flatten(rts.keys().map((e) => rts(e).default));
const routes = [
  {
    path: "/",
    redirect: "/home",
    component: Layout,
    children: pageRoutes.sort((a, b) => a?.meta?.sort - b.meta.sort),
  },
  {
    path: "/login",
    component: () => import("@view/login/index.vue"),
  },
  {
    path: "*",
    redirect: "/",
  },
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
