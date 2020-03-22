<template>
  <div class="request-some">
    <x-header :title="title">
      <!-- <a v-if="isCheckboxShow" @click="handleMerge" slot="right">{{mergeSelete ? '取消' : '合併'}}</a> -->
    </x-header>
    <div class="box">
      <tab
        :line-width="2"
        prevent-default
        custom-bar-width="24px"
        @on-before-index-change="switchTabItem">
        <tab-item :selected="curIdx === 0">
          禮物（{{giftTotal}}）
        </tab-item>
        <tab-item :selected="curIdx === 1">
          需求（{{needTotal}}）
        </tab-item>
      </tab>
    </div>
    <div class="container mescroll">
      <group
        class="content-wrapper mescroll"
        id="requestStatusPanel"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10">
        <div
          v-if="!demands[type[curIdx]].data.length && !nextPageUrl"
          class="oops">
          暫無相關資料
        </div>
        <cell-box
          :key="index"
          v-for="(item, index) in filterData">
          <item-card
            :index="index"
            @handleCheck="handleCheck"
            :mergeSelete="mergeSelete"
            :currentValue="currentValue"
            :currentCheckbox="currentCheckbox"
            :pool-type="type[curIdx]"
            :card-info="item"
            :item-id="item[type[curIdx]] && item[type[curIdx]].id">
          </item-card>
        </cell-box>
        <inline-loading v-show="curPage !== 0 && isLoading">
        </inline-loading>
        <divider
          v-show="demands[type[curIdx]].data.length && !nextPageUrl"
          class="g-divider p-divider">
          沒有更多了
        </divider>
      </group>
      <MergeBottom
      action="request"
      :mergeSelete="mergeSelete"
      :currentValue="currentValue"
      :handleSubmitMerge="handleSubmitMerge"
     />
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Group, CellBox, Divider } from 'vux'
import ItemCard from '@/components/deals/ReqItemCard'
import {mapActions, mapState, mapMutations} from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import InlineLoading from '@/components/InlineLoading'
import anchorMixin from '@/mixins/anchor'
import MergeBottom from '@/components/merge/Bottom'
import mergeMixin from '@/mixins/merge'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'

export default {
  mixins: [anchorMixin, mergeMixin],
  directives: {
    infiniteScroll
  },
  props: {
    status: {
      type: String,
      default: ''
    }
  },
  components: {
    Tab,
    TabItem,
    ItemCard,
    Group,
    CellBox,
    InlineLoading,
    Divider,
    MergeBottom
  },
  data () {
    return {
      type: ['gift', 'need'],
      needTotal: 0,
      giftTotal: 0,
      gift: {
        isLoading: false,
        busy: false
      },
      need: {
        isLoading: false,
        busy: false
      },
      mergeGiftTotal: 0,
      mescroll: null
    }
  },
  created () {
    this.getTotalCount()
  },
  mounted () {
    this.mescroll = new MeScroll('requestStatusPanel', {
      down: {
        callback: this.downRefreshCallback,
        auto: false,
        outOffset: (mescroll) => {
          if (mescroll.downTipDom) {
            mescroll.downTipDom.innerHTML = '下拉放開立即更新'
          }
        },
        showLoading: (mescroll) => {
          if (mescroll.downTipDom) {
            mescroll.downTipDom.innerHTML = '加載中 ...'
          }
          if (mescroll.downProgressDom) {
            mescroll.downProgressDom.classList.add('mescroll-rotate')
          }
        }
      }
    })
  },
  beforeDestroy () {
    this.resetDeals()
  },
  methods: {
    ...mapActions({
      getMyDemands: 'getMyDemands',
      getDemandTotal: 'getDemandTotal',
      getDealsCategory: 'getDealsCategory',
      dealMerge: 'dealMerge'
    }),
    ...mapMutations({
      resetDeals: 'resetDeals',
      setDemandsCurIdx: 'setDemandsCurIdx',
      resetSectionDeals: 'resetSectionDeals'
    }),
    switchTabItem (index) {
      if (index !== this.curIdx) {
        const div = document.getElementById('requestStatusPanel')
        div.scrollTo(0, 0)
        const status = this.status
        this.setDemandsCurIdx({status, index})
      }
      if (this.curPage === 0 && this.nextPageUrl) {
        const isToGet = (this.type[this.curIdx] === 'need' && !this.needTotal) ||
          (this.type[this.curIdx] === 'gift' && !this.giftTotal)
        if (isToGet) {
          return
        }
        this.loadMore()
      }
      this.setDefaultSelect()
    },
    loadMore () {
      if (!this.isNotGetCategory) {
        return this.toLoad()
      }
      this.getDealsCategory({
        cb: this.toLoad
      })
    },
    toLoad () {
      const status = this.status
      if (this.nextPageUrl && this.giftRequest[`${status}_total`]) {
        this[this.type[this.curIdx]].busy = true
        this[this.type[this.curIdx]].isLoading = true
        if (this.curPage === 0) {
          this.$Loading.show()
        }
        if (this.type[this.curIdx] === 'gift') {
          this.getMyDemands({
            status,
            page: this.curPage + 1,
            cb: this.loadMoreCb
          })
        } else {
          this.getMyDemands({
            status,
            page: this.curPage + 1,
            type: 'present',
            cb: this.loadMoreCb
          })
        }
      }
    },
    loadMoreCb (obj) {
      if (this.curPage === 1) {
        this.setDefaultSelect()
        this.$Loading.hide()
      }
      if (obj.error) {
        this.mescroll.endErr()
      } else {
        this.mescroll.endSuccess()
      }
      this[this.type[this.curIdx]].isLoading = false
      if (this.nextPageUrl) {
        this[this.type[this.curIdx]].busy = false
      }
    },
    downRefreshCallback () {
      this.getTotalCount()
      const status = this.status
      const type = this.type[this.curIdx]

      this[type].busy = true
      this[type].isLoading = true

      if (type === 'gift') {
        this.getMyDemands({
          status,
          page: 1,
          cb: this.loadMoreCb
        })
      } else {
        this.getMyDemands({
          status,
          page: 1,
          type: 'present',
          cb: this.loadMoreCb
        })
      }
    },
    getTotalCount () {
      const status = this.status
      this.getDemandTotal({
        status,
        cb: (data) => {
          this.needTotal = data
        }
      })
      this.getDemandTotal({
        status,
        type: 'present',
        cb: (data) => {
          this.giftTotal = data
        }
      })
    }
  },
  computed: {
    ...mapState({
      demandsAll: state => state.deals.demands,
      giftRequest: state => state.deals.category.gift_request
    }),
    demands () {
      const status = this.status
      return this.demandsAll[status]
    },
    filterData () {
      /* eslint-disable */
      let data = this.demands[this.type[this.curIdx]].data
      if (this.status === 'finished') {
        if (this.curIdx === 0) {
          data = data.filter(v => !v.children.every(w => w.status === 'thanks'))
            .concat(data.filter(v => !v.children.length))
          this.giftTotal = data.length
          return data
        }
      }
      return data
    },
    curIdx () {
      return this.demands.curIdx
    },
    curPage () {
      return this.demands[this.type[this.curIdx]].curPage
    },
    nextPageUrl () {
      return this.demands[this.type[this.curIdx]].nextPageUrl
    },
    isNotGetCategory () {
      return Object.entries(this.giftRequest).every(([, val]) => val === '')
    },
    title () {
      let title = ''
      switch (this.status) {
        case 'requesting': title = '索取中'; break
        case 'remitting': title = '待匯運費'; break
        case 'remitted': title = '寄送中'; break
        case 'sent': title = '待收件'; break
        case 'finished': title = '待感謝'; break
      }
      return title
    },
    busy () {
      return this[this.type[this.curIdx]].busy
    },
    isLoading () {
      return this[this.type[this.curIdx]].isLoading
    }
  }
}
</script>

<style lang="less">
  .request-some{
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
          &:before, &:after{
            display: none;
          }
          &:nth-last-child(3){
            .req-item-card{
              &:after{
                display: none;
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .request-some{
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
      margin-top: @pm-md;
      height: calc(~"100% - 100px");
      overflow-y: scroll;
      .content-wrapper{
        height: 100%;
        overflow: scroll;
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
