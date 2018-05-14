<template>
  <div class="question-input-container">
    <h3>添加{{getQuestionTypeDisplayName}}</h3>
    <div class="item-wrapper">
      <el-button @click="handleAddButtonClick">添加选项</el-button>
      <el-button type="danger" @click="handleQuestionDeleteButtonClick">删除题目</el-button>
    </div>
    <div class="item-wrapper">
      <el-input :value="this.value.e_title" @input="handleTitleChange" placeholder="请输入题干..." />
    </div>
    <template v-if="!isEssayType">
      <div class="sel-item-wrapper" v-for="item in this.value.e_sel" :key="item.id">
        <el-input class="sel-item-input" :value="item.value" @input="handleSelChange($event, item)" placeholder="请输入选项..." />
        <el-button type="danger" @click="handleDeleteButtonClick(item.id)">删除</el-button>
      </div>
    </template>
  </div>
</template>

<script>
  import nextId from '../utils/nextId'
  import { QUESTION_SINGLE, QUESTION_MULTIPLE, QUESTION_TEXT } from '../constants'

  export default {
    props: {
      value: Object,
    },
    computed: {
      getQuestionTypeDisplayName() {
        switch (this.value.e_type) {
          case QUESTION_SINGLE:
            return '单选题'
          case QUESTION_MULTIPLE:
            return '多选题'
          case QUESTION_TEXT:
            return '问答题'
          default:
            return '未知题目类型'
        }
      },
      isEssayType() {
        return this.value.e_type === QUESTION_TEXT
      },
    },
    methods: {
      handleSelChange(value, item) {
        const index = this.value.e_sel.findIndex((sel) => {
          return sel.id === item.id
        })
        if (index <= -1) {
          return
        }
        const newSel = [
          ...this.value.e_sel.slice(0, index),
          {
            ...this.value.e_sel[index],
            value,
          },
          ...this.value.e_sel.slice(index + 1)
        ]
        const newQuestion = {
          ...this.value,
          e_sel: newSel,
        }
        this.$emit('on-change', newQuestion)
      },
      handleTitleChange(value) {
        const newQuestion = {
          ...this.value,
          e_title: value,
        }
        this.$emit('on-change', newQuestion)
      },
      handleQuestionDeleteButtonClick() {
        this.$emit('on-delete', this.value.e_id)
      },
      handleAddButtonClick() {
        const newQuestion = {
          ...this.value,
          e_sel: [...this.value.e_sel, {
            id: nextId(),
            value: '',
          }],
        }
        this.$emit('on-change', newQuestion)
      },
      handleDeleteButtonClick(id) {
        const index = this.value.e_sel.findIndex((sel) => {
          return sel.id === id
        })
        if (index <= -1) {
          return
        }
        const newSel = [...this.value.e_sel.slice(0, index), ...this.value.e_sel.slice(index + 1)]
        const newQuestion = {
          ...this.value,
          e_sel: newSel,
        }
        this.$emit('on-change', newQuestion)
      }
    }
  }
</script>

<style scoped>
  .question-input-container {
    margin-bottom: 48px;
  }
  .item-wrapper {
    margin-bottom: 16px;
  }

  .sel-item-wrapper {
    display: flex;
    margin-bottom: 16px;
  }

  .sel-item-input {
    margin-right: 16px;
  }
</style>
