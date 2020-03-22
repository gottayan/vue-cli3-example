<template>
  <div class="pad-steps">
    <template v-if="!isCancel && !notObtained" :class="index <= currentStep ? 'item-step passed' : 'item-step'">
      <div v-for="(step, index) in steps"
          v-bind:key="index">
        <i class="img-status"></i>
        {{ step.text }}
      </div>
    </template>
    <div v-if="isCancel" class="cancel">本交易已取消</div>
    <div v-if="notObtained" class="cancel">
      {{iAmOwner ? (substate === 'gift_pull_off' ? '本交易已下架' : '索取者未獲贈') : '本交易未獲贈'}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    steps: {
      type: Array,
      required: true
    },
    currentStep: {
      type: Number,
      default: 0
    },
    isCancel: {
      type: Boolean,
      default: false
    },
    notObtained: {
      type: Boolean,
      default: false
    },
    substate: {
      type: String,
      default: ''
    },
    iAmOwner: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      info: ''
    }
  }
}
</script>

<style lang="less">
  @import "./../theme";
  .cancel{
    width: 100%;
    height: 72px;
    text-align: center;
    line-height: 72px;
    color: @color-font-C3;
  }
  .pad-steps {
    display: flex;
    width: 100%;
    height: 72px;
    background-color: white;
    .item-step {
      padding: @pm-bg 0 0;
      display: inline-block;
      flex: 1;
      position: relative;
      height: 100%;
      text-align: center;
      color: @color-font-C2;
      font-size: @font-S4;
      overflow: hidden;
      &.passed {
        color: @color-CR;
        &:before,
        &:after {
          background-color: @color-CR;
        }
        .img-status {
          background-image: url("./../assets/icon/message/icon-step-done.png");
        }
      }
      &:before,
      &:after {
        content: '';
        height: 2px;
        width: 50%;
        display: block;
        position: absolute;
        top: 25px;
        background-color: #d8d8d8;
      }
      &:before {
        left: -15px;
      }
      &:after {
        right: -15px;
      }
      &:first-child {
        &:before {
          display: none;
        }
      }
      &:last-child {
        &:after {
          display: none;
        }
      }
    }
    .img-status {
      background-size: 100% 100%;
      height: 20px;
      width: 20px;
      display: block;
      margin: 0 auto @pm-sm;
      background-image: url("./../assets/icon/message/icon-step-wait.png");
    }
  }
</style>
