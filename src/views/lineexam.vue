<template>
  <div class="lineexam">
    <div class="grade">
      <div class="downcount">{{practiceTime}}</div>
      <div class="current"><span>{{currentNumber+1}}/{{practiceList.length}}</span></div>
      <div class="gradebox" v-if="updatalist">
        <div class="examtitle">{{currentNumber+1}}.{{practiceList[currentNumber].examsType==1?"单选题":practiceList[currentNumber].examsType==2?"多选题":practiceList[currentNumber].examsType==3?"判断题":""}}</div>
        <h5 class="examtitname">{{practiceList[currentNumber]?practiceList[currentNumber].subject:''}}</h5>
        <!-- 单选和多选题 -->
        <div class="answerbox" v-if="practiceList[currentNumber].examsType == 1 || practiceList[currentNumber].examsType == 2">
          <ul class="answerlist" v-for="(item,index) in practiceList[currentNumber].examsOptionList" :key="'item'+index">
            <li :class="item.checked?'checkeds':''"  @click="checked(index)">
              {{item.optionNumber}}：{{item.optionName}}
            </li>
          </ul>
        </div>
        <!-- 判断题 -->
        <div class="answerbox" v-else-if="practiceList[currentNumber].examsType == 3">
          <ul class="answerlist" v-for="(item,index) in practiceList[currentNumber].examsOptionList" :key="'item'+index">
            <li :class="item.checked?'checkeds':''"  @click="checked(index)">
              {{item.optionNumber}}
            </li>
          </ul>
        </div>
        <!-- 代码和解答题 -->
        <div v-else>
          <div class="fileslist">
            <ul v-if="practiceList[currentNumber].fileList">
              <li>
                <div>
                  <img src="../../static/images/filespic.png" alt="" srcset="" class="filespic">
                  <span>{{practiceList[currentNumber].fileList.name}}</span>
                </div>
                <img src="../../static/images/filescloseicon.png" alt="" srcset="" class="filescloseicon" @click="removefile(currentNumber)">
              </li>
            </ul>
          </div>
          <div class="answerbox">
            <div class="answerboxload">
              <el-upload class="upload-demo" list-type="text" :show-file-list="false" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove"
                  :before-upload="beforeUpload" :on-success="handleAvatarSuccess" :on-error = "erroefiles" :on-change="handleChange" :action="GLOBAL.BASE_URL + '/courses/uploadAnswer'">
                <i class="el-icon-upload"></i>
                <div class="loadtext" slot="tip">上传答案</div>
                <div class="el-upload__tip" slot="tip">Upload your answers</div>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
      <div class="btndiv">
        <div class="btns left" v-show="currentNumber" @click="prevexam">上一题</div>
        <div class="btns right" v-show="currentNumber + 1 < practiceList.length" @click="nextexam">下一题</div>
        <div class="btns right" v-show="currentNumber + 1 == practiceList.length" @click="submitexam">提 交</div>
      </div>
    </div>
    <van-popup v-model="show" round position="bottom">
      <div class="codebox">
        <div class="codegroup">
          <div class="codeboxitem" :class="item.answer == ''?'green':''" v-for="(item,index) in answerlists" :key="'o'+index">{{index+1}}</div>
        </div>
        <div class="hint">绿色标题表示并未作答</div>
        <h5 class="hinttxt">您确定要提交吗？</h5>
        <div class="btns subbtns" @click="submitpost">提 交</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
  import qs from 'qs'
export default {

  data(){
    return{
      updatalist:true,
      show:false,//弹出层
      //考题数组
      examlist:[],
      //提交数组
      answerlists:[],
      fileList: [], //代码题和简答题上传列表
      fromType:1,//1：随堂练习  2：我的考试
      userinfo:null,
      hourId:'',
      issueId:'',
      practiceType:'',
      practiceNumber:0,
      currentNumber:0,//当前考题下标F
      current:"",
      /**计时器*/
      h:0,//定义时，分，秒，毫秒并初始化为0；
      m:0,
      ms:0,
      s:0,
      time:0,
      practiceTime: "",
      /**计时器*/
      practiceList:[],//所有考题数组F
      updata :true,
      errorlist:[],//未上传的主观题list
    }
  },
  created(){
    document.title = "在线答题"
  },
  mounted() {
    //获取用户信息
    if(localStorage.getItem('userinfo')){
      this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
    }else {
      this.userinfo = null
    }
    this.fromType = this.$route.query.fromType
    this.hourId = this.$route.query.hourId
    this.issueId = this.$route.query.issueId
    if(this.fromType == 1){//从课堂练习页面跳转来的
      let that = this
      let userId = ''
      if(that.userinfo){
        userId = that.userinfo.userId
      }else {
        userId = ''
        this.$toast({
          message: "您还未登录，请前往登录！",
        })
      }
      that.$ajax.post(that.GLOBAL.BASE_URL+'/courses/findPractice',
        qs.stringify({hourId: that.hourId,issueId: that.issueId,userId:userId}))
        .then( res => {
          if(res.data.success && res.data.errorCode == 2){
            that.issueId = res.data.body.issueId
            //判断是否有答案
            if(res.data.body.studentExam){
              //跳转到
              that.$router.push({path:"/exercises",query:{fromType:that.fromType,issueId:that.issueId}})
            }else {
              // that.start()
              let examinationlist = res.data.body.resultList,len = examinationlist.length
              for(let i=0;i<len;i++){
                if(examinationlist[i].examsType==1||examinationlist[i].examsType==2||examinationlist[i].examsType==3){
                  for(let j=0;j<examinationlist[i].examsOptionList.length;j++){
                    let litem = examinationlist[i].examsOptionList[j];
                    litem.checked = false;
                  }
                }
              }
              that.practiceList = examinationlist
            }

          }else {
            this.$toast({
              message: res.data.msg,
            })
          }
        })
    }else if(this.fromType == 2) {
      //从我的考试未参加页面跳转来的
      let that = this
      this.$ajax.post(this.GLOBAL.BASE_URL + '/personal/getIssue',qs.stringify({issueId: that.issueId,userId: this.userinfo.userId})).then(res => {
        if(res.data.success && res.data.errorCode == 2){
          that.start()
          let examinationlist = res.data.body.result,len = examinationlist.length,newexamlist = [];
          for(let i=0;i<len;i++){
            if(examinationlist[i].examsType == 1||examinationlist[i].examsType == 2||examinationlist[i].examsType == 3){
              for(let j=0;j<examinationlist[i].examsOptionList.length;j++){
                let litem = examinationlist[i].examsOptionList[j];
                litem.checked = false;
              }
              examinationlist[i].id = examinationlist[i].bankid
              newexamlist.push(examinationlist[i])
            }
          }
          that.practiceList = newexamlist
        }else {
          this.$toast({
            message: res.data.msg,
          })
        }

      })
    }
  },
  methods:{
    // 上传
    handlePreview(file) {
      console.log(file);
    },
    handleRemove(file, fileList) {
      //删除当前试题的filelist
      this.practiceList[this.currentNumber].fileList = [] 
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    beforeUpload(file) {},
    handleAvatarSuccess(res, file) {
      if(file.raw.size > (600 * 1024)){
        this.$message({
          showClose: true,
          message: '文件大小超过限制,最大允许600KB',
          type: 'warning'
        });
        this.fileList = []
        this.practiceList[this.currentNumber].fileList = []
      }else {
        let fd = new FormData();
        fd.append("file", file.raw); //传文件
        fd.append("userId", this.userinfo.userId); //传其他参数
        fd.append("bankId", this.fromType == 1?this.practiceList[this.currentNumber].id:this.practiceList[this.currentNumber].bankid); //传其他参数
        fd.append("issueId", this.issueId); //传其他参数
        fd.append("number", parseInt(this.currentNumber)); //传其他参数
        this.$ajax.post(this.GLOBAL.BASE_URL + "/courses/uploadAnswer", fd).then(res => {
          if(res.data.success && res.data.errorCode == 2){
            this.updatalist = false
            //当前题添加当前filelist
            this.practiceList[this.currentNumber].fileList = file
            this.$set(this.practiceList)
            this.updatalist = true
            console.log(this.practiceList)
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'success'
            });
          }
        });
      }
    },
    erroefiles(files, fileList){},
    handleChange(file, fileList) {},
    //删除长传文件
    removefile(dex){
      this.$delete(this.practiceList[dex],'fileList')
      console.log(this.practiceList)
    },
    //选项
    checked(index){
      let that = this
      if(that.practiceList[that.currentNumber].examsType == 1 || that.practiceList[that.currentNumber].examsType == 3){
        that.practiceList[that.currentNumber].examsOptionList.map(function(list){
          list.checked = false;
        })
        that.practiceList[that.currentNumber].examsOptionList[index].checked = true;
      }else{
        that.practiceList[that.currentNumber].examsOptionList[index].checked = !that.practiceList[that.currentNumber].examsOptionList[index].checked
      }
    },
    //上一题
    prevexam(){
      this.currentNumber--
    },
    //下一题
    nextexam(){
      this.currentNumber++
    },
    //提交
    submitexam(){
      this.show = true
      let that = this,answerlists=[],errorlist=[];
      for(let i=0;i<that.practiceList.length;i++){
        let obj = {};obj.bankId = that.practiceList[i].id;let optionarr=[];
        if(that.practiceList[i].examsType == 1 || that.practiceList[i].examsType == 2 || that.practiceList[i].examsType == 3){
          for(let j=0;j<that.practiceList[i].examsOptionList.length;j++){
            if(that.practiceList[i].examsOptionList[j].checked){
              optionarr.push(that.practiceList[i].examsOptionList[j].optionNumber)
            }
          }
          obj.answer = optionarr.join(",")
        }else{
          if(that.practiceList[i].fileList){
            obj.answer = that.practiceList[i].fileList.name
          }else{
            obj.answer = ""
            errorlist.push({
              file:"",
              userId:this.userinfo.userId,
              bankId:this.fromType == 1?that.practiceList[i].id:that.practiceList[i].bankid,
              issueId:this.issueId,
              number:i
            })
          }
        }
        answerlists.push(obj)
      }
      that.answerlists = answerlists
      that.errorlist = errorlist
    },
    //确定提交事件
    submitpost(){
      let self = this;
      let requestobj = {
        answerBankList:self.answerlists,
        userId:self.userinfo.userId,
        issueId:self.issueId,
        exansTime:self.practiceTime,
        type:"1"
      }
      this.$ajax.post(this.GLOBAL.BASE_URL+'/courses/addPractice',requestobj).then(res=>{
        if(res.data.success && res.data.errorCode == 2){
          let routeparameter = res.data.body.studentExam
          routeparameter.exansTime = self.practiceTime
          this.$router.push({path:"/exercises",query:{fromType:self.fromType,issueId:self.issueId,jsonstr:JSON.stringify(routeparameter)}})
        }
      })
      for(let i=0;i<this.errorlist.length;i++){
        let items = this.errorlist[i];
        let fd = new FormData();
        fd.append("file", items.file); //传文件
        fd.append("userId", items.userId); //传其他参数
        fd.append("bankId", items.bankId); //传其他参数
        fd.append("issueId", items.issueId); //传其他参数
        fd.append("number", items.number); //传其他参数
        this.$ajax.post(this.GLOBAL.BASE_URL + "/courses/uploadAnswer", fd).then(res => {
          if(res.data.success && res.data.errorCode == 2){
            
          }
        });
      }
    },
    /**计时器*/
    timer(){   //定义计时函数
      this.ms=this.ms+50;         //毫秒
      if(this.ms>=1000){
        this.ms=0;
        this.s=this.s+1;         //秒
      }
      if(this.s>=60){
        this.s=0;
        this.m=this.m+1;        //分钟
      }
      if(this.m>=60){
        this.m=0;
        this.h=this.h+1;        //小时
      }
      this.practiceTime =this.toDub(this.h)+":"+this.toDub(this.m)+":"+this.toDub(this.s)+""/*+this.toDubms(this.ms)+"毫秒"*/;
      this.min = parseInt(this.h) + 'h ' +parseInt(this.m) + 'min ' + parseInt(this.s)+'s'
    },

    reset(){  //重置
      clearInterval(this.time);
      this.h=0;
      this.m=0;
      this.ms=0;
      this.s=0;
      this.practiceTime="00:00:00";
    },

    start() {  //开始
      this.time = setInterval(this.timer, 50);
    },
    toDub(n){  //补0操作
      if(n<10){
        return "0"+n;
      }
      else {
        return ""+n;
      }
    },

    toDubms(n){  //给毫秒补0操作
      if(n<10){
        return "00"+n;
      }
      else {
        return "0"+n;
      }

    }
    /**计时器*/
  }
}
</script>
<style lang="" scoped>
.grade{
  width: 100vw;
  height: 99.5vh;
  position: relative;
  border-top: 1px solid transparent;
  background: url(../../static/images/gradebj.png) no-repeat;
  background-size: 100% 100%;
}
.gradebox{
  width: 95vw;
  height: 70vh;
  background: url(../../static/images/gradejx.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding: 0.5rem;
  text-align: center;
  margin-top: -2px;
}
.downcount{
  padding: 3%;
  padding-bottom: 0;
  font-size: 0.48rem;
  color: #ADADAD;
}
.current{
  text-align: right;
}
.current span{
  display: inline-block;
  width: 1.6rem;
  text-align: center;
  background: #2784EF;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  margin-right: 1rem;
  padding: 0.15rem 0.25rem 0.1rem;
  font-size: 0.35rem;
  color: #fff;
}
.examtitle{
  font-size: 0.45rem;
  color: #878787;
  text-align: left;
}
.examtitname{
  text-align: left;
  font-size: 0.42rem;
  color: #454545;
  line-height: 0.75rem;
  margin-top: 0.3rem;
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
.answerlist li.checkeds{
  color: #5D9FF0;
}
.btndiv{
  width: 100%;
  overflow: hidden;
  margin-top: 0.6rem;
  padding: 0 1rem;
}
.left{
  float: left;
}
.right{
  float: right;
}
div.btns{
  width: 46%;
  text-align: center;
  outline: none;
  border: none;
  background: url('../../static/images/btnbj.png') no-repeat;
  background-size: 100% 100%;
  font-size: 0.42rem;
  color: #fff;
  padding: 0.35rem 0;
  border-radius: 50px;
  position: relative;
  z-index: 10;
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
div.green{
  color: #198511;
}
.codeboxitem:nth-child(9n+1){
  margin-left: 0;
}
.hint{
  padding: 0.25rem;
  font-size: 0.4rem;
  color: #A6A6A6;
  padding-left: 0.35rem;
  position: relative;
}
.hint::after{
  content: "";
  width: 5px;
  height: 5px;
  background: #198511;
  border-radius: 50%;
  position: absolute;
  top: 50%;left: 0;
  transform: translateY(-50%);
}
.hinttxt{
  text-align: center;
  font-size: 0.42rem;
  color: #525252;
  margin-top: 1rem;
}
div.subbtns{
  width: 80%;
  margin: 0.8rem auto;
}
.answertext{
  width: 100%;
  height: 100%;
  resize: none;
  background: none;
  border: none;
  outline: none;
  font-size: 0.4rem;
  color: #828282;
}
.el-upload__tip{
  font-size: 0.4rem;
  color: #aaa;
}
.answerboxload{
  position: absolute;
  top: 0;left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 5px;
  padding: 0.5rem;
  border: 1px dashed #eee;
}
.loadtext{
  text-align: center;
  font-size: 0.42rem;
  color: #656565;
}
.el-icon-upload{
  font-size: 1.25rem;
  color: #2784EF;
}
.fileslist{
  height: 3rem;
  padding: 0.5rem 0;
}
.fileslist ul li{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fileslist ul li div{
  width: 90%;
  display: inline-flex;
  align-items: center;
  font-size: 0.3rem;
}
.fileslist ul li img{
  width: 0.35rem;
  height: 0.35rem;
}
.fileslist ul li div img{
  width: 0.45rem;
  height: 0.45rem;
  margin-right: 0.2rem
}
</style>
