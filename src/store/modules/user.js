import {
  getToken,
  setToken,
  removeToken,
  getStorage,
  setStorage,
} from "@util/auth";
import { login, logout } from "@/api/user";
import router from "@/router";

export default {
  namespaced: true,
  state: {
    info: getStorage("info"),
    token: getToken(),
  },
  actions: {
    async login({ commit }, data) {
      const info = await login(data);
      commit("SET_TOKEN", info.token);
      commit("SET_INFO", info);
    },
    async logout() {
      await logout();
      removeToken();
      router.push("/login");
    },
  },
  mutations: {
    SET_INFO(state, info) {
      state.info = info;
      setStorage("info", info);
    },
    SET_TOKEN(state, token) {
      state.token = token;
      setToken(token);
    },
  },
};
