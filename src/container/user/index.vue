<template>
  <div class="user-container">
    <x-header
      @on-click-back="goBack"
      class="back-header"
      :title="$route.meta.title[isSelf ? 'self' : 'other']"
    >
    </x-header>
    <router-view>
    </router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {}
  },
  methods: {
    goBack () {
      this.$router.push('/userinfo')
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.userInfo.id
    }),
    isSelf () {
      return (Number(this.userId) === Number(this.$route.params.hash))
    }
  }
}
</script>

<style lang="less">
  .user-container{
    .weui-cells{
      &:after{
        display: none;
      }
    }
  }
</style>

<style lang="less" scoped>
  .user-container{
    background-color: @color-CBG;
    padding-top: 44px;
    height: 100%;
    .back-header{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 20;
    }
  }
</style>
