<template>
  <div class="personalInfo">
    <form action>
      <ul class="personalInfoListBox">
        <li style="padding: 0.28rem 0.3rem">
          头像(点击图片更换头像)
          <img :src="infomes.headImg" alt />
          <van-uploader :after-read="afterRead" />
        </li>
        <li>
          姓名
          <input type="text" v-model="infomes.name" :readonly="infomes.isImport == 1" placeholder="请填写姓名"/>
        </li>
        <li>
          性别
          <input
            type="text"
            v-model="infomes.sex"
            placeholder="男"
            readonly
            @click="showPicker=true"
          />
        </li>
        <li>
          年龄
          <input
            type="tel"
            v-model="infomes.age"
            :readonly="infomes.isImport == 1"
            placeholder="请填写年龄"
          />
        </li>
        <li>
          学校
          <input
            type="text"
            v-model="infomes.classroomschool"
            :readonly="infomes.isImport == 1"
            placeholder="请填写学校"
          />
        </li>
        <li>
          班级
          <input
            type="text"
            v-model="infomes.className"
            :readonly="infomes.isImport == 1"
            placeholder="请填写班级"
          />
        </li>
        <li>
          邮箱
          <input type="email" v-model="infomes.email" placeholder="请填写邮箱" />
        </li>
      </ul>
      <div class="btndiv">
        <button class="btns" @click="savebtn">保 存</button>
      </div>
    </form>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      userinfo: null, //用户信息

      showPicker: false,
      columns: ["男", "女"],
      infomes: {
        headImg: "",// ../../static/images/recommendHead.png
        name: "",
        sex: "", //性别
        age: "", //年龄
        classroomschool: "", //学校
        className: "", //班级
        email: "" //邮箱
      }
    };
  },
  created() {
    document.title = "个人信息";

    //获取用户数据
    if (localStorage.getItem("userinfo")) {
      this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    } else {
      this.userinfo = null;
    }
    this.init();
  },
  mounted() {},
  methods: {
    onConfirm(value) {
      this.infomes.sex = value;
      this.showPicker = false;
      console.log(value)
    },
    //上传头像
    afterRead(file) {
      this.infomes.headImg = file.content;
      let that = this;
      let userId = "";
      if (that.userinfo) {
        userId = that.userinfo.userId;
      } else {
        userId = "";
      }
      let fd = new FormData()
      fd.append('file',file.file)
      fd.append('userId',userId)

      this.$ajax.post(this.GLOBAL.BASE_URL + "/personal/uploadAvatar",fd).then(res => {
        if (res.data.success && res.data.errorCode == 2) {
          //保存用户数据
          //修改缓存里的头像
          let userinfoStr = JSON.parse(localStorage.getItem('userinfo'))
          userinfoStr.userPic = that.GLOBAL.BASE_IMAGE_URL + res.data.body.headimg
          let userInfo = JSON.stringify(userinfoStr);
          localStorage.setItem('userinfo',userInfo)
        } else {
          this.$toast({
            message: res.data.msg
          });
        }
      });
    },
    //初始化 /personal/findPersonalDetails
    init() {
      let that = this;
      let userId = "";
      if (that.userinfo) {
        userId = that.userinfo.userId;
      } else {
        userId = "";
      }
      this.$ajax
        .post(
          this.GLOBAL.BASE_URL + "/personal/findPersonalDetails",
          qs.stringify({ userId: userId })
        )
        .then(res => {
          if (res.data.success && res.data.errorCode == 2) {
            that.infomes = res.data.body;
            let baseUrl = this.GLOBAL.BASE_IMAGE_URL;
            that.infomes.headImg = baseUrl + res.data.body.headImg;
            if (res.data.body.sex == 1) {
              that.infomes.sex = "男";
            } else if (res.data.body.sex == 2) {
              that.infomes.sex = "女";
            } else {
              that.infomes.sex = "未知";
            }
          } else {
            this.$toast({
              message: res.data.msg
            });
          }
        });
    },
    //保存
    savebtn() {
      let that = this;
      this.$ajax.post(this.GLOBAL.BASE_URL + "/personal/updatePersonalDetails",qs.stringify(that.infomes)).then(res => {
        if (res.data.success && res.data.errorCode == 2) {
          console.log(res.data);
          //储存用户数据到缓存
          let userinfoStr =  res.data.body;
          userinfoStr.userPic = that.GLOBAL.BASE_IMAGE_URL + userinfoStr.userPic
          userinfoStr.logo = that.GLOBAL.BASE_IMAGE_URL + userinfoStr.logo
          let userinfo =  JSON.stringify(userinfoStr);
          localStorage.setItem("userinfo",userinfo);
          if(localStorage.getItem("userinfo")){
            that.userinfo = JSON.parse(localStorage.getItem("userinfo"))
          }else {
            that.userinfo = null
          }
        } else {
          this.$toast({
            message: res.data.msg
          });
        }
      });
    }
  },
  components: {}
};
</script>

<style scoped >
.personalInfo {
  width: 100vw;
  height: 100vh;
  padding: 0.2rem;
}
.personalInfoListBox {
  width: 100%;
  background: #fff;
  border-radius: 0.15rem;
}
.personalInfoListBox li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #a8a8a8;
  font-size: 0.4rem;
  padding: 0.45rem 0.3rem;
  border-bottom: 1px solid #ededed;
  position: relative;
}
.personalInfoListBox li:last-child {
  border-bottom: none;
}
.personalInfoListBox li img {
  width: 1rem;
  height: 1rem;
  position: absolute;
  top: 50%;
  right: 0.3rem;
  transform: translateY(-50%);
  z-index: 50;
  border-radius: 50%;
}
input {
  outline: none;
  border: none;
  color: #4b4b4b;
  text-align: right;
  width: 65%;
}
input::-webkit-input-placeholder {
	color: #B1B1B1; 
}
.btndiv {
  width: 65%;
  margin: 2rem auto 0;
}
button.btns {
  width: 100%;
  outline: none;
  border: none;
  background: url("../../static/images/btnbj.png") no-repeat;
  background-size: 100% 100%;
  font-size: 0.5rem;
  color: #fff;
  padding: 0.25rem 0;
}
.personalInfo /deep/ .van-uploader__upload {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  opacity: 1;
  margin: 0;
  opacity: 0;
}
.personalInfo /deep/ .van-uploader {
  z-index: 100;
}
</style>
