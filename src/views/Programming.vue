<template>
    <div class="programming">
        <div class="titleBox">
            <h4>{{means.meansName}}</h4>
            <p class="source">来源：<span>{{means.meanSource}}</span></p>
            <div class="date-num">
                <span style="margin-right: 0.5rem">{{means.updateDate}}</span>
                <p>浏览次数：<span style="color: #398CF0">{{means.viewCount}}</span></p>
            </div>
        </div>
        <div class="content" v-html="means.meansBody">

        </div>
        <div class="authorBox">
            作者：<span>{{means.authName}}</span>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            means:{},
        }
    },
  mounted() {
      //获取资料
    this.means = this.$route.query.means
    this.means.meansBody = this.means.meansBody.replace(/\n/g,"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
    console.log(this.means)

  },
  components: {

    }
}
</script>

<style>
  *{
    box-sizing: border-box;
  }
.programming{
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;left: 0;
    font-size: 0.425rem;
    background: #fff;
}

  .programming p img{
    width: 100% !important;
  }
  .programming image{
    width: 100%;
  }
.titleBox{
    padding: 0.4rem 0.45rem;
    border-bottom: 1px solid #F9FBFC;
}
.titleBox h4{
    color: #3F3F3F;
    font-size: 0.4rem;
    letter-spacing: 0.02rem;
}
.source{
    color: #A4A4A4;
    line-height: 0.75rem;
}
.date-num{
    display: flex;
    align-items: center;
    color: #BFBFBF;
    font-size: 0.3rem;
}
/* 内容 */
.content{
  width: 100%;
    color: #3E3E3E;
    line-height: 0.65rem;
    padding: 0.4rem 0.45rem;
    letter-spacing: 0.03rem;
  font-size: 18px;
  text-align: left;
word-break: break-all;
}
.authorBox{
    color: #979797;
    font-size: 0.4rem;
    padding: 0.45rem;
    padding-top: 0;
}
</style>
