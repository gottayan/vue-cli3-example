<template>
  <user-base-info
    :user="user"
  >
  </user-base-info>
</template>

<script>
import UserBaseInfo from '@/components/UserBaseInfo'
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  components: {
    UserBaseInfo
  },
  computed: {
    ...mapState({
      user: state => state.user.otherUserInfo
    })
  },
  created () {
    // 初始化TA的禮物、需求等的管理
    const hash = this.$route.params.hash
    if (Number(hash) !== Number(this.user.id)) {
      this.resetOtherUserInfo()
    }
    this.getOtherUserInfo({hash})
  },
  methods: {
    ...mapActions({
      getOtherUserInfo: 'getOtherUserInfo'
    }),
    ...mapMutations({
      resetOtherUserInfo: 'resetOtherUserInfo'
    })
  }
}
</script>

<style lang="less">

</style>
