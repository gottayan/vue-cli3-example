<template>
  <div class="user-infos">
    <div class="title">
      個人介紹
    </div>
    <div class="infos" v-html="infos">
    </div>
  </div>
</template>

<script>
// import nl2br from 'nl2br'
import parseInfos from '@/tools/parseInfos'
import { mapState, mapActions } from 'vuex'
export default {
  created () {
    if (!this.otherUserInfo.id) {
      this.getOtherUserInfo({hash: this.$route.params.hash})
    }
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      return this.getLoginUserInfo()
    }
  },
  methods: {
    ...mapActions({
      getOtherUserInfo: 'getOtherUserInfo',
      getLoginUserInfo: 'getLoginUserInfo'
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      otherUserInfo: state => state.user.otherUserInfo
    }),
    isMySelf () {
      return this.userInfo.id === Number(this.$route.params.hash)
    },
    infos () {
      return parseInfos(this.isMySelf ? this.userInfo.infos : this.otherUserInfo.infos)
      // return nl2br(this.isMySelf ? this.userInfo.infos : this.otherUserInfo.infos)
    }
  }
}
</script>

<style lang="less" scoped>
  .user-infos{
    padding: @pm-bg;
    .title{
      font-size: 17px;
      font-weight: 700;
      color: #28292b;
    }
  }
</style>
