<template>
    <div class="beijing">
        <div class="loginLogoBox">
            <img src="../../static/images/loginLogo.png" alt="">
        </div>
        <div class="inputBox">
            <div class="inputbox-group">
                <img src="../../static/images/phoneIcon.png" class="inputimg">
                <input class="mess" style="text-align:left" maxlength="11" type="tel" placeholder="请输入您的手机号" v-model="tels"/>
            </div>
            <div class="inputbox-group">
                <img src="../../static/images/pswdIcon.png"  class="inputimg">
                <input class="mess" style="text-align:left" type="number" oninput="if(value.length>6)value=value.slice(0,6)" v-model="code" placeholder="请输入验证码"/>
                <input style="border: none;-webkit-appearance: none;text-align: center;" class="verCode close_tel addSendCode" type="button" value="获取" @click="getcode" v-show="isgetcode"/>
                <input style="border: none;-webkit-appearance: none;" class="verCode close_tel addSendCode" type="button" :value='num+"s"' v-show="!isgetcode"/>
            </div>
          <div class="loginbypassword" @click="toLoginByPassword">密码登录</div>
            <button @click="submitform">登录</button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            num:60,
            isgetcode:true,
            tels:"",
            code:""
        }
    },
    mounted(){

    },
    created(){
        document.title = "登录";
    },
    methods:{
        submitform(){
            let self = this;
            if(self.tels == ""){
                this.$toast({
                    message: "请填写手机号",
                })
            }else if(self.code == ""){
                this.$toast({
                    message: "请填写验证码",
                })
            }else{
                this.$toast({
                    message: "登录成功",
                })
                this.$router.push({path:"/"})
            }
        },
        getcode(){
            let self = this;
            let reg=/^1[3-9]\d{9}$/;
            if(self.tels == ""){
                this.$toast({
                    message: "请填写手机号",
                })
            }else if(reg.test(self.tels)){
                self.isgetcode = false;
                let intervals = setInterval(function(){
                    self.num--;
                    if(self.num <= 0){
                        clearInterval(intervals);
                        self.isgetcode = true;
                        self.num = 60;
                    }
                },1000)
            }else{
                this.$toast({
                    message: "手机号格式错误",
                })
            }
        },
      toLoginByPassword(){
        //跳转到密码登录
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
    height: 0.7rem;
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
    margin-top: .8rem;
    border-bottom: 1px solid #F2F2F2;
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
</style>
