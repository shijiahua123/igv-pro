import App from './App'
import { createSSRApp } from 'vue'
import uviewPlus from 'uview-plus'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
export function createApp() {
  const app = createSSRApp(App)
  
  // 引入uview-plus
  app.use(uviewPlus)
  
  // uview-plus配置
  app.config.globalProperties.$u = {
    // 单位，可选值为px或rpx
    unit: 'rpx',
    
    // 是否开启顶部安全区适配
    safeAreaInsetTop: true,
    
    // 是否开启底部安全区适配
    safeAreaInsetBottom: true,
    
    // 主题颜色
    primary: '#0F40F5',
    info: '#909399',
    default: '#909399',
    warning: '#ff9900',
    error: '#fa3534',
    success: '#19be6b'
  }
  
  return {
    app
  }
}
// #endif