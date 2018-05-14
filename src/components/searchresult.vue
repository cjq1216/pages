<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="/user/pedia"><i class="el-icon-date"></i> <span class="bread">VR百科</span></el-breadcrumb-item>
        <el-breadcrumb-item><span class="bread">百科知识</span></el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--<div class="sidebar" v-if="seen">-->
    <!--<h3 class="wthree_head">-->
    <!--<br/><br/><br/>-->
    <!--<span>报错</span>-->
    <!--</h3><br/><br/>-->
    <!--<textarea placeholder="报错内容" id="conSpace" v-model="errorForm.e_con"></textarea>-->
    <!--<el-button class="or-btn" style="margin-left:30%;margin-top:10px" type="primary" @click="submiterror()">提交</el-button>-->
    <!--<el-button class="or-btn" style="margin-top:10px" type="primary" @click="close()">关闭</el-button>-->
    <!--</div>-->

    <div class="events">
      <div>
        <div>
          <div><br/>
            <h1 class="title">{{lama.termName}}</h1>
            <a class="search-link">发布时间：{{ lama.time }}</a>
            <br/>
          </div>

          <div class="sub_title">
            <h2 class="title_text">
              <span>简述</span>
            </h2>
          </div>
          <div class="article">
            <div class="news-list">
              <lidiv class="news-item">
                <p class="news-desc">{{lama.termAbstract}}</p>
              </lidiv>
            </div>
          </div>
          <div class="sub_title">
            <h2 class="title_text">
              <span>内容</span>
            </h2>
          </div>
          <div class="article">
            <div class="news-list">
              <div class="news-item">
                <p class="news-desc" id="Content"></p>
              </div>
            </div>
          </div>

          <div class="news-comment">
            <el-button-group>
              <el-button type="warning" @click="edit()">报错</el-button>
            </el-button-group>
          </div>
          <div v-if="seen" class="error">
            <h3 class="wthree_head"><br/>
              <span>报错</span>
            </h3>
            <br/>
            <textarea placeholder="报错内容" class="conSpace" v-model="errorForm.e_con"></textarea>
            <div class="errorbtn">
              <el-button class="or-btn" style="margin-left:43%" type="primary" @click="submiterror()">提交</el-button>
              <el-button class="or-btn" type="primary" @click="close()">关闭</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: function(){
      return {
        seen:false,
        activeName2: 'first',
        allowSubmit:true,
        hostURL:"/VR",
        id:"1",
        prop_id:"1",
        keyword:"",
        prop_keyword:"",
        content:"",
        upvote:1,
        downvote:1,
        changenote:"a1",
        encyclopedia_propData:[
          {
            id:"1",
            prop_id:"1",
            keyword:"",
            prop_keyword:"",
            content:"a",
            changenote:"a1",

          },
          {
            id:"2",
            prop_id:"2",
            keyword:"",
            prop_keyword:"",
            content:"b",
            changenote:"b1",

          }
        ],
        lama: {
          cId:'1',
          className: "简介",
          id: '2',
          termName: "简介1",
          termAbstract:"简介1的简介",
          termContent:"<p>rtbnf</p>",
          verifyState: 1,
          time: '2018-04-22 23:00:58',
        },
        errorForm:{
          l_id:'1',
          e_con:'',
          user_name:'wo',
        },

      }
    },
    methods:{
      codeParsing(code) {
        let self = this;
        var msg = (err_title, err_message)=> {
          self.$notify({
            title: err_title,
            message: err_message,
            type: 'error'
          });
        };
        switch (code) {
          case -1:
            msg('系统错误', '未知错误，请上报管理员');
            break;
          case 201:
            msg('输入域错误', '验证码错误');
            break;
          case 300:
            msg('输入域错误', '邮箱或密码错误');
            break;
          case 301:
            msg('权限问题', '用户已禁用，请联系管理员');
            break;
          case 302:
            msg('权限问题', '用户未激活，请去邮箱激活用户');
            break;
          case 303:
            msg('注册问题', '邮箱已占用，请更改邮箱');
            break;
          case 304:
            msg('注册问题', '昵称已占用，请更改昵称');
            break;
          case 401:
            msg('权限问题', '用户无权访问，请联系管理员');
            break;
          case 402:
            msg('操作错误', '删除错误,请刷新重试');
            break;
          case 415:
            msg('操作错误', '文件类型错误，请上传正确文件类型');
            break;
          case 500:
            msg('系统错误', '未知错误，请上报管理员');
            break;
          case 600:
            msg('TIME_OUT', '访问超时，请检查网络连接');
            break;
          case 700:
            msg('激活错误', '非法激活链接，请联系管理员');
            break;
          case 800:
            msg('激活错误', '用户已被激活，请直接登录');
            break;
          case 1000:
            msg('系统错误', '参数错误，上报管理员');
            break;
          case 1001:
            msg('权限问题', '用户未登录，请重新登录');
            break;
          case 1002:
            msg('系统错误', '参数错误，上报管理员');
            break;
          default:
            break;
        }
      },
      getEncyclopedia_propData(id){
        var self = this;
        self.encyclopedia_propData = [];
        self.$axios({
          url:'/encyclopedia-prop/'+id,
          method:'get',
          baseURL: self.hostURL
        }).then((response)=>{
          self.encyclopedia_propData = response.data;

          console.log(encyclopedia_propData);
        }).catch((error)=>{
          console.log(error);
        });
      },
      getEncyclopediaData(id){
        var self=this;
        var encydata={
          id:1,
          keyword:'',
          type:'',
          changenote:'',
          upvote:1,
          downvote:1
        };
        self.$axios({
          url:'/encyclopedia-votedata/'+id,
          method:'get',
          baseURL: self.hostURL
        }).then((response)=>{
          encydata = response.data;
          self.id=encydata.id;
          self.keyword=encydata.keyword;
          self.upvote=encydata.upvote;
          self.downvote=encydata.downvote;
        }).catch((error)=>{
          console.log(error);
        });

      },
      edit(){
        var self=this;
        self.seen=true;
        self.errorForm.l_id = self.lama.id;
        self.errorForm.user_name = localStorage.getItem("ms_username");
      },
      close(){
        var self=this;
        self.seen=false;
      },
      submiterror(){
        var self=this;
        var err={
          l_id: self.errorForm.l_id,
          e_con: self.errorForm.e_con,
          user_name: self.errorForm.user_name,
        }
        //console.log(err);
        self.$axios({
          url:'/wikipedia/providePediaError',
          method:'post',
          baseURL: self.hostURL,
          data:err,
        }).then((response)=>{
          var state=response.data;
          if(state==1){
            self.$message({
              type:'info',
              message:'提交成功'
            });
            self.close();
          } else {
            self.$message({
              type:'error',
              message:'提交失败，请重试'
            })
          }
        }).catch((error)=>{
          console.log(error);
          self.$message({
            type:'info',
            message:'connect fail'
          });
        });
      },

      up()
      {
        var self=this;
        var sid=self.id;
        var username=localStorage.getItem('ms_username');
        var votenote='encyclopedia-vote'+sid;
        var flag=localStorage.getItem(votenote);
        if(username==flag)
        {
          self.$message({
            type:'info',
            message:'您已经对该条百科做出评价'
          });
          return ;
        }
        self.$axios({
          url:'/encyclopedia-up/'+sid,
          method:'get',
          baseURL: self.hostURL
        }).then((response)=>{
          var state=response.data;
          if(state==1){
            self.$message({
              type:'info',
              message:'赞成功'
            });
            self.upvote=self.upvote+1;
            localStorage.setItem(votenote, username);

          }

        }).catch((error)=>{
          console.log(error);
        });

      },
      down()
      {
        var self=this;
        var sid=self.id;
        var username=localStorage.getItem('ms_username');
        var votenote='encyclopedia-vote'+sid;
        var flag=localStorage.getItem(votenote);
        if(username==flag)
        {
          self.$message({
            type:'info',
            message:'您已经对该条百科做出评价'
          });
          return ;
        }
        self.$axios({
          url:'/encyclopedia-down/'+sid,
          method:'get',
          baseURL: self.hostURL
        }).then((response)=>{
          var state=response.data;
          if(state==1){
            self.$message({
              type:'info',
              message:'踩成功'
            });
            self.downvote=self.downvote+1;
            localStorage.setItem(votenote, username);
          }

        }).catch((error)=>{
          console.log(error);
        });

      },

      getLamaDetail(Lid){
        var self = this;
        var lId = {
          l_id: '',
        }
        lId.l_id = Lid;
        //console.log(lId);
        self.$axios({
          url:'/wikipedia/findTermById',
          method:'post',
          baseURL:self.hostURL,
          data:lId
        }).then((response)=>{
          self.lama = response.data;
          //console.log(self.lama);
          var insText = self.lama.termContent;
          //console.log(insText);
          document.getElementById("Content").innerHTML = insText;
        }).catch((error)=>{
          self.$message({
            type:'info',
            message:'connect fail'
          });
        });
      },

    },

    mounted(){
      var self= this;
      //console.log(self.lama);
      var user_name=localStorage.getItem("ms_username");
      if(user_name==""){
        this.$router.replace('/login');
      }
      var tmp1 = location.href.split('?');
      var insText = self.lama.termContent;
      document.getElementById("Content").innerHTML = insText;
      self.getLamaDetail(tmp1[1]);

    }
  }
</script>

<style scoped>
  .crumbs{
    text-decoration: none;
  }
  .bread{
    font-size: 16px;
  }
  .form-box{
    width:300px;
    margin-top:50px;
    margin-left:0px;
    box-shadow:0 0 8px 0
    rgba(232,237,250,.9),0 2px 4px 0
    rgba(232,237,250,.9);
    padding:50px 50px 50px 10px;
  }

  .news-box{
    padding: 28px;
    width: 800px;
    border: 1px solid #E1E1E1;
    box-shadow: 0 0 2px rgba(0,0,0,.1);
  }
  .news-title{
    font-size: 22px;
    color: #287D7C;
    line-height: 50px;
    font-weight: normal;
    display: block;
  }
  .borderline{
    border-bottom: 1px dotted #BFBFBF;
  }
  .artinfo{
    float: left;
    padding-bottom: 5px;
    color: #999;
    margin: 0;
    padding: 0;
    display: block;
  }
  .author{
    color: #666;
  }
  .article p{
    padding: 30px 0 50px;
    font-size: 18px;
    color: #333;
    line-height: 200%;
    text-indent:2em;
  }
  .article {
    display: inline-block;
    line-height: 26px;
    padding-bottom: 25px;
  }
  .news-img{
    text-align: center;
  }
  .news-comment{
    margin-top: 20px;
    text-align: center;
  }
</style>

<style scoped>

  .submit-btn button{
    width:100%;
  }

  ul {
    list-style: none;
    display: block;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    -webkit-padding-start: 30px;
  }
  li {
    list-style-type:none;
    padding-bottom:10px;
    /*border-bottom: 1px solid #ccc;*/
  }
  a {
    text-decoration: none;
  }
  a:hover, a:visited {
    text-decoration: none;
  }
  .or-btn{
    border: 1px solid #f2af00;
    background: #f2af00;
    margin-top:10px
  }
  .news-item,.eg-item{
    margin-bottom: 24px;
    overflow: hidden;
  }
  .news-list .news-item {
    color: #e9c06c;
  }
  .news-list .news-item img{
    display: block;
    float:left;
    margin-right: 20px;
    width:200px;

  }
  .news-list .news-item .news-title,.eg-title{
    display: block;
    font-size: 22px;
    font-weight: lighter;
    color: #3e3e3e;
    line-height: 50px;
    height: 50px;
    overflow: hidden;
  }
  .news-list .news-desc {
    display: block;
    /*height: 60px;*/
    overflow: hidden;
    font-size: 14px;
    color: black;
    line-height: 1.5;
  }

  .pagination{
    margin-left:50px;
  }
  .sidebar{
    display: block;
    position: absolute;
    width: 400px;
    right: 0;
    top: 0;
    bottom:0;
    background: #2E363F;
  }
  .sidebar > ul {
    height:100%;
  }

  .events {
    padding: 0em 0em;
  }
  .title{
    font-size: 4em;
    color:#778899;
    font-family: 'Marvel', sans-serif;
    margin-bottom: 0px;
    margin-left: 30px;
  }

  .search-link {
    color: #007e28;
    float: right;
  }

  .reporterrorbtn {
    /*display: inline-block;*/
    /*float: right;*/
  }

  .sub_title {
    display: block;
    clear: both;
    zoom: 1;
    overflow: hidden;
    border-left: 12px solid #4f9cee;
    line-height: 24px;
    font-size: 24px;
    font-weight: 400;
    /*background: url(https://bkssl.bdimg.com/static/wiki-lemma/normal/resource/img/paraTitle-line_c5e6d61.png);*/
    /*margin: 35px 0 15px -30px;*/
    position: relative;
  }

  .title_text {
    float: left;
    display: block;
    padding: 0 8px 0 18px;
    line-height: 40px;
    font-size: 30px;
    font-weight: 400;
    color: #000;
    background: #fff;
  }

  .news-title {
    font-size: 2em;
    color: #f2af00;
    font-family: 'Marvel', sans-serif;
  }
  .event-text p {
    font-size: 1em;
    color:#777676;
    line-height: 1.8em;
    margin-top: 0.5em;
  }
  .event-text a {
    font-size: 0.95em;
    color: #fff;
    background:#a2b040;
    padding: 0.5em 1em;
    display: inline-block;
    margin-top: 0.8em;
    border-radius: 3px;
  }
  .event-text a:hover {
    background:#f2af00;
  }

  .wthree_head{
    font-size:2em;
    color:#f2af00;
    text-align:center;
    text-transform: capitalize;
  }
  .wthree_head span{
    display: block;
    font-size: .5em;
    padding: .5em 0;
    border-top: 1px solid #f2af00;
    border-bottom: 1px solid #f2af00;
    width: 30%;
    text-transform: uppercase;
    letter-spacing: 5px;
    margin: 0 auto;
  }

  .el-input{
    padding:8px;
    width:95%;
  }
  .conSpace {
    height:200px;
    width:380px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .error {
    margin-left: auto;
    margin-right: auto;
  }
  .errorbtn {
    margin-left: auto;
    margin-right: auto;
  }
</style>
