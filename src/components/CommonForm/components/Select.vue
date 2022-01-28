<template>
  <el-select v-bind="$attrs" :value="value">
    <el-option v-for="item in options" v-bind="item" :key="item.value" />
  </el-select>
</template>
<script>
export default {
  props: ["field", "value", "listInfo"],
  computed: {
    options({ listInfo, field }) {
      return listInfo && listInfo[field?.list];
    },
  },
};
</script>