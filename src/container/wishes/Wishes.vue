<template>
  <div class="wrap wish-public-style"
     id="wrap"
     v-infinite-scroll="loadMore"
     infinite-scroll-disabled="busy"
     infinite-scroll-distance="120"
  >
    <div class="list-header">
      <sticky scroll-box="wrap" :offset="0" :check-sticky-support="false">
        <x-header
          title="心願認養"
          :right-options="{showMore: true}"
          @on-click-more="showMenus = true"
        ></x-header>
      </sticky>
      <div class="vux-sticky-fill" style="height:44px;"></div>
    </div>
    <div class="tabs">
      <tab
        :line-width="2"
        custom-bar-width="24px">
        <tab-item
          :key="value.index"
          :selected="key === tabType"
          v-for="(value, key) in tabItems"
          @on-item-click="() => switchTabItem(key)">
          {{value.label}}
        </tab-item>
      </tab>
    </div>
    <div class="list-wishes">
      <div>
        <div class="oops" v-if="!wishesList.data.length && !isLoading">暫時沒有哦~</div>
        <div v-else class="item-wrap">
          <div class="item"
               v-for="(item, index) in wishesList.data"
               :key="index"
          >
            <wishes-card
              :item="item"
              :index="index"
            />
          </div>
        </div>
      </div>
      <inline-loading
        v-show="isLoading">
      </inline-loading>
      <divider
        v-show="wishesList.data.length && !wishesList.nextPageUrl"
        class="g-divider"
        style="background: transparent;">
        沒有更多了
      </divider>
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="menus"
                   v-model="showMenus"
                   show-cancel
                   @on-click-menu="menuClick"
      ></actionsheet>
    </div>
  </div>
</template>

<script>
import { Sticky, Divider, TransferDom, Actionsheet, Tab, TabItem } from 'vux'
import { mapState, mapActions } from 'vuex'
import WishesCard from './Card'
import infiniteScroll from 'vue-infinite-scroll'
import InlineLoading from '@/components/InlineLoading'
import debounce from 'lodash.debounce'
export default {
  components: {
    Sticky,
    WishesCard,
    InlineLoading,
    Divider,
    Actionsheet,
    Tab,
    TabItem
  },
  computed: {
    ...mapState({
      wishesList: state => state.wishes.wishList
    })
  },
  data () {
    return {
      page: 1,
      busy: false,
      isLoading: false,
      showMenus: false,
      menus: {
        'explain': '說明'
      },
      tabType: 'all',
      lock: false,
      tabItems: {
        all: {
          label: '全部',
          type: ''
        },
        on: {
          label: '未認養',
          type: 'on'
        },
        done: {
          label: '認養已送達',
          type: 'done'
        }
      }
    }
  },
  methods: {
    ...mapActions({
      getWishList: 'getWishList'
    }),
    wishesCb (data) {
      if (data.data.length) {
        if (data.next_page_url) {
          this.busy = false
          this.page = data.current_page + 1
        }
      }
      this.isLoading = false
    },
    loadMore () {
      this.busy = true
      this.isLoading = true
      let status = this.tabType === 'all' ? '' : this.tabType
      this.getWishList({
        page: this.page,
        cb: this.wishesCb,
        status
      })
    },
    menuClick (menuKey) {
      if (menuKey === 'explain') {
        this.$router.push('/wish/explain')
      }
    },
    switchTabItem: debounce(function (type) {
      if (type === this.tabType) {
        return null
      }
      this.$store.commit('clearWishList')
      this.tabType = type
      this.page = 1
      this.loadMore()
    }, 500, { leading: true })
  },
  beforeRouteLeave (to, from, next) {
    this.$route.meta.scrollY = document.querySelector('#wrap').scrollTop || 0
    next()
  },
  activated () {
    const scrollY = this.$route.meta.scrollY
    if (scrollY) {
      document.querySelector('#wrap').scrollTo(0, scrollY)
    }
  },
  directives: {
    infiniteScroll,
    TransferDom
  }
}
</script>
<style lang="less" scoped>
@import '../../global.mixin.less';
@import './style';
/deep/ .vux-header-right {
  margin-top: 9px;
}
.wrap {
  .g-bg-repeat-y('./assets/img/wishes/wish_pic_bg@2x.png');
  .oops {
    margin-top: 10px;
    color: #969797;
    font-size: 14px;
    text-align: center;
  }
  /deep/ .vux-header-right {
    margin-top: 9px;
  }
}
</style>
