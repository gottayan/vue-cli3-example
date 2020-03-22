<template>
  <!-- 加減器 -->
  <div class="counter">
    <button @click="doMinus" :disabled="value === min">-</button>
    <input class="counter-input" type="text" v-model="value">
    <button @click="doPlus">+</button>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: {
    doUpdate: {
      type: Function,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      default: 99
    },
    min: {
      type: Number,
      default: 0
    }
  },
  methods: {
    doMinus () {
      let { value, doUpdate, min } = this.$props
      if (value - 1 < min) {
        this.$vux.toast.text('當前已是最小值', 'bottom')
        doUpdate(min)
      } else {
        doUpdate((value - 1))
      }
    },
    doPlus () {
      let { value, doUpdate, max } = this.$props
      if (value + 1 > max) {
        this.$vux.toast.text('當前已是最大值', 'bottom')
        doUpdate(max)
      } else {
        doUpdate((value + 1))
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import './../global.style.less';
@height-md: 18px;
.counter {
  height: @height-md;
  display: inline-block;
  button {
    color: white;
    height: @height-md;
    line-height: @height-md ;
    width: @height-md;
    border-radius: 50%;
    border: none;
    float: left;
    font-size: @font-S2;
    background-color: @color-CR;
  }
  button:disabled {
    background-color: @color-font-C2;
  }
  input.counter-input {
    border: none;
    width: 32px!important;
    height: @height-md!important;
    line-height: @height-md!important;
    float: left;
    text-align: center;
    color: @color-font-C1;
    background-color: transparent;
  }
}
</style>
