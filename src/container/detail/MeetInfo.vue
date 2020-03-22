<template>
<div>
  <ShipwayCard :status="status" :opt="opt">
    <template slot="shipway">
      <div class="row card-title">
        <label>交貨方式：</label>
        <span>面交</span>
    </div>
    <div class="row">
      <label >贈送者姓名：</label>
      <span>
        {{ items && items.giverName }}
      </span>
    </div>
    <div class="row">
      <label >贈送者電話：</label>
      <span>
        {{ items && items.giverPhone }}
      </span>
    </div>
    </template>
    <template slot="local">
      <div class="row card-title">
        <label>收件人：</label>
        <span>{{items && items.receiverName}}</span>
      </div>
      <div class="row">
        <label>收件電話：</label>
        <span>{{items && items.receiverPhone}}</span>
      </div>
      <div class="row">
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
import { shipwayMap, getGiverAdress } from './constants.js'
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
      const Cancel = shipwayMap['cancel']
      this.items = {
        receiverName: Cancel(data.receiver_name, data),
        receiverPhone: Send(data.receiver_phone, data),
        dealAddress: Send(getGiverAdress(data), data),
        giverName: Send(data.giver_name, data),
        giverPhone: Send(data.giver_phone, data)
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
