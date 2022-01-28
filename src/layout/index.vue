<template>
  <div class="root">
    <head-part :collapse.sync="collapse"></head-part>
    <div id="layout">
      <left-slide :collapse.sync="collapse"></left-slide>
      <div class="content-box">
        <tags></tags>
        <div class="main-box" ref="childrens">
          <breadcrumb />
          <div id="main-container">
            <router-view :key="$route.fullPath" />
            <slot></slot>
          </div>
          <el-backtop target=".content-box" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Breadcrumb from "./components/Breadcrumb.vue";
import HeadPart from "./components/HeadPart.vue";
import LeftSlide from "./components/LeftSlide.vue";
import Tags from "./components/Tags.vue";
export default {
  components: {
    Tags,
    HeadPart,
    LeftSlide,
    Breadcrumb,
  },
  data() {
    return {
      collapse: false,
    };
  },
};
</script>
<style lang="scss">
#layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.root {
  position: relative;
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  flex-direction: column;
  .content-box {
    flex: 1;
    overflow-y: hidden;
    background: #f0f2f5;
    display: flex;
    flex-direction: column;
    .main-box {
      position: relative;
      flex: 1;
      overflow-y: auto;
    }
  }
  #main-container {
    padding: 0 20px;
  }
}
</style>