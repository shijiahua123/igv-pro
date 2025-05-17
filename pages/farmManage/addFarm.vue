<template>
	<view class="add-farm">
		<!-- 表单区域 -->
		<view class="add-farm-form">
			<!-- 农场名称 -->
			<u-form-item
				label="农场名称"
				required
				:borderBottom="true"
                class="add-farm-form-item"
			>
            <template #label>
                <view class="add-farm-form-item-label">
                    <text class="add-farm-form-item-label-text">农场名称</text>
                    <text class="add-farm-form-item-label-mark">（必填）</text>
                </view>
            </template>
            <view class="add-farm-form-item-content">
                <u-input
                    v-model="formData.name"
                    input-align="right"
                    placeholder="请输入农场名称"
                    border="none"
				>
					<template #suffix>
						<u-icon name="edit-pen" size="20"></u-icon>
					</template>
				</u-input>
            </view>
			</u-form-item>

			<!-- 农场位置 -->
			<u-form-item
				label="农场位置"
				:borderBottom="true"
                class="add-farm-form-item"
			>
            <template #label>
                <view class="add-farm-form-item-label">
                    <text class="add-farm-form-item-label-text">农场位置</text>
                    <text class="add-farm-form-item-label-mark">（必填）</text>
                </view>
            </template>
            <view class="add-farm-form-item-content">
                <view class="add-form-custom-content" @click="handleSelectLocation">
                    <text class="add-form-custom-content-text">绘制农场区域</text>
                    <u-icon name="arrow-right" size="20"></u-icon>
                </view>
            </view>
				
			</u-form-item>

			<!-- 地块信息 -->
            <u-form-item
				label="地块"
				:borderBottom="true"
                class="add-farm-form-item"
			>
            <template #label>
                <view class="add-farm-form-item-label">
                    <text class="add-farm-form-item-label-text">地块</text>
                    <text class="add-farm-form-item-label-mark">（必填）</text>
                </view>
            </template>
            <view class="add-farm-form-item-content" @click="handleAddPlot">
                <view class="add-form-custom-content">
                    <text class="add-form-custom-content-text">添加地块</text>
                    <u-icon name="plus-circle" size="20"></u-icon>
                </view>
            </view>
        </u-form-item>
        <u-form-item>
            <view class="block-desc">农场内各理规划地块，提高灌溉效率和成本管理。</view>
        </u-form-item>

		</view>

		<!-- 底部按钮 -->
		<view class="bottom-buttons">
			<u-button
				text="取消"
				plain
				shape="circle"
				@click="handleCancel"
			></u-button>
			<u-button
				text="保存"
				type="primary"
				shape="circle"
				@click="handleSave"
			></u-button>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 表单数据
const formData = reactive({
	name: '',
	location: '',
	blocks: [
		{ name: '泵房北001' },
		{ name: '地块0002' }
	]
})

// 选择位置
const handleSelectLocation = () => {
	uni.navigateTo({
		url: '/pages/farmManage/drawFarm'
	})
}

// 添加地块
const handleAddPlot = () => {
	uni.navigateTo({
		url: '/pages/farmManage/addPlot'
	})
}

// 编辑地块
const handleEditBlock = (index) => {
	uni.showToast({
		title: '编辑地块功能开发中',
		icon: 'none'
	})
}

// 添加地块
const handleAddBlock = () => {
	formData.blocks.push({ name: '' })
}

// 取消
const handleCancel = () => {
	uni.navigateBack()
}

// 保存
const handleSave = () => {
	if (!formData.name.trim()) {
		uni.showToast({
			title: '请输入农场名称',
			icon: 'none'
		})
		return
	}

	if (!formData.location.trim()) {
		uni.showToast({
			title: '请选择农场位置',
			icon: 'none'
		})
		return
	}

	// TODO: 调用保存接口
	uni.showToast({
		title: '保存成功',
		icon: 'success',
		duration: 2000,
		success: () => {
			setTimeout(() => {
				uni.navigateBack()
			}, 2000)
		}
	})
}
</script>

<style lang="scss">
.add-farm {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: calc(140rpx + env(safe-area-inset-bottom));

	.add-farm-form {
		background-color: #fff;
		padding: 0 30rpx;
        &-item {
            &-label {
                &-mark {
                    color: #c5493e;
                }
            }
            &-content {
                flex: 1;
                .add-form-custom-content {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    &-text {
                        padding-right: 10rpx;
                    }
                }
            }
        }
	}

	.farm-id {
		font-size: 28rpx;
		color: #999;
		margin-right: 20rpx;
	}

	.block-info {
		padding: 30rpx 0 20rpx;

		.block-header {
			margin-bottom: 12rpx;
		}

		.required-label {
			font-size: 30rpx;
			color: #333;
			position: relative;

			&::before {
				content: '*';
				color: #ff0000;
				margin-right: 4rpx;
			}
		}

		.required-mark {
			font-size: 26rpx;
			color: #999;
			margin-left: 8rpx;
		}

		.block-desc {
			font-size: 26rpx;
			color: #999;
		}
	}

	.block-list {
		.block-item {
			display: flex;
			align-items: center;
			padding: 24rpx 0;
			border-bottom: 2rpx solid #f5f5f5;

			.block-number {
				width: 60rpx;
				font-size: 28rpx;
				color: #666;
			}

			.block-content {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				color: #333;
			}
		}

		.add-block {
			display: flex;
			align-items: center;
			padding: 24rpx 0;
			color: #2979ff;
			font-size: 28rpx;

			.u-icon {
				margin-right: 12rpx;
			}
		}
	}

	.bottom-buttons {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 20rpx 30rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		background-color: #fff;
		display: flex;
		gap: 20rpx;

		:deep(.u-button) {
			flex: 1;
			margin: 0;
		}
	}
}
</style>
