import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export const routerlinks = [
  {
    path:"/",
    redirect:"/index"
  },{
    path:"/index",
    name:"index",
    component:()=>import("@/components/HelloWorld")//首页
  },{
    path:"/ChangePass",
    name:"ChangePass",
    component:()=>import("@/views/ChangePass")//首页
  },{
    path: '/Login',
    name: 'Login',
    component:()=>import("@/views/Login")//验证码登录
  },{
    path: '/LoginByPassword',
    name: 'LoginByPassword',
    component:()=>import("@/views/LoginByPassword")//密码登录
  },{
    path: '/IntroduceTab',
    name: 'IntroduceTab',
    component:()=>import("@/views/IntroduceTab")//课程介绍
  },{
    path: '/MicroProject',
    name: 'MicroProject',
    component:()=>import("@/views/MicroProject")//课程详情
  },{
    path: '/Programming',
    name: 'Programming',
    component:()=>import("@/views/Programming")//学习资料
  },{
    path: '/PersonalInfo',
    name: 'PersonalInfo',
    component:()=>import("@/views/PersonalInfo")//个人信息
  },{
    path: '/Mystudy',
    name: 'Mystudy',
    component:()=>import("@/views/Mystudy")//我的学习
  },{
    path: '/Myexam',
    name: 'Myexam',
    component:()=>import("@/views/Myexam")//我的考试
  },{
    path:"/searchresult",
    name:"searchresult",
    component:()=>import("@/views/searchresult")//搜索
  },{
    path:"/grade",
    name:"grade",
    component:()=>import("@/views/grade")//已阅
  },{
    path:"/lineexam",
    name:"lineexam",
    component:()=>import("@/views/lineexam")//在线答题
  },{
    path:"/exercises",
    name:"exercises",
    component:()=>import("@/views/exercises")//提交习题
  },{
    path:"/Mynews",
    name:"Mynews",
    component:()=>import("@/views/Mynews")//我的消息
  },{
    path:"/VideoPage",
    name:"VideoPage",
    component:()=>import("@/views/VideoPage")//课程视频
  },{
    path:"/CourseRecord",
    name:"CourseRecord",
    component:()=>import("@/views/CourseRecord")//课程记录
  },{
    path:"/curriculumlist",
    name:"curriculumlist",
    component:()=>import("@/views/curriculumlist")//课程列表
  },{
    path:"/Register",
    name:"register",
    component:()=>import("@/views/Register")//注册
  }
]
export default new Router({
  mode:"history",
  routes:routerlinks,
  scrollBehavior: () => ({
    y: 0
  }),
})
