<template>
  <div class="modal-detail">
    <div class="row">
      <label >收件姓名</label>
      <span >
        {{ detail.receiverName }}
      </span>
    </div>
    <div class="row">
      <label >收件電話</label>
      <span :class="getClassName(detail.receiverPhone)">{{ detail.receiverPhone }}</span>
    </div>
    <div class="row">
      <label >交貨方式</label>
      <span>面交</span>
    </div>
    <div class="row">
      <label >交貨地點</label>
      <span :class="getClassName(detail.dealAddress)">
        {{ detail.dealAddress }}
      </span>
    </div>
    <div class="row">
      <label >贈送者姓名</label>
      <span :class="getClassName(detail.giverName)">
        {{ detail.giverName }}
      </span>
    </div>
    <div class="row">
      <label >贈送者電話</label>
      <span :class="getClassName(detail.giverPhone)">
        {{ detail.giverPhone }}
      </span>
    </div>
  </div>
</template>
<script>
import { statusMap, shipMapping } from '../../tools/constant'
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
      const { receiver, step, need_donate, types } = deal
      const shipStatus = {
        SHIP_STATUS_SEND: 7, // 確認贈送
        SHIP_STATUS_REMITTED: 16, // 確認匯款
        SHIP_STATUS_GOT_THE_FEE: 32 // 確認收款
      }
      const receiverName =
        types === shipMapping.infos.STRING_TYPES_WANTS
        ? step !== 80
          ? (need_donate.receiver_name || shipMapping.infos.STRING_SHOW_AFTER_ACCEPT)
          : shipMapping.infos.STRING_SHOW_AFTER_ACCEPT
        : receiver.title
      const receiverPhone = step > shipStatus.SHIP_STATUS_SEND && step !== 80
        ? (types === shipMapping.infos.STRING_TYPES_WANTS
          ? need_donate.receiver_phone
          : deal.receiver.phone) :
        (types === shipMapping.infos.STRING_TYPES_WANTS
          ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT
          : shipMapping.infos.STRING_SHOW_AFTER_SEND)
      const dealAddress =
        step > shipStatus.SHIP_STATUS_SEND && step !== 80
          ? this.dealAddressMap()
          : (types === shipMapping.infos.STRING_TYPES_WANTS
            ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT
            : shipMapping.infos.STRING_SHOW_AFTER_SEND)
      const giverName = step > shipStatus.SHIP_STATUS_SEND && step !== 80 ?
        (types === shipMapping.infos.STRING_TYPES_WANTS ? deal.need_donate.giver_name : deal.gift_request.giver_name) :
        (types === shipMapping.infos.STRING_TYPES_WANTS ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT : shipMapping.infos.STRING_SHOW_AFTER_SEND)
      const giverPhone = step > shipStatus.SHIP_STATUS_SEND && step !== 80 ?
          (types === shipMapping.infos.STRING_TYPES_WANTS ?
          (deal.need_donate.giver_phone || shipMapping.infos.STRING_NOT_PROVIDE) :
          (deal.gift_request.giver_phone || shipMapping.infos.STRING_NOT_PROVIDE)) :
          (types === shipMapping.infos.STRING_TYPES_WANTS ? shipMapping.infos.STRING_SHOW_AFTER_ACCEPT : shipMapping.infos.STRING_SHOW_AFTER_SEND)
      return {
        receiverName,
        receiverPhone,
        dealAddress,
        giverName,
        giverPhone
      }
    }
  },
  data () {
    return {
      statusMap
    }
  },
  methods: {
    dealAddressMap () {
      let dealAddress = null
      const { shipway, types, need_donate, receiver, gift_request } = this.$props.deal
      if (shipway === 'fami') {
        dealAddress = this.$props.deal.famiCode ? `全家店號 ${this.$props.deal.famiCode}` : shipMapping.infos.STRING_SHOW_AFTER_ACCEPT
      } else if (shipway === 'meet') {
        if (types === shipMapping.infos.STRING_TYPES_WANTS) {
          if (need_donate.giver_address) {
            dealAddress = `${need_donate.giver_city || ''} ${need_donate.giver_district || ''} ${need_donate.giver_address}`
          } else {
            dealAddress = shipMapping.infos.STRING_NOT_PROVIDE
          }
        } else {
          if (gift_request.giver_address) {
            dealAddress = `${gift_request.giver_city || ''} ${gift_request.giver_district || ''} ${gift_request.giver_address}`
          } else {
            dealAddress = shipMapping.infos.STRING_NOT_PROVIDE
          }
        }
      } else {
        dealAddress = (types === shipMapping.infos.STRING_TYPES_WANTS ? need_donate.receiver_address : receiver.address)
      }
      if (!dealAddress) {
        dealAddress = this.$props.iAmOwner ? shipMapping.infos.STRING_NOT_PROVIDE : '（對方暫不提供）'
      }
      return dealAddress
    },
    getClassName: (value) => {
      return value.indexOf('(') === 0 ? 'gray' : ''
    }
  }
}
</script>
<style lang="less">
  @import "./../../global.style.less";
</style>
