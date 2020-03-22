<template>
  <div class="request-card-wrap">
    <div class="header" v-if="!noTitle">
      <div class="title">
        <h3 v-html="title">
        </h3>
      </div>
      <!--<div class="icon">-->
        <!--<img :src="icon" alt="">-->
      <!--</div>-->
    </div>
    <div v-else class="ask">
      <div class="btn" @click="toComment()"><p>我要詢問</p></div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
    <div class="icon-bg" :style="{backgroundImage: `url(${icon})`}"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    noTitle: {
      type: Boolean,
      default: false
    },
    toComment: {
      type: Function,
      default: null
    }
  }
}
</script>

<style lang="less" scoped>
@import './style';
.request-card-wrap {
  position: relative;
  .card-style();
  margin-top: 15px;
  padding: 0 15px;
  .ask,
  .header {
    border-bottom: 1px dashed #E5E5E5;
    padding: 17px 0;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon {
      width: 25px;
      height: 25px;
      > img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .ask {
    .btn {
      .btn();
    }
  }
  .icon-bg {
    position: absolute;
    width: 35px;
    height: 35px;
    right: 14px;
    bottom: 14px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    opacity: 0.5;
  }
}
</style>
