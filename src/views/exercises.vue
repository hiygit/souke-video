<template>
  <div class="grade">
    <img src="../../static/images/gradebj.png" alt="" srcset="" class="gradebl">
    <div class="gradebox">
      <div class="speech">
        <h5>恭喜您，完成答题！</h5>
        <p>ANSWERS COMPLETED</p>
      </div>
      <img :src="userinfo.userPic" alt="" srcset="" class="gradeimg">
      <div class="gradename">{{userinfo.userName}}</div>
      <div class="gradetime" v-if="fromType==1">恭喜您完成本次答题，等待老师阅卷后查看结果</div>
      <div class="gradetime" v-if="fromType==2">恭喜您完成本次答题，期中有{{linkstr.didNotAnswer}}道试题并未作答。此次答题共计耗时{{exansTime.hh}}h{{exansTime.ss}}min！</div>
      <div class="analysis">
        <span @click="lookresolver">查看解析</span>
        <span @click="gotoclass">返回课程</span>
      </div>
    </div>
    <van-popup v-model="show" round position="bottom" :style="{height:'85%'}">
      <div class="codebox">
        <div class="codegroup"> 
          <div class="codeboxitem" v-for="(item,index) in examlist" :key="'o'+index" @click="current=index" v-if="index<togglelen">{{index+1}}</div>
          <div class="toggle" @click="changelen">{{toggleboor?'收起':'展开'}}</div>
        </div>
        <div class="currentanswer"><span>{{current+1}}/{{examlist.length}}</span>{{examlist[current].examsType==1?"单选题":examlist[current].examsType==2?"多选题":examlist[current].examsType==3?"判断题":""}}</div>
        <h5 class="examtitname">{{examlist[current].subject}}</h5>
        <!-- <div class="answerbox">
          <ul class="answerlist" v-if="examlist[current].examsType==1 || examlist[current].examsType==2">
            <li v-for="(items,index) in examlist[current].optionList" :key="'i'+index">
              <div v-if="items.checkeds">{{items.optionNumber}}.{{items.optionName}}</div>
            </li>
          </ul>
          <ul class="answerlist" v-if="examlist[current].examsType==3">
            <li v-for="(items,index) in examlist[current].optionList" :key="'i'+index">
              <div v-if="items.checkeds">{{items.optionNumber}}</div>
            </li>
          </ul>
        </div> -->
        <!-- =========================================================================== -->
        <div>
          <div class="answerbox">
            <ul class="answerlist">
              <li v-for="(items,index) in examlist[current].optionList" :key="'i'+index">{{items.optionNumber}}.{{items.optionName}}</li>
            </ul>
          </div>
          <div style="display:flex;width:100%">
            <p class="panswer">正确答案：B</p> 
            <p class="panswer">你的答案：A</p>
          </div>
          </div>
        <!-- =========================================================================== -->

        <div class="analysishint"><img src="../../static/images/analysis.png" alt="" srcset="">正确解析：</div>
        <div class="analysistext" style="margin-bottom:10px;">
          <div v-for="(items,index) in examlist[current].optionList" :key="'i'+index">
            <div v-if="items.uercheckeds">{{items.optionNumber}}.{{items.optionName}}</div>
          </div>
        </div>
        <div class="analysistext">{{examlist[current].resolving}}</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import qs from 'qs'
export default {
  data(){
    return{
      toggleboor:false,
      togglelen:7,
      fromType:"",//1-从课程详情过来    2-阅卷和我的考试过来
      userinfo:null,
      linkstr:{},//上级页面传 答题结果对象
      show:false,//弹出层
      current:0,//当前下标
      exansTime:{
        hh:"",
        ss:""
      },
      //考题数组
      examlist:[
        {
          examtit:"发hi换肤大师范德萨范德萨发开始混分巨兽范德萨发开始混分巨兽",
          types:0,//0单选题  1多选题   2代码题   3简单题
          options:[
            {option:"A",content:"孵化基地顺丰快递付货款是多少",checked:false},
            {option:"B",content:"孵化基地顺丰快递付货款是多少",checked:false},
            {option:"C",content:"孵化基地顺丰快递付货款是多少",checked:false},
            {option:"D",content:"孵化基地顺丰快递付货款是多少",checked:false},
          ]
        }
      ],
    }
  },
  created(){
    document.title = "在线答题"
    if(localStorage.getItem('userinfo')){
      this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
    }else {
      this.userinfo = null
    }
  },
  mounted(){
    if(this.$route.query.jsonstr){
      this.linkstr = JSON.parse(this.$route.query.jsonstr)
      this.exansTime.hh = this.linkstr.exansTime.split(":")[0]
      this.exansTime.ss = this.linkstr.exansTime.split(":")[1]<='00'?"01":this.linkstr.exansTime.split(":")[1]
    }
    this.issueId = this.$route.query.issueId
    this.fromType = this.$route.query.fromType
  },
  methods:{
    //展开 收起
    changelen(){
      if(this.toggleboor){
        this.togglelen = 7
        this.toggleboor = false
      }else{
        this.togglelen = this.examlist.length 
        this.toggleboor = true
      }
    },
    gotoclass(){
      this.$router.go(-2)
    },
    //初始化
    init(){
      
    },
    //查看解析
    lookresolver(){
      this.$toast({
        message: '加载中...',
        forbidClick: true
      })
      let that = this
      let obj = {
        issueId:this.$route.query.issueId,
        userId:JSON.parse(localStorage.getItem('userinfo')).userId
      }
      this.$ajax.post(this.GLOBAL.BASE_URL+'/courses/findResolving',qs.stringify(obj)).then(res=>{
        if(res.data.success && res.data.errorCode == 2){
          that.show = true
          let list = res.data.body.itemBankList,newarrlist=[];
          for(let i=0;i<list.length;i++){
            if(list[i].examsType == 1||list[i].examsType == 2||list[i].examsType == 3){
              if(list[i].answer != "" || list[i].singleAnswer != ""){
                let answers = list[i].answer.split(",")
                //正确答案
                let singanswers = list[i].singleAnswer.split(",")
                for(let j=0;j<singanswers.length;j++){
                  for(let z=0;z<list[i].optionList.length;z++){
                    if(singanswers[j] == list[i].optionList[z].optionNumber){
                      list[i].optionList[z].uercheckeds = true
                    }
                  }
                }
              }
              newarrlist.push(list[i])
            }
          }
          that.examlist = newarrlist
        }
      })
    },
  },
}
</script>
<style lang="" scoped>
.grade{
  width: 100vw;
  height: 99.5vh;
  position: relative;
  border-top: 1px solid transparent;
}
.gradebl{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;left: 0;
  z-index: 1;
}
.gradebox{
  width: 90vw;
  background: url(../../static/images/gradejx.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  margin-top: 1rem;
  padding-bottom: 1.5rem;
  text-align: center;
  overflow: hidden;
}
.speech{
  width: 97%;
  margin: 0 auto;
  background: #F4F9FF;
  text-align: center;
  padding: 0.8rem 0;
}
.speech h5{
  font-size: 0.42rem;
  color: #509BF2;
}
.speech p{
  font-size: 0.35rem;
  color: #C0C2C4;
  margin-top: 0.25rem;
}
.gradeimg{
  display: block;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  margin: 1.5rem auto 0;
}
.analysis{
  display: flex;
  width: 90%;
  color: #fff;
  font-size: 0.45rem;
  text-align: center;
  letter-spacing: 0.05rem;
  margin: 1.5rem auto 0;
  align-items: center;
  justify-content: space-between;
}
.analysis span{
  width: 48%;
  background: linear-gradient(#71B0F9,#328BF1);
  padding: 0.35rem 0;
  border-radius: 50px;
}
.gradename{
  font-size: 0.42rem;
  color: #8E8E8E;
  margin-top: 0.3rem;
}
.gradetime{
  width: 100%;
  padding: 0 0.8rem;
  font-size: 0.42rem;
  color: #AEAEAE;
  margin-top: 0.2rem;
  text-align: left;
  margin-top: 0.7rem;
}
.codebox{
  padding: 0.25rem;
}
.codegroup{
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 0.25rem 0.5rem;
  border-bottom: 2px solid #F7F7F7;
  position: relative;
}
.codeboxitem{
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  text-align: center;
  line-height: 0.75rem;
  border: 1px solid #f5f5f5;
  margin-left: 0.28rem;
  margin-top: 0.28rem;
  font-size: 0.4rem;
  color: #999999;
}
.codeboxitem:nth-child(9n+1){
  margin-left: 0;
}
.toggle{
  position: absolute;
  right: 0;
  bottom: 0.5rem;
  font-size: 0.4rem;
  color: #555;
}
.currentanswer{
  font-size: 0.38rem;
  color: #B4B4B4;
  padding: 0.25rem 0;
}
.currentanswer span{
  margin-right: 0.25rem;
}
.examtitname{
  text-align: left;
  font-size: 0.42rem;
  color: #454545;
  line-height: 0.65rem;
  margin-top: 0.1rem;
}
.answerbox{
  width: 100%;
  min-height: 4rem;
  background: #F8F8F8;
  border-radius: 5px;
  margin-top: 0.3rem;
  padding: 0.5rem;
}
.answerlist li{
  font-size: 0.4rem;
  color: #828282;
  text-align: left;
  margin-bottom: 0.5rem;
}
.analysishint{
  display: inline-flex;
  align-items: center;
  font-size: 0.4rem;
  color: #969696;
  padding: 0.4rem 0;
}
.analysishint img{
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 0.25rem;
}
.analysistext{
  font-size: 0.4rem;
  color: #767676;
  line-height: 0.65rem;
  margin-bottom: 0.8rem;
  margin-top: -0.2rem;
}
/* ************************** */
.panswer{
  width: 50%;
  color: #727272;
  font-size: 0.4rem;
  line-height: 1.2rem;
}
.answerbox{
  width: 100%;
  min-height: 4rem;
  background: #F8F8F8;
  border-radius: 5px;
  margin-top: 0.3rem;
  padding: 0.5rem;
  overflow-y: auto;
  position: relative;
}
.answerlist li{
  font-size: 0.4rem;
  color: #828282;
  text-align: left;
  margin-bottom: 0.5rem;
  word-break: break-all;
}
</style>