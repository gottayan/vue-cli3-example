<template>
  <div class="user-shop">
    <group
      id="userShopPanel"
      class="container g-smooth"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="20">
      <div
        v-if="!shopBoxs.data.length && !shopBoxs.nextPageUrl"
        class="oops">
        當前索取的愛箱為空~
      </div>
      <cell-box
        :key="index"
        v-for="(shopBox, index) in shopBoxs.data">
        <div class="item">
          <user-love-box
            type="shop"
            :logisticsSn="shopBox.logistics_sn"
            :time="shopBox.created_at"
            :items="shopBox.love_box_items"
            :no="shopBox.no"
            :deliverAt="shopBox.deliver_at"
            @showTrack="showTrack"
            class="box">
          </user-love-box>
        </div>
      </cell-box>
      <inline-loading
        v-show="shopBoxs.curPage !== 0 && isLoading">
      </inline-loading>
      <divider
        v-show="shopBoxs.data.length && !shopBoxs.nextPageUrl"
        class="g-divider p-divider">
        沒有更多了
      </divider>
    </group>
    <tracking-dialog
      :sn="trackSn"
      :show="showTrackDlg"
      @close="closeTrackDlg" />
  </div>
</template>

<script>
import {Group, CellBox, Divider} from 'vux'
import {mapActions, mapState, mapMutations} from 'vuex'
import UserLoveBox from '@/components/UserLoveBox'
import infiniteScroll from 'vue-infinite-scroll'
import InlineLoading from '@/components/InlineLoading'
import anchorMixin from '@/mixins/anchor'
import TrackingDialog from '@/components/TrackingDialog'

export default {
  mixins: [anchorMixin],
  directives: {
    infiniteScroll
  },
  components: {
    UserLoveBox,
    Group,
    CellBox,
    InlineLoading,
    Divider,
    TrackingDialog
  },
  data () {
    return {
      busy: false,
      isLoading: false,
      showTrackDlg: false,
      trackSn: ''
    }
  },
  beforeDestroy () {
    // this.resetMyShopBoxes()
  },
  methods: {
    ...mapActions({
      getMyShopBoxs: 'getMyShopBoxs'
    }),
    ...mapMutations({
      resetMyShopBoxes: 'resetMyShopBoxes'
    }),
    loadMore () {
      if (this.shopBoxs.nextPageUrl) {
        this.busy = true
        // this.$vux.loading.show({
        //   text: '加載中...'
        // })
        this.isLoading = true
        const curPage = this.shopBoxs.curPage
        if (curPage === 0) {
          this.$Loading.show()
        }
        this.getMyShopBoxs({
          page: curPage + 1,
          cb: this.loadMoreCb
        })
      }
    },
    loadMoreCb () {
      if (this.shopBoxs.curPage === 1) {
        this.$Loading.hide()
      }
      this.isLoading = false
      if (this.shopBoxs.nextPageUrl) {
        this.busy = false
      }
    },
    showTrack (sn) {
      this.showTrackDlg = true
      this.trackSn = sn
    },
    closeTrackDlg () {
      this.showTrackDlg = false
      this.trackSn = ''
    }
  },
  mounted () {
    this.initAnchor('userShopPanel')
  },
  computed: {
    ...mapState({
      shopBoxs: state => state.lovebox.shopBoxs
    })
  }
}
</script>

<style lang="less">
  .user-shop{
    .container{
      .weui-cells{
        margin-top: 0;
        &:before, &:after{
          display: none;
        }
        .weui-cell{
          display: initial;
          padding: 0;
          margin: 0;
          &:before, &:after{
            display: none;
          }
          &:nth-last-child(3){
            .item{
              border-bottom: none;
            }
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
.user-shop{
  height: 100%;
  .container{
    height: 100%;
    overflow-y: scroll;
    background: #FFF;
    .oops{
      margin-top: 100px;
      color: @color-font-C2;
      font-size: @font-S3;
      text-align: center;
    }
    .item{
      padding: 0 @pm-bg;
      background: #FFF;
      border-bottom: 10px solid @color-CL;
    }
    .p-divider{
      padding: @pm-bg 0 !important;
    }
  }
}
</style>
