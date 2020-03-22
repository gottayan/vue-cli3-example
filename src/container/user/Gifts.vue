<template>
  <div class="user-gifts">
    <div class="user-gifts-box">
      <tab
        :line-width="2"
        prevent-default
        custom-bar-width="24px"
        @on-before-index-change="switchTabItem">
        <tab-item
          :selected="myGiftsItemsIndex === 0">
          一般贈送
        </tab-item>
        <tab-item
          :selected="myGiftsItemsIndex === 1">
          指定贈送
        </tab-item>
      </tab>
    </div>
    <group
      class="container"
      id="userGiftsPanel"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busyState"
      infinite-scroll-distance="20">
      <cell-box
        :key="index + actionTypes[myGiftsItemsIndex]"
        v-for="(item, index) in myGiftsItems.data">
        <item-card
          :pool-type="tabTypes[myGiftsItemsIndex]"
          :is-self="isSelf"
          :item-id="myGiftsItemsIndex === 0 ? item.id : item.need_id"
          :card-info="item"
          :marks="marks">
        </item-card>
      </cell-box>
      <cell-box
        v-show="!myGiftsItems.data.length && !myGiftsItems.nextPageUrl">
        <oops
          :oop-type="tabTypes[myGiftsItemsIndex]"
          class="search-oops">
        </oops>
      </cell-box>
      <inline-loading
        v-show="myGiftsItems.currentPage !== 0 && isLoading[myGiftsItemsIndex]">
      </inline-loading>
      <divider
        v-show="myGiftsItems.data.length && !myGiftsItems.nextPageUrl"
        class="g-divider p-divider">
        沒有更多了
      </divider>
    </group>
  </div>
</template>

<script>
import { CellBox, Tab, TabItem, Divider } from 'vux'
import Oops from '@/components/Oops'
import ItemCard from '@/components/UserItemCard'
import infiniteScroll from 'vue-infinite-scroll'
import { mapState, mapMutations, mapActions } from 'vuex'
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
    // 數據結構可換成對象
    return {
      busy: [false, false],
      actionTypes: ['getUserGifts', 'getUserNeedDonates'],
      tabTypes: ['gift', 'needDonate'],
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
  methods: {
    ...mapActions({
      getUserMarks: 'getUserMarks'
    }),
    ...mapMutations({
      resetPartOfUserInfo: 'resetPartOfUserInfo',
      setMyGiftsTabIndex: 'setMyGiftsTabIndex'
    }),
    // 切换tab
    switchTabItem (index) {
      if (this.myGiftsItemsIndex !== index) {
        this.setMyGiftsTabIndex({
          userId: this.$route.params.hash,
          index
        })
        const div = document.getElementById('userGiftsPanel')
        div.scrollTo(0, 0)
        this.$set(this.busy, this.myGiftsItemsIndex, !this.myGiftsItems.nextPageUrl)
        if (!this.myGiftsItems.data.length) {
          this.loadMore()
        }
      }
    },
    // 滚动加载更多
    loadMore () {
      if (!this.busy[this.myGiftsItemsIndex] && this.myGiftsItems.nextPageUrl) {
        this.$set(this.busy, this.myGiftsItemsIndex, true)
        // this.$vux.loading.show({
        //   text: '加載中...'
        // })
        this.$set(this.isLoading, this.myGiftsItemsIndex, true)
        if (this.myGiftsItems.currentPage === 0) {
          this.$Loading.show()
        }
        const [actionType, userId, page] = [
          this.actionTypes[this.myGiftsItemsIndex],
          this.$route.params.hash,
          this.myGiftsItems.currentPage + 1
        ]
        this.$store.dispatch(
          actionType, {
            page,
            userId,
            cb: this.loadMoreCb
          }
        )
      }
    },
    loadMoreCb () {
      // this.$vux.loading.hide()
      if (this.myGiftsItems.currentPage === 1) {
        this.$Loading.hide()
      }
      this.$set(this.isLoading, this.myGiftsItemsIndex, false)
      if (this.myGiftsItems.nextPageUrl) {
        this.$set(this.busy, this.myGiftsItemsIndex, false)
      }
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.userInfo.id,
      myGifts: state => state.user.userInfo.myGifts,
      otherUserGifts: state => state.user.otherUserInfo.myGifts,
      myGiftsTabIndex: state => state.user.userInfo.myGiftsTabIndex,
      otherUserGiftsTabIndex: state => state.user.otherUserInfo.myGiftsTabIndex,
      myNeedDonates: state => state.user.userInfo.myNeedDonates,
      otherUserNeedDonates: state => state.user.otherUserInfo.myNeedDonates,
      marks: state => state.user.marks
    }),
    myGiftsItems () {
      return this[`${this.isSelf ? 'my' : 'otherUser'}GiftsTabIndex`] === 0
        ? this[`${this.isSelf ? 'my' : 'otherUser'}Gifts`]
        : this[`${this.isSelf ? 'my' : 'otherUser'}NeedDonates`]
    },
    isSelf () {
      return (Number(this.userId) === Number(this.$route.params.hash))
    },
    myGiftsItemsIndex () {
      return this.isSelf ? this.myGiftsTabIndex : this.otherUserGiftsTabIndex
    },
    busyState () {
      return this.busy[this.myGiftsItemsIndex]
    }
  },
  directives: {
    infiniteScroll
  },
  mounted () {
    this.initAnchor('userGiftsPanel')
  }
}
</script>
<style lang="less">
  .user-gifts{
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
      // border-bottom: @pm-bg solid #FFF;
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
