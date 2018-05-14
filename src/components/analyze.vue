<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="/admin/adminQuestionnairelist"><i class="el-icon-edit"></i>问卷管理</el-breadcrumb-item>
        <el-breadcrumb-item>问卷数据分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row>
      <el-button class="refresh-btn" type="primary" @click="goTolist()">返回</el-button>
      <el-button class="refresh-btn" type="primary" @click="getPdf()" :disabled="true">下载报告</el-button>
    </el-row>
    <div class="pdf-dom" id="pdfDom">
      <div class="questionnaire-box">
        <div class="questionnaire-title">{{questionaireName}}</div>
        <div class="questionnaire-info">总作答人数：{{allNum}}</div>
      </div>
      <br/>
      <div>
        <div v-for="answer in answers">
          <h4 class="question-title">{{answer.quesitonId}}.&nbsp;{{answer.question}}&nbsp;&nbsp;
            <span v-if="answer.type===1" class="question-type">[单选题]&nbsp;&nbsp;</span>
            <span v-if="answer.type===2" class="question-type">[多选题]&nbsp;&nbsp;</span>
            <span v-if="answer.type===3" class="question-type">[问答题]</span>
            <el-switch v-if="answer.type!==3" v-model="answer.gswitch" on-color="#13ce66" off-color="#13ce66" :width=80 on-text="柱状图" off-text="饼 图" @change="GSwitch(answer,$event)">
            </el-switch>
          </h4>
          <div v-if="answer.type===2 || answer.type===1" :id="answer.quesitonId" style="width:80%;height:400px;"></div>
          <div v-else class="ansCon">
            <el-table :data="answer.con" stripe style="width: 80%" height="250">
              <el-table-column prop="cont" label="回答"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div id="test"></div>
  </div>
</template>

<script>
  import html2Canvas from 'html2canvas';
  import JsPDF from 'jspdf';

  // 引入 ECharts 主模块
  var echarts = require('echarts/lib/echarts');
  // 引入柱状图
  require('echarts/lib/chart/bar');
  require("echarts/lib/chart/pie");
  require("echarts/lib/chart/line");
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  require('echarts/lib/component/toolbox');
  require('echarts/lib/component/dataset');

  export default {
    name: "analyze",
    data() {
      return {
        qId:'',
        questionaireName:'问卷1',
        allNum:10,
        hostURL: '/VR',
        answers:[
          {
            quesitonId:1,
            type:1,
            question:'单选题1',
            choice:['a选项','b选项'],
            ansNum:[30,45],
            ansContent:[],
            gswitch:true
          },
          {
            quesitonId:2,
            type:2,
            question:'多选题1',
            choice:['a','b'],
            ansNum:[25,50],
            ansContent:[],
            gswitch:true
          },
          {
            quesitonId:3,
            type:3,
            question:'问答题',
            choice:[],
            ansNum:[],
            ansContent:['我的回答','你的回答','他的'],
          },
        ],
      }
    },

    methods: {
      getPdf: function () {
        let pdfDom = document.querySelector('#pdfDom');
        html2Canvas(pdfDom,function(canvas){
          document.body.appendChild(canvas);
        })
        // html2Canvas(pdfDom, {
        //     onrendered: function(canvas) {
        //         console.log('jaskldjglkasjdklgj');
        //         document.body.appendChild(canvas);
        //         let contentWidth = canvas.width;
        //         let contentHeight = canvas.height;
        //         let pageHeight = contentWidth / 592.28 * 841.89;
        //         let leftHeight = contentHeight;
        //         let position = 0;
        //         let imgWidth = 595.28;
        //         let imgHeight = 592.28 / contentWidth * contentHeight;
        //
        //         let pageData = canvas.toDataURL('image/jpeg', 1.0);
        //
        //         let PDF = new JsPDF('', 'pt', 'a4');
        //
        //         if (leftHeight < pageHeight) {
        //             PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        //         } else {
        //             while (leftHeight > 0) {
        //                 PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
        //                 leftHeight -= pageHeight;
        //                 position -= 841.89;
        //                 if (leftHeight > 0) {
        //                     PDF.addPage()
        //                 }
        //             }
        //         }
        //         PDF.saveAs('report.pdf')
        //     }
        // })
      },

      goTolist(){
        var self = this;
        console.log("go to list!");
        self.$router.push('/admin/adminQuestionnairelist');
      },
      getQuestionnaireInfo(qid){
        var self = this;
        self.$axios({
          url:'/question/getAlLQuestionaire',
          method:'get',
          baseURL:self.hostURL
        }).then((response)=>{
          for(let i=0;i<response.data.length;i++){
            if(response.data[i].id == qid){
              self.questionaireName = response.data[i].name;
              self.allNum = response.data[i].number;
            }
          }
          this.drawLine();
        }).catch((error)=>{
          self.$message({
            type:'info',
            message:'无法获取问卷，请重试'
          });
        });
        this.drawLine();
      },
      getAns(qid){
        this.$axios({
          url:'/question/getAnswers',
          method:'post',
          baseURL:this.hostURL,
          data:{
            q_id:qid
          }
        }).then((response)=>{
          this.answers=[];
          const apiAnswers = response.data
          for (let i=0;i<apiAnswers.length;i++){
            if(apiAnswers[i].type === 3){
              apiAnswers[i].con =[];
              for (let j=0;j<apiAnswers[i].ansContent.length;j++){
                apiAnswers[i].con.push(
                  {
                    cont:apiAnswers[i].ansContent[j]
                  }
                )
              }
            }
            else {
              apiAnswers[i].gswitch = true
            }
          }

          this.answers = apiAnswers
        }).catch((error)=>{
          this.$message({
            type:'info',
            message:'无法获取问卷作答情况，请重试'
          });
        });
        this.drawLine();
      },
      GSwitch(answer,$event){
        console.log($event);
        //console.log(answer.quesitonId);
        let mychart = echarts.init(document.getElementById(answer.quesitonId.toString()),'light');
        let option1 = {
          title: {},
          legend: {},
          tooltip: {
            trigger: 'item',
            formatter: "{b}<br />{c}"
          },
          toolbox: {
            show: true,
            feature: {
              // dataZoom: {
              //     yAxisIndex: 'none'
              // },
              dataView: {
                readOnly: true
              },
              saveAsImage: {}
            }
          },
          xAxis: {
            show: true,
            data: answer.choice
          },
          yAxis: {
            show: true
          },
          series: [{
            name: '选择人数',
            type: 'bar',
            data: answer.ansNum //number
          }]
        };
        let pieData =[];
        for (let j=0;j<answer.choice.length;j++){
          pieData.push({
            name: answer.choice[j],
            value: answer.ansNum[j]
          })
        }
        let option2 = {
          title : {},
          tooltip : {
            trigger: 'item',
            formatter: "{b}<br />{c} ({d}%)"
          },
          toolbox: {
            show: true,
            feature: {
              dataView: {
                readOnly: true
              },
              saveAsImage: {}
            }
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: answer.choice
          },
          xAxis: {
            show: false
          },
          yAxis: {
            show: false
          },
          series : [
            {
              name: '选择人数',
              type: 'pie',
              radius : '65%',
              center: ['50%', '50%'],
              data:pieData, //choice and number in name and value
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        if (!$event){
          // 绘制图
          mychart.setOption(option2);
        } else {
          // 绘制图
          mychart.setOption(option1);
        }

      },
      drawLine() {
        for (let i=0;i<this.answers.length;i++){
          if(this.answers[i].type === 1 || this.answers[i].type === 2){
            let mychart = echarts.init(document.getElementById(this.answers[i].quesitonId.toString()),'light');
            let option1 = {
              title: {},
              legend: {},
              tooltip: {trigger: 'axis'},
              toolbox: {
                show: true,
                feature: {
                  // dataZoom: {
                  //     yAxisIndex: 'none'
                  // },
                  dataView: {
                    readOnly: true
                  },
                  saveAsImage: {}
                }
              },

              xAxis: {
                data: this.answers[i].choice
              },
              yAxis: {},
              series: [{
                name: '选择人数',
                type: 'bar',
                data: this.answers[i].ansNum //number
              }]
            };
            // 绘制柱状图
            mychart.setOption(option1);
          }
        }
      }

    },

    mounted() {
      var tmp1 = location.href.split('?');
      this.qId = tmp1[1];
      if(this.qId){
        //this.answers = [];
        this.getAns(this.qId);
        this.getQuestionnaireInfo(this.qId);
      }
      this.getAns(this.qId);
      this.getQuestionnaireInfo(this.qId);
    },
  }
</script>

<style scoped>
  .crumbs{
    margin-bottom: 20px;
  }
  .refresh-btn{
    margin-top: -39px;
    margin-right: 20px;
    float: right;
    margin-bottom: 10px;
  }
  .questionnaire-box{
    padding: 28px;
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
  .questionnaire-info{
    font-size: 11px;
    color: #287D7C;
    line-height: 50px;
    font-weight: normal;
    display: block;
    text-align: center;
  }
  .question-type{
    color: #0066FF;
    font-weight: normal;
    font-size: 14px;
  }
</style>
