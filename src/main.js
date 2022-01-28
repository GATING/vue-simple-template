import Vue from "vue";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/styles/global.scss";
import "./permission";

import Page from "@comp/Page.vue";
import Pagination from "@comp/Pagination.vue";
import CommonTable from "@comp/CommonTable/index.vue";
import CommonForm from "@comp/CommonForm/index.vue";

import lang from "element-ui/lib/locale/lang/zh-CN";
import locale from "element-ui/lib/locale";

// 设置语言
locale.use(lang);

Vue.config.productionTip = false;
// 开启performance用于性能分析
Vue.config.performance = process.env.NODE_ENV !== "production";

Vue.use(Element, {
  size: "small",
});
Vue.component("page", Page);
Vue.component("CommonForm", CommonForm);
Vue.component("CommonTable", CommonTable);
Vue.component("Pagination", Pagination);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
