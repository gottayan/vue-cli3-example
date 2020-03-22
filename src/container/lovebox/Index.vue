<template>
  <div class="lovebox">
    <x-header
      title="愛箱送">
      <div slot="right" class="header-right">
        <img
        @click.self="ToAboutLovebox"
        :src="iconNav"
        width="22"
        height="22">
      <img
        @click.self="toggleShow"
        :src="searchIcon"
        width="40"
        height="40">
      </div>
    </x-header>
    <div
      :class="isTips ? 'container-wrapper tip' : 'container-wrapper'">
      <div
        v-show="isTips"
        class="tips">
        <span class="txt">新上架前五日為公益團體/學校單位優先，後開放全站索取</span>
        <img
          @click="closeTips"
          class="close"
          :src="iconClose"
          width="36"
          height="36"
          alt="icon">
      </div>
      <group
        class="container g-smooth"
        id="loveboxContainer"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10">
        <cell-box
          :key="index"
          @click.native.stop="toLovebox(item.id)"
          v-for="(item, index) in loveboxs.data">
          <love-box-card
            :name="item.goods_name"
            :pic="item.goods_picture"
            :remain="item.remain"
            :company="item.company && (item.company.company_name || item.company.name)"
            :provider="item.employee && (item.employee.nickname || '暫無暱稱')">
          </love-box-card>
        </cell-box>
        <oops v-if="isOops" oop-type="gift" class="pool-oops">
        </oops>
        <inline-loading v-show="this.page !==1 && isLoading">
        </inline-loading>
        <divider
          v-if="loveboxs.data.length && !loveboxs.nextPageUrl"
          class="g-divider p-divider">
          沒有更多了
        </divider>
      </group>
    </div>
    <div @click="toShopCart" class="shop">
      <img :src="iconShop" width="80" height="80" alt="icon">
      <span v-if="total" class="num">{{total}}</span>
    </div>
    <side-bar
      @search="search"
      @hideSideBar="toggleShow"
      :pool-type="poolType"
      :is-show="isShow">
    </side-bar>
  </div>
</template>

<script>
import { CellBox, Divider } from 'vux'
import Sidebar from '@/components/LoveBoxSideBar'
import Oops from '@/components/Oops'
import iconClose from '@/assets/icon/lovebox/com_bar_ic_close_normal@2x.png'
import iconShop from '@/assets/icon/lovebox/com_bottom_ic_shop_normal@2x.png'
import infiniteScroll from 'vue-infinite-scroll'
import searchIcon from '@/assets/icon/gift/icon-nav-screen.png'
import iconNav from '@/assets/icon/lovebox/com_nav_ic_q&a_normal@2x.png'
import picLabelNew from '@/svg/home_pic_label_new.svg'
import { mapState, mapActions, mapMutations } from 'vuex'
import LoveBoxCard from '@/components/LoveBoxCard'
import scrollMixin from '@/mixins/scroll'
import { local, KEY_USER_TOKEN } from '@/tools/storage'
import InlineLoading from '@/components/InlineLoading'

export default {
  mixins: [scrollMixin],
  props: {
    poolType: {
      type: String,
      default: 'lovebox'
    }
  },
  components: {
    CellBox,
    Oops,
    'side-bar': Sidebar,
    LoveBoxCard,
    InlineLoading,
    Divider
  },
  data () {
    return {
      searchIcon,
      iconNav,
      picLabelNew,
      iconClose,
      iconShop,
      isTips: true,
      isShow: false,
      busy: false,
      isOops: false,
      isSearch: false,
      page: 1,
      options: {},
      isLoading: false
    }
  },
  created () {
    const isReadLoveBoxTips = local.get('isReadLoveBoxTips')
    if (isReadLoveBoxTips) {
      this.isTips = false
    }
    const token = local.get(KEY_USER_TOKEN)
    if (token) {
      this.getLoveCart()
    }
    const {data, nextPageUrl, currentPage} = this.loveboxs
    this.page = currentPage
    if (!nextPageUrl) {
      this.busy = true
      if (!data.length) {
        this.isOops = true
      }
    }
    const userRoleType = this.$route.query.userRoleType
    if (this.poolType === 'lovebox' && userRoleType) {
      this.setLoveboxFilterOptions({poolType: 'lovebox', category: '', sort: '', searchType: userRoleType})
      this.options = {
        ...this.options,
        userRoleType
      }
    }
  },
  mounted () {
    this.initialContainer('.container', 'LOVEBOX_OFFSET')
  },
  methods: {
    ...mapActions({
      getLovebox: 'getLovebox',
      getLoveCart: 'getLoveCart'
    }),
    ...mapMutations({
      setLoveboxFilterOptions: 'setLoveboxFilterOptions'
    }),
    closeTips () {
      local.save('isReadLoveBoxTips', true)
      this.isTips = false
    },
    toShopCart () {
      const token = local.get(KEY_USER_TOKEN)
      if (!token) {
        return this.$router.replace('/login?redirect=/shopCart')
      }
      this.$router.push('/shopCart')
    },
    toLovebox (id) {
      this.$router.push(`/lovebox/${id}`)
    },
    toSearch () {
      this.$router.push({path: 'search', query: {type: this.poolType}})
    },
    toggleShow () {
      this.isShow = !this.isShow
    },
    search (options) {
      this.page = 1
      this.isOops = false
      this.options = options
      this.isSearch = true
      const div = document.getElementById('loveboxContainer')
      div.scrollTo(0, 0)
      this.loadMore(true)
    },
    loadMore (showMask = false) {
      this.busy = true
      if (this.page === 1) {
        this.$Loading.show(showMask)
      }
      const paramsCommon = {page: this.page, onPool: 1, isSearch: this.isSearch, cb: this.loadMoreCb}
      const {sort = '', category = '', searchType = ''} = this.options
      this.getLovebox({...paramsCommon, userRoleType: searchType, sort, category})
      this.isLoading = true
    },
    loadMoreCb (obj) {
      if (this.page === 1) {
        this.$Loading.hide()
      }
      this.isLoading = false
      const {data, next_page_url: nexPageUrl} = obj
      if (!data.length && this.page === 1) {
        this.isOops = true
      } else {
        if (nexPageUrl) {
          this.page++
          this.busy = false
        }
      }
    },
    ToAboutLovebox () {
      this.$router.push('/aboutLovebox')
    },
    beforeLeaveCb (to, from, next) {
      if (to.path === '/' && from.path === '/lovebox') {
        window.sessionStorage.removeItem(this.offset_key)
      }
      next()
    }
  },
  computed: {
    ...mapState({
      loveboxs: state => state.lovebox.loveboxs,
      loveCart: state => state.lovebox.curLoveCart
    }),
    total () {
      const numArr = this.loveCart.items.map(item => item.quantity)
      return numArr.length ? numArr.reduce((prev, cur) => cur + prev) : 0
    }
  },
  directives: {
    infiniteScroll
  }
}
</script>
<style lang="less">
  .lovebox{
    .header-right {
      display: flex;
      align-items: center;
    }
    .vux-x-input{
      padding: 0 0 0 @pm-bg;
      background: #FFF;
      .weui-input{
        height: 50px;
      }
    }
    .weui-cells{
      margin: 0;
      border: none;
      &:after{
        border-bottom: none;
      }
      &:before{
        border: none;
      }
      .weui-cell{
        padding: 0;
        &:first-child{
          .item{
            border: none;
          }
        }
        &:before{
          display:none;
        }
      }
    }
    .vux-header{
      .vux-header-right{
        display: flex;
        align-items: center;
        top: 2px
      }
    }
    .container{
      .weui-cells{
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        padding: @pm-bg @pm-bg 0 @pm-bg;
        .vux-cell-box{
          flex: 0 0 calc(~"(100% - 15px) / 2");
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .lovebox{
    height: 100%;
    text-align: left;
    background: #FFF;
    .container-wrapper{
      height: calc(~"100% - 44px");
      .container{
        height: 100%;
      }
      &.tip{
        .container{
          height: calc(~"100% - 40px");
        }
      }
      .tips{
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 @pm-bg 0 40px;
        height: 40px;
        color: #FFF;
        font-size: 12px;
        background: @color-CR url('../../assets/icon/lovebox/com_bar_ic_notice@2x.png') 15px center no-repeat;
        background-size: 14px 14px;
        .close{
          position: absolute;
          top: 0;
          right: 0;
        }
      }
      .container{
        overflow-y: scroll;
        .pool-oops{
          margin: 50px auto 0;
        }
        .p-divider{
          padding: @pm-bg 0 !important;
          width: 100%;
        }
      }
    }
    .shop{
      position: fixed;
      bottom: @pm-bg;
      right: @pm-bg;
      z-index: 10;
      .num{
        position: absolute;
        top: 10px;
        right: 10px;
        width: 22px;
        height: 22px;
        color: #FFF;
        font-size: 10px;
        line-height: 22px;
        text-align: center;
        border: 1px solid #FFF;
        border-radius: 50%;
        background: @color-CR;
      }
    }
  }
</style>
