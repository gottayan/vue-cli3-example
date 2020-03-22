<template>
  <ul class="functions">
    <li class="item">
      <button class="g-button orange"
              @click="toggleModal">寄送資訊</button>
    </li>
    <li class="item" v-if="iAmOwner && optIsReceiver !== 'receiver'">
      <button class="g-button red" @click="doCancel">取消贈送</button>
    </li>
    <li class="item" v-if="iAmOwner && (shipway === 'hct' && !shipsn)">
      <button class="g-button gray" disabled>
        已寄出
      </button>
    </li>
    <li class="item" v-if="iAmOwner && !(shipway === 'hct' && !shipsn)">
      <button class="g-button red" @click="doSent">
        {{ shipway === 'meet' ? '確認面交' : '確認寄出' }}
      </button>
    </li>
    <li class="item" v-if="!iAmOwner">
      <button class="g-button gray" disabled>
        等待中
      </button>
    </li>
  </ul>
</template>
<script>
/**
 * step #32, 已經收到匯款
 */
export default {
  props: {
    iAmOwner: {
      type: Boolean
    },
    optIsReceiver: { // 是否索取者付運費方式
      type: String,
      default: ''
    },
    shipway: {
      type: String,
      default: 'hct'
    },
    shipsn: { // 物流訂單號
      type: String,
      default: ''
    },
    toggleModal: {
      type: Function,
      default: () => { console.log('查看咨询') }
    },
    doCancel: {
      type: Function,
      default: () => { console.log('取消贈送') }
    },
    doSent: {
      type: Function,
      default: () => { console.log('確認送出') }
    }
  },
  mounted () {
    console.log(this.optIsReceiver, 'optIsReceiver')
    if (this.iAmOwner && this.shipway === 'palmbox') {
      this.$vux.confirm.show({
        title: this.shipsn ? `您的寄件碼${this.shipsn}` : '暫無寄件碼',
        content: this.shipsn
          ? '請在72小時內使用此寄件碼，到附近掌櫃櫃機進行寄件。如超出72小時，請印出“訂單明細”到櫃機掃描條碼即可寄件。'
          : '當前系統未產生寄件碼，若超時15分鐘仍無寄件碼請聯繫客服',
        confirmText: '查看詳情',
        cancelText: '關閉',
        hideOnBlur: true,
        onCancel: () => {
          console.log('modal cancel')
        },
        onConfirm: () => {
          this.toggleModal()
        }
      })
    }
  }
}
</script>
