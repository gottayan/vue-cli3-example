<template>
  <div class="trace-item-container">
    <div class="trace-item-baseinfo">
      <div class="baseinfo-left">
        <router-link class="avatar-wrapper" :to="`/user/${data.id}`">
          <img class="avatar" :src="smartImagePath(data.pics) || Default" alt="avatar">
        </router-link>
        <span class="name">{{data.name}}</span>
      </div>
      <div class="baseinfo-right">
        <img
          width="24"
          height="24"
          style="vertical-align: middle"
          src="@/assets/icon/itemDetail/gift_tool_ic_comment_normal@2x.png"
          @click="handleChatToUser(data.id, data.name)" />
        <button class="trace-btn-cancel" @click="handleCancelTrace(type, data.id)">取消追蹤</button>
      </div>
    </div>
    <div class="trace-item-other">
      <span class="trace-item-desc">好人點：{{data.bonus}}</span>
      <span class="trace-item-desc">感謝率：{{data.reviewsRate}}%</span>
      <span class="trace-item-desc">公益捐贈：{{data.charitys}}</span>
    </div>
  </div>
</template>

<script>
import Default from '@/assets/icon/icon-default-avatar.png'
import {smartImagePath} from '@/tools/ObjectHelper'

export default {
  data () {
    return {
      Default,
      smartImagePath
    }
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    handleCancelTrace: {
      type: Function,
      required: true
    },
    handleChatToUser: {
      type: Function,
      required: true
    },
    type: {
      type: String,
      default: 'user'
    }
  }
}
</script>

<style lang="less" scoped>
  .trace-item-container{
    display: flex;
    flex-direction: column;
    padding: 15px 0;
    margin: 0 15px;
    &:not(:last-child){
      border-bottom: 1px solid #eee;
    }
  }
  .trace-item-baseinfo{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .avatar-wrapper{
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid @color-CL;
    overflow: hidden;
    .avatar{
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translateY(-50%);
    }
  }
  .name{
    color: #242526;
  }
  .trace-item-desc{
    color: @color-font-C2;
    font-size: 14px;
    &:not(:last-child):after{
      content: '';
      vertical-align: middle;
      margin: -4px 10px 0;
      font-size: 20px;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      display: inline-block;
      background-color: @color-font-C2;
    }
  }
  .trace-btn-cancel{
    width: 76px;
    height: 28px;
    color: @color-CR;
    border: 1px solid currentColor;
    background-color: transparent;
    font-size: 14px;
    border-radius: 5px;
    vertical-align: middle;
    margin: 0 10px;
  }
</style>
