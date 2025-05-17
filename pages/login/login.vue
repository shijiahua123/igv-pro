<template>
	<view class="login-container">
		<view class="logo-container">
			<view class="logo-text">H</view>
			<text class="title">HEIGHTEN\nAUTOMATION</text>
		</view>
		
		<view class="form-container">
			<u-input
				v-model="username"
				placeholder="输入账号"
				:border="false"
				class="input-box"
				:customStyle="{
					backgroundColor: '#F5F7FA',
					padding: '20rpx 44rpx',
					borderRadius: '45rpx',
					height: '23rpx',
					lineHeight: '23rpx'
				}"
				placeholderStyle="color: #999999;font-size: 32rpx;line-height: 23rpx;"
			>
				<template #prefix>
					<u-icon
						name="account"
						size="44rpx"
						color="#999999"
						customStyle="margin-right: 20rpx"
					></u-icon>
				</template>
			</u-input>
			
			<u-input
				v-model="password"
				type="password"
				placeholder="输入密码"
				:border="false"
				class="input-box"
				:customStyle="{
					backgroundColor: '#F5F7FA',
					padding: '20rpx 44rpx',
					borderRadius: '45rpx',
					height: '23rpx',
					lineHeight: '23rpx'
				}"
				placeholderStyle="color: #999999;font-size: 32rpx;line-height: 23rpx;"
			>
				<template #prefix>
					<u-icon
						name="lock"
						size="44rpx"
						color="#999999"
						customStyle="margin-right: 20rpx"
					></u-icon>
				</template>
			</u-input>
			
			<view class="btn-container">
				<u-button
					text="开启灌溉系统"
					@click="handleLogin"
					class="login-btn"
					:customStyle="{
						background: 'linear-gradient(270deg, #0F40F5 0%, #45A4FF 100%)',
						color: '#FFFFFF',
						height: '90rpx',
						borderRadius: '45rpx',
						border: 'none',
						fontSize: '32rpx',
						fontWeight: '500'
					}"
				></u-button>
				<u-button
					text="手机号码登录"
					@click="handlePhoneLogin"
					class="phone-login-btn"
					:customStyle="{
						background: '#F5F7FA',
						color: '#666666',
						height: '90rpx',
						borderRadius: '45rpx',
						border: 'none',
						fontSize: '32rpx',
						fontWeight: '400'
					}"
				></u-button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

// 引入需要的uview-plus组件
import { onMounted } from 'vue'
// import uInput from 'uview-plus/components/u-input/u-input.vue'
// import uButton from 'uview-plus/components/u-button/u-button.vue'
// import uIcon from 'uview-plus/components/u-icon/u-icon.vue'

const username = ref('')
const password = ref('')

const handleLogin = () => {
	if (!username.value || !password.value) {
		uni.showToast({
			title: '请输入账号和密码',
			icon: 'none'
		})
		return
	}
	
	// TODO: 实现登录逻辑
	uni.switchTab({
		url: '/pages/index/index'
	})
}

const handlePhoneLogin = () => {
	// TODO: 实现手机号登录逻辑
	uni.showToast({
		title: '手机号登录功能开发中',
		icon: 'none'
	})
}

// 确保组件加载完成
onMounted(() => {
	console.log('Login page mounted')
})
</script>

<style lang="scss">
.login-container {
	min-height: 100vh;
	padding: 60rpx;
	display: flex;
	flex-direction: column;
	background-color: #FFFFFF;
}

.logo-container {
	margin-top: 120rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	
	.logo-text {
		width: 120rpx;
		height: 120rpx;
		background-color: #0F40F5;
		color: #FFFFFF;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 60rpx;
		font-weight: bold;
	}
	
	.title {
		margin-top: 40rpx;
		font-size: 48rpx;
		font-weight: bold;
		color: #0F40F5;
		text-align: center;
		white-space: pre-line;
	}
}

.form-container {
	margin-top: 120rpx;
	display: flex;
	flex-direction: column;
	gap: 30rpx;
	
	.input-box {
		height: 100rpx;
		
		:deep(.u-input__content__field) {
			height: 23rpx;
			line-height: 23rpx;
			font-size: 32rpx;
			color: #333333;
		}
		
		:deep(.u-input__content) {
			height: 100rpx;
			display: flex;
			align-items: center;
		}
	}
}

.btn-container {
	margin-top: 60rpx;
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	padding: 0 20rpx;
	
	.login-btn {
		box-shadow: 0 8rpx 16rpx rgba(15, 64, 245, 0.25);
	}
	
	.phone-login-btn {
		background: #F5F7FA !important;
	}
}
</style> 