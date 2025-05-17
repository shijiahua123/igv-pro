"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  _easycom_u_popup2();
}
const _easycom_u_popup = () => "../../node-modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  _easycom_u_popup();
}
const _sfc_main = {
  __name: "drawFarm",
  setup(__props) {
    const defaultArea = [
      {
        latitude: 31.248507860319165,
        longitude: 121.39593936804681
      },
      {
        latitude: 31.248477941394082,
        longitude: 121.39678339328987
      },
      {
        latitude: 31.2478813169247,
        longitude: 121.39674633851371
      },
      {
        latitude: 31.247824998237835,
        longitude: 121.39595583682228
      }
    ];
    const isDisplayMode = common_vendor.ref(true);
    const isLoading = common_vendor.ref(true);
    const error = common_vendor.ref("");
    const showMapConfig = common_vendor.ref(false);
    const latitude = common_vendor.ref(31.248507860319165);
    const longitude = common_vendor.ref(121.39593936804681);
    const scale = common_vendor.ref(18);
    const isMarking = common_vendor.ref(false);
    const points = common_vendor.ref([]);
    const displayPoints = common_vendor.ref([...defaultArea]);
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
      if (isDisplayMode.value || !isMarking.value)
        return [];
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
        dottedLine: true,
        zIndex: 3
        // 预览线在最上层
      }];
    });
    const polylines = common_vendor.computed(() => {
      if (isDisplayMode.value)
        return [];
      if (!isMarking.value || points.value.length < 2)
        return [];
      const lines = [{
        points: points.value,
        color: "#FFFFFF",
        width: 2,
        dottedLine: false,
        arrowLine: false,
        zIndex: 3
        // 连接线在最上层
      }];
      if (previewLine.value.length > 0) {
        lines.push({
          ...previewLine.value[0],
          zIndex: 3
          // 预览线也在最上层
        });
      }
      return lines;
    });
    const polygons = common_vendor.computed(() => {
      const result = [];
      if (displayPoints.value.length >= 3) {
        result.push({
          points: displayPoints.value,
          strokeWidth: 2,
          strokeColor: "#2979ff",
          fillColor: "#2979ff33",
          zIndex: 1
          // 默认区域在底层
        });
      }
      if (!isDisplayMode.value && points.value.length >= 3) {
        result.push({
          points: points.value,
          strokeWidth: 2,
          strokeColor: "#FF4500",
          fillColor: "#FF450033",
          zIndex: 2
          // 编辑区域在上层
        });
      }
      return result;
    });
    const mapContext = common_vendor.ref(null);
    const closeMapConfig = () => {
      common_vendor.index.__f__("log", "at pages/farmManage/drawFarm.vue:304", "关闭图层");
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
      if (isDisplayMode.value) {
        isDisplayMode.value = false;
        points.value = [];
      }
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
    const isPointInPolygon = (point, polygon) => {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].longitude;
        const yi = polygon[i].latitude;
        const xj = polygon[j].longitude;
        const yj = polygon[j].latitude;
        const intersect = yi > point.latitude !== yj > point.latitude && point.longitude < (xj - xi) * (point.latitude - yi) / (yj - yi) + xi;
        if (intersect)
          inside = !inside;
      }
      return inside;
    };
    const handleMapTap = (e) => {
      if (isDisplayMode.value)
        return;
      if (!isMarking.value)
        return;
      const newPoint = {
        latitude: e.detail.latitude,
        longitude: e.detail.longitude
      };
      if (!isPointInPolygon(newPoint, displayPoints.value)) {
        common_vendor.index.showToast({
          title: "请在蓝色区域内绘制",
          icon: "none"
        });
        return;
      }
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
    const handleUndo = () => {
      if (isDisplayMode.value)
        return;
      if (points.value.length > 0) {
        points.value.pop();
      }
    };
    const handleRelocate = async () => {
      try {
        const hasPermission = await checkPermission();
        if (!hasPermission) {
          const granted = await requestPermission();
          if (!granted) {
            common_vendor.index.showToast({
              title: "需要位置权限才能使用",
              icon: "none"
            });
            return;
          }
        }
        if (!mapContext.value) {
          mapContext.value = common_vendor.index.createMapContext("map");
        }
        mapContext.value.moveToLocation({
          success: () => {
            common_vendor.index.showToast({
              title: "已定位到当前位置",
              icon: "none"
            });
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/farmManage/drawFarm.vue:728", "移动到当前位置失败：", err);
            common_vendor.index.showToast({
              title: "定位失败，请重试",
              icon: "none"
            });
          }
        });
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/farmManage/drawFarm.vue:736", "重新定位失败：", err);
        common_vendor.index.showToast({
          title: "定位失败，请重试",
          icon: "none"
        });
      }
    };
    const handleFitMap = () => {
      if (!mapContext.value) {
        mapContext.value = common_vendor.index.createMapContext("map");
      }
      const pointsToFit = isDisplayMode.value ? displayPoints.value : points.value.length > 0 ? points.value : displayPoints.value;
      if (pointsToFit.length === 0)
        return;
      let minLat = pointsToFit[0].latitude;
      let maxLat = pointsToFit[0].latitude;
      let minLng = pointsToFit[0].longitude;
      let maxLng = pointsToFit[0].longitude;
      pointsToFit.forEach((point) => {
        minLat = Math.min(minLat, point.latitude);
        maxLat = Math.max(maxLat, point.latitude);
        minLng = Math.min(minLng, point.longitude);
        maxLng = Math.max(maxLng, point.longitude);
      });
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;
      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      const maxDiff = Math.max(latDiff, lngDiff);
      let zoomLevel = Math.floor(Math.log2(360 / maxDiff)) + 1;
      zoomLevel = Math.min(Math.max(zoomLevel, 3), 20);
      mapContext.value.includePoints({
        points: pointsToFit,
        padding: [50, 50, 50, 50],
        // 设置内边距，单位px
        success: () => {
          latitude.value = centerLat;
          longitude.value = centerLng;
          scale.value = zoomLevel;
          common_vendor.index.showToast({
            title: "已自适应显示",
            icon: "none"
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/farmManage/drawFarm.vue:804", "设置地图视野失败：", err);
          common_vendor.index.showToast({
            title: "自适应显示失败",
            icon: "none"
          });
        }
      });
    };
    const handleSave = () => {
      if (isDisplayMode.value)
        return;
      if (points.value.length === 0)
        return;
      ({
        points: points.value,
        timestamp: Date.now()
      });
      common_vendor.index.__f__("log", "at pages/farmManage/drawFarm.vue:833", "保存标记数据：", points.value);
      common_vendor.index.showToast({
        title: "保存成功",
        icon: "success"
      });
      isDisplayMode.value = true;
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
            common_vendor.index.__f__("error", "at pages/farmManage/drawFarm.vue:858", "获取设置失败：", err);
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
            common_vendor.index.__f__("error", "at pages/farmManage/drawFarm.vue:874", "权限请求失败：", err);
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
            common_vendor.index.__f__("error", "at pages/farmManage/drawFarm.vue:912", "获取位置失败：", err);
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
        common_vendor.index.__f__("error", "at pages/farmManage/drawFarm.vue:947", "位置服务异常：", err);
        error.value = "获取位置失败，请检查定位服务是否开启";
        isLoading.value = false;
      }
    };
    const handleRegionChange = (e) => {
      common_vendor.index.__f__("log", "at pages/farmManage/drawFarm.vue:955", "地图区域改变", e);
    };
    const handleMapUpdated = (e) => {
      common_vendor.index.__f__("log", "at pages/farmManage/drawFarm.vue:960", "地图更新完成", e);
      isLoading.value = false;
    };
    const handleMapError = (e) => {
      common_vendor.index.__f__("error", "at pages/farmManage/drawFarm.vue:966", "地图加载错误：", e);
      error.value = "地图加载失败，请检查网络连接";
      isLoading.value = false;
    };
    const handleRetry = () => {
      getCurrentLocation();
    };
    common_vendor.onMounted(() => {
      mapContext.value = common_vendor.index.createMapContext("map");
      if (displayPoints.value.length >= 3) {
        const tempPoints = points.value;
        points.value = displayPoints.value;
        calculateAreaAndPerimeter();
        points.value = tempPoints;
        setTimeout(() => {
          handleFitMap();
        }, 1e3);
      }
      setTimeout(() => {
        isLoading.value = false;
      }, 1e3);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isLoading.value
      }, isLoading.value ? {} : error.value ? {
        c: common_vendor.t(error.value),
        d: common_vendor.o(handleRetry)
      } : {
        e: latitude.value,
        f: longitude.value,
        g: markers.value,
        h: polylines.value,
        i: polygons.value,
        j: scale.value,
        k: mapType.value === "satellite",
        l: mapSetting,
        m: common_vendor.o(handleRegionChange),
        n: common_vendor.o(handleMapTap),
        o: common_vendor.o(handleMapUpdated),
        p: common_vendor.o(handleMapError),
        q: common_vendor.o(handleMapMove)
      }, {
        b: error.value,
        r: common_vendor.o(handleRelocate),
        s: common_vendor.o(handleFitMap),
        t: points.value.length > 0
      }, points.value.length > 0 ? {
        v: common_vendor.o(handleUndo)
      } : {}, {
        w: common_vendor.o(toggleMarking),
        x: points.value.length > 0
      }, points.value.length > 0 ? {
        y: common_vendor.o(handleSave)
      } : {}, {
        z: mapType.value === "standard" ? 1 : "",
        A: common_vendor.o(($event) => handleMapTypeChange("standard")),
        B: mapType.value === "satellite" ? 1 : "",
        C: common_vendor.o(($event) => handleMapTypeChange("satellite")),
        D: common_vendor.o(handleConfigConfirm),
        E: common_vendor.o(closeMapConfig),
        F: common_vendor.p({
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
