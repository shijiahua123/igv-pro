<template>
	<view class="farm-manage-container">
        <view class="farm-list"></view>
        <view class="add-farm">
            <u-button type="primary" class="add-farm-btn" @click="addFarm">新建农场</u-button>
        </view>
    </view>
</template>

<script setup>
const addFarm = () => {
	uni.navigateTo({
		url: '/pages/farmManage/addFarm',
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
.farm-manage-container {
    position: relative;
    width: 100%;
	height: 100vh;

    .add-farm{
        position: absolute;
        bottom: 50rpx;
        left: 50%;
        transform: translateX(-50%);
        
        ::v-deep .add-farm-btn{
            width: 200rpx;
            height: 80rpx;
            color: #FFFFFF;
        }

    }
}



</style>

