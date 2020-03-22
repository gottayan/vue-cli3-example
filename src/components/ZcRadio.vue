<template>
  <div>
    <span v-for="(item, index) in radioList"
      class="radioItem"
      :key="index">
      <input
        :name="`${item.id}-${radioListIndex}`"
        type="radio"
        :id="`${item.id}-${radioListIndex}`"
        :disabled="item.disabled"
        :value="item.value"
        :checked="item.value === checked "
        @change="() => update(item.value)"
      />
      <label :for="`${item.id}-${radioListIndex}`">{{item.text}}</label>
    </span>
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
      type: [Boolean, String, Number]
    },
    radioList: {
      type: Array
    },
    radioListIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    update (value) {
      this.$emit('change', value)
    }
  }
}
</script>
<style lang="less" scoped>
  .radioItem{
    &:not(:last-child){
      margin-right: 15px;
    }
  }

  input[type="radio"] {
    appearance: none;
    width: 16px;
    height: 16px;
    background-image: url('../assets/img/gift_screen_ic_checkbox_normal@2x.png');
    background-size: contain;
    vertical-align: middle;
    outline: transparent;
    border: none;
    & + label {
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
  }
</style>
