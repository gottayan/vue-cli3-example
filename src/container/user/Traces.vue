<template>
  <div class="userTraces-container">
    <div class="tab-panel">
      <tab :line-width="2" custom-bar-width="24px">
        <tab-item
          v-for="(tab, index) in userTraceNavList"
          :key="index"
          :selected="index === traceIdx"
          @on-item-click="(idx) => toggleTabItem(idx)">
          {{tab.text}}
        </tab-item>
      </tab>
    </div>
    <div class="panel">
        <div id="trackPanel" class="content">
          <template v-if="traceIdx === 0">
            <trace-base-item
              v-for="(item, idx) in gifts"
              :key="idx"
              :data="item"
              type="gift"
              class="container-trace-item"
              :handleCancelTrace="handleCancelTrace">
            </trace-base-item>
            <oops
              v-if="!items.length && !traceGiftsNextPageUrl"
              oop-type="gift"
              class="search-oops">
            </oops>
          </template>
          <template v-if="traceIdx === 1">
            <trace-base-item
              v-for="(item, idx) in items"
              :key="idx"
              :data="item"
              type="need"
              class="container-trace-item"
              :handleCancelTrace="handleCancelTrace">
            </trace-base-item>
            <oops
              v-if="!items.length && !traceNeedsNextPageUrl"
              oop-type="need"
              class="search-oops">
            </oops>
          </template>
          <template v-if="traceIdx === 2">
            <trace-user-item
              v-for="(item, idx) in users"
              :data="item"
              :handleCancelTrace="handleCancelTrace"
              :handleChatToUser="handleChatToUser"
              :key="idx"
              class="container-trace-item"
              type="user">
            </trace-user-item>
            <oops
              v-if="!items.length && !traceUsersNextPageUrl"
              oop-type="traceUser"
              class="search-oops">
            </oops>
          </template>
        </div>
    </div>
  </div>
</template>

<script>
import Oops from '@/components/Oops'
import TraceUserItem from '@/components/TraceUserItem'
import TraceBaseItem from '@/components/TraceBaseItem'
import { Tab, TabItem } from 'vux'
import { userTraceNavList } from '@/tools/constant'
import { mapState, mapActions, mapMutations } from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import anchorMixin from '@/mixins/anchor'

export default {
  mixins: [anchorMixin],
  directives: {
    infiniteScroll
  },
  components: {
    Tab,
    TabItem,
    TraceUserItem,
    TraceBaseItem,
    Oops
  },
  data () {
    return {
      userTraceNavList,
      type: ['gift', 'need', 'user'],
      busy: false
    }
  },
  computed: {
    ...mapState({
      traceUsers: state => state.user.userInfo.traceUsers.data,
      traceUsersNextPageUrl: state => state.user.userInfo.traceUsers.nextPageUrl,
      traceGifts: state => state.user.userInfo.traceGifts.data,
      traceGiftsNextPageUrl: state => state.user.userInfo.traceGifts.nextPageUrl,
      traceNeeds: state => state.user.userInfo.traceNeeds.data,
      traceNeedsNextPageUrl: state => state.user.userInfo.traceNeeds.nextPageUrl,
      traceIdx: state => state.user.userInfo.traceIdx
    }),
    users () {
      const traceUsers = this.traceUsers
      if (traceUsers.length) {
        return traceUsers.map(item => ({
          name: item.trace_user && (item.trace_user.nickname || '無暱稱'),
          id: item.trace_user_id,
          pics: item.trace_user && item.trace_user.pics,
          bonus: item.trace_user && item.trace_user.bonus,
          reviewsRate: item.trace_user && item.trace_user.reviews_rate,
          charitys: item.trace_user && item.trace_user.charitys
        }))
      }
      return traceUsers
    },
    gifts () {
      const traceGifts = this.traceGifts
      if (traceGifts.length) {
        return traceGifts.filter(item => item.gift).map(item => ({
          pics: item.gift.image_path,
          name: item.gift.user.nickname || '無暱稱',
          title: item.gift.title,
          count: item.gift.quantity,
          pulloff: item.gift.pull_off_at,
          id: item.gift_id,
          status: item.gift.status
        }))
      }
      return traceGifts
    },
    needs () {
      const traceNeeds = this.traceNeeds
      if (traceNeeds.length) {
        return traceNeeds.filter(item => item.need).map(item => ({
          pics: item.need.image_path,
          name: item.need.user.nickname || '無暱稱',
          title: item.need.title,
          count: item.need.need_items.map(child => child.quantity).reduce((pre, next) => pre + next),
          pulloff: item.need.pull_off_at,
          id: item.need_id,
          status: item.need.status
        }))
      }
      return traceNeeds
    },
    items () {
      let items = []
      switch (this.traceIdx) {
        case 0: items = this.gifts; break
        case 1: items = this.needs; break
        case 2: items = this.users; break
      }
      return items
    }
  },
  methods: {
    ...mapActions({
      unTraceThing: 'unTraceThing',
      getTraceThing: 'getTraceThing'
    }),
    ...mapMutations({
      setTraceIdx: 'setTraceIdx'
    }),
    toggleTabItem (idx) {
      this.setTraceIdx({idx})
      this.loadData(this.type[idx])
    },
    handleCancelTrace (type, id) {
      const userId = this.$route.params.hash
      this.unTraceThing({userId, type, id})
    },
    handleChatToUser (id, name) {
      this.$router.push(`/chatroom/${id}?type=user&directUserName=${name}`)
    },
    loadData (type) {
      if (!this.items.length) {
        this.$Loading.show()
        const userId = this.$route.params.hash
        this.getTraceThing({
          userId,
          type,
          cb: () => {
            this.$Loading.hide()
          }
        })
      }
    }
  },
  created () {
    this.loadData(this.type[this.traceIdx])
  },
  mounted () {
    this.initAnchor('trackPanel')
  }
}
</script>

<style lang="less">
  .userTraces-container{

    .weui-cells {
      margin-top: 0;
      .weui-cell {
        padding-left: 15px;
        padding-right: 15px;
        font-size: @font-S2;
        flex-direction: column;
        align-items: flex-start;
      }
      &:before {
        display: none;
      }
      &:after {
        width: 0;
        transition: width .4s;
      }
      &:hover {
        &:after {
          width: 100%;
          background-color: @color-CR;
          margin: 0 auto;
          height: 4px;
          bottom: -1px;
        }
      }
    }
    .vux-tab{
      box-sizing: content-box;
      .vux-tab-bar-inner{
        background: linear-gradient(to right, @color-font-CR 50%, @color-CO 50%)
      }
      .vux-tab-item{
        background: none;
        font-size: @font-S1;
        &.vux-tab-selected{
          color: @color-font-CR;
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .userTraces-container{
    height: 100%;
    background: #FFF;
    .tab-panel{
      position: fixed;
      top: 44px;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 44px;
    }
    .panel{
      margin-top: 44px;
      height: calc(~"100% - 44px");
      .content{
        overflow: scroll;
        height: 100%;
      }
    }
    .search-oops{
      padding-top: 100px;
    }
  }
</style>
