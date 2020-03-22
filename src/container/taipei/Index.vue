<template>
  <div class="taipei-index">
    <x-header title="台北社會局">
      <img
        @click.self="toTaipeiAbout"
        :src="iconNav"
        slot="right"
        width="22"
        height="22">
    </x-header>
    <div class="box">
      <tab
        :line-width="2"
        prevent-default
        custom-bar-width="24px"
        @on-before-index-change="switchTabItem">
        <tab-item
          v-for="(item, index) in tabItems"
          :key="index"
          :selected="taipeiBureauCurIdx === index">
          {{item}}
        </tab-item>
      </tab>
    </div>
    <div
      v-if="taipeiBureauCurIdx !== 2"
      id="taipeiContainer"
      class="container g-smooth">
      <group
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10">
        <cell-box
          @click.native="toItem(item.id)"
          :key="index"
          v-for="(item, index) in itemList.data">
          <item-card
            :pool-type="type[taipeiBureauCurIdx]"
            :card-info="item"
            :itemId="item.id">
          </item-card>
        </cell-box>
        <cell-box
          v-show="false">
          <oops
            :oop-type="type[taipeiBureauCurIdx]"
            class="pool-oops">
          </oops>
        </cell-box>
        <inline-loading v-show="itemList.currentPage !== 0 && isLoading">
        </inline-loading>
        <divider
          v-if="itemList.data.length && !itemList.nextPageUrl"
          class="g-divider">
          沒有更多了
        </divider>
      </group>
    </div>
    <div v-else class="container">
      <div class="intro-panel">
        <section-title
          class="panel-title"
          title="熟食/食材捐贈">
        </section-title>
        <div class="content">
          近年來食物不浪費、惜食理念廣受社會大眾關注，<br />
          本局也共同響應，媒合公有市場捐贈餘裕食材，提供社福單位領取，<br />
          但減少食物浪費，最重要的是從源頭做起，像是訂餐前確實控管用餐人數、計畫性消費，以減少剩餘產生。<br />
          <br />
          但若因種種不可抗力因素下，仍有多餘熟食或食材欲捐贈，請詳閱以下說明：<br /><br />
          單位可接受的捐贈<br />
          <ul>
            <li>熟食：未食用過便當、餐盒、菜餚等，請妥善包裝。</li>
            <li>食材：尚未煮食的生鮮食材(生鮮蔬果、魚肉類、加工食品等)，請確保食材新鮮尚可煮食。</li>
          </ul>
          <br />
          捐贈小叮嚀<br />
          <ul>
            <li>捐贈前，請務必注意食用期限，捐贈你、我皆願意吃的食物。</li>
            <li>因熟食賞味期限短，且需配合單位供餐時間，故請於單位方便接受捐贈時間聯繫捐贈。</li>
            <li>每個單位可接受物資類型、時間、數量及運送方式皆不同，請電話聯繫確認，勿逕自將物資送至單位，避免造成不必要困擾喔!</li>
          </ul>
          <br />
          閱讀完說明後，如您接受及認同，且有尚可食用、安全無虞的熟食或食材，<br />
          可直接聯繫以下單位喔! 謝謝您的愛心分享～<br />
        </div>
      </div>
      <div class="target-panel">
        <section-title
          class="panel-title"
          title="社福單位">
        </section-title>
        <div class="content">
          <div
            class="item-card"
            :key="index"
            v-for="(item, index) in donateTarget">
            <div class="area-type">
              <span class="area">{{item.area}}</span>
              <span class="type">{{item.type}}</span>
            </div>
            <div class="col">
              <span class="label">單位名稱：</span>
              <span class="value">{{item.name}}</span>
            </div>
            <div class="col">
              <span class="label">捐贈類型：</span>
              <span class="value">{{item.foodType}}</span>
            </div>
            <div class="col">
              <span class="label">接受數量：</span>
              <span class="value">{{item.num}}</span>
            </div>
            <div class="col">
              <span class="label">捐贈時間：</span>
              <span class="value">{{item.time}}</span>
            </div>
            <div class="col">
              <span class="label">運送方式：</span>
              <span class="value">{{item.shipway}}</span>
            </div>
            <div class="col">
              <span class="label">聯絡電話：</span>
              <span class="value">{{item.phone}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Group, CellBox, Divider } from 'vux'
import ItemCard from '@/components/ItemCard'
import {mapActions, mapState, mapMutations} from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import Oops from '@/components/Oops'
import {donateTarget} from '@/tools/constant'
import SectionTitle from '@/components/Title'
import iconNav from '@/assets/icon/lovebox/com_nav_ic_q&a_normal@2x.png'
import InlineLoading from '@/components/InlineLoading'

export default {
  directives: {
    infiniteScroll
  },
  components: {
    Tab,
    TabItem,
    ItemCard,
    Group,
    CellBox,
    Oops,
    SectionTitle,
    InlineLoading,
    Divider
  },
  data () {
    return {
      tabItems: ['禮物池', '公益需求', '食材捐贈'],
      type: ['gift', 'need', 'need'],
      donateTarget,
      iconNav,
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
  },
  methods: {
    ...mapActions({
      getGiftList: 'getGiftList',
      getNeedList: 'getNeedList'
    }),
    ...mapMutations({
      setTaipeiBureauCurIdx: 'setTaipeiBureauCurIdx'
    }),
    switchTabItem (index) {
      if (index !== this.taipeiBureauCurIdx) {
        const div = document.getElementById('taipeiContainer')
        if (div) {
          div.scrollTo(0, 0)
        }
        this.setTaipeiBureauCurIdx(index)
      }
      const {nextPageUrl, currentPage} = this.itemList
      if (nextPageUrl && !currentPage) {
        this.loadMore()
      }
    },
    loadMore () {
      const {nextPageUrl, currentPage} = this.itemList
      if (nextPageUrl) {
        this[this.type[this.taipeiBureauCurIdx]].busy = true
        // this.$vux.loading.show({
        //   text: '加載中...'
        // })
        this[this.type[this.taipeiBureauCurIdx]].isLoading = true
        if (currentPage === 0) {
          this.$Loading.show()
        }
        const params = {
          onPool: 1,
          page: currentPage + 1,
          bureauId: 1,
          cb: this.loadMoreCb
        }
        if (this.taipeiBureauCurIdx === 0) {
          this.getGiftList({...params})
        } else if (this.taipeiBureauCurIdx === 1) {
          this.getNeedList({...params})
        }
      }
    },
    loadMoreCb () {
      this[this.type[this.taipeiBureauCurIdx]].busy = false
      this[this.type[this.taipeiBureauCurIdx]].isLoading = false
      if (this.itemList.currentPage === 1) {
        this.$Loading.hide()
      }
      // this.$vux.loading.hide()
    },
    toItem (id) {
      this.$router.push(`/${this.type[this.taipeiBureauCurIdx]}/${id}`)
    },
    toTaipeiAbout () {
      this.$router.push('/city/taipei/about')
    }
  },
  computed: {
    ...mapState({
      giftListTaipei: state => state.gifts.giftListTaipei,
      needListTaipei: state => state.needs.needListTaipei,
      taipeiBureauCurIdx: state => state.configs.taipeiBureauCurIdx
    }),
    itemList () {
      let itemList = {}
      switch (this.taipeiBureauCurIdx) {
        case 0: itemList = this.giftListTaipei; break
        case 1: itemList = this.needListTaipei; break
        default: break
      }
      return itemList
    },
    isLoading () {
      const index = this.taipeiBureauCurIdx
      return this[this.type[index]].isLoading
    },
    busy () {
      const index = this.taipeiBureauCurIdx
      return this[this.type[index]].busy
    }
  }
}
</script>

<style lang="less">
  .taipei-index{
    .vux-header{
      .vux-header-right{
        top: 11px !important;
      }
    }
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
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .taipei-index{
    height: 100%;
    .container{
      height: calc(~"100% - 88px");
      overflow-y: scroll;
      .intro-panel, .target-panel{
        padding: 0 @pm-bg;
        .panel-title{
          margin: @pm-md 0;
        }
      }
      .intro-panel{
        .content{
          color: @color-font-C1;
          font-size: @font-S3;
          ul{
            list-style: inside;
            color: @theme-color;
            padding-left: @pm-bg;
          }
        }
      }
      .target-panel{
        .content{
          .item-card{
            padding: @pm-bg @pm-lg;
            margin-top: @pm-lg;
            border: 1px solid @color-CL;
            box-shadow: 0 10px 15px -8px rgba(0, 0, 0, .2);
            &:first-child{
              margin-top: 0;
            }
            .area-type{
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-bottom: @pm-sm;
              margin-bottom: @pm-md;
              border-bottom: 2px solid #dedede;
              .area{
                font-size: 22px;
                font-weight: 700;
                display: inline-block;
                margin-right: 22px;
              }
              .type{
                background: #f4ab3d;
                color: white;
                padding: 2px 10px;
                border-radius: 12px;
              }
            }
            .col{
              display: flex;
              font-size: @font-S3;
              .label{
                color: #AAA;
              }
              .value{
                flex: 1;
                color: @color-font-C1;
              }
            }
          }
        }
      }
    }
  }
</style>
