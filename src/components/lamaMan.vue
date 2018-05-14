<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i> 词条管理</el-breadcrumb-item>
        <el-breadcrumb-item>词条管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row>
      <el-button class="refresh-btn" type="success" @click="getLamaList()">刷新数据</el-button>
      <el-button class="refresh-btn" type="primary" @click="createLama()">创建词条</el-button>
    </el-row>

    <template>
      <h2>用户报错：</h2>
      <el-table :data="errorList" border style="width: 100% " max-height="300">
        <el-table-column prop="termName" label="词条名"></el-table-column>
        <el-table-column prop="errorContent" label="报错内容"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <el-button v-if="errorList[scope.$index].handleState===0" type="primary" @click.native.prevent="handleErr(scope.$index, errorList)" size="small">未读</el-button>
            <el-button v-else size="small" disabled>已读</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <br/>
    <template>
      <h2>词条管理：</h2>
      <el-table :data="lamaList" border style="width: 100% " max-height="500">
        <el-table-column prop="className" label="类别" width="120"></el-table-column>
        <el-table-column prop="termName" label="词条名"></el-table-column>
        <el-table-column prop="verifyState" label="审核状态" width="180"></el-table-column>
        <el-table-column prop="time" label="发布时间" width="210"></el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template scope="scope">
            <el-button @click.native.prevent="handleRowHandle(scope.$index, lamaList)" size="small">查看</el-button>
            <el-button type="primary" @click.native.prevent="editLama(scope.$index, lamaList)" size="small">编辑</el-button>
            <el-button type="danger" @click.native.prevent="deleteLama(scope.$index, lamaList)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="content_show">
        <br/>
        <h2 class="content_title"> 词条内容 </h2>
        <div style="margin-top:10px;border: 1px solid #A7C942;">
          <h2 class="content_subtitle">词条简述</h2>
          <p class="content_p" style="margin:10px;">{{ termAbstract }}</p>
          <h2 class="content_subtitle">词条正文</h2>
          <p id="content" class="content_p" style="margin:10px;"></p>
        </div>

        <br/>

        <div style="float:right">
          <el-button type="success" @click="open1">通过</el-button>
          <el-button type="danger" @click="open2">不通过</el-button>
        </div>
      </div>
    </template>

  </div>


</template>

<script>
  export default {
    name: "lamaMan",
    data: function () {
      return {
        msg: '',
        message: "",
        hostURL: '/VR',
        content_show: false,
        lamaList: [
          {
            cId:'1',
            className: "简介",
            id: '1',
            termName: "简介1",
            termAbstract:"简介1的简介",
            termContent:"简介1的内容",
            verifyState: 1,
            time: '2018-04-22 23:00:58',
          },
          {
            cId:'1',
            className: "简介",
            id: '2',
            termName: "简介2",
            termAbstract:"简介2的简介",
            termContent:"简介2的内容",
            verifyState: 0,
            time: '2018-04-22 23:01:36',
          },
        ],
        errorList:[
          {
            eId:'1',
            tId:'2',
            termName:'vr简介2',
            errorContent:'错误描述',
            userName:'abs',
            handleState:1
          },
          {
            eId:'2',
            tId:'1',
            termName:'vr简介1',
            errorContent:'错误描述1',
            userName:'abc',
            handleState:0
          },
        ]
      }
    },

    methods: {
      handleRowHandle(index, lamaList) {
        var self = this;
        //console.log(self.lamaList[index].termAbstract);
        this.termAbstract = self.lamaList[index].termAbstract;
        this.id = self.lamaList[index].id;
        this.termContent = self.lamaList[index].termContent;
        var insertText = this.termContent;
        document.getElementById("content").innerHTML = insertText;
        this.content_show = true;
      },

      handleErr(index, errorList) {
        var self = this;
        var deleteData = {
          error_id: "",
        };
        deleteData.error_id = self.errorList[index].eId;
        //console.log(deleteData);
        self.$axios({
          url: '/wikipedia/processPediaError',
          method: 'post',
          baseURL: self.hostURL,
          data: deleteData
        }).then((response) => {
          var state = response.data;
          if (state == 0) {
            self.$message({
              type: 'error',
              message: '处理失败，请重试'
            })
          }
          else {
            self.$message({
              type: 'info',
              message: '处理成功'
            });
            self.getLamaList();
          }

        }).catch((error) => {
          self.$message({
            type: 'info',
            message: 'connect fail'
          });
        });
      },

      editLama(index, lamaList){
        var self=this;
        console.log("go to adminPediaLamaEditor!");
        self.$router.push('/admin/pediaLamaCreater?'+self.lamaList[index].id);
      },

      createLama(){
        var self=this;
        console.log("go to adminPediaLamaCreater!");
        self.$router.push('/admin/pediaLamaCreater');
      },

      deleteLama(index, lamaList) {
        var self = this;
        var deleteData = {
          l_id: "",
        };
        deleteData.l_id = self.lamaList[index].id;
        //console.log(deleteData);
        self.$axios({
          url: '/wikipedia/deletePediaTerm',
          method: 'post',
          baseURL: self.hostURL,
          data: deleteData
        }).then((response) => {
          var state = response.data;
          if (state == 0) {
            self.$message({
              type: 'error',
              message: '删除失败，请重试'
            })
          }
          else {
            self.$message({
              type: 'info',
              message: '删除成功'
            });
            self.getLamaList();
          }
        }).catch((error) => {
          self.$message({
            type: 'info',
            message: 'connect fail'
          });
        });
      },

      open1() {      //审核通过按钮
        var self = this;
        var updateData = {l_id: '1',};
        updateData.l_id = self.id;
        //console.log(updateData);
        self.$axios({
          url: '/wikipedia/verifyTermState',
          method: 'post',
          baseURL: self.hostURL,
          data: updateData
        }).then((response) => {
          var state = response.data;
          if (state == 1) {
            self.$message({
              type: 'info',
              message: '审核通过'
            });
            self.getLamaList();
            self.content_show = false;
          }
          else {
            self.$message({
              type: 'info',
              message: '审核不通过'
            });
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      open2() {  //审核不通过按钮
        var self = this;
        self.getLamaList();
        self.content_show = false;
      },

      // getErrorList() {
      //   var self = this;
      //   self.$axios({
      //     url: '/wikipedia/findPediaError',
      //     method: 'get',
      //     baseURL: self.hostURL,
      //   }).then((response) => {
      //     self.errorList = [];
      //     self.errorList = response.data;
      //   }).catch((error) => {
      //     console.log(error);
      //   });
      // },

      getLamaList() {
        var self = this;
        self.$axios({
          url: '/wikipedia/findAllTerms',
          method: 'get',
          baseURL: self.hostURL,
        }).then((response) => {
          self.lamaList = [];
          for(var i=0;i<response.data.length;i++){
            if (response.data[i].verifyState === 1 ){
              self.lamaList.push({
                cId: response.data[i].cId,
                className: response.data[i].className,
                id: response.data[i].id,
                termName: response.data[i].termName,
                termAbstract: response.data[i].termAbstract,
                termContent: response.data[i].termContent,
                verifyState: '已通过',
                time: response.data[i].time,
              })
            } else {
              self.lamaList.push({
                cId: response.data[i].cId,
                className: response.data[i].className,
                id: response.data[i].id,
                termName: response.data[i].termName,
                termAbstract: response.data[i].termAbstract,
                termContent: response.data[i].termContent,
                verifyState: '未通过',
                time: response.data[i].time,
              })
            }
          }
        }).catch((error) => {
          console.log(error);
        });
        //console.log(self.lamaList);
        self.$axios({
          url: '/wikipedia/findPediaError',
          method: 'get',
          baseURL: self.hostURL,
        }).then((response) => {
          self.errorList = [];
          self.errorList = response.data;
          //console.log(self.errorList);
        }).catch((error) => {
          console.log(error);
        });
      },

    },

    mounted(){
      var self = this;
      //self.getErrorList();
      self.getLamaList();
    }

  }
</script>

<style>
  .content {
    float: left;
    width: 70%;
  }

  .content_title {
    text-align: center;
    text-transform: uppercase;
    color: #A7C942;
  }

  .content_subtitle {
    text-align: center;
    text-transform: uppercase;
  }

  .content_p {
    text-indent: 50px;
    text-align: justify;
    letter-spacing: 3px;
  }

  .pagination {
    margin-left: 50px;
  }

  .crumbs {
    text-decoration: none;
  }

  .refresh-btn{
    margin-top: -39px;
    margin-right: 20px;
    float: right;
    margin-bottom: 10px;
  }

</style>
