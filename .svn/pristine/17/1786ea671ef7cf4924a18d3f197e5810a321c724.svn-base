<template>
  <div class="searchresult">
    <div class="searchinput">
      <van-search v-model="value" placeholder="请输入感兴趣的课程" show-action shape="round" @search="onSearch" @clear="onCancel" background="#f8f8f8">
        <div  slot="action" @click="onSearch">搜索</div>
      </van-search>
    </div>
    <div v-if="courseList.length == 0">
      <!-- 热门搜索 -->
      <div class="hotsearch">
        <p>热门搜索</p>
        <div class="hotlist">
          <div class="hottxt" v-for="(item,index) in hotSearch" :key="'item'+index"><span @click="tosearch(item.courseName)">{{item.courseName}}</span> </div>
        </div>
        <div class="refresh">
        <span @click="getHotSearch">
          <img :class="isrotate?'imgrotate':''" src="../../static/images/loadpic.png" alt="" srcset="">换一批
        </span>
        </div>
      </div>
      <!-- 最近搜索 -->
      <div class="letely" v-show="historySearch.length > 0">
        <div class="letelytit"><span>最近搜索</span><img @click="deletelist" src="../../static/images/delsearch.png" alt="" srcset=""></div>
        <ul class="letelylist" v-for="(item,index) in historySearch" :key="'item'+index">
            <li><img src="../../static/images/hispic.png" alt="" srcset=""><span @click="tosearch(item.record)">{{item.record}}</span></li>
        </ul>
      </div>
    </div>

    <!--搜索结果列表-->
    <div class="courseList" v-else>
      <ul class="hotcourses-content" v-for="(item,index) in courseList" :key="'item'+index">
        <div class="hotcourses-content-link" @click="toCourseDetails(item)">
          <li>
            <div class="hotcoursesListLeft">
              <p class="hotcoursesList-explain">{{item.courseName}}</p>
              <div class="hotcoursesList-bottom" v-html="item.courseSynopsis">
              </div>
            </div>
            <div class="hotcourseesListImg">
              <img :src="item.picurl" alt />
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
  </div>
</template>
<script>
import qs from "qs";

export default {
  data(){
    return{
      userinfo:null,
      isrotate:false,//动画
      value:"",//搜索框文字
      isLast:false,//是否是最后一页
      isLoading:false,//loading是否显示
      pageNo:1,//当前页数
      pageSize:10,//每页条数
      count:0,//总条数
      courseList:[],//搜索结果列表
      hotSearch:[],//热门搜索
      historySearch:[],//历史搜索
    }
  },
  created(){
    document.title = "搜索"
  },
  mounted(){
    //获取用户数据
    if(localStorage.getItem('userinfo')){
      this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
    }else {
      this.userinfo = null
    }
    this.getHotSearch()
    if(this.userinfo){
      this.getHistorySearch()
    }

  },
  methods:{
    //热门搜索
    getHotSearch(){
      let that = this
      this.$ajax.post(this.GLOBAL.BASE_URL + '/pcweb/search/findHotCourse').then(res => {
        console.log(res)
        that.isLoading = false
        if(res.data.success && res.data.errorCode == 2){
          that.hotSearch = res.data.body.hotCourse
          console.log(that.hotSearch)
        }else {
          this.$toast({
            message: res.data.msg,
          })
        }
      })
    },
    //历史搜索
    getHistorySearch(){
      let that = this
      that.isLoading = true
      let userId = ''
      if(that.userinfo){
        userId=that.userinfo.userId
      }else {
        userId = ''
      }
      this.$ajax.post(this.GLOBAL.BASE_URL + '/pcweb/search/findSearchHistory',qs.stringify({userId:userId})).then(res => {
        console.log(res.data)
        that.isLoading = false
        if(res.data.success && res.data.errorCode == 2){
          that.historySearch = res.data.body.search
          console.log(that.historySearch)
        }else {
          this.$toast({
            message: res.data.msg,
          })
        }
      })
    },
    //点击热门搜索
    tosearch(value){
      this.value = value
      this.onSearch()
    },
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
      this.$ajax.post(this.GLOBAL.BASE_URL + '/pcweb/search/courseSearch',qs.stringify({pageNum: (parseInt(that.pageNo) + 1), userId:userId, pageSize:that.pageSize})).then(res => {
        console.log(res.data)
        that.isLoading = false
        if(res.data.success && res.data.errorCode == 2){
         /* that.pageNo = res.data.body.coursePage.pageNo
          that.pageSize = res.data.body.coursePage.pageSize
          that.count = res.data.body.coursePage.count
          if(res.data.body.coursePage.count < res.data.body.coursePage.pageSize * res.data.body.coursePage.pageNo){
            that.isLast = true
          }else {
            that.isLast = false
          }*/
          let baseUrl = that.GLOBAL.BASE_IMAGE_URL
          let list = res.data.body.result
          //拼接图片url
          list.map(function (item) {
            item.picurl = baseUrl + item.picurl
            item.courseSynopsis = item.courseSynopsis.replace(/\n/g,"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
            that.hotCourseList.push(item)
          })
          console.log(this)
        }else {
          this.$toast({
            message: res.data.msg,
          })
        }
      })
    },
    //取消搜索
    onCancel(){
      //清除课程列表
      this.courseList = []
      console.log('清除数据')
      console.log(this.courseList)
    },

    // 搜索
    onSearch(){
      let that = this
      that.isLoading = true
      console.log(this.value)
      let userId = ''
      if(that.userinfo){
        userId=that.userinfo.userId
      }else {
        userId = ''
      }
      this.$ajax.post(this.GLOBAL.BASE_URL + '/pcweb/search/courseSearch',qs.stringify({pageNum: 1, userId:userId,keyword:this.value, pageSize:that.pageSize})).then(res => {
        console.log(res.data)
        that.isLoading = false
        if(res.data.success && res.data.errorCode == 2){
         /* that.pageNo = res.data.body.coursePage.pageNo
          that.pageSize = res.data.body.coursePage.pageSize
          that.count = res.data.body.coursePage.count
          if(res.data.body.coursePage.count < res.data.body.coursePage.pageSize * res.data.body.coursePage.pageNo){
            that.isLast = true
          }else {
            that.isLast = false
          }*/
          let baseUrl = that.GLOBAL.BASE_IMAGE_URL
          let list = res.data.body.result
          let results = [];
          //拼接图片url
          list.map(function (item) {
            item.picurl = baseUrl + item.picurl
            item.courseSynopsis = item.courseSynopsis.replace(/\n/g,"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
            results.push(item)
          })
          that.courseList = results
          if(this.userinfo){
            this.getHistorySearch()
          }
          console.log(this)
        }else {
          this.$toast({
            message: res.data.msg,
          })
        }
      })
    },
    // 刷新动画
    refreshani(){
      let self = this;
      self.isrotate = true;
      setTimeout(function(){self.isrotate = false;},600)
    },
    //删除最近搜索
    deletelist(){
      let that = this
      let userId = ''
      if(that.userinfo){
        userId=that.userinfo.userId
      }else {
        userId = ''
      }
      this.historySearch = [];
      this.$ajax.post(this.GLOBAL.BASE_URL + '/pcweb/search/deleteSearchHistory',qs.stringify({userId:userId})).then(res => {
        console.log(res.data)
        that.isLoading = false
        if(res.data.success && res.data.errorCode == 2){
          this.$toast({
            message: res.data.msg,
          })
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
          this.$router.push({path:'/MicroProject' ,query:{courseId:item.courseId}});
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
}
</script>
<style scoped>
.searchresult{
  width: 100vw;
  height: 100vh;
}
.searchinput{
  width: 100vw;
  background: #f8f8f8;
  position: fixed;
  top: 0;left: 0;
  z-index: 10;
}
.courseList{
  width: 100%;
  background: #f8f8f8;
  margin-top: 1.6rem;
  /*padding: 3% 5%;*/
}
.searchresult /deep/ .van-search__content{
  background: #fff;
}
/* 热门搜索 */
.hotsearch{
  width: 100%;
  background: #fff;
  padding: 3% 5%;
  margin-top: 1.6rem;
}
.hotsearch p{
  font-size: 0.43rem;
  color: #5F5F5F;
}
.hotlist{
  width: 100%;
}
.hotlist .hottxt{
  display: inline-block;
  color: #666;
  font-size: 0.4rem;
  padding: 0 3%;
  line-height: 0.6rem;
  border: 1px solid #f7f7f7;
  border-radius: 50px;
  margin-left: 3%;
  margin-top: 5%;
}
.refresh{
  margin-top: 8%;
  text-align: center;
}
.refresh span{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.36rem;
  color: #D5D5D5;
}
.refresh span img{
  width: 0.4rem;
  height: 0.4rem;
  margin-right: 0.1rem;
}
.refresh span .imgrotate{
  animation: rotates 0.6s linear infinite;
}
@keyframes rotates{
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(360deg);
  }
}
/* 最近搜索 */
.letely {
  width: 100%;
  background: #fff;
  padding: 3% 5%;
  margin-top: 0.2rem;
  padding-bottom: 10%;
}
.letely .letelytit{
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
}
.letely .letelytit span{
  font-size: 0.43rem;
  color: #5F5F5F;
}
.letely .letelytit img{
  width: 0.6rem;
  height: 0.6rem;
}
.letelylist li{
  width: 100%;
  display: inline-flex;
  align-items: center;
  padding: 2% 0;
  border-bottom: 1px solid #F8F8F8;
  margin-top: 0.35rem;
}
.letelylist li span{
  font-size: 0.43rem;
  color: #5F5F5F;
}
.letelylist li img{
  width: 0.55rem;
  height: 0.55rem;
  margin-right: 0.25rem;
}
/*搜索结果*/
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
  padding: 0.2rem 0.1rem;
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
  height: 1rem;
  color: #515151;
  line-height: 0.65rem;
  overflow: hidden;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
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

  color: #afafaf;
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  margin-right: 10px;
}
</style>
