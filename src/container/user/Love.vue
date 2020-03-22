<template>
  <div class="user-love">
    <div class="container">
      <group
        id="userLovePanel"
        class="container-wrapper g-smooth"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="20">
        <div
          v-if="!loveCollections.data.length && !loveCollections.nextPageUrl"
          class="oops">
          當前寄送的愛箱為空~
        </div>
        <cell-box
          :key="index"
          v-for="(box, index) in loveCollections.data">
          <div class="item">
            <user-love-box
              :time="box.collect_at"
              :edelno="box.edelno"
              :shipSn="box.image_url"
              :items="box.love_provisions"
              @showTrack="showTrack"
              class="box">
            </user-love-box>
          </div>
        </cell-box>
        <inline-loading
          v-show="loveCollections.curPage !== 0 && isLoading">
        </inline-loading>
        <divider
          v-show="loveCollections.data.length && !loveCollections.nextPageUrl"
          class="g-divider p-divider">
          沒有更多了
        </divider>
      </group>
    </div>
    <span
      @click="toBook"
      class="btn">
      我要下單
    </span>
    <div v-transfer-dom>
      <confirm
        class="book"
        v-model="show"
        hide-on-blur
        theme="android">
        <div class="book-confirm">
          <section-title
            class="book-confirm-title"
            title="快遞預約">
          </section-title>
          <div class="info-item">
            <x-number
              title="數量"
              :max="99"
              :min="1"
              fillable
              width="30px"
              button-style="round"
              v-model="quantity"
            />
          </div>
          <div class="info-item">
            <calendar
              disable-past
              class="book-calendar"
              title="上門取件時間"
              placeholder="請選擇日期"
              :disable-date-function="disableDateFunction"
              v-model="date">
            </calendar>
          </div>
          <div class="info-item">
            <selector
              direction="rtl"
              title="時段"
              placeholder="偏好收貨時段"
              :options="periodOptions"
              v-model="period"
            />
          </div>
          <div class="info-item">
            <x-input
              title="姓名"
              text-align="right"
              placeholder="請輸入"
              required
              :isType="checkName"
              :min="1"
              v-model.trim="name"
            >
            </x-input>
          </div>
          <div class="info-item">
            <x-input
              title="電話號碼"
              text-align="right"
              placeholder="請輸入"
              required
              :is-type="checkPhone"
              v-model="phone"
            />
          </div>
          <div class="info-item">
            <popup-picker
              title="地區選擇"
              :data="areaMapLists"
              :columns="3"
              v-model="site"
            />
          </div>
          <div class="info-item">
            <x-input
              title="詳細地址"
              text-align="right"
              required
              placeholder="請輸入詳細地址"
              v-model="address"
            />
          </div>
          <div
            class="save-btn"
            @click="onConfirm">
            確認下單
          </div>
        </div>
        <span class="close" @click="cancelConfirm"></span>
      </confirm>
    </div>
    <ship-sn
      :image="image"
      @toggleShow="toggleShow"
      :is-show="showShipSn">
    </ship-sn>
    <tracking-dialog
      :sn="trackSn"
      :show="showTrackDlg"
      @close="closeTrackDlg"/>
  </div>
</template>

<script>
import {mapActions, mapState, mapMutations} from 'vuex'
// import { is_tomorrow as isTomorrow, format } from 'date-fns'
import isTomorrow from 'date-fns/is_tomorrow'
import UserLoveBox from '@/components/UserLoveBox'
import {Confirm, TransferDomDirective as TransferDom,
  XNumber, Calendar, Group, CellBox, Divider, PopupPicker, Selector} from 'vux'
import SectionTitle from '@/components/Title'
import ShipSn from '@/components/ShipSn'
import format from 'date-fns/format'
import infiniteScroll from 'vue-infinite-scroll'
import InlineLoading from '@/components/InlineLoading'
import {holidays} from '@/tools/constant'
import { telRegex, nameRegex } from '@/tools/regex'
import {mapGeo} from '@/tools/strMap'
import anchorMixin from '@/mixins/anchor'
import TrackingDialog from '@/components/TrackingDialog'

export default {
  mixins: [anchorMixin],
  directives: {
    TransferDom,
    infiniteScroll
  },
  components: {
    UserLoveBox,
    Confirm,
    SectionTitle,
    XNumber,
    Calendar,
    ShipSn,
    Group,
    CellBox,
    InlineLoading,
    Divider,
    PopupPicker,
    Selector,
    TrackingDialog
  },
  data () {
    return {
      show: false,
      quantity: 1,
      date: '',
      loveBoxs: [],
      isBook: false,
      image: '',
      showShipSn: false,
      name: '',
      phone: '',
      period: '',
      site: [''],
      address: '',
      periodOptions: [
        '上午',
        '下午',
        '皆可'
      ],
      disableDateFunction (date) {
        let result
        if (date.weekDay === 0) {
          result = true
        }

        const now = new Date()
        const currentHours = now.getHours()
        if (date.formatedDate === format(now, 'YYYY-MM-DD')) {
          result = true
        }

        if (currentHours >= 17 && currentHours <= 23 && isTomorrow(date.formatedDate)) {
          result = true
        }

        if (holidays.some(holiday => holiday === date.formatedDate)) {
          result = true
        }
        return result
      },
      isLoading: false,
      checkPhone: (val) => {
        return {
          valid: telRegex.test(val),
          msg: '請輸入正確手機號碼'
        }
      },
      checkName: (val) => {
        return {
          valid: nameRegex.test(val),
          msg: '請輸入正確姓名'
        }
      },
      showTrackDlg: false,
      trackSn: ''
    }
  },
  created () {
    if (!this.areaMapLists.length) {
      this.getGeoConfig()
    }

    if (this.userInfo) {
      const {others, name, phone} = this.userInfo
      this.name = name
      this.phone = phone
      if (others.addresses && others.addresses.things) {
        const {things} = others.addresses
        this.site = [things.city, things.district]
        this.address = things.address
      }
    }
  },
  methods: {
    ...mapActions({
      getMyLoveCollections: 'getMyLoveCollections',
      bookLoveCollections: 'bookLoveCollections',
      getGeoConfig: 'getGeoConfig'
    }),
    ...mapMutations({
      addMyLoveCollections: 'addMyLoveCollections'
    }),
    toBook () {
      this.show = true
    },
    onConfirm () {
      if (!this.date) {
        this.$vux.toast.text('請選擇上門時間', 'bottom')
        return
      }

      if (!this.name || !this.phone) {
        this.$vux.toast.text('請收件人完善信息', 'bottom')
        return
      }

      if (this.site.length < 2 || !this.address) {
        this.$vux.toast.text('請完善地址信息', 'bottom')
        return
      }
      if (this.isBook) {
        return
      }
      this.isBook = true
      const params = {
        box_count: this.quantity,
        collect_at: this.date,
        name: this.name,
        phone: this.phone,
        period: this.period,
        city: this.site[0] || '',
        district: this.site[1] || '',
        address: this.address
      }
      this.bookLoveCollections({
        params,
        cb: (data) => {
          this.isBook = false
          this.show = false
          if (data.error) {
            return this.$vux.toast.text('下單失敗，請稍後重試', 'bottom')
          } else {
            this.addMyLoveCollections({data})
            this.image = data.image_url
            this.$vux.toast.text('下單成功', 'bottom')
            setTimeout(() => {
              this.showShipSn = true
            }, 1000)
          }
        }
      })
    },
    cancelConfirm () {
      this.show = false
    },
    toggleShow () {
      this.showShipSn = false
    },
    loadMore () {
      if (this.loveCollections.nextPageUrl) {
        this.busy = true
        const curPage = this.loveCollections.curPage
        this.isLoading = true
        if (curPage === 0) {
          this.$Loading.show()
        }
        this.getMyLoveCollections({
          page: curPage + 1,
          cb: this.loadMoreCb
        })
      }
    },
    loadMoreCb () {
      // this.$vux.loading.hide()
      if (this.loveCollections.curPage === 1) {
        this.$Loading.hide()
      }
      this.isLoading = false
      if (this.nextPageUrl) {
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
  computed: {
    ...mapState({
      loveCollections: state => state.lovebox.loveCollections,
      geoConfig: state => state.configs.geoConfig,
      userInfo: state => state.user.userInfo
    }),
    areaMapLists () {
      return mapGeo(this.geoConfig)
    }
  },
  mounted () {
    this.initAnchor('userLovePanel')
  }
}
</script>

<style lang="less">
@import '../../global.mixin.less';
.user-love{
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
.book-confirm{
  .info-item{
    height: 50px;
    line-height: 50px;
    .g-border-1px;
    .weui-cell{
      margin-top: 0;
      padding: 0;
      &:before, &:after{
        border: none;
        display: none;
      }
      .vux-number-round{
        .vux-number-input{
          width: 32px !important;
          font-size: @font-S3;
        }
        .vux-number-selector{
          border: none;
          svg {
            fill: #FFF;
          }
          &.vux-number-selector-sub, &.vux-number-selector-plus{
            padding: 0;
            background: @color-CR;
          }
          &.vux-number-disabled{
            background: @color-DSA;
          }
        }
      }
      .vux-number-input{
        padding: 0;
        color: @color-font-C3;
        font-size: @font-S3;
      }
    }
    .vux-calendar{
      &:before{
        display: none;
      }
      .weui-cell{
        .vux-cell-bd{
          .vux-label{
            color: @color-font-C1;
            font-size: @font-S3;
          }
        }
        .weui-cell__ft{
          .vux-cell-placeholder{
            font-size: @font-S3;
          }
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../global.mixin.less';
  .user-love{
    height: 100%;
    .container{
      height: calc(~"100% - 50px");
      &-wrapper{
        height: 100%;
        overflow-y: scroll;
        background: #FFF;
      }
      .item{
        padding: 0 @pm-bg;
        border-bottom: 10px solid @color-CL;
        background: #FFF;
      }
      .oops{
        margin-top: 100px;
        color: @color-font-C2;
        font-size: @font-S3;
        text-align: center;
      }
      .p-divider{
        padding: @pm-bg 0!important;
      }
    }
    .btn{
      display: block;
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: #FFF;
      font-size: @font-S2;
      background: @color-CR;
    }
  }
  .book-confirm{
    .book-confirm-title{
      padding-bottom: @pm-lg;
      .g-border-1px;
    }
    .info-item{
      &:nth-of-type(2){
        margin-top: 20px;
      }
    }
    .save-btn{
      height: 40px;
      line-height: 40px;
      color: #FFF;
      font-size: @font-S2;
      text-align: center;
      border-radius: 3px;
      background: @color-CR;
    }
  }
</style>
