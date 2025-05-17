"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "mine",
  setup(__props) {
    const goFarmManage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/farmManage/index",
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/mine/mine.vue:88", "页面跳转失败：", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goFarmManage)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/mine.js.map
