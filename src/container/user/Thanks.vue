<template>
  <div class="user-gifts">
    <div class="user-gifts-box">
      <tab
        :line-width="2"
        prevent-default
        custom-bar-width="24px"
        @on-before-index-change="switchTabItem">
        <tab-item
          :selected="myThanksItemsIndex === 0">
          收到的感謝
        </tab-item>
        <tab-item
          :selected="myThanksItemsIndex === 1">
          發出的感謝
        </tab-item>
      </tab>
    </div>
    <group
      class="container g-smooth"
      id="userThanksPanel"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busyState"
      infinite-scroll-distance="20">
      <cell-box
        :key="index + actionTypes[myThanksItemsIndex]"
        v-for="(item, index) in myThanksItems.data">
        <!-- <item-card
          :pool-type="tabTypes[myThanksItemsIndex]"
          :is-self="isSelf"
          :item-id="myThanksItemsIndex === 0 ? item.id : item.need_id"
          :card-info="item"
          :marks="marks">
        </item-card> -->
          <item-card :card-info="item"></item-card>
      </cell-box>
      <cell-box
        v-show="!myThanksItems.data.length && !myThanksItems.nextPageUrl">
      </cell-box>
      <inline-loading
        v-show="myThanksItems.currentPage !== 0 && isLoading[myThanksItemsIndex]">
      </inline-loading>
      <divider
        v-show="myThanksItems.data.length && !myThanksItems.nextPageUrl"
        class="g-divider p-divider">
        沒有更多了
      </divider>
    </group>
  </div>
</template>

<script>
import { CellBox, Tab, TabItem, Divider } from 'vux'
import ItemCard from '@/components/UserThanksItemCard'
import infiniteScroll from 'vue-infinite-scroll'
import { mapState, mapMutations, mapActions } from 'vuex'
import InlineLoading from '@/components/InlineLoading'

export default {
  components: {
    CellBox,
    Tab,
    TabItem,
    ItemCard,
    InlineLoading,
    Divider
  },
  data () {
    // 數據結構可換成對象
    return {
      busy: [false, false],
      actionTypes: ['getToThanks', 'getFromThanks'],
      // tabTypes: ['gift', 'needDonate'],
      isLoading: [false, false]
    }
  },
  created () {
    if (this.isSelf) {
      if (!this.marks['WHITE'].curPage) {
        this.getUserMarks({type: 'WHITE'})
      }
      if (!this.marks['BLACK'].curPage) {
        this.getUserMarks({type: 'BLACK'})
      }
    }
  },
  mounted () {
    console.log(this.myThanksItems)
  },
  methods: {
    ...mapActions({
      getFromThanks: 'getFromThanks',
      getToThanks: 'getToThanks'
    }),
    ...mapMutations({
      setMyThanksTabIndex: 'setMyThanksTabIndex',
      resetPartOfUserInfo: 'resetPartOfUserInfo'
    }),
    // 禮物詳情
    toGift (id) {
      this.$router.push(`/gift/${id}`)
    },
    // 需求詳情
    toNeed (id) {
      this.$router.push(`/need/${id}`)
    },
    // 切换tab
    switchTabItem (index) {
      if (this.myThanksItemsIndex !== index) {
        this.setMyThanksTabIndex({
          userId: this.$route.params.hash,
          index
        })
        const div = document.getElementById('userThanksPanel')
        div.scrollTo(0, 0)
        this.$set(this.busy, this.myThanksItemsIndex, !this.myThanksItems.nextPageUrl)
        if (!this.myThanksItems.data.length) {
          this.loadMore()
        }
      }
    },
    // 滚动加载更多
    loadMore () {
      if (!this.busy[this.myThanksItemsIndex] && this.myThanksItems.nextPageUrl) {
        this.$set(this.busy, this.myThanksItemsIndex, true)
        // this.$vux.loading.show({
        //   text: '加載中...'
        // })
        this.$set(this.isLoading, this.myThanksItemsIndex, true)
        if (this.myThanksItems.currentPage === 0) {
          this.$Loading.show()
        }
        const [actionType, userId, page] = [
          this.actionTypes[this.myThanksItemsIndex],
          this.$route.params.hash,
          this.myThanksItems.currentPage + 1
        ]
        this.$store.dispatch(
          actionType, {
            userId,
            page,
            parentThanksId: 0,
            perPage: 20,
            cb: this.loadMoreCb
          }
        )
      }
    },
    loadMoreCb () {
      // this.$vux.loading.hide()
      if (this.myThanksItems.currentPage === 1) {
        this.$Loading.hide()
      }
      this.$set(this.isLoading, this.myThanksItemsIndex, false)
      if (this.myThanksItems.nextPageUrl) {
        this.$set(this.busy, this.myThanksItemsIndex, false)
      }
    }
  },
  computed: {
    ...mapState({
      userId: state => state.thanks.userInfo.id,
      myThanks: state => state.thanks.userInfo.myThanks,
      otherUserThanks: state => state.thanks.otherUserInfo.myThanks,
      myThanksTabIndex: state => state.thanks.userInfo.myThanksTabIndex,
      otherUserThanksTabIndex: state => state.thanks.otherUserInfo.myThanksTabIndex,
      myFromThanks: state => state.thanks.userInfo.myFromThanks,
      otherUsermyFromThanks: state => state.thanks.otherUserInfo.myFromThanks
    }),
    myThanksItems () {
      return this[`${this.isSelf ? 'my' : 'otherUser'}ThanksTabIndex`] === 0
        ? this[`${this.isSelf ? 'my' : 'otherUser'}Thanks`]
        : this[`${this.isSelf ? 'my' : 'otherUser'}FromThanks`]
    },
    isSelf () {
      return (Number(this.userId) === Number(this.$route.params.hash))
    },
    myThanksItemsIndex () {
      return this.isSelf ? this.myThanksTabIndex : this.otherUserThanksTabIndex
    },
    busyState () {
      return this.busy[this.myThanksItemsIndex]
    }
  },
  directives: {
    infiniteScroll
  }
}
</script>
<style lang="less">
  // .container  {
  //   .weui-cells {
  //     // padding-top: 4px;
  //   }
  // }
  .user-gifts{
    background: #FFF;
    // overflow: hidden;
    &-box{
      padding-top: 46px;
      // overflow: hidden;
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
  .user-gifts{
    height: 100%;
    text-align: left;
    line-height: 1;
    &-box{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 5;
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
