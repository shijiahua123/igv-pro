<template>
	<view>
		<view :class="theme">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				theme: 'theme-light'
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			// 添加系统信息获取的错误处理
			try {
				const systemInfo = uni.getSystemInfoSync()
				console.log('系统信息：', systemInfo)
			} catch (e) {
				console.error('获取系统信息失败：', e)
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* uni.scss */
	@import '@/uni.scss';

	/* uview-plus主题文件 */
	@import 'uview-plus/theme.scss';

	/* uview-plus组件样式 */
	@import 'uview-plus/index.scss';

	/* 全局样式 */
	page {
		background-color: #f8f8f8;
	}
</style>
