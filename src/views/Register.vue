<template>
    <div class="beijing">
        <div class="loginLogoBox">
            <img src="../../static/images/register.png" alt="">
        </div>
        <div class="inputBox">
            <div class="inputbox-group">
                <img src="../../static/images/phoneIcon.png" class="inputimg">
                <input class="mess" maxlength="11" type="tel" placeholder="请输入您的手机号" v-model="tels"/>
            </div>
            <div class="inputbox-group">
                <img src="../../static/images/pswdIcon.png"  class="inputimg">
                <input class="mess" type="number" oninput="if(value.length>6)value=value.slice(0,6)" v-model="code" placeholder="请输入验证码"/>
                <input style="border: none;-webkit-appearance: none;text-align: center;" class="verCode close_tel addSendCode" type="button" value="获取" @click="getcode" v-show="isgetcode"/>
                <input style="border: none;-webkit-appearance: none;text-align:center" class="verCode close_tel addSendCode" type="button" :value='num+"s"' v-show="!isgetcode"/>
            </div>
          <div class="inputbox-group">
            <img src="../../static/images/pswdIcon.png"  class="inputimg">
            <input class="mess" style="width: 100%" type="password" oninput="if(value.length>20)value=value.slice(0,20)" v-model="password" placeholder="请输入密码，密码长度6-20位"/>
          </div>
          <div class="inputbox-group">
            <img src="../../static/images/pswdIcon.png"  class="inputimg">
            <input class="mess" type="password" oninput="if(value.length>20)value=value.slice(0,20)" v-model="password1" placeholder="请再次输入密码"/>
          </div>
          <div class="inputbox-group">
            <el-checkbox v-model="flag">将手机号作为用户名</el-checkbox>
          </div>
            <button @click="submitform">注册</button>
          <div class="toLogin" @click="toLogin">已有帐号，立即登录</div>
        </div>
    </div>
</template>
<script>
import qs from "qs";

export default {
    data(){
        return{
            num:60,
            isgetcode:true,
            tels:"",
            code:"",
          password:'',
          password1:'',
          flag:false,
        }
    },
    mounted(){

    },
    created(){
        document.title = "注册";
    },
    methods:{
        submitform(){
          let self = this;
          if(self.tels == "" || !self.tels){
            this.$toast({
              message: "请输入手机号",
            })
          }else if(!(/^1[3456789]\d{9}$/.test(self.tels))){
            this.$toast({
              message: "请输入正确手机号",
            })
          }else if(self.code == ""){
            this.$toast({
              message: "请输入验证码",
            })
          }else if(self.password == ""){
            this.$toast({
              message: "请输入密码",
            })
          }else if(self.password.length < 6 || self.password.length > 20){
            this.$toast({
              message: "请输入6-20位密码",
            })
          }else if(self.password1 == ""){
            this.$toast({
              message: "请再次输入密码",
            })
          }else if(self.password1.length < 6 || self.password1.length > 20){
            this.$toast({
              message: "请输入6-20位密码",
            })
          }else if(self.password != self.password1){
            this.$toast({
              message: "两次输入的密码不一致",
            })
          } else{

            this.$ajax.post(this.GLOBAL.BASE_URL + '/pcweb/register/regi',qs.stringify({phone:self.tels,password:self.password,yzCode:self.code,flag:self.flag})).then(res => {
              if(res.data.success && res.data.errorCode == 2){
                this.$toast({
                  message: "注册成功",
                });
                //保存用户数据
                // let userInfoStr = res.data.body;
                // userInfoStr.userPic = self.GLOBAL.BASE_IMAGE_URL + userInfoStr.userPic;
                // userInfoStr.logo = self.GLOBAL.BASE_IMAGE_URL + userInfoStr.logo;
                // let userinfo = JSON.stringify(userInfoStr);
                // localStorage.setItem('userinfo',userinfo);

                this.$router.push({path:"/"})
              }else {
                this.$toast({
                  message: res.data.msg,
                });
              }
            })

          }
        },
        getcode(){
            let self = this;
            let reg=/^1[3456789]\d{9}$/;
            if(self.tels == ""){
                this.$toast({
                    message: "请填写手机号",
                })
            }else if(reg.test(self.tels)){
              //获取验证码
              this.$ajax.post(this.GLOBAL.BASE_URL + '/pcweb/register/phonenote',qs.stringify({phone:self.tels})).then(res => {
                if(res.data.success && res.data.errorCode == 2){
                  self.$toast({
                    message: "发送成功",
                  });
                  self.isgetcode = false;
                  let intervals = setInterval(function(){
                    self.num--;
                    if(self.num <= 0){
                      clearInterval(intervals);
                      self.isgetcode = true;
                      self.num = 60;
                    }
                  },1000)
                }else {
                  self.$toast({
                    message: res.data.msg,
                  });
                }
              });

            }else{
                this.$toast({
                    message: "手机号格式错误",
                })
            }
        },

      toLogin(){

        this.$router.push({path:"/LoginByPassword",query:{}});
      }
    },
    components: {

    }
}
</script>
<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
input,button{
    outline: none;
    border: none;
    font-size: 0.4rem;
    background: none;
}
button{
    display: block;
    width: 100%;
    color: #fff;
    text-align: center;
    padding: 0.3rem 0;
    margin-top: 1.5rem;
    letter-spacing: 0.3rem;
    border-radius: 50px;
    background: linear-gradient(#71B0F9,#328BF1)
}
.beijing{
    width: 100vw;
    height: 100vh;
    background: url(../../static/images/loginbj.png) no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
}
.loginLogoBox{
    width: 3rem;
    height: 0.9rem;
    margin-top: 3rem;
}
.loginLogoBox img{
    width: 100%;
    height: 100%;
}
.inputBox{
    width: 100%;
    margin-top: 2.5rem;
    padding: 0 1rem;
}
.inputbox-group{
    display: flex;
    padding: 0.2rem 0;
    /* margin-top: .8rem; */
    margin-top: .5rem;
    border-bottom: 1px solid #F2F2F2;
    justify-content: flex-start;
}
.inputbox-group input{
  text-align: left;
}
.inputimg{
    width: 0.7rem;
    height: 0.7rem;
    margin-right: 0.3rem;
}
.addSendCode{
    width: 3.5rem;
    color: #3D8DF0;
    background: #C9E2FF;
    border-radius: 50px;
}
.loginbypassword{
  font-size: 0.4rem;
  color: #3D8DF0;
  padding-top: 13px;
  padding-bottom: 13px;
}
  .toLogin{
    text-align: center;
    font-size: 0.4rem;
    color: #b1b1b1;
    align-content: center;
    padding-top: 13px;
    padding-bottom: 13px
  }
</style>
