<template>
  <div class="user-info">
    <user-base-info
      :user="user"
      :isMyself="true"
    >
    </user-base-info>
  </div>
</template>

<script>
import { local, KEY_USER_TOKEN } from '@/tools/storage'
import UserBaseInfo from '@/components/UserBaseInfo'
import { mapState } from 'vuex'
import anchorMixin from '@/mixins/anchor'

export default {
  mixins: [anchorMixin],
  components: {
    UserBaseInfo
  },
  mounted () {
    if (!local.get(KEY_USER_TOKEN)) {
      this.$router.replace('/login?redirect=userinfo')
    }
    this.initAnchor('vux_view_box_body')
  },
  activated () {
    this.initAnchor('vux_view_box_body')
  },
  computed: {
    ...mapState({
      user: state => state.user.userInfo
    })
  }
}
</script>

<style lang="less" scoped>
  .user-info{
    height: 100%;
  }
</style>
