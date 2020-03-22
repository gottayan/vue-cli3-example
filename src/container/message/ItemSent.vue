<template>
  <ResultPage
    :menus="menus"
    :icon="SentIcon"
    type="sent_success"
    title="您的物品已經送出嘍~">
  </ResultPage>
</template>
<script>
import ResultPage from './../../components/ResultPage.vue'
import SentIcon from '@/assets/icon/gift/icon-sent-success.png'
export default {
  data () {
    return {
      menus: [
        {text: '完成', func: () => { this.$router.go(-1) }}
      ],
      SentIcon
    }
  },
  components: {
    ResultPage
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
