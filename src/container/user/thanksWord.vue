<template>
  <div class="user-thanks">
    <div class="user-thanks-box">
      <tab
        :line-width="2"
        prevent-default
        custom-bar-width="24px"
        @on-before-index-change="switchTabItem">
        <tab-item
          :selected="myThanksListIndex === index"
          v-for="(item, index) in tabList"
          :key="index"
        >{{item.label}}</tab-item>
      </tab>
    </div>
    <group
      class="container"
      id="userThanksPanel"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busyState"
      infinite-scroll-distance="20">
      <cell-box
        :key="index + actionTypes[myThanksListIndex]"
        v-for="(item, index) in myThanksList.data">
        <item-card
          class="item-card"
          :card-info="item"
          :is-self="isSelf"
          :index="$route.params.hash"
          :type="!!myThanksListIndex"
          :item-pic="myThanksListIndex === 0 ? item.from_user.pics : item.to_user.pics"></item-card>
      </cell-box>
      <cell-box
        v-show="!myThanksList.data.length && !myThanksList.nextPageUrl">
      </cell-box>
      <inline-loading
        v-show="myThanksList.currentPage !== 0 && isLoading[myThanksListIndex]">
      </inline-loading>
      <divider
        v-show="myThanksList.data.length && !myThanksList.nextPageUrl"
        class="g-divider p-divider">
        沒有更多了
      </divider>
      <oops
        v-show="!myThanksList.data.length && !myThanksList.nextPageUrl"
        oop-type="thanks"
        class="search-oops">
      </oops>
    </group>
  </div>
</template>

<script>
import { CellBox, Tab, TabItem, Divider } from 'vux'
import ItemCard from '@/components/UserThanksItemCard'
import infiniteScroll from 'vue-infinite-scroll'
import { mapState, mapMutations } from 'vuex'
import InlineLoading from '@/components/InlineLoading'
import Oops from '@/components/Oops'
import anchorMixin from '@/mixins/anchor'

export default {
  mixins: [anchorMixin],
  components: {
    CellBox,
    Tab,
    TabItem,
    ItemCard,
    InlineLoading,
    Divider,
    Oops
  },
  data () {
    return {
      tabList: [{
        label: '收到的感謝'
      }, {
        label: '發出的感謝'
      }],
      busy: [false, false],
      actionTypes: ['getToThanks', 'getFromThanks'],
      isLoading: [false, false]
    }
  },
  methods: {
    ...mapMutations({
      setMyThanksTabIndex: 'setMyThanksTabIndex'
      // resetOtherUserInfo: 'resetOtherUserInfo'
    }),
    // 切换tab
    switchTabItem (index) {
      if (this.myThanksListIndex !== index) {
        this.setMyThanksTabIndex({
          isSelf: this.isSelf,
          index
        })
        const node = document.getElementById('userThanksPanel')
        node.scrollTo(0, 0)
        this.$set(this.busy, this.myThanksListIndex, !this.myThanksList.nextPageUrl)
        if (!this.myThanksList.data.length) {
          this.loadMore()
        }
      }
    },
    // 滚动加载更多
    loadMore () {
      console.log(this.myThanksListIndex)
      if (!this.busy[this.myThanksListIndex] && this.myThanksList.nextPageUrl) {
        this.$set(this.busy, this.myThanksListIndex, true)
        // this.$vux.loading.show({
        //   text: '加載中...'
        // })
        this.$set(this.isLoading, this.myThanksListIndex, true)
        if (this.myThanksList.currentPage === 0) {
          this.$Loading.show()
        }
        const [actionType, userId, page, isSelf] = [
          this.actionTypes[this.myThanksListIndex],
          this.$route.params.hash,
          this.myThanksList.currentPage + 1,
          this.isSelf
        ]
        this.$store.dispatch(
          actionType, {
            userId,
            page,
            parentThanksId: 0,
            perPage: 20,
            cb: this.loadMoreCb,
            isSelf
          }
        )
      }
    },
    loadMoreCb () {
      if (this.myThanksList.currentPage === 1) {
        this.$Loading.hide()
      }
      this.$set(this.isLoading, this.myThanksListIndex, false)
      if (this.myThanksList.nextPageUrl) {
        this.$set(this.busy, this.myThanksListIndex, false)
      }
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.userInfo.id,
      // userId: state => state.thanks.userInfo.id,
      myToThanks: state => state.thanks.userInfo.myToThanks,
      otherUserToThanks: state => state.thanks.otherUserInfo.myToThanks,
      myFromThanks: state => state.thanks.userInfo.myFromThanks,
      otherUserFromThanks: state => state.thanks.otherUserInfo.myFromThanks,
      myThanksTabIndex: state => state.thanks.userInfo.myThanksTabIndex,
      otherUserThanksTabIndex: state => state.thanks.otherUserInfo.myThanksTabIndex
    }),
    myThanksList () {
      // return this.myThanksListIndex === 0 ? this.myToThanks : this.myFromThanks
      return this[`${this.isSelf ? 'my' : 'otherUser'}ThanksTabIndex`] === 0
        ? this[`${this.isSelf ? 'my' : 'otherUser'}ToThanks`]
        : this[`${this.isSelf ? 'my' : 'otherUser'}FromThanks`]
    },
    isSelf () {
      return (Number(this.userId) === Number(this.$route.params.hash))
    },
    myThanksListIndex () {
      return this.isSelf ? this.myThanksTabIndex : this.otherUserThanksTabIndex
    },
    busyState () {
      return this.busy[this.myThanksListIndex]
    }
  },
  directives: {
    infiniteScroll
  },
  beforeDestroy () {
    this.$Loading.hide()
  },
  mounted () {
    this.initAnchor('userThanksPanel')
  }
}
</script>

<style lang="less">
  .user-thanks{
    background: #FFF;
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
          .user-item-card{
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
  .user-thanks{
    height: 100%;
    text-align: left;
    line-height: 1;
    &-box{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 5;
      width: 100%;
      border-bottom: @pm-bg solid #FFF !important;
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
