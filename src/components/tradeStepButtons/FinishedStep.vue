<template>
  <ul class="functions">
    <li class="item">
      <button class="g-button orange"
              @click="toggleModal">寄送資訊</button>
    </li>
    <li class="item" v-if="iAmOwner && (identity === 'gov' || identity === 'nonprofit')">
      <button class="g-button red" @click="doShowReceipt">
        索取收據
      </button>
    </li>
    <li class="item" v-if="iAmOwner && !(identity === 'gov' || identity === 'nonprofit')">
      <button class="g-button gray" disabled>
        完成
      </button>
    </li>
    <li class="item" v-if="!iAmOwner">
      <button class="g-button red" @click="doThanks" :disabled="!!mergeChildren.length">
        寫下感謝
      </button>
    </li>
  </ul>
</template>
<script>
/**
 * step #128, 完成
 */
export default {
  props: {
    iAmOwner: {
      type: Boolean,
      default: true
    },
    identity: { // 身份 gov 政府機構  nonprofit 非盈利公益組織
      type: String,
      default: ''
    },
    doThanks: {
      type: Function,
      default: () => { console.log('寫下感謝') }
    },
    toggleModal: {
      type: Function,
      default: () => { console.log('查看咨询') }
    },
    doShowReceipt: {
      type: Function,
      default: () => { console.log('索取收據') }
    },
    mergeChildren: {
      type: Array,
      default: () => []
    }
  }
}
</script>
