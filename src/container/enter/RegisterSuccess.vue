<template>
  <div>
    <msg :title="'註冊成功'"
         :description="'驗證信已經發送到你填寫的E-mail囉！請於30分鐘內點擊信中的連結完成驗證：）'"
         :buttons="buttons"
         :icon="icon"></msg>
  </div>
</template>

<style lang="less">

</style>

<script>
import { Msg } from 'vux'
export default {
  components: {
    Msg
  },
  data () {
    return {
      icon: '',
      buttons: [{
        type: 'primary',
        text: '前往登入',
        link: '/login'
      }, {
        type: 'default',
        text: '前往首頁',
        link: '/'
      }]
    }
  }
}
</script>
