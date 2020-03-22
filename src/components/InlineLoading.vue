<template>
  <div class="inline-loading">
      <inline-loading>
      </inline-loading>
      <span class="txt">加載中...</span>
  </div>
</template>

<script>
import {InlineLoading} from 'vux'

export default {
  components: {
    InlineLoading
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
  .inline-loading{
    display: flex;
    justify-content: center;
    padding: @pm-bg 0;
    width: 100%;
    .txt{
      margin-left: @pm-md;
      color: @color-font-C1;
      font-size: @font-S3;
    }
  }
</style>
