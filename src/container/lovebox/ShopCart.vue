<template>
  <div class="shop-cart">
    <x-header class="back-header" title="禮物車">
    </x-header>
    <div class="tips">
      <span class="txt">請10分鐘內確認索取，結束將清空禮物車</span>
      <span v-if="ttl" class="time">{{ttl}}</span>
    </div>
    <div class="container">
      <div :key="index" class="shop-item" v-for="(item, index) in loveCart.items">
        <div class="pic-wrapper">
          <img class="pic" :src="(item.options && item.options.goods_pic) || defaultGift" alt="pic">
        </div>
        <div class="info-wrapper">
          <div class="name">{{item.name}}</div>
          <div class="category">{{item.options && item.options.goods_class}}</div>
        </div>
        <Counter
          class="num-btn"
          :min="1"
          :doUpdate="(data) => doUpdateAmount(data, item.row_id, index)"
          :value="cartQuantity[index] || item.quantity"
        >
        </Counter>
        <span @click="remove(item.row_id)" class="cancel"></span>
      </div>
    </div>
    <div class="book-box">
      <div class="expense">到付快遞費用：<i class="account">NT$ {{loveCart.box_count * 150}}</i></div>
      <x-button class="book-btn" @click.native="toSettlement" type="warn">送出訂單</x-button>
    </div>
    <div class="box">打包：<i class="account">{{loveCart.box_count}}</i>個箱子</div>

    <div v-transfer-dom>
      <confirm
        class="adr"
        v-model="show"
        hide-on-blur
        theme="android"
      >
        <div class="adr-confirm">
          <section-title class="book-confirm-title" title="確認收貨地址">
          </section-title>
          <div class="info-item">
            <x-input
              title="收件人姓名"
              text-align="right"
              placeholder="請輸入"
              :max="20"
              v-model.trim="info.consignee"
            >
            </x-input>
          </div>
          <div class="info-item">
            <x-input
              title="收件人電話"
              text-align="right"
              placeholder="請輸入"
              :max="10"
              v-model.trim="info.cellphone"
            >
            </x-input>
          </div>
          <div class="info-item">
            <popup-picker
              title="地區選擇"
              :data="areaMapLists"
              :columns="3"
              v-model="info.site"
            />
          </div>
          <div class="info-item">
            <x-input
              title="詳細地址"
              text-align="right"
              placeholder="請輸入"
              v-model="info.adr"
            >
            </x-input>
          </div>
          <div @click="onConfirm" class="save-btn">確定</div>
        </div>
        <span @click="cancelConfirm" class="close"></span>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Confirm, TransferDomDirective as TransferDom, XButton, PopupPicker } from 'vux'
import Counter from '@/components/Counter'
import defaultGift from '@/assets/icon/img-default-gift.png'
import dateformat from 'dateformat'
import SectionTitle from '@/components/Title'
import {mapActions, mapState, mapMutations} from 'vuex'
import {mapGeo} from '@/tools/strMap'
import { phoneRegex } from '@/tools/regex'

export default {
  directives: {
    TransferDom
  },
  components: {
    XButton,
    Counter,
    Confirm,
    SectionTitle,
    PopupPicker
  },
  data () {
    return {
      defaultGift,
      cartQuantity: [],
      isSettle: false,
      isUpdate: false,
      isRemove: false,
      ttl: 0,
      asideTimer: null,
      show: false,
      info: {
        consignee: '',
        cellphone: '',
        site: [''],
        adr: ''
      }
    }
  },
  created () {
    if (!this.areaMapLists.length) {
      this.getGeoConfig()
    }
    this.controlTimer(this.loveCart.ttl)
    this.getLoveCart({
      cb: (data) => {
        this.cartQuantity = data.items.map(item => (item.quantity))
        this.controlTimer(data.ttl)
      }
    })
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      return this.getLoginUserInfo({cb: () => this.getLoginUserInfoCb()})
    }
    this.getLoginUserInfoCb()
  },
  methods: {
    ...mapActions({
      getLoveCart: 'getLoveCart',
      updateCount: 'updateCount',
      settleLoveCart: 'settleLoveCart',
      removeItem: 'removeItem',
      getGeoConfig: 'getGeoConfig',
      getLoginUserInfo: 'getLoginUserInfo'
    }),
    ...mapMutations({
      resetCurLoveCart: 'resetCurLoveCart'
    }),
    cancelConfirm () {
      this.show = false
    },
    onConfirm () {
      const {consignee, cellphone, site, adr} = this.info
      if (!consignee) {
        return this.$vux.toast.text('請輸入收件人姓名', 'bottom')
      }
      if (!cellphone) {
        return this.$vux.toast.text('請輸入收件人電話', 'bottom')
      } else if (!phoneRegex.test(cellphone.trim())) {
        return this.$vux.toast.text('請輸入正確收件人電話', 'bottom')
      }
      if (!site[0]) {
        return this.$vux.toast.text('請選擇地區', 'bottom')
      }
      if (!adr) {
        return this.$vux.toast.text('請輸入詳細地址', 'bottom')
      }
      if (!this.isSettle) {
        this.isSettle = true
        this.settleLoveCart({
          consignee,
          cellphone,
          address: `${site[0]}${site[1]}${adr}`,
          cb: () => {
            this.isSettle = false
            this.resetCurLoveCart()
            clearInterval(this.asideTimer)
            this.asideTimer = null
            this.ttl = 0
            return this.$router.push('/bookSuc')
          }
        })
      }
    },
    getLoginUserInfoCb () {
      this.info.consignee = this.userInfo.name
      this.info.cellphone = this.userInfo.cellphone
      const {others} = this.userInfo
      if (others) {
        const {addresses} = others
        if (addresses) {
          const {rcvs} = addresses
          this.info.site = [`${rcvs.city}`, `${rcvs.district}`]
          this.info.adr = rcvs.address
        }
      }
    },
    remove (rowId) {
      if (!this.isRemove) {
        this.isRemove = true
        this.removeItem({
          rowId,
          cb: () => {
            this.getLoveCart({
              cb: (data) => {
                this.isRemove = false
                if (!data.items.length) {
                  clearInterval(this.asideTimer)
                  this.asideTimer = null
                  this.ttl = 0
                }
              }
            })
          }
        })
      }
    },
    controlTimer (ttl) {
      if (ttl > 0 && this.loveCart.items.length) {
        if (this.asideTimer) {
          clearInterval(this.asideTimer)
          this.asideTimer = null
        }
        this.ttl = dateformat(ttl * 1000, 'MM:ss')
        this.asideTimer = setInterval(() => {
          ttl = ttl - 1
          if (ttl < 0) {
            this.resetCurLoveCart()
            clearInterval(this.asideTimer)
            this.asideTimer = null
            this.ttl = 0
          } else {
            this.ttl = dateformat(ttl * 1000, 'MM:ss')
          }
        }, 1000)
      }
    },
    doUpdateAmount (quantity, rowId) {
      if (!this.isUpdate) {
        this.isUpdate = true
        this.$vux.loading.show({
          text: '修改數量中...'
        })
        this.updateCount({
          rowId,
          quantity,
          cb: (data) => {
            this.isUpdate = false
            this.$vux.loading.hide()
            if (data.error) {
              if (data.error === 'NO_ENOUGH_PROVISIONS') {
                return this.$vux.toast.text('物品庫存不足，無法加入禮物車', 'bottom')
              } else {
                return this.$vux.toast.text('操作失敗，請稍後重試', 'bottom')
              }
            }
            this.getLoveCart({
              cb: (data) => {
                if (!data.items.length) {
                  clearInterval(this.asideTimer)
                  this.asideTimer = null
                  this.ttl = 0
                } else {
                  this.cartQuantity = data.items.map(item => item.quantity)
                  this.controlTimer(data.ttl)
                }
              }
            })
          }
        })
      }
    },
    toSettlement () {
      if (!this.loveCart.items.length) {
        return this.$vux.toast.text('當前禮物車為空~', 'bottom')
      }
      this.show = true
    }
  },
  computed: {
    ...mapState({
      loveCart: state => state.lovebox.curLoveCart,
      geoConfig: state => state.configs.geoConfig,
      userInfo: state => state.user.userInfo
    }),
    areaMapLists () {
      return mapGeo(this.geoConfig)
    }
  }
}
</script>

<style lang="less">
  @import '../../global.mixin.less';
  .shop-cart{
    .book-btn.weui-btn{
      border-radius: 0;
      &:after{
        border-radius: 0;
      }
    }
  }
  .adr-confirm{
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
      }
    }
  }
</style>
<style lang="less" scoped>
@import '../../global.mixin.less';
.shop-cart{
position: relative;
height: 100%;
.account{
  color: @color-font-CR;
  font-style: normal;
  font-weight: 700;
}
.tips{
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 @pm-bg 0 40px;
  height: 36px;
  color: #FFF;
  font-size: @font-S4;
  background: @color-CR url('../../assets/icon/lovebox/com_bar_ic_time@2x.png') 15px center no-repeat;
  background-size: 14px 14px;
  .time{
    position: absolute;
    top: 0;
    right: @pm-bg;
    height: 36px;
    line-height: 36px;
    color: @color-font-C1;
    font-weight: 700;
    font-size: @font-S2;
  }
}
.container{
  padding: 0 @pm-bg 40px @pm-bg;
  height: calc(~"100% - 130px");
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .shop-item{
    position: relative;
    display: flex;
    justify-content: flex-start;
    padding: @pm-bg 0;
    border-bottom: 1px solid @color-CL;
    .pic-wrapper{
      position: relative;
      width: 72px;
      height: 72px;
      text-align: center;
      background-color: @color-CBG;
      .pic{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        margin: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .info-wrapper{
      margin-left: @pm-bg;
      flex: 0 0 calc(~"100% - 155px");
      .name{
        margin: 4px 0 6px;
        color: @color-font-C1;
        font-size: @font-S2;
        font-weight: 700;
        word-break: break-all;
      }
      .category{
        color: @color-font-C2;
        font-size: @font-S4;
        word-break: break-all;
      }
    }
    .num-btn{
      align-self: flex-end;
    }
    .cancel{
      position: absolute;
      top: 8px;
      right: 0;
      width: 44px;
      height: 44px;
      background: #fff url('../../assets/icon/profile/com_list_ic_delete_normal@2x.png') 0 0 no-repeat;
      background-size: 44px 44px;
    }
    &:last-child{
      border: none;
    }
  }
}
.book-box{
  display: flex;
  align-items: center;
  box-shadow: 3px 0 20px rgba(0, 0, 0, .1);
  background: #FFF;
  .expense{
    flex: 1;
    padding-left: @pm-bg;
    color: @color-font-C1;
    font-size: @font-S3;
  }
  .book-btn{
    width: 120px;
    height: 50px;
    font-size: @font-S2;
  }
}
.box{
  position: absolute;
  bottom: 60px;
  padding-left: @pm-bg;
  width: 117px;
  height: 30px;
  color: @color-font-C2;
  font-size: @font-S4;
  line-height: 30px;
  box-shadow: 4px 0 15px rgba(0, 0, 0, .18);
  border-radius: 0 15px 15px 0;
  background: #FFF;
}
}
.adr-confirm{
  .adr-confirm-title{
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
