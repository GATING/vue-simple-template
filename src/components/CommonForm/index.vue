<template>
  <el-form
    v-bind="$attrs"
    id="business-common-form"
    ref="form"
    :model="model"
    :rules="rules"
    :inline="inline"
    :label-width="labelWidth"
    @submit.prevent
    @keyup.enter.native="search"
  >
    <el-form-item
      v-for="(field, idx) in fieldList"
      :key="idx"
      :label="field.label"
      :prop="field.value"
      :label-width="field.labelWidth"
    >
      <template #label>
        <template v-if="field.scopedSlotsLabel">
          <slot :name="field.scopedSlotsLabel" />
        </template>
        <template v-else-if="field.renderLabel">
          <free-render :render="field.renderLabel" />
        </template>
        <template v-else-if="field.label">{{ field.label }}</template>
      </template>
      <template v-if="$slots[field.scopedSlots]">
        <slot :name="field.scopedSlots" />
      </template>
      <template v-else>
        <span v-if="field.prefix" :class="field.prefixClass">{{
          field.prefix
        }}</span>
        <component
          v-model="model[field.value]"
          v-bind="getProps(field)"
          v-on="field.on"
          :field="field"
          :list-info="listInfo"
          :is="field.component"
        />
        <span v-if="field.suffix" :class="field.suffixClass">{{
          field.suffix
        }}</span>
      </template>
    </el-form-item>
    <template v-if="$slots.actions">
      <el-form-item>
        <slot name="actions" v-bind="{ ref: $refs }" />
      </el-form-item>
    </template>
    <template v-else>
      <el-form-item>
        <div class="flex form-action">
          <span :class="{ 'row-reverse': actionAlign !== 'left' }">
            <el-button @click="search" type="primary">{{
              confirmText
            }}</el-button>
            <el-button @click="reset">{{ resetText }}</el-button>
          </span>
        </div>
      </el-form-item>
    </template>
    <slot></slot>
  </el-form>
</template>

<script>
import ElRadio from "./components/Radio";
import ElSelect from "./components/Select";
import ElCheckbox from "./components/Checkbox";
import FreeRender from "./components/FreeRender";
export default {
  name: "common-form",
  components: {
    ElRadio,
    ElSelect,
    ElCheckbox,
    FreeRender,
  },
  props: {
    labelWidth: {
      type: String,
    },
    inline: {
      type: Boolean,
    },
    // 表单数据
    model: {
      type: Object,
    },
    // 相关字段
    fieldList: {
      type: Array,
    },
    // 验证规则
    rules: {
      type: Object,
    },
    // 相关的列表
    listInfo: {
      type: Object,
    },
    // 确认的文集
    confirmText: {
      type: String,
      default: "查询",
    },
    // 重置的文字
    resetText: {
      type: String,
      default: "重置",
    },
    actionAlign: {
      type: String,
      default: "left",
    },
  },
  methods: {
    getProps({ component, label, extraProps }) {
      const props = extraProps || {};
      if (!props.placeholder) {
        props.placeholder =
          component === "el-input" ? `请输入${label}` : `请选中${label}`;
      }
      return props;
    },
    validate() {
      return this.$refs.form.validate();
    },
    validateField(prop) {
      return this.$refs.form.validateField(prop);
    },
    resetFields() {
      this.$refs.form.resetFields();
    },
    async search() {
      await this.$refs.form.validate();
      this.$emit("search");
    },
    reset() {
      this.resetFields();
      this.$emit("reset");
    },
  },
};
</script>

<style lang="scss">
#business-common-form {
  .input-text-left input {
    text-align: left;
  }
}
.form-action {
  .el-button {
    margin: 0 5px;
  }
}
</style>