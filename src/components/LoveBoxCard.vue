<template>
  <div class="love-box-card">
    <span class="pic-wrapper">
      <img
        :src="smallPic || defaultGift"
        class="pic"
        height="auto"
        alt="pic">
      <img
        v-if="!remain"
        class="tag"
        width="18"
        height="30"
        :src="picLabelSend"
        alt="picLabelSend">
    </span>
    <span class="name">{{name}}</span>
    <div class="provider">
      <img
        class="icon"
        :src="iconIcName"
        width="14"
        height="14"
        alt="icon">
      <span class="txt">{{provider}} （{{company}}）</span>
    </div>
  </div>
</template>

<script>
import defaultGift from '@/assets/icon/img-default-gift.png'
import iconIcName from '@/assets/icon/lovebox/com_list_ic_name@2x.png'
import picLabelSend from '@/assets/icon/gift/home_pic_label_send@2x.png'
import {smartImagePath} from '@/tools/ObjectHelper'

export default {
  props: {
    pic: {
      type: String
    },
    name: {
      type: String
    },
    provider: {
      type: String
    },
    company: {
      type: String
    },
    remain: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      defaultGift,
      iconIcName,
      picLabelSend
    }
  },
  computed: {
    smallPic () {
      return smartImagePath(this.pic)
    }
  }
}
</script>

<style lang="less" scoped>
  .love-box-card{
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    margin-bottom: 24px;;
    .pic-wrapper{
      position: relative;
      width: 100%;
      height: 165px;
      text-align: center;
      background-color: @color-CBG;
      .pic{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        margin: auto;
        max-width: 100%;
        max-height: 100%;
      }
      .tag{
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 2;
        width: 18px;
        height: 30px;
      }
    }
    .name {
      margin: 12px 0 6px;
      color: @color-font-C1;
      font-size: @font-S2;
      font-weight: 700;
    }
    .provider{
      display: flex;
      align-items: top;
      color: @color-font-C2;
      font-size: @font-S4;
      .icon{
        margin-top: 2px;
      }
      .txt{
        margin-left: @pm-md;
      }
    }
  }
</style>
