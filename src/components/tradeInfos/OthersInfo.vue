<template>
  <div class="modal-detail">
    <div class="row">
      <label >收件姓名</label>
      <span >{{ detail.receiverName }}</span>
    </div>
    <div class="row">
      <label>收件電話</label>
      <span :class="getClassName(detail.receiverPhone)">
        {{ detail.receiverPhone }}
      </span>
    </div>
    <div class="row">
      <label >
        交貨方式
      </label>
      <span>其他物流寄送</span>
    </div>
    <div class="row">
      <label >
        交貨地點
      </label>
      <span :class="getClassName(detail.dealAddress)">
        {{ detail.dealAddress }}
      </span>
    </div>
    <div class="row">
      <label >運費金額</label>
      <span> {{ detail.shipfee }} 元</span>
    </div>
    <div class="row">
      <label >寄件姓名</label>
      <span :class="getClassName(detail.giverName)">{{ detail.giverName }}</span>
    </div>
    <div class="row" v-if="iAmOwner">
      <label >寄件電話</label>
      <span :class="getClassName(detail.giverPhone)">{{ detail.giverPhone }}</span>
    </div>
    <div class="row" v-if="iAmOwner">
      <label >寄件地址</label>
      <span :class="getClassName(detail.giverAddress)">{{ detail.giverAddress }}</span>
    </div>
    <div class="row" v-if="deal.shipopts === 'receiver'">
      <label >寄件者匯款資訊</label>
      <span :class="getClassName(detail.giverBankInfo)">{{ detail.giverBankInfo }}</span>
    </div>
    <div class="row" v-if="deal.shipopts === 'receiver'">
      <label >收件者匯款資訊</label>
      <span :class="getClassName(detail.receiverBankInfo)">{{ detail.receiverBankInfo }}</span>
    </div>
  </div>
</template>
<script>
import { shipMapping } from './../../tools/constant'
import { getBankFromCode } from './../../tools/strMap'
export default {
  props: {
    deal: {
      type: Object,
      required: true
    },
    iAmOwner: {
      type: Boolean
    }
  },
  /* eslint-disable */
  computed: {
    detail () {
      const { deal } = this.$props
      const shipStatus = {
        SHIP_STATUS_SEND: 7, // 確認贈送
        SHIP_STATUS_REMITTED: 16, // 確認匯款
        SHIP_STATUS_GOT_THE_FEE: 32 // 確認收款
      }
      const { receiver, shipopts, step, accepter, types, need_donate, shipfee } = deal
      const { bank, branch, account_name, account_number } = receiver;
      let receiverBankInfo = types === shipMapping.infos.STRING_TYPES_WANTS ?
        `${getBankFromCode(bank)} ${need_donate.receiver_bank_branch} ${need_donate.receiver_bank_account_number} ${need_donate.receiver_bank_account_name}` :
        `${getBankFromCode(bank)} ${branch} ${account_number} ${account_name}`;
      let giverBankInfo = types === shipMapping.infos.STRING_TYPES_WANTS ?
        `${getBankFromCode(accepter.bank)} ${need_donate.giver_bank_branch} ${need_donate.giver_bank_account_number} ${need_donate.giver_bank_account_name}` :
        `${getBankFromCode(accepter.bank)} ${accepter.branch} ${accepter.account_number} ${accepter.account_name}`
      const receiverName = types === shipMapping.infos.STRING_TYPES_WANTS ?
        step !== 80 ? (need_donate.receiver_name || shipMapping.infos.STRING_SHOW_AFTER_ACCEPT) : shipMapping.infos.STRING_SHOW_AFTER_ACCEPT
        : receiver.title
      const receiverPhone = step > shipStatus.SHIP_STATUS_SEND && step !== 80?
        (types === shipMapping.infos.STRING_TYPES_WANTS ? need_donate.receiver_phone : deal.receiver.phone) :
        (types === shipMapping.infos.STRING_TYPES_WANTS ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT : shipMapping.infos.STRING_SHOW_AFTER_SEND)
      const dealAddress = step > shipStatus.SHIP_STATUS_SEND && step !== 80 ?
        this.dealAddressMap() :
        (types === shipMapping.infos.STRING_TYPES_WANTS ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT : shipMapping.infos.STRING_SHOW_AFTER_SEND)
      const giverName = step > shipStatus.SHIP_STATUS_SEND && step !== 80 ?
        (types === shipMapping.infos.STRING_TYPES_WANTS ? need_donate.giver_name : deal.accepter.name) :
        (types === shipMapping.infos.STRING_TYPES_WANTS ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT : shipMapping.infos.STRING_SHOW_AFTER_SEND)
      const giverPhone = step > shipStatus.SHIP_STATUS_SEND && step !== 80 ?
        (types === shipMapping.infos.STRING_TYPES_WANTS ? need_donate.giver_phone : deal.accepter.phone) :
        (types === shipMapping.infos.STRING_TYPES_WANTS ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT : shipMapping.infos.STRING_SHOW_AFTER_SEND)
      const giverAddress = step > shipStatus.SHIP_STATUS_SEND && step !== 80 ?
        (types === shipMapping.infos.STRING_TYPES_WANTS ? need_donate.giver_address : deal.accepter.address) :
        (types === shipMapping.infos.STRING_TYPES_WANTS ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT : shipMapping.infos.STRING_SHOW_AFTER_SEND)
      return {
        receiverName,
        receiverPhone,
        dealAddress,
        shipfee,
        giverName,
        giverPhone,
        giverAddress,
        giverBankInfo: step > shipStatus.SHIP_STATUS_SEND && step !== 80 ? giverBankInfo :
          (types === shipMapping.infos.STRING_TYPES_WANTS ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT : shipMapping.infos.STRING_SHOW_AFTER_SEND),
        receiverBankInfo:
          step >= shipStatus.SHIP_STATUS_REMITTED &&
          step !== 80
            ? receiverBankInfo
            : shipMapping.infos.STRING_SHOW_AFTER_TRANSFER
      }
    }
  },
  methods: {
    getClassName: (value) => {
      return value.indexOf('(') === 0 ? 'gray' : ''
    },
    dealAddressMap () {
      let dealAddress = null;
      const { shipway, types, need_donate, receiver, gift_request } = this.$props.deal
      if (shipway === 'fami') {
        dealAddress = this.$props.deal.famiCode ? `全家店號 ${this.$props.deal.famiCode}` : shipMapping.infos.STRING_SHOW_AFTER_ACCEPT
      } else if (shipway === 'meet') {
        if (types === shipMapping.infos.STRING_TYPES_WANTS) {
          if (need_donate.giver_address) {
            dealAddress = `${need_donate.giver_city || ''} ${need_donate.giver_district || ''} ${need_donate.giver_address}`
          } else {
            dealAddress = shipMapping.infos.STRING_NOT_PROVIDE;
          }
        } else {
          if (gift_request.giver_address) {
            dealAddress = `${gift_request.giver_city || ''} ${gift_request.giver_district || ''} ${gift_request.giver_address}`
          } else {
            dealAddress = shipMapping.infos.STRING_NOT_PROVIDE;
          }
        }
      } else {
        dealAddress = (types === shipMapping.infos.STRING_TYPES_WANTS ? need_donate.receiver_address : receiver.address)
      }
      if (!dealAddress) {
        dealAddress = this.$props.iAmOwner ? shipMapping.infos.STRING_NOT_PROVIDE : '（對方暫不提供）'
      }
      return dealAddress
    }
  }
}
</script>
<style lang="less">
  @import "./../../global.style.less";
</style>
