"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_line2 = common_vendor.resolveComponent("u-line");
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  (_easycom_u_icon2 + _easycom_u_line2 + _easycom_u_image2)();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_line = () => "../../node-modules/uview-plus/components/u-line/u-line.js";
const _easycom_u_image = () => "../../node-modules/uview-plus/components/u-image/u-image.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_line + _easycom_u_image)();
}
const SCROLL_STEP = 200;
const _sfc_main = {
  __name: "mine",
  setup(__props) {
    const goFarmManage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/farmManage/index",
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/mine/mine.vue:137", "页面跳转失败：", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const scrollLeft = common_vendor.ref(0);
    const scrollWidth = common_vendor.ref(0);
    const containerWidth = common_vendor.ref(0);
    common_vendor.ref(null);
    common_vendor.onMounted(() => {
      setTimeout(() => {
        const query = common_vendor.index.createSelectorQuery();
        query.select(".list-wrapper").boundingClientRect((data) => {
          if (data) {
            scrollWidth.value = data.width;
          }
        }).exec();
        query.select(".assets-list").boundingClientRect((data) => {
          if (data) {
            containerWidth.value = data.width;
          }
        }).exec();
      }, 100);
    });
    const handleScrollLeft = () => {
      const newScrollLeft = Math.max(0, scrollLeft.value - SCROLL_STEP);
      scrollLeft.value = newScrollLeft;
    };
    const handleScrollRight = () => {
      const maxScroll = Math.max(0, scrollWidth.value - containerWidth.value);
      const newScrollLeft = Math.min(maxScroll, scrollLeft.value + SCROLL_STEP);
      scrollLeft.value = newScrollLeft;
    };
    const handleScroll = (e) => {
      scrollLeft.value = e.detail.scrollLeft;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "edit-pen",
          color: "#fff",
          size: "20"
        }),
        b: common_vendor.p({
          name: "reload",
          color: "#999",
          size: "18"
        }),
        c: common_vendor.p({
          color: "#ccc",
          direction: "vertical",
          length: "80rpx",
          margin: "0 20rpx",
          ["hair-line"]: "false"
        }),
        d: common_vendor.p({
          name: "arrow-left",
          color: "#666",
          size: "20"
        }),
        e: common_vendor.o(handleScrollLeft),
        f: scrollLeft.value,
        g: common_vendor.o(handleScroll),
        h: common_vendor.o(() => {
        }),
        i: common_vendor.o(() => {
        }),
        j: common_vendor.p({
          name: "arrow-right",
          color: "#666",
          size: "20"
        }),
        k: common_vendor.o(handleScrollRight),
        l: common_vendor.p({
          width: "100rpx",
          height: "100rpx",
          ["custom-style"]: {
            backgroundColor: "transparent !important"
          },
          src: common_assets._imports_0
        }),
        m: common_vendor.p({
          width: "100rpx",
          height: "100rpx",
          ["custom-style"]: {
            backgroundColor: "transparent !important"
          },
          src: common_assets._imports_1
        }),
        n: common_vendor.o(goFarmManage),
        o: common_vendor.p({
          width: "100rpx",
          height: "100rpx",
          ["custom-style"]: {
            backgroundColor: "transparent !important"
          },
          src: common_assets._imports_2
        }),
        p: common_vendor.p({
          width: "100rpx",
          height: "100rpx",
          ["custom-style"]: {
            backgroundColor: "transparent !important"
          },
          src: common_assets._imports_3
        }),
        q: common_vendor.p({
          width: "100rpx",
          height: "100rpx",
          ["custom-style"]: {
            backgroundColor: "transparent !important"
          },
          src: common_assets._imports_4
        }),
        r: common_vendor.p({
          width: "100rpx",
          height: "100rpx",
          ["custom-style"]: {
            backgroundColor: "transparent !important"
          },
          src: common_assets._imports_5
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/mine.js.map
