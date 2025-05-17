<template>
	<view class="container">
		<!-- 顶部用户信息 -->
     <view class="user-info-wrap">
       <view class="user-info">
         <view class="avatar-wrap">
           <view class="avatar"></view>
         </view>
         <view class="user-info-text">
           <view class="nickname-wrap">
             <text class="nickname">昵称</text>
             <u-icon name="edit-pen" color="#fff" size="20"></u-icon>
           </view>
           <view class="phone-wrap">
             <text class="phone">手机号：188 6666 9999</text>
           </view>
         </view>
       </view>
   
       <!-- 资产统计卡片 -->
       <view class="assets-card">
         <view class="card-header">
           <text class="title">我管理的资产</text>
           <view class="update-time">
             <u-icon name="reload" color="#999" size="18"></u-icon>
             <text class="time">数据更新于2025-05-10 15:30</text>
           </view>
         </view>
         <view class="card-line"></view>
         <view class="total-assets">
           <view class="total-row">
             <view class="label">全部设备(台):</view>
             <view class="number">800</view>
           </view>
           <view class="detail-row">
             <view class="detail-item">
               <view class="value">800</view>
               <view class="label">已绑设备</view>
             </view>
             <u-line color="#ccc" direction="vertical" length="80rpx" margin="0 20rpx" hair-line="false"></u-line>
             <view class="detail-item">
               <view class="value">0</view>
               <view class="label">未分配设备</view>
             </view>
           </view>
         </view>
   
         <!-- 农场列表滑动区域 -->
         <view class="assets-list-container">
           <view class="arrow-btn left" @tap="handleScrollLeft">
             <u-icon name="arrow-left" color="#666" size="20"></u-icon>
           </view>
           <scroll-view 
             class="assets-list" 
             scroll-x="true" 
             show-scrollbar="false"
             :scroll-left="scrollLeft"
             @scroll="handleScroll"
             :scroll-with-animation="true"
             ref="farmListScroll"
             :scroll-anchoring="false"
             @touchstart.prevent
             @touchmove.prevent
           >
             <view class="list-wrapper">
               <view class="list-item">
                 <text class="name">岳普湖农场地块</text>
                 <text class="value">200</text>
               </view>
               <view class="list-item">
                 <text class="name">农场002</text>
                 <text class="value">600</text>
               </view>
               <view class="list-item">
                 <text class="name">农场003</text>
                 <text class="value">300</text>
               </view>
               <view class="list-item">
                 <text class="name">农场004</text>
                 <text class="value">300</text>
               </view>
               <view class="list-item">
                 <text class="name">农场005</text>
                 <text class="value">300</text>
               </view>
               <view class="list-item">
                 <text class="name">农场006</text>
                 <text class="value">300</text>
               </view>
             </view>
           </scroll-view>
           <view class="arrow-btn right" @tap="handleScrollRight">
             <u-icon name="arrow-right" color="#666" size="20"></u-icon>
           </view>
         </view>
       </view>
     </view>

		<!-- 功能菜单 -->
		<view class="menu-grid">
			<view class="menu-item">
				<u-image width="100rpx" height="100rpx" :custom-style="{ backgroundColor: 'transparent !important' }" src="/static/images/user-info.png"></u-image>
				<text class="label">团队成员</text>
			</view>
			<view class="menu-item" @tap="goFarmManage">
				<u-image width="100rpx" height="100rpx" :custom-style="{ backgroundColor: 'transparent !important' }" src="/static/images/equip-manage.png"></u-image>
				<text class="label">农场管理</text>
			</view>
			<view class="menu-item">
				<u-image width="100rpx" height="100rpx" :custom-style="{ backgroundColor: 'transparent !important' }" src="/static/images/scan.png"></u-image>
				<text class="label">扫一扫</text>
			</view>
			<view class="menu-item">
				<u-image width="100rpx" height="100rpx" :custom-style="{ backgroundColor: 'transparent !important' }" src="/static/images/technical-service.png"></u-image>
				<text class="label">技术服务</text>
			</view>
			<view class="menu-item">
				<u-image width="100rpx" height="100rpx" :custom-style="{ backgroundColor: 'transparent !important' }" src="/static/images/cooperation-win.png"></u-image>
				<text class="label">合作共赢</text>
			</view>
			<view class="menu-item">
				<u-image width="100rpx" height="100rpx" :custom-style="{ backgroundColor: 'transparent !important' }" src="/static/images/agricultural-mall.png"></u-image>
				<text class="label">农资商城</text>
			</view>
		</view>

	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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

// 滚动相关
const scrollLeft = ref(0)
const scrollWidth = ref(0)
const containerWidth = ref(0)
const SCROLL_STEP = 200 // 每次滚动的距离
const farmListScroll = ref(null)

// 初始化获取滚动区域的宽度信息
onMounted(() => {
  setTimeout(() => {
    const query = uni.createSelectorQuery()
    query.select('.list-wrapper').boundingClientRect(data => {
      if (data) {
        scrollWidth.value = data.width
      }
    }).exec()
    
    query.select('.assets-list').boundingClientRect(data => {
      if (data) {
        containerWidth.value = data.width
      }
    }).exec()
  }, 100)
})

// 处理向左滚动
const handleScrollLeft = () => {
  const newScrollLeft = Math.max(0, scrollLeft.value - SCROLL_STEP)
  scrollLeft.value = newScrollLeft
}

// 处理向右滚动
const handleScrollRight = () => {
  const maxScroll = Math.max(0, scrollWidth.value - containerWidth.value)
  const newScrollLeft = Math.min(maxScroll, scrollLeft.value + SCROLL_STEP)
  scrollLeft.value = newScrollLeft
}

// 监听滚动事件
const handleScroll = (e) => {
  scrollLeft.value = e.detail.scrollLeft
}
</script>

<style lang="scss">
.container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 120rpx; // 为底部导航留出空间
}

// 用户信息区域
.user-info-wrap {
  background: linear-gradient(180deg, rgba(15,64,245,1) 0%,rgba(255,255,255,0) 100%);
}

.user-info {
	position: relative;
  display: flex;
  align-items: center;
	// background-color: #2b5ee3;
	padding: 40rpx 30rpx 20rpx 30rpx;
	color: #fff;
  
	.avatar-wrap {
    position: relative;
		width: 120rpx;
		height: 120rpx;
    margin-right: 20rpx;

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

  .user-info-text {
    .nickname-wrap {
      display: flex;
      align-items: center;
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
  margin: 0 30rpx;
  background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
  border-radius: 24rpx;
  padding: 30rpx;
  backdrop-filter: blur(10px);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .title {
      font-size: 28rpx;
      color: #333;
    }

    .update-time {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #999;

      .icon {
        margin-right: 6rpx;
        font-size: 24rpx;
      }
    }
  }

  .card-line {
    width: 100%;
    height: 2rpx;
    background-color: #ccc;
  }

  .total-assets {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%);
    border-radius: 16rpx;
    padding: 20rpx;

    .total-row {
      // display: flex;
      // align-items: baseline;
      // margin-bottom: 30rpx;

      .label {
        font-size: 28rpx;
        color: #666;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
      }

      .number {
        font-size: 48rpx;
        font-weight: bold;
        color: #0F40F5;
        line-height: 1;
      }
    }

    .detail-row {
      display: flex;
      justify-content: flex-start;
      // gap: 60rpx;

      .detail-item {
        text-align: left;
        .value {
          font-size: 32rpx;
          color: #333;
          font-weight: 500;
          margin-bottom: 8rpx;
        }

        .label {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }

  .assets-list-container {
    position: relative;
    display: flex;
    align-items: center;
    background: #f6f6f6;
    padding: 10rpx;

    .arrow-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40rpx;
      height: 40rpx;
      // background: rgba(255, 255, 255, 0.8);
      // border-radius: 50%;
      z-index: 1;
      
      &.left {
        margin-right: -20rpx;
      }
      
      &.right {
        margin-left: -20rpx;
      }
    }

    .assets-list {
      flex: 1;
      width: 0; // 防止溢出
      white-space: nowrap;
      padding: 0 20rpx;
      
      // 隐藏滚动条
      ::-webkit-scrollbar {
        display: none;
      }
      
      .list-wrapper {
        display: inline-flex;
        // padding: 0 20rpx;
      }

      .list-item {
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 20rpx;
        // margin-right: 20rpx;
        // background: rgba(255, 255, 255, 0.6);
        border-radius: 16rpx;
        width: 120rpx;

        &:last-child {
          margin-right: 0;
        }

        .name {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 10rpx;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .value {
          font-size: 32rpx;
          color: #333;
          font-weight: 500;
        }
      }
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
		
		.label {
			font-size: 26rpx;
			color: #333;
			margin-top: 10rpx;
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