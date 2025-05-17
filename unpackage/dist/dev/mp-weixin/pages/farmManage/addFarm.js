"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_form_item2 = common_vendor.resolveComponent("u-form-item");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  (_easycom_u_icon2 + _easycom_u_input2 + _easycom_u_form_item2 + _easycom_u_button2)();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_input = () => "../../node-modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_form_item = () => "../../node-modules/uview-plus/components/u-form-item/u-form-item.js";
const _easycom_u_button = () => "../../node-modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_input + _easycom_u_form_item + _easycom_u_button)();
}
const _sfc_main = {
  __name: "addFarm",
  setup(__props) {
    const formData = common_vendor.reactive({
      name: "",
      location: "",
      blocks: [
        { name: "泵房北001" },
        { name: "地块0002" }
      ]
    });
    const handleSelectLocation = () => {
      common_vendor.index.navigateTo({
        url: "/pages/farmManage/drawFarm"
      });
    };
    const handleCancel = () => {
      common_vendor.index.navigateBack();
    };
    const handleSave = () => {
      if (!formData.name.trim()) {
        common_vendor.index.showToast({
          title: "请输入农场名称",
          icon: "none"
        });
        return;
      }
      if (!formData.location.trim()) {
        common_vendor.index.showToast({
          title: "请选择农场位置",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "保存成功",
        icon: "success",
        duration: 2e3,
        success: () => {
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 2e3);
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "edit-pen",
          size: "20"
        }),
        b: common_vendor.o(($event) => formData.name = $event),
        c: common_vendor.p({
          ["input-align"]: "right",
          placeholder: "请输入农场名称",
          border: "none",
          modelValue: formData.name
        }),
        d: common_vendor.p({
          label: "农场名称",
          required: true,
          borderBottom: true
        }),
        e: common_vendor.p({
          name: "arrow-right",
          size: "20"
        }),
        f: common_vendor.o(handleSelectLocation),
        g: common_vendor.p({
          label: "农场位置",
          borderBottom: true
        }),
        h: common_vendor.p({
          name: "plus-circle",
          size: "20"
        }),
        i: common_vendor.p({
          label: "地块",
          borderBottom: true
        }),
        j: common_vendor.o(handleCancel),
        k: common_vendor.p({
          text: "取消",
          plain: true,
          shape: "circle"
        }),
        l: common_vendor.o(handleSave),
        m: common_vendor.p({
          text: "保存",
          type: "primary",
          shape: "circle"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/farmManage/addFarm.js.map
