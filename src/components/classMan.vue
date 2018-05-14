<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i> 词条管理</el-breadcrumb-item>
        <el-breadcrumb-item>类别管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row>
      <el-button class="refresh-btn" type="success" @click="getClassList()">刷新数据 </el-button>
    </el-row>

    <div>
      <h2>添加类别：</h2>
      <el-form :model="create" ref="create">
        <el-form-item prop="className">
          <el-input v-model="create.className" placeholder="类别名" style="width:300px"></el-input>
          <el-button type="primary" @click="createForm('create')">添加</el-button>
        </el-form-item>
      </el-form>
      <br/>
    </div>

    <template>
      <h2>类别管理：</h2>
      <el-table :data="classList" border style="width: 100% " max-height="500">

        <el-table-column prop="indexNum" label="类别 id" width="120"></el-table-column>
        <el-table-column prop="className" label="类别名"></el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template scope="scope">
            <el-button type="danger" @click.native.prevent="deleteClass(scope.$index, classList)" size="small">删除</el-button>
          </template>
        </el-table-column>


      </el-table>

    </template>

  </div>
</template>

<script>
  export default {
    name: "classMan",
    data: function () {
      return {
        msg: '',
        message: "",
        hostURL: '/VR',
        create:{className:""},
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
        ]
      }
    },

    methods: {

      createForm(formName){
        var self=this;
        var createData= {
          c_name:"",
        };
        createData.c_name=self.create.className;
        console.log(createData);
        self.$axios({
          url:'/wikipedia/createPediaClass',
          method:'post',
          baseURL:self.hostURL,
          data:createData
        }).then((response)=>{
          var state=response.data;
          if(state==0){
            self.$message({
              type:'error',
              message:'添加失败，请重试'
            })
          }
          else{
            self.$message({
              type:'info',
              message:'添加成功'
            });
            self.getClassList();
          }

        }).catch((error)=>{
          self.$message({
            type:'info',
            message:'connect fail'
          });
        });
      },

      deleteClass(index,pediaList){
        var self=this;
        var deleteData = {
          c_id:"",
        };
        deleteData.c_id=self.classList[index].id;
        console.log(deleteData);
        self.$axios({
          url:'/wikipedia/deletePediaClass',
          method:'post',
          baseURL:self.hostURL,
          data:deleteData
        }).then((response)=>{
          var state=response.data;
          if(state==0){
            self.$message({
              type:'error',
              message:'删除失败，请重试'
            })
          }
          else{
            self.$message({
              type:'info',
              message:'删除成功'
            });
            self.getClassList();
          }

        }).catch((error)=>{
          self.$message({
            type:'info',
            message:'connect fail'
          });
        });

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

    },
    mounted(){
      var self = this;
      self.getClassList();
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
    float: right;
    margin-bottom: 10px;
  }
</style>
