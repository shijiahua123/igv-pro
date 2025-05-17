"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  (_easycom_u_icon2 + _easycom_u_input2 + _easycom_u_button2)();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_input = () => "../../node-modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_button = () => "../../node-modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_input + _easycom_u_button)();
}
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const username = common_vendor.ref("");
    const password = common_vendor.ref("");
    const handleLogin = () => {
      if (!username.value || !password.value) {
        common_vendor.index.showToast({
          title: "请输入账号和密码",
          icon: "none"
        });
        return;
      }
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    };
    const handlePhoneLogin = () => {
      common_vendor.index.showToast({
        title: "手机号登录功能开发中",
        icon: "none"
      });
    };
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/login/login.vue:129", "Login page mounted");
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "account",
          size: "44rpx",
          color: "#999999",
          customStyle: "margin-right: 20rpx"
        }),
        b: common_vendor.o(($event) => username.value = $event),
        c: common_vendor.p({
          placeholder: "输入账号",
          border: false,
          customStyle: {
            backgroundColor: "#F5F7FA",
            padding: "20rpx 44rpx",
            borderRadius: "45rpx",
            height: "23rpx",
            lineHeight: "23rpx"
          },
          placeholderStyle: "color: #999999;font-size: 32rpx;line-height: 23rpx;",
          modelValue: username.value
        }),
        d: common_vendor.p({
          name: "lock",
          size: "44rpx",
          color: "#999999",
          customStyle: "margin-right: 20rpx"
        }),
        e: common_vendor.o(($event) => password.value = $event),
        f: common_vendor.p({
          type: "password",
          placeholder: "输入密码",
          border: false,
          customStyle: {
            backgroundColor: "#F5F7FA",
            padding: "20rpx 44rpx",
            borderRadius: "45rpx",
            height: "23rpx",
            lineHeight: "23rpx"
          },
          placeholderStyle: "color: #999999;font-size: 32rpx;line-height: 23rpx;",
          modelValue: password.value
        }),
        g: common_vendor.o(handleLogin),
        h: common_vendor.p({
          text: "开启灌溉系统",
          customStyle: {
            background: "linear-gradient(270deg, #0F40F5 0%, #45A4FF 100%)",
            color: "#FFFFFF",
            height: "90rpx",
            borderRadius: "45rpx",
            border: "none",
            fontSize: "32rpx",
            fontWeight: "500"
          }
        }),
        i: common_vendor.o(handlePhoneLogin),
        j: common_vendor.p({
          text: "手机号码登录",
          customStyle: {
            background: "#F5F7FA",
            color: "#666666",
            height: "90rpx",
            borderRadius: "45rpx",
            border: "none",
            fontSize: "32rpx",
            fontWeight: "400"
          }
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
