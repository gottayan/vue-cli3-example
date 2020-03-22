<template>
  <div :class="['filter-option', selected ? 'selected' : '']">
    <div class="wrapper">
      <img v-if="option.icon" :src="option.icon" width="20" height="20" class="icon" alt="icon">
      <span class="label">{{option.value || option.label}}</span>
    </div>
    <span class="circle selected"></span>
  </div>
</template>

<script>
import iconNoGift from '@/assets/icon/com_pic_empty_gift@2x.png'
import iconNoNeed from '@/assets/icon/com_pic_empty_demand@2x.png'

export default {
  props: {
    option: {
      type: Object
    },
    selected: {
      type: Boolean
    }
  },
  data () {
    return {
      iconNoGift,
      iconNoNeed
    }
  }
}
</script>

<style lang="less" scoped>
  .filter-option{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 38px;
    color: @color-font-C2;
    .wrapper{
      display: inline-flex;
      align-items: center;
      .icon{
        margin-right: @pm-bg;
      }
    }
    .circle{
      width: 16px;
      height: 16px;
      background-image: url('../assets/img/gift_screen_ic_checkbox_normal@2x.png');
      background-size: contain;

    }
    &.selected{
      color: @color-CR;
      .circle{
        &.selected{
          background-image: url('../assets/img/gift_screen_ic_checkbox_selected@2x.png');
        }
      }
    }
  }
</style>
