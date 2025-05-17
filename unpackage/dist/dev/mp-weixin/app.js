"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/index/index.js";
  "./pages/message/message.js";
  "./pages/mine/mine.js";
  "./pages/farmManage/index.js";
  "./pages/farmManage/addFarm.js";
  "./pages/farmManage/drawFarm.js";
  "./pages/farmManage/addPlot.js";
  "./pages/farmManage/drawPlot.js";
}
const _sfc_main = {
  data() {
    return {
      theme: "theme-light"
    };
  },
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:17", "App Launch");
    try {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      common_vendor.index.__f__("log", "at App.vue:21", "系统信息：", systemInfo);
    } catch (e) {
      common_vendor.index.__f__("error", "at App.vue:23", "获取系统信息失败：", e);
    }
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:27", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:30", "App Hide");
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.n($data.theme)
  };
}
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(common_vendor.uviewPlus);
  app.config.globalProperties.$u = {
    // 单位，可选值为px或rpx
    unit: "rpx",
    // 是否开启顶部安全区适配
    safeAreaInsetTop: true,
    // 是否开启底部安全区适配
    safeAreaInsetBottom: true,
    // 主题颜色
    primary: "#0F40F5",
    info: "#909399",
    default: "#909399",
    warning: "#ff9900",
    error: "#fa3534",
    success: "#19be6b"
  };
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
