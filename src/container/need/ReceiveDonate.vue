<template>
  <!-- 赠送礼物页面 -->
  <div class="pad-receive-donate">
    <x-header title="收下禮物">
    </x-header>
    <div class="g-block content g-smooth">
      <div class="section">
        <span class="g-title">確認收下的數量</span>
        <div class="card-select-gift">
          <div class="image" :style="'background-image: url(' + gift.pic + ')'"></div>
          <span class="text-gift-name">
          {{gift.name}} × {{ bundle.quantity }}
        </span>
        </div>
      </div>
      <div class="section">
      <span class="g-title">
        確認運送細節 <small>/ {{ shipway | shipway }}</small>
      </span>
        <span class="tips" v-if="shipway !== Shipways.SHIPWAY_MEET">
        採用{{ shipway | shipway }}交貨方式的費用為 <strong>NTD$ {{ bundle.shipfee }}</strong>
      </span>
        <div class="x-row" v-if="shipway === Shipways.SHIPWAY_FAMI">
          <popup-picker
            title="全家店號"
            :data="famiPickerData"
            :columns="3"
            v-model="famiCode"
            show-name
            @on-change="onChangeFami"
            @on-hide="toggleMoreInfo"
            @on-show="toggleMoreInfo"
          ></popup-picker>
        </div>
        <!-- <span class="tips more" v-if="shipway === Shipways.SHIPWAY_FAMI">
          {{ famiAddress }}
        </span> -->
        <div class="x-row">
          <x-input type="text"
                   title="收件人姓名"
                   placeholder="請輸入"
                   v-model="bundle.receiver_name" >
          </x-input>
        </div>
        <span class="tips" v-if="shipway !== Shipways.SHIPWAY_FAMI">
        請輸入收件人全名，請勿填寫其他名稱或機構名稱
      </span>
        <span class="tips" v-if="shipway === Shipways.SHIPWAY_FAMI">
        請輸入真實姓名，為保證雙方權益，取件時必須出示身份證件
      </span>
        <div class="x-row">
          <x-input type="text"
                   :max="10"
                   :min="10"
                   title="收件人手機號碼"
                   placeholder="請輸入"
                   v-model="bundle.receiver_phone" >
          </x-input>
        </div>
        <span class="tips" v-if="shipway !== Shipways.SHIPWAY_FAMI && shipway !== Shipways.SHIPWAY_MEET">
        手機號碼如有變動，請先更新會員資料
      </span>
        <span class="tips" v-if="shipway === Shipways.SHIPWAY_FAMI">
        請再次確認手機號碼，到店時將發送簡訊通知
      </span>
      </div>
      <!--  確認收件人地址 -->
      <div class="section"
           v-if="unneceAdr">
      <span class="g-title">
        確認收件人地址
      </span>
        <div class="x-row">
          <label >所在市區</label>
          <PopupPicker :data="areaMapList"
                       :columns="3"
                       class="content area-picker"
                       v-model="area"
                       @on-change="onChangeArea"
                       :show="showPicker">
          </PopupPicker>
        </div>
        <div class="x-row">
          <x-input type="text"
                   title="詳細地點"
                   placeholder="請輸入"
                   :required="unneceAdr"
                   v-model="bundle.address" >
          </x-input>
        </div>
      </div>
      <!-- 其他信息板块 -->
      <div class="section" v-if="shipway === Shipways.SHIPWAY_HOMENG">
      <span class="g-title">
        其他信息
      </span>
        <div class="x-row">
          <label class="for-checkbox" for="checkbox">是否有電梯</label>
          <div class="content" >
            <input style="margin-top: 12px"
                   class="g-input"
                   id="checkbox"
                   v-model="bundle.receiver_has_lift"
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
      <!-- 收件提示 -->
      <div class="section">
      <span class="g-title">
        提示
      </span>
        <span class="tips" style="color: #636363">
        確認收下後即成立線上寄件單，將無法更改，請正確填寫
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
import Counter from '@/components/Counter'
import { getDate } from '@/tools/datetime'
import { Shipways, holidays } from '@/tools/constant'
import { getBankFromCode, isPhone, mapGeo } from '@/tools/strMap'
import GiftAPI from './../../store/apis/gift'
import NeedAPI from './../../store/apis/need'
import { PopupPicker, Calendar } from 'vux'
import { mapState, mapActions } from 'vuex'
import moreInfoPickerMixin from '@/mixins/toggleMoreInfoPicker'
import { setDefaultFami } from '@/tools/ObjectHelper'

export default {
  mixins: [moreInfoPickerMixin],
  components: {
    Counter,
    Calendar,
    PopupPicker
  },
  data () {
    return {
      bundle: {
        shipopts: ''
      },
      Shipways,
      famiCode: ['', '', ''],
      famiAddress: '',
      showPicker: false,
      areaMapList: [],
      area: ['台北市', '中正區'],
      max: 1
    }
  },
  methods: {
    ...mapActions({
      getFamiConfig: 'getFamiConfig'
    }),
    doSend () {
      const { shipway } = this.$route.query
      let bundle = {}
      const { receiver_name, receiver_phone, receiver_city, address } = this.bundle
      if (shipway === Shipways.SHIPWAY_FAMI) {
        if (this.famiCode[2] === '無' || !this.famiCode[2]) {
          return this.$vux.toast.text('請完善全家店號', 'bottom')
        }
      }
      if (!receiver_name || !receiver_phone) {
        return this.$vux.toast.text('請完善寄件人姓名和手機號碼', 'bottom')
      }
      if (!isPhone(receiver_phone)) {
        return this.$vux.toast.text('請填寫正確的手機號碼', 'bottom')
      }
      if (shipway === Shipways.SHIPWAY_HCT || shipway === Shipways.SHIPWAY_OTHERS || shipway === Shipways.SHIPWAY_HOMENG) {
        if (!receiver_city) {
          return this.$vux.toast.text('請選擇所在市區', 'bottom')
        }
        if (!address) {
          return this.$vux.toast.text('請填入詳細地點', 'bottom')
        }
      }
      // bundle.giver_sent_at = getDate(Date.now(), 'YYYY/MM/DD')
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
        case Shipways.SHIPWAY_PALMBOX:
          bundle = this._analysePalmbox()
        default:
          break
      }
      if (!bundle) {
        return
      }
      // 因为参数通过url query传递，所以为了安全再检查一次
      if (bundle.shipway === Shipways.SHIPWAY_PALMBOX) {
        const { receiver_address, receiver_city, receiver_district } = bundle
        if (!receiver_address || !receiver_city || !receiver_district) {
          this.$vux.toast.text('請求數據缺失，請返回互動卡重新操作', 'bottom')
          return
        }
      }
      console.log('BUNDLE: ', bundle)
      this.$vux.loading.show({text: '發送中...'})
      NeedAPI.sendNeed(bundle, (data) => {
        this.$vux.loading.hide()
        if (data.error) {
          this.$vux.toast.text(`請求失敗，${data.error}`)
          return
        }
        this.$vux.toast.text('已成立線上寄件單', 'bottom')
        return this.$router.go(-1)
      })
    },
    onChangeArea () {
      const { area } = this
      this.bundle = {
        ...this.bundle,
        receiver_city: area[0],
        receiver_district: area[1],
      }
    },
    onChangeFami () {
      this.bundle = {
        ...this.bundle,
        receiver_fami: this.famiCode[2]
      }
    },
    _analyseFami () {
      const { bundle } = this
      const {
        need_donate_id, quantity, receiver_address, receiver_fami,
        receiver_name, receiver_phone, shipfee, shipway, shipopts
      } = bundle
      return {
        need_donate_id, quantity, receiver_address, receiver_fami,
        receiver_name, receiver_phone, shipfee, shipway, shipopts
      }
    },
    _analyseMeet () {
      const { bundle } = this
      const {
        need_donate_id, quantity, receiver_address, receiver_fami,
        receiver_name, receiver_phone, shipfee, shipway
      } = bundle
      return {
        need_donate_id, quantity, receiver_address, receiver_fami,
        receiver_name, receiver_phone, shipfee, shipway
      }
    },
    _analyseHomeng () {
      const { bundle } = this
      const {
        need_donate_id, quantity, receiver_fami, receiver_city, receiver_district, address,
        receiver_name, receiver_phone, shipfee, shipway, shipopts, receiver_has_lift
      } = bundle
      const receiver_address = `${receiver_city}${receiver_district}${address}`
      return {
        need_donate_id, quantity, receiver_address, receiver_fami,
        receiver_name, receiver_phone, shipfee, shipway, shipopts,
        receiver_has_lift: receiver_has_lift ? 1 : 0
      }
    },
    _analyseOthers () {
      const { bundle } = this
      const {
        need_donate_id, quantity, receiver_fami, receiver_city, receiver_district, address,
        receiver_name, receiver_phone, shipfee, shipway, shipopts
      } = bundle
      const receiver_address = `${receiver_city}${receiver_district}${address}`
      return {
        need_donate_id, quantity, receiver_address, receiver_fami,
        receiver_name, receiver_phone, shipfee, shipway, shipopts,
      }
    },
    _analyseHCT () {
      const { bundle } = this
      const {
        need_donate_id, quantity, receiver_fami, receiver_city, receiver_district, address,
        receiver_name, receiver_phone, shipfee, shipway, shipopts
      } = bundle
      const receiver_address = `${receiver_city}${receiver_district}${address}`
      return {
        need_donate_id, quantity, receiver_address, receiver_fami,
        receiver_name, receiver_phone, shipfee, shipway, shipopts
      }
    },
    _analysePalmbox () {
      const { bundle } = this
      const { recity, readdress, redistrict, edcode } = this.$route.query
      // 2018年08月21日 現在掌櫃改為我們自己控制收件人地址，默認傳給後端，掌櫃櫃機所在地址
      let params = {
        ...bundle,
        receiver_address: readdress || '',
        receiver_city: recity || '',
        receiver_district: redistrict || '',
        shipopts: this.shipopts,
        address: readdress || '',
      }
      // if (bundle.shipopts === 'pod' && bundle.shipway === 'palmbox') {
      //   return {
      //     ...params,
      //     status: 'received_money',
      //     edcode
      //   }
      // }

      if (bundle.shipopts === 'sender' && bundle.shipway === 'palmbox') {
        return {
          ...params,
          edcode
        }
      }


      return params
    },
    _getObjFromFamicode (code) {
      let result = this.famiConfig.find(item => item.code === code)
      if (!result) {
        return {
          code: '',
          name: '',
          address: ''
        }
      }
      return result
    },
    getFamiConfigCb () {
      if (this.famiConfig.length) {
        this.famiCode = setDefaultFami(this.user.others.famicodes[0], this.famiConfig)
        this.bundle.receiver_fami = this.famiCode[2]
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.userInfo,
      famiConfig: state => state.configs.famiConfig
    }),
    unneceAdr () {
      return this.shipway !== Shipways.SHIPWAY_FAMI && this.shipway !== Shipways.SHIPWAY_MEET && this.shipway !== Shipways.SHIPWAY_PALMBOX
    },
    famiPickerData () {
      return this.$store.getters.famiPickerData
    }
  },
  created () {
    /**
     * id 為指定贈送禮物的id   max是最大索取數  shipway是貨運方式
     */
    const { id, max, shipway, shipfee, name, pic, quantity, shipopts } = this.$route.query
    const { name: receiverName, cellphone: receiverPhone, others } = this.user
    let city = ''
    let district = ''
    let address = ''
    if (others) {
      console.log('created', others)
      if (others.famicodes && others.famicodes.length) {
        this.famiCode = setDefaultFami(others.famicodes[0], this.famiConfig)
        this.bundle.receiver_fami = this.famiCode[2]
        // this.famiAddress = this.famiCode[3]
      }
      if (others.addresses && others.addresses.rcvs) {
        city = others.addresses.rcvs.city
        district = others.addresses.rcvs.district
        address = others.addresses.rcvs.address
        if (city && district) {
          this.area = [city, district]
        }
      }
    }
    this.shipway = shipway
    this.bundle = {
      ...this.bundle,
      quantity,
      shipopts,
      receiver_city: city || '',
      receiver_district: district || '',
      receiver_phone: receiverPhone,
      receiver_name: receiverName,
      need_donate_id: id,
      shipway,
      receiver_address: `${city}${district}${address}`,
      shipfee: shipfee || 0,
      address: address || ''
    }
    this.max = parseInt(max)
    this.gift = { name, pic, quantity }
    // 獲取地址數據
    if (this.unneceAdr) {
      this.$store.dispatch('getGeoConfig', {cb: (data) => {
        this.areaMapList = mapGeo(data)
      }})
    }
    if (!this.famiConfig.length) {
      return this.getFamiConfig(this.getFamiConfigCb)
    }
    this.getFamiConfigCb()
  }
}
</script>

<style lang="less">
  @import './../../global.style.less';
  @height-gift: 50px;
  @height-row: 44px;
  .pad-receive-donate {
    .weui-cell {
      padding: 0!important;
    }
    .fami-picker, .area-picker{
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
        strong {
          color: @color-CO;
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
      .search{
          float: right;
          bottom:1px;
          vertical-align: middle;
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
  .pad-receive-donate{
    height: 100%;
    > .content{
      height: calc(~"100% - 44px");
      overflow-y: scroll;
      background-color: #FFF;
    }
  }
</style>
