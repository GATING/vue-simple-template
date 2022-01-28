<template>
  <page>
    <div class="flex-between">
      <common-form
        inline
        :model="form"
        :field-list="fieldList"
        @search="getData = true"
        @reset="getData = true"
      />

      <el-button type="success">新增</el-button>
    </div>
    <common-table border align="center" :data="tableData" :columns="columns">
      <template #is_public="{ row }">
        <el-switch
          :model-value="row.is_public"
          :active-value="1"
          :inactive-value="0"
        />
      </template>
      <template #is_shared="{ row }">
        <el-switch
          :model-value="row.is_shared"
          :active-value="1"
          :inactive-value="0"
        />
      </template>
      <el-table-column align="center" label="操作" fixed="right" width="180">
        <template>
          <el-button type="primary"> 编辑 </el-button>
        </template>
      </el-table-column>
    </common-table>

    <pagination
      :list.sync="tableData"
      :do-request.sync="getData"
      type="POST"
      url="/api/case_scenario_page"
      :params="form"
    />
  </page>
</template>

<script>
export default {
  data() {
    return {
      form: {
        scenario_title: "",
      },
      fieldList: [
        {
          value: "scenario_title",
          label: "场景名称",
          component: "el-input",
        },
      ],
      getData: false,
      columns: [
        {
          prop: "id",
          label: "ID",
          width: 120,
        },
        {
          prop: "scenario_title",
          label: "场景名称",
        },
        {
          prop: "creator",
          label: "创建者",
          width: 120,
        },
        {
          prop: "create_time",
          label: "创建时间",
          width: 160,
        },
        {
          prop: "modifier",
          label: "操作者",
          width: 120,
        },
        {
          prop: "update_time",
          label: "更新时间",
          width: 160,
        },
        {
          prop: "is_public",
          label: "公开使用",
          scopedSlots: "is_public",
          width: 120,
        },
        {
          prop: "is_shared",
          label: "公开执行",
          scopedSlots: "is_shared",
          width: 120,
        },
      ],
      tableData: [],
      executeId: null,
      executeVisible: false,
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>