<template>
  <ul class="functions">
    <li class="item">
      <button class="g-button orange"
              @click="toggleModal">寄送資訊</button>
    </li>
    <li class="item" v-if="iAmOwner">
      <button class="g-button red" @click="doCancel">取消贈送</button>
    </li>
    <li class="item" v-if="iAmOwner">
      <button class="g-button gray" disabled>
        等待中
      </button>
    </li>
    <li class="item" v-if="!iAmOwner">
      <button class="g-button red" @click="doTransfer">
        確認匯款
      </button>
    </li>
  </ul>
</template>
<script>
/**
 * step #8, 匯款中
 */
export default {
  props: {
    number: {
      type: Number,
      default: 12
    },
    iAmOwner: {
      type: Boolean,
      default: true
    },
    doTransfer: {
      type: Function,
      default: () => { console.log('確認匯款') }
    },
    doCancel: {
      type: Function,
      default: () => { console.log('取消赠送') }
    },
    toggleModal: {
      type: Function,
      default: () => { console.log('查看咨询') }
    }
  }
}
</script>
