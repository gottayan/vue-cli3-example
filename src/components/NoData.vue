<template>
  <div class="no-data">
    <!--<icon class="icon" name="crab">-->
    <!--</icon>-->
    <img :src="sad" width="12" height="12" alt="sad">
    <span class="desc">目前沒有資料</span>
  </div>
</template>

<script>
import sad from '@/assets/icon/itemDetail/Sad.png'
export default {
  data () {
    return {
      sad
    }
  }
}
</script>

<style lang="less" scoped>
  .no-data{
    display: flex;
    align-items: center;
    margin: @pm-md 0;
    .icon{
      width: 18px;
      height: 18px;
    }
    .desc{
      margin-left: @pm-sm;
      color: @color-font-C2;
      font-size: @font-S3;
    }
  }
</style>
