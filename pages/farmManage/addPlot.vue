<template>
	<view class="add-plot">
		<!-- 表单区域 -->
		<view class="add-plot-form">
			<!-- 农场名称 -->
			<u-form-item
				label="地块名称"
				:borderBottom="true"
                class="add-plot-form-item"
			>
            <view class="add-plot-form-item-content">
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
				label="地块区域"
				:borderBottom="true"
                class="add-plot-form-item"
			>
            <view class="add-plot-form-item-content">
                <view class="add-form-custom-content" @click="handleSelectLocation">
                    <text class="add-form-custom-content-text">绘制地块区域</text>
                    <u-icon name="arrow-right" size="20"></u-icon>
                </view>
            </view>
				
			</u-form-item>

            <!-- 出水桩 -->
            <u-form-item
				label="出水桩"
				:borderBottom="true"
                class="add-plot-form-item"
			>
            <view class="add-plot-form-item-content">
                <view class="add-form-custom-content" @click="handleSelectLocation">
                    <text class="add-form-custom-content-text">标记出水桩位置</text>
                    <u-icon name="arrow-right" size="20"></u-icon>
                </view>
            </view>
				
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
		url: '/pages/farmManage/drawPlot'
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
.add-plot {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: calc(140rpx + env(safe-area-inset-bottom));

	.add-plot-form {
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
