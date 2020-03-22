<template>
  <div class="donate g-smooth">
    <x-header title="贈送需求">
    </x-header>
    <div class="content">
      <group class="section-num">
        <section-title title="贈送數量">
        </section-title>
        <template v-if="needItem.left !== donate.needNum[index]">
          <div
            :key="index"
            class="box"
            v-for="(needItem, index) in needInfo.need_items">
            <div :class="['item-info', donate.needNum[index] ? 'selected' : '']">
              <span class="pic" :style="{backgroundImage: `url(${needInfo.image_path})`}"></span>
              <span class="name">{{needItem.name}}</span>
              <x-number
                v-model="donate.needNum[index]"
                button-style="round"
                :min="0"
                :max="needItem.left"
              >
              </x-number>
            </div>
            <div class="item-msg" v-if="donate.needNum[index]" >
              <x-textarea
                class="textarea-box"
                :row="4"
                :height="120"
                :max="500"
                placeholder="請輸入描述"
                v-model.trim="donate.desc[index]"
              >
              </x-textarea>
              <div class="pics">
                <img-upload
                  type="need"
                  :upLoadIndex="index"
                  :multiple="true"
                  :maxLength="3"
                  :imgloaded="imgloaded"
                  :removeImg="removeImg"
                  :isLoaded="isImgLoaded[index]"
                  :imgList="imgLists[index]"
                  @upLoading="upLoadingImg"
                  :thumbSize="80"
                  :attach="{upLoadIndex:index}"
                >
                </img-upload>
                <div class="is-new">
                  <input type="checkbox" :id="`checkbox-${index}`" v-model="donate.isNew[index]">
                  <label :for="`checkbox-${index}`">全新</label>
                </div>
              </div>
            </div>
          </div>
        </template>
      </group>
      <group class="section-ships">
        <section-title title="選擇方便的寄件方式">
        </section-title>
        <div class="ships">
          <div
            @click="selectShipWay(ship.shipway, index, ship.shipfee, ship.shipopts)"
            :key="index" :class="['ship-item', donate.shipWay === ship.shipway ? 'selected' : '']"
            v-for="(ship, index) in needInfo.need_ships"
          >
            <span class="way">{{shipMapping.way[ship.shipway]}}</span>
            <template v-if="typeof(ship.shipfee) === 'number'">
            <span class="ship-fee">
              <i class="dot">·</i>{{ship.shipfee ? `NTD$${ship.shipfee}` : ship.shipfee}}
            </span>
              <span class="ship-opt">{{shipMapping.opt[ship.shipopts]}}</span>
            </template>
          </div>
        </div>
        <!-- <div v-if="donate.shipWay === 'palmbox'">
          <router-link class="g-subtitle" to="/nearbyPalmBox" target="_blank" :style="{color: '#e25443', marginRight: '10px'}">查看我附近的掌櫃</router-link>
          <router-link class="g-subtitle" to="/palmboxusage?step=donate" target="_blank" :style="{color: '#e25443'}">如何使用掌櫃</router-link>
        </div> -->
      </group>
      <group class="section-info">
      <span class="g-title">
          確認運送細節
        <!--<small>/ 全家店到店寄件單</small>-->
      </span>
        <span class="hint">
          確認送出後即成立線上寄件單，將無法更改，請正確填寫
      </span>
        <div class="info-item">
          <x-input
            title="寄件人姓名"
            text-align="right"
            placeholder="請輸入"
            required
            :isType="checkName"
            :min="1"
            v-model.trim="donate.name"
          >
          </x-input>
        </div>
        <span class="tips">
          請輸入寄件人全名，請勿填寫其他名稱或機構名稱
      </span>
        <div class="info-item">
          <x-input
            title="寄件人手機號碼"
            text-align="right"
            placeholder="請輸入"
            :max="10"
            :required="!donate.isHidePhone"
            :is-type="checkPhone"
            v-model="donate.phone"
            :disabled="donate.isHidePhone"
          >
          </x-input>
        </div>
        <span class="tips">
          手機號碼如有變動，請先更新會員資料
      </span>
        <div v-if="donate.shipWay === 'meet'" class="is-hide-phone">
          <input type="checkbox" id="hide-phone" v-model="isHidePhone">
          <label for="hide-phone">暫不提供手機號碼</label>
        </div>
        <div class="info-item" v-if="donate.shipWay !== 'fami' && donate.shipWay !== 'palmbox'">
          <popup-picker
            title="寄件人市區"
            :data="areaMapLists"
            :columns="3"
            v-model="donate.area"
          />
        </div>
        <div class="info-item" v-if="donate.shipWay !== 'fami' && donate.shipWay !== 'palmbox'">
          <x-input
            title="詳細地址"
            text-align="right"
            placeholder="請輸入"
            :required="!donate.isHideAddress"
            v-model="donate.address"
            :disabled="donate.isHideAddress"
          >
          </x-input>
        </div>
        <div v-if="donate.shipWay === 'meet'" class="is-hide-address">
          <input type="checkbox" id="hide-address" v-model="isHideAddress">
          <label for="hide-address">暫不設定面交地點</label>
        </div>
        <template v-if="donate.shipWay === 'hct'">
          <div class="info-item">
            <div class="box">
              <span class="name">寄件箱數</span>
              <x-number v-model="donate.boxNum"  @on-change="changeFee" button-style="round" :min="1">
              </x-number>
            </div>
          </div>
          <!--<div class="info-item">-->
          <!--<span class="consignee">到府收件日期</span>-->
          <!--</div>-->
          <!--<span class="tips">-->
          <!--感謝您的分享，請等候需求者確認需求此物後，再請您確認運送細節以及指定到府收件日期。-->
          <!--</span>-->
        </template>
      </group>
      <group class="section-remit" v-if="donate.shipWay !== 'meet'">
        <span class="g-title">
          確認匯款資訊
        </span>
        <div class="x-row">
          <label >運費金額</label>
          <span class="degree">元</span>
          <input type="text" :readonly="donate.shipWay === 'hct'" placeholder="請輸入" v-model="donate.shipFee">
        </div>
        <template v-if="donate.shipWay !== 'meet' && donate.opt === 'receiver'">
          <div class="x-row">
            <label >匯款銀行</label>
            <PopupPicker :data="banklist"
                         class="content bank-picker"
                         :show="showPicker"
                         v-model="donate.chooseBank"
                         :columns="1"
            >
            </PopupPicker>
          </div>
          <div class="x-row">
            <x-input type="text"
                     title="分行"
                     required
                     placeholder="請輸入"
                     text-align="right"
                     :is-type="checkBank"
                     v-model="donate.bankBranch" >
            </x-input>
          </div>
          <div class="x-row">
            <x-input type="text"
                     title="匯款戶名"
                     required
                     placeholder="請輸入"
                     text-align="right"
                     :is-type="checkBank"
                     v-model="donate.bankAccountName">
            </x-input>
          </div>
          <div class="x-row">
            <x-input type="text"
                     title="帳號"
                     placeholder="請輸入銀行帳號"
                     :max="14"
                     :min="1"
                     required
                     :is-type="checkBankAccountNumber"
                     text-align="right"
                     v-model="donate.bankAccountNumber">
            </x-input>
          </div>
        </template>
        <div class="info-item" v-if="donate.shipWay === 'homeng'">
          <div class="vux-cell-box">
            <div class="weui-cell">
              <div class="weui-cell__hd">是否有電梯</div>
              <div class="weui-cell__bd" style="text-align: right">
                <zc-radio
                  :radioList="radioList"
                  v-model="donate.hasLift"
                >
                </zc-radio>
              </div>
            </div>
          </div>
        </div>
      </group>
      <!--<group class="section-tips">-->
        <!--<section-title title="提示">-->
        <!--</section-title>-->
        <!--<div class="hint">-->
          <!--確認送出後即成立線上寄件單，將無法更改，請正確填寫-->
        <!--</div>-->
      <!--</group>-->
      <div class="extort-btn">
        <x-button @click.native="toDonate" class="btn"  type="primary">確認贈送</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Group, XNumber, XTextarea, XButton, PopupPicker } from 'vux'
import ImgUpload from '@/components/ImgUpload'
import SectionTitle from '@/components/Title'
import thingsPicM from '@/assets/icon/gift/things-pic-M.jpg'
import iconDelete from '@/assets/icon/extort/com_list_ic_picture_delete_normal@2x.png'
import iconAdd from '@/assets/icon/extort/com_list_ic_picture_add_normal@2x.png'
import { shipMapping, banklist } from '@/tools/constant'
import ZcRadio from '@/components/ZcRadio'
import { phoneRegex, nameRegex, noNumberRegex, last14NumRegex } from '@/tools/regex'
import needsApi from '@/store/apis/need'
import {mapGeo} from '@/tools/strMap'
import { mapState, mapActions, mapMutations } from 'vuex'
import memberData from '@/tools/memberData'
import { local, KEY_USER_TOKEN } from '@/tools/storage'

export default {
  components: {
    Group,
    XNumber,
    XTextarea,
    XButton,
    SectionTitle,
    ImgUpload,
    PopupPicker,
    ZcRadio
  },
  data () {
    return {
      thingsPicM,
      iconDelete,
      iconAdd,
      shipMapping,
      ships: [],
      shipIndex: 0,
      shipWay: 'fami',
      isImgLoaded: [],
      upLoadImgIndex: 0,
      needInfo: {},
      famiStores: [[]],
      isHidePhone: false,
      isDonated: true,
      isHideAddress: false,
      checkPhone: (val) => {
        return {
          valid: phoneRegex.test(val),
          msg: '請輸入正確手機號碼'
        }
      },
      checkName: (val) => {
        return {
          valid: nameRegex.test(val),
          msg: '請輸入正確姓名'
        }
      },
      checkBank: (val) => {
        return {
          valid: noNumberRegex.test(val),
          msg: '請輸入正確分行'
        }
      },
      checkBankAccountNumber: (val) => {
        return {
          valid: last14NumRegex.test(val),
          msg: '請輸入正確銀行帳號'
        }
      },
      areaMapLists: [],
      showPicker: false,
      radioList: [{
        text: '是',
        value: 1
      }, {
        text: '否',
        value: 0
      }],
      donate: {
        needNum: [],
        desc: [],
        shipWay: 'fami',
        opt: '',
        fami: [' '],
        area: [],
        address: '',
        name: '',
        phone: '',
        isNew: [],
        shipFee: '',
        bankBranch: '',
        bankAccountName: '',
        bankAccountNumber: '',
        chooseBank: ['無'],
        boxNum: 1,
        hasLift: 0
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (from.name === 'Login') {
        if (local.get(KEY_USER_TOKEN) && !vm.userInfo.id) {
          vm.getLoginUserInfo({
            cb: () => {
              const id = vm.$route.params.id
              if (!memberData.isValidBaseInfo(vm.$store.state)) {
                vm.$vux.toast.text('請先完善會員基本資料', 'bottom')
                setTimeout(() => {
                  vm.$router.push(`/user/${vm.userInfo.id}/editBaseInfo?redirect=/donate/${id}`)
                }, 3000)
              } else if (!memberData.isValidAdr(vm.$store.state)) {
                vm.$vux.toast.text('請先完善聯絡地址', 'bottom')
                setTimeout(() => {
                  vm.$router.push(`/user/${vm.userInfo.id}/editAdr?redirect=/donate/${id}`)
                }, 3000)
              }
            }
          })
        }
      }
    })
  },
  created () {
    this.banklist = banklist.map((v) => {
      return {
        name: `${v.code} ${v.name}`,
        value: `${v.code} ${v.name}`
      }
    })
    const [id, cb] = [this.$route.params.id, this.getNeedInfoCb]
    this.getNeedInfo({id, cb})
    this.getFamiStores({cb: this.getFamiStoresCb})
    if (!this.geoConfig.length) {
      return this.getGeoConfig({cb: this.getGeoConfigCb})
    }
    this.setAreaMap({data: this.geoConfig})
    this.areaMapLists = mapGeo(this.geoConfig)
  },
  methods: {
    ...mapActions({
      getNeedInfo: 'getNeedInfo',
      getFamiStores: 'getFamiStores',
      getGeoConfig: 'getGeoConfig',
      getLoginUserInfo: 'getLoginUserInfo'
    }),
    ...mapMutations({
      setAreaMap: 'setAreaMap',
      setDonateNeedPics: 'setDonateNeedPics',
      deleteDonateNeedPic: 'deleteDonateNeedPic'
    }),
    // 获取当前物品信息
    getNeedInfoCb (data) {
      if (data) {
        this.needInfo = data
        this.ships = data.need_ships
        const {name, cellphone, others} = this.userInfo
        const RVCS = others && others.addresses && others.addresses.rcvs
        let {city, district, address} = {city: '', district: '', address: ''}
        if (RVCS) {
          ({city, district, address} = RVCS)
        }
        let {banks, branchs, accounts, title} = {banks: '', branchs: '', accounts: '', title: ''}
        const userBanks = others && others.banks && others.banks[0]
        let bankName = ''
        if (userBanks && userBanks.length > 0) {
          for (let bank of userBanks) {
            const filterBanks = banklist.filter((item) => item.code === bank.banks)
            if (filterBanks.length > 0) {
              banks = bank.banks
              bankName = filterBanks[0].name
              branchs = bank.branchs
              accounts = bank.accounts
              title = bank.title
              break
            }
          }
        }
        const shipway = data.need_ships && data.need_ships[0].shipway
        const opt = data.need_ships && data.need_ships[0].shipopts
        // 初始化联络讯息
        this.donate = {
          ...this.donate,
          name,
          phone: cellphone,
          area: [`${city}`, `${district}`],
          address: `${address}`,
          shipWay: shipway,
          bankBranch: `${branchs}`,
          bankAccountName: `${title}`,
          bankAccountNumber: `${accounts}`,
          chooseBank: banks ? [`${banks} ${bankName}`] : ['無'],
          shipFee: this.ships[0].shipfee,
          opt
        }
      }
    },
    // 获取全家店号，并匹配个人资料默认全家店号
    getFamiStoresCb (data) {
      const {others} = this.userInfo
      this.famiStores = [[...data.data.map(({name, code}) => `${code}${name}`)]]
      if (others) {
        const {famicodes} = others
        if (famicodes) {
          const famiStore = data.data.filter((item) => item.code === famicodes[0])
          if (famiStore.length) {
            this.donate.fami = [`${famiStore[0].code}${famiStore[0].name}`]
          }
        }
      }
    },
    getGeoConfigCb (data) {
      this.setAreaMap({data})
      this.areaMapLists = mapGeo(data)
    },
    // 贈送
    toDonate () {
      if (this.isDonated) {
        if (this.isAbledToDonate) {
          return this.$vux.toast.text('請填寫完整資料', 'bottom')
        }
        const {
          needNum, desc, address, chooseBank, bankAccountName, bankAccountNumber,
          bankBranch, area, hasLift, name, phone, isNew, shipFee, opt, shipWay
        } = this.donate
        // 贈送物品項
        // needId
        let needItemId = []
        needNum.forEach((item, index) => {
          if (item) {
            needItemId[index] = this.needInfo.need_items[index].id
          }
        })
        const dataItem = needItemId.map((item, index) => {
          if (item) {
            if (shipWay === 'meet') {
              return {
                desc: desc[index],
                giver_address: this.isHideAddress ? '' : address,
                giver_city: this.isHideAddress ? '' : area[0],
                giver_district: this.isHideAddress ? '' : area[1],
                giver_name: name,
                giver_phone: this.isHidePhone ? '' : phone,
                image_path: (this.imgLists[index] && this.imgLists[index][0]) ? this.imgLists[index][0].url : '',
                need_donate_images: (this.imgLists[index] && this.imgLists[index][0]) ? this.imgLists[index].map(item => ({ path: item.url })) : '',
                is_new: isNew[index] ? 1 : 0,
                need_item_id: needItemId[index],
                need_id: this.$route.params.id,
                quantity: needNum[index],
                shipway: shipWay
              }
            }
            return {
              desc: desc[index],
              giver_address: address,
              giver_bank: chooseBank[0].replace(/[^0-9]/ig, ''),
              giver_bank_account_name: bankAccountName,
              giver_bank_account_number: bankAccountNumber,
              giver_bank_branch: bankBranch,
              giver_city: area[0],
              giver_district: area[1],
              giver_has_lift: hasLift,
              giver_name: name,
              giver_phone: phone,
              image_path: (this.imgLists[index] && this.imgLists[index][0]) ? this.imgLists[index][0].url : '',
              need_donate_images: (this.imgLists[index] && this.imgLists[index][0]) ? this.imgLists[index].map(item => ({ path: item.url })) : '',
              is_new: isNew[index] ? 1 : 0,
              need_item_id: needItemId[index],
              need_id: this.$route.params.id,
              quantity: needNum[index],
              shipfee: shipFee,
              shipopts: opt,
              shipway: shipWay
            }
          }
        })
        // 一次請求索取一項物品
        const donatePromises = dataItem.map((item) => {
          return new Promise((resolve) => {
            needsApi.needsDonate(item, (data) => resolve(data))
          })
        })
        Promise.all(donatePromises)
          .then(() => this.toDonateCb())
          .catch(() => this.$vux.toast.text('贈送失敗，請稍後重試', 'bottom'))
        this.$vux.loading.show({
          text: '贈送中...'
        })
      }
    },
    toDonateCb () {
      this.$vux.loading.hide()
      this.isDonated = true
      this.$router.push(`/DonateSuc?needUserId=${this.needInfo.user_id}`)
    },
    upLoadingImg (loading, attach) {
      this.upLoadImgIndex = attach.upLoadIndex
      this.$set(this.isImgLoaded, this.upLoadImgIndex, loading)
    },
    // 上传图片
    imgloaded (data) {
      this.setDonateNeedPics({data, index: this.upLoadImgIndex})
      this.$set(this.isImgLoaded, this.upLoadImgIndex, false)
    },
    // 删除图片
    removeImg (index, attach) {
      this.deleteDonateNeedPic({i: attach.upLoadIndex, itemIndex: index})
    },
    // 切换不同交货方式
    selectShipWay (way, index, fee, opt) {
      this.donate.shipWay = way
      this.donate.shipFee = fee
      this.shipIndex = index
      this.donate.opt = opt
    },
    // 新竹物流運費
    changeFee (num) {
      this.donate.shipFee = 150 * num
    }
  },
  computed: {
    ...mapState({
      imgLists: state => state.needs.donateNeed.pics,
      userInfo: state => state.user.userInfo,
      geoConfig: state => state.configs.geoConfig
    }),
    // 表单验证
    isAbledToDonate () {
      const {needNum, name, phone, address, opt, chooseBank,
        bankBranch, bankAccountName, bankAccountNumber, shipWay
      } = this.donate
      const infoChecked = !needNum.some(item => item > 0) || !(name && nameRegex.test(name)) || !(phone && phoneRegex.test(phone))
      // 匯款
      if (opt === 'receiver') {
        const remitChecked = (chooseBank[0].trim() === '無' || !chooseBank[0]) || !noNumberRegex.test(bankBranch) || !noNumberRegex.test(bankAccountName) || !last14NumRegex.test(bankAccountNumber)
        if (shipWay === 'others') {
          return remitChecked || infoChecked || !address
        }
        return remitChecked || infoChecked
      }
      // 全家、面交不判斷地址
      if (shipWay !== 'fami' && shipWay !== 'meet') {
        return infoChecked || !address
      }
      // 面交可以暫定不提供手機號碼、地址
      if (shipWay === 'meet') {
        let isChecked = !needNum.some(item => item > 0) || !(name && nameRegex.test(name))
        if (!this.isHidePhone) {
          isChecked = isChecked || !(phone && phoneRegex.test(phone))
        }
        if (!this.isHideAddress) {
          isChecked = isChecked || !address
        }
        return isChecked
      }
      return infoChecked
    }
  }
}
</script>

<style lang="less">
  @height-row: 50px;
  .donate{
    input[disabled]{
      background: #FFF !important;
      color: #FFF !important;
    }
    .weui-cells{
      margin-top: 0;
      padding: @pm-bg 0;
      &:before, &:after{
        border: none;
        display: none;
      }
      .weui-cell{
        padding: 0;
        &:before{
          display: none;
          border: none;
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
        &.vux-x-textarea{
          .weui-cell__bd{
            border: none;
          }
        }
      }
      .weui-cells_radio{
        .weui-cell_radio{
          padding: 0 @pm-bg;
          height: 36px;
          color: @color-font-C2;
          font-size: @font-S3;
          .weui-cell__ft{
            .weui-icon-checked{
              position: relative;
              width: 16px;
              height: 16px;
              border: 1px solid @color-font-C2;
              border-radius: 50%;
              &:before{
                position: absolute;
                top: -1px;
                left: -1px;
                margin: 0;
                width: 16px;
                height: 16px;
                color: @color-CR;
                font-size: @font-S4;
                border-radius: 50%;
                background: #f9dad5;
                overflow: hidden;
              }
            }
          }
        }
      }
    }
    .section-info{
      .weui-cell{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .weui-cell__hd{
          color: @color-font-C1;
          font-size: 15px;
        }
        .weui-cell__bd, .vux-popup-picker-select-box{
          color: @color-font-C2;
          font-size: @font-S3;
        }
        .vux-popup-picker-select-box{
          color: @color-font-C3;
        }
      }
    }
    .section-remit{
      .weui-cell{
        padding: 0;
        height: @height-row;
        line-height: @height-row;
        font-size: @font-S3;
        color: @color-font-C3;
        .weui-cell__hd{
          color: @color-font-C1;
        }
        .weui-cell__ft{
          padding-right: 0;
          &:after{
            display: none;
          }
        }
        label, input, .degree, .content {
          color: @color-font-C1;
          font-size: @font-S3;
        }
        input{
          color: @color-font-C3;
        }
      }
    }
    .section-remit {
      .bank-picker{
        .weui-cell{
          .weui-cell__ft{
            display: inline-block;
            width: 27px;
            height: 8px;
            &:after{
              display: block;
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
    }
    .section-num{
      .vux-number-input{
        background: #fffbf6 !important;
      }
    }
  }
</style>
<style lang="less" scoped>
  @import '../../../node_modules/vux/src/styles/1px.less';
  @import '../../global.mixin.less';
  @height-row: 50px;
  .donate{
    height: 100%;
    overflow-y: scroll;
    > .content{
      padding:0 @pm-bg;
    }
    input[type="checkbox"]{
      -webkit-appearance:none;
      -moz-appearance: none;
      outline: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid @color-CL;
      &:checked{
        border: none;
        background: #fff url('../../assets/img/gift_screen_ic_checkbox_selected@2x.png') center center;
        background-size: 18px 18px;
        & + label{
          color: @color-CR !important;
        }
      }
    }
    .is-hide-phone, .is-hide-address{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: @pm-md;
      label{
        margin-left: 8px;
        color: @color-font-C2;
        font-size: @font-S3;
        line-height: 1;
      }
    }
    .section-num{
      .item-info{
        display: flex;
        justify-content: flex-start;
        margin: @pm-bg 0;
        padding-right: @pm-bg;
        height: 50px;
        line-height: 50px;
        border: 1px solid @color-CL;
        border-radius: 6px;
        &.selected{
          background: #fffbf6;
        }
        &:nth-of-type(2){
          margin-top: @pm-lg;
        }
        .pic{
          flex:0 0 50px;
          height: 100%;
          background-size:50px auto;
          background-repeat:no-repeat;
          background-position: center center;
          background-color: @color-CBG;
          border-radius: 6px 0 0 6px;
        }
        .name{
          flex: 1;
          margin: 0 @pm-md;
          color: @color-font-CR;
          font-size: 15px;
          font-weight: bold;
          word-break: break-all;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
      .item-msg{
        .textarea-box{
          padding: @pm-bg @pm-md !important;
          border: 1px solid @color-CL;
          font-size: @font-S3;
        }
        .pics{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-right: @pm-bg;
          margin-top: @pm-bg;
          .is-new{
            display: flex;
            align-items: center;
            label{
              margin-left: 8px;
              font-size: @font-S3;
              color: @color-font-C1;
            }
          }
        }
      }
    }
    .section-ships{
      .ships{
        margin-top: 20px;
        border: 1px solid #eee;
        .ship-item{
          padding:0 @pm-bg;
          height: 50px;
          line-height: 50px;
          font-size: 0;
          span{
            color: @color-font-C1;
            font-size: @font-S3;
            overflow: hidden;
            &.ship-fee{
              .dot{
                margin: 0 8px;
                color: @color-font-C2;
              }
            }
            &.ship-opt{
              float: right;
              color: @color-font-C2;
            }
          }
          &.selected{
            background: @color-font-CR;
            span{
              color: @color-font-C4;
              &.ship-opt{
                color: @color-font-C5;
              }
            }
          }
        }
      }
    }
    .section-info{
      .g-title {
        margin-bottom: @pm-sm;
        display: block;
        small {
          color: @color-font-C2;
          font-weight: 400;
        }
      }
      .hint {
        display: inline-block;
        font-size: @font-S4;
        color: @color-font-C2;
        font-weight: 300;
      }
      .info-item{
        height: 50px;
        line-height: 50px;
        .g-border-1px;
        .box{
          display: flex;
          justify-content: space-between;
          .name{
            color: @color-font-C1;
            font-size: @font-S3;
          }
        }
        .consignee{
          color: @color-font-C1;
          font-size: @font-S3;
        }
        & + .tips{
          display: block;
          margin: 0 0 5px;
          font-size: @font-S4;
          color: @color-font-C2;
          font-weight: 300;
          line-height: 23px;
        }
      }
    }
    .section-remit{
      .g-title {
        margin-bottom: @pm-sm;
        display: block;
        small {
          color: @color-font-C2;
          font-weight: 400;
        }
      }
      .tips {
        font-size: 12px;
        color: @color-font-C2;
        font-weight: 300;
      }
      .x-row {
        position: relative;
        height: @height-row;
        width: 100%;
        display: block;
        border-bottom: 1px solid @color-CL;
        label, input, .degree, .content {
          font-size: 15px;
          height: @height-row;
          line-height: @height-row;
        }
        label {
          display: inline-block;
          width: 100px;
          height: 50px;
          color: @color-font-C1;
        }
        input, .content {
          color: @color-font-C3;
          float: right;
          text-align: right;
          top: -1px;
          position: relative;
          background-color: transparent;
          border: none;
          outline: none;
          width: calc(~"100% - 140px");
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
    .section-tips{
      .hint{
        padding-top: 7px;
        color: @color-font-C1;
        font-size: @font-S3;
        line-height: 29px;
      }
    }
    .extort-btn{
      // position: fixed;
      bottom: 0;
      left: 0;
      padding: 24px @pm-bg @pm-bg;
      width: 100%;
      background: @color-font-C4;
      .btn{
        background: @color-font-CR;
      }
    }
  }
</style>
