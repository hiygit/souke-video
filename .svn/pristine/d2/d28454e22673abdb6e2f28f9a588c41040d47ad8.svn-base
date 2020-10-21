// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css';
import Element from 'element-ui'  //element-ui
import {Tab,Tabs,Dialog,Popup} from 'vant'
import {Collapse,CollapseItem,Loading } from 'vant'
// vue 轮播图
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
// 页面标题设置
import VueWechatTitle from 'vue-wechat-title'
import 'element-ui/lib/theme-chalk/index.css' //element-ui 进度条样式


// router.beforeEach((to,from,next) => {
//   /* 路由发生变化修改页面title */
//   if(to.meta.title){
//     document.title = to.mata.title
//   }
//   next()
// })

Vue.use(Vant)
Vue.use(Tab).use(Tabs).use(Dialog)
Vue.use(Collapse).use(CollapseItem)
Vue.use(Element)
Vue.use(VueAwesomeSwiper)
Vue.use(VueWechatTitle)
// rem
import 'amfe-flexible';

Vue.config.productionTip = false
//  main.js中引入css
import 'video.js/dist/video-js.css'
//设置全局变量
import global_ from './views/Base'
Vue.prototype.GLOBAL = global_;
axios.defaults.baseURL = global_.BASE_URL;

import axios from 'axios'
Vue.prototype.$ajax = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
