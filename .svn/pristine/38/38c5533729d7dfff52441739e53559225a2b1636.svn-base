<template>
  <div class="block">
    <div class="bigBox" v-for="(activity, index) in activities" :key="index">
      <div class="dateTitle">{{activity.yearAndMonth}}</div>
      <div class="dateLine">
        <el-timeline :reverse="reverse">
          <el-timeline-item>
            <div class="date">{{activity.monthAndDate}}</div>
            <div class="dataStructure flexLayout">
              <h5>{{activity.courseName}}</h5>
              <el-progress :percentage="activity.SumSchedule"></el-progress>
            </div>
            <div class="classHourBox" v-for="(zhangjie, index) in activity.chapterMessage" :key="index">
                <p class="zhangjie">{{zhangjie.chapterName}}</p>
                <div class="classHourOneBox" v-for="(list, index) in zhangjie.hourmessage" :key="index">
                  <p class="classHourOneTitle flexLayout">
                    <span>{{list.hourName}}</span>
                    <img class="rightImg" src="../../static/images/right.png" alt="">
                  </p>
                  <p class="watchBox flexLayout">
                    <span @click="toLook(activity,list)" class="watchButton" :class="list.isComplete == '0' ? 'watchButtonColor' : 'watchButtonShow'">{{list.isComplete == '0' ? '未看完' : '已看完'}}</span>
                    <span class="watchTime">{{list.studentTime}}</span>
                  </p>
                </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data() {
    return {
      reverse: true,
      activities: [
        // {
        //   dateTimeTop: "2019-03",
        //   kechenglist:[
        //     {
        //       date: "08-12",
        //       dataStructure: "数据结构",
        //       percentage: 10,
        //       zhangjies:[
        //         {
        //           zjtit:"第一章",
        //           lists:[
        //             {keshi:"课时一：基于二进制的信息表述",watchButton:true,watchTime:"09:22:40"},
        //             {keshi:"课时二：计算机构成与工作原理",watchButton:false,watchTime:"09:22:40"},
        //           ]
        //         }
        //       ]
        //     }
        //   ]
        // },{
        //   dateTimeTop: "2019-01",
        //   kechenglist:[
        //     {
        //       date: "08-12",
        //       dataStructure: "数据结构",
        //       percentage: 10,
        //       zhangjies:[
        //         {
        //           zjtit:"第一章",
        //           lists:[
        //             {keshi:"课时一：基于二进制的信息表述",watchButton:false,watchTime:"09:22:40"},
        //             {keshi:"课时二：计算机构成与工作原理",watchButton:false,watchTime:"09:22:40"},
        //           ]
        //         },{
        //           zjtit:"第二章",
        //           lists:[
        //             {keshi:"课时一：基于二进制的信息表述",watchButton:false,watchTime:"09:22:40"},
        //             {keshi:"课时二：计算机构成与工作原理",watchButton:false,watchTime:"09:22:40"},
        //           ]
        //         },
        //       ]
        //     }
        //   ]
        // }
      ]
    };
  },
  created(){
    document.title = "课程记录";

    //获取用户数据
    if (localStorage.getItem("userinfo")) {
      this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    } else {
      this.userinfo = null;
    }
    this.init()
  },
  methods: {
    toLook: function(activity,list){
      if(list.isComplete == '0'){
        this.$router.push({path:"/VideoPage",query: {courseId:activity.typeId,currentHourClassId:list.hourId}}) //typeId - 课程分类id
      }
    },
    //页面初始化
    init(){
      let that = this
      let userId = "";
      if (that.userinfo) {
        userId = that.userinfo.userId;
      } else {
        userId = "";
      }
      this.$ajax.post(this.GLOBAL.BASE_URL + "/personal/findStudentRecord",qs.stringify({ userId: userId })).then(res=>{
        if (res.data.success && res.data.errorCode == 2) {
          that.activities = res.data.body.studentScheduleList
        }else{
          this.$toast({
            message: res.data.msg
          });
        }
      })
    }
  },
  components: {}
};
</script>

<style scoped>
.flexLayout{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.block {
  padding: 0.4rem 0;
}
.bigBox{
  margin-bottom: 0.5rem;
}
.dateTitle {
  width: 2.3rem;
  height: 0.8rem;
  color: #dae8fc;
  font-size: 0.35rem;
  line-height: 0.8rem;
  text-indent: 0.4rem;
  margin-bottom: 0.3rem;
  background: url(../../static/images/dateBj.png) no-repeat;
  background-size: 100% 100%;
}
.dateLine{
    padding: 0.35rem;
    background: #fff;
}
.block /deep/ .el-timeline-item__node--normal {
    left: 1px;
    width: 0.2rem;
    height: 0.2rem;
}
.date{
  color: #A9A9A9;
}
.dataStructure{
  padding: 0.2rem 0;
}
.el-progress {
  width: 42%;
}
.el-progress-bar {
  width: 100%;
}
.block /deep/ .el-progress-bar__inner{
  background-color: #F46405;
}
.block /deep/ .el-progress__text{
  color: #9B9B9B;
}
.block /deep/ .el-timeline-item{
  padding-bottom: 0;
}
.block /deep/ .el-timeline-item__timestamp.is-bottom {
    margin-top: 0;
}
.dataStructure h5 {
  color: #414141;
  font-size: 0.38rem;
  font-weight: 400;
}
.classHourBox{
  width: 100%;
  line-height: 0.8rem;
  background: #F9F9F9;
  border-radius: 0.2rem;
}
.zhangjie{
  padding: 0.15rem 0.3rem;
  border-bottom: 1px solid #E7E7E7;
}
.classHourOneBox{
  padding: 0.15rem 0.3rem;
  border-bottom: 1px solid #F3F3F3;
}
.classHourOneBox:last-child{
  border-bottom: none;
}
.rightImg{
  width: 0.5rem;
  height: 0.5rem;
}
.classHourOneTitle{
  color: #7B7B7B;
}
.watchButton{
  display: block;
  width: 1.5rem;
  height: 0.65rem;

  text-align: center;
  line-height: 0.65rem;
  letter-spacing: 0.05rem;
  font-weight: 400;

  border-radius: 0.15rem;
}
.watchButtonShow{
  color: #AFAFAF;  /* 已看完 */
  background: #EEEEEE; /* 已看完 */
}
.watchButtonColor{ /* 未看完 */
  color: #fef3ef;
  background: #ff7a38;
}
.watchTime{
  color: #A9A9A9;
}
</style>>

</style>
