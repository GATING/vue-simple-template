<template>
  <el-checkbox-group v-bind="$attrs" :value="value">
    <el-checkbox v-for="item in options" :label="item.value" :key="item.value">
      {{ item.label }}
    </el-checkbox>
  </el-checkbox-group>
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