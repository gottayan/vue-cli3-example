<template>
  <div class="pusage-container">
    <sticky :offset="0">
      <x-header :title="$route.meta.title"></x-header>
    </sticky>
    <div class="pusage-content-wrapper">
      <div v-if="!step">
        <img :src="item" alt="" v-for="(item, index) in mainPics" :key="index">
      </div>
      <div v-else>
        <div v-if="step === 'request'">
          <img :src="item" alt="" v-for="(item, index) in requestPics" :key="index">
        </div>
        <div v-if="step === 'donate'">
          <img :src="item" alt="" v-for="(item, index) in donatePics" :key="index">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import main1Pic from '@/assets/icon/palmbox/usage-1.jpg'
import main2Pic from '@/assets/icon/palmbox/usage-2.jpg'
import main3Pic from '@/assets/icon/palmbox/usage-3.jpg'
import main4Pic from '@/assets/icon/palmbox/usage-4.jpg'
import main5Pic from '@/assets/icon/palmbox/usage-5.jpg'
import { Sticky } from 'vux'
export default {
  components: {
    Sticky
  },
  data () {
    return {
      mainPics: [
        main1Pic,
        main2Pic,
        main3Pic,
        main4Pic,
        main5Pic
      ],
      requestPics: [
        main4Pic
      ],
      donatePics: [
        main3Pic,
        main5Pic
      ]
    }
  },
  computed: {
    step () {
      return this.$route.query.step
    }
  }
}
</script>

<style lang="less" scoped>
  .pusage-container{
    height: 100%;
    overflow: scroll;
    scroll-behavior: smooth;
    -webkit-scroll-behavior: smooth;
    overflow-scrolling: touch;
    -webkit-overflow-scrolling: touch;
    img{
      width: 100%;
    }
  }
</style>
