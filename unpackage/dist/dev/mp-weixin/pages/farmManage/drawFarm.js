"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_u_icon2 + _easycom_u_popup2)();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_popup = () => "../../node-modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_popup)();
}
const _sfc_main = {
  __name: "drawFarm",
  setup(__props) {
    const isLoading = common_vendor.ref(true);
    const error = common_vendor.ref("");
    const showMapConfig = common_vendor.ref(false);
    const latitude = common_vendor.ref(39.909);
    const longitude = common_vendor.ref(116.397);
    const scale = common_vendor.ref(14);
    const isMarking = common_vendor.ref(false);
    const points = common_vendor.ref([]);
    const area = common_vendor.ref(0);
    const perimeter = common_vendor.ref(0);
    const currentMovePoint = common_vendor.ref(null);
    const mapSetting = {
      showScale: true,
      // 显示比例尺
      showCompass: false,
      // 隐藏指南针
      showMapText: false,
      // 不显示地图文字
      enableRotate: true,
      // 支持地图旋转
      enableOverlooking: false,
      // 关闭俯视
      enableSatellite: false,
      // 启用卫星图
      enableTraffic: false,
      // 不显示路况
      enableBuilding: false,
      // 不显示3D建筑物
      showLogo: false
      // 隐藏腾讯地图logo
    };
    const mapType = common_vendor.ref("standard");
    common_vendor.ref([
      { name: "标准地图", value: "standard" },
      { name: "卫星地图", value: "satellite" }
    ]);
    common_vendor.ref([
      { name: "灌溉阀", icon: "", checked: false },
      { name: "地块", icon: "", checked: false },
      { name: "施肥机", icon: "", checked: false },
      { name: "灌溉组", icon: "", checked: false },
      { name: "终端设备", icon: "", checked: false },
      { name: "农场设备", icon: "", checked: false },
      { name: "农业组机", icon: "", checked: false }
    ]);
    common_vendor.ref([
      { name: "压力计", icon: "", checked: false },
      { name: "温度采集", icon: "", checked: false }
    ]);
    const markers = common_vendor.computed(() => {
      return points.value.map((point, index) => ({
        id: index + 1,
        latitude: point.latitude,
        longitude: point.longitude,
        width: 24,
        height: 24,
        callout: {
          content: "点" + (index + 1),
          display: "ALWAYS",
          fontSize: 12,
          borderRadius: 4,
          padding: 4,
          bgColor: "#ffffff"
        }
      }));
    });
    const previewLine = common_vendor.computed(() => {
      if (!isMarking.value || !currentMovePoint.value || points.value.length === 0)
        return [];
      return [{
        points: [
          points.value[points.value.length - 1],
          currentMovePoint.value
        ],
        color: "#FFFFFF",
        width: 2,
        dottedLine: true
      }];
    });
    const polylines = common_vendor.computed(() => {
      if (points.value.length < 2)
        return [];
      const lines = [{
        points: points.value,
        color: "#FFFFFF",
        width: 2,
        dottedLine: false,
        arrowLine: false
      }];
      if (previewLine.value.length > 0) {
        lines.push(...previewLine.value);
      }
      return lines;
    });
    const polygons = common_vendor.computed(() => {
      if (points.value.length < 3)
        return [];
      return [{
        points: points.value,
        strokeWidth: 2,
        strokeColor: "#FF4500",
        fillColor: "#FF450033"
      }];
    });
    const mapContext = common_vendor.ref(null);
    const closeMapConfig = () => {
      common_vendor.index.__f__("log", "at pages/farmManage/drawFarm.vue:281", "关闭图层");
      showMapConfig.value = false;
      common_vendor.index.showTabBar();
    };
    const handleMapTypeChange = (type) => {
      if (type !== "standard" && type !== "satellite") {
        common_vendor.index.showToast({
          title: "不支持的地图类型",
          icon: "none"
        });
        return;
      }
      mapType.value = type;
    };
    const handleConfigConfirm = () => {
      mapSetting.enableSatellite = mapType.value === "satellite";
      closeMapConfig();
      common_vendor.index.showToast({
        title: "设置已保存",
        icon: "success"
      });
      common_vendor.index.showTabBar();
    };
    const toggleMarking = () => {
      isMarking.value = !isMarking.value;
      if (!isMarking.value) {
        currentMovePoint.value = null;
      }
      common_vendor.index.showToast({
        title: isMarking.value ? "已开启打点模式" : "已关闭打点模式",
        icon: "none"
      });
    };
    const isLineIntersect = (p1, p2, p3, p4) => {
      const denominator = (p4.longitude - p3.longitude) * (p2.latitude - p1.latitude) - (p4.latitude - p3.latitude) * (p2.longitude - p1.longitude);
      if (denominator === 0)
        return false;
      const ua = ((p4.latitude - p3.latitude) * (p1.longitude - p3.longitude) - (p4.longitude - p3.longitude) * (p1.latitude - p3.latitude)) / denominator;
      const ub = ((p2.latitude - p1.latitude) * (p1.longitude - p3.longitude) - (p2.longitude - p1.longitude) * (p1.latitude - p3.latitude)) / denominator;
      return ua >= 0 && ua <= 1 && (ub >= 0 && ub <= 1);
    };
    const checkLineIntersection = (newPoint) => {
      if (points.value.length < 2)
        return false;
      const lastPoint = points.value[points.value.length - 1];
      for (let i = 0; i < points.value.length - 2; i++) {
        if (isLineIntersect(
          lastPoint,
          newPoint,
          points.value[i],
          points.value[i + 1]
        )) {
          return true;
        }
      }
      return false;
    };
    const canClosePath = (point) => {
      if (points.value.length < 3)
        return false;
      const firstPoint = points.value[0];
      points.value[points.value.length - 1];
      const distanceToStart = calculateDistance(
        point.latitude,
        point.longitude,
        firstPoint.latitude,
        firstPoint.longitude
      );
      return distanceToStart < 10;
    };
    const pointToLineDistance = (point, lineStart, lineEnd) => {
      if (lineStart.latitude === lineEnd.latitude && lineStart.longitude === lineEnd.longitude) {
        return calculateDistance(
          point.latitude,
          point.longitude,
          lineStart.latitude,
          lineStart.longitude
        );
      }
      calculateDistance(
        lineStart.latitude,
        lineStart.longitude,
        lineEnd.latitude,
        lineEnd.longitude
      );
      const t = ((point.longitude - lineStart.longitude) * (lineEnd.longitude - lineStart.longitude) + (point.latitude - lineStart.latitude) * (lineEnd.latitude - lineStart.latitude)) / (Math.pow(lineEnd.longitude - lineStart.longitude, 2) + Math.pow(lineEnd.latitude - lineStart.latitude, 2));
      if (t < 0) {
        return calculateDistance(
          point.latitude,
          point.longitude,
          lineStart.latitude,
          lineStart.longitude
        );
      }
      if (t > 1) {
        return calculateDistance(
          point.latitude,
          point.longitude,
          lineEnd.latitude,
          lineEnd.longitude
        );
      }
      const projectionPoint = {
        latitude: lineStart.latitude + t * (lineEnd.latitude - lineStart.latitude),
        longitude: lineStart.longitude + t * (lineEnd.longitude - lineStart.longitude)
      };
      return calculateDistance(
        point.latitude,
        point.longitude,
        projectionPoint.latitude,
        projectionPoint.longitude
      );
    };
    const isPointTooCloseToLines = (point) => {
      if (points.value.length < 2)
        return false;
      const MIN_DISTANCE = 5;
      for (let i = 0; i < points.value.length - 1; i++) {
        const distance = pointToLineDistance(
          point,
          points.value[i],
          points.value[i + 1]
        );
        if (distance < MIN_DISTANCE) {
          return true;
        }
      }
      return false;
    };
    const checkClosingLineIntersection = () => {
      if (points.value.length < 3)
        return false;
      const firstPoint = points.value[0];
      const lastPoint = points.value[points.value.length - 1];
      for (let i = 1; i < points.value.length - 2; i++) {
        if (isLineIntersect(
          lastPoint,
          firstPoint,
          points.value[i],
          points.value[i + 1]
        )) {
          return true;
        }
      }
      return false;
    };
    const handleMapMove = (e) => {
      if (!isMarking.value || points.value.length === 0)
        return;
      currentMovePoint.value = {
        latitude: e.detail.latitude,
        longitude: e.detail.longitude
      };
    };
    const handleMapTap = (e) => {
      if (!isMarking.value)
        return;
      const newPoint = {
        latitude: e.detail.latitude,
        longitude: e.detail.longitude
      };
      if (points.value.length >= 3 && canClosePath(newPoint)) {
        if (checkClosingLineIntersection()) {
          common_vendor.index.showToast({
            title: "闭合线段不能与其他线段相交",
            icon: "none"
          });
          return;
        }
        points.value.push({ ...points.value[0] });
        calculateAreaAndPerimeter();
        isMarking.value = false;
        currentMovePoint.value = null;
        common_vendor.index.showToast({
          title: "多边形已闭合",
          icon: "success"
        });
        return;
      }
      if (isPointTooCloseToLines(newPoint)) {
        common_vendor.index.showToast({
          title: "不能在线段上打点",
          icon: "none"
        });
        return;
      }
      if (checkLineIntersection(newPoint)) {
        common_vendor.index.showToast({
          title: "线段不能相交",
          icon: "none"
        });
        return;
      }
      points.value.push(newPoint);
      currentMovePoint.value = newPoint;
      if (points.value.length >= 3) {
        calculateAreaAndPerimeter();
      }
    };
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371e3;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
    const calculateAreaAndPerimeter = () => {
      const pts = points.value;
      if (pts.length < 3)
        return;
      let totalDistance = 0;
      for (let i = 0; i < pts.length; i++) {
        const j = (i + 1) % pts.length;
        totalDistance += calculateDistance(
          pts[i].latitude,
          pts[i].longitude,
          pts[j].latitude,
          pts[j].longitude
        );
      }
      perimeter.value = totalDistance;
      let totalArea = 0;
      for (let i = 0; i < pts.length; i++) {
        const j = (i + 1) % pts.length;
        totalArea += (pts[j].longitude - pts[i].longitude) * (2 + Math.sin(pts[i].latitude * Math.PI / 180) + Math.sin(pts[j].latitude * Math.PI / 180));
      }
      area.value = Math.abs(totalArea * 6378137 * 6378137 / 4);
    };
    const formatArea = (areaValue) => {
      if (areaValue < 1e6) {
        return `${areaValue.toFixed(2)} 平方米`;
      } else {
        return `${(areaValue / 1e6).toFixed(2)} 平方公里`;
      }
    };
    const formatDistance = (distance) => {
      if (distance < 1e3) {
        return `${distance.toFixed(2)} 米`;
      } else {
        return `${(distance / 1e3).toFixed(2)} 公里`;
      }
    };
    const handleUndo = () => {
      if (points.value.length > 0) {
        points.value.pop();
      }
    };
    const handleSave = () => {
      if (points.value.length === 0)
        return;
      const markData = {
        points: points.value,
        timestamp: Date.now()
      };
      common_vendor.index.__f__("log", "at pages/farmManage/drawFarm.vue:701", "保存标记数据：", markData);
      common_vendor.index.showToast({
        title: "保存成功",
        icon: "success"
      });
      points.value = [];
      isMarking.value = false;
    };
    const checkPermission = () => {
      return new Promise((resolve, reject) => {
        common_vendor.index.getSetting({
          success: (res) => {
            if (res.authSetting["scope.userLocation"]) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/farmManage/drawFarm.vue:724", "获取设置失败：", err);
            reject(err);
          }
        });
      });
    };
    const requestPermission = () => {
      return new Promise((resolve, reject) => {
        common_vendor.index.authorize({
          scope: "scope.userLocation",
          success: () => {
            resolve(true);
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/farmManage/drawFarm.vue:740", "权限请求失败：", err);
            common_vendor.index.showModal({
              title: "需要位置权限",
              content: "请在小程序设置中开启位置权限",
              confirmText: "去设置",
              success: (res) => {
                if (res.confirm) {
                  common_vendor.index.openSetting({
                    success: (settingRes) => {
                      if (settingRes.authSetting["scope.userLocation"]) {
                        resolve(true);
                      } else {
                        resolve(false);
                      }
                    }
                  });
                } else {
                  resolve(false);
                }
              }
            });
          }
        });
      });
    };
    const getLocationInfo = () => {
      return new Promise((resolve, reject) => {
        common_vendor.index.getLocation({
          type: "gcj02",
          isHighAccuracy: true,
          highAccuracyExpireTime: 3e3,
          success: (res) => {
            resolve(res);
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/farmManage/drawFarm.vue:778", "获取位置失败：", err);
            reject(err);
          }
        });
      });
    };
    const getCurrentLocation = async () => {
      try {
        isLoading.value = true;
        error.value = "";
        const hasPermission = await checkPermission();
        if (!hasPermission) {
          const granted = await requestPermission();
          if (!granted) {
            error.value = "需要位置权限才能使用";
            isLoading.value = false;
            return;
          }
        }
        const location = await getLocationInfo();
        latitude.value = location.latitude;
        longitude.value = location.longitude;
        isLoading.value = false;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/farmManage/drawFarm.vue:813", "位置服务异常：", err);
        error.value = "获取位置失败，请检查定位服务是否开启";
        isLoading.value = false;
      }
    };
    const handleRegionChange = (e) => {
      common_vendor.index.__f__("log", "at pages/farmManage/drawFarm.vue:821", "地图区域改变", e);
    };
    const handleMapUpdated = (e) => {
      common_vendor.index.__f__("log", "at pages/farmManage/drawFarm.vue:826", "地图更新完成", e);
      isLoading.value = false;
    };
    const handleMapError = (e) => {
      common_vendor.index.__f__("error", "at pages/farmManage/drawFarm.vue:832", "地图加载错误：", e);
      error.value = "地图加载失败，请检查网络连接";
      isLoading.value = false;
    };
    const handleRetry = () => {
      getCurrentLocation();
    };
    const handleLayerClick = () => {
      common_vendor.index.__f__("log", "at pages/farmManage/drawFarm.vue:844", "点击图层按钮");
      showMapConfig.value = true;
      common_vendor.index.hideTabBar();
    };
    common_vendor.onMounted(() => {
      getCurrentLocation();
      mapContext.value = common_vendor.index.createMapContext("map");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isLoading.value
      }, isLoading.value ? {} : error.value ? {
        c: common_vendor.t(error.value),
        d: common_vendor.o(handleRetry)
      } : common_vendor.e({
        e: isMarking.value
      }, isMarking.value ? {} : {}, {
        f: latitude.value,
        g: longitude.value,
        h: markers.value,
        i: polylines.value,
        j: polygons.value,
        k: scale.value,
        l: mapType.value === "satellite",
        m: mapSetting,
        n: common_vendor.o(handleRegionChange),
        o: common_vendor.o(handleMapTap),
        p: common_vendor.o(handleMapUpdated),
        q: common_vendor.o(handleMapError),
        r: common_vendor.o(handleMapMove)
      }), {
        b: error.value,
        s: common_vendor.p({
          name: "map",
          size: "20"
        }),
        t: common_vendor.o(handleLayerClick),
        v: common_vendor.p({
          name: "cut",
          size: "20"
        }),
        w: points.value.length > 0
      }, points.value.length > 0 ? {
        x: common_vendor.o(handleUndo)
      } : {}, {
        y: common_vendor.o(toggleMarking),
        z: points.value.length > 0
      }, points.value.length > 0 ? {
        A: common_vendor.o(handleSave)
      } : {}, {
        B: area.value > 0
      }, area.value > 0 ? {
        C: common_vendor.t(formatArea(area.value)),
        D: common_vendor.t(formatDistance(perimeter.value))
      } : {}, {
        E: mapType.value === "standard" ? 1 : "",
        F: common_vendor.o(($event) => handleMapTypeChange("standard")),
        G: mapType.value === "satellite" ? 1 : "",
        H: common_vendor.o(($event) => handleMapTypeChange("satellite")),
        I: common_vendor.o(handleConfigConfirm),
        J: common_vendor.o(closeMapConfig),
        K: common_vendor.p({
          show: showMapConfig.value,
          mode: "bottom",
          round: 10,
          closeable: true,
          overlay: true,
          ["close-on-click-overlay"]: false,
          ["z-index"]: 1e3,
          ["safe-area-inset-bottom"]: true
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/farmManage/drawFarm.js.map
