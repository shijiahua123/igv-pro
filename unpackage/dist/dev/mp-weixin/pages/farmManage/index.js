"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  _easycom_u_button2();
}
const _easycom_u_button = () => "../../node-modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  _easycom_u_button();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const addFarm = () => {
      common_vendor.index.navigateTo({
        url: "/pages/farmManage/addFarm",
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/farmManage/index.vue:15", "页面跳转失败：", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(addFarm),
        b: common_vendor.p({
          type: "primary"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/farmManage/index.js.map
