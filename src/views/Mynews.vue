<template>
  <div class="myNews">
    <div v-for="(item,index) in items" :key="index" class="myNewsList">
      <p class="dateTiem">{{item.createTime}}</p>
      <div class="systemNewsList">
        <p class="systemNews"  :class="item.isRead == '1' ? 'readno':''">{{item.newsName}}</p>
        <div class="systemNewsContent">
          <p @click="lookNews(item.newsId,index)" class="systemNewsText" :class="item.word ? '' : 'hide'"  v-html="item.news"></p>
          <span class="flexible-text" :class="item.word ? 'hide' : 'show'" @click="flexible(index)">{{item.word ? '收起' : '展开'}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data(){
    return{
      userinfo:null,//用户信息
      update:true,
      items: [
        // {
        //   dateTime: "9月12日 11:47",
        //   systemNews: "系统消息",
        //   msg: "刘悦老师发布了“计算机组成原理”的期末测试题！同学们可以积极参与答题。刘悦老师发布了“计算机组成原理”的期末测试题！同学们可以积极参与答题。刘悦老师发布了“计算机组成原理”的期末测试题！同学们可以积极参与答题。刘悦老师发布了“计算机组成原理”的期末测试题！同学们可以积极参与答题。",
        //   word: false
        // }
      ]
    }
  },
  created(){
    document.title = "我的消息"

    //获取用户数据
    if(localStorage.getItem('userinfo')){
      this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
    }else {
      this.userinfo = null
    }
    //我的消息
    this.mynews()
  },
  methods: {
    flexible: function(dex){
      console.log(dex)
      this.items[dex].word = !this.items[dex].word
    },
    mynews(){
      let that = this
      let userId = ''
      if(that.userinfo){
        userId=that.userinfo.userId
      }else {
        userId = ''
      }
      this.$ajax.post(this.GLOBAL.BASE_URL + '/personal/findNews',qs.stringify({userId:userId})).then(res => {
        if(res.data.success && res.data.errorCode == 2){
          let newsList = []
          res.data.body.newsList.map(function(list){
            newsList.push({
              createTime: list.createTime,
              newsName: list.newsName,
              news: list.news.replace(/\n/g,"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"),
              word: false,
              isRead: list.isRead,
              newsId: list.newsId
            })
          })
          that.items = newsList
        }else {
          this.$toast({
            message: res.data.msg,
          })
        }
      })
    },
    lookNews(newsId,index){
      this.items[index].isRead = '1'
      let that = this
      console.log(newsId)
      this.$ajax.post(this.GLOBAL.BASE_URL + '/personal/lookNews',qs.stringify({newsId:newsId})).then(res => {
        if(res.data.success && res.data.errorCode == 2){
          console.log(res.data)
        }else {
          this.$toast({
            message: res.data.msg,
          })
        }
      })
    }
  },
  components: {},
  computed: {}

}
</script>

<style scoped>
.myNews{
  padding: 0.4rem;
}
.systemNewsList{
  width: 100%;
  padding: 0.3rem;
  font-size: 0.45rem;
  padding-bottom: 0;
  background: #fff;
  border-radius: 0.3rem;
  margin-bottom: 0.8rem;
}
.dateTiem{
  color: #A0A0A0;
  font-size: 0.38rem;
  text-align: center;
  line-height: 0.7rem;
}
.systemNews{
  color: red;
  font-weight: 500;
}
.readno{
  color: #3C3C3C;
}
.systemNewsContent{
  color: #878787;
  font-size: 0.4rem;
  line-height: 0.7rem;
}
.systemNewsText{
  width: 100%;
  letter-spacing: 0.01rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid #F6F6F6;
}
.flexible-text{
  display: block;
  text-align: right;
  line-height: 1rem;
  position: relative;
  padding-right: 0.4rem;
  color: #AAAAAA;
}
p.hide{
  overflow: hidden;
  height: 1.8rem;
}
span.hide::after{
  content: "";
  width: 0.2rem;
  height: 0.2rem;
  border-top: 1px solid #AAAAAA;
  border-right: 1px solid #AAAAAA;
  position: absolute;
  top: 58%;right: 0;
  transform: translateY(-50%) rotate(-45deg);
}
span.show::after{
  content: "";
  width: 0.2rem;
  height: 0.2rem;
  border-bottom: 1px solid #AAAAAA;
  border-right: 1px solid #AAAAAA;
  position: absolute;
  top: 44%;right: 0;
  transform: translateY(-50%) rotate(45deg);
}
</style>
