<template>
  <div class="curriculum">
    <ul class="hotcourses-content" v-for="(item,index) in hotCourseList" :key="'item'+index">
      <div class="hotcourses-content-link" @click="toCourseDetails(item)">
        <li>
          <div class="hotcoursesListLeft">
            <p class="hotcoursesList-explain">{{item.courseName}}</p>
            <div class="hotcoursesList-bottom">
              <p class="recommendListBottom" style="padding: 0;">
                <img :src="item.user.headimg" alt />
                <span class="recommendName">{{item.user.name | ellipsis}}</span>
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
    <div v-if="isLast && hotCourseList.length > 0" style="width: 100vw;display: flex;justify-content: center ;align-items: center;font-size: 0.4rem;padding: 10px"  >没有更多数据了</div>
    <div v-else style="width: 100vw;display: flex;justify-content: center ;align-items: center;font-size: 0.4rem;padding: 10px" >
      <van-loading type="spinner" v-if="isLoading"/>
      <span v-else @click="loadMore">点击加载更多</span>
    </div>

  </div>
</template>
<script>
import qs from "qs";

export default {
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 5) {
        return value.slice(0,5) + '...'
      }
      return value
    }
  },
  data(){
    return{
      userinfo:null,
      hotCourseList:[],//热门课程分类
      isLoading:false,//loading是否显示
      pageNo:1,//当前页数
      pageSize:10,//每页条数
      count:0,//总条数
      isLast:false,//是否是最后一页
    }
  },
  created(){
    document.title = "课程列表"
    //获取用户数据
    if(localStorage.getItem('userinfo')){
      this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
    }else {
      this.userinfo = null
    }
    //获取热门课程
    this.getHotCourse()


  },
  methods:{
    //加载更多
    loadMore(){
      let that = this
      that.isLoading = true
      let userId = ''
      if(that.userinfo){
        userId=that.userinfo.userId
      }else {
        userId = ''
      }
      this.$ajax.post(this.GLOBAL.BASE_URL + '/pcweb/index/phoneHotCourse',qs.stringify({pageNum: (parseInt(that.pageNo) + 1), userId:userId, pageSize:that.pageSize})).then(res => {
        console.log(res.data)
        that.isLoading = false
        if(res.data.success && res.data.errorCode == 2){
          that.pageNo = res.data.body.coursePage.pageNo
          that.pageSize = res.data.body.coursePage.pageSize
          that.count = res.data.body.coursePage.count
          if(res.data.body.coursePage.count < res.data.body.coursePage.pageSize * res.data.body.coursePage.pageNo){
            that.isLast = true
          }else {
            that.isLast = false
          }
          let baseUrl = that.GLOBAL.BASE_IMAGE_URL
          let list = res.data.body.coursePage.list
          //拼接图片url
          list.map(function (item) {
            item.hotImage = baseUrl + item.hotImage
            item.user.headimg = baseUrl + item.user.headimg
            that.hotCourseList.push(item)
          })
        }else {
          this.$toast({
            message: res.data.msg,
          })
        }
      })
    },
    //获取热门课程
    getHotCourse(){
      let that = this
      that.isLoading = true
      let userId = ''
      if(that.userinfo){
        userId=that.userinfo.userId
      }else {
        userId = ''
      }

      this.$ajax.post(this.GLOBAL.BASE_URL + '/pcweb/index/phoneHotCourse',qs.stringify({pageNum: that.pageNo, userId:userId, pageSize:that.pageSize})).then(res => {
        console.log(res.data)
        that.isLoading = false
        if(res.data.success && res.data.errorCode == 2){
          that.pageNo = res.data.body.coursePage.pageNo
          that.pageSize = res.data.body.coursePage.pageSize
          that.count = res.data.body.coursePage.count
          if(res.data.body.coursePage.count < res.data.body.coursePage.pageSize * res.data.body.coursePage.pageNo){
            that.isLast = true
          }else {
            that.isLast = false
          }
          let baseUrl = that.GLOBAL.BASE_IMAGE_URL
          that.hotCourseList = res.data.body.coursePage.list
          //拼接图片url
          that.hotCourseList.map(function (item) {
            item.hotImage = baseUrl + item.hotImage
            item.user.headimg = baseUrl + item.user.headimg
          })
          console.log(this)
        }else {
          this.$toast({
            message: res.data.msg,
          })
        }
      })
    },
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

    }
  },
  mounted() {

  }
}
</script>
<style lang="" scoped>
.curriculum{
  width: 100vw;
  height: 100vh;

}
.hotcourses-content {
  font-size: 0.4rem;
  background: #fff;
  border-radius: 0.2rem;
  margin: 0.3rem;
}
.hotcourses-content li {
  display: flex;
  justify-content: space-between;
  margin: 0.2rem;
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
</style>
