<template>
  <transition name="slide">
    <div class="select-bottom" v-if="mergeSelete">
      <div class="select-bottom-left">
        已選擇{{currentValue.length}}項
      </div>
      <div class="select-bottom-right">
        <x-button
          :disabled="!currentValue.length || currentValue.length === 1"
          @click.native.stop="handleSubmitMerge"
          class="btn"
          mini
          type="primary"
        >
          {{action === 'request' ? '申請合併寄送' : '我要合併寄送'}}
        </x-button>
      </div>
    </div>
  </transition>
</template>

<script>
import { XButton } from 'vux'
export default {
  components: {
    XButton
  },
  props: {
    mergeSelete: {
      type: Boolean,
      default: false
    },
    currentValue: {
      type: Array,
      default: () => []
    },
    handleSubmitMerge: {
      type: Function,
      default: null
    },
    action: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
  .slide-enter-active, .slide-leave-active {
    transition: transform .5s;
  }
  .slide-enter, .slide-leave-to {
    transform: translateY(100%);
  }
  .select-bottom {
    position: fixed;
    height: 50px;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    background-color: #fff;
    z-index: 1000;
    box-shadow: 0 -1px 40px rgba(0, 0, 0, 0.08);
    .select-bottom-left {
      color: #A1A1A1;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 15px;
    }
    .select-bottom-right {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 15px;
      .btn{
        margin: 0;
        padding:0;
        width: 100px;
        height: 26px;
        font-size: @font-S3;
        line-height: 1;
        background: @color-CR;
        &[disabled]{
          background: @color-DSA;
        }
      }
    }
  }
</style>
