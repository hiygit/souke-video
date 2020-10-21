<template>
  <div class="introduceBox">
    <header></header>
    <div class="banner"><img :src="bannerpic" alt="" srcset=""></div>
    <!-- Tab切换 -->
    <van-tabs v-model="active">
      <van-tab title="专业介绍">
        <div class="van-tabOneBox">
          <h4 class="van-tab-title">{{courseType.typeName}}</h4>
          <div class="van-tabOne-content" v-html="courseType.courseTypeSynopsis">

          </div>
        </div>
      </van-tab>
      <van-tab title="课程介绍">
        <ul class="van-tabTwo-box" v-for="(item,index) in courseList" :key="'item'+index">
          <div @click="toCourseDetails(item)">
            <li>
              <span>{{item.courseName}}</span>
              <i class="rightarrows">
                <img src="../../static/images/rightarrows.png" alt />
              </i>
              <img src="../../static/images/authorized.png" alt srcset class="authorized"  v-show="item.isWarrant == '1'"/>
            </li>
          </div>
        </ul>
        <div v-if="isLastOfCourse && courseList.length > 0" style="width: 100vw;display: flex;justify-content: center ;align-items: center;font-size: 0.4rem;padding: 10px"  >没有更多数据了</div>
        <div v-else style="width: 100vw;display: flex;justify-content: center ;align-items: center;font-size: 0.4rem;padding: 10px" >
          <van-loading type="spinner" v-if="isLoading"/>
          <span v-else @click="loadMore">点击加载更多</span>
        </div>
      </van-tab>
      <van-tab title="讲师介绍">
        <van-collapse v-model="activeName" accordion v-for="(item1,index1) in teacherList" :key="'item1'+index1">
          <van-collapse-item
            :icon="item1.headimg"
            :title="item1.name"
            :name="index1">
            <div v-html="item1.teacherSynopsis"></div>
          </van-collapse-item>
        </van-collapse>
        <div v-if="isLastOfTeacher && teacherList.length > 0" style="width: 100vw;display: flex;justify-content: center ;align-items: center;font-size: 0.4rem;padding: 10px"  >没有更多数据了</div>
        <div v-else style="width: 100vw;display: flex;justify-content: center ;align-items: center;font-size: 0.4rem;padding: 10px" >
          <van-loading type="spinner" v-if="isLoading"/>
          <span v-else @click="loadMore">点击加载更多</span>
        </div>
      </van-tab>
    </van-tabs>
    <!-- <div class="customerservice">
      <img src="../../static/images/customerservice.png" alt srcset />
    </div> -->
    <div style="display:none;"><a href="http://www.pop800.com">在线客服</a></div>
  </div>
</template>

<script>
  import qs from 'qs'
export default {
  data() {
    return {
      bannerpic:"",//背景背景图
      active: 0,
      activeName: "1",
      userinfo:null,//用户信息
      isLoading:false,//是否加载
      courseTypeId:'',//课程id
      courseType:'',//课程介绍
      courseList:[],//课程列表
      teacherList:[],//讲师列表
      pageNoOfCourse:1,//课程列表当前页数
      pageNoOfTeacher:1,//讲师列表当前页数
      countOfCourse:0,//课程列表总条数
      countOfTeacher:0,//讲师列表总条数
      isLastOfCourse:false,//课程列表是否是最后一页
      isLastOfTeacher:false,//讲师列表是否是最后一页
    };
  },
  created() {
    document.title = "课程分类";
  },
  mounted() {
    //获取用户信息
    if(localStorage.getItem('userinfo')){
      this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
    }else {
      this.userinfo = null
    }
    //从路由中获取课程id
    this.courseTypeId = this.$route.query.types
    //获取课程信息
    this.getCourseDetail()
  },
  methods:{
    //to   '/MicroProject'
    toCourseDetails(item){
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
    //加载更多
    loadMore(){
      // courses/findCourseInfo
      let that = this
      let baseUrl = that.GLOBAL.BASE_IMAGE_URL
      that.isLoading = true
      let userId = ''
      if(that.userinfo){
        userId = that.userinfo.userId
      }else {
        userId = ''
      }
      let isAddOfCourse = false // 课程是否有下一页
      if(!that.isLastOfCourse){
        that.pageNoOfCourse = (parseInt(that.pageNoOfCourse) + 1)
        isAddOfCourse = true
      }else {
        isAddOfCourse = false
        that.pageNoOfCourse = parseInt(that.pageNoOfCourse)
      }
      let isAddOfTeacher = false  // 讲师是否有下一页
      if(!that.isLastOfTeacher){
        that.pageNoOfTeachere = (parseInt(that.pageNoOfTeachere) + 1)
        isAddOfTeacher = true
      }else {
        isAddOfTeacher = false
        that.pageNoOfTeachere = parseInt(that.pageNoOfTeachere)
      }

      this.$ajax.post(this.GLOBAL.BASE_URL + '/pcweb/introduce/listIntroduce',qs.stringify({userId:userId,courseTypeId:that.courseTypeId,coursePageNum:that.pageNoOfCourse,userPageNum:that.pageNoOfTeachere,pageSize:10})).then(res => {
        console.log(res)
        that.isLoading = false
        if(res.data.success && res.data.errorCode == 2){
          //赋值
          //课程
          if(isAddOfCourse){
            let list = res.data.body.coursePage.list
            //拼接图片url
            list.map(function (item) {
              that.courseList.push(item)
            })
          }else {
            //课程列表不变
          }
          that.countOfCourse = res.data.body.coursePage.count
          that.pageNoOfCourse = res.data.body.coursePage.pageNo
          if(res.data.body.coursePage.count < res.data.body.coursePage.pageSize * res.data.body.coursePage.pageNo){
            that.isLastOfCourse = true
          }else {
            that.isLastOfCourse = false
          }
          //课程列表是否添加
          //讲师
          if(isAddOfTeacher && res.data.body.userPage.list){
            let list = res.data.body.userPage.list
            //拼接图片url
            list.map(function (item) {
              item.headimg = baseUrl + item.headimg
              item.teacherSynopsis = item.teacherSynopsis.replace(/\n/g,"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
              that.teacherList.push(item)
            })
          }else {
            //讲师列表无变化
          }
          that.countOfTeacher = res.data.body.userPage.count
          that.pageNoOfTeachere = res.data.body.userPage.pageNo
          if(res.data.body.userPage.count < res.data.body.userPage.pageSize * res.data.body.userPage.pageNo){
            that.isLastOfTeacher = true
          }else {
            that.isLastOfTeacher = false
          }
          //课程简介
          that.courseType = res.data.body.courseType
          that.courseType.courseTypeSynopsis = res.data.body.courseType.courseTypeSynopsis.replace(/\n/g,"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
        }else {
          this.$toast({
            message: res.data.msg,
          })
        }
      })
    },
    getCourseDetail(){
      // courses/findCourseInfo
      let that = this
      let baseUrl = that.GLOBAL.BASE_IMAGE_URL
      that.isLoading = true
      let userId = ''
      if(that.userinfo){
        userId = that.userinfo.userId
      }else {
        userId = ''
      }
      this.$ajax.post(this.GLOBAL.BASE_URL + '/pcweb/introduce/listIntroduce',qs.stringify({userId:userId,courseTypeId:that.courseTypeId,coursePageNum:1,userPageNum:1,pageSize:10})).then(res => {
        console.log(res)
        that.isLoading = false
        if(res.data.success && res.data.errorCode == 2){
          //赋值
          //课程
          that.bannerpic = this.GLOBAL.BASE_IMAGE_URL+res.data.body.courseType.imgUrl
          that.countOfCourse = res.data.body.coursePage.count
          that.courseList = res.data.body.coursePage.list?res.data.body.coursePage.list:[]
          that.pageNoOfCourse = res.data.body.coursePage.pageNo
          if(res.data.body.coursePage.count < res.data.body.coursePage.pageSize * res.data.body.coursePage.pageNo){
            that.isLastOfCourse = true
          }else {
            that.isLastOfCourse = false
          }
          //讲师
          that.countOfTeacher = res.data.body.userPage.count
          if(res.data.body.userPage.list){
            let list = res.data.body.userPage.list
            //拼接图片url
            list.map(function (item) {
              item.headimg = baseUrl + item.headimg
              item.teacherSynopsis = item.teacherSynopsis.replace(/\n/g,"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
              that.teacherList.push(item)
            })
          }
          that.pageNoOfTeachere = res.data.body.userPage.pageNo
          if(res.data.body.userPage.count < res.data.body.userPage.pageSize * res.data.body.userPage.pageNo){
            that.isLastOfTeacher = true
          }else {
            that.isLastOfTeacher = false
          }
          //课程简介
          that.courseType = res.data.body.courseType
          that.courseType.courseTypeSynopsis = res.data.body.courseType.courseTypeSynopsis.replace(/\n/g,"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")

        }else {
          this.$toast({
            message: res.data.msg,
          })
        }
      })
    },
  },
  components: {}
};
</script>

<style>
.introduceBox {
  width: 100vw;
  height: 100vh;
}
.banner {
  width: 100%;
  height: 4.1rem;
  /*background: url(../../static/images/javabanner.png) no-repeat;*/
  /* background-size: 100% 100%; */
}
.banner img{
  width: 100%;
  height: 100%;
}
/* Tab切换 */
.van-tabs__line {
  background-color: #1f7fee;
  width: 0.9rem !important;
}
.van-tab--active {
  color: #1f7fee;
}
.van-tabs__content {
  width: 100%;
}
.van-tab__pane,
.van-tab__pane-wrapper {
  -webkit-flex-shrink: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 100%;
  color: #7a7a7a;
  font-size: 0.35rem;
  line-height: 0.7rem;
  letter-spacing: 0.02rem;
  margin-top: 0.13rem;
  height: 66vh;
  overflow-y: scroll;
}
.van-tabOneBox {
  width: 100%;
  background: #fff;
  padding: 0.4rem;
}
.van-tab-title {
  color: #383838;
  font-size: 0.45rem;
  margin-bottom: 0.2rem;
}
/* 课程介绍 */
.van-tabTwo-box {
  width: 100%;
  background: #f8f8f8;
}
.van-tabTwo-box li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.15rem;
  padding: 0.37rem 0.4rem;
  background: #fff;
  position: relative;
}
.van-tabTwo-box li span{
    color: #7a7a7a;
}
.rightarrows {
  display: block;
  width: 0.25rem;
  height: 0.35rem;
  margin-top: -0.18rem;
}
.rightarrows img {
  width: 100%;
  height: 100%;
}
/* 讲师介绍 */
.van-collapse-item {
  margin-bottom: 0.15rem;
}
.van-cell__right-icon {
  color: #348bf0;
}
.van-collapse-item__content {
  color: #7a7a7a;
  line-height: 0.65rem;
}
.van-cell {
  padding: 10px 16px;
  line-height: 1.2rem;
}
.van-icon__image {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  overflow: hidden;
}
.van-cell__left-icon {
  min-width: 1em;
  height: 0.9rem;
  font-size: 16px;
  line-height: 0.9rem;
  margin-right: 0.5rem;
}
/* 客服定位 */
.customerservice {
  width: 1.5rem;
  height: 1.5rem;
  position: fixed;
  bottom: 35%;
  right: 1%;
}
.customerservice img {
  width: 100%;
  height: 100%;
}
.authorized {
  width: 1rem;
  height: 1rem;
  position: absolute;
  right: 1rem;
}
</style>


