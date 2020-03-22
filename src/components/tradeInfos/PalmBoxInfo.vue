<template>
  <div class="modal-detail palmboxinfo-container">
    <div class="row">
      <label >收件姓名</label>
      <span :class="getClassName(detail.receiverName)">
        {{ detail.receiverName }}
      </span>
    </div>
    <div class="row" v-if="!iAmOwner">
      <label >收件電話</label>
      <span :class="getClassName(detail.receiverPhone)">
        {{ detail.receiverPhone }}
      </span>
    </div>
    <div class="row" v-if="!iAmOwner">
      <label >寄件姓名</label>
      <span :class="getClassName(detail.giverName)">{{ detail.giverName }}</span>
    </div>
    <div class="row">
      <label >交貨方式</label>
      <span>掌櫃</span>
    </div>
    <div class="row">
      <label >收件櫃機</label>
      <span :class="getClassName(detail.boxName)">{{ detail.boxName }}</span>
    </div>
    <div class="row">
      <label >櫃機地址</label>
      <span :class="getClassName(detail.boxAddress)">{{ detail.boxAddress }}</span>
    </div>
    <!-- <div class="row" v-if="!iAmOwner">
      <label >寄件電話</label>
      <span :class="getClassName(detail.giverPhone)">{{ detail.giverPhone }}</span>
    </div> -->
    <div class="row" v-if="iAmOwner">
      <label >寄件碼</label>
      <span :class="getClassName(detail.check_code)">{{ detail.check_code }}</span>
    </div>
    <div class="row" v-if="!iAmOwner">
      <label >取件碼</label>
      <span :class="getClassName(detail.pickUpCode)">{{ detail.pickUpCode }}</span>
    </div>
    <div class="row" v-show="iAmOwner && detail.pdf">
      <label >訂單明細<x-icon type="ios-help-outline" size="20" @click="showInfoAboutCode"></x-icon></label>
      <span><span @click="openPdf(detail.pdf)">查看</span></span>
    </div>
    <div class="row">
      <label >(托寄物)訂單號</label>
      <span :class="getClassName(detail.pn)">{{ detail.pn }}</span>
    </div>
    <div class="row" v-show="detail.freight.length">
      <label >追蹤包裹</label>
      <span :class="getClassName(detail.freight)"><span @click="showMoreInfo">查看</span></span>
    </div>
    <div class="row">
      <label >運費金額</label>
      <span>{{ detail.shipfee }} 元<em>({{shipMapping.opt[this.deal.shipopts]}})</em></span>
    </div>
    <div class="row" v-if="deal.shipopts === 'receiver'">
      <label >寄件者匯款資訊</label>
      <span :class="getClassName(detail.giverBankInfo)">{{ detail.giverBankInfo }} <span @click="copyGiverBankInfo">複製</span></span>
    </div>
    <div class="row" v-if="deal.shipopts === 'receiver'">
      <label >收件者匯款資訊</label>
      <span :class="getClassName(detail.receiverBankInfo)">{{ detail.receiverBankInfo }}</span>
    </div>
    <x-dialog
      v-model="showDialog"
      class="dialog-demo"
      hide-on-blur
      :dialog-style="{
        'overflow-y': 'auto',
        'max-height': '300px'
      }">
      <div class="img-box">
        <timeline v-show="detail.freight.length">
          <timeline-item v-for="(item, index) in detail.freight" :key="index">
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
import { shipMapping } from '@/tools/constant'
import { getBankFromCode } from '@/tools/strMap'
import { XDialog, Timeline, TimelineItem } from 'vux'
import clipboard from 'clipboard-copy'
export default {
  components: {
    XDialog,
    Timeline,
    TimelineItem
  },
  data () {
    return {
      shipMapping,
      showDialog: false
    }
  },
  props: {
    deal: {
      type: Object,
      required: true
    },
    iAmOwner: {
      type: Boolean
    }
  },
  methods: {
    showMoreInfo () {
      this.showDialog = true
    },
    getClassName: (value) => {
      return value && value.indexOf('(') === 0 ? 'gray' : ''
    },
    openPdf: (pdf) => {
      window.open(pdf)
    },
    showInfoAboutCode () {
      this.$vux.alert.show({
        title: `寄件碼提示`,
        content: '若寄件碼失效，請列印此訂單明細到櫃機掃描條碼進行寄件。',
        buttonText: '確定',
        onHide: () => {
          console.log('Plugin: I\'m hiding')
        }
      })
    },
    copyGiverBankInfo () {
      console.log('you click me')
      const copyPromise = clipboard(this.detail.giverBankInfo)
      copyPromise.then(res => {
        this.$vux.toast.text('複製成功', 'bottom')
      }).catch(err => {
        console.log('出錯啦', err)
        this.$vux.toast.text('複製失敗，建議您手動複製', 'bottom')
      })
    }
  },
  computed: {
    detail () {
      /* eslint-disable */
      const { deal } = this.$props
      const shipStatus = {
        SHIP_STATUS_SEND: 7, // 確認贈送
        SHIP_STATUS_REMITTED: 16, // 確認匯款
        SHIP_STATUS_GOT_THE_FEE: 32 // 確認收款
      }
      const { receiver, step, types, need_donate, gift_request, accepter, shipopts, shipfee } = deal
      const { bank, branch, account_name, account_number } = receiver;
      const iswant = types === shipMapping.infos.STRING_TYPES_WANTS
      const boxBaseInfo = iswant ? JSON.parse(need_donate.need_ec_order.cabinet_info) : JSON.parse(gift_request.gift_ec_order.cabinet_info)
      const receiverName = iswant ?
        step !== 80 ? (need_donate.receiver_name || shipMapping.infos.STRING_SHOW_AFTER_ACCEPT) : shipMapping.infos.STRING_SHOW_AFTER_ACCEPT
        : receiver.title
      const receiverPhone = step > shipStatus.SHIP_STATUS_SEND && step !== 80 ?
        (iswant ? need_donate.receiver_phone : deal.receiver.phone) :
        (iswant ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT : shipMapping.infos.STRING_SHOW_AFTER_SEND)
      const giverName = step > shipStatus.SHIP_STATUS_SEND && step !== 80 ?
        (iswant ? need_donate.giver_name : deal.accepter.name ) :
        (iswant ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT : shipMapping.infos.STRING_SHOW_AFTER_SEND)
      // const giverPhone = step > shipStatus.SHIP_STATUS_SEND && step !== 80 ?
      //   (iswant ? need_donate.giver_phone : deal.accepter.phone) :
      //   (iswant ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT : shipMapping.infos.STRING_SHOW_AFTER_SEND)
      // 寄件碼生成規則
      // 1. 禮物
      //  1.1 匯運費給贈送者，在確認收款后拋單產生
      //  1.2 贈送者自己出運費，在送給他之後產生
      // 2. 需求
      //  2.1 匯運費給贈送者，在確認收款后拋單產生
      //  2.2 贈送者負擔運費，在確定收下他後產生
      const check_code = step >= shipStatus.SHIP_STATUS_GOT_THE_FEE && step !== 80 ?
        (iswant ? need_donate.need_ec_order.check_code : gift_request.gift_ec_order.check_code ) :
        (iswant ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT : shipopts === 'pod' ? shipMapping.infos.STRING_SHOW_AFTER_SEND : shipMapping.infos.STRING_SHOW_AFTER_GOT_MONEY)
      const pdf = step >= shipStatus.SHIP_STATUS_GOT_THE_FEE && step !== 80 ?
        (iswant ? need_donate.need_ec_order.pdf : gift_request.gift_ec_order.pdf ) :
        ''
      const pn = step >= shipStatus.SHIP_STATUS_GOT_THE_FEE && step !== 80 ?
        (iswant ? need_donate.need_ec_order.ec_order_pn : gift_request.gift_ec_order.ec_order_pn ) :
        (iswant ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT : shipopts === 'pod' ? shipMapping.infos.STRING_SHOW_AFTER_SEND : shipMapping.infos.STRING_SHOW_AFTER_GOT_MONEY)
      const boxAddress = boxBaseInfo.TW_THROWADDRESS || '顯示異常請聯繫客服'
      const boxName = boxBaseInfo.THROWBUILDINGNAME || '顯示異常請聯繫客服'
      let receiverBankInfo = iswant ?
        `${getBankFromCode(bank)} ${need_donate.receiver_bank_branch} ${need_donate.receiver_bank_account_number} ${need_donate.receiver_bank_account_name}` :
        `${getBankFromCode(bank)} ${branch} ${account_number} ${account_name}`;
      let giverBankInfo = iswant ?
        `${getBankFromCode(accepter.bank)} ${need_donate.giver_bank_branch} ${need_donate.giver_bank_account_number} ${need_donate.giver_bank_account_name}` :
        `${getBankFromCode(accepter.bank)} ${accepter.branch} ${accepter.account_number} ${accepter.account_name}`;
      receiverBankInfo = step >= shipStatus.SHIP_STATUS_REMITTED && step !== 80 ? receiverBankInfo : shipMapping.infos.STRING_SHOW_AFTER_TRANSFER
      giverBankInfo = step > shipStatus.SHIP_STATUS_SEND && step !== 80 ? giverBankInfo :
        (iswant ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT : shipMapping.infos.STRING_SHOW_AFTER_TRANSFER)

      // 物流过程
      let freight = iswant ? need_donate.need_ec_order.freight : gift_request.gift_ec_order.freight
      freight = freight && JSON.parse(freight).reverse() || []

      const pickUpCode =
        iswant
          ? (need_donate.need_ec_order && need_donate.need_ec_order.pickup_number) || ""
          : (gift_request.gift_ec_order && gift_request.gift_ec_order.pickup_number) || ""

      return {
        receiverName,
        receiverPhone,
        giverName,
        // giverPhone,
        pdf,
        check_code,
        pn,
        boxName,
        boxAddress,
        giverBankInfo,
        receiverBankInfo,
        freight,
        pickUpCode,
        shipfee
      }
    }
  }
}
</script>

<style lang="less">
  .palmboxinfo-container .vux-timeline-item-content{
    text-align: left;
    text-indent: .5em;
  }
  
  .palmboxinfo-container .vux-timeline-item:last-child .vux-timeline-item-content{
    padding-bottom: 0;
  }
</style>

<style lang="less" scoped>
  .row{
    a,span{
      color: @color-CO;
    }
  }

  .recent{
    color: @theme-color;
  }

  .btn-close{
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
