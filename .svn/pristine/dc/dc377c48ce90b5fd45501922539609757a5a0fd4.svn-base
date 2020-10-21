<template>
  <div class="myexam">
    <!-- <div class="joinBox">
      <span :class="tabs == 1 ? 'joinNo':''" @click="tabs=1">
        <i class="joinNoDot" v-show="tabs == 1"></i>已参加
      </span>
      <span :class="tabs == 2 ? 'joinNo':''" @click="tabs=2">
        <i class="joinNoDot" v-show="tabs == 2"></i> 未参加
      </span>
    </div> -->
    <van-tabs @click="onClick">
      <van-tab title="未参加">
        <div class="emptyimg" v-if="myexamlist.length == 0"><img src="../../static/images/empty.png" alt="" srcset=""></div>
        <div class="myexamListOne" v-else style="margin-top:15px" v-for="(item,index) in myexamlist" :key="'e'+index">
          <p style="text-align: center;">{{item.examCreateTime}}</p>
          <div class="myexamListModuleBox">
            <div class="computerBox">
              <div class="examLabelImgBox">{{item.courseName}}</div>
              <span class="toExam">
                <router-link :to="{path:'/lineexam',query:{issueId:item.id,fromType: 2}}" class="links">去考试</router-link>
              </span>
            </div>
            <div class="myexamListModuleoContent">
              <p>
                发布者：
                <span>{{item.creater}}</span>
              </p>
              <p>
                考试名称：
                <span>{{item.examName}}</span>
              </p>
              <p>
                考试时间：
                <span style="font-size:0.37rem">{{item.examStartTime.substring(0,16)}}－{{item.examEndTime.substring(0,16)}}</span>
              </p>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="已参加">
        <div class="emptyimg" v-if="myexamlist.length == 0"><img src="../../static/images/empty.png" alt="" srcset=""></div>
        <div class="myexamListOne" v-else v-for="(item,index) in myexamlist" :key="'e'+index" v-show="ifjoin">
          <p style="text-align: center;">{{item.examCreateTime}}</p>
          <div class="myexamListModuleBox">
            <div class="computerBox">
              <div class="examLabelImgBox">{{item.courseName}}</div>
              <span :class="item.isRead=='Y'?'toExam':'notoExam'" @click="gotoyue(item)">
                {{item.isRead=='Y'?'已阅':'未阅'}}
              </span>
            </div>
            <div class="myexamListModuleoContent">
              <p>
                发布者：
                <span>{{item.creater}}</span>
              </p>
              <p>
                考试名称：
                <span>{{item.examName}}</span>
              </p>
              <p>
                考试时间：
                <span style="font-size:0.37rem">{{item.examStartTime.substring(0,16)}}－{{item.examEndTime.substring(0,16)}}</span>
              </p>
            </div>
            <div class="lookParticulars">查看详情</div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data() {
    return {
      ifjoin: true,
      sddsd:{
        userId: "",
        isJoin: 1,
      },
      myexamlist: []
    };
  },
  created() {
    document.title = "我的考试";

    //获取用户数据
    if (localStorage.getItem("userinfo")) {
      this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    } else {
      this.userinfo = null;
    }
    this.init(this.sddsd);

  },
  mounted(){},
  methods: {
    //tab标签
    onClick(index, title) {
      // this.$toast(title);
      let tabIndex = index+1
      let obj = this.sddsd
      obj.isJoin = tabIndex
      this.myexamlist = []
      this.init(obj)
    },
    init(obj) {
      let that = this;
      let userId = "";
      if (that.userinfo) {
        // userId = that.userinfo.userId;
        this.sddsd.userId = this.userinfo.userId
      } else {
        // userId = "";
        this.sddsd.userId = ""
      }
      this.$ajax.post(this.GLOBAL.BASE_URL + "/personal/findexams",qs.stringify(obj)).then(res => {
        if (res.data.success && res.data.errorCode == 2) {
          // that.myexamlist = res.data.body.teacherIssueList
          if(res.data.body.teacherIssueList){
            that.myexamlist = res.data.body.teacherIssueList
          }
        } else {
          
          this.$toast({
            message: res.data.msg
          });
        }
      });
    },
    //查看试卷
    gotoyue(item,num) {
      if (item.isRead == 'Y') {
        this.$router.push({ path: "/grade",query: {issueId: item.id,fromType: 3,examid:item.examid}});
      } else {
        this.$router.push({ path: "/exercises",query: {issueId: item.id,examid:item.examid,fromType: 1}}); //未阅
      }
    },
  },
  components: {}
};
</script>

<style>
.myexam {
  font-size: 0.4rem;
  padding: 0.4rem 0.35rem;
}
.joinBox {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  color: #aaaaaa;
  padding: 0.5rem 0;
  position: fixed;
  top: 0;
  left: 0;
  background: #f8f8f8;
}
.joinNo {
  display: flex;
  align-items: center;
  color: #2884ef;
}
.joinNoDot {
  display: block;
  width: 0.15rem;
  height: 0.15rem;
  margin-right: 0.2rem;
  background: #2884ef;
  border-radius: 50%;
}
.myexamListBox {
  width: 100%;
  margin-top: 1.4rem;
}
.myexamListModuleBox {
  width: 100%;
  padding: 0.35rem 0;
  background: #fff;
  border-radius: 0.2rem;
  padding-bottom: 0.08rem;
}
.myexamListOne {
  margin-bottom: 0.7rem;
}
.myexamListOne p {
  color: #a4a4a4;
  margin-bottom: 0.3rem;
}
.computerBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 1rem;
  margin-bottom: 0.4rem;
  padding-right: 0.3rem;
}
.examLabelImgBox {
  width: 4rem;
  height: 1.1rem;
  color: #f2f9f2;
  text-indent: 1em;
  line-height: 1rem;
  margin-left: -0.15rem;
  background: url(../../static/images/examLabel.png) no-repeat;
  background-size: 100% 100%;
}
.toExam {
  width: 1.7rem;
  height: 0.8rem;
  text-align: center;
  line-height: 0.8rem;
  background: #f46405;
  border-radius: 0.15rem;
  color: #fef3ef;
}
.toExam .links {
  color: #fef3ef;
}
.notoExam {
  width: 1.7rem;
  height: 0.8rem;
  text-align: center;
  line-height: 0.8rem;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  border-radius: 0.15rem;
  color: #999;
}
.myexamListModuleoContent {
  line-height: 0.35rem;
  padding: 0 0.3rem;
}
.myexamListModuleoContent p span {
  color: #444444;
}
/* 查看详情 */
.lookParticulars{
  width: 95%;
  color: #999999;
  margin:  auto;
  padding: 0.15rem 0.1rem;
  border-top: 1px solid #E5E5E5;
}

/* tab标签 */
.van-tabs__line,.van-tabs__nav{
  background: none;
}
.van-tab--active{
  color: #2884EF;
}

/* 图片暂无数据 */
.emptyimg{
  text-align: center;
  padding-top: 40%;
}
.emptyimg img{
  width: 60%;
}
</style>