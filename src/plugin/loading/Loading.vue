<template>
  <div
    :class="layer ? 'loading layer': 'loading'"
    v-show="show">
    <img
      :src="picLoadingGif"
      width="150"
      height="150"
      alt="">
  </div>
</template>

<script>
import picLoadingGif from '@/assets/icon/com_pic_loading@2x.gif'
export default {
  data () {
    return {
      picLoadingGif,
      show: false,
      layer: false
    }
  }
}
</script>

<style lang='less' scoped>
  .loading{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999999;
    display: flex;
    justify-content: center;
    align-items: center;
    &.layer{
      background: rgba(0, 0, 0, .5);
    }
  }
</style>
