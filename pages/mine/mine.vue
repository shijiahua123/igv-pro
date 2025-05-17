<template>
	<view class="container">
		<!-- 顶部用户信息 -->
		<view class="user-info">
			<view class="avatar-wrap">
				<view class="avatar"></view>
				<text class="edit-icon">✎</text>
			</view>
			<text class="nickname">昵称</text>
			<text class="phone">手机号：188 6666 9999</text>
		</view>

		<!-- 资产统计卡片 -->
		<view class="assets-card">
			<view class="card-header">
				<text class="title">我管理的资产</text>
				<view class="update-time">
					<text class="icon">↻</text>
					<text class="time">数据更新于2025-05-10 15:30</text>
				</view>
			</view>

			<view class="total-assets">
				<text class="label">全部设备(台):</text>
				<text class="number">800</text>
			</view>

			<view class="assets-detail">
				<view class="detail-item">
					<text class="value">800</text>
					<text class="label">已绑设备</text>
				</view>
				<view class="detail-item">
					<text class="value">0</text>
					<text class="label">未分配设备</text>
				</view>
			</view>

			<view class="assets-list">
				<view class="list-item">
					<text class="name">仓管测试...</text>
					<text class="value">200</text>
				</view>
				<text class="divider">|</text>
				<view class="list-item">
					<text class="name">农场002</text>
					<text class="value">600</text>
				</view>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-grid">
			<view class="menu-item">
				<text class="icon">👥</text>
				<text class="label">团队成员</text>
			</view>
			<view class="menu-item" @tap="goFarmManage">
				<text class="icon">⚙️</text>
				<text class="label">农场管理</text>
			</view>
			<view class="menu-item">
				<text class="icon">📱</text>
				<text class="label">扫一扫</text>
			</view>
			<view class="menu-item">
				<text class="icon">💡</text>
				<text class="label">技术服务</text>
			</view>
			<view class="menu-item">
				<text class="icon">🤝</text>
				<text class="label">合作共赢</text>
			</view>
			<view class="menu-item">
				<text class="icon">🏪</text>
				<text class="label">农资商城</text>
			</view>
		</view>

	</view>
</template>

<script setup>
const goFarmManage = () => {
	uni.navigateTo({
		url: '/pages/farmManage/index',
		fail: (err) => {
			console.error('页面跳转失败：', err)
			uni.showToast({
				title: '页面跳转失败',
				icon: 'none'
			})
		}
	})
}
</script>

<style lang="scss">
.container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 120rpx; // 为底部导航留出空间
}

// 用户信息区域
.user-info {
	background-color: #2b5ee3;
	padding: 40rpx 30rpx;
	color: #fff;
	position: relative;

	.avatar-wrap {
		position: relative;
		width: 120rpx;
		height: 120rpx;
		margin-bottom: 20rpx;

		.avatar {
			width: 100%;
			height: 100%;
			background-color: #ccc;
			border-radius: 50%;
		}

		.edit-icon {
			position: absolute;
			right: 0;
			bottom: 0;
			font-size: 24rpx;
			background: rgba(0, 0, 0, 0.5);
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.nickname {
		font-size: 32rpx;
		font-weight: 500;
		margin-bottom: 10rpx;
		display: block;
	}

	.phone {
		font-size: 28rpx;
		opacity: 0.8;
	}
}

// 资产统计卡片
.assets-card {
	margin: 20rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;

		.title {
			font-size: 32rpx;
			font-weight: 500;
			color: #333;
		}

		.update-time {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #999;

			.icon {
				margin-right: 8rpx;
			}
		}
	}

	.total-assets {
		margin-bottom: 30rpx;

		.label {
			font-size: 28rpx;
			color: #666;
			margin-right: 20rpx;
		}

		.number {
			font-size: 48rpx;
			font-weight: bold;
			color: #2b5ee3;
		}
	}

	.assets-detail {
		display: flex;
		margin-bottom: 30rpx;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;

		.detail-item {
			flex: 1;
			text-align: center;

			.value {
				font-size: 36rpx;
				color: #333;
				font-weight: 500;
				display: block;
				margin-bottom: 10rpx;
			}

			.label {
				font-size: 26rpx;
				color: #999;
			}
		}
	}

	.assets-list {
		display: flex;
		align-items: center;
		justify-content: center;

		.list-item {
			flex: 1;
			text-align: center;

			.name {
				font-size: 26rpx;
				color: #666;
				margin-bottom: 10rpx;
				display: block;
			}

			.value {
				font-size: 32rpx;
				color: #333;
				font-weight: 500;
			}
		}

		.divider {
			color: #ddd;
			margin: 0 30rpx;
		}
	}
}

// 功能菜单网格
.menu-grid {
	margin: 20rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 30rpx;

	.menu-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.icon {
			font-size: 48rpx;
			margin-bottom: 16rpx;
		}

		.label {
			font-size: 26rpx;
			color: #333;
		}
	}
}

// 底部导航栏
.tab-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	background-color: #fff;
	display: flex;
	padding-bottom: env(safe-area-inset-bottom);
	box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);

	.tab-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 10rpx 0;

		.icon {
			font-size: 40rpx;
			margin-bottom: 6rpx;
		}

		.label {
			font-size: 24rpx;
			color: #666;
		}

		&.active {
			.label {
				color: #2b5ee3;
			}
		}
	}
}
</style> 