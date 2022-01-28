import { getPlatformConf } from "@/api/platform";
import { setStorage, getStorage } from "@/utils/auth";

const tags = getStorage("tags") || [];

const defaultPlatform = {
  icon: "",
  platform_name: "放逐测试平台",
  platform_login_msg: "Sign in to Exile Test Platform",
};
export default {
  state: {
    platform: defaultPlatform,
    currentTags: [...tags], //当前打开的tag
    askingPath: "", // 当前问询是否要关闭页面
    needClosePath: "", //需要关闭的页面
  },

  actions: {
    async getPlatformConf({ commit }) {
      const platform = await getPlatformConf();
      commit("setPlatform", platform);
    },
  },
  mutations: {
    setPlatform(state, platform) {
      state.platform = platform || defaultPlatform;
    },

    delTag(state, path) {
      state.currentTags = state.currentTags.filter(
        ({ fullPath }) => fullPath !== path
      );
      setStorage("tags", state.currentTags);
    },
    setCurrentTags(state, data) {
      state.currentTags = data;
      setStorage("tags", data);
    },
    setAskingPath(state, data) {
      state.askingPath = data;
    },
    clearNowTag(state, fullPath) {
      state.needClosePath = fullPath;
    },
  },
};
