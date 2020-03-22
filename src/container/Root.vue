<template>
  <view-box ref="viewBox">
    <transition name="slide-fade" mode="out-in">
      <router-view>
      </router-view>
    </transition>
    <tabbar class="root" slot="bottom">
      <tabbar-item :link="{path: '/', replace: true}" :selected="tabIndex === 0">
        <img slot="icon" src="./../assets/icon/navbar/icon-home.png" />
        <img slot="icon-active" src="./../assets/icon/navbar/icon-home-selected.png" />
        <span slot="label">首頁</span>
      </tabbar-item>
      <tabbar-item :link="{path: '/gifts', replace: true}" :selected="tabIndex === 1">
        <img slot="icon" src="./../assets/icon/navbar/icon-gift.png" />
        <img slot="icon-active" src="./../assets/icon/navbar/icon-gift-selected.png" />
        <span slot="label">禮物</span>
      </tabbar-item>
      <tabbar-item :link="{path: '/needs', replace: true}" :selected="tabIndex === 2">
        <img slot="icon" src="./../assets/icon/navbar/icon-need.png" />
        <img slot="icon-active" src="./../assets/icon/navbar/icon-need-selected.png" />
        <span slot="label">需求</span>
      </tabbar-item>
      <tabbar-item :link="{path: '/message', replace: true}" :selected="tabIndex === 3">
        <img slot="icon" src="./../assets/icon/navbar/icon-message.png" />
        <img slot="icon-active" src="./../assets/icon/navbar/icon-message-selected.png" />
        <span slot="label">
          訊息
          <badge v-if="msgStatus.conversations || msgStatus.messages" class="red-dot">
          </badge>
        </span>
      </tabbar-item>
      <tabbar-item :link="{path: '/userinfo', replace: true}" :selected="tabIndex === 4">
        <img slot="icon" src="./../assets/icon/navbar/icon-me.png" />
        <img slot="icon-active" src="./../assets/icon/navbar/icon-me-selected.png" />
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
   </view-box>
</template>

<script>
import { Tabbar, TabbarItem, ViewBox, Badge } from 'vux'
import { mapState, mapActions } from 'vuex'
import { local, KEY_USER_TOKEN } from '@/tools/storage'

export default {
  components: {
    ViewBox,
    Tabbar,
    TabbarItem,
    Badge
  },
  data () {
    return {
      tabIndex: 0
    }
  },
  created () {
    // 轮询获取讯息状态
    const token = local.get(KEY_USER_TOKEN)
    // 重新打開網頁時清除輪詢定時器
    let localReadInterval = local.get('READ_INTERVAL', true)
    if (localReadInterval) {
      window.clearInterval(localReadInterval)
      localReadInterval = null
    }
    if (token) {
      const readInterval = setInterval(() => {
        this.getMessageStatus()
      }, 30 * 1000)
      local.save('READ_INTERVAL', readInterval)
    }
  },
  methods: {
    ...mapActions({
      getMessageStatus: 'getMessageStatus'
    }),
    changeTabItem () {
      switch (this.$route.path) {
        case '/': this.tabIndex = 0; break
        case '/gifts': this.tabIndex = 1; break
        case '/needs': this.tabIndex = 2; break
        case '/message': this.tabIndex = 3; break
        case '/userinfo': this.tabIndex = 4; break
      }
    }
  },
  watch: {
    '$route' (to, from) {
      this.changeTabItem()
    }
  },
  mounted () {
    this.changeTabItem()
  },
  computed: {
    ...mapState({
      msgStatus: state => state.messages.msgStatus
    })
  }
}
</script>

<style lang="less">
  .root{
    .weui-tabbar__item{
      position: relative;
      .red-dot{
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(8px);
        background: @color-CR;
      }
    }
  }
</style>
