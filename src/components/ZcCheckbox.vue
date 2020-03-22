<template>
  <div class="zc-checkbox">
    <input
      type="checkbox"
      :checked="checked"
      :id="id"
      :disabled="disabled"
      @change="$emit('change', $event.target.checked)"
    />
    <label :for="id">{{label}}</label>
  </div>
</template>

<script>
import checkedIcon from '../assets/img/gift_screen_ic_checkbox_selected@2x.png'
import uncheckedIcon from '../assets/img/gift_screen_ic_checkbox_normal@2x.png'
export default {
  data () {
    return {
      checkedIcon,
      uncheckedIcon
    }
  },
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: {
      type: Boolean
    },
    id: {
      type: String
    },
    label: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="less" scoped>
  .zc-checkbox{
    display: flex;
    align-items: center;
    input[type="checkbox"] {
      margin-right: @pm-sm;
      appearance: none;
      width: 16px;
      height: 16px;
      background-image: url('../assets/img/gift_screen_ic_checkbox_normal@2x.png');
      background-size: contain;
      vertical-align: middle;
      outline: transparent;
      border: none;
      & + label {
        color: @color-font-C2;
        font-size: @font-S3;
        vertical-align: middle;
      }

      &:checked{
        border: none;
        background-color: transparent;
        background-image: url('../assets/img/gift_screen_ic_checkbox_selected@2x.png');
      }
      &:checked + label {
        color: @color-font-CR;
      }
      &:disabled{
        background-color: #FFF !important;
      }
    }
  }
</style>
