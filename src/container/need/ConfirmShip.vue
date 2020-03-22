<template>
  <!-- 赠送礼物页面 -->
  <div class="pad-confrim-ship">
    <x-header title="確認運送細節">
    </x-header>
    <div class="g-block content g-smooth">
      <div class="section">
        <span class="g-title">選擇贈送數量</span>
        <div class="card-select-gift">
          <div class="image" :style="'background-image: url(' + gift.pic + ')'"></div>
          <span class="text-gift-name">{{gift.name}}</span>
          <Counter class="right"
                   :max="max"
                   :min="1"
                   :doUpdate="doUpdateAmount"
                   :value="bundle.quantity">
          </Counter>
        </div>
      </div>
      <div class="section">
      <span class="g-title">
        確認運送細節 <small>/ {{ shipway | shipway }}</small>
      </span>
        <div class="x-row">
          <x-input type="text"
                   title="寄件人姓名"
                   placeholder="請輸入"
                   v-model="bundle.giver_name" >
          </x-input>

        </div>
        <span class="tips">
        請輸入寄件人全名，請勿填寫其他名稱或機構名稱
      </span>
        <div class="x-row">
          <x-input type="text"
                   :max="10"
                   :min="10"
                   title="寄件人手機號碼"
                   placeholder="請輸入"
                   v-model="bundle.giver_phone" >
          </x-input>
        </div>
        <span class="tips" v-if="shipway !== Shipways.SHIPWAY_MEET">
        手機號碼如有變動，請先更新會員資料
      </span>
        <span class="tips more" v-if="shipway === Shipways.SHIPWAY_MEET">
        贈送者可以不提供手機號碼
      </span>
      </div>
      <!--  確認寄件人地址 -->
      <div class="section"
           v-if="shipway !== Shipways.SHIPWAY_FAMI">
      <span class="g-title">
        {{ shipway === Shipways.SHIPWAY_MEET ? '確認面交地點' : '確認寄件人地址' }}
      </span>
        <div class="x-row">
          <label >所在市區</label>
          <PopupPicker :data="areaMapLists"
                       :columns="3"
                       class="content area-picker"
                       v-model="area"
                       placeholder="請選擇所在市區"
                       @on-change="onChangeArea"
                       :show="showPicker">
          </PopupPicker>
        </div>
        <div class="x-row">
          <x-input type="text"
                   title="詳細地點"
                   placeholder="請輸入"
                   required
                   v-model="bundle.giver_address" >
          </x-input>
        </div>
        <span class="tips more" v-if="shipway === Shipways.SHIPWAY_MEET">
        贈送者可以不提供詳細面交地點
      </span>
      </div>
      <!-- 確認匯款資訊板塊 -->
      <div class="section"
           v-if="shipway === Shipways.SHIPWAY_FAMI || shipway === Shipways.SHIPWAY_OTHERS">
      <span class="g-title">
        確認匯款資訊 <small>/ {{ shipway | shipway }}</small>
      </span>
        <div class="x-row">
          <x-input type="number"
                   title="運費金額（元）"
                   placeholder="請輸入"
                   v-model="bundle.shipfee" >
          </x-input>
        </div>
        <div class="x-row">
          <label >匯款銀行</label>
          <!--<span class="degree">-->
          <!--<img src="./../../assets/icon/message/icon-arrow-down.png" alt="">-->
          <!--</span>-->
          <PopupPicker :data="banklist"
                       class="content bank-picker"
                       v-model="chooseBank"
                       @on-change="onChangeBank"
                       :columns="1"
                       :show="showPicker">
          </PopupPicker>
        </div>
        <div class="x-row">
          <x-input type="text"
                   title="分行"
                   placeholder="請輸入"
                   v-model="bundle.giver_bank_branch" >
          </x-input>
        </div>
        <div class="x-row">
          <x-input type="text"
                   title="匯款戶名"
                   required
                   placeholder="請輸入"
                   v-model="bundle.giver_bank_account_name">
          </x-input>
        </div>
        <div class="x-row">
          <x-input type="text"
                   title="帳號"
                   placeholder="請輸入14位銀行帳號"
                   :max="14"
                   :min="14"
                   v-model="bundle.giver_bank_account_number">
          </x-input>
        </div>
      </div>
      <!-- 其他信息板块 -->
      <div v-if="shipway === Shipways.SHIPWAY_HCT" class="section">
      <span class="g-title">
        其他信息
      </span>
        <div>
          <div class="x-row" >
            <label >寄件箱數</label>
            <div class="content">
              <Counter class="right"
                       style="margin-top: 15px"
                       :max="20"
                       :doUpdate="doUpdateBoxes"
                       :value="bundle.giver_boxes">
              </Counter>
            </div>
          </div>
          <div class="x-row" >
            <x-input type="number"
                     title="運費金額（元）"
                     readonly
                     placeholder="請輸入"
                     v-model="bundle.shipfee">
            </x-input>
          </div>
          <span class="tips" style="color: #636363">
          新竹物流運費一箱 150 元
        </span>
          <div class="x-row">
            <calendar title="到府收件日期"
                      v-model="sendDate"
                      :disable-date-function="_getDisableDate"
                      @on-change="onChangeDate"
                      :disable-past="true">
            </calendar>
          </div>
          <span class="tips special">
          配合政府《勞動基準法》一例一休制法規調整，新竹物流自106年1月1日起，遇假日（週日、國定假日及其補假）停止集貨及配送服務，造成不便之處，敬請見諒。
        </span>
        </div>
        <div class="x-row"
             v-if="shipway === Shipways.SHIPWAY_HOMENG">
          <label class="for-checkbox" for="checkbox">是否有電梯</label>
          <div class="content" >
            <input style="margin-top: 12px"
                   class="g-input"
                   id="checkbox"
                   v-model="bundle.giver_has_lift"
                   type="checkbox">
          </div>
        </div>
      </div>
      <!-- 贺盟物流温馨提示 -->
      <div class="section" v-if="shipway === Shipways.SHIPWAY_HOMENG">
      <span class="g-title">
        賀盟物流溫馨提示
      </span>
        <span class="tips">
        最終運費將由Give543管理員email報價給寄收雙方，如付款方確認要寄送，將由物流士主動聯繫雙方寄收日期
        <a href="https://www.give543.com/static/homeng/homeng_charge.jpg" target="_blank" rel="noopener">查看價位表</a>
      </span>
      </div>
      <!-- 寄件提示 -->
      <div class="section">
      <span class="g-title">
        提示
      </span>
        <span class="tips" style="color: #636363">
        確認送出後即成立線上寄件單，將無法更改，請正確填寫
      </span>
      </div>
      <button class="g-button red" @click="doSend">
        確認送出
      </button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import isTomorrow from 'date-fns/is_tomorrow'
import isSunday from 'date-fns/is_sunday'
// import { is_sunday as isSunday, is_tomorrow as isTomorrow, format } from 'date-fns/'
import Counter from '@/components/Counter'
import { getDate } from '@/tools/datetime'
import { banklist, Shipways, holidays } from '@/tools/constant'
import { isPhone, mapGeo } from '@/tools/strMap'
import NeedApi from './../../store/apis/need'
import { PopupPicker, XInput, Calendar } from 'vux'
import { mapState, mapActions } from 'vuex'
import format from 'date-fns/format'

export default {
  components: {
    XInput,
    Counter,
    Calendar,
    PopupPicker
  },
  data () {
    return {
      bundle: {
        quantity: 1,
        shipopts: '',
        status: 'confirm_ship',
        giver_has_lift: 0, // 贈送者是否有電梯
        giver_boxes: 1, // 寄送的箱數
        giver_city: '',
        giver_address: ''
      },
      Shipways,
      banklist: [1, 2, 3, 4],
      showPicker: false,
      areaMapLists: [],
      chooseBank: ['無'],
      sendDate: 'TODAY',
      area: [],
      max: 1
    }
  },
  methods: {
    ...mapActions({
      getMyDonates: 'getMyDonates'
    }),
    doUpdateAmount (data) {
      this.bundle.quantity = data
    },
    doUpdateBoxes (data) {
      this.bundle = {
        ...this.bundle,
        giver_boxes: data,
        shipfee: data * 150
      }
    },
    doSend () {
      const { shipway } = this.$route.query
      let bundle = {}
      const { giver_name, giver_phone, giver_bank_account_number, giver_city, giver_address } = this.bundle
      if (!giver_name || !giver_phone) {
        return this.$vux.toast.text('請完善寄件人姓名和手機號碼', 'bottom')
      }
      if (!isPhone(giver_phone)) {
        return this.$vux.toast.text('請填寫正確的手機號碼', 'bottom')
      }
      if (!giver_city) {
        return this.$vux.toast.text('請選擇所在市區', 'bottom')
      }
      if (!giver_address) {
        return this.$vux.toast.text('請填入詳細地點', 'bottom')
      }
      bundle.giver_sent_at = this.sendDate.replace(/-/g, '/')
      switch (shipway) {
        case Shipways.SHIPWAY_MEET:
          bundle = this._analyseMeet()
          break
        case Shipways.SHIPWAY_FAMI:
          bundle = this._analyseFami()
          break
        case Shipways.SHIPWAY_HOMENG:
          bundle = this._analyseHomeng()
          break
        case Shipways.SHIPWAY_OTHERS:
          bundle = this._analyseOthers()
          break
        case Shipways.SHIPWAY_HCT:
          bundle = this._analyseHCT()
          break
        default:
          break
      }
      if (!bundle) {
        return
      }
      bundle.giver_number = giver_bank_account_number
      console.log('BUNDLE: ', bundle)

      this.$vux.loading.show({text: '發送中...'})
      NeedApi.confirmShip(bundle, (data) => {
        this.$vux.loading.hide()
        return this.$router.go(-1)
      })
    },
    onChangeArea () {
      const { area } = this
      this.bundle = {
        ...this.bundle,
        giver_city: area[0],
        giver_district: area[1],
      }
    },
    onChangeBank () {
      const { chooseBank } = this
      this.bundle = {
        ...this.bundle,
        giver_bank: chooseBank[0].split(' ')[0]
      }
    },
    onChangeDate () {
      const { sendDate } = this
      this.bundle = {
        ...this.bundle,
        giver_sent_at: sendDate.split('-').join('/')
      }
    },
    _getDisableDate (date) {
      let result
      if (date.weekDay === 0) {
        result = true
      }
      if (date.formatedDate === format(new Date(), 'YYYY-MM-DD')) {
        result = true
      }
      if (holidays.some(holiday => holiday === date.formatedDate)) {
        result = true
      }
      return result
    },
    // 驗證是否完善匯款信息
    _validateBankInfo () {
      const { bundle, chooseBank } = this
      const {
        giver_bank_account_number,
        giver_bank_branch,
        giver_bank_account_name
      } = bundle
      if (chooseBank[0].indexOf('無') !== -1) {
        this.$vux.toast.text('請選擇匯款銀行')
        return false
      }
      if (!giver_bank_account_number || !giver_bank_branch || !giver_bank_account_name) {
        this.$vux.toast.text('請完善匯款資訊')
        return false
      }
      return true
    },
    _analyseFami () {
      const { bundle } = this
      if (!this._validateBankInfo()) {
        return
      }
      return bundle
    },
    _analyseMeet () {
      const { bundle } = this
      const { shipway } = this.$route.query
      return {
        ...bundle,
        shipway
      }
    },
    _analyseHomeng () {
      const { area, bundle } = this
      const { giver_has_lift } = bundle
      return {
        ...bundle,
        giver_has_lift: giver_has_lift ? 1 : 0
      }
    },
    _analyseOthers () {
      const { bundle } = this
      if (!this._validateBankInfo()) {
        return
      }
      return bundle
    },
    _analyseHCT () {
      const { bundle } = this

      if (!bundle.giver_sent_at) {
        this.$vux.toast.text('請選擇新竹物流上門取件日期', 'bottom')
        return
      }

      if (this._analyDisabledDate(bundle.giver_sent_at)) {
        this.$vux.toast.text('當前日期新竹物流不提供集貨和配送服務，請重新選擇', 'bottom')
        return
      }

      // 因每日都向新竹固定时间抛单，因此下午5點后不允許選擇隔天上門取件，但是可以選擇更往後的日子
      const now = new Date()
      const currentHours = now.getHours()
      if (isTomorrow(bundle.giver_sent_at) && currentHours >= 17 && currentHours <= 23) {
        this.$vux.toast.text('下午5:00以後無法預約隔天到府收件,请重新選擇收件時間', 'bottom')
        return
      }
      return bundle
    },
    _analyDisabledDate (date) {
      let newDate = date.split('/').join('-')
      let flag = false
      if (newDate === format(new Date(), 'YYYY-MM-DD')) {
        flag = true
      }

      if (isSunday(newDate)) {
        flag = true
      }

      if (holidays.some(item => item === newDate)) {
        flag = true
      }
      return flag
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.userInfo
    })
  },
  created () {
    /**
     * id 為請求索取禮物的id   max是最大索取數  shipway是貨運方式
     */
    const nextDate = new Date()
    nextDate.setDate(nextDate.getDate() + (nextDate.getHours() >= 17 ? 2 : 1))
    this.sendDate = format(nextDate, 'YYYY-MM-DD')
    const { id, max, shipway, shipfee, name, pic, quantity } = this.$route.query
    const { name: giverName, cellphone: giverPhone, others } = this.user
    let city = ''
    let district = ''
    let address = ''
    let giver_bank = ''
    let giver_bank_account_name = ''
    let giver_bank_branch = ''
    let giver_bank_account_number
    if (others) {
      if (others.addresses && others.addresses.rcvs) {
        city = others.addresses.rcvs.city
        district = others.addresses.rcvs.district
        address = others.addresses.rcvs.address
        if (city && district) {
          this.area = [city, district]
        }
      }
      if (others.banks && others.banks.length !== 0) {
        for (let bank of others.banks) {
          const filterBanks = banklist.filter((item) => item.code === bank.banks)
          if (filterBanks.length > 0) {
            this.chooseBank = [`${filterBanks[0].code} ${filterBanks[0].name}`]
            giver_bank = bank.banks
            giver_bank_account_name = bank.title
            giver_bank_branch = bank.branchs
            giver_bank_account_number = bank.accounts
            break;
          }
        }
      }
    }
    this.shipway = shipway
    this.bundle = {
      ...this.bundle,
      giver_phone: giverPhone,
      giver_name: giverName,
      need_donate_id: id,
      giver_bank,
      giver_bank_account_name,
      giver_bank_branch,
      giver_bank_account_number,
      shipway,
      giver_city: city || '',
      giver_district: district || '',
      giver_address: address,
      shipfee: shipfee || 0,
      quantity: Number(quantity) || 1
    }

    if (this.shipway === 'hct') {
      this.onChangeDate()
    }

    this.max = parseInt(max)
    this.gift = { name, pic }
    // 獲取地址數據
    this.$store.dispatch('getGeoConfig', {cb: (data) => {
        this.areaMapLists = mapGeo(data)
      }})
    this.banklist = banklist.map((v) => {
      return {
        name: `${v.code} ${v.name}`,
        value: `${v.code} ${v.name}`
      }
    })
  }
}
</script>

<style lang="less">
  @import './../../global.style.less';
  @height-gift: 50px;
  @height-row: 44px;
  .pad-confrim-ship {
    .weui-cell {
      padding: 0!important;
      /*.weui-cell__ft {*/
        /*display: none;*/
      /*}*/
    }
    .area-picker, .bank-picker{
      .weui-cell{
        .weui-cell__ft{
          display: inline-block;
          width: 27px;
          height: 8px;
          &:after{
            width: 13px;
            height: 8px;
            background: #fff url('./../../assets/icon/message/icon-arrow-down.png') right center no-repeat;
            background-size: 13px 8px;
            transform: none;
            border: none;
          }
        }
      }
    }
    .vux-calendar {
      .weui-cell__ft {
        display: inline-block;
      }
    }
    .vux-cell-box:before, .vux-calendar:before {
      display: none;
    }
    &.g-block {
      background-color: white!important;
    }
    .g-title {
      margin-bottom: @pm-md;
      display: block;
      small {
        color: @color-font-C2;
        font-weight: 400;
      }
    }
    .card-select-gift {
      position: relative;
      height: @height-gift;
      background-color: @color-CO-LIGHT;
      .image {
        height: @height-gift;
        width: @height-gift;
        display: inline-block;
        background-color: @color-CL;
        background-size: cover;
        background-position: center;
      }
      .text-gift-name {
        line-height: @height-gift;
        width: calc(~'100% - 140px');
        height: @height-gift;
        vertical-align: top;
        color: @color-CR;
        font-size: @font-S3;
        font-weight: 600;
        display: inline-block;
        padding-left: @pm-sm;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .right {
        position: absolute;
        .center-vertical;
        right: @pm-md;
      }
    }
    .section {
      margin-bottom: @pm-lg;
      .tips {
        font-size: 12px;
        color: @color-font-C2;
        font-weight: 400;
        &.special {
          margin-top: 3px;
          line-height: 18px;
          color: @color-CR;
          text-align: justify;
          display: block;
        }
        &.more {
          color: @color-CO;
          font-weight: 400;
        }
        a {
          color: @color-CO;
          text-decoration: underline;
        }
      }
    }
    .x-row {
      position: relative;
      height: @height-row;
      width: 100%;
      display: block;
      border-bottom: 1px solid @color-CL;
      label, input[type="text"], .degree, .content {
        font-size: @font-S3;
        height: @height-row;
        line-height: @height-row;
      }
      label {
        width: 100px;
        display: inline-block;
        &.for-checkbox {
          width: calc(~"100% - 25px");
        }
        &.for-checkbox + div.content {
          width: 20px;
        }
      }
      .weui-cell input, .content {
        float: right;
        text-align: right;
        top: -1px;
        position: relative;
        background-color: transparent;
        border: none;
        outline: none;
        width: calc(~"100% - 140px");
      }
      input[type="text"] {
        width: 100%;
      }
      .degree {
        float: right;
        margin-left: @pm-md;
        img {
          opacity: .8;
          width: 15px;
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .pad-confrim-ship{
    height: 100%;
    > .content{
      height: calc(~"100% - 44px");
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      background-color: #FFF;
    }
  }
</style>
