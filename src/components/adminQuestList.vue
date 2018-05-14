<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>问卷管理</el-breadcrumb-item>
        <el-breadcrumb-item>问卷编辑与查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row>
      <el-button class="refresh-btn" type="success" @click="goToCreater()">创建问卷</el-button>
    </el-row>
    <div class="questionnaire">
      <div class="survey-folder"></div>

      <!--<p>问卷列表</p>-->
      <div v-for="quest in questList">
        <el-row>
          <el-col :span="24" style="height: 50px">
            <div class="grid-content bg-purple-dark">
              <span class="quest-name">{{quest.name}}</span>
              <span class="quest-id">&nbsp;&nbsp;&nbsp;ID：{{quest.indexNum}}</span>
              <span class="quest-num">答卷：{{quest.number}}</span>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="grid-content bg-purple-light">
              <el-button class="mybtn" type="primary" icon="edit" @click="goToEditor(quest)">编辑问卷</el-button>
              <el-button class="mybtn" type="primary" icon="search" @click="goToAnalyze(quest)">数据分析</el-button>
              <el-button class="mybtn" type="danger" icon="delete" @click="deleteQuest(quest)"></el-button>
              <el-switch v-model="quest.activated" on-color="#13ce66" off-color="#ff4949" on-text="开启" off-text="停止" on-value="1" off-value="0" @change="questSwitch(quest,$event)" style="float: right;margin-top: 18px;margin-right: 20px"></el-switch>
            </div>
          </el-col>

        </el-row>
        <br/>
      </div>
      <br />

    </div>


  </div>
</template>

<script>

  export default {
    data: function(){
      return {
        allowSubmit:true,
        hostURL:"/VR",
        questList:[
          {
            id:1,
            name:'问卷1',
            activated:'1',
            number:20,
          },
          {
            id:2,
            name:'问卷2',
            activated:'0',
            number:20,
          },
          {
            id:3,
            name:'问卷3',
            activated:'1',
            number:20,
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

      getQuest(){
        var self = this;
        //self.questList=[];
        self.$axios({
          url:'/question/getAlLQuestionaire',
          method:'get',
          baseURL:self.hostURL
        }).then((response)=>{
          console.log(response.data);
          self.questList = [];
          for (var i=0;i<response.data.length;i++) {
            var item = {}
            item.activated = response.data[i].activated + '';
            item.description = response.data[i].description;
            item.id = response.data[i].id;
            item.name = response.data[i].name;
            item.number = response.data[i].number;
            item.indexNum = i+1;
            self.questList.push(item);
          }
          console.log(self.questList);
        }).catch((error)=>{
          self.$message({
            type:'info',
            message:'connect fail'
          });
        });
      },

      questSwitch(quest,$event){
        var self = this;
        console.log(quest.id);
        console.log($event);
        self.$axios({
          url:'/question/setQAva',
          method:'post',
          baseURL:self.hostURL,
          data:{
            q_id:quest.id,
            q_ava:$event,
          }
        });
      },
      goToCreater(){
        var self=this;
        console.log("go to questionnaierCreater!");
        self.$router.push('/admin/adminQuestionnaireCreater');
      },

      goToEditor(quest){
        var self = this;
        console.log("go to QuestionnaierEditor!");
        console.log(quest.id);
        self.$router.push('/admin/adminQuestionnaireEditor?'+quest.id);
      },

      goToAnalyze(quest){
        var self = this;
        console.log("go to QuestionnaierAnalyze!");
        console.log(quest.id);
        self.$router.push('/admin/adminQuestionnaireAnalyze?'+quest.id);
      },

      deleteQuest(quest){
        var self = this;
        console.log(quest.id);
        self.$axios({
          url:'/question/deleteQuestionaire',
          method:'post',
          baseURL:self.hostURL,
          data:{
            q_id:quest.id,
          }
        }).then((response)=>{
          if(response.data == 1) {
            self.$message({
              type:'info',
              message:'删除问卷成功！'
            })}else{
            self.$message({
              type:'info',
              message:'删除问卷失败！'
            })
          };
          this.$router.push('/admin/adminQuestionnairelist');
          self.getQuest();
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
      self.getQuest();
    }
  }

</script>

<style scoped>
  .crumbs{
    margin-bottom: 20px;
  }
  .refresh-btn{
    margin-top: -39px;
    float: right;
    margin-bottom: 10px;
  }
  .survey-folder {
    margin: 20px 0;
    border-top: 2px solid #f5f7fa;
  }
  /*el-row {*/
  /*margin-bottom: 20px;*/
  /*}*/
  /*el-col {*/
  /*border-radius: 4px;*/
  /*}*/
  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .quest-name{
    font-size: 22px;
    color: #3e3e3e;
    line-height: 50px;
    height: 50px;
    overflow: hidden;
    margin-left: 15px;
  }

  .quest-num {
    float: right;
    height: 60px;
    overflow: hidden;
    font-size: 14px;
    line-height: 1.5;
    margin-top: 15px;
    margin-right: 20px;
  }
  .mybtn {
    margin-top: 10px;
    border-top-width: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom-width: 5px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
  }
</style>
