<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="/user/pedia"><i class="el-icon-date"></i> VR百科</el-breadcrumb-item>
        <el-breadcrumb-item>百科搜索</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="banner">
      <h3>KNOW MORE ABOUT</h3>
      <h2><span>VR</span></h2>
    </div>
    <div class="awa" id="about">
      <div class="pedia-container">
        <div class="pedia-box">
          <el-button class="refresh-btn" @click="showTerms()" v-if="isSearch">所有词条</el-button>
          <el-button type="primary" class="search-btn" @click="searchTerms()">搜索</el-button>
          <input autofocus style="padding-left: 20px" type="text" v-model="searchText" placeholder=" 输入词条关键字" />
          <!--<button class="search-btn" @click="search()">search</button>-->
        </div>

        <br/><br/>

        <div class="classTags" v-if="noSearch">
          <el-tabs>
            <el-tab-pane v-for="claList in classList" :label="claList.className" :name="claList.className">
              <div class="terms" v-for="lama in allTerms" v-if="lama.cId === claList.id">
                <div class="search-termName">
                  <h3><a @click="toTermDetail(lama.id)">{{ lama.termName }}</a></h3>
                  <a class="search-link">发布时间：{{ lama.time }}</a>
                  <p class="search-termAbstract">{{ lama.termAbstract }}</p>
                </div>
                <br/>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div v-if="isSearch" class="classTags" v-for="res in searchResult">
          <div class="search-termName">
            <h3><a @click="toTermDetail(res.id)">{{ res.termName }}</a></h3>
            <a class="search-link">发布时间：{{ res.time }}</a>
            <p class="search-termAbstract">{{ res.termAbstract }}</p>
          </div>
          <br/>
        </div>
        <!--<div id="show-pedias">-->

        <!--<div v-for="item in encyclopediaList" class="single-item" @click="encyclopediaClick(item)">-->
        <!--<a href="javascript:void(0);" class="link-tit" title=""></a>-->
        <!--<h1>{{item.keyword}}</h1>-->
        <!--<article>{{item.prop_keyword}}</article>-->
        <!--</div>-->
        <!--</div>-->
      </div>
      <!--<div class="pagination" v-show="pagination_show">-->
      <!--<el-pagination-->
      <!--@current-change="handleCurrentChange"-->
      <!--:current-page.sync="pageNum"-->
      <!--layout="prev, next">-->
      <!--</el-pagination>-->
      <!--</div>-->
    </div>

  </div>
</template>

<script>
  export default {
    data: function(){
      return {
        searchText:'',
        hostURL:'/VR',
        activePane: 'first',
        noSearch: true,
        isSearch: false,
        classList: [
          {
            id: '1',
            indexNum:1,
            className: "简介",
          },
          {
            id: '2',
            indexNum:2,
            className: "发展",
          },
        ],
        allTerms:[
          {
            cId:'1',
            id: '1',
            termName:'简介1',
            termAbstract:'gshsrj',
            time:'2018-04-25 00:29:29',
          },
          {
            cId:'1',
            id: '2',
            termName:'简介2',
            termAbstract:'gshwrfhgwtsrj',
            time:'2018-04-25 00:29:56',
          },
          {
            cId:'2',
            id: '3',
            termName:'发展1',
            termAbstract:'gshw大概发生rfhgwtsrj',
            time:'2018-04-25 00:29:00',
          },
        ],
        searchResult:[
          {
            cId:'2',
            id: '3',
            termName:'发展1',
            termAbstract:'gshw大概发生rfhgwtsrj',
            verifyState:1,
            time:'2018-04-25 00:29:00',
          },
        ],
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

      showTerms(){
        var self = this;
        self.isSearch = false;
        self.noSearch = true;
      },

      searchTerms(){
        var self = this;
        var searchCont = {
          keyword: '',
        };
        searchCont.keyword = self.searchText;
        //console.log(searchCont);
        self.$axios({
          url:'/wikipedia/findTermsByName',
          method:'post',
          baseURL:self.hostURL,
          data:searchCont
        }).then((response)=>{
          if (response.data.length==0){
            self.$message({
              type:'info',
              message:'暂无相关词条'
            });
          } else {
            self.searchResult = response.data;
            //console.log(self.searchResult);
            self.isSearch = true;
            self.noSearch = false;
          }
        }).catch((error)=>{
          self.$message({
            type:'info',
            message:'connect fail'
          });
        });
      },

      toTermDetail(id){
        var self=this;
        //console.log(id);
        self.$router.push('/user/pedia2?'+id);
      },

      getClassList(){
        var self = this;
        self.$axios({
          url: '/wikipedia/findAllClass',
          method: 'get',
          baseURL: self.hostURL,
        }).then((response)=> {
          self.classList = [];
          for(var i=0;i<response.data.length;i++){
            self.classList.push({
              id:response.data[i].id,
              indexNum:i+1,
              className:response.data[i].className,
            })
          };
        }).catch((error)=> {
          console.log(error);
        });
      },

      getLamaList() {
        var self = this;
        self.$axios({
          url: '/wikipedia/findAllTerms',
          method: 'get',
          baseURL: self.hostURL,
        }).then((response) => {
          self.allTerms = [];
          for(var i=0;i<response.data.length;i++){
            if (response.data[i].verifyState === 1 ){
              self.allTerms.push({
                cId: response.data[i].cId,
                className: response.data[i].className,
                id: response.data[i].id,
                termName: response.data[i].termName,
                termAbstract: response.data[i].termAbstract,
                time: response.data[i].time,
              })
            }
          }
          //console.log(self.allTerms);
        }).catch((error) => {
          console.log(error);
        });
      },

    },

    mounted(){
      var self = this;
      var user_name=localStorage.getItem("ms_username");
      if(user_name==""){
        this.$router.replace('/login');
      }
      self.getClassList();
      self.getLamaList();
    }
  }
</script>

<style scoped>
  /*.{
      padding: 0;
      margin: 0;
      background: #FFF;
      font-family: 'open Sans', sans-serif;
  }*/

  .crumbs{
    text-decoration: none;
  }

  .banner{
    /*background:url('../../assets/ab1.jpg') no-repeat 0px 0px;*/
    /*background-size:cover;*/
    /*min-height:500px;*/
    /*min-width:640px;*/
  }
  .banner h3{
    color:#00bcd4;
    font-size:30px;
    letter-spacing:1px;
    text-transform:uppercase;
    /*padding-top:18%;*/
    font-weight:600;
    text-align: center;
  }
  .banner h2{
    color:#fff;
    font-size:50px;
    letter-spacing:1px;
    font-weight:700;
    text-transform:uppercase;
    margin:30px 0px;
    text-align: center;
  }
  .banner h2 span{
    color:#00bcd4;
  }
  .banner h4{
    color:#fff;
    font-size:14px;
    letter-spacing:1px;
    text-transform:uppercase;
    background:#00bcd4;
    width:20%;
    margin:0 auto;
    padding:10px 0px;
    text-align: center;
  }

  .awa{
    padding:10px 0px;
    /*background: #778899;*/
  }

  .pedia-box {
    /*height: 45px;*/
    width: 950px;
    margin: auto;
    margin-top: 0px;
    position: relative;
  }

  .pedia-box input {
    border: 1px solid #e4e4e4;
    box-sizing: border-box;
    width: 700px;
    height: 45px;
    font-size: 18px;
    margin-right: 10px;
    margin-left: 10px;
    float: right;
    /*float: left;*/
    /*padding-left: 0px;*/
    /*padding-right: 10px;*/
    /*overflow: hidden;*/
  }

  .refresh-btn {
    height: 45px;
    cursor: pointer;
  }

  .search-btn {
    height: 45px;
    width: 100px;
    border: 1px solid #FFC107;
    background-color:#FFC107;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    float: right;
  }

  .classTags {
    margin: 3%;
  }

  .search-termName h3{
    margin-bottom: 0;
    color: #409EFF;
    cursor: pointer;
  }

  .search-link {
    color: #007e28;
  }

  .search-termAbstract{
    margin-top: 2px;
    color: #464646;
  }
  .link-tit{
    color: #e9c06c;
  }
  #show-pedias{
    max-width:800px;
    margin:0 auto;
  }
  .single-item,.eg-item{
    padding:20px;
    margin:20px 0;
    box-sizing:border-box;
    background:#eee;
    cursor:pointer;
  }

  .pagination{
    margin-right:120px;
  }
</style>
