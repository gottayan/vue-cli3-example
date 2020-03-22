<template>
<div>
  <ShipwayCard :status="status" :opt="opt">
    <template slot="shipway">
      <div class="row card-title">
        <label>交貨方式：</label>
        <span>新竹物流</span>
      </div>
      <div class="row">
        <label>貨運單號：</label>
        <span>{{ items && items.shipsn }}</span>
      </div>
      <div class="row">
        <label>貨運金額：</label>
        <span>{{items && items.transferAmount}}</span>
      </div>
      <div class="row">
        <label>上門收件時間：</label>
        <span>{{ items && items.pickdate }}</span>
      </div>
      <div class="row" v-if="iAmOwner">
        <label >寄件電話：</label>
        <span>{{ items && items.giverPhone }}</span>
      </div>
      <div class="row" v-if="iAmOwner">
        <label >寄件地址：</label>
        <span>{{ items && items.giverAddress }}</span>
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
      <div class="row" v-if="!iAmOwner">
        <label>交貨地點：</label>
        <span>{{items && items.dealAddress}}</span>
      </div>
    </template>
    <template slot="money">
      <div class="row card-title">
        <label>運費金額：</label>
        <span>{{detail.shipfee}}元</span>
        <span>({{shipMapping.opt[detail.shipopts]}})</span>
      </div>
      <div class="row">
        <label>寄件者匯款資訊：</label>
        <span>{{items && items.receiverBankInfo}}</span>
        <span class="detail-shipway-view" @click="copyGiverBankInfo(items.giverBankInfo)">複製</span>
      </div>
      <div class="row">
        <label>收件者匯款資訊：</label>
        <span>{{items && items.giverBankInfo}}</span>
      </div>
    </template>
  </ShipwayCard>
</div>
</template>

<script>
import ShipwayCard from './ShipwayCard'
import { statusMapStep } from '@/tools/strMap'
import { shipwayMap, shipStatus, getGiverAdress } from './constants.js'
import { mapActions } from 'vuex'
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
    getItem () {
      const deals = this.deals
      const data = deals['gift_request']
      const Send = shipwayMap['send']
      const Remitted = shipwayMap['remitted']
      const boxes = data.giver_boxes
      let pickdate = data.giver_sent_at
      pickdate && (pickdate = pickdate.split(' ')[0].split('-').join('/'))
      pickdate = this.status !== 80 && this.status > shipStatus.SHIP_STATUS_REMITTED
        ? ((pickdate && pickdate !== '待定')
          ? (pickdate + ' 收')
          : '待定')
        : shipMapping.infos.STRING_SHOW_AFTER_CONFIRM_DETAIL
      this.items = {
        receiverName: data.receiver_name,
        receiverPhone: data.receiver_phone,
        dealAddress: Send(data.receiver_address, data),
        transferAmount: Remitted(`${boxes} 箱共 ${boxes * 150} 元`, data),
        shipsn: data.shipsn || shipMapping.infos.STRING_SHIPSN_TIPS_FOR_HCT,
        pickdate,
        giverPhone: Send(data.giver_phone, data),
        giverAddress: Send(getGiverAdress(data), data)
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
