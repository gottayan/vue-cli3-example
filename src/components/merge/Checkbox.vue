<template>
  <div v-if="mergeSelete && currentCheckbox.some(item => item.id === cardInfo.id)" class="weui-cells_checkbox">
    <div class="weui-cell__hd">
      <input type="checkbox"
        class="weui-check"
        :checked="currentValue.some(item => item === cardInfo.id)">
      <i @click="() => handleCheck(cardInfo.id)"
      class="weui-icon-checked vux-checklist-icon-checked"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mergeSelete: {
      type: Boolean,
      default: false
    },
    currentCheckbox: {
      type: Array,
      default: () => []
    },
    currentValue: {
      type: Array,
      default: () => []
    },
    handleCheck: {
      type: Function,
      default: null
    },
    index: {
      type: Number,
      default: 0
    },
    itemId: {
      type: Number
    },
    cardInfo: {
      type: Object
    }
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/weui/widget/weui_cell/weui_cell_global';
@import '~vux/src/styles/weui/widget/weui_cell/weui_check';
@import '~vux/src/styles/weui/icon/weui_icon_font';
.weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before {
  color: @checklist-icon-active-color;
}
.weui-cells_checkbox > label > * {
  pointer-events: none;
}
.vux-checklist-disabled .vux-checklist-icon-checked:before {
  opacity: 0.5;
}
.vux-checklist-label-left {
  flex-direction: row-reverse;
}
.weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before {
    color: #FF9900;
}
.weui-cells_checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
