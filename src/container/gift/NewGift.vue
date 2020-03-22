<template>
  <div class="newgift-container">
    <x-header
      title="上傳禮物"
      :left-options="{
        preventGoBack: true
      }"
      @on-click-back="preventBack">
    </x-header>
    <div class="newgift-step-first" v-show="step === 1">
      <group class="newgift-content-panel-imgs">
        <img-upload
          type="gift"
          :imgloaded="imgloaded"
          :removeImg="removeImg"
          :isLoaded="isImgLoaded"
          :imgList="imgLists"
          :multiple="true"
          :maxLength="3"
          @upLoading="upLoadingImg">
        </img-upload>
      </group>
      <group class="newgift-content-panel">
        <div class="gift-name">
          <x-input
            class="star"
            title="禮物名稱"
            :max="20"
            :min="1"
            required
            v-model.trim="newGift.title"
            text-align="right"
            placeholder="請輸入"
            @on-change="calculateGiftName"
          />
          <span class="counter">{{giftNameLength}}/20</span>
        </div>
        <popup-picker
          class="star"
          title="物品分類"
          :data="thingOptions"
          v-model="newGift.category_label"
          @on-change="(e) => handleChangePopupPicker(e, 'category')"
        />
        <popup-picker
          class="star"
          title="禮物總價值"
          :data="valuationOptions"
          v-model="newGift.valuation_label"
          @on-change="(e) => handleChangePopupPicker(e, 'valuation')"
        />
        <div class="vux-cell-box">
          <div class="weui-cell">
            <div class="weui-cell__hd star"><label class="weui-label">物品狀況</label></div>
            <div class="weui-cell__bd" style="text-align: right">
              <zc-radio
                :radioList="radioList.isNew"
                v-model="newGift.isNew">
              </zc-radio>
            </div>
          </div>
        </div>
        <x-number
          class="star-p"
          title="數量"
          :max="50"
          :min="1"
          fillable
          width="30px"
          button-style="round"
          v-model="newGift.quantity"/>
        <x-textarea
          :max="500"
          :row="5"
          :height="150"
          v-model.trim="newGift.desc"
          title="物品描述"
          placeholder="請輸入您的描述內容"/>
      </group>
      <div class="btn-box">
        <x-button @click.native="nextStep" class="g-without-bRadius" type="warn" text="下一步">
        </x-button>
      </div>
    </div>
    <div class="newgift-step-second" v-show="step === 2">
      <div class="newgift-step-second-wrapper">
        <group class="section-ships">
          <div class="ships">
            <ship-way @shipWay="setShipWay" type="gift">
            </ship-way>
          </div>
        </group>
        <group
          v-if="(shipWay.bundle[0].isSelected && shipWay.bundle[0].fareWay === 'receiver') ||
          (shipWay.bundle[2].isSelected && shipWay.bundle[2].fareWay === 'receiver')"
            class="section-bank">
            <span class="g-title">匯款銀行<small>(選填)</small></span>
            <PopupPicker :data="banklist"
                         title="匯款銀行1"
                         class="content vux-1px g-smooth"
                         :show="showPicker"
                         v-model="newGift.bank1"
                         :columns="1">
            </PopupPicker>
            <PopupPicker :data="banklist"
                         title="匯款銀行2"
                         class="content vux-1px g-smooth"
                         :show="showPicker"
                         v-model="newGift.bank2"
                         :columns="1">
            </PopupPicker>
          </group>
          <group class="section-prior">
            <section-title title="公益團體優先索取">
            </section-title>
            <zc-radio
              class="prior-radios"
              :radioList="radioList.prior"
              v-model="newGift.orgFirst">
            </zc-radio>
          </group>
          <group class="section-date">
            <section-title title="刊登日期">
            </section-title>
            <datetime
              title="刊登日期"
              v-model="newGift.date"
              :default-selected-value="today"
              :start-date="today"
              confirm-text="確定"
              :end-date="endDate">
            </datetime>
            <span class="g-desc">
              若您不希望立即刊登，請點擊日曆設定刊登日期，刊登期最長15天
            </span>
          </group>
      </div>
      <div class="btn-box">
        <flexbox :gutter="0">
          <flexbox-item>
            <x-button
              class="g-without-bRadius prestep"
              type="warn"
              @click.native="preStep">
              上一步
            </x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button
              class="g-without-bRadius nextstep"
              type="warn" @click.native="nextStep">
              確定刊登
            </x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <div class="newgift-step-third" v-show="step === 3">
      <result-page
        :icon="SuccessSendIcon"
        title="恭喜您完成上架"
        desc="分享到Facebook，讓好友都來領取吧"
        :menus="[{
          text: '分享',
          func: () => {
            this.handleShare()
          },
          type: 'primary'
        }, {
          text: '回到首頁',
          func: () => {
            this.$router.push('/')
          },
          type: 'primary'
        }]"
      >
        <template v-if="onGoing" slot="activeLink">
          <router-link :to="projectInfo.link" :style="`color: ${projectInfo.color}`">
            {{projectInfo.name}}
          </router-link>
        </template>
      </result-page>
      <share-bar
        :url="shareInfo.url"
        :title="shareInfo.title"
        :desc="shareInfo.desc"
        :image="shareInfo.image"
        :shareSuc="shareSuc"
        @hideShareBar="handleShare"
        :is-show="isShowShareBar"
      >
      </share-bar>
    </div>
  </div>
</template>

<script>
import format from 'date-fns/format'
import addDays from 'date-fns/add_days'
// import { format, add_days as addDays } from 'date-fns'
import { XInput, Group, PopupPicker, XButton, XNumber, XTextarea, Datetime, Flexbox, FlexboxItem } from 'vux'
import resultPage from '@/components/ResultPage'
import { filterOptionsGift, valuationList, banklist, projectInfo } from '@/tools/constant'
import ZcRadio from '@/components/ZcRadio'
import ImgUpload from '@/components/ImgUpload'
import ShipWay from '@/components/ShipWay'
import UploadIcon from '@/assets/img/com_list_ic_picture_add_normal@2x.png'
import SuccessSendIcon from '@/assets/img/gift_pic_putaway_succeed@2x.png'
import SectionTitle from '@/components/Title'
import { mapState, mapActions } from 'vuex'
import ShareBar from '@/components/ShareBar'
import { doClickSendNewGift } from '@/tools/GAEvent'

export default {
  components: {
    XInput,
    Group,
    PopupPicker,
    XButton,
    XNumber,
    XTextarea,
    resultPage,
    Datetime,
    ZcRadio,
    ImgUpload,
    Flexbox,
    FlexboxItem,
    SectionTitle,
    ShipWay,
    ShareBar
  },
  data () {
    return {
      projectInfo,
      currentYear: new Date().getFullYear(),
      today: format(new Date(), 'YYYY/MM/DD'),
      SuccessSendIcon,
      UploadIcon,
      banklist,
      isShowShareBar: false,
      shareInfo: {
        title: '',
        desc: '',
        image: '',
        url: ''
      },
      imgLists: [],
      giftNameLength: 0,
      ships: ['fami', 'hct', 'others', 'meet', 'homeng'],
      showPicker: false,
      radioList: {
        isNew: [{
          text: '全新',
          value: 1,
          id: 'new'
        }, {
          text: '二手',
          value: 0,
          id: 'old'
        }],
        prior: [{
          text: '暫無優先',
          value: 0,
          id: 'prior-0'
        }, {
          text: '公益團體優先',
          value: 1,
          id: 'prior-1'
        }, {
          text: '台北市社會局優先',
          value: 2,
          id: 'prior-2'
        }]
      },
      step: 1,
      maxStep: 3,
      newGift: {
        quantity: 1,
        category_label: [],
        valuation_label: [],
        title: '',
        desc: '',
        // formatDesc: '',
        isNew: '',
        address: '',
        city: '',
        district: '',
        gift_images: [],
        gift_ships: [],
        orgFirst: 0,
        bank1: ['無'],
        bank2: ['無'],
        date: '', // 刊登日期
        prior: 1
      },
      shipWay: {
        bundle: [{
          isSelected: false,
          fareWay: 'receiver',
          fare: 60
        }, {
          isSelected: false,
          fareWay: 'pod',
          fare: 150
        }, {
          isSelected: false,
          fareWay: 'receiver',
          fare: ''
        }, {
          isSelected: false,
          fareWay: 'pod',
          fare: ''
        }, {
          isSelected: false,
          fareWay: 'pod',
          fare: ''
        }],
        area: [],
        location: ''
      },
      thingOptions: [filterOptionsGift.category.map(item => item.label)],
      valuationOptions: [valuationList.map(item => item.label)],
      isImgLoaded: false,
      onGoing: false
    }
  },
  created () {
    const now = new Date()
    this.onGoing = now - new Date(this.projectInfo.startTime) >= 0 && now - new Date(this.projectInfo.endTime) < 0

    this.banklist = banklist.map((v) => {
      return {
        name: `${v.code} ${v.name}`,
        value: `${v.code} ${v.name}`
      }
    })
    this.newGift.date = format(new Date(), 'YYYY/MM/DD')
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      return this.getLoginUserInfo({cb: this.getLoginUserInfoCb})
    }
    this.getLoginUserInfoCb()
  },
  methods: {
    ...mapActions({
      publishGift: 'publishGift',
      getLoginUserInfo: 'getLoginUserInfo'
    }),
    preventBack () {
      console.log('enter')
      if (this.step === 1 || this.step === this.maxStep) {
        this.$router.go(-1)
      } else {
        this.step = this.step - 1
      }
    },
    getLoginUserInfoCb () {
      const {others} = this.userInfo
      if (others) {
        if (others.banks && others.banks.length) {
          const [{banks: banks1}, {banks: banks2}] = others.banks
          const bank1 = banklist.find(item => item.code === banks1.trim())
          const bank2 = banklist.find(item => item.code === banks2.trim())
          if (bank1) {
            this.newGift.bank1 = [bank1.code, bank1.name]
          }
          if (bank2) {
            this.newGift.bank2 = [bank2.code, bank2.name]
          }
        }
      }
    },
    handleChangePopupPicker (e, type) {
      const filter = type === 'category' ? filterOptionsGift.category : valuationList
      this.newGift[`${type}_label`] = e
      this.newGift[`${type}_id`] = filter.find(item => item.label === e[0]).key
    },
    nextStep () {
      const {title, isNew} = this.newGift
      // 发布礼物第一步表单验证
      if (this.step === 1) {
        if (!title.trim()) {
          return this.$vux.toast.text('請輸入禮物名稱', 'bottom')
        } else if (!this.newGift.category_label[0]) {
          return this.$vux.toast.text('請選擇物品分類', 'bottom')
        } else if (!this.newGift.valuation_label[0]) {
          return this.$vux.toast.text('請選擇禮物價值', 'bottom')
        } else if (typeof isNew === 'string' && !isNew) {
          return this.$vux.toast.text('請選擇物品物品狀況', 'bottom')
        }
      }

      // 发布礼物第二步表单验证
      if (this.step === 2) {
        const {bundle} = this.shipWay
        if (!bundle.some((item) => item.isSelected)) {
          return this.$vux.toast.text('請選擇寄送方式', 'bottom')
        }
        // else if (bundle[3].isSelected) {
        //   if (!`${area[0]}`) {
        //     return this.$vux.toast.text('請選擇需求所在市區', 'bottom')
        //   } else if (!location.trim().length) {
        //     return this.$vux.toast.text('請輸入詳細地址', 'bottom')
        //   }
        // }
        const giftShips = bundle.filter(item => item.isSelected).map(item => ({
          shipway: item.key,
          shipfee: item.fare || 0,
          shipopts: item.fareWay
        }))
        const others = this.$store.state.user.userInfo.others
        let things = {
          city: '',
          district: '',
          address: ''
        }
        if (others) {
          const { addresses } = others
          // 对用户地址做默认处理
          if (addresses && addresses.things) {
            things = addresses.things
          }
        }
        const {title, isNew, quantity, bank1, bank2, orgFirst, date, desc} = this.newGift
        // 設置刊登時分秒
        const currentTime = new Date()
        const curDate = format(new Date(), 'YYYY/MM/DD')
        let currentHms = currentTime.getHours() +
          ':' + currentTime.getMinutes() +
          ':' + currentTime.getSeconds()
        if (curDate !== date) {
          currentHms = '00:00:00'
        }
        const data = {
          gift_images: this.imgLists.length ? this.imgLists.map(item => ({ path: item.url })) : [],
          image_path: this.imgLists.length ? this.imgLists[0].url : '',
          title,
          category_id: this.newGift.category_id,
          valuation: this.newGift.valuation_id,
          is_new: isNew,
          quantity,
          desc,
          gift_ships: giftShips,
          bank_1: bank1[0].replace(/[^0-9]/ig, ''),
          bank_2: bank2[0].replace(/[^0-9]/ig, ''),
          org_first: orgFirst === 1 ? '1' : '0',
          bureau_id: orgFirst === 2 ? '1' : '0',
          // 获取当前的时分秒
          show_at: `${date.replace(/-/g, '/') + ' ' + currentHms}`,
          city: things.city,
          district: things.district,
          address: things.address
        }
        this.publishGift({data, cb: this.publishGiftCb})
        return this.$vux.loading.show({
          text: '發佈中...'
        })
      }
      this.step += 1
    },
    publishGiftCb (data) {
      doClickSendNewGift()
      const {title, desc, image_path: image, id} = data
      this.shareInfo = {
        title,
        desc,
        image,
        url: `${window.location.origin}/gift/${id}`
      }
      this.$vux.loading.hide()
      this.step += 1
    },
    preStep () {
      if (this.step > 1) {
        this.step = this.step - 1
      }
    },
    // 上传图片
    upLoadingImg () {
      this.isImgLoaded = true
    },
    imgloaded (data) {
      for (let img of data) {
        this.imgLists.push({url: img.url})
      }
      this.isImgLoaded = false
    },
    // 删除图片
    removeImg (index) {
      this.imgLists = this.imgLists.filter((item, idx) => idx !== index)
    },
    setShipWay (data) {
      this.shipWay = data.mode
    },
    calculateGiftName (val) {
      this.giftNameLength = val.trim().length
    },
    // 分享
    handleShare () {
      this.isShowShareBar = !this.isShowShareBar
    },
    shareSuc () {
      this.$vux.toast.text('分享成功', 'bottom')
      this.handleShare()
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    endDate () {
      return format(addDays(new Date(), 15), 'YYYY/MM/DD')
    }
  }
}
</script>

<style lang="less">
  .newgift-container{
    .vux-number-selector,
    .vux-number-input{
      box-sizing: content-box;
    }
    .weui-cells, .weui-cell, .weui-cell-box{
      margin-top: 0;
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
    .newgift-content-panel{
      flex: 1;
      .weui-cells{
        padding: 0 @pm-bg;
        .weui-cell{
          height: 44px;
          line-height: 44px;
          &:before{
            left: 0;
          }
          .weui-cell__hd .weui-label{
            color: @color-font-C1;
            font-size: 15px;
          }
          .weui-cell__bd .weui-input, .vux-cell-primary .vux-popup-picker-select .vux-cell-value{
            color: @color-font-C1;
            font-size: @font-S3;
          }
          .weui-cell__ft{
            .weui-icon-warn{
              font-size: 18px;
              &:before{
                font-size: 18px;
              }
            }
          }
          &.vux-x-textarea{
            height: auto;
            display: block;
            .weui-cell__hd{
              height: auto;
              line-height: 1;
              padding: @pm-md 0;
            }
            .weui-cell__bd{
              line-height: 24px;
              font-size: @font-S3;
              border: 1px solid @color-CBG;
              padding: @pm-bg;
              .weui-textarea-counter{
                height: 24px;
                line-height: 24px;
              }
            }
          }
        }
        .weui-cell.weui-cell_warn .weui-cell__hd .weui-label {
            color: #E64340!important;
        }
        .vux-toast {
          line-height: 20px;
          height: 20px;
        }
      }
      .vux-cell-box{
        &:before{
          left: 0;
        }
        .weui-cell__hd{
          color: @color-font-C1;
          font-size: 15px;
        }
        .weui-cell__bd .radioItem label{
          color: @color-font-C3;
          font-size: @font-S3;
        }
      }
    }
    .newgift-step-first{
      .weui-cells{
        padding: 0;
        margin: 0 @pm-bg;
        border: none;
        .weui-cell{
          padding-left: 0;
          padding-right: 0;
        }
      }
    }
    .newgift-step-second{
      .weui-cells{
        .vux-cell-box{
          &:before{
            display: none;
            border: none;
          }
        }
      }
      .section-bank{
        .vux-cell-box{
          padding: @pm-md 0;
          &:last-child{
            padding-bottom: 0;
          }
          .weui-cell{
            padding: 0;
            .weui-cell__hd{
              .weui-label{
                color: @color-font-C2;
                font-size: @font-S3;
              }
            }
            .vux-cell-primary{
              .vux-popup-picker-value{
                color: @color-font-C1;
                font-size: @font-S3;
              }
            }
          }
        }
      }
      .section-prior{
        .prior-radios{
          .radioItem{
            label{
              color: @color-font-C1;
              font-size: @font-S3;
            }
          }
        }
      }
      .section-date{
        .weui-cells{
          .weui-cell{
            padding: @pm-md 0;
            color: @color-font-C1;
            font-size: @font-S3;
          }
        }
      }
    }
    .star {
      .weui-label {
        &:after{
          content: "*";
          display: inline-block;
          width: 6px;
          height: 6px;
          color: @color-CR;
        }
      }
    }
    .star-p {
      p {
       &:after{
          content: "*";
          display: inline-block;
          width: 6px;
          height: 6px;
          color: @color-CR;
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .newgift-container{
    height: 100%;
    display: flex;
    flex-direction: column;
    .content{
      height: calc(~"100% - 44px");
    }
    .newgift-step-first,
    .newgift-step-second,
    .newgift-step-third{
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;

      .prestep{
        background-color: white;
        color: black;
        border-top: 1px solid #ccc;
        height: 42px;
      }
      .prestep,
      .nextstep{
        &:after{
          display: none;
          border: none;
        }
      }
    }
    .newgift-step-first{
      // padding: @pm-bg @pm-bg 42px;
      .newgift-content-panel-imgs{
        padding: @pm-bg 0;
        border-bottom: @pm-bg solid @color-CBG;
      }
      .gift-name{
        position: relative;
        padding-right: 40px;
        .counter{
          position: absolute;
          top: 0;
          right: 0;
          padding: @pm-md 0;
          box-sizing: border-box;
          height: 44px;
          line-height: 24px;
          color: @color-font-C3;
          font-size: @font-S4;
        }
      }
    }
    .newgift-step-second{
      display: flex;
      flex-direction: column;
      &-wrapper{
        flex: 1;
        padding: 0 15px 0;
      }
      .prior-radios{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin: @pm-sm 0 0 0;
        height: 92px;
        .radioItem{
          label{
            font-size: 10px;
          }
        }
      }
      .section-ships, .section-bank, .section-prior, .section-date{
        padding: @pm-md 0;
      }
    }
    .required {
      color: #E64340;
    }
  }
</style>
