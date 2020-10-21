<template>
  <el-form
    :model="ruleForm"
    status-icon
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
    label-position="top"
  >
    <el-form-item label="手机号" prop="tel">
      <el-input type="tel" v-model="ruleForm.tel" autocomplete="off" placeholder="请输入手机号"></el-input>
    </el-form-item>
    <el-form-item label="" prop="code">
      <el-input
        type="code"
        v-model="ruleForm.code"
        autocomplete="off"
        style="width:60%"
        placeholder="请输入验证码"
      ></el-input>
      <el-button
        :type="codeStatus"
        style="margin-left:10px;width:35%"
        :disabled="buttonStatus"
        @click="getCode"
        >{{ codeText }}</el-button
      >
    </el-form-item>
    <el-form-item label="新密码" prop="pass">
      <el-input
        type="password"
        v-model="ruleForm.pass"
        autocomplete="off"
        placeholder="请输入新密码"
      ></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input
        type="password"
        v-model="ruleForm.checkPass"
        autocomplete="off"
        placeholder="请再次输入新密码"
      ></el-input>
    </el-form-item>
    <el-form-item style="margin-top:40px;display:flex;justify-content:center;">
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import qs from "qs";
export default {
  data() {
    var validateTel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      }
      callback();
    };
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        tel: "",
        code: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        tel: [{ validator: validateTel, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      codeStatus: "primary",
      codeText: "获取验证码",
      buttonStatus: false
    };
  },
  methods: {
    getCode() {
      this.$ajax
        .post(
          this.GLOBAL.BASE_URL + "/pcweb/register/phonenote",
          qs.stringify({ phone: this.ruleForm.tel })
        )
        .then(res => {
          console.log(res);
          if (res.data.success && res.data.errorCode == 2) {
            this.$toast({
              message: res.data.msg
            });
            this.codeStatus = "info";
            this.buttonStatus = true;
            let i = 60;
            let codeTime = setInterval(() => {
              i--;
              this.codeText = i + "s";
              if (i == 0) {
                clearInterval(codeTime);
                this.codeText = "获取验证码";
                this.codeStatus = "primary";
              }
            }, 1000);
          } else {
            this.$toast({
              message: res.data.msg
            });
          }
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$ajax
            .post(
              this.GLOBAL.BASE_URL + "/pcweb/register/updatePassword",
              qs.stringify({
                newPassword: this.ruleForm.pass,
                phone: this.ruleForm.tel,
                yzCode: this.ruleForm.code
              })
            )
            .then(res => {
              console.log(res);
              if (res.data.success && res.data.errorCode == 2) {

              } else {
                this.$toast({
                  message: res.data.msg
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style scoped>
.el-form.demo-ruleForm {
  margin: 20px;
}
</style>
