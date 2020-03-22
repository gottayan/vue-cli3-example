<template>
<div>
  <ShipwayCard :status="status" :opt="opt">
    <template slot="shipway">
      <div class="row card-title">
        <label>交貨方式：</label>
        <span>掌櫃寄送</span>
      </div>
      <div class="row">
        <div v-if="iAmOwner">
          <label>寄件碼：</label>
          <span>{{items && items.code}}</span>
        </div>
        <div v-else>
          <label>取件碼：</label>
          <span>{{detail.gift_ec_order && detail.gift_ec_order.pickup_number || '暫無'}}</span>
        </div>
      </div>
      <div class="row">
        <div>
          <label>(托寄物)訂單號：</label>
          <span>{{items && items.pn}}</span>
        </div>
      </div>
      <div class="row" v-if="!iAmOwner">
        <label >寄件姓名：</label>
        <span>{{ items.giverName }}</span>
      </div>
      <div class="row" v-if="opt !== 'receiver'">
        <label>運費金額：</label>
        <span>{{detail.shipfee}}元</span>
        <span>({{shipMapping.opt[detail.shipopts]}})</span>
      </div>
      <div class="row" v-show="iAmOwner && detail.gift_ec_order.pdf">
        <label>掌櫃訂單明細：</label>
        <span @click="openPdf(detail.gift_ec_order.pdf)" class="detail-shipway-view">查看</span>
      </div>
      <div class="row" v-show="detail.gift_ec_order.freight">
        <label>物流跟蹤：</label>
        <span @click="showMoreInfo" class="detail-shipway-view">查看</span>
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
        <label>收件櫃機：</label>
        <span>{{cabinetInfo.THROWBUILDINGNAME}}</span>
      </div>
      <div class="row" v-if="!iAmOwner">
        <label>櫃機地址：</label>
        <span>{{cabinetInfo.TW_THROWADDRESS}}</span>
      </div>
    </template>
    <template slot="money">
      <div class="row card-title">
        <label>運費金額：</label>
        <span>{{detail.shipfee}}元</span>
        <span>({{shipMapping.opt[this.detail.shipopts]}})</span>
      </div>
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
  <x-dialog
    v-model="showDialog"
    class="dialog-demo"
    hide-on-blur
    :dialog-style="{
      'overflow-y': 'auto',
      'max-height': '300px'
    }">
    <div class="img-box">
      <timeline v-show="detail.gift_ec_order.freight && detail.gift_ec_order.freight.length">
        <timeline-item v-for="(item, index) in JSON.parse(detail.gift_ec_order.freight)" :key="index">
          <div :class="[index === 0 ? 'recent' : '']">{{item.exp}}</div>
          <div :class="[index === 0 ? 'recent' : '']">{{item.date}}</div>
        </timeline-item>
      </timeline>
    </div>
    <div @click="showDialog=false" class="btn-close">
      <x-icon type="ios-close-empty" size="30"></x-icon>
    </div>
  </x-dialog>
</div>
</template>

<script>
import ShipwayCard from './ShipwayCard'
import { statusMapStep } from '@/tools/strMap'
import { XDialog, Timeline, TimelineItem } from 'vux'
import { shipwayMap, getBankInfo } from './constants.js'
import { mapActions } from 'vuex'
import { shipMapping } from '../../tools/constant'
import copyMixin from './copyMixin'

export default {
  mixins: [copyMixin],
  components: {
    ShipwayCard,
    XDialog,
    Timeline,
    TimelineItem
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
      showDialog: false,
      showBoxDetail: false,
      items: null,
      shipMapping
    }
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo'
    }),
    openPdf: (pdf) => {
      window.open(pdf)
    },
    showMoreInfo () {
      this.showDialog = true
    },
    showMoreDetail () {
      this.showBoxDetail = true
    },
    getItem () {
      const deals = this.deals
      const data = deals['gift_request']
      const shipInfo = data['gift_ec_order']
      const Send = shipwayMap['send']
      const Remitted = shipwayMap['remitted']
      this.items = {
        code: Send(shipInfo['check_code'], data),
        pn: Send(shipInfo['ec_order_pn'], data),
        receiverName: data.receiver_name,
        receiverPhone: data.receiver_phone,
        giverName: Send(data.giver_name, data),
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
