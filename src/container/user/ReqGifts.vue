<template>
  <div class="user-gifts">
    <div class="user-gifts-box">
      <tab
        :line-width="2"
        prevent-default
        custom-bar-width="24px"
        @on-before-index-change="switchTabItem">
        <tab-item
          :key="index"
          v-for="(tab, index) in userReqGiftsNavList"
          :selected="requestsTabIndex === index">
          {{tab.text}}
        </tab-item>
      </tab>
    </div>
    <group
      class="container g-smooth"
      id="userReqContainer"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busyState"
      infinite-scroll-distance="20">
      <cell-box
        :key="index"
        @click.native="toGift(item.gift_id)"
        v-for="(item, index) in items.data">
        <item-card
          pool-type="gift"
          :item-id="item.gift_id"
          :card-info="item.gift"
          :time="item.created_at">
        </item-card>
      </cell-box>
      <cell-box
        v-show="!items.data.length && !items.nextPageUrl">
        <oops oop-type="gift" class="search-oops">
        </oops>
      </cell-box>
      <inline-loading
        v-show="items.currentPage !== 0 && isLoadingState">
      </inline-loading>
      <divider
        v-show="items.data.length && !items.nextPageUrl"
        class="g-divider p-divider">
        沒有更多了
      </divider>
    </group>
  </div>
</template>

<script>
import { CellBox, Tab,
  TabItem, Divider } from 'vux'
import Oops from '@/components/Oops'
import ItemCard from '@/components/UserItemCardRequest'
import infiniteScroll from 'vue-infinite-scroll'
import { userReqGiftsNavList } from '@/tools/constant'
import { mapState, mapMutations } from 'vuex'
import InlineLoading from '@/components/InlineLoading'
import anchorMixin from '@/mixins/anchor'

export default {
  mixins: [anchorMixin],
  components: {
    CellBox,
    Tab,
    TabItem,
    Oops,
    ItemCard,
    InlineLoading,
    Divider
  },
  data () {
    return {
      userReqGiftsNavList,
      busy: [false, false, false],
      isLoading: [false, false, false],
      tabs: ['索取中', '已獲贈', '未獲贈']
    }
  },
  created () {
  },
  methods: {
    ...mapMutations({
      setMyRequestsTabIndex: 'setMyRequestsTabIndex'
    }),
    // 禮物詳情
    toGift (id) {
      this.$router.push(`/gift/${id}`)
    },
    // 切换tab
    switchTabItem (index) {
      if (this.requestsTabIndex !== index) {
        const div = document.getElementById('userReqContainer')
        div.scrollTo(0, 0)
        this.setMyRequestsTabIndex({userId: this.$route.params.hash, index})
        this.$set(this.busy, this.requestsTabIndex, !this.items.nextPageUrl)
        if (!this.requestsItems[this.requestsTabIndex].data.length) {
          this.loadMore()
        }
      }
    },
    // 滚动加载更多
    loadMore () {
      if (!this.busy[this.requestsTabIndex] && this.items.nextPageUrl) {
        this.$set(this.busy, this.requestsTabIndex, true)
        const curPage = this.items.currentPage
        if (curPage === 0) {
          this.$Loading.show()
        }
        this.$set(this.isLoading, this.requestsTabIndex, true)
        const [actionType, userId, page, status, index] = [
          'getUserRequests',
          this.$route.params.hash,
          curPage + 1,
          this.userReqGiftsNavList[this.requestsTabIndex].status,
          this.requestsTabIndex
        ]
        this.$store.dispatch(actionType, {page, userId, status, index, cb: this.loadMoreCb})
      }
    },
    loadMoreCb () {
      const curPage = this.items.currentPage
      if (curPage === 1) {
        this.$Loading.hide()
      }
      this.$set(this.isLoading, this.requestsTabIndex, false)
      if (this.items.nextPageUrl) {
        this.$set(this.busy, this.requestsTabIndex, false)
      }
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.userInfo.id,
      myRequests: state => state.user.userInfo.myRequests,
      otherUserRequests: state => state.user.otherUserInfo.myRequests,
      myRequestsTabIndex: state => state.user.userInfo.myRequestsTabIndex,
      otherUserRequestsTabIndex: state => state.user.otherUserInfo.myRequestsTabIndex
    }),
    requestsItems () {
      const isSelf = (Number(this.userId) === Number(this.$route.params.hash))
      return isSelf ? this.myRequests : this.otherUserRequests
    },
    requestsTabIndex () {
      const isSelf = (Number(this.userId) === Number(this.$route.params.hash))
      return isSelf ? this.myRequestsTabIndex : this.otherUserRequestsTabIndex
    },
    items () {
      return this.requestsItems[this.requestsTabIndex]
    },
    busyState () {
      return this.busy[this.requestsTabIndex]
    },
    isLoadingState () {
      return this.isLoading[this.requestsTabIndex]
    }
  },
  directives: {
    infiniteScroll
  },
  mounted () {
    this.initAnchor('userReqContainer')
  }
}
</script>
<style lang="less">
  .user-gifts{
    &-box{
      padding-top: 46px;
      .vux-x-input{
        padding: 0 50px 0 @pm-bg;
        margin-bottom: 10px;
        background: #FFF;
        .weui-input{
          height: 50px;
        }
      }
      .vux-tab{
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
    .weui-cells{
      margin: 0;
      border-bottom: none;
      .weui-cell{
        padding: 0;
        &:after{
          border-bottom: none;
        }
        &:nth-child(1){
          .item{
            border: none;
          }
        }
        &:before{
          display:none;
        }
        &:nth-last-child(4){
          .item-card{
            &:after{
              display: none;
            }
          }
        }
      }
      &:after{
        border: none;
      }
      &:hover:after{
        height: 0;
      }
    }
  }
</style>
<style lang="less" scoped>
  .user-gifts{
    height: 100%;
    text-align: left;
    line-height: 1;
    background: #FFF;
    &-box{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      border-bottom: @pm-bg solid #FFF;
      background: @color-CBG;
    }
    .container{
      max-height: 100%;
      overflow-y: scroll;
      padding-top: 55px;
      .search-oops{
        margin: 100px auto 0;
      }
    }
  }
</style>
