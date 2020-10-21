<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="head" vitext="btnText" @click="headClick">
        <img v-if="userinfo" :src="userinfo.userPic" alt />
        <img v-else src="../../static/images/head.png" alt />
      </div>
      <span>首页</span>
      <div class="search">
        <router-link to="/searchresult">
          <img src="../../static/images/search.png" alt />
        </router-link>
      </div>
    </div>
    <!-- logo 学校阴影定位 -->
    <div v-if="userinfo" class="schoolBox">
      <img v-if="userinfo.logo != this.GLOBAL.BASE_IMAGE_URL" :src="userinfo.logo" alt  />
      <span>{{userinfo.schoolname}}</span>
    </div>
    <!--轮播图 -->
    <div class="banner">
      <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide v-for="(item,index) in picList" :key="'item'+index">
          <img :src="item.img" @click="tocourseDetails(item.course)">
        </swiper-slide>
        <div class="swiper-pagination"  slot="pagination"></div>
      </swiper>
    </div>

    <!-- content -->
    <div class="content">
      <!-- java后端 前端 -->
      <ul class="classlogo">
        <li  v-for="(item,index) in classTypeList" :key="'item'+index" @click="tabnavs(item)">
          <img style="height: 0.9rem" :src="item.imgUrl" alt />
          <span>{{item.typeName}}</span>
          <i class="line"></i>
        </li>
      </ul>
      <!-- 为您推荐 -->
      <div class="recommendBox" v-show="courseList.length > 0">
        <h5 class="recommend-title">为您推荐</h5>
        <ul class="recommendList">
          <li :class="index?'recommendListli':'recommendListli1'" v-for="(item,index) in courseList" :key="'item'+index">
            <div @click="tocourseDetails(item)">
              <div class="recommendListImg">
                <img :src="item.hotImage" alt />
              </div>
              <p class="recommendListTitle">{{item.courseName}}</p>
              <p class="recommendListBottom">
                <img :src="item.user.headimg" alt />
                <span class="recommendName">{{item.user.name}}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <!-- 热门课程 -->
      <div class="hotcoursesBox" v-show="hotCourseList.length > 0">
        <h5 class="hotcourses-titleBox">
          <span>热门课程</span>
          <router-link to="curriculumlist" class="lookall">
            查看全部
            <i style="color: #65A0F1;">></i>
          </router-link>
        </h5>
        <ul class="hotcourses-content" v-for="(item,index) in hotCourseList" :key="'item'+index">
          <div @click="tocourseDetails(item)" class="hotcourses-content-link">
            <li>
              <div class="hotcoursesListLeft">
                <p class="hotcoursesList-explain">{{item.courseName}}</p>
                <div class="hotcoursesList-bottom">
                  <p class="recommendListBottom" style="padding: 0;">
                    <img :src="item.user.headimg" alt />
                    <span class="recommendName">{{item.user.name}}</span>
                  </p>
                  <span style="margin-right: 0.2rem">{{item.createDate.slice(0,10)}}</span>
                </div>
              </div>
              <div class="hotcourseesListImg">
                <img :src="item.hotImage" alt />
              </div>
            </li>
          </div>
        </ul>
      </div>
    </div>
    <!-- 个人中心 -->
    <div class="personalCenterBox" v-show="isShow" @click.self="hidecenter">
      <div class="personalCenter" :class="isani?'showani':'hideani'">
        <div class="myinfoHead">
          <div class="headshadow">
            <router-link to="/PersonalInfo">
              <img class="headshadow" v-if="userinfo" :src="userinfo.userPic">
              <img class="headshadow" v-else src="../../static/images/head.png"  />
            </router-link>
          </div>
        </div>
        <div class="myinfoCenterBox">
          <span v-if="userinfo" class="userName">{{userinfo.userName}} </span>
          <ul class="myinfoListBox">
            <router-link to="/Mystudy">
              <li>
                <p>
                  <img src="../../static/images/study.png" alt="">
                  <span>我的学习</span>
                </p>
                <i class="rightarrows">
                  <img src="../../static/images/rightarrows.png" alt="">
                </i>
              </li>
            </router-link>
            <router-link to="/CourseRecord">
              <li>
                <p>
                  <img src="../../static/images/record.png" alt="">
                  <span>课程记录</span>
                </p>
                <i class="rightarrows">
                  <img src="../../static/images/rightarrows.png" alt="">
                </i>
              </li>
            </router-link>
            <router-link to="/Myexam">
              <li>
                <p>
                  <img src="../../static/images/exam.png" alt="">
                  <span>我的考试</span>
                </p>
                <i class="rightarrows">
                  <img src="../../static/images/rightarrows.png" alt="">
                </i>
              </li>
            </router-link>
            <router-link to="/Mynews">
              <li>
                <p>
                  <img src="../../static/images/information.png" alt="">
                  <span>我的消息</span>
                </p>
                <i class="rightarrows">
                  <img src="../../static/images/rightarrows.png" alt="">
                </i>
              </li>
            </router-link>
            <router-link to="/ChangePass">
              <li>
                <p>
                  <img src="../../static/images/information.png" alt="">
                  <span>修改密码</span>
                </p>
                <i class="rightarrows">
                  <img src="../../static/images/rightarrows.png" alt="">
                </i>
              </li>
            </router-link>
          </ul>
          <span class="loginButton" @click="quits">退出登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import qs from 'qs'
export default {
  data() {
    return {
      userinfo:null,
      picList:[],//轮播图列表
      courseList:[],//为您推荐，只要俩
      classTypeList:[],//课程分类列表
      hotCourseList:[],//热门课程分类
      // 轮播图
      swiperOption: {
        pagination: ".swiper-pagination",
        autoplay: true,
        loop: true,
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        // ...
      },
      // 个人中心
      isShow:false,
      isani:false,//动画
    };
  },
  created(){
    document.title = "首页"
    console.log("created")
    //获取用户数据
    if(localStorage.getItem('userinfo')){
      this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
    }else {
      this.userinfo = null
    }
    //获取轮播图
    this.homeSwiper()
    //获取课程分类
    this.getClassType()
    //获取热门课程
    this.getHotCourse()



  },
  methods: {
    // 个人中心显示
    headClick(){
      if(localStorage.getItem('userinfo')){
        this.isShow = true
        this.isani = true
      }else {
        //跳转到登陆页面
        this.$router.push({path:'/LoginByPassword'});
      }
    },
    hidecenter(){
      this.isani = false
      let self = this;
      setTimeout(function(){
        self.isShow = false
      },250)
    },
    // tab导航
    tabnavs(item){
      this.$router.push({path:"/IntroduceTab",query:{types:item.id}});
    },
    //退出登录
    quits(){
      //清楚用户数据
      if(localStorage.getItem('userinfo')){
        localStorage.removeItem('userinfo')
      }
      this.$router.push({path:'/LoginByPassword'});
    },
    //跳转到课程详情
    tocourseDetails(item){
      console.log(item)
      if(this.userinfo){
        if(item.isWarrant == '1'){
          //跳转到课程详情
          console.log('转到该课程详情')
          this.$router.push({path:'/MicroProject' ,query:{courseId:item.id}});
        }else {
          this.$toast({
            message: "该课程未授权",
          });
        }
      }else {
        this.$toast({
          message: "您还未登录哦，请立即登录！",
        });
      }
    },
    //获取热门课程
    getHotCourse(){
      let that = this
      let userId = ''
      if(that.userinfo){
        userId=that.userinfo.userId
      }else {
        userId = ''
      }
      this.$ajax.post(this.GLOBAL.BASE_URL + '/pcweb/index/phoneHotCourse',qs.stringify({pageNum: 1, userId:userId, pageSize:8})).then(res => {
        console.log(res.data)
        if(res.data.success && res.data.errorCode == 2){
          let baseUrl = that.GLOBAL.BASE_IMAGE_URL
          that.hotCourseList = res.data.body.coursePage.list
          //拼接图片url
          that.hotCourseList.map(function (item) {
            item.hotImage = baseUrl + item.hotImage
            item.user.headimg = baseUrl + item.user.headimg
          })
        }else {
          this.$toast({
            message: res.data.msg,
          })
        }
      })
    },
    //获取课程分类
    getClassType(){
      let that = this
      this.$ajax.post(this.GLOBAL.BASE_URL + '/pcweb/introduce/listType').then(res => {
        console.log(res.data)
        if(res.data.success && res.data.errorCode == 2){
          let baseUrl = that.GLOBAL.BASE_IMAGE_URL
          that.classTypeList = res.data.body.courseTypeList
          //拼接图片url
          that.classTypeList.map(function (item) {
            item.imgUrl = baseUrl + item.imgUrl
          })
        }else {
          this.$toast({
            message: res.data.msg,
          })
        }
      })
    },
    //获取轮播图
    homeSwiper(){
      let that = this
      let userId = ''
      if(that.userinfo){
        userId = that.userinfo.userId
      }else {
        userId = ''
      }
      this.$ajax.post(this.GLOBAL.BASE_URL + '/pcweb/index/findRecommend',qs.stringify({userId:userId})).then(res => {
        console.log(res.data)
        if(res.data.success && res.data.errorCode == 2){
          let baseUrl = that.GLOBAL.BASE_IMAGE_URL
          let indexImgList = res.data.body.indexImgList
          //拼接图片url
          indexImgList.map(function (item) {
            item.img = baseUrl + item.img
            // item.course = list.course
            that.picList.push(item)

          })
          console.log(that.picList)
          //为您推荐 数据
          res.data.body.courseList.map(function (item) {
            item.hotImage = baseUrl + item.hotImage
            item.user.headimg = baseUrl + item.user.headimg
            // item.course = list.course
          })
          if(res.data.body.courseList.length > 2){
            that.courseList.push(res.data.body.courseList[0])
            that.courseList.push(res.data.body.courseList[1])
          }else {
            that.courseList = res.data.body.courseList
          }

        }else {
          this.$toast({
            message: res.data.msg,
          })
        }
      })
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  mounted() {

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* 头部 */
.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 0.5rem;
  text-align: center;
  line-height: 1rem;
  padding: 0.2rem 0.3rem;
  overflow: hidden;
}
.head {
  width: 1rem;
  height: 1rem;
  float: left;
  border-radius: 50%;
}
.head img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.search {
  display: block;
  width: 0.5rem;
  height: 0.5rem;
}
.search img {
  width: 100%;
  height: 100%;
}
/* 轮播图 */
.banner {
  width: 100%;
  height: 4rem;
  padding-top: 0.4rem;
}
.content {
  width: 100%;
  padding: 0.3rem;
}
.classlogo {
  display: flex;
  width: 100%;
  height: 2.5rem;
  color: #484949;
  margin-bottom: 0.1rem;
  background: #f0f5fc;
  border-radius: 0.15rem;
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.classlogo li {
  min-width: 50%;
  height: 100%;
  font-size: 0.45rem;
  text-align: center;
  padding: 0.4rem 0;
  position: relative;
}
.classlogo li img {
  display: block;
  width: 0.8rem;
  height: 0.8rem;
  margin: 0 auto;
  margin-bottom: 0.3rem;
}
.classlogo li span{
  width: 100%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 0.2rem;
}
.classlogo li:last-child .line{
  background: none;
}
.line {
  width: 1px;
  height: 1.3rem;
  background: #e0e6ec;
  position: absolute;
  right: 0;
  top: 26%;
}

/* 为您推荐 */
.recommend-title {
  color: #333;
  font-size: 0.43rem;
  text-align: left;
  line-height: 1rem;
  letter-spacing: 0.02rem;
  padding: 0 0.25rem;
}
.recommendList {
  width: 100%;
}
.recommendListli {
  width: 48.5%;
  background: #fff;
  float: left;
  margin-left: 3%;
}
.recommendListli1 {
  width: 48.5%;
  background: #fff;
  float: left;
}
.recommendListImg img {
  width: 100%;
  height: 3rem;
}
.recommendListTitle {
  color: #565656;
  text-align: left;
  font-size: 0.4rem;
  margin-bottom: 0.2rem;
  padding: 0 0.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow : hidden;
  text-overflow: ellipsis;
  height: 1rem;
}
.recommendListBottom {
  display: flex;
  align-items: center;
  color: #939393;
  font-size: 0.35rem;
  padding: 0 0.3rem;
  padding-bottom: 0.3rem;
}
.recommendListBottom img {
  width: 0.9rem;
  height: 0.9rem;
  float: left;
  margin-right: 0.25rem;
  border-radius: 50%;
}
/* 热门课程 */
.hotcourses-titleBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0.25rem;
  color: #333;
  font-size: 0.43rem;
}
.lookall {
  color: #9b9b9b;
  font-size: 0.38rem;
  font-weight: 500;
}
.hotcourses-content {
  font-size: 0.4rem;
  background: #fff;
  border-radius: 0.2rem;
  padding: 0.1rem 0.25rem;
}
.hotcourses-content li {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0.25rem 0;
  border-bottom: 1px solid #f6f6f6;
}
.hotcourses-content .hotcourses-content-link:last-child li {
  border-bottom: none;
}
.hotcoursesListLeft {
  flex-direction: column;
  width: 72%;
  height: 100%;
  /* background: plum; */
}
.hotcoursesList-explain {
  height: 1.35rem;
  color: #515151;
  line-height: 0.65rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.hotcourseesListImg {
  width: 45%;
  /*height: 23.5%;*/
}
.hotcourseesListImg img {
  width: 100%;
  height: 100%;
}
.hotcoursesList-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #afafaf;
}

/* 轮播图 */
.swiper-container {
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  list-style: none;
  padding: 0;
  z-index: 1;
}
.wrapper .swiper-pagination-bullet-active {
  background: #fff;
}
.wrapper {
  overflow: hidden;
  width: 100%;
  height: 0;
  padding-bottom: 31.25%;
  background: #eee;
}
.swiper-slide {
  width: 100% !important;
  margin: 0 auto !important;
}
.swiper-slide img {
  width: 100%;
  height: 100%;
  margin-right: 0.5rem;
}
/* logo 学校名称定位 */
.schoolBox {
  display: flex;
  align-items: center;
  width: 100%;
  color: #fff;
  font-size: 0.45rem;
  padding: 0.2rem 0.7rem;
  position: absolute;
  top: 8%;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2;
}
.schoolBox img {
  width: 0.8rem;
  height: 0.8rem;
}
/* 个人中心 */
.personalCenterBox{
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0,0,0,.3);
  z-index: 10;
  /* display: none; */
}
.personalCenter{
  width: 80%;
  height: 100%;
  background: #fff;
  position: relative;
}
.showani{
  animation: lateshow 0.25s linear;
}
.hideani{
  animation: latehide 0.25s linear;
}
.myinfoHead{
  width: 100%;
  height: 4rem;
  text-align: center;
  background: url(../../static/images/myinfobj.png) no-repeat;
  background-size: 100% 100%;
  padding-top: 1.7rem;
}
.headshadow{
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}
/*.headshadow img{*/
/*  width: 1.6rem;*/
/*  width: 1.6rem;*/
/*  position: absolute;*/
/*  top: 50%;left: 50%;*/
/*  transform: translate(-50%,-50%);*/
/*}*/
.myinfoCenterBox{
  width: 100%;
  padding: 0 0.5rem;
}
.userName{
  display: block;
  width: 100%;
  color: #363636;
  font-size: 0.4rem;
  text-align: center;
  letter-spacing: 0.1rem;
  margin-bottom: 1.5rem;
}
.myinfoListBox{
  width: 100%;
  /* height: 5rem; */
  /* background: palegoldenrod; */
}
.myinfoListBox li{
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.4rem;
  letter-spacing: 0.02rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid #F6F6F6;
}
.myinfoListBox li:last-child{
  border-bottom: none;
}
.myinfoListBox li p{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.myinfoListBox li p span{
  color: #575757;
}
.myinfoListBox li p img{
  width: 0.6rem;
  margin-right: 0.3rem;
}
.rightarrows{
  display: block;
  width: 0.25rem;
  height: 0.35rem;
}
.rightarrows img{
  width: 100%;
  height: 100%;
}
.loginButton{
  display: block;
  width: 80%;
  color: #fff;
  font-size: 0.45rem;
  text-align: center;
  letter-spacing: 0.05rem;
  margin: 1.5rem auto 0;
  border-radius: 50px;
  background: linear-gradient(#71B0F9,#328BF1);
  padding: 0.35rem 0;
}
@keyframes lateshow {
  0%{
    left: -80%;
  }
  100%{
    left: 0;
  }
}
@keyframes latehide {
  0%{
    left: 0;
  }
  100%{
    left: -80%;
  }
}
</style>
