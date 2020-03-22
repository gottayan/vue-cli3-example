<template>
  <ul class="functions">
    <li class="item">
      <button class="g-button orange"
              @click="toggleModal">寄送資訊</button>
    </li>
    <li class="item" v-if="!iAmOwner && number > 0">
      <button class="g-button gray"  @click="doIgnore">婉拒</button>
    </li>
    <li class="item" v-if="!iAmOwner && number > 0">
      <button class="g-button red" @click="doTake">收下禮物</button>
    </li>
    <li class="item" v-if="!(!iAmOwner && number > 0)">
      <button class="g-button gray" @click="doCancel">取消贈送</button>
    </li>
    <li class="item" v-if="!(!iAmOwner && number > 0)">
      <button class="g-button gray" disabled>
        {{ number > 0 ? '等待中' : '已被索取完' }}
      </button>
    </li>
  </ul>
</template>
<script>
/**
 * step #2, 索取中
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
    doTake: {
      type: Function,
      default: () => { console.log('收下礼物') }
    },
    doIgnore: {
      type: Function,
      default: () => { console.log('點擊暫時不送') }
    },
    doCancel: {
      type: Function,
      default: () => { console.log('取消赠送') }
    }
  }
}
</script>
