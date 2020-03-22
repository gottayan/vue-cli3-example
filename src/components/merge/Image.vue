<template>
  <div class="pic">
    <div v-for="i in 4"
    :key="i"
    >
      <div v-if="!mergeChild[i - 1]"></div>
      <div v-else class="item"
          :class="`item${i}`"
          :style="{backgroundImage: `url(${smartImagePath(mergeChild[i - 1] && mergeChild[i - 1][poolType].image_path) || defaultGift})`}">
      </div>
    </div>
  </div>
</template>

<script>
import defaultGift from '@/assets/icon/img-default-gift.png'
import {smartImagePath} from '@/tools/ObjectHelper'

export default {
  props: {
    mergeChild: {
      type: Array,
      default: () => []
    },
    toItem: {
      type: Function,
      default: null
    },
    poolType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      defaultGift,
      smartImagePath
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../global.mixin.less';
.pic{
  position: relative;
  flex: 0 0 90px;
  height: 90px;
  background-size:90px auto;
  background-repeat:no-repeat;
  background-position: center center;
  background-color: @color-CBG;
  overflow: hidden;
  .tag{
    position: absolute;
    top: 0;
    left: 6px;
    width: 18px;
    height: 30px;
  }
  > img {
    width: 45px;
    height: 45px;
  }
  .item {
    position: absolute;
    flex: 0 0 45px;
    height: 45px;
    width: 45px;
    background-size:45px 45px;
    background-repeat:no-repeat;
    background-position: center center;
    background-color: @color-CBG;
    overflow: hidden;
  }
  .item1 {
    top: 0;
    left: 0;
  }
  .item2 {
    left: 45px;
    top: 0;
  }
  .item3 {
    left: 0;
    top: 45px;
  }
  .item4 {
    left: 45px;
    top: 45px;
  }
}
</style>
