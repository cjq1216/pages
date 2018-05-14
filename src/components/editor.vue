<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="/admin/adminQuestionnairelist"><i class="el-icon-date"></i> 问卷管理</el-breadcrumb-item>
        <el-breadcrumb-item>问卷编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row>
      <el-button class="refresh-btn" type="danger" @click="cancel()">取消</el-button>
    </el-row>
    <div class="form-box">
      <el-form :model="q" ref="q" label-width="100px" label-position="top">
        <el-form-item
          label="问卷名"
          :rules="[{ required: true, message: '请输入问卷名', trigger: 'blur'}]">
          <el-input v-model="q.q_name"></el-input>
        </el-form-item>
        <el-form-item label="问卷描述">
          <el-input type="textarea" v-model="q.q_desc" style="width: 600px;"
                    placeholder="请输入问卷描述"></el-input>
        </el-form-item>
      </el-form>
      <question-input
        v-for="question in quests"
        :value="question"
        @on-change="onQuestionChange"
        @on-delete="onQuestionDelete"
      />
      <div class="buttons-container">
        <el-button @click="addSingle">添加单选题</el-button>
        <el-button @click="addPlural">添加多选题</el-button>
        <el-button @click="addEssay">添加问答题</el-button>
      </div>
    </div>
    <el-button @click="createOrUpdateQuestionaire" type="primary">提交</el-button>
  </div>
</template>

<script>
  import QuestionInput from './QuestionInput'
  import nextId from '../utils/nextId'
  import { QUESTION_SINGLE, QUESTION_MULTIPLE, QUESTION_TEXT } from '../constants'

  export default {
    components: {
      QuestionInput,
    },
    data: function () {
      return {
        hostURL: '/VR',
        load: false,
        select_cast: '',
        q: {
          q_id:'',
          q_name:'123',
          q_desc:'123',
          q_ava:0,
          e_id:null,
          e_tit:'',
          e_sel:'',
          e_type:'',
        },
        quests: [],
      }
    },

    methods: {
      cancel(){
        var self = this;
        console.log("go to list!");
        self.$router.push('/admin/adminQuestionnairelist');
      },
      fetchData(id) {
        var self = this;
        //self.questList=[];
        return self.$axios({
          url:'/question/getQuestions',
          method:'post',
          baseURL:self.hostURL,
          data:{
            q_id:id,
          }
        }).then((response)=>{
          console.log(response.data);
          return response.data;
        }).catch((error)=>{
          self.$message({
            type:'info',
            message:'无法获取问卷，请重试'
          });
        });
      },
      getQuestionnaireInfo(qid){
        this.$axios({
          url:'/question/getAlLQuestionaire',
          method:'get',
          baseURL:this.hostURL
        }).then((response)=>{
          for(var i=0;i<response.data.length;i++){
            if(response.data[i].id == qid){
              this.q.q_name = response.data[i].name;
              this.q.q_desc = response.data[i].description;
            }
          }
        }).catch((error)=>{
          this.$message({
            type:'info',
            message:'无法获取问卷，请重试'
          });
        });
      },
      createOrUpdateQuestionaire() {
        const plainQ = JSON.parse(JSON.stringify(this.q))
        const plainQuests = JSON.parse(JSON.stringify(this.quests))

        if (!plainQ.q_name || !plainQ.q_desc) {
          this.$message.error('请检查问卷标题与描述是否填写')
          return
        }

        for (let i = 0; i < plainQuests.length; i++) {
          const plainQuest = plainQuests[i]
          if (!plainQuest.e_title) {
            this.$message.error(`请填写问卷第${i + 1}题干`)
            return
          }
          if (plainQuest.e_type !== QUESTION_TEXT && (!plainQuest.e_sel || plainQuest.e_sel.length <=1)) {
            this.$message.error(`请检查第${i + 1}题，选择题至少需要提供两个选项`)
            return
          } else if (plainQuest.e_type !== QUESTION_TEXT && plainQuest.e_sel && plainQuest.e_sel.length > 0) {
            for (let j = 0; j < plainQuest.e_sel.length; j++) {
              if (!plainQuest.e_sel[j].value) {
                this.$message.error(`请填写第${i + 1}题的第${j + 1}个选项`)
                return
              }
            }
          }
        }

        const basicInfo = {
          q_id: plainQ.q_id,
          q_name: plainQ.q_name,
          q_desc: plainQ.q_desc,
        }

        const questionaire = []

        plainQuests.forEach((quest, index) => {

          if (quest.e_type === QUESTION_TEXT) {
            questionaire.push({
              ...basicInfo,
              ...quest,
              e_id: index + 1,
            })
          } else {
            if (quest.e_sel && quest.e_sel.length > 0) {
              quest.e_sel.forEach(item => {
                questionaire.push({
                  ...basicInfo,
                  ...quest,
                  e_sel: item.value,
                  e_id: index + 1,
                })
              })
            }
          }
        })

        console.log(questionaire)
        this.$axios({
          url:'/question/updateQuestionaire',
          method:'post',
          baseURL:this.hostURL,
          data:questionaire
        }).then((response) => {
          var state = response.data;
          if (state == 0) {
            this.$message({
              type: 'error',
              message: '提交失败，请重试'
            })
          }
          else {
            this.$message({
              type: 'info',
              message: '提交成功'
            });
            console.log("go to list!");
            this.$router.push('/admin/adminQuestionnairelist');
          }
        }).catch((error) => {
          this.$message({
            type: 'info',
            message: 'connect fail'
          });
        });
      },
      onQuestionChange(newQuestion) {
        const index = this.quests.findIndex((question) => {
          return question.e_id === newQuestion.e_id
        })
        if (index <= -1) {
          return
        }
        this.quests.splice(index, 1, newQuestion)
      },
      onQuestionDelete(e_id) {
        const index = this.quests.findIndex((question) => {
          return question.e_id === e_id
        })
        if (index <= -1) {
          return
        }
        this.quests.splice(index, 1)
      },
      addSingle() {
        this.quests.push({
          e_id: nextId(),
          e_type: QUESTION_SINGLE,
          e_title: '',
          e_sel: [
            {
              id: nextId(),
              value: '',
            },
            {
              id: nextId(),
              value: '',
            },
          ],
        })
      },
      addPlural() {
        this.quests.push({
          e_id: nextId(),
          e_type: QUESTION_MULTIPLE,
          e_title: '',
          e_sel: [
            {
              id: nextId(),
              value: '',
            },
            {
              id: nextId(),
              value: '',
            },
          ],
        })
      },
      addEssay() {
        this.quests.push({
          e_id: nextId(),
          e_type: QUESTION_TEXT,
          e_title: '',
        })
      },
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
    },
    mounted() {
      const quests = []
      var tmp1 = location.href.split('?');
      this.q.q_id = tmp1[1];
      console.log(this.q.q_id);
      if (this.q.q_id){
        this.getQuestionnaireInfo(this.q.q_id);
        this.fetchData(this.q.q_id).then((data) => {
          data.quests.forEach((quest) => {
            const transformedQuest = {
              e_id: quest.e_id,
              e_title: quest.question,
              e_type: quest.type,
            }
            if (quest.type === QUESTION_SINGLE || quest.type === QUESTION_MULTIPLE) {
              const e_sel = []
              quest.subs.forEach((sub) => {
                e_sel.push({
                  id: nextId(),
                  value: sub.choices,
                })
              })
              transformedQuest.e_sel = e_sel
            }
            quests.push(transformedQuest)
          })
          this.quests = quests
        })
      }

    },
  }
</script>

<style scoped>
  .content {
    float: left;
    width: 70%;
  }

  .buttons-container {
    margin-bottom: 32px;
  }
  .refresh-btn{
    margin-top: -39px;
    margin-right: 20px;
    float: right;
    margin-bottom: 10px;
  }
</style>
