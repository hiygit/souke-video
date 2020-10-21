<template>
  <div class="mystudy">
    <ul class="mystudyBox">
      <div  v-for="(item,index) in courseList" :key="index">
        <li @click="toCourseDetails(item)">
          {{item.courseName}}
          <img src="../../static/images/rightarrows.png" alt />
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data() {
    return {
      courseList:[],//我的学习列表
    };
  },
  created() {
    document.title = "我的学习";

    //获取用户数据
    if (localStorage.getItem("userinfo")) {
      this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    } else {
      this.userinfo = null;
    }
  },
  mounted(){
    let that = this
    let userId = "";
    if (that.userinfo) {
      userId = that.userinfo.userId;
    } else {
      userId = "";
    }
    this.$ajax.post(this.GLOBAL.BASE_URL + "/personal/findStudent",qs.stringify({ userId: userId })).then(res=>{
      if (res.data.success && res.data.errorCode == 2) {
        that.courseList = res.data.body.courseList
      }else{
        this.$toast({
          message: res.data.msg
        });
      }
    })
  },
  methods:{
    //to   '/MicroProject'
    toCourseDetails(item){
      console.log(item)
      if(this.userinfo){
        // if(item.isWarrant == '1'){
        //   //跳转到课程详情
        //   console.log('转到该课程详情')
          this.$router.push({path:'/MicroProject' ,query:{courseId:item.courseId}});
      //   }else {
      //     this.$toast({
      //       message: "该课程未授权",
      //     });
      //   }
      // }else {
      //   this.$toast({
      //     message: "您还未登录哦，请立即登录！",
      //   });
      }

    }
  },
  components: {}
};
</script>

<style>
.mystudy {
  width: 100vw;
  height: 100vh;
  padding: 0.2rem 0;
}
.mystudyBox li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #4a4a4a;
  font-size: 0.4rem;
  margin-bottom: 0.15rem;
  padding: 0.32rem 0.35rem;
  background: #fff;
}
.mystudyBox li img {
  width: 0.2rem;
  height: 0.3rem;
}
</style>
