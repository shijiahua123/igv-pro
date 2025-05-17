<template>
	<view class="container">
		<!-- 加载状态 -->
		<view v-if="isLoading" class="loading-container">
			<text>地图加载中...</text>
		</view>
		
		<!-- 错误提示 -->
		<view v-else-if="error" class="error-container">
			<text>{{ error }}</text>
			<button @tap="handleRetry" class="retry-btn">重试</button>
		</view>
		
		<!-- 地图组件 -->
		<map
			v-else
			id="map"
			class="map"
			:latitude="latitude"
			:longitude="longitude"
			:markers="markers"
			:polyline="polylines"
			:polygons="polygons"
			:scale="scale"
			:enable-zoom="true"
			:enable-scroll="true"
			:enable-rotate="true"
			show-location
			show-scale
			:satellite="mapType === 'satellite'"
			:setting="mapSetting"
			@regionchange="handleRegionChange"
			@tap="handleMapTap"
			@updated="handleMapUpdated"
			@error="handleMapError"
			@move="handleMapMove"
		>
			<view class="map-crosshair" v-if="isMarking"></view>
		</map>

		<!-- 顶部工具栏 -->
		<view class="top-toolbar">
			<view class="tool-box" @tap="handleLayerClick">
				<text>图层</text>
			</view>
			<view class="tool-box" @tap="handleSearch">
				<text>搜索</text>
			</view>
			<view class="tool-box" @tap="handleRelocate">
				<text>定位</text>
			</view>
		</view>

		<!-- 底部工具栏 -->
		<view class="bottom-toolbar">
			<view class="tool-box" @tap="handleUndo" v-if="points.length > 0">
				<text>撤销</text>
			</view>
			<view class="tool-box" @tap="toggleMarking">
				<text>打点</text>
			</view>
			<view class="tool-box" @tap="handleSave" v-if="points.length > 0">
				<text>保存</text>
			</view>
		</view>

		<!-- 面积信息 -->
		<view class="info-panel" v-if="area > 0">
			<text>面积: {{ formatArea(area) }}</text>
			<text>周长: {{ formatDistance(perimeter) }}</text>
		</view>

		<!-- 地图配置弹出层 -->
		<u-popup
			:show="showMapConfig"
			mode="bottom"
			:round="10"
			:closeable="true"
			:overlay="true"
			:close-on-click-overlay="false"
			:z-index="1000"
			:safe-area-inset-bottom="true"
			@close="closeMapConfig"
		>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">图层设置</text>
				</view>
				
				<view class="popup-body">
					<!-- 地图类型 -->
					<view class="section">
						<text class="section-title">地图类型</text>
						<view class="radio-group">
							<view 
								class="radio-item" 
								:class="{ active: mapType === 'standard' }"
								@tap="handleMapTypeChange('standard')"
							>
								<text>标准地图</text>
							</view>
							<view 
								class="radio-item"
								:class="{ active: mapType === 'satellite' }"
								@tap="handleMapTypeChange('satellite')"
							>
								<text>卫星地图</text>
							</view>
						</view>
					</view>

					<!-- 地图显示 -->
					<!-- <view class="section">
						<text class="section-title">地图显示</text>
						<view class="switch-list">
							<view class="switch-item" v-for="(item, index) in displayItems" :key="index">
								<text>{{ item.name }}</text>
								<switch 
									:checked="item.checked"
									@change="(e) => item.checked = e.detail.value"
									color="#0F40F5"
								/>
							</view>
						</view>
					</view> -->

					<!-- 扩展设备 -->
					<!-- <view class="section">
						<text class="section-title">扩展的输入设备</text>
						<view class="switch-list">
							<view class="switch-item" v-for="(item, index) in deviceItems" :key="index">
								<text>{{ item.name }}</text>
								<switch 
									:checked="item.checked"
									@change="(e) => item.checked = e.detail.value"
									color="#0F40F5"
								/>
							</view>
						</view>
					</view> -->
				</view>

				<view class="popup-footer">
					<button class="confirm-btn" @tap="handleConfigConfirm">确定</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// 加载状态
const isLoading = ref(true)
const error = ref('')

// 图层配置显示状态
const showMapConfig = ref(false)

// 地图中心点坐标
const latitude = ref(39.909)
const longitude = ref(116.397)
const scale = ref(14)

// 打点模式
const isMarking = ref(false)
const points = ref([])
const area = ref(0)
const perimeter = ref(0)

// 当前移动点的位置
const currentMovePoint = ref(null)

// 地图设置
const mapSetting = {
	showScale: true,        // 显示比例尺
	showCompass: false,     // 隐藏指南针
	showMapText: false,     // 不显示地图文字
	enableRotate: true,     // 支持地图旋转
	enableOverlooking: false,// 关闭俯视
	enableSatellite: false,  // 启用卫星图
	enableTraffic: false,   // 不显示路况
	enableBuilding: false,  // 不显示3D建筑物
	showLogo: false        // 隐藏腾讯地图logo
}

// 地图配置相关
const mapType = ref('standard') // 地图类型：standard-标准地图，satellite-卫星地图

// 地图类型选项
const mapTypes = ref([
	{ name: '标准地图', value: 'standard' },
	{ name: '卫星地图', value: 'satellite' }
])

// 修改显示项数据结构
const displayItems = ref([
	{ name: '灌溉阀', icon: '', checked: false },
	{ name: '地块', icon: '', checked: false },
	{ name: '施肥机', icon: '', checked: false },
	{ name: '灌溉组', icon: '', checked: false },
	{ name: '终端设备', icon: '', checked: false },
	{ name: '农场设备', icon: '', checked: false },
	{ name: '农业组机', icon: '', checked: false }
])

// 修改设备项数据结构
const deviceItems = ref([
	{ name: '压力计', icon: '', checked: false },
	{ name: '温度采集', icon: '', checked: false }
])

// 计算属性：标记点
const markers = computed(() => {
	return points.value.map((point, index) => ({
		id: index + 1,
		latitude: point.latitude,
		longitude: point.longitude,
		width: 24,
		height: 24,
		callout: {
			content: '点' + (index + 1),
			display: 'ALWAYS',
			fontSize: 12,
			borderRadius: 4,
			padding: 4,
			bgColor: '#ffffff'
		}
	}))
})

// 计算属性：预览线
const previewLine = computed(() => {
	if (!isMarking.value || !currentMovePoint.value || points.value.length === 0) return []
	
	return [{
		points: [
			points.value[points.value.length - 1],
			currentMovePoint.value
		],
		color: '#FFFFFF',
		width: 2,
		dottedLine: true
	}]
})

// 计算属性：所有线段
const polylines = computed(() => {
	if (points.value.length < 2) return []
	
	const lines = [{
		points: points.value,
		color: '#FFFFFF',
		width: 2,
		dottedLine: false,
		arrowLine: false
	}]
	
	// 添加预览线
	if (previewLine.value.length > 0) {
		lines.push(...previewLine.value)
	}
	
	return lines
})

// 计算属性：多边形
const polygons = computed(() => {
	if (points.value.length < 3) return []
	return [{
		points: points.value,
		strokeWidth: 2,
		strokeColor: '#FF4500',
		fillColor: '#FF450033'
	}]
})

// 地图实例
const mapContext = ref(null)

// 关闭配置面板
const closeMapConfig = () => {
	console.log('关闭图层')
	showMapConfig.value = false
	uni.showTabBar()
}

// 切换地图类型
const handleMapTypeChange = (type) => {
	if (type !== 'standard' && type !== 'satellite') {
		uni.showToast({
			title: '不支持的地图类型',
			icon: 'none'
		})
		return
	}
	
	mapType.value = type
	
	// 更新地图设置
	// mapSetting.enableSatellite = type === 'satellite'
	
	// uni.showToast({
	// 	title: type === 'standard' ? '已切换为标准地图' : '已切换为卫星地图',
	// 	icon: 'none'
	// })
}

// 确认配置
const handleConfigConfirm = () => {
		// 更新地图设置
	mapSetting.enableSatellite = mapType.value === 'satellite'

	closeMapConfig()
	// 这里可以添加保存配置的逻辑
	uni.showToast({
		title: '设置已保存',
		icon: 'success'
	})

	// 显示底部导航栏
	uni.showTabBar()
}

// 切换打点模式
const toggleMarking = () => {
	// 切换打点状态
	isMarking.value = !isMarking.value
	
	// 如果关闭打点模式，清除当前移动点
	if (!isMarking.value) {
		currentMovePoint.value = null
	}
	
	// 显示提示
	uni.showToast({
		title: isMarking.value ? '已开启打点模式' : '已关闭打点模式',
		icon: 'none'
	})
}

// 检查线段相交
const isLineIntersect = (p1, p2, p3, p4) => {
	const denominator = ((p4.longitude - p3.longitude) * (p2.latitude - p1.latitude)) -
		((p4.latitude - p3.latitude) * (p2.longitude - p1.longitude))
	
	if (denominator === 0) return false
	
	const ua = (((p4.latitude - p3.latitude) * (p1.longitude - p3.longitude)) -
		((p4.longitude - p3.longitude) * (p1.latitude - p3.latitude))) / denominator
	const ub = (((p2.latitude - p1.latitude) * (p1.longitude - p3.longitude)) -
		((p2.longitude - p1.longitude) * (p1.latitude - p3.latitude))) / denominator
	
	return (ua >= 0 && ua <= 1) && (ub >= 0 && ub <= 1)
}

// 检查新线段是否与已有线段相交
const checkLineIntersection = (newPoint) => {
	if (points.value.length < 2) return false
	
	const lastPoint = points.value[points.value.length - 1]
	
	// 检查与除最后一条线段外的所有线段
	for (let i = 0; i < points.value.length - 2; i++) {
		if (isLineIntersect(
			lastPoint,
			newPoint,
			points.value[i],
			points.value[i + 1]
		)) {
			return true
		}
	}
	
	return false
}

// 检查是否可以闭合多边形
const canClosePath = (point) => {
	if (points.value.length < 3) return false
	
	const firstPoint = points.value[0]
	const lastPoint = points.value[points.value.length - 1]
	
	// 计算与起点的距离（米）
	const distanceToStart = calculateDistance(
		point.latitude,
		point.longitude,
		firstPoint.latitude,
		firstPoint.longitude
	)
	
	// 如果距离起点小于10米，认为可以闭合
	return distanceToStart < 10
}

// 计算点到线段的距离
const pointToLineDistance = (point, lineStart, lineEnd) => {
	// 如果线段起点和终点重合，直接返回点到起点的距离
	if (lineStart.latitude === lineEnd.latitude && lineStart.longitude === lineEnd.longitude) {
		return calculateDistance(
			point.latitude,
			point.longitude,
			lineStart.latitude,
			lineStart.longitude
		)
	}
	
	// 计算线段长度的平方
	const lineLength = calculateDistance(
		lineStart.latitude,
		lineStart.longitude,
		lineEnd.latitude,
		lineEnd.longitude
	)
	
	// 计算点到线段的投影位置
	const t = ((point.longitude - lineStart.longitude) * (lineEnd.longitude - lineStart.longitude) +
		(point.latitude - lineStart.latitude) * (lineEnd.latitude - lineStart.latitude)) /
		(Math.pow(lineEnd.longitude - lineStart.longitude, 2) + Math.pow(lineEnd.latitude - lineStart.latitude, 2))
	
	// 如果投影点在线段外部，返回到最近端点的距离
	if (t < 0) {
		return calculateDistance(
			point.latitude,
			point.longitude,
			lineStart.latitude,
			lineStart.longitude
		)
	}
	if (t > 1) {
		return calculateDistance(
			point.latitude,
			point.longitude,
			lineEnd.latitude,
			lineEnd.longitude
		)
	}
	
	// 计算投影点坐标
	const projectionPoint = {
		latitude: lineStart.latitude + t * (lineEnd.latitude - lineStart.latitude),
		longitude: lineStart.longitude + t * (lineEnd.longitude - lineStart.longitude)
	}
	
	// 返回点到投影点的距离
	return calculateDistance(
		point.latitude,
		point.longitude,
		projectionPoint.latitude,
		projectionPoint.longitude
	)
}

// 检查点是否太靠近任何线段
const isPointTooCloseToLines = (point) => {
	if (points.value.length < 2) return false
	
	const MIN_DISTANCE = 5 // 最小允许距离（米）
	
	// 检查与所有线段的距离
	for (let i = 0; i < points.value.length - 1; i++) {
		const distance = pointToLineDistance(
			point,
			points.value[i],
			points.value[i + 1]
		)
		
		if (distance < MIN_DISTANCE) {
			return true
		}
	}
	
	return false
}

// 检查闭合线段是否与其他线段相交
const checkClosingLineIntersection = () => {
	if (points.value.length < 3) return false
	
	const firstPoint = points.value[0]
	const lastPoint = points.value[points.value.length - 1]
	
	// 检查与除首尾点外的所有线段
	for (let i = 1; i < points.value.length - 2; i++) {
		if (isLineIntersect(
			lastPoint,
			firstPoint,
			points.value[i],
			points.value[i + 1]
		)) {
			return true
		}
	}
	
	return false
}

// 处理地图移动
const handleMapMove = (e) => {
	if (!isMarking.value || points.value.length === 0) return
	
	// 更新当前移动点的位置
	currentMovePoint.value = {
		latitude: e.detail.latitude,
		longitude: e.detail.longitude
	}
}

// 处理地图点击
const handleMapTap = (e) => {
	if (!isMarking.value) return
	
	const newPoint = {
		latitude: e.detail.latitude,
		longitude: e.detail.longitude
	}
	
	// 检查是否可以闭合
	if (points.value.length >= 3 && canClosePath(newPoint)) {
		// 检查闭合线段是否会导致相交
		if (checkClosingLineIntersection()) {
			uni.showToast({
				title: '闭合线段不能与其他线段相交',
				icon: 'none'
			})
			return
		}
		
		// 闭合多边形，使用第一个点作为终点
		points.value.push({...points.value[0]})
		calculateAreaAndPerimeter()
		isMarking.value = false // 自动关闭打点模式
		currentMovePoint.value = null // 清除移动点
		uni.showToast({
			title: '多边形已闭合',
			icon: 'success'
		})
		return
	}
	
	// 检查点是否太靠近任何线段
	if (isPointTooCloseToLines(newPoint)) {
		uni.showToast({
			title: '不能在线段上打点',
			icon: 'none'
		})
		return
	}
	
	// 检查新线段是否与已有线段相交
	if (checkLineIntersection(newPoint)) {
		uni.showToast({
			title: '线段不能相交',
			icon: 'none'
		})
		return
	}
	
	// 添加新的点
	points.value.push(newPoint)
	
	// 更新当前移动点的位置
	currentMovePoint.value = newPoint
	
	// 如果是多边形模式且有3个以上的点，计算面积
	if (points.value.length >= 3) {
		calculateAreaAndPerimeter()
	}
}

// 计算两点之间的距离（米）
const calculateDistance = (lat1, lon1, lat2, lon2) => {
	const R = 6371000 // 地球半径（米）
	const dLat = (lat2 - lat1) * Math.PI / 180
	const dLon = (lon2 - lon1) * Math.PI / 180
	const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
		Math.sin(dLon/2) * Math.sin(dLon/2)
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
	return R * c
}

// 计算多边形面积和周长
const calculateAreaAndPerimeter = () => {
	const pts = points.value
	if (pts.length < 3) return

	// 计算周长
	let totalDistance = 0
	for (let i = 0; i < pts.length; i++) {
		const j = (i + 1) % pts.length
		totalDistance += calculateDistance(
			pts[i].latitude,
			pts[i].longitude,
			pts[j].latitude,
			pts[j].longitude
		)
	}
	perimeter.value = totalDistance

	// 计算面积（使用球面多边形面积公式）
	let totalArea = 0
	for (let i = 0; i < pts.length; i++) {
		const j = (i + 1) % pts.length
		totalArea += (pts[j].longitude - pts[i].longitude) *
			(2 + Math.sin(pts[i].latitude * Math.PI / 180) +
			 Math.sin(pts[j].latitude * Math.PI / 180))
	}
	area.value = Math.abs(totalArea * 6378137 * 6378137 / 4)
}

// 格式化面积显示
const formatArea = (areaValue) => {
	if (areaValue < 1000000) {
		return `${(areaValue).toFixed(2)} 平方米`
	} else {
		return `${(areaValue / 1000000).toFixed(2)} 平方公里`
	}
}

// 格式化距离显示
const formatDistance = (distance) => {
	if (distance < 1000) {
		return `${distance.toFixed(2)} 米`
	} else {
		return `${(distance / 1000).toFixed(2)} 公里`
	}
}

// 撤销上一个点
const handleUndo = () => {
	if (points.value.length > 0) {
		points.value.pop()
	}
}

// 重新定位
const handleRelocate = async () => {
	try {
		// 检查是否已有权限
		const hasPermission = await checkPermission()
		
		// 如果没有权限，请求权限
		if (!hasPermission) {
			const granted = await requestPermission()
			if (!granted) {
				uni.showToast({
					title: '需要位置权限才能使用',
					icon: 'none'
				})
				return
			}
		}
		
		// 如果地图实例不存在，初始化它
		if (!mapContext.value) {
			mapContext.value = uni.createMapContext('map')
		}
		
		// 使用moveToLocation方法移动到当前位置
		mapContext.value.moveToLocation({
			success: () => {
				uni.showToast({
					title: '已定位到当前位置',
					icon: 'none'
				})
			},
			fail: (err) => {
				console.error('移动到当前位置失败：', err)
				uni.showToast({
					title: '定位失败，请重试',
					icon: 'none'
				})
			}
		})
	} catch (err) {
		console.error('重新定位失败：', err)
		uni.showToast({
			title: '定位失败，请重试',
			icon: 'none'
		})
	}
}

// 搜索位置
const handleSearch = () => {
	uni.showToast({
		title: '搜索功能开发中',
		icon: 'none'
	})
}

// 保存标记
const handleSave = () => {
	if (points.value.length === 0) return
	
	const markData = {
		points: points.value,
		timestamp: Date.now()
	}
	
	console.log('保存标记数据：', markData)
	uni.showToast({
		title: '保存成功',
		icon: 'success'
	})
	
	// 清除当前标记
	points.value = []
	isMarking.value = false
}

// 检查权限状态
const checkPermission = () => {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success: (res) => {
				if (res.authSetting['scope.userLocation']) {
					resolve(true)
				} else {
					resolve(false)
				}
			},
			fail: (err) => {
				console.error('获取设置失败：', err)
				reject(err)
			}
		})
	})
}

// 获取位置权限
const requestPermission = () => {
	return new Promise((resolve, reject) => {
		uni.authorize({
			scope: 'scope.userLocation',
			success: () => {
				resolve(true)
			},
			fail: (err) => {
				console.error('权限请求失败：', err)
				// 引导用户去设置页面开启
				uni.showModal({
					title: '需要位置权限',
					content: '请在小程序设置中开启位置权限',
					confirmText: '去设置',
					success: (res) => {
						if (res.confirm) {
							uni.openSetting({
								success: (settingRes) => {
									if (settingRes.authSetting['scope.userLocation']) {
										resolve(true)
									} else {
										resolve(false)
									}
								}
							})
						} else {
							resolve(false)
						}
					}
				})
			}
		})
	})
}

// 获取位置信息
const getLocationInfo = () => {
	return new Promise((resolve, reject) => {
		uni.getLocation({
			type: 'gcj02',
			isHighAccuracy: true,
			highAccuracyExpireTime: 3000,
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				console.error('获取位置失败：', err)
				reject(err)
			}
		})
	})
}

// 获取当前位置
const getCurrentLocation = async () => {
	try {
		isLoading.value = true
		error.value = ''
		
		// 检查是否已有权限
		const hasPermission = await checkPermission()
		
		// 如果没有权限，请求权限
		if (!hasPermission) {
			const granted = await requestPermission()
			if (!granted) {
				error.value = '需要位置权限才能使用'
				isLoading.value = false
				return
			}
		}

		// 获取位置
		const location = await getLocationInfo()
		
		// 更新地图中心点和标记点
		latitude.value = location.latitude
		longitude.value = location.longitude
		
		isLoading.value = false
	} catch (err) {
		console.error('位置服务异常：', err)
		error.value = '获取位置失败，请检查定位服务是否开启'
		isLoading.value = false
	}
}

// 地图区域改变事件
const handleRegionChange = (e) => {
	console.log('地图区域改变', e)
}

// 地图更新事件
const handleMapUpdated = (e) => {
	console.log('地图更新完成', e)
	isLoading.value = false
}

// 地图错误事件
const handleMapError = (e) => {
	console.error('地图加载错误：', e)
	error.value = '地图加载失败，请检查网络连接'
	isLoading.value = false
}

// 重试按钮点击事件
const handleRetry = () => {
	getCurrentLocation()
}

// 打开图层配置
const handleLayerClick = () => {
	console.log('点击图层按钮')
	showMapConfig.value = true

	// 隐藏底部导航栏
	uni.hideTabBar()
}

// 页面加载时获取位置和初始化地图实例
onMounted(() => {
	getCurrentLocation()
	// 初始化地图实例
	mapContext.value = uni.createMapContext('map')
})
</script>

<style lang="scss">
.container {
	width: 100%;
	height: 100vh;
	position: relative;
}

.map {
	width: 100%;
	height: 100%;
	
	::v-deep .map-crosshair {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 40rpx;
		height: 40rpx;
		pointer-events: none;
		
		&::before,
		&::after {
			content: '';
			position: absolute;
			background-color: #FFFFFF;
		}
		
		&::before {
			top: 50%;
			left: 0;
			right: 0;
			height: 2rpx;
			transform: translateY(-50%);
		}
		
		&::after {
			top: 0;
			bottom: 0;
			left: 50%;
			width: 2rpx;
			transform: translateX(-50%);
		}
	}
}

.top-toolbar {
	position: absolute;
	top: 40rpx;
	right: 40rpx;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	
	.tool-box {
		width: 80rpx;
		height: 80rpx;
		background-color: #FFFFFF;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
		
		text {
			font-size: 24rpx;
			color: #333333;
		}
	}
}

.bottom-toolbar {
	position: absolute;
	bottom: 40rpx;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 40rpx;

	.tool-box {
		width: 80rpx;
		height: 80rpx;
		background-color: #FFFFFF;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
		
		text {
			font-size: 24rpx;
			color: #333333;
		}
	}
}

.loading-container {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
}

.error-container {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
	
	.retry-btn {
		margin-top: 20rpx;
		padding: 10rpx 30rpx;
		background-color: #0F40F5;
		color: #fff;
		border-radius: 8rpx;
		font-size: 28rpx;
	}
}

.info-panel {
	position: absolute;
	top: 40rpx;
	left: 50%;
	transform: translateX(-50%);
	background-color: rgba(255, 255, 255, 0.9);
	padding: 20rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	gap: 10rpx;
	font-size: 28rpx;
}

.popup-content {
	height: 80vh;
	background-color: #fff;
	padding: 30rpx;
	padding-bottom: 10rpx;
	// padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
	// padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
	display: flex;
	flex-direction: column;
	
	.popup-header {
		text-align: center;
		margin-bottom: 30rpx;
		
		.popup-title {
			font-size: 32rpx;
			font-weight: 500;
			color: #333;
		}
	}
	
	.popup-body {
		flex: 1;
		overflow-y: auto;
		
		.section {
			margin-bottom: 30rpx;
			
			.section-title {
				font-size: 28rpx;
				color: #666;
				margin-bottom: 20rpx;
			}
			
			.radio-group {
				display: flex;
				gap: 20rpx;
				
				.radio-item {
					flex: 1;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #F5F7FA;
					border-radius: 8rpx;
					border: 2rpx solid transparent;
					
					&.active {
						border-color: #0F40F5;
						background: rgba(15, 64, 245, 0.05);
						color: #0F40F5;
					}
					
					text {
						font-size: 28rpx;
					}
				}
			}
			
			.switch-list {
				.switch-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 20rpx 0;
					border-bottom: 2rpx solid #F5F7FA;
					
					text {
						font-size: 28rpx;
						color: #333;
					}
				}
			}
		}
	}
	
	.popup-footer {
		padding-top: 20rpx;
		padding-bottom: 10rpx;
		// padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
		// padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
		background-color: #fff;
		
		.confirm-btn {
			width: 100%;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			background: #0F40F5;
			color: #FFFFFF;
			font-size: 32rpx;
			border-radius: 45rpx;
		}
	}
}
</style>
