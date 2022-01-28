<template>
  <div class="home-hero-container justify-center">
    <div>
      <div class="ptb-40 justify-center text-white">
        <svg
          height="48"
          aria-hidden="true"
          viewBox="0 0 16 16"
          version="1.1"
          width="48"
          data-view-component="true"
          class="octicon"
        >
          <path
            fill-rule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          ></path>
        </svg>
      </div>
      <h1 class="flex-center text-white fs-24 mb-20">
        {{ platform.platform_login_msg }}
      </h1>
      <div class="form-container">
        <common-form
          :model="form"
          :field-list="fieldList"
          label-position="left"
          @search="login"
        >
          <template #actions>
            <el-button class="wp-100" type="success" @click="login"
              >GO</el-button
            >
          </template>
        </common-form>
      </div>

      <div class="pt-20 card-container">
        <el-card shadow="always">
          <div class="flex-center">
            <el-link href="javascript:;" type="primary" @click="tourist">
              Get a guest account
            </el-link>
          </div>
        </el-card>
      </div>

      <div v-if="touristAccount.username" class="pt-20 card-container">
        <el-card shadow="always" class="text-white">
          <div class="flex mb-5">
            <span class="mr-20">Username:</span>
            <span>{{ touristAccount.username }}</span>
          </div>
          <div class="flex">
            <span class="mr-20">Password:</span>
            <span>{{ touristAccount.password }}</span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { tourist } from "@/api/user";
import { validateRequired } from "@comp/validate";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      fieldList: [
        {
          value: "username",
          label: "Username",
          component: "el-input",
          extraProps: {
            placeholder: "Username",
          },
        },
        {
          value: "password",
          label: "Password",
          component: "el-input",
          extraProps: {
            placeholder: "Password",
            type: "password",
            "show-password": true,
          },
        },
      ],
      rules: {
        username: [validateRequired("请输入")],
        password: [validateRequired("请输入")],
      },
      touristAccount: {
        username: "",
        password: "",
      },
    };
  },
  computed: {
    ...mapGetters(["platform"]),
  },
  methods: {
    async login() {
      await this.$store.dispatch("user/login", this.form);
      this.$message.success("登录成功");
      this.$router.push({
        path: "/",
      });
    },
    async tourist() {
      if (this.touristAccount.username) return;
      this.touristAccount = await tourist();
    },
  },
};
</script>

<style lang="scss" scoped>
$bg-color: #0d1117;
$text-color: #c9d1d9;
.home-hero-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #040d21;
  align-items: flex-start;
}
.form-container {
  width: 308px;
  padding: 20px;
  font-size: 14px;
  background-color: rgba($color: #161b22, $alpha: 0.6);
  border: 1px solid #21262d;
  border-top: 1px solid #21262d;
  border-radius: 6px;
  ::v-deep {
    .el-form-item {
      flex-wrap: wrap;
    }
    .el-form-item__label {
      width: 100%;
      color: $text-color;
    }
    .el-input__inner {
      padding: 5px 12px;
      font-size: 14px;
      line-height: 20px;
      color: $text-color;
      vertical-align: middle;
      background-color: $bg-color;
      background-repeat: no-repeat;
      background-position: right 8px center;
      border: 1px solid #30363d;
      border-radius: 6px;
      outline: none;
      box-shadow: $bg-color;
    }
    .el-input__inner:-webkit-autofill {
      -webkit-text-fill-color: $text-color;
    }
    .el-input__inner:-webkit-autofill {
      box-shadow: inset 0 0 0 32px $bg-color !important;
    }
    .el-input__inner:focus {
      border-color: #1f6feb;
      outline: none;
    }
  }
}
.octicon {
  display: inline-block;
  overflow: visible !important;
  vertical-align: text-bottom;
  fill: currentColor;
}
.card-container {
  .el-card {
    border: none;
    background-color: rgba($color: #161b22, $alpha: 0.6);
    .el-link.el-link--primary {
      color: #58a6ff;
      &::after {
        border-color: #58a6ff;
      }
    }
  }
}
</style>