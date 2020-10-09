import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载全局样式
import './styles/index.less'
import './utils/dayjs'
// 加载vant
import Vant from 'vant'
import 'vant/lib/index.css'
// 动态设置 REM 基准值（html 标签的字体大小）
import 'amfe-flexible'
// 全局注册
Vue.use(Vant)
Vue.config.productionTip = false
// 创建vue实例 将router store挂载到实例
// 把APP跟组件渲染到节点
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
