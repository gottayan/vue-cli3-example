<template>
  <ul class="functions">
    <li class="item">
      <button class="g-button orange"
              @click="toggleModal">寄送資訊</button>
    </li>
    <li class="item" v-if="(wantType ? !iAmOwner : iAmOwner)">
      <button class="g-button red" @click="doAction">
        {{ wantType ? '還是收下他' : '還是送給他' }}
      </button>
    </li>
    <li class="item" v-if="(wantType ? !iAmOwner : iAmOwner)">
      <button class="g-button gray"  disabled>已略過</button>
    </li>
    <li class="item" v-if="(wantType ? iAmOwner : !iAmOwner)">
      <button class="g-button gray" disabled>
        等待中
      </button>
    </li>
  </ul>
</template>
<script>
/**
 * step #4, 已略过
 */
export default {
  props: {
    wantType: {
      type: Boolean
    },
    iAmOwner: {
      type: Boolean,
      default: false
    },
    toggleModal: {
      type: Function,
      default: () => { console.log('查看咨询') }
    },
    doAction: {
      type: Function,
      default: () => { console.log('還是收下他或者還是送給他操作') }
    },
    doCancel: {
      type: Function,
      default: () => { console.log('取消赠送') }
    }
  }
}
</script>
