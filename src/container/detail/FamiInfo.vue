<template>
<div>
  <ShipwayCard :status="status" :opt="opt">
    <template slot="shipway">
      <div class="row card-title">
        <label>交貨方式：</label>
        <span>全家店到店</span>
      </div>
      <div class="row">
        <label>貨運單號：</label>
        <span>{{ items && items.shipsn }}</span>
      </div>
      <div class="row" v-show="detail.shipsn">
        <label>物流跟蹤：</label>
        <span @click="shipView" class="detail-shipway-view">查看</span>
      </div>
      <div class="row" v-show="detail.shipsn && iAmOwner">
        <span @click="orderView()" class="detail-shipway-view">列印繳費單</span>
        <span @click="orderView('spare')" class="detail-shipway-view">備用列印繳費單</span>
      </div>
    </template>
    <template slot="local">
      <div class="row card-title">
        <label>收件人：</label>
        <span>{{items && items.receiverName}}</span>
      </div>
      <div class="row" v-if="!iAmOwner">
        <label>收件電話：</label>
        <span>{{items && items.receiverPhone}}</span>
      </div>
      <div class="row">
        <label>收件地點：</label>
        <span>全家店號 {{items && items.dealAddress}}</span>
      </div>
    </template>
    <template slot="money">
      <div class="row card-title">運費金額：{{detail.shipfee}}元<span>({{shipMapping.opt[detail.shipopts]}})</span></div>
      <div class="row">
        <label>寄件者匯款資訊：</label>
        <span>{{items && items.giverBankInfo}}</span>
        <span class="detail-shipway-view" @click="copyGiverBankInfo(items.giverBankInfo)">複製</span>
      </div>
      <div class="row">
        <label>收件者匯款資訊：</label>
        <span>{{items && items.receiverBankInfo}}</span>
      </div>
    </template>
  </ShipwayCard>
</div>
</template>

<script>
import ShipwayCard from './ShipwayCard'
import { statusMapStep } from '@/tools/strMap'
import { shipwayMap, getBankInfo } from './constants.js'
import { mapActions } from 'vuex'
import Config from '@/tools/configs'
import { shipMapping } from '../../tools/constant'
import copyMixin from './copyMixin'

export default {
  mixins: [copyMixin],
  components: {
    ShipwayCard
  },
  props: {
    deals: {
      type: Object,
      default: () => {}
    },
    iAmOwner: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      items: null,
      shipMapping
    }
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo',
      getShipsnPic: 'getShipsnPic'
    }),
    shipView () {
      window.open(Config.queryShipFami)
    },
    orderView (type) {
      /* eslint-disable */
      this.getShipsnPic({id: this.items.shipsn,
      cb: (data) => {
        if (type !== 'spare') {
          window.open(data.url)
        } else {
          window.open(data.url.replace('https', 'http'))
        }
      }})
    },
    getItem () {
      const deals = this.deals
      const data = deals['gift_request']
      const GotFee = shipwayMap['gotFee']
      const Send = shipwayMap['send']
      const Remitted = shipwayMap['remitted']
      const Cancel = shipwayMap['cancel']
      this.items = {
        receiverName: data.receiver_name,
        receiverPhone: data.receiver_phone,
        dealAddress: Cancel(data.receiver_fami, data),
        shipsn: GotFee(data.shipsn, data),
        receiverBankInfo: Remitted(getBankInfo('receiver', data), data),
        giverBankInfo: Send(getBankInfo('giver', data), data)
      }
    }
  },
  created () {
    this.getItem()
  },
  computed: {
    detail () {
      return this.deals.gift_request
    },
    status () {
      return statusMapStep(this.detail.status)
    },
    opt () {
      return this.detail.shipopts
    },
    cabinetInfo () {
      return JSON.parse(this.detail.gift_ec_order.cabinet_info)
    }
  }
}
</script>

<style lang="less" scoped>
  .recent{
    color: @theme-color;
  }
  .detail-box {
    padding: 30px 10px;
    font-size: 14px;
    .row {
      display: flex;
      > label {
        min-width: 80px;
      }
      > span {
        text-align: right;
      }
    }
  }
</style>
