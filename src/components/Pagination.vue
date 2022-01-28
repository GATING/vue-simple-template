<template>
  <div
    style="display: flex; justify-content: center; margin-top: 20px"
    v-show="!noPaging"
  >
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="size"
      :total="total"
      v-bind="{
        layout: 'total, sizes, prev, pager, next, jumper',
        'page-sizes': [5, 10, 20, 30, 50, 100],
        ...otherProps,
      }"
    ></el-pagination>
  </div>
</template>
<script>
//@  emit  change(list)
import request from "@/utils/request";
export default {
  props: {
    url: String,
    params: {
      type: Object,
      default: () => ({}),
    },
    doRequest: {
      type: Boolean,
      default: false, // post
    }, //true的时候主动更新数据
    list: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: "get", // post
    },
    resDeep: {
      //结果集深度 正常不用设置
      type: Number,
      default: 3,
    },
    resData: {
      type: Array,
      default: () => [],
    },
    noPaging: {
      //不分页设置未true
      type: Boolean,
      defalut: false,
    },
    unLoad: {
      //是否初始不加载
      type: Boolean,
      defalut: false,
    },
    backTop: {
      type: Boolean,
      default: true,
    },
    otherProps: {
      type: Object,
      default: () => {},
    },
    pageSize: {
      type: Number,
      default: 20, // post
    },
  },
  data() {
    return {
      page: 1,
      size: 10, //每页条数
      total: 10,
      firstLoad: true,
    };
  },
  watch: {
    doRequest(n) {
      if (n) {
        this.getList();
        this.$emit("update:doRequest", false);
      }
    },
    pageSize: {
      handler(n) {
        this.size = n || 20;
      },
      immediate: true,
    },
    params: {
      handler: function () {
        this.page = 1;
      },
      deep: true,
    },
  },
  methods: {
    handleSizeChange(size) {
      this.size = size;
      this.getList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getList();
    },
    getList() {
      if (!this.url) return;
      //console.log(this.params,'this.params')
      const params = {
        page: this.page,
        size: this.size,
        ...JSON.parse(JSON.stringify(this.params)),
      };
      transParams(params);
      request[this.type.toLocaleLowerCase()](this.url, params).then((res) => {
        this.$emit("update:list", res.records);
        this.total = +res.total;
      });

      if (this.backTop) {
        const main = document.getElementById("mainFrame");
        main && main.scrollTo(0, 0);
      }
    },
  },
  activated() {
    if (!this.unLoad && !this.firstLoad) {
      this.getList();
    }
  },
  created() {
    if (!this.unLoad) {
      this.firstLoad = false;
      this.getList();
    }
  },
};
function transParams(params) {
  for (let key in params) {
    if (params[key] === "") {
      delete params[key];
    }
    if (typeof params[key] === "object") {
      transParams(params[key]);
    }
  }
}
</script>