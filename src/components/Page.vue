<template>
  <div class="el-card is-always-shadow p-20">
    <slot></slot>
  </div>
</template>
<script>
// 全局页面组件必须引用  子组件不可以用
// 通过 $emit('onCloseTag')  通知是否关闭  可以直接取回调 也可以通过 ref调用组件closeOrNot 方法实现
export default {
  watch: {
    "$store.state.base.askingPath": function (n) {
      if (n === this.$route.fullPath) {
        this.$nextTick(() => {
          this.$store.commit("setAskingPath", ""); // 清空
        });
        this.$emit("onCloseTag", this.closeOrNot);
      }
    },
  },
  methods: {
    closeOrNot(doClose = true) {
      this.$nextTick(() => {
        if (doClose) {
          this.$store.commit("clearNowTag", this.$route.fullPath);
        }
      });
    },
  },
};
</script>