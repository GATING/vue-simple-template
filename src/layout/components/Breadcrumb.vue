<template>
  <div class="crumbs">
    <el-row class="crumbs-nav">
      <el-col :span="20">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="(item, index) in routeList"
            :key="item.index"
            :to="index == 1 ? item.path : ''"
          >
            {{ item.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <!-- <el-col :span="4" class="right">
        <el-button
          v-show="$store.state.base.backButton"
          icon="el-icon-back"
          size="small"
          @click="goBack"
        >
          返回
        </el-button>
      </el-col> -->
    </el-row>
  </div>
</template>
<script>
import { pageRoutes } from "@/router";
export default {
  data() {
    return {
      routeList: [],
      back: false,
    };
  },
  mounted() {
    // console.log('ojiliguala',this.routeList)
    this.init();
  },
  computed: {
    routePath() {
      return this.$route.path;
    },
    tooltips() {
      return this.$route.meta?.tooltips;
    },
    effect() {
      return Array.isArray(this.tooltips) ? "dark" : "light";
    },
  },
  watch: {
    routePath(n, o) {
      if (n !== o) {
        this.init();
      }
    },
  },
  methods: {
    init() {
      const path = this.$route.path;
      const arr = path.split("/");
      const arr2 = [];
      arr.reduce((a, b) => {
        arr2.push(a + "/" + b);
        return a + "/" + b;
      });
      const routeList = [];
      for (let item of arr2) {
        let name = this.getName(item, pageRoutes);
        console.log(name);
        if (name) {
          routeList.push({ name, path: item });
        }
      }
      this.routeList = routeList;
    },
    getName(path, routes) {
      let name = "";
      for (let item of routes) {
        if (item.path === path) {
          name = item.meta ? item.meta.title : "";
          break;
        }
        if (item.children) {
          let res = this.getName(path, item.children);
          if (res) {
            name = res;
            break;
          }
        }
      }
      return name;
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss">
.crumbs {
  padding: 0 20px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.crumbs-nav {
  height: 38px;
  line-height: 38px;
}
.el-breadcrumb {
  height: 38px;
  line-height: 38px !important;
}
</style>