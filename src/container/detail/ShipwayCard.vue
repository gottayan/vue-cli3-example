<template>
<div class="card1">
  <div class="shipway detail-card">
    <div class="icon">
      <img :src="carPic" alt="">
    </div>
    <div class="content">
      <slot name="shipway"></slot>
    </div>
  </div>
  <div class="gray-line"></div>
  <div class="local detail-card">
    <div class="icon">
      <img :src="localPic" alt="">
    </div>
    <div class="content">
      <slot name="local"></slot>
    </div>
  </div>
  <div class="gray-line" v-if="opt === 'receiver'"></div>
  <div class="money detail-card" v-if="opt === 'receiver'">
    <div class="icon">
      <img :src="filePic" alt="">
    </div>
    <div class="content">
      <slot name="money"></slot>
    </div>
  </div>
</div>
</template>

<script>
import carPic from '@/assets/icon/merge/order_list_ic_logistics@2x.png'
import localPic from '@/assets/icon/merge/order_list_ic_addressee@2x.png'
import filePic from '@/assets/icon/merge/order_list_ic_money@2x.png'
export default {
  props: {
    status: {
      type: Number,
      default: 80
    },
    opt: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      carPic,
      localPic,
      filePic
    }
  }
}
</script>

<style lang="less">
</style>
