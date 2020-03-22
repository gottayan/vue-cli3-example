<template>
  <div class="thanks-wall">
    <x-header
      @on-click-back="goBack"
      class="back-header"
      title="感謝牆">
    </x-header>
    <div class="thanks-fake-banner">
    </div>
    <group
      class="container"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="20">
      <div class="masonry">
        <div
          class="item"
          :key="index"
          v-for="(thank, index) in thanks.data">
          <div class="item__content">
            <thanks-wall-item
              :info="thank">
            </thanks-wall-item>
          </div>
        </div>
      </div>
      <inline-loading
        v-show="thanksWall.currentPage !== 0 && isLoading">
      </inline-loading>
      <divider
        v-if="thanksWall.data.length && !thanksWall.nextPageUrl"
        class="g-divider p-divider">
        沒有更多了
      </divider>
    </group>
  </div>
</template>

<script>
import { Divider } from 'vux'
import infiniteScroll from 'vue-infinite-scroll'
import ThanksWallItem from '@/components/ThanksWallItem'
import { mapState, mapActions } from 'vuex'
import InlineLoading from '@/components/InlineLoading'

export default {
  components: {
    ThanksWallItem,
    InlineLoading,
    Divider
  },
  data () {
    return {
      busy: false,
      isLoading: false
    }
  },
  created () {
  },
  methods: {
    ...mapActions({
      getThanks: 'getThanks'
    }),
    goBack () {
      this.$router.go(-1)
    },
    // 滚动加载更多
    loadMore () {
      if (!this.busy && this.thanksWall.nextPageUrl) {
        this.busy = true
        // this.$vux.loading.show({
        //   text: '加載中...'
        // })
        if (this.thanksWall.currentPage === 0) {
          this.$Loading.show()
        }
        this.isLoading = true
        const page = this.thanksWall.currentPage + 1
        this.getThanks({page, cb: this.loadMoreCb})
      }
    },
    loadMoreCb () {
      // this.$vux.loading.hide()
      if (this.thanksWall.currentPage === 1) {
        this.$Loading.hide()
      }
      this.isLoading = false
      if (this.thanksWall.nextPageUrl) {
        this.busy = false
      }
    }
  },
  computed: {
    ...mapState({
      thanksWall: state => state.thanks.thanksWall
    }),
    thanks () {
      return this.thanksWall
    }
  },
  directives: {
    infiniteScroll
  }
}
</script>
<style lang="less">
  .thanks-wall{
    .container{
      .weui-cells{
        margin: 0;
        background-color: transparent;
        &:before, &:after{
          display: none;
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  // @import url('https://fonts.googleapis.com/css?family=PT+Mono');
  .thanks-wall{
    padding: 0 @pm-bg;
    height: 100%;
    text-align: left;
    line-height: 1;
    background: linear-gradient(to right, #FFE2E2 50%, #ffeeed 50%);
    background-size: 40px;
    overflow: auto;
    .back-header{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99;
      width: 100%;
    }

    .thanks-fake-banner{
      position: fixed;
      left: 0;
      top: 44px;
      z-index: 10;
      background-image: url('../assets/icon/thanks/thanks_pic_title@2x.png');
      background-size: cover;
      background-repeat: no-repeat;
      width: 100%;
      height: 94px;
    }

    &-box{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      border-bottom: @pm-bg solid #FFF;
      background: @color-CBG;
    }
    .container{
      margin-top: 140px;
      max-height: calc(~"100% - 140px");
      overflow-y: auto;
      scroll-behavior: smooth;
      -webkit-scroll-behavior: smooth;
      overflow-scrolling: touch;
      -webkit-overflow-scrolling: touch;
      .p-divider{
        padding: @pm-bg 0 !important;
        background-color: transparent;
      }
    }

    .thank-item{
      border-radius: 5px;
      background-color: white;
    }
  }

  @bg: #4F000B;

  .masonry {
    column-count: 2;
    column-gap: 15px;
    counter-reset: item-counter;
  }

  .item {
    box-sizing: border-box;
    break-inside: avoid;
    counter-increment: item-counter;
    background-color: #FFF;
    margin-bottom: @pm-bg;

    &__content {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }
  }
</style>
