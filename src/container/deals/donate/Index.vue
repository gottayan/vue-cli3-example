<template>
  <div class="donate-all">
    <x-header title="全部贈送">
      <a v-if="isCheckboxShow" @click="handleMerge" slot="right">{{mergeSelete ? '取消' : '合併'}}</a>
    </x-header>
    <div class="box">
      <tab
        :line-width="2"
        prevent-default
        custom-bar-width="24px"
        @on-before-index-change="switchTabItem"
      >
        <tab-item :selected="curIdx === 0">
          禮物（{{giftTotal}}）
        </tab-item>
        <tab-item :selected="curIdx === 1">
          需求（{{needTotal}}）
        </tab-item>
      </tab>
    </div>
    <div class="container">
      <group
        class="content-wrapper mescroll"
        id="donateIndexPanel"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10">
        <div
          v-if="!items.length && !nextPageUrl"
          class="oops">
          暫無相關資料
        </div>
        <cell-box
          :key="index"
          v-for="(item, index) in items">
          <item-card
            :index="index"
            @handleCheck="handleCheck"
            :mergeSelete="mergeSelete"
            :currentValue="currentValue"
            :currentCheckbox="currentCheckbox"
            :key="index"
            :pool-type="type[curIdx]"
            :card-info="item"
            :item-id="item[type[curIdx]] && item[type[curIdx]].id">
          </item-card>
        </cell-box>
        <inline-loading
          v-show="curPage !== 0 && isLoading">
        </inline-loading>
        <divider
          v-show="items.length && !nextPageUrl"
          class="g-divider p-divider">
          沒有更多了
        </divider>
      </group>
      <MergeBottom
      action="donate"
      :mergeSelete="mergeSelete"
      :currentValue="currentValue"
      :handleSubmitMerge="handleSubmitMerge"
      />
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Group, CellBox, Divider } from 'vux'
import ItemCard from '@/components/deals/DonateItemCard'
import {mapActions, mapState, mapMutations} from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import InlineLoading from '@/components/InlineLoading'
import anchorMixin from '@/mixins/anchor'
import mergeMixin from '@/mixins/merge'
import MergeBottom from '@/components/merge/Bottom'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'

export default {
  mixins: [anchorMixin, mergeMixin],
  directives: {
    infiniteScroll
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
        busy: false,
        isLoading: false
      },
      need: {
        busy: false,
        isLoading: false
      }
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
    this.getTotalCount()
  },
  mounted () {
    this.mescroll = new MeScroll('donateIndexPanel', {
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
      getDonateTotal: 'getDonateTotal',
      getDealsCategory: 'getDealsCategory',
      getMyDonates: 'getMyDonates',
      getUserMarks: 'getUserMarks',
      dealMerge: 'dealMerge'
    }),
    ...mapMutations({
      resetDeals: 'resetDeals',
      setDonatesCurIdx: 'setDonatesCurIdx',
      resetSectionDeals: 'resetSectionDeals'
    }),
    switchTabItem (index) {
      if (index !== this.curIdx) {
        const div = document.getElementById('donateIndexPanel')
        div.scrollTo(0, 0)
        this.setDonatesCurIdx({index})
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
      this.getDealsCategory({cb: this.toLoad})
    },
    toLoad () {
      const busy = this[this.type[this.curIdx]].busy
      if (!busy && this.nextPageUrl && this.isHas) {
        this[this.type[this.curIdx]].busy = true
        this[this.type[this.curIdx]].isLoading = true
        if (this.curPage === 0) {
          this.$Loading.show()
        }
        if (this.type[this.curIdx] === 'gift') {
          this.getMyDonates({
            page: this.curPage + 1,
            cb: this.loadMoreCb
          })
        } else {
          this.getMyDonates({
            page: this.curPage + 1,
            type: 'present',
            cb: this.loadMoreCb
          })
        }
      }
    },
    loadMoreCb (obj) {
      // this.$vux.loading.hide()
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
    getTotalCount () {
      this.getDonateTotal({
        cb: (data) => {
          this.needTotal = data
        }
      })
      this.getDonateTotal({
        type: 'present',
        cb: (data) => {
          this.giftTotal = data
        }
      })
    },
    downRefreshCallback () {
      this.getTotalCount()

      const type = this.type[this.curIdx]
      this[type].busy = true
      this[type].isLoading = true

      if (this.type[this.curIdx] === 'gift') {
        this.getMyDonates({
          page: 1,
          cb: this.loadMoreCb
        })
      } else {
        this.getMyDonates({
          page: 1,
          type: 'present',
          cb: this.loadMoreCb
        })
      }
    }
  },
  computed: {
    ...mapState({
      donates: state => state.deals.donates,
      needDonate: state => state.deals.category.need_donate,
      marks: state => state.user.marks
    }),
    isHas () {
      return Object.entries(this.needDonate).some(([, val]) => val)
    },
    isNotGetCategory () {
      return Object.entries(this.needDonate).every(([, val]) => val === '')
    },
    curIdx () {
      return this.donates.curIdx
    },
    curPage () {
      return this.donates[this.type[this.curIdx]].curPage
    },
    nextPageUrl () {
      return this.donates[this.type[this.curIdx]].nextPageUrl
    },
    gifts () {
      const gifts = this.donates.gift.data.map((item) => {
        let receivers = this.donates.gift.data.filter((itm) => (item.gift_id === itm.gift_id) && (itm.status === 'requesting'))
        receivers = receivers.map((item) => {
          return {
            id: item.id,
            gift_request_id: item.id,
            gift_id: item.gift_id,
            receiver_nickname: item.receiver_nickname,
            receiver_name: item.receiver_name,
            request_quantity: item.request_quantity,
            recity: item.receiver_city,
            readdress: item.receiver_address,
            redistrict: item.receiver_district,
            status: item.status,
            shipway: item.shipway,
            shipopts: item.shipopts,
            shipfee: item.shipfee,
            shipsn: item.shipsn,
            pics: item.pics,
            left: item.gift.left,
            state: item.gift.status,
            createdAt: item.created_at,
            isBindWhite: this.marks['WHITE'].data.some((itm) => itm.mark_user_id === item.user_id),
            isBindBlack: this.marks['BLACK'].data.some((itm) => itm.mark_user_id === item.user_id),
            edcode: item.gift_ec_order && item.gift_ec_order.cabinet_info && JSON.parse(item.gift_ec_order.cabinet_info).EDCODE
          }
        })
        return {
          ...item,
          receivers
        }
      })
      const bundle = []
      gifts.forEach((item) => {
        if (bundle.length && item.receivers.length) {
          const isHas = bundle.some((itm) => (item.gift_id === itm.gift_id) && (item.status === itm.status))
          if (!isHas) {
            bundle.push(item)
          }
        } else {
          bundle.push(item)
        }
      })
      return bundle
    },
    needs () {
      const needs = this.donates.need.data.map((item) => {
        return {
          ...item,
          receivers: []
        }
      })
      return needs
    },
    items () {
      return this.type[this.curIdx] === 'gift' ? this.gifts : this.needs
    },
    busy () {
      return this[this.type[this.curIdx]].busy
    },
    isLoading () {
      return this[this.type[this.curIdx]].isLoading
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
      height: calc(~"100% - 88px");
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
