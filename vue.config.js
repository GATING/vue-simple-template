const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const port = process.env.port || process.env.npm_config_port || 8848;

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: isDevelopment,
  productionSourceMap: false,
  // 默认值，仅作用于生产构建，是否启用多进程打包
  // parallel: require('os').cpus().length > 1,
  devServer: {
    port,
    open: true,
    // 让浏览器 overlay 显示错误
    overlay: {
      warnings: false,
      errors: true,
    },
    disableHostCheck: true,
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
  css: {
    loaderOptions: {
      // 配置全局变量
      sass: {
        // 注意：在 sass-loader v7 中，这个选项名是 "data"
        // 在 sass-loader v10 中，这个选项名是 additionalData
        prependData: `
          @import "~@/styles/variables";
          @import "~@/styles/mixins";
        `,
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
        "@api": resolve("src/api"),
        "@util": resolve("src/utils"),
        "@view": resolve("src/views"),
        "@style": resolve("src/styles"),
        "@plugin": resolve("src/plugins"),
        "@comp": resolve("src/components"),
      },
    },
  },
  chainWebpack(config) {
    // 预加载，它可以提高第一屏的速度，建议打开
    config.plugin("preload").tap(() => [
      {
        rel: "preload",
        // 添加忽略 runtime.js，vue-cli默认没有 runtime
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: "initial",
      },
    ]);

    // 预读取，当有很多页面时，会导致太多无意义的请求
    config.plugins.delete("prefetch");

    config.when(!isDevelopment, (config) => {
      // 删除生产环境下的console和debugger
      config.optimization
        .minimize(true)
        .minimizer("terser")
        .tap((args) => {
          let { terserOptions } = args[0];
          terserOptions.compress.drop_console = true;
          terserOptions.compress.drop_debugger = true;
          return args;
        });

      // 利用 splitChunks 单独打包第三方模块
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs", // 抽离后的名字
            test: /[\\/]node_modules[\\/]/, // 匹配对应目录
            priority: 10, // 优先级，数字越大优先级越高，默认为0
            chunks: "initial", // 打包规则，通常用initial，标识非动态模块打进该vendor，动态模块优化打包
          },
          vant: {
            name: "chunk-vant",
            priority: 20,
            test: /[\\/]node_modules[\\/]_?vant(.*)/,
          },
          elementUI: {
            name: "chunk-elementUI",
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"),
            minChunks: 3, // 模块被引用3次以上的才抽离
            priority: 5,
            reuseExistingChunk: true, // 重复使用已经打包过的模块。即，如果之前已经打包过了，则使用之前的模块，而不会进行再次打包
          },
          echarts: {
            name: "chunk-echarts",
            test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
            chunks: "all", // 匹配文件，无论是否动态模块，都打包进该vendor
            priority: 4,
            reuseExistingChunk: true,
          },
        },
      });
      config.optimization.runtimeChunk("single");
    });
  },
};
