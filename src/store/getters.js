const getters = {
  token: (state) => state.user.token,
  info: (state) => state.user.info,
  platform: (state) => state.app.platform,
  cacheList: (state) => state.app.cacheList,
};
export default getters;
