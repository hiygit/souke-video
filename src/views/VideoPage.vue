<template>
  <div class="videoPage">
    <!-- <div class="course-details-video" v-show="update">
     <ali-player :source="aplayer.source" :vid="aplayer.vid" :playauth="aplayer.playauth" :cover="aplayer.cover" ref="player"  ></ali-player>
      <video id="my-video" class="video-js vjs-default-skin" controls preload="auto" :poster="videos.poster" src=""></video>
    </div> -->
    <div class="course-details-video" style="padding:0;overflow: hidden" v-if="update">
      <ali-player :source="aplayer.source" :vid="aplayer.vid" :playauth="aplayer.playauth" :cover="aplayer.cover" ref="player" style="height:100%;" ></ali-player>
    </div>
    <div class="course-details-video" v-if="!update">
      <van-loading size="40" class="loading"/>
    </div>


    <div class="playing" >
      <h5 class="playingTitle">{{currentClass?currentClass.hourName:''}}</h5>
      <p class="playingNum">累计播放：<span>{{currentClass?currentClass.click:'0'}}</span>次</p>
    </div>
    <!-- 课程大纲 课时  课程只有一个章节时显示-->
    <div  class="courseOutline" v-if="chapterlist.length == 1">
      <div class="courseTitle">
        <div class="courseTitleTop">
          <h5 style="font-size: 0.4rem;">课程大纲：</h5>
          <p class="timelen">
            累计总时长：
            <span>{{courseDetails.sumVoideTime}}</span>
          </p>
        </div>
        <div class="authorizationTab">
          <span>
            <i class="dot"></i> 已授权
          </span>
          <span>
            <i class="dot" style="background: #BEBEBE"></i> 未授权
          </span>
        </div>
      </div>
      <!-- 课程大纲 课时 -->
      <div class="courseOutlineListBox" >
        <van-collapse v-model="activeNames1" accordion v-for="(item,index) in chapterlist[0].courseHourList" :key="'item'+index">
          <van-collapse-item :name="index" class="moveDownIcon">
            <div slot="title">
              <div class="titles">
                <p class="hour">
                  <i class="dot"></i> 课时{{index+1}}： {{item.hourName}}
                </p>
                <p class="hour-time">
                  {{item.createDate}}更新
                  <span>时长：{{item.videoTime}}</span>
                </p>
              </div>
            </div>
            <span class="toLook" :class="item.isLock == '0'?'':'notolook'" @click="gotolook(item)">去观看</span>
            <div class="courserExerciseBox" v-show="item.hasBank == '1'">
              <div class="courserExerciseBoxLeft">
                <span class="titleColor">课程练习</span>
                <p class="hour-time">{{item.createDate}}更新</p>
              </div>
              <span class="toLook" :class="item.hasBank == '1'?'':'notolook'" @click="goanswer(item.id,item.teacherIssue?item.teacherIssue.id:'')">去答题</span>
            </div>
            <div class="studymsg" v-show="item.meansList">
              <span class="titleColor">学习资料</span>
              <div class="courserExerciseBox" style="border-bottom: none" v-for="(item1,index1) in item.meansList" :key="'item1'+index1">
                <p>{{item1.meansName}}</p>
                <span class="toLook"  @click="checkfile(item1,item.id)">查看</span>
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>

    <!-- 课程大纲 章节 -->
    <div class="courseOutline" v-else>
      <div class="courseSectionBox oLayout" >
        <h5 style="font-size: 0.4rem;">课程大纲：</h5>
        <p class="timelen">
          累计总时长：
          <span>{{courseDetails.sumVoideTime}}</span>
        </p>
      </div>
      <div class="courseSection">
        <van-collapse v-model="activeNames2" accordion v-for="(items,index) in chapterlist" :key="'c'+index">
          <van-collapse-item :title="items.chapterName" :name="index"   >
            <span class="tancengbtn" @click="showPopup(items)"></span>
            <p class="textHigh" :class="items.ismore?'heightauto':''" v-html="items.chapterSynopsis"></p>
            <div class="flexible" @click="showmore(items)">{{items.ismore?"收起":"更多"}} <i :class="items.ismore?'up':'down'"></i></div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>

    <!-- 底部弹出层 -->
    <van-popup v-model="show" round position="bottom" :style="{ height: '85%' }">
      <!-- 课程大纲 -->
      <div class="courseOutline">
        <div class="courseTitle">
          <div class="courseTitleTop">
            <h5 style="font-size: 0.4rem;">课程大纲：</h5>
            <p class="timelen">
              累计总时长：
              <span>{{courseDetails.sumVoideTime}}</span>
            </p>
          </div>
          <div class="authorizationTab">
            <span>
              <i class="dot"></i> 已授权
            </span>
            <span>
              <i class="dot" style="background: #BEBEBE"></i> 未授权
            </span>
          </div>
        </div>
        <!-- 课程大纲 课时 -->
        <div class="courseOutlineListBox" >
          <van-collapse v-model="activeNames1" accordion v-for="(item,index) in currentCourseHourList" :key="'item'+index">
            <van-collapse-item :name="index" class="moveDownIcon">
              <div slot="title">
                <div class="titles">
                  <p class="hour">
                    <i class="dot"></i> 课时{{index+1}}： {{item.hourName}}
                  </p>
                  <p class="hour-time">
                    {{item.createDate}}更新
                    <span>时长：{{item.videoTime}}</span>
                  </p>
                </div>
              </div>
              <span class="toLook" :class="item.isLock == '0'?'':'notolook'" @click="gotolook(item)">去观看</span>
              <div class="courserExerciseBox" v-show="item.hasBank == '1'">
                <div class="courserExerciseBoxLeft">
                  <span class="titleColor">课程练习</span>
                  <p class="hour-time">{{item.createDate}}更新</p>
                </div>
                <span class="toLook" :class="item.hasBank == '1'?'':'notolook'" @click="goanswer(item.id,item.teacherIssue?item.teacherIssue.id:'')">去答题</span>
              </div>
              <div class="studymsg" v-show="item.meansList">
                <span class="titleColor">学习资料</span>
                <div class="courserExerciseBox" style="border-bottom: none" v-for="(item1,index1) in item.meansList" :key="'item1'+index1">
                  <p>{{item1.meansName}}</p>
                  <span class="toLook"  @click="checkfile(item1,item.id)">查看</span>
                </div>
              </div>
            </van-collapse-item>
          </van-collapse>
        </div>
      </div>
      <!-- 暂时没有更多课时了！ -->
      <div class="noCourse" >
        <img src="../../static/images/noMoreClass.png" alt />
        <span>暂时没有更多课时了！</span>
      </div>
    </van-popup>

    <!-- 暂时没有更多课时了！ -->
    <div class="noCourse">
      <img src="../../static/images/noMoreClass.png" alt />
      <span>暂时没有更多课时了！</span>
    </div>
    <!-- 弹窗 -->
    <div class="windowsBox" v-show="tankuangShow">
      <div class="windowsBj">
        <p class="windowContent">您上一课时还没完成，请先完成上一课时再观看下一课时视频！</p>
        <span class="windowButton">去完成</span>
      </div>
      <!-- 关闭按钮 -->
      <img @click="closeIcon" class="closeIcon" src="../../static/images/closeIcon.png" alt />
    </div>
  </div>
</template>

<script>
  import qs from "qs";
  import VueAliplayer from "./VueAliplayer";
  // import videojs from 'video.js'
  import 'videojs-contrib-hls'
  export default {
    components: {
      'ali-player': VueAliplayer
    },
    data() {
      return {
        videos:{},
        update:false,
        activeNames: ["0"],//课程讲师
        activeNames1: "0",//课程大纲  课时
        activeNames2: "1",//课程大纲  章节
        show: false,//弹出层 显示隐藏
        tankuangShow:false,//弹窗
        showquans:[1,1,1,0],
        //讲师列表
        lecturerlist:[],
        //课程章节
        chapterlist:[],
        courseId:'',//课程id
        courseDetails:'',//课程详情
        currentCourseHourList:[],//被选中章节的课时列表
        sumSchedule:'',//学习进度
        currentClass:null,//当前选中的课时
        currentHourClassId:'',//当前课时id

        //视频播放
        aplayer: {
          source:'',
          vid: "",
          language: 'zh-CN',
          fluid: true,
          playauth: "",
          cover:"",//播放前展示的图片
          format: "mp4",
          setSpeed:false
        },
        player: null
      };
    },
    created(){
      document.title = "课程详情"
    },
    mounted() {
      //获取用户信息
      if(localStorage.getItem('userinfo')){
        this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
      }else {
        this.userinfo = null
      }
      //从路由中获取课程id
      //获取课程详情
  
      this.courseId = this.$route.query.courseId//课程id
    
      this.currentHourClassId = this.$route.query.currentHourClassId//被选中课时id
      //从路由中获取课程id
      this.courseId = this.$route.query.courseId
     

      //根据当前课时id获取详情
      this.getHourClass()
      //初始化视频播放器
      // videojs("my-video",function() {
      //   this.play();
      // });
    },
    methods: {
      //刷新数据
      refresh(){
        //获取课程详情
          let that = this
          let userId = ''
          if (that.userinfo) {
            userId = that.userinfo.userId
          } else {
            userId = ''
          }
          let baseUrl = that.GLOBAL.BASE_IMAGE_URL
          that.isLoading = true
          this.$ajax.post(this.GLOBAL.BASE_URL + '/courses/findCourseInfo', qs.stringify({
            userId: userId,
            courseId: that.courseId,
          })).then(res => {
            console.log(res.data)
            that.isLoading = false
            if (res.data.success && res.data.errorCode == 2) {
              this.courseDetails = res.data.body.course
              this.sumSchedule = res.data.body.sumSchedule
              this.courseDetails.hotImage = baseUrl + res.data.body.course.hotImage
              this.courseDetails.courseSynopsis = baseUrl + res.data.body.course.courseSynopsis.replace(/\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
              //章节列表
              let listchapter = []
              listchapter = res.data.body.courseChapterList
              //拼接图片url
              if (listchapter.length > 0) {
                listchapter.map(function (item) {
                  item.chapterSynopsis = item.chapterSynopsis.replace(/\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
                  item.ismore = false
                })
                this.chapterlist = listchapter
              }
            } else {
              this.$toast({
                message: res.data.msg,
              })
            }
          })
      },
      //根据课时id获取课时信息
      getHourClass(){
        let that = this
        let userId = ''
        if(that.userinfo){
          userId = that.userinfo.userId
        }else {
          userId = ''
        }
        let baseUrl = that.GLOBAL.BASE_IMAGE_URL
        that.isLoading = true
        this.$ajax.post(this.GLOBAL.BASE_URL + '/courses/appFindVideo',qs.stringify({courseHourId:that.currentHourClassId})).then(res => {
          that.isLoading = false
          if(res.data.success && res.data.errorCode == 2){
            that.currentClass = res.data.body
            //给播放器url赋值
            // that.videos.poster = JSON.parse(res.data.body.coverURL)
            // var player = videojs('my-video');  
            // player.src(res.data.body.videoUrlMp4); 
            // that.update = true

            that.currentClass = res.data.body.hour
            //给播放器url赋值
            that.aplayer.source = res.data.body.videoUrlMp4
            that.aplayer.vid = res.data.body.videoId
            that.aplayer.playauth = res.data.body.videoInfo
            that.aplayer.cover = JSON.parse(res.data.body.coverURL) 

            //重载组件
            // 移除组件
            that.update = false
            // 在组件移除后，重新渲染组件
            // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
            that.$nextTick(() => {
              that.update = true
            })

            //通知服务端：已观看视频
            that.$ajax.post(this.GLOBAL.BASE_URL+'/courses/updateStatus',
              qs.stringify({hourId:that.currentHourClassId,userId:userId,videoState:1}))
              .then( res => {
                console.log(res);
                if(res.data.success && res.data.errorCode == 2){
                  console.log("观看了视频")
                  //刷新数据
                  that.refresh()
                }else {

                }
              })

          }else {
            this.$toast({
              message: res.data.msg,
            })
          }
        })
      },
      //播放事件 start
      played() {
        console.log("play callback");
      },
      play() {
        const player = this.$refs.player.instance;
        player && player.play();
      },
      pause() {
        const player = this.$refs.player.instance;
        player && player.pause();
      },
      replay() {
        const player = this.$refs.player.instance;
        player && player.replay();
      },
      //播放事件 end
      //关闭弹窗按钮
      closeIcon: function() {
        this.isShow = false;
      },
      // 关闭弹窗按钮
      closeIcon: function() {
        this.tankuangShow = false;
      },
      // 显示弹出层
      showPopup: function(items) {
        // if(items.finish){
        this.show = true;
        this.currentCourseHourList = items.courseHourList
        // }else{
        //     this.tankuangShow = true;
        // }
      },
      //课程讲师 更多按钮
      showmore(items){
        console.log(items.ismore)
        items.ismore = !items.ismore
      },
      //去观看课程视频
      gotolook(item){
        console.log(item)
        let self = this
        let userId = ''
        if(self.userinfo){
          userId = self.userinfo.userId
        }else {
          userId = ''
        }
        if(item.isLock == '0'){
          self.dialogVisible = false;
          //切换当前视频的内容
          self.currentClass = item
          //给播放器url赋值
          self.aplayer.source = item.videoUrl
          self.aplayer.vid = item.videoId
          self.aplayer.playauth = item.videoInfo
          self.aplayer.cover = item.coverURL

          //重载组件
          // 移除组件
          self.update = false
          // 在组件移除后，重新渲染组件
          // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
          self.$nextTick(() => {
            self.update = true
          })
          self.show = false
          //通知服务端：已观看视频
          self.$ajax.post(this.GLOBAL.BASE_URL+'/courses/updateStatus',
            qs.stringify({hourId:self.currentHourClassId,userId:userId,videoState:1}))
            .then( res => {
              console.log(res);
              if(res.data.success && res.data.errorCode == 2){
                console.log("观看了视频")
                //刷新数据
                self.refresh()
              }else {

              }
            })

        }else {
          this.tankuangShow = true
        }
      },
      //去答题
      goanswer(hourid,id){
        this.$router.push({path:"/lineexam",query:{hourId:hourid,issueId:id,fromType:1}})
      },
      //查看资料
      checkfile(item,hourId){
        //通知服务端查看这条资料
        this.$ajax.post(this.GLOBAL.BASE_URL+'/courses/updateStatus',
          qs.stringify({hourId:hourId,userId:this.userinfo.userId,meansId:item.id}))
          .then( res => {
            console.log(res);
            if(res.data.success && res.data.errorCode == 2){
              console.log("观看了资料")
              //添加阅读次数 courses/updateViewCount
              this.$ajax.post(this.GLOBAL.BASE_URL+'/courses/updateViewCount',
                qs.stringify({meansId:item.id}))
                .then( res => {
                  console.log(res);
                  if(res.data.success && res.data.errorCode == 2){
                    console.log("添加了次数")
                    this.$router.push({path:"/Programming",query:{means:item}})
                  }else {

                  }
                })

            }else {

            }
          })
      },
    },

  };
</script>

<style>
  .banner{
    width: 100vw;
    height: 3.8rem;
  }
  .banner img{
    width: 100%;
    height: 100%;
  }
  .introductionBox {
    width: 100%;
    margin-bottom: 0.25rem;
  }
  .introductionTopBox {
    width: 100%;
    padding: 0.35rem;
    color: #838383;
    font-size: 0.38rem;
    line-height: 0.65rem;
  }
  .introductionTopBox h5 {
    color: #2b2b2b;
    font-size: 0.4rem;
    text-indent: 1em;
    line-height: 0.45rem;
    border-left: 3px solid #fe691b;
    margin-bottom: 0.3rem;
  }
  .studySpeedBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.35rem;
    background: #fff;
  }
  .el-progress {
    width: 42%;
  }
  .el-progress-bar {
    width: 100%;
  }
  .studySpeedBox h5 {
    font-size: 0.4rem;
  }
  .el-progress-bar__inner {
    background-color: #f46303;
  }
  .el-progress__text {
    color: #a2a2a2;
  }
  /* 课程讲师 */
  .courseLecturer {
    margin-bottom: 0.25rem;
    background: #fff;
  }
  .van-cell {
    padding: 0.35rem;
    border-bottom: 0.01rem solid #eeeeee;
    position: relative;
  }
  .van-cell__right-icon {
    color: #1177ed;
  }
  .van-cell__title {
    color: #4C4C4C;
    font-weight: 600;
    font-size: 0.4rem;
  }
  .courseLecturerList{
    position: relative;
    margin-top: 1.5rem;
  }
  .courseLecturerList:first-child{
    margin-top: 0;
  }
  .headName {
    display: flex;
    align-items: center;
    color: #14163d;
    margin-bottom: 0.3rem;
  }
  .headName img {
    width: 0.9rem;
    height: 0.9rem;
    margin-right: 0.5rem;
  }
  .courseLecturerList-text {
    width: 100%;
    height: 1.9rem;
    color: #5d5d5d;
    line-height: 0.6rem;
    overflow: hidden;
  }
  .courseLecturer .van-collapse-item__wrapper {
    padding-bottom: 0.68rem;
  }
  /* 课程大纲 课时 */
  .courseOutline {
    background: #fff;
    /* border-bottom: 1px solid #E6E6E6; */
  }
  .courseTitle {
    padding: 0.25rem 0.4rem;
  }
  .courseTitleTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.2rem;
  }
  .timelen {
    color: #989898;
    font-size: 0.35rem;
  }
  .authorizationTab {
    color: #838383;
    font-size: 0.35rem;
  }
  .authorizationTab span {
    margin-right: 0.5rem;
  }
  .dot {
    display: inline-block;
    width: 0.13rem;
    height: 0.13rem;
    margin-right: 0.05rem;
    background: #ff732d;
    border-radius: 50%;
    vertical-align: middle;
    position: relative;
    top: -1px;
  }
  .van-cell:last-child {
    border-bottom: none;
  }
  .hour {
    color: #4C4C4C;
    font-size: 0.38rem;
  }
  .hour-time {
    color: #a3a3a3;
    font-size: 0.38rem;
    font-weight: 400;
    margin-bottom: 0.1rem;
  }

  .toLook {
    display: block;
    width: 1.7rem;
    height: 0.7rem;
    color: #fef3ef;
    text-align: center;
    line-height: 0.7rem;
    letter-spacing: 0.05rem;
    font-weight: 400;
    background: #ff7a38;
    border-radius: 0.15rem;
    margin-top: 0.5rem;
    margin-bottom: 0.2rem;
  }
  span.notolook{
    background: #eee;
    color: #BEBEBE;
  }
  .moveDownIcon .van-cell__right-icon {
    margin-top: 0.25rem;
  }
  .moveDownIcon .van-collapse-item__content {
    padding: 0rem 0.4rem;
  }
  .courserExerciseBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 0.01rem solid #f8f8f8;
    padding: 0.15rem 0;
  }
  .courserExerciseBoxLeft {
    line-height: 0.75rem;
    font-size: 0.4rem;
  }
  .titleColor {
    color: #676767;
  }
  .studymsg {
    padding: 0.15rem 0;
  }
  /* 暂时没有更多课时了! */
  .noCourse {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #cdcdcd;
    font-size: 0.3rem;
    line-height: 1.3rem;
    letter-spacing: 0.02rem;
    background: #fff;
  }
  .noCourse img {
    width: 0.8rem;
    height: 0.65rem;
    margin-right: 0.2rem;
  }

  /* 弹窗 */
  .windowsBox {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 3000;
  }
  .windowsBj {
    width: 70%;
    font-size: 0.35rem;
    background: url(../../static/images/windowsBj.png) no-repeat;
    background-size: 100% 100%;
    margin: 50% auto;
    padding: 0.3rem;
    padding-bottom: 0.5rem;
    margin-top: 46%;
  }
  .windowContent {
    color: #848484;
    line-height: 0.6rem;
    margin-top: 3.5rem;
  }
  .windowButton {
    display: block;
    width: 95%;
    color: #fff;
    text-align: center;
    letter-spacing: 0.05rem;
    padding: 0.3rem;
    margin: 0 auto;
    margin-top: 0.5rem;
    background: linear-gradient(top, #78b4fa, #2D88F0);
    border-radius: 0.5rem;
  }
  .closeIcon {
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    margin: -45% auto;
  }

  /* 课程大纲 章节 */
  .oLayout {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .courseSectionBox {
    padding: 0.35rem 0.4rem;
    background: #fff;
    margin-bottom: 0.25rem;
  }
  .van-collapse-item__content {
    font-size: 0.38rem;
  }
  .textHigh {
    width: 100%;
    height: 2.2rem;
    overflow: hidden;
    /* background: palegoldenrod; */
  }
  .flexible{
    width: 100%;
    height: 1.5rem;
    color: #2481ee;
    text-align: center;
    line-height: 1.7rem;
    background: url(../../static/images/masking.png);
    background-size: 100% 100%;
    position: absolute;
    bottom: 0rem;
    left: 0;
    padding-top: 0.08rem;
  }
  .flexible i.down{
    display: inline-block;
    width: 0.2rem;
    height: 0.2rem;
    border-top: 1px solid #2481ee;
    border-right: 1px solid #2481ee;
    transform: rotate(135deg);
    position: relative;
    top: -3px;
  }
  .flexible i.up{
    display: inline-block;
    width: 0.2rem;
    height: 0.2rem;
    border-top: 1px solid #2481ee;
    border-right: 1px solid #2481ee;
    transform: rotate(-45deg);
    position: relative;
    top: 1px;
  }
  .courseSection .van-collapse-item {
    margin-bottom: 0.25rem;
    border-bottom: none;
    position: relative;
    /* padding-bottom: 0.75rem; */
  }
  .van-collapse-item__title--disabled .van-cell__right-icon{
    color: #1177ed;
  }
  /* 底部弹出层 */
  .van-popup--bottom.van-popup--round {
    padding: 0.3rem 0;
  }
  .teachmore{
    bottom: -1rem;
    border-bottom: 1px solid #EAEAEA;
  }
  .courseLecturerList:last-child .teachmore{
    border: none;
  }
  div.heightauto,p.heightauto{
    height: auto;
    padding-bottom: 0.65rem;
  }
  p.heightauto{
    padding-bottom: 0.9rem;
  }
  .courseSection .van-collapse-item__title .van-cell__right-icon::before{
    transform: rotate(0deg);
  }
  .tancengbtn{
    width: 100%;
    height: 1.3rem;
    position: absolute;
    top: 0;left: 0;
    z-index: 300;
  }
  .videoPage  /deep/ .prism-player .prism-time-display{
    font-size: 0.45rem;
  }
  .course-details-video {
    height: 50vh;
    display: flex;
    flex-direction: row;
    box-shadow: 3px 3px 5px 1px rgba(0, 0, 0, 0.3);
    position: relative;
  }

  .playing{
    padding: 0.4rem;
    font-size: 0.4rem;
    letter-spacing: 0.02rem;
  }
  .playingTitle{
    color: #343434;
    text-indent: 0.3rem;
    font-size: 0.4rem;
    margin-bottom: 0.2rem;
    border-left:0.1rem solid #FF6600;
  }
  .playingNum{
    color: #999999;
  }
  .prism-player .prism-time-display .current-time,.prism-player .prism-time-display .duration{
    font-size: 0.45rem;
  }
  .prism-time-display{
    margin-top: 17px !important;
  }
  .vjs-default-skin{
    width: 100%;
    height: 50vh;
  }
  .loading{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%)
  }
</style>
