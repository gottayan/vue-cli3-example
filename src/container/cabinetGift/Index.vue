<template>
  <div
    class="logistics-wrap"
    id="logistics-wrap"
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="120"
  >
    <div class="logistics-header">
      <sticky scroll-box="logistics-wrap" :offset="0" :check-sticky-support="false">
        <x-header title="名櫃好禮"></x-header>
      </sticky>
      <div class="vux-sticky-fill" style="height:44px;"></div>
    </div>
    <div class="logistics-banner">
      <img :src="banner" alt="" class="logistics-banner-img">
    </div>
    <div class="logistics">
      <div :class="showAll ? '' : 'dn'">
        <div
          :class="`logistics-grid logistics-grid-${index}`"
          v-for="(item, index) in filteGiftData"
          :key="index"
        >
          <Item
            :index="index"
            :giftItem="item"
            :cabinetBanners="cabinetBanners"
            :showFirstCard="showFirstCard"
            :handleSelect="handleSelect"
          />
        </div>
        <div v-if="filteGiftData.length % 2 && showFirstCard"
          :class="`logistics-grid logistics-grid-${filteGiftData.length}`"
          style="margin-left: -5px;">
          <Item
            :index="filteGiftData.length"
            :noContent="true"
          />
        </div>
        <template v-if="(giftList.data.length === 0 || giftList.data.length === 1) && showFirstCard">
          <div v-for="item in [2, 3]"
            :key="item"
            :class="`logistics-grid logistics-grid-${item}`"
          >
            <Item
              :index="item"
              :noContent="true"
            />
          </div>
        </template>
      </div>
      <div class="bottom-rabbit-wrap">
        <div class="bottom-rabbit">
          <img
            class="bottom-rabbit-item"
            :src="bottomRabbit"
          />
        </div>
      </div>
      <inline-loading
        v-show="isLoading">
      </inline-loading>
      <divider
        :class="showAll ? '' : 'dn'"
        v-show="giftList.data.length && !giftList.nextPageUrl"
        class="g-divider">
        沒有更多了
      </divider>
    </div>
  </div>
</template>

<script>
import Item from './Item'
import bottomRabbit from '../../assets/img/cabinet/rabbit_bottom.png'
import banner from '../../assets/img/cabinet/Banner-fin.jpg'
import { Sticky, Divider } from 'vux'
import { mapState, mapActions } from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import InlineLoading from '@/components/InlineLoading'

export default {
  directives: {
    infiniteScroll
  },
  components: {
    Item,
    Sticky,
    InlineLoading,
    Divider
  },
  data () {
    return {
      bottomRabbit,
      banner,
      page: 1,
      busy: false,
      isLoading: false,
      showFirstCard: false,
      showAll: true,
      firstTime: true,
      selected: 'all'
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('changeRecruitScrollY', {
      data: document.querySelector('.logistics-wrap').scrollTop
    })
    next()
  },
  computed: {
    ...mapState({
      giftList: state => state.gifts.cabinetGiftList,
      cabinetBanners: state => state.gifts.cabinetBanners
    }),
    filteGiftData () {
      let temp = this.giftList.data.slice()
      temp.unshift({})
      return temp
    }
  },
  activated () {
    const scrollY = this.$store.state.gifts.recruitScrollY
    if (scrollY) {
      document.querySelector('.logistics-wrap').scrollTo(0, scrollY)
    }
  },
  methods: {
    ...mapActions({
      getGiftList: 'getGiftList',
      getCabinetBanners: 'getCabinetBanners'
    }),
    handleSelect (status) {
      this.selected = status
      if (this.firstTime) {
        this.firstTime = false
        return
      }
      this.isLoading = true
      this.showAll = false
      let objStatus = status === 'all' ? {} : {status: status}
      this.getGiftList(Object.assign(objStatus, {
        page: 1,
        onPool: 1,
        cb: this.changeCb,
        type: 2,
        perPage: 21,
        refresh: true,
        noRequestList: true
      }))
    },
    loadMore () {
      let objStatus = this.selected === 'all' ? {} : {status: this.selected}
      this.busy = true
      this.isLoading = true
      this.getGiftList(Object.assign(objStatus, {
        page: this.page,
        onPool: 1,
        cb: this.loadCb,
        type: 2,
        perPage: 21,
        noRequestList: true
      }))
    },
    loadCb (data) {
      if (data.data.length) {
        if (data.next_page_url) {
          this.busy = false
          this.page = data.current_page + 1
        }
      }
      this.showFirstCard = true
      this.isLoading = false
    },
    changeCb (data) {
      if (data.data.length) {
        if (data.next_page_url) {
          this.busy = false
        }
      }
      this.isLoading = false
      this.showAll = true
    }
  },
  created () {
    this.getCabinetBanners()
  }
}
</script>

<style lang="less" scoped>
@while-space-between: -0.01px;
.logistics-wrap {
  width: 100%;
  height: 100%;
  overflow: auto;
  .dn {
    display: none;
  }
  .logistics-banner {
    height: 150px;
    .logistics-banner-img {
      height: 100%;
      width: 100%;
    }
  }
  .logistics {
    /deep/ .logistics-grid {
      padding: 0;
      border: 0;
      display: inline-block;
      vertical-align: top;
      width: 50%;
      &:active {
        background-color: transparent;
      }
    }
    /deep/ .logistics-grid-1,
    .logistics-grid-3,
    .logistics-grid-5,
    .logistics-grid-7,
    .logistics-grid-9 {
      margin-right: @while-space-between;
    }
    /deep/ .logistics-grid-2,
    .logistics-grid-4,
    .logistics-grid-6,
    .logistics-grid-8,
    .logistics-grid-10 {
      margin-left: @while-space-between;
    }
  }
  .bottom-rabbit-wrap {
    position: relative;
    bottom: 0;
    .bottom-rabbit {
        width: 60px;
        position: absolute;
        right: 0;
        bottom: -60px;
        .bottom-rabbit-item {
          width: 100%;
          height: 100%;
        }
      }
  }
}
</style>
