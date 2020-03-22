<template>
  <div class="palmbox-item-container">
    <div class="item-row">
      <span>櫃機場所：</span><span>{{info.THROWBUILDINGNAME}}</span>
    </div>
    <div class="item-row">
      <span>營業時間：</span><span>{{info.WORKTIME}}</span>
    </div>
    <div class="item-row">
      <span>櫃機地址：</span><span>{{info.TW_THROWADDRESS}}</span>
    </div>
    <div class="item-row">
      <span>櫃機狀態：</span><span :class="computedStatus">{{info.STATUSDESC}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  computed: {
    computedStatus () {
      if (this.info.STATUS) {
        return {
          0: 'danger',
          1: 'normal',
          2: 'warning',
          3: 'danger'
        }[this.info.STATUS]
      }
      return 'normal'
    }
  }
}
</script>

<style lang="less" scoped>
  .palmbox-item-container{
    border-bottom: 1px solid #eee;
    margin: 10px 0;
  }
  .item-row{
    margin: 15px 0;
    font-size: 14px;
    color: #666;
    .normal{
      color: #1c9957;
    }
    .danger{
      color: @color-CR;
    }
    .warning{
      color: @color-CO;
    }
  }
</style>
