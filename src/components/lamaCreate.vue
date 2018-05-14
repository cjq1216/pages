<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i> 词条管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="isCreate">创建词条</el-breadcrumb-item>
        <el-breadcrumb-item v-else>编辑词条</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row>
      <el-button class="refresh-btn" type="danger" @click="cancel()">取消</el-button>
    </el-row>

    <el-form ref="form" :model="form">

      <el-form-item label="词条类别：" required>
        <el-radio-group v-model="form.classform.id">
          <el-radio border v-for="cla in form.classform" :label="cla.id">{{cla.className}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="词条名：" required>
        <el-input v-model="form.lama.termName"></el-input>
      </el-form-item>
      <el-form-item label="词条简述：" required>
        <el-input type="textarea" v-model="form.lama.termAbstract"></el-input>
      </el-form-item>
      <el-form-item label="词条内容：">
        <br/>
        <br/>
        <!--<el-input type="textarea" v-model="form.lama.termContent"></el-input>-->
        <!--<div>-->
        <!--<vue-wangeditor id="editor1" v-model="form.lama.termContent"></vue-wangeditor>-->
        <!--</div>-->

        <div id="editor">
          <p v-model="form.lama.termContent" id="Content"></p>
        </div>

      </el-form-item>

      <el-form-item>
        <el-button v-if="isCreate" type="primary" @click="submitFormCreate(form)">立即创建</el-button>
        <el-button v-else type="primary" @click="submitFormUpdate(form)">更新</el-button>
      </el-form-item>

    </el-form>


  </div>

</template>

<script>
  import E from 'wangeditor';
  export default {
    name: "lamaCreate",

    data: function () {
      return{
        isCreate:true,
        message: "",
        hostURL: '/VR',
        form: {
          lama: {
            id: '',
            termName: '',
            termAbstract: '',
            termContent: '',
          },
          classform: [
            {
              id: '1',
              className: '简介',
            },
            {
              id: '2',
              className: '发展',
            },
            {
              id: '3',
              className: '特征',
            },
          ],
        },

      }
    },

    methods:{
      submitFormCreate(formName) {
        console.log(formName.classform.id);
        console.log(formName.lama.id);
        console.log(formName.lama.termName);
        console.log(formName.lama.termAbstract);
        console.log(formName.lama.termContent);
        var self = this;
        self.$axios({
          url:'/wikipedia/createPediaTerm',
          method:'post',
          baseURL:self.hostURL,
          data:{
            c_id:formName.classform.id,
            l_name:formName.lama.termName,
            l_abstract:formName.lama.termAbstract,
            l_con:formName.lama.termContent,
          }
        }).then((response) => {
          var state = response.data;
          if (state == 0) {
            self.$message({
              type: 'error',
              message: '添加失败，请重试'
            })
          }
          else {
            self.$message({
              type: 'info',
              message: '添加成功'
            });
            console.log("go to pedialama!");
            self.$router.push('/admin/pedialama');
          }
        }).catch((error) => {
          self.$message({
            type: 'info',
            message: 'connect fail'
          });
        });
      },

      submitFormUpdate(formName) {
        console.log(formName.classform.id);
        console.log(formName.lama.id);
        console.log(formName.lama.termName);
        console.log(formName.lama.termAbstract);
        console.log(formName.lama.termContent);
        var self = this;
        self.$axios({
          url:'/wikipedia/updatePediaTerm',
          method:'post',
          baseURL:self.hostURL,
          data:{
            c_id:formName.classform.id,
            l_id:formName.lama.id,
            l_name:formName.lama.termName,
            l_abstract:formName.lama.termAbstract,
            l_con:formName.lama.termContent,
          }
        }).then((response) => {
          var state = response.data;
          if (state == 0) {
            self.$message({
              type: 'error',
              message: '更新失败，请重试'
            })
          }
          else {
            self.$message({
              type: 'info',
              message: '更新成功'
            });
            console.log("go to pedialama!");
            self.$router.push('/admin/pedialama');
          }
        }).catch((error) => {
          self.$message({
            type: 'info',
            message: 'connect fail'
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
          self.form.classform = [];
          for(var i=0;i<response.data.length;i++){
            self.form.classform.push({
              id:response.data[i].id,
              className:response.data[i].className,
            });
          }
        }).catch((error)=> {
          console.log(error);
        });
      },

      getLama(id){
        var self = this;
        //console.log(id);
        self.$axios({
          url: '/wikipedia/findTermById',
          method: 'post',
          baseURL: self.hostURL,
          data:{
            l_id: id,
          },
        }).then((response)=>{
          //console.log(response.data);
          self.form.lama = [];
          self.form.lama = response.data;
          self.isCreate = false;
          var insText = self.form.lama.termContent;
          console.log(insText);
          document.getElementById("Content").innerHTML = insText;
        }).catch((error)=>{
          self.$message({
            type:'info',
            message:'connect fail'
          });
        });
      },

      cancel(){
        var self = this;
        console.log("go to pedialama!");
        self.$router.push('/admin/pedialama');
      },

    },

    mounted(){
      var self = this;
      self.getClassList();

      var tmp1 = location.href.split('?');
      if (tmp1[1]){
        self.getLama(tmp1[1]);
      };
      var editor = new E(document.getElementById('editor'));
      editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'image',  // 插入图片
        'table',  // 表格
        'video',  // 插入视频
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ];
      editor.customConfig.onchange = (html) => {
        self.form.lama.termContent = html
      };
      editor.customConfig.pasteIgnoreImg = true;
      editor.create();
    },

  }
</script>

<style scoped>

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
