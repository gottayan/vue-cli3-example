<template>
  <div class="donate-all">
    <x-header title="合併寄送">
    </x-header>
    <div class="container">
      <group
        class="content-wrapper g-smooth"
        id="donateIndexPanel"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10">
        <div
          v-if="!isFirstLoading && !isLoading && !items.length"
          class="oops">
          暫無相關資料
        </div>
        <div v-if="mergeList.total">
          <cell-box
            :key="index"
            v-for="(item, index) in items">
            <item-card
              :card-info="item"
              poolType="gift"
              :item-id="item.gift && item.gift.id">
            </item-card>
          </cell-box>
        </div>
        <inline-loading
          v-show="curPage !== 0 && isLoading">
        </inline-loading>
        <divider
          v-show="!isFirstLoading && !isLoading && items.length && !nextPageUrl"
          class="g-divider p-divider">
          沒有更多了
        </divider>
      </group>
    </div>
  </div>
</template>

<script>
import { Group, CellBox, Divider } from 'vux'
import ItemCard from '@/components/merge/MergeItemCard'
import {mapActions, mapState} from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import InlineLoading from '@/components/InlineLoading'
import anchorMixin from '@/mixins/anchor'
import mergeMixin from '@/mixins/merge'

export default {
  mixins: [anchorMixin, mergeMixin],
  directives: {
    infiniteScroll
  },
  components: {
    ItemCard,
    Group,
    CellBox,
    InlineLoading,
    Divider
  },
  data () {
    return {
      busy: false,
      isLoading: false,
      isFirstLoading: false
    }
  },
  created () {
    // 获取私人笔记
    if (!this.marks['WHITE'].curPage) {
      this.getUserMarks({type: 'WHITE'})
    }
    if (!this.marks['BLACK'].curPage) {
      this.getUserMarks({type: 'BLACK'})
    }
  },
  methods: {
    ...mapActions({
      getUserMarks: 'getUserMarks',
      getMergeList: 'getMergeList'
    }),
    loadMore () {
      const busy = this.busy
      if (!busy) {
        if (this.curPage === 0) {
          this.$Loading.show()
          this.isFirstLoading = true
        } else {
          this.isLoading = true
        }
        this.busy = true
        this.getMergeList({
          page: this.curPage + 1,
          perPage: 15,
          cb: this.loadMoreCb
        })
      }
    },
    loadMoreCb (data) {
      if (this.curPage === 1) {
        this.$Loading.hide()
        this.isFirstLoading = false
      }
      this.isLoading = false
      if (this.nextPageUrl) {
        this.busy = false
      }
    }
  },
  computed: {
    ...mapState({
      marks: state => state.user.marks,
      mergeList: state => state.deals.mergeList
    }),
    curPage () {
      return this.mergeList.curPage
    },
    nextPageUrl () {
      return this.mergeList.nextPageUrl
    },
    items () {
      return this.mergeList.data
    }
  },
  activated () {
    this.initAnchor('donateIndexPanel')
  }
}
</script>

<style lang="less">
  .donate-all{
    .box{
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
    .container{
      .weui-cells{
        padding: 0;
        margin: 0;
        &:before, &:after{
          display: none;
        }
        .weui-cell{
          padding: 0;
          &:nth-last-child(3){
            .req-item-card{
              &:after{
                display: none;
              }
            }
          }
          &:before, &:after{
            display: none;
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .donate-all{
    height: 100%;
    .vux-header-right {
      > div {
        > a {
          font-size: 16px;
          line-height: 40px;
          color: #fff;
        }
      }
    }
    .container{
      padding: 0 @pm-bg;
      height: calc(~"100% - 44px");
      .content-wrapper{
        height: 100%;
        overflow-y: scroll;
        .oops{
          margin-top: 100px;
          color: @color-font-C2;
          font-size: @font-S3;
          text-align: center;
        }
        .p-divider{
          padding: @pm-bg 0 !important;
        }
      }
    }
  }
</style>
