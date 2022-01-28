<template>
  <div class="slide-bar">
    <el-menu
      :default-active="active"
      class="el-menu-vertical-demo"
      :default-openeds="open"
    >
      <section v-for="(item, index) in navs" :key="'navS1' + index">
        <el-submenu
          :index="'nav' + index"
          v-if="item.children && item.children.length > 0"
        >
          <template slot="title">
            <!-- <i class="el-icon-menu"></i> -->
            <i v-if="item.meta.icon" :class="item.meta.icon"></i>
            <span>{{ item.meta.title }}</span>
          </template>
          <el-menu-item
            v-for="(item1, index1) in item.children"
            :key="'navS' + index + '_' + index1"
            :index="'navS' + index + '_' + index1"
            class="nextMenu"
            @click="handleOpenPage(item1)"
          >
            <!-- <i class="el-icon-menu" v-if="item1.icon"></i> -->

            <span slot="title">
              <i v-if="item1.meta.icon" :class="item.meta.icon"></i>
              <span class="mr-5">{{ item1.meta.title }}</span>
            </span>
          </el-menu-item>
        </el-submenu>

        <el-menu-item
          v-else
          :index="'navS1' + index"
          @click="handleOpenPage(item)"
        >
          <template slot="title">
            <!-- <i class="el-icon-menu"></i> -->
            <i v-if="item.meta.icon" :class="item.meta.icon"></i>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </section>
    </el-menu>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { pageRoutes } from "@/router";

export default {
  props: {
    collapse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: "",
      open: [],
      navs: [],
    };
  },
  computed: {
    ...mapGetters(["status", "allMessage"]),
  },
  created() {
    // this.getMenu() // 异步菜单接口
    this.getNavs(); // 本地菜单  调试时可用
  },
  watch: {
    "$route.path": function () {
      this.activeNav();
    },
  },
  methods: {
    getMenu() {
      this.$axios
        // .post('/open.web.api/common/menu/currentV2')
        .post("/common.core.api/user/common/getMenu", {
          platform: 0,
          tenantId: "781759428264202240",
        })
        .then((menusWeb) => {
          const navs = menusWeb.map((item) => {
            let children = null;
            if (item.children) {
              children = item.children.map((itemSub) => {
                return {
                  path: itemSub.jumpPage,
                  title: itemSub.permiName,
                  icon: itemSub.permiIcon,
                };
              });
            }
            return {
              title: item.permiName,
              path: item.jumpPage,
              icon: item.permiIcon,
              children,
            };
          });
          this.navs = navs;
          this.activeNav();
        });
    },
    getNavs() {
      const navTree = this.navHandle(pageRoutes); // home下菜单
      console.log(navTree);
      this.navs = navTree;
      this.activeNav();
    },
    navHandle(routes) {
      const res = [];
      routes.map((item) => {
        delete item.component;
        if (item?.meta.notMenu) {
          //  不处理
        } else {
          if (item.children) {
            res.push({ ...item, children: this.navHandle(item.children) });
          } else {
            res.push(item);
          }
        }
      });
      return res;
    },
    handleOpenPage(item) {
      if (item.path && item.path !== this.$route.path) {
        this.$router.push(item.path);
      }
    },
    activeNav() {
      let openeds = [];
      let active = "";
      try {
        this.navs.forEach((item, index) => {
          if (item.path === this.$route.path) {
            active = "navS1" + index;
            throw new Error("End");
          }
          if (item.children) {
            item.children.forEach((item1, index1) => {
              if (item1.path === this.$route.path) {
                active = "navS" + index + "_" + index1;
                openeds.push("nav" + index);
                throw new Error("End");
              }
            });
          }
        });
      } catch (e) {
        if (e.message !== "End") {
          throw e;
        }
      }
      if (active !== "") {
        this.open = openeds;
        this.active = active;
      }
    },
  },
};
</script>
<style lang="scss">
.slide-bar {
  display: block;
  left: 0;
  top: 50px;
  font-size: 14px;
  bottom: 10px;
  overflow-y: auto;
  background: #fff;
  .el-menu {
    border-right: 0;
    width: 200px;
  }
}
.nextMenu {
  background: rgba(233, 233, 233, 0.56);
}
.el-submenu__title > i {
  margin-top: -3px;
}
.img-icon {
  display: inline-block;
  vertical-align: middle;
  height: 16px;
  margin-right: 10px;
}

.el-menu-item.is-active {
  color: $primary-color;
  background-color: #e6f7ff;
  border-right: 2px solid $primary-color;
}
</style>