<template>
  <div class="container">
    <x-header title="常見問題"></x-header>
    <group gutter="0">
      <cell
        v-for="(item, index) in subNav"
        :key="index"
        :title="item.title"
        :link="item.link"></cell>
    </group>
    <div class="answer">
      <div class="title">沒有找到您的問題？</div>
      <div class="link"><router-link :to="{name:'Feedback'}">我要反饋</router-link></div>
    </div>
  </div>
</template>
<script>
import { Cell } from 'vux'
export default {
  components: {
    Cell
  },
  data () {
    return {
      subNav: [{
        title: 'Q:如何成為會員?',
        link: '/faq/becomeMember'
      }, {
        title: 'Q:如何上傳禮物？',
        link: '/faq/uploadGift'
      }, {
        title: 'Q:上架後如何把禮物送出？',
        link: '/faq/sendGift'
      }, {
        title: 'Q:如何索取禮物？',
        link: '/faq/demandGift'
      }, {
        title: 'Q:如何知道已成功獲贈禮物？',
        link: '/faq/successRecevieGift'
      }, {
        title: 'Q: 如何發佈需求？',
        link: '/faq/requestRequirement'
      }, {
        title: 'Q:如何針對需求贈送？',
        link: '/faq/requirementSend'
      }, {
        title: 'Q:平時如何與其他會員交流？',
        link: '/faq/memberExchange'
      }, {
        title: 'Q:如何管理禮物與需求？',
        link: '/faq/managerGiftRequirement'
      }]
    }
  }
}
</script>

<style lang="less" scoped>
.container{
  height: 3rem;
  color: @color-font-C1;

  .answer{
    margin-top: 6rem;
    text-align: center;
    .title{
      color: @color-font-C2;
      margin: @pm-bg 0;
    }
    .link a{
      color: @theme-color;
    }
  }
}
</style>
