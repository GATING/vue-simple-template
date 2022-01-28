<template>
  <div class="header justify-end">
    <div class="logo align-center">
      <span>{{ platform.platform_name }}</span>
      <i
        class="ml-10 fs-22 cursor"
        :class="`${collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'}`"
        @click="toggleCollapse"
      ></i>
    </div>

    <el-dropdown @command="command" class="flex-center">
      <div class="pr-20">
        <el-avatar :size="40" :src="avatarPath"></el-avatar>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="info">个人信息</el-dropdown-item>
          <el-dropdown-item command="resetPwd">重置密码</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dialog
      v-model="resetPwdVisible"
      title="重置密码"
      width="400px"
      @close="close"
    >
      <common-form
        ref="resetPwdForm"
        :rules="resetPwdRules"
        :model="resetPwdForm"
        :field-list="resetPwdFieldList"
        label-width="6em"
        confirm-text="确定"
        reset-text="取消"
        action-align="right"
        @search="resetPwd"
        @reset="resetPwdVisible = false"
      />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { validateRequired } from "@comp/validate";
import { resetPwd } from "@/api/user";
export default {
  props: {
    collapse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const commonProps = {
      type: "password",
      showPassword: true,
    };
    const validatePwd = (rule, value, callback) => {
      if (value !== this.resetPwdForm.new_password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      avatarPath:
        "https://cdn.jsdelivr.net/gh/GATING/blog_imgs@master/blog/avatar.png",
      resetPwdVisible: false,
      resetPwdForm: {
        old_password: "",
        new_password: "",
        raw_password: "",
      },
      resetPwdRules: {
        old_password: [validateRequired("请输入旧密码")],
        new_password: [validateRequired("请输入新密码")],
        raw_password: [
          validateRequired("请再次输入密码"),
          { validator: validatePwd, trigger: "blur" },
        ],
      },
      resetPwdFieldList: [
        {
          value: "old_password",
          label: "旧密码",
          component: "el-input",
          extraProps: {
            ...commonProps,
          },
        },
        {
          value: "new_password",
          label: "新密码",
          component: "el-input",
          extraProps: {
            ...commonProps,
          },
        },
        {
          value: "raw_password",
          label: "确认密码",
          component: "el-input",
          extraProps: {
            ...commonProps,
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["platform"]),
  },
  methods: {
    toggleCollapse() {
      this.$emit("update:collapse", !this.collapse);
    },
    command(command) {
      switch (command) {
        case "logout":
          this.$store.dispatch("user/logout");
          break;
        case "resetPwd":
          this.resetPwdVisible = true;
          break;
      }
    },
    close() {
      this.$refs.resetPwdForm.reset();
    },
    async resetPwd() {
      await resetPwd({
        ...this.resetPwdForm,
        user_id: this.$store.getters.info.id,
      });
      this.close();
      this.resetPwdVisible = false;
      this.$message.success("重置密码成功");
    },
  },
};
</script>
<style lang="scss">
.header {
  position: relative;
  width: 100%;
  height: 50px;
  font-size: 16px;
  color: #fff;
  overflow: hidden;
  background: #24292f;
  .logo {
    // width: 146px;
    height: 28px;
    position: absolute;
    top: 50%;
    margin-top: -15px;
    left: 20px;
    background-size: 100% 100%;
  }
}
</style>