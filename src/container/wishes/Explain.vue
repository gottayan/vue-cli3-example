<template>
  <div class="explain-wrap"
       id="wrap"
    :style="{backgroundImage: `url(${explainImg})`}"
  >
    <div class="header">
      <sticky scroll-box="wrap" :offset="0" :check-sticky-support="false">
        <x-header
          title="活動說明"
        ></x-header>
      </sticky>
      <div class="vux-sticky-fill" style="height:44px;"></div>
    </div>
    <img class="explain"
         v-gallery
         :src="explainImg" />
  </div>
</template>

<script>
import explainImg from '../../assets/img/wishes/explain.png'
import { Sticky } from 'vux'
export default {
  components: {
    Sticky
  },
  data () {
    return {
      explainImg
    }
  }
}
</script>

<style lang="less" scoped>
  .explain-wrap {
    width: 100%;
    height: 100%;
    .explain {
      width: 100%;
      height: 100%;
    }
  }
</style>
