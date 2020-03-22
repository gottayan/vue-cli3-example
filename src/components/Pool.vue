<template>
  <div class="pool">
    <div class="search">
      <x-input
        placeholder="請輸入關鍵字"
        novalidate
        @click.stop.native="toSearch"
        readonly
        :debounce="300"
        :show-clear="false"
        ref="searchInput"
        placeholder-align="left">
        <img
          slot="label"
          style="display: block;margin-right: 8px;"
          src="../assets/icon/gift/icon-search.png"
          width="14"
          height="14">
      </x-input>
      <img
        v-if="poolType !== 'wish'"
        slot="label"
        @click.self="toggleShow"
        style="position: absolute; top: 0; right: 0;"
        :src="searchIcon"
        width="50"
        height="50">
    </div>
    <group
      class="container mescroll"
      id="mescroll"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="200">
      <cell-box
        :key="index"
        @click.native.stop="toItem(item.id)"
        v-for="(item, index) in itemList.data">
        <item-card
          :pool-type="poolType"
          :card-info="item"
          :itemId="item.id">
        </item-card>
      </cell-box>
      <cell-box
        v-show="isOops">
        <oops
          :oop-type="poolType"
          class="pool-oops">
        </oops>
      </cell-box>
      <inline-loading
        v-show="this.page !== 1 && isLoading">
      </inline-loading>
      <divider
        v-show="itemList.data.length && !itemList.nextPageUrl"
        class="g-divider">
        沒有更多了
      </divider>
    </group>
    <side-bar
      @search="search"
      @hideSideBar="toggleShow"
      :pool-type="poolType"
      :is-show="isShow">
    </side-bar>
  </div>
</template>

<script>
import { XInput, CellBox, Divider } from 'vux'
import Sidebar from '@/components/Sidebar'
import ItemCard from '@/components/ItemCard'
import Oops from '@/components/Oops'
import infiniteScroll from 'vue-infinite-scroll'
import searchIcon from '@/assets/icon/gift/icon-nav-screen.png'
import { mapState, mapActions, mapMutations } from 'vuex'
import InlineLoading from '@/components/InlineLoading'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'

export default {
  props: {
    poolType: {
      type: String
    },
    sort: String
  },
  components: {
    XInput,
    CellBox,
    Oops,
    ItemCard,
    'side-bar': Sidebar,
    InlineLoading,
    Divider
  },
  data () {
    return {
      searchIcon,
      initUserRoleType: '',
      isShow: false,
      isOops: false,
      isSearch: false,
      items: [],
      page: 1,
      options: {
        sort: ''
      },
      gift: {
        busy: false,
        isLoading: false
      },
      need: {
        busy: false,
        isLoading: false
      },
      mescroll: ''
    }
  },
  mounted () {
    this.mescroll = new MeScroll('mescroll', { // 在vue的mounted生命周期初始化mescroll,确保此处配置的id能够被找到
      down: {
        callback: this.downCallback,
        auto: false,
        outOffset: function (mescroll) {
          // 下拉的距离大于offset那一刻的回调
          if (mescroll.downTipDom) {
            mescroll.downTipDom.innerHTML = '下拉放開立即更新'
          }
        },
        showLoading: function (mescroll) {
          // 显示下拉刷新进度的回调
          if (mescroll.downTipDom) {
            mescroll.downTipDom.innerHTML = '加載中 ...'
          }
          if (mescroll.downProgressDom) {
            mescroll.downProgressDom.classList.add('mescroll-rotate')
          }
        }
      }
    })
    this.options.sort = this.sort
    if (this.sort) {
      this.$store.commit('setFilterOptions', {searchType: '', sort: this.sort, category: '', poolType: 'gift'})
      this.search({category: '', searchType: '', sort: 'trends', type: 'gift'})
    }
    const {data, nextPageUrl, currentPage} = this.itemList
    this.page = currentPage
    if (!nextPageUrl) {
      this[this.poolType].busy = true
      if (!data.length) {
        this.isOops = true
      }
    }
    const userRoleType = this.$route.query.userRoleType
    if (this.poolType === 'need' && userRoleType) {
      this.setFilterOptions({
        poolType: 'need',
        category: '',
        sort: '',
        searchType: userRoleType
      })
      this.options = {
        ...this.options,
        userRoleType
      }
    }
  },
  methods: {
    ...mapActions({
      getGiftList: 'getGiftList',
      getNeedList: 'getNeedList',
      getLovebox: 'getLovebox'
    }),
    ...mapMutations({
      setFilterOptions: 'setFilterOptions'
    }),
    downCallback () {
      this.page = 1
      const paramsCommon = {
        page: this.page,
        onPool: 1,
        isSearch: this.isSearch,
        cb: this.loadMoreCb,
        isClear: true
      }
      const {sort = '', category = ''} = this.options
      if (this.poolType === 'gift') {
        const {isNew = '', orgFirst = ''} = this.options
        this.getGiftList({
          ...paramsCommon,
          isNew,
          orgFirst,
          sort,
          category,
          noRequestList: true
        })
      } else if (this.poolType === 'need') {
        const {userRoleType = '', isTraceUser = ''} = this.options
        this.getNeedList({
          ...paramsCommon,
          userRoleType,
          isTraceUser,
          sort,
          category,
          noRequestList: true
        })
      } else if (this.poolType === 'lovebox') {
        this.getLovebox({
          page: this.page,
          cb: this.loadMoreCb
        })
      }
    },
    toItem (id) {
      this.$router.push(`/${this.poolType}/${id}`)
    },
    toSearch () {
      this.$router.push({path: 'search', query: {type: this.poolType}})
    },
    toggleShow () {
      this.isShow = !this.isShow
    },
    search (options) {
      this.page = 1
      this.items = []
      this.isOops = false
      this.options = options
      this.isSearch = true
      const div = document.getElementById('mescroll')
      div.scrollTo(0, 0)
      this.loadMore(true)
    },
    loadMore (loadingLayer = false) {
      this[this.poolType].busy = true
      this[this.poolType].isLoading = true
      if (this.page === 1) {
        this.$Loading.show(loadingLayer)
      }
      const paramsCommon = {
        page: this.page,
        onPool: 1,
        isSearch: this.isSearch,
        cb: this.loadMoreCb
      }
      const {sort = '', category = ''} = this.options
      if (this.poolType === 'gift') {
        const {isNew = '', orgFirst = ''} = this.options
        this.getGiftList({
          ...paramsCommon,
          isNew,
          orgFirst,
          sort,
          category,
          noRequestList: true
        })
      } else if (this.poolType === 'need') {
        const {userRoleType = '', isTraceUser = ''} = this.options
        this.getNeedList({
          ...paramsCommon,
          userRoleType,
          isTraceUser,
          sort,
          category,
          noRequestList: true
        })
      } else if (this.poolType === 'lovebox') {
        this.getLovebox({
          page: this.page,
          cb: this.loadMoreCb
        })
      }
    },
    loadMoreCb (obj) {
      if (this.page === 1) {
        this.$Loading.hide()
      }
      // 其實的下拉加載回調函數意義不大，因為數據是由我們拿vuex管理，而不是託管到下拉插件中去管理
      // 而且有axios攔截了http error做錯誤提示，因此用途就是隱藏掉【加載中...】這個loading
      if (obj.error) {
        this.mescroll.endErr()
      } else {
        this.mescroll.endSuccess()
      }

      this[this.poolType].isLoading = false
      const {data, next_page_url: nexPageUrl} = obj
      if (!data.length && this.page === 1) {
        this.isOops = true
      } else {
        if (nexPageUrl) {
          this.page++
          this[this.poolType].busy = false
        }
      }
    }
  },
  computed: {
    ...mapState({
      needList: state => state.needs.needList,
      giftList: state => state.gifts.giftList,
      loveboxs: state => state.lovebox.lovebox
    }),
    itemList () {
      let itemList = {}
      switch (this.poolType) {
        case 'gift': itemList = this.giftList; break
        case 'need': itemList = this.needList; break
        case 'lovebox': itemList = this.loveboxs; break
      }
      return itemList
    },
    busy () {
      return this[this.poolType].busy
    },
    isLoading () {
      return this[this.poolType].isLoading
    }
  },
  directives: {
    infiniteScroll
  },
  created () {
    const { userRoleType } = this.$route.query
    const roleMap = {
      need: {
        commonweal: () => {
          this.$store.commit('resetNeedList')
          this.$store.commit('setFilterOptions', {userRoleType: 'commonweal', poolType: 'need'})
        }
      }
    }
    if (roleMap[this.poolType] && typeof roleMap[this.poolType][userRoleType] === 'function') {
      roleMap[this.poolType][userRoleType]()
    }
  }
}
</script>
<style lang="less">
  .pool{
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
      &:after, &:before{
        display: none;
      }
      .weui-cell{
        padding: 0;
        &:first-child{
          .item{
            border: none;
          }
        }
        &:nth-last-child(4){
          .item-card{
            &:after{
              display: none;
            }
          }
        }
        &:before{
          display:none;
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .pool{
    text-align: left;
    line-height: 1;
    height: 100%;
    background: @color-CBG;
    .search{
      position: fixed;
      top: 0;
      z-index: 800;
      width: 100%;
      max-width: @max-width;
      border-bottom: 1px solid @color-CL;
      background: #FFF;
    }
    .container{
      padding-top: 60px;
      height: 100%;
      overflow-y: scroll;
      background: #FFF;
      .pool-oops{
        margin: 50px auto 0;
      }
    }
  }
</style>
