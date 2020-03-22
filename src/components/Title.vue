<template>
  <div :style="containerStyle" class="title-component-container">
    <span :style="titleStyle" class="g-title">{{title}}</span>
    <router-link v-if="link" :target="target" :style="linkStyle" class="more" :to="link">{{moreText}}　></router-link>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      type: String
    },
    link: {
      type: String
    },
    moreText: {
      type: String,
      default: '查看更多'
    },
    target: {
      type: String,
      default: '_self'
    },
    containerStyle: {
      type: String,
      default: ''
    },
    titleStyle: {
      type: String,
      default: ''
    },
    linkStyle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less">
  .title-component-container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .more{
      color: @color-font-C2;
      font-size: @font-S3;
    }
  }
</style>
