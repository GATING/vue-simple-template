<template>
  <el-radio-group v-bind="$attrs" :value="value">
    <el-radio v-for="item in options" :label="item.value" :key="item.value">
      {{ item.label }}
    </el-radio>
  </el-radio-group>
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