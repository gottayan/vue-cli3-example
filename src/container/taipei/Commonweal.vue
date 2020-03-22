<template>
  <div class="taipei-commonweal">
    <x-header title="公益一覽">
    </x-header>
    <div class="content g-smooth">
      <div class="pic-panel">
        <img
          src="https://d2hrw3sjxwwsb1.cloudfront.net/img/pic-banner/banner10.jpg"
          width="100%"
          height="auto"
          alt="pic">
      </div>
      <div
        class="commonweal-panel"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="20">
        <div
          :key="index"
          v-for="(user, index) in commonwealUser.data"
          class="member-card"
          @click="toUser(user.id)">
          <div class="avatar-wrapper">
            <img
              :src="user.pics || defaultAvatar"
              class="avatar"
              alt="avatar">
          </div>
          <div class="name">{{user.nickname || '無暱稱'}}</div>
        </div>
        <inline-loading v-show="commonwealUser.curPage !== 0 && isLoading">
        </inline-loading>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import defaultAvatar from '@/assets/icon/icon-default-avatar.png'
import infiniteScroll from 'vue-infinite-scroll'
import { local, KEY_USER_TOKEN } from '@/tools/storage'
import InlineLoading from '@/components/InlineLoading'

export default {
  directives: {
    infiniteScroll
  },
  components: {
    InlineLoading
  },
  data () {
    return {
      defaultAvatar,
      busy: false,
      isLoading: false
    }
  },
  created () {
    if (local.get(KEY_USER_TOKEN) && !this.userInfo.id) {
      this.getLoginUserInfo()
    }
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo',
      getCommonwealUser: 'getCommonwealUser'
    }),
    loadMore () {
      const {nextPageUrl, curPage} = this.commonwealUser
      if (nextPageUrl) {
        this.busy = true
        // this.$vux.loading.show({
        //   text: '加載中...'
        // })
        this.isLoading = true
        if (curPage === 0) {
          this.$Loading.show()
        }
        this.getCommonwealUser({
          page: curPage + 1,
          cb: this.loadMoreCb
        })
      }
    },
    loadMoreCb () {
      this.busy = false
      this.isLoading = false
      if (this.commonwealUser.curPage === 1) {
        this.$Loading.hide()
      }
      // this.$vux.loading.hide()
    },
    toUser (userId) {
      this.$router.push(this.userInfo.id === userId ? '/userinfo' : `/user/${userId}`)
    }
  },
  computed: {
    ...mapState({
      commonwealUser: state => state.commonweals.commonwealUser,
      userInfo: state => state.user.userInfo
    })
  }
}
</script>

<style lang="less" scoped>
  .taipei-commonweal{
    height: 100%;
    .content{
      height: calc(~"100% - 46px");
      overflow-y: scroll;
      .pic-panel{
        img{
          display: block;
        }
      }
      .commonweal-panel{
        display: flex;
        flex-wrap: wrap;
        padding: 15px 15px 0;
        margin: 0 auto;
        justify-content: space-between;
        max-width: 768px;
        .member-card{
          flex: 0 0 calc(~"(100% - 15px) / 2");
          display: flex;
          align-items: center;
          flex-direction: column;
          margin-bottom: @pm-bg;
          padding: @pm-bg;
          height: 168px;
          box-sizing: border-box;
          text-align: center;
          border-radius: 8px;
          overflow: hidden;
          background-color: #EBEBEB;
          .avatar-wrapper{
            position: relative;
            width: 50px;
            flex: 0 0 50px;
            border-radius: 50%;
            overflow: hidden;
            background-color: #FFF;
            .avatar{
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              margin: auto;
              max-width: 100%;
              max-height: 100%;
            }
          }
          .name{
            margin: @pm-md 0 @pm-sm;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            white-space:normal;
            word-break:break-all;
          }
        }
      }
    }
  }
</style>
