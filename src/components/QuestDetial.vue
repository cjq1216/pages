<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="/user/questionnairelist"><i class="el-icon-date"></i>满意度调查</el-breadcrumb-item>
        <el-breadcrumb-item>问卷</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div v-if="isLoading">加载中...</div>
    <div v-else class="questionnaire-box">
      <div class="questionnaire-title">{{q_name}}</div>
    </div>
    <br/>
    <div class="question">
      <form id="questions">
        <div class="quest">
          <div v-for="quest in quests">
            <h4>{{quest.e_id}}.&nbsp;{{quest.question}}</h4>
            <div class="single" v-if="quest.type===1">
              <div v-for="choice in quest.subs">
                <label :for="choice.choices">
                  <input :name="quest.e_id" :id="choice.choices" :value="choice.choices" v-model="answer[quest.e_id].e_sel" type="radio">&nbsp;{{choice.choices}}
                </label>
              </div>
            </div>
            <div class="plural" v-if="quest.type===2">
              <div v-for="choice in quest.subs">
                <label :for="choice.choices">
                  <input :name="quest.e_id" :id="choice.choices" :value="choice.choices" v-model="answer[quest.e_id].e_sel" type="checkbox">&nbsp;{{choice.choices}}
                </label>
              </div>
            </div>
            <div class="plural" v-if="quest.type===3">
              <textarea :rows="4" :cols="50" placeholder="请输入内容" v-model="answer[quest.e_id].e_con"></textarea>
            </div>
            <br/>
          </div>
        </div>
      </form>
      <br/>
      <div class="submit_btn">
        <el-button type="primary" @click="sendQuestionnaire()">提交问卷</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data: function(){
      return {
        hostURL:'/VR',
        q_id: '1',
        q_name: 'test',
        q_desc:'',
        quests: [],
        answer: {},
        isLoading: false,
      }
    },
    name: "QuestDetial",
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

      fetchQuestionnaire(q_id) {
        var self = this;
        //self.questList=[];
        return self.$axios({
          url:'/question/getQuestions',
          method:'post',
          baseURL:self.hostURL,
          data:{
            q_id:q_id,
          }
        }).then((response)=>{
          //console.log(response.data);
          return response.data;
        }).catch((error)=>{
          self.$message({
            type:'info',
            message:'无法获取问卷，请重试'
          });
        });
        // const p = new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     resolve()
        //   }, 2000)
        // })
        // return p.then(() => {
        //   return {
        //     quests: [
        //       {
        //         q_id: 1,
        //         e_id: 1,
        //         question: '单选题1',
        //         type: 1,
        //         subs: [
        //           {choices: 'A选项'},
        //           {choices: 'B选项'},
        //           {choices: 'C选项'}
        //         ],
        //       },
        //       {
        //         q_id: 1,
        //         e_id: 2,
        //         question: '多选题',
        //         type: 2,
        //         subs: [
        //           {choices: 'A选项A'},
        //           {choices: 'B选项B'},
        //           {choices: 'C选项C'}
        //         ],
        //       },
        //       {
        //         q_id: 1,
        //         e_id: 3,
        //         question: '问答题1',
        //         type: 3,
        //         subs: '',
        //       },
        //       {
        //         q_id: 1,
        //         e_id: 4,
        //         question: '单选题2',
        //         type: 1,
        //         subs: [
        //           {choices: 'A选项a'},
        //           {choices: 'B选项b'},
        //           {choices: 'C选项c'}
        //         ],
        //       },
        //       {
        //         q_id: 1,
        //         e_id: 5,
        //         question: '多选题2',
        //         type: 2,
        //         subs: [
        //           {choices: 'A'},
        //           {choices: 'B'},
        //           {choices: 'C'}
        //         ],
        //       },
        //       {
        //         q_id: 1,
        //         e_id: 6,
        //         question: '问答题2',
        //         type: 3,
        //         subs: '',
        //       },
        //     ],
        //   }
        // })
      },

      validate() {
        let isCompleted = true
        for (let i = 0; i < this.quests.length; i++) {
          const quest = this.quests[i]
          switch (quest.type) {
            case 1:
              if (!this.answer[quest.e_id].e_sel) {
                isCompleted = false
              }
              break
            case 2:
              if (this.answer[quest.e_id].e_sel.length <= 0) {
                isCompleted = false
              }
              break
            case 3:
              if (!this.answer[quest.e_id].e_con) {
                isCompleted = false
              }
              break
            default:
            // do nothing
          }
          if (!isCompleted) {
            break
          }
        }
        return isCompleted
      },

      sendQuestionnaire(){
        const isCompleted = this.validate()
        if (!isCompleted) {
          alert('问卷没有填写完全')
        } else {
          const answerAry = [];
          const plainAnswer = JSON.parse(JSON.stringify(this.answer));
          Object.keys(plainAnswer).forEach(key => {
            const { e_sel } = plainAnswer[key]
            if (!Array.isArray(e_sel)) {
              plainAnswer[key].e_sel = [e_sel]
            }
            answerAry.push(plainAnswer[key])
          })
          // Object.keys(this.answer).forEach((key) => {
          //     answerAry.push(this.answer[key])
          // })
          // let answers = JSON.stringify(answerAry, null, '  ');
          console.log(answerAry);
          this.$axios({
            url:'/question/giveAnswer',
            method:'post',
            baseURL:this.hostURL,
            data:answerAry
          }).then((response)=>{
            this.$message({
              type:'info',
              message:'提交成功'
            });
            this.$router.push('/user/questionnairelist');
          }).catch((error)=>{
            this.$message({
              type:'info',
              message:'提交失败，请重试'
            });
          });
        }
      },

      fetchData(q_id) {
        this.isLoading = true;
        this.fetchQuestionnaire(q_id).then((data) => {
          const answer = {}
          const u_name = localStorage.getItem('ms_username')
          const u_ip = returnCitySN["cip"];
          data.quests.forEach((quest) => {
            //console.log(quest)
            const key = quest.e_id;
            answer[key] ={
              q_id: this.q_id,
              e_id: quest.e_id,
              e_sel: [],
              e_con: '',
              u_name,
              u_ip,
            }
            // if (quest.type === 1) {
            //     answer[key].e_sel = []
            // } else if (quest.type === 2) {
            //     answer[key].e_sel = []
            // }
          });
          this.answer = answer;
          this.quests = data.quests;
          this.isLoading = false
        }).catch(err => {
          this.isLoading = false;
          console.error(err)
        })
      },
      getQuestionnaireInfo(qid){
        var self = this;
        self.$axios({
          url:'/question/getAlLQuestionaire',
          method:'get',
          baseURL:self.hostURL
        }).then((response)=>{
          console.log(response.data);
          for(let i=0;i<response.data.length;i++){
            if(response.data[i].id == qid){
              self.q_name = response.data[i].name;
              self.q_desc = response.data[i].description;
            }
          }
        }).catch((error)=>{
          self.$message({
            type:'info',
            message:'无法获取问卷，请重试'
          });
        });
      },
    },

    mounted() {
      var self= this;
      var user_name=localStorage.getItem("ms_username");
      if(user_name==""){
        this.$router.replace('/login');
      }
      var tmp1 = location.href.split('?');
      self.q_id = tmp1[1];
      console.log(self.q_id);
      //self.getData(q_id);
      self.getQuestionnaireInfo(self.q_id);
      self.fetchData(self.q_id);
    },

  }
</script>

<style scoped>
  .questionnaire-box{
    padding: 28px;
    width: 800px;
    border: 1px solid #E1E1E1;
    box-shadow: 0 0 2px rgba(0,0,0,.1);
  }
  .questionnaire-title{
    font-size: 22px;
    color: #287D7C;
    line-height: 50px;
    font-weight: normal;
    display: block;
    text-align: center;
  }

  .questionnaire__radio {
    padding: 0px;

  }
</style>
