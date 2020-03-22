<template>
  <ul class="functions">
    <li class="item">
      <button class="g-button orange"
              @click="toggleModal">寄送資訊</button>
    </li>
    <li class="item" v-if="iAmOwner && number > 0">
      <button class="g-button gray"  @click="doIgnore">暫時不送</button>
    </li>
    <li class="item" v-if="iAmOwner && number > 0">
      <button class="g-button red" @click="doSend">送給他</button>
    </li>
    <li class="item" v-if="!(iAmOwner && number > 0)">
      <button class="g-button gray" disabled>
        {{ number > 0 ? '等待中' : '已被索取完' }}
      </button>
    </li>
  </ul>
</template>
<script>
/**
 * step #0, 索取中
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
    toggleModal: {
      type: Function,
      default: () => { console.log('查看咨询') }
    },
    doSend: {
      type: Function,
      default: () => { console.log('發送贈送') }
    },
    doIgnore: {
      type: Function,
      default: () => { console.log('暫時不送給他') }
    }
  }
}
</script>
