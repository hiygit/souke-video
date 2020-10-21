<template>
  <div class="grade">
    <img src="../../static/images/gradebj.png" alt="" srcset="" class="gradebl">
    <div class="gradebox">
      <img :src="userinfo.userPic" alt="" srcset="" class="gradeimg">
      <div class="gradename">恭喜{{userinfo.userName}}，完成答题</div>
      <div class="gradetime">此次答题共计耗时{{msg.time}}</div>
      <div class="score">
        <img src="../../static/images/lxing.png" alt="" srcset="" class="lxing">
        <span class="scorenum1">{{msg.sumGrade}}</span><span class="scorenum2">分</span>
        <img src="../../static/images/mxing.png" alt="" srcset="" class="mxing">
      </div>
      <ul class="scorelist">
        <li><h4>{{msg.correctAnswer}}题</h4><p>答对</p></li>
        <li><h4>{{msg.errorAnswer}}题</h4><p>答错</p></li>
        <li><h4>{{msg.accuracyRate}}%</h4><p>正确率</p></li>
      </ul>
      <div class="analysis" @click="lookresolver">查看解析</div>
    </div>
    <van-popup v-model="show" round position="bottom" :style="{height:'85%'}">
      <div class="codebox">
        <div class="codegroup"> 
          <div class="codeboxitem" v-for="(item,index) in examlist" :key="'o'+index" @click="current=index">{{index+1}}</div>
          <div class="toggle">收起</div>
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
      userinfo:null,
      show:false,//弹出层
      current:0,//当前下标
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
      msg:{}
    }
  },
  created(){
    document.title = "在线答题"
  },
  mounted(){
    if(localStorage.getItem('userinfo')){
      this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
    }else {
      this.userinfo = null
    }
    let requestobj = {
      userId:JSON.parse(localStorage.getItem('userinfo')).userId,
      issueId:this.$route.query.issueId
    }
    this.findIssue(requestobj)
  },
  methods:{
    findIssue(requestobj){
      this.$ajax.post(this.GLOBAL.BASE_URL+'/personal/findIssue',qs.stringify(requestobj)).then(res=>{
        if(res.data.success && res.data.errorCode == 2){
          this.msg = res.data.body
        }
      })
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
              if( list[i].singleAnswer != ""){
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
  padding: 1rem;
  text-align: center;
}
.gradeimg{
  display: block;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  margin: 0 auto;
}
.analysis{
  display: block;
  width: 90%;
  color: #fff;
  font-size: 0.45rem;
  text-align: center;
  letter-spacing: 0.05rem;
  margin: 1.5rem auto 0;
  border-radius: 50px;
  background: linear-gradient(#71B0F9,#328BF1);
  padding: 0.35rem 0;
}
.gradename{
  font-size: 0.45rem;
  color: #333;
  font-weight: bold;
  margin-top: 0.35rem;
}
.gradetime{
  font-size: 0.42rem;
  color: #AEAEAE;
  margin-top: 0.2rem;
}
.score{
  margin-top: 0.8rem;
  margin-bottom: 0.5rem;
}
.score span.scorenum1{
  color: #F46405;
  font-size: 1.5rem;
  font-weight: bold;
}
.score span.scorenum2{
  color: #F57E3A;
  font-size: 0.4rem;
  margin-left: 0.1rem;
}
.score img.lxing{
  width: 0.5rem;
  height: 0.5rem;
  position: relative;
  top: -2px;
}
.score img.mxing{
  width: 0.3rem;
  height: 0.3rem;
  position: relative;
  top: -1rem;
  right: 0.45rem;
}
.scorelist{
  width: 100%; 
  display: flex;
  align-items: center;
  justify-content: center;                             
}
.scorelist li{
  width: 30%;
}
.scorelist li h4{
  color: #333;
  line-height: 1.6rem;
  font-size: 0.45rem;
}
.scorelist li p{
  color: #666;
  font-size: 0.4rem;
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