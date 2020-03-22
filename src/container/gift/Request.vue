<template>
  <div class="request g-smooth" ref="padMain">
    <x-header title="索取禮物">
    </x-header>
    <div class="content">
      <group class="section-flex">
        <section-title title="索取數量">
        </section-title>
        <x-number v-model="request.reqQuantity"
          button-style="round"
          v-if="giftInfo.left != null"
          :min="giftInfo.left > 1 ? 0 : 1"
          :max="giftInfo.left">
        </x-number>
      </group>
      <group>
        <section-title class="title-pb" title="索取理由">
        </section-title>
        <x-textarea
          class="textarea-1px"
          ref="textareaReason"
          :row="4"
          :height="120"
          :max="200"
          placeholder="請輸入您的理由"
          v-model="request.reason"
        >
        </x-textarea>
        <div class="pics">
          <img-upload
            type="gift"
            :maxLength="1"
            :imgloaded="imgloaded"
            :removeImg="removeImg"
            :isLoaded="isImgLoaded"
            :imgList="imgLists"
            @upLoading="upLoadingImg"
          >
          </img-upload>
        </div>
      </group>
      <group class="section-ships">
        <section-title title="選擇方便的交貨方式">
        </section-title>
        <div class="ships">
          <div
            @click="selectShipWay(ship.shipway, index)"
            :key="index"
            :class="['ship-item', request.shipWay === ship.shipway ? 'selected' : '']"
            v-for="(ship, index) in giftInfo.gift_ships"
          >
            <span class="way">{{shipMapping.way[ship.shipway]}}</span>
            <template v-if="typeof(ship.shipfee) === 'number' && ship.shipway !== 'meet'">
              <span class="ship-fee"><i class="dot">·</i>{{ship.shipfee}}元</span>
              <span class="ship-opt">{{shipMapping.opt[ship.shipopts]}}</span>
            </template>
          </div>
        </div>
      </group>
      <div class="hint">
        務必正確填寫，方便索取成功後，贈送者可直接寄送，未獲贈前不會將資料公開給贈送者
      </div>
    <div class="palmbox-more-info" v-if="request.shipWay === 'palmbox'">
      <section-title
        title="掌櫃訊息"
        style="margin-bottom: 15px"></section-title>
      <palm-box-select
        :handleChange="handlePalmBoxChange"
        :value="request.palmboxInfo"
      ></palm-box-select>
      <div v-if="request.shipWay === 'palmbox'">
        <router-link class="g-subtitle" to="/nearbyPalmBox" target="_blank" :style="{color: '#e25443', marginRight: '10px'}">查看我附近的掌櫃</router-link>
        <router-link class="g-subtitle" to="/palmboxusage?step=request" target="_blank" :style="{color: '#e25443'}">如何使用掌櫃</router-link>
      </div>
    </div>
    <group class="section-info">
      <section-title title="聯絡訊息">
      </section-title>
      <div class="info-item" v-if="request.shipWay !== 'meet' && request.shipWay !== 'fami' && request.shipWay !== 'palmbox'">
        <x-input
          title="寄送地址"
          text-align="right"
          placeholder="請輸入"
          required
          v-model.trim="request.address"
        >
        </x-input>
      </div>
      <div class="info-item" v-if="request.shipWay === 'fami'">
        <popup-picker
          title="全家店號"
          :data="famiPickerData"
          :columns="3"
          v-model="request.fami"
          show-name
          @on-change="onchangefamami"
          @on-hide="toggleMoreInfo"
          @on-show="toggleMoreInfo"
        ></popup-picker>
      </div>
      <div class="info-item">
        <x-input
          title="姓名"
          text-align="right"
          placeholder="請輸入"
          :isType="checkName"
          :min="1"
          required
          v-if="request.name != null"
          :value="request.name"
        >
        </x-input>
      </div>
      <div
        class="hint"
        v-if="(request.shipWay === 'fami')"
      >
        請輸入真實姓名，取件時需出示身份證件
      </div>
      <div class="info-item">
        <x-input
          title="手機號碼"
          text-align="right"
          placeholder="請輸入"
          :max="10"
          required
          v-if="request.phone != null"
          :is-type="checkPhone"
          v-model="request.phone"
        />
      </div>
      <div
        v-if="(request && request.shipWay === 'fami')"
        class="hint"
      >
        請再次確認手機號碼，到店時將發送簡訊通知
      </div>
      <div
        v-if="(request && request.shipWay === 'palmbox')"
        class="hint"
      >
        請再次確認手機號碼，快件到達櫃機時將發送簡訊通知
      </div>
        <div class="info-item" v-if="request.shipWay === 'homeng'">
          <div class="vux-cell-box">
            <div class="weui-cell">
              <div class="weui-cell__hd">是否有電梯</div>
              <div class="weui-cell__bd" style="text-align: right">
                <zc-radio
                  :radioList="radioList"
                  v-model="request.hasLift"
                >
                </zc-radio>
              </div>
            </div>
          </div>
        </div>
    </group>
      <div class="hint" style="margin-top:-15px;" v-if="request.shipWay === 'others'">溫馨提示：當您獲贈時，以下資料會顯示給贈送者</div>
      <div class="extort-btn">
        <x-button @click.native="toRequest" class="btn" type="primary">確認索取</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Group, XNumber, XTextarea, XButton, XInput, PopupPicker } from 'vux'
import ImgUpload from '@/components/ImgUpload'
import SectionTitle from '@/components/Title'
import thingsPicM from '@/assets/icon/gift/things-pic-M.jpg'
import iconDelete from '@/assets/icon/extort/com_list_ic_picture_delete_normal@2x.png'
import iconAdd from '@/assets/icon/extort/com_list_ic_picture_add_normal@2x.png'
import { shipMapping } from '../../tools/constant'
import ZcRadio from '../../components/ZcRadio'
import { phoneRegex, nameRegex } from '../../tools/regex'
import { mapState, mapActions, mapMutations } from 'vuex'
import memberData from '@/tools/memberData'
import { local, KEY_USER_TOKEN } from '@/tools/storage'
import {mapGeo} from '@/tools/strMap'
import PalmBoxSelect from '@/components/PalmBoxSelect'
import moreInfoPickerMixin from '@/mixins/toggleMoreInfoPicker'
import { setDefaultFami } from '@/tools/ObjectHelper'

export default {
  mixins: [moreInfoPickerMixin],
  components: {
    Group,
    XNumber,
    XTextarea,
    XButton,
    SectionTitle,
    ImgUpload,
    PopupPicker,
    ZcRadio,
    XInput,
    PalmBoxSelect
  },
  data () {
    return {
      thingsPicM,
      iconDelete,
      iconAdd,
      shipMapping,
      isImgLoaded: false,
      isRequested: true,
      giftInfo: {},
      fami: [''],
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
      radioList: [{
        text: '是',
        value: 1
      }, {
        text: '否',
        value: 0
      }],
      request: {
        reqQuantity: 1,
        reason: '',
        pics: '',
        shipWay: '',
        fami: ['', '', ''],
        address: '',
        hasLift: 0,
        palmboxInfo: ['', '', '']
      },
      areaMapList: []
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (from.name === 'Login') {
        if (local.get(KEY_USER_TOKEN) && !vm.userInfo.id) {
          vm.getLoginUserInfo({
            cb: () => {
              const id = this.$route.params.id
              if (!memberData.isValidBaseInfo(vm.$store.state)) {
                vm.$vux.toast.text('請先完善會員基本資料', 'bottom')
                setTimeout(() => {
                  vm.$router.push(`/user/${vm.userInfo.id}/editBaseInfo?redirect=/request/${id}`)
                }, 3000)
              } else if (!memberData.isValidAdr(vm.$store.state)) {
                vm.$vux.toast.text('請先完善聯絡地址', 'bottom')
                setTimeout(() => {
                  vm.$router.push(`/user/${vm.userInfo.id}/editAdr?redirect=/request/${id}`)
                }, 3000)
              }
            }
          })
        }
      }
    })
  },
  mounted () {
    const [id, cb] = [this.$route.params.id, this.getGiftInfoCb]
    this.getGiftInfo({id, cb})
    this.getFamiStores({cb: this.getFamiStoresCb})
    this.getGeoConfig({cb: this.getGeoConfigCb})
  },
  methods: {
    ...mapActions({
      getGiftInfo: 'getGiftInfo',
      getFamiStores: 'getFamiStores',
      giftsRequest: 'giftsRequest',
      getLoginUserInfo: 'getLoginUserInfo',
      getGeoConfig: 'getGeoConfig',
      getPalmBox: 'getPalmBox'
    }),
    ...mapMutations({
      setReqGiftPics: 'setReqGiftPics',
      deleteReqGiftPic: 'deleteReqGiftPic'
    }),
    onchangefamami (value) {
      console.log('fami value changed', value)
    },
    handlePalmBoxChange (value) {
      this.request = {
        ...this.request,
        palmboxInfo: value
      }
    },
    beforeGetPalmBox (closeType) {
      if (closeType) {
        this.request.palmboxInfo.edcode = ''
        this.request.palmboxInfo.name = []
        this.getPalmBox({
          city: this.request.palmboxInfo.area[0],
          area: this.request.palmboxInfo.area[1],
          cb: () => {
            console.log('end')
          }
        })
      }
    },
    getGeoConfigCb (data) {
      this.areaMapList = mapGeo(data)
    },
    // 获取当前物品信息
    getGiftInfoCb (data) {
      if (data) {
        this.giftInfo = data
        const {name, cellphone, others} = this.userInfo
        const RVCS = others && others.addresses && others.addresses.rcvs
        let {city, district, address} = {city: '', district: '', address: ''}
        if (RVCS) {
          ({city, district, address} = RVCS)
        }
        const shipway = data.gift_ships && data.gift_ships[0].shipway
        let palmboxInfo = ['', '', '']
        if (others.edcode && others.edcode.value) {
          const {edcode} = others
          const { city, dict, value } = edcode
          palmboxInfo = [city, dict, value]
        }
        console.log('DATA:', data.left)
        const reqQuantity = data.left > 1 ? 0 : 1
        // 初始化联络讯息
        this.request = {
          ...this.request,
          name,
          reqQuantity,
          phone: cellphone,
          address: `${city}${district}${address}`,
          shipWay: shipway,
          palmboxInfo
        }
      }
    },
    // 获取全家店号，并匹配个人资料默认全家店号
    getFamiStoresCb (data) {
      const { others } = this.userInfo
      if (others) {
        const {famicodes} = others
        if (famicodes) {
          const fami = setDefaultFami(famicodes[0], data.data)
          this.request = {
            ...this.request,
            fami
          }
        }
      }
    },
    // 索取
    toRequest () {
      if (!this.isRequested) {
        return
      }
      const {palmboxInfo, reason, shipWay, fami, address, name, phone, reqQuantity, hasLift} = this.request
      const {gift_ships: giftShips, quantity} = this.giftInfo
      const currentShipWay = giftShips.find(item => item.shipway === shipWay)
      const shipfee = currentShipWay.shipfee
      const shipopts = currentShipWay.shipopts

      if (!this.request.reqQuantity) {
        return this.$vux.toast.text('請選擇索取數量', 'bottom')
      }

      if (!reason.trim()) {
        return this.$vux.toast.text('請輸入索取理由', 'bottom')
      }

      if (!shipWay) {
        return this.$vux.toast.text('請選擇交貨方式', 'bottom')
      }

      // 選擇物流方式為掌櫃，且沒有掌櫃預設值和未在界面上選擇任意收件櫃機
      if (shipWay === 'palmbox' && !palmboxInfo[2]) {
        return this.$vux.toast.text('請選擇掌櫃櫃機', 'bottom')
      }

      if (shipWay === 'fami' && !fami[2]) {
        return this.$vux.toast.text('請選擇全家店號', 'bottom')
      }

      if (!name) {
        this.$vux.toast.text('請輸入姓名', 'bottom')
        return
      }

      if (!phone || !phoneRegex.test(phone)) {
        this.$vux.toast.text('請檢查手機號碼', 'bottom')
        return
      }

      if (shipWay === 'palmbox' && !this.getCurrentPalmBoxAdr) {
        this.$vux.toast.text('請選擇掌櫃櫃機', 'bottom')
        return
      }

      if ((shipWay === 'other' || shipWay === 'hct' || shipWay === 'others') && !address) {
        this.$vux.toast.text('請輸入寄送地址', 'bottom')
        return
      }

      // 索取所需提交的信息
      let data = {
        gift_id: this.$route.params.id,
        image_path: (!!this.imgLists.length && this.imgLists[0].url) || '',
        quantity,
        reason,
        receiver_address: address,
        receiver_name: name,
        receiver_phone: phone,
        request_quantity: reqQuantity,
        shipway: shipWay,
        receiver_has_lift: hasLift,
        receiver_fami: fami[2],
        shipfee,
        shipopts
      }

      if (shipWay === 'palmbox') {
        data = Object.assign({}, data, {
          edcode: this.request.palmboxInfo[2],
          receiver_city: this.request.palmboxInfo[0],
          receiver_district: this.request.palmboxInfo[1],
          receiver_address: this.getCurrentPalmBoxAdr.TW_THROWADDRESS
        })
      }

      this.giftsRequest({data, cb: this.toRequestCb})
      this.isRequested = false
      this.$vux.loading.show({
        text: '索取中...'
      })
    },
    toRequestCb (data) {
      this.$vux.loading.hide()
      this.isRequested = true
      if (data.error) {
        return this.$vux.toast.text('索取失敗，請稍後重試', 'bottom')
      }
      this.deleteReqGiftPic({i: 0})
      this.$router.push(`/requestSuc?giftUserId=${this.giftInfo.user_id}&giftId=${this.giftInfo.id}`)
    },
    upLoadingImg () {
      this.isImgLoaded = true
    },
    // 上传图片
    imgloaded (data) {
      this.setReqGiftPics({data})
      this.isImgLoaded = false
    },
    // 删除图片
    removeImg (i) {
      this.deleteReqGiftPic({i})
    },
    // 切换不同交货方式
    selectShipWay (way, index) {
      console.log('changed the shipway and the data ->', way, index)
      this.request.shipWay = way
    }
  },
  computed: {
    ...mapState({
      imgLists: state => state.gifts.requestGift.pics,
      userInfo: state => state.user.userInfo,
      palmBoxList: state => state.things.palmBoxData.data
    }),
    famiPickerData () {
      return this.$store.getters.famiPickerData
    },
    palmBoxPickerData () {
      return [this.palmBoxList.map(item => ({
        name: item.THROWBUILDINGNAME,
        value: item.THROWBUILDINGNAME,
        edcode: item.EDCODE,
        address: item.TW_THROWADDRESS,
        parent: 0
      }))]
    },
    getCurrentPalmBoxAdr () {
      return this.$store.getters.currentPalmBoxInfo(this.request.palmboxInfo[2])
    },
    // 表单验证
    isAbledToReq () {
      const {name, phone, address, shipWay} = this.request
      // 全家、面交不判断地址
      if (shipWay === 'fami' || shipWay === 'meet') {
        return !(name && (phone && phoneRegex.test(phone)))
      }
      if (shipWay === 'palmbox') {
        return !(name && (phone && phoneRegex.test(phone)) && this.getCurrentPalmBoxAdr)
      }
      return !(name && (phone && phoneRegex.test(phone)) && address)
    }
  }
}
</script>

<style lang="less" >
  .request{
    .palmbox-pop .weui-cell{
      padding-left: 0;
    }
    .palmbox-pop::before{
      left: 0!important;
    }

    .section-flex{
      .weui-cells{
        display: flex;
        justify-content: space-between;
      }
    }
    .section-ships{
      .weui-cells{
        padding-bottom: 0;
      }
    }
    .weui-cells{
      margin-top: 0;
      padding: @pm-bg 0;
      &:before, &:after{
        border: none;
      }
      .weui-cell{
        padding: 0;
        &:before{
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
    .info-item{
      .weui-cell{
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
  }
</style>
<style lang="less" scoped>
  @import '../../../node_modules/vux/src/styles/1px.less';
  @import '../../global.mixin.less';
  .request{
    height: 100%;
    overflow-y: scroll;
    > .content{
      padding:0 @pm-bg;
    }
    .title-pb{
      padding-bottom: @pm-bg;
      .g-border-1px;
      &:after{
        border: none;
      }
    }
    .textarea-1px{
      padding: @pm-bg @pm-md !important;
      border: 1px solid #eee;
      font-size: @font-S3;
    }
    .pics{
      margin-top: @pm-bg;
    }
    .ships{
      margin-top: 24px;
      border: 1px solid #eee;
      .ship-item{
        padding:0 @pm-bg;
        height: 44px;
        line-height: 44px;
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
    .hint{
      padding-top: 7px;
      color: @color-font-C2;
      font-size: @font-S4;
      line-height: 29px;
    }
    .section-info{
      .info-item{
        height: 50px;
        line-height: 50px;
        .g-border-1px;
        &:nth-of-type(2){
          margin-top: 6px;
        }
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
    .last {
  display: flex;
  // color: #0f0;
  .logistics {
    flex: 2;
    font-size: 15px;
  }
  .search {
    flex: 2;
  }
}
  }
</style>
