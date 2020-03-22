<template>
  <div class="trace-base-item-container">
    <router-link class="pic-wrapper" :to="`/${type}/${data.id}`">
      <img class="pic" :src="smartImagePath(data.pics) || (type === 'gift' ? defaultGift : defaultNeed)" alt="">
    </router-link>
    <div class="trace-base-item-info">
      <span class="title">{{data.title}}</span>
      <span>數量：x{{data.count}}</span>
      <span>下架：{{data.pulloff && data.pulloff.split(' ')[0] || '-'}}</span>
      <span>提供者：{{data.name}}</span>
    </div>
    <div class="trace-base-item-action">
      <span class="btn-status">{{data.status | thingStatus}}</span>
      <button class="btn-cancel" @click="handleCancelTrace(type, data.id)">取消追蹤</button>
    </div>
  </div>
</template>

<script>
import defaultGift from '@/assets/icon/img-default-gift.png'
import defaultNeed from '@/assets/icon/img-default-need.png'
import {smartImagePath} from '@/tools/ObjectHelper'

export default {
  data () {
    return {
      defaultGift,
      defaultNeed,
      smartImagePath
    }
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    type: {
      type: String, // gift, need
      required: true
    },
    handleCancelTrace: {
      type: Function,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
  .trace-base-item-container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 15px;
    padding: 15px 0;
    &:not(:last-child){
      border-bottom: 1px solid #eee;
    }
    .pic-wrapper{
      position: relative;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
      width: 90px;
      height: 90px;
      background-color: @color-CBG;
      overflow: hidden;
      .pic{
        position: absolute;
        top: 50%;
        width: 100%;
        transform: translateY(-50%);
      }
    }
  }

  .trace-base-item-info{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    flex: 1;
    width: 40%;
    margin: 0 15px;

    .title{
      display: block;
      color: @color-font-C1;
      margin: 0 0 5px;
      font-size: @font-S2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }
    >span{
      color: @color-font-C2;
      font-size: @font-S3;
    }
  }

  .trace-base-item-action{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;

    .btn-cancel{
      width: 76px;
      height: 32px;
      color: @color-CR;
      border: 1px solid currentColor;
      background-color: transparent;
      font-size: 14px;
      border-radius: 5px;
      vertical-align: middle;
    }

    .btn-status{
      font-size: @font-S3;
      color: @color-font-C2;
    }
  }
</style>
