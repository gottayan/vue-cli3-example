<template>
  <header class="g-header">
    <button
      class="btn-left"
      @click="toBack"
      v-if="leftButton.show">
      <img src="./../assets/icon/message/icon-arrow-left.png" alt="">
    </button>
    <span class="title">{{ title }}</span>
    <button v-if="rightButton.show" class="btn-right">
      <img v-if="rightButton.icon"
           :src="rightButton.icon" alt="">
      <span v-if="rightButton.text">{{ rightButton.text }}</span>
    </button>
  </header>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    leftButton: {
      type: Object,
      default: () => {
        return {
          icon: '',
          text: '',
          show: true,
          click: () => {
            this.$router.go(-1)
          }
        }
      }
    },
    rightButton: {
      type: Object,
      default: () => {
        return {
          icon: '',
          show: false,
          text: ''
        }
      }
    }
  },
  methods: {
    toBack () {
      this.$router.go(-1)
    }
  }
}

</script>
<style lang="less">
  @import "./../global.style.less";
  .g-header {
    height: 50px;
    background-color: #313335;
    display: block;
    width: 100%;
    color: @color-font-C4;
    position: relative;
    .title {
      line-height: 50px;
      display: block;
      width: 80%;
      margin: 0 auto;
      text-align: center;
    }
    button {
      position: absolute;
      top: 0;
      height: 50px;
      width: 40px;
      border: none;
      background-color: transparent;
      button:first-child {
        left: 0;
      }
      img {
        .center-parents;
        height: 20px;
      }
    }
  }
</style>
