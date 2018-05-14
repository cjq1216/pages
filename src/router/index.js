import Vue from 'vue'
import Router from 'vue-router'
import adminQuestList from '@/components/adminQuestList'
import QusetDetial from '@/components/QuestDetial'
import home from '@//components/home'
import creater from '@//components/creater'
import analyze from '@//components/analyze'
import classMan from '@//components/classMan'
import lamaMan from '@//components/lamaMan'
import lamaCreate from '@//components/lamaCreate'
import searchHome from '@//components/searchhome'
import searchResult from '@//components/searchresult'
import questList from '@//components/questList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: home
    },
    {
      path: '/adminQuestList',
      component: adminQuestList
    },
    {
      path: '/questList',
      component: questList
    },
    {
      path: '/qusetDetial',
      component: QusetDetial
    },
    {
      path: '/creater',
      component: creater
    },
    {
      path: '/analyze',
      component: analyze
    },
    {
      path: '/classMan',
      component: classMan
    },
    {
      path: '/lamaMan',
      component: lamaMan
    },
    {
      path: '/lamaCreate',
      component: lamaCreate
    },
    {
      path: '/searchHome',
      component: searchHome
    },
    {
      path: '/searchResult',
      component: searchResult
    },
  ]
})
