<template>
  <div class="modal-detail" v-if="detail">
    <div class="row">
      <label >收件姓名</label>
      <span>
        {{ detail.step !== 80 ? detail.receiverName : shipMapping.infos.STRING_SHOW_AFTER_ACCEPT }}
      </span>
    </div>
    <div class="row" v-if="!iAmOwner">
      <label>收件電話</label>
      <span :class="getClassName(detail.receiverPhone)">
        {{ detail.receiverPhone }}
      </span>
    </div>
    <div class="row">
      <label >
        交貨方式
      </label>
      <span>全家店到店</span>
    </div>
    <div class="row">
      <label >交貨地點</label>
      <span :class="getClassName(detail.dealAddress)">
        {{ detail.dealAddress }}
      </span>
    </div>
    <div class="row">
      <label >貨運單號</label>
      <span :class="getClassName(detail.shipsn)">
        {{ detail.shipsn }}
        <a :href="famiPic"
           v-if="(deal.shipsn && deal.receiver.name !== deal.user.name)"
           rel="noopener"
           class="link"
           target="_blank">列印繳費單、</a>
        <a
          :href="famiPic.replace('https', 'http')"
          v-if="(deal.shipsn && deal.receiver.name !== deal.user.name)"
          rel="noopener"
          class="link"
          target="_blank"
        >
          備用列印繳費單
        </a>
        <a class="link"
           v-if="deal.shipsn"
           :href="queryShipFami"
           rel="noopener"
           target="_blank">查物流進度</a>
        <span
          v-if="!deal.shipsn && deal.step !== 80 && deal.shipopts === 'sender'"
          class="tips">
          {{
            deal.accepter.bank
            ? '小提醒：貨運單號產生後，請於7天內至全家繳費寄件，逾期訂單失效。'
            : '小提醒：繳費單將於確定送出後 5-10 分鐘產生，請於 7 天內至全家繳費寄件，逾期訂單失效。'
          }}
        </span>
        <span
          v-if="!deal.shipsn && deal.step !== 80 && deal.shipopts === 'receiver' && deal.step >= 32"
          class="tips">
          小提醒：繳費單將於確認收款後5-10 分鐘產生，請於單號產生後 7 天內至全家繳費寄件,逾期訂單失效。
        </span>
      </span>
    </div>
    <div class="row">
      <label>運費金額</label>
      <span>60元</span>
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
import Config from './../../tools/configs'
import {mapActions} from 'vuex'

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
  data () {
    return {
      famiPic: '',
      queryShipFami: Config.queryShipFami,
      shipMapping
    }
  },
  /* eslint-disable */
  methods: {
    ...mapActions({
      getShipsnPic: 'getShipsnPic'
    }),
    getClassName: (value) => {
      if (!value) {
         return ''
      }
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
  },
  computed: {
    detail () {
      const deal = this.deal
      if (!this.famiPic && deal.shipsn && (deal.receiver.name !== deal.user.name)) {
        this.getShipsnPic({id: deal.shipsn, cb: (data) => this.famiPic = data.url})
      }
      const shipStatus = {
        SHIP_STATUS_SEND: 7, // 確認贈送
        SHIP_STATUS_REMITTED: 16, // 確認匯款
        SHIP_STATUS_GOT_THE_FEE: 32 // 確認收款
      }
      const { receiver, shipopts, step, accepter, iAmOwner, types, need_donate, shipway } = deal
      const { bank, branch, account_name, account_number } = receiver;
      let receiverBankInfo = types === shipMapping.infos.STRING_TYPES_WANTS
        ? `${getBankFromCode(bank)} ${need_donate.receiver_bank_branch} ${need_donate.receiver_bank_account_number} ${need_donate.receiver_bank_account_name}`
        : `${getBankFromCode(bank)} ${branch} ${account_number} ${account_name}`;
      let giverBankInfo = types === shipMapping.infos.STRING_TYPES_WANTS ?
        `${getBankFromCode(accepter.bank)} ${need_donate.giver_bank_branch} ${need_donate.giver_bank_account_number} ${need_donate.giver_bank_account_name}` :
        `${getBankFromCode(accepter.bank)} ${accepter.branch} ${accepter.account_number} ${accepter.account_name}`
      const _getReceiverName = () => {
        if (types === shipMapping.infos.STRING_TYPES_WANTS) {
          if (deal.need_donate && deal.need_donate.receiver_name) {
            return deal.need_donate.receiver_name
          }
          if (iAmOwner) {
            return deal.direct_user.name
          }
          return deal.user.name
          // (need_donate.receiver_name || shipMapping.infos.STRING_SHOW_AFTER_ACCEPT)
        }
        return receiver.title
      }
      const receiverPhone = step > shipStatus.SHIP_STATUS_SEND && step !== 80
        ? (types === shipMapping.infos.STRING_TYPES_WANTS
          ? deal.need_donate.receiver_phone
          : deal.receiver.phone)
        : (types === shipMapping.infos.STRING_TYPES_WANTS
          ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT
          : shipMapping.infos.STRING_SHOW_AFTER_SEND)
      const dealAddress = this.dealAddressMap()
      const shipsn = step >= shipStatus.SHIP_STATUS_GOT_THE_FEE
        ? deal.shipsn
        : shipMapping.infos.STRING_SHOW_AFTER_GOT_MONEY
      giverBankInfo = step > shipStatus.SHIP_STATUS_SEND && step !== 80
        ? giverBankInfo
        : (types === shipMapping.infos.STRING_TYPES_WANTS
          ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT
          : shipMapping.infos.STRING_SHOW_AFTER_SEND)
      receiverBankInfo = step >= shipStatus.SHIP_STATUS_REMITTED && step !== 80
        ? receiverBankInfo
        : shipMapping.infos.STRING_SHOW_AFTER_TRANSFER
      return {
        receiverName: _getReceiverName(),
        receiverBankInfo,
        giverBankInfo,
        receiverPhone,
        step,
        shipsn,
        shipway,
        dealAddress
      }
    }
  },
  watch: {
    deal () {
      const {shipsn, receiver, user} = this.deal
      if (!this.famiPic && shipsn && (receiver.name !==user.name)) {
        this.getShipsnPic({id: shipsn, cb: (data) => this.famiPic = data.url})
      }
    }
  }
}
</script>
<style lang="less">
  @import "./../../global.style.less";
</style>
