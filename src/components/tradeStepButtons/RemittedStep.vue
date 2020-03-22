<template>
  <ul class="functions">
    <!--<li class="item">-->
    <!--<button class="g-button orange"-->
    <!--@click="toggleModal">寄送資訊</button>-->
    <!--</li>-->
    <!--<li class="item" v-if="iAmOwner && wantType && shipway === 'hct'">-->
    <!--<button class="g-button gray" @click="doCancel">取消贈送</button>-->
    <!--</li>-->
    <!--<li class="item" v-if="iAmOwner && wantType && shipway === 'hct'">-->
    <!--<button class="g-button red">-->
    <!--確認運送細節-->
    <!--</button>-->
    <!--</li>-->
    <!--<li class="item" v-if="iAmOwner && !(wantType && shipway === 'hct')">-->
    <!--<button class="g-button red" @click="doReceiveMoney">-->
    <!--確認收款-->
    <!--</button>-->
    <!--</li>-->
    <!--<li class="item" v-if="!iAmOwner">-->
    <!--<button class="g-button gray" disabled>-->
    <!--等待中-->
    <!--</button>-->
    <!--</li>-->
    <li class="item">
      <button class="g-button orange"
              @click="toggleModal">寄送資訊</button>
    </li>
    <li class="item" v-if="iAmOwner && shipway === 'hct'">
      <button class="g-button gray" @click="doCancel">取消贈送</button>
    </li>
    <li class="item" v-if="iAmOwner && shipway === 'hct'">
      <button @click="doSend" class="g-button red">
        確認運送細節
      </button>
    </li>
    <li class="item" v-if="iAmOwner && shipway !== 'hct' && !wantType">
      <button class="g-button red" @click="doReceiveMoney">
        確認收款
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
 * step #16, 已經匯款
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
    wantType: {
      type: Boolean,
      default: false
    },
    shipway: {
      type: String,
      default: 'hct'
    },
    doReceiveMoney: {
      type: Function,
      default: () => { console.log('確認收款') }
    },
    doCancel: {
      type: Function,
      default: () => { console.log('取消赠送') }
    },
    toggleModal: {
      type: Function,
      default: () => { console.log('查看咨询') }
    },
    doSend: {
      type: Function,
      default: () => { console.log('發送贈送') }
    }
  },
  methods: {
  }
}
</script>
