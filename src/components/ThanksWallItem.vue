<template>
  <div class="thanks-wall-item">
    <span class="to-user"><i>To:</i> {{info.to_user.nickname || '無暱稱'}}</span>
    <span class="content">{{info.content}}</span>
    <div class="thing-item" @click="toDetail">
      <img class="pic" :src="pic" />
      <span class="name">{{title}}</span>
    </div>
    <span class="from-user ta-right"><i>FROM:</i> {{info.from_user.nickname || '無暱稱'}}</span>
    <span class="date ta-right">{{info.created_at | smartDate}}</span>
    <i class="heart-icon"></i>
  </div>
</template>

<script>
import defaultGift from '@/assets/icon/img-default-gift.png'
import defaultNeed from '@/assets/icon/img-default-need.png'
import { smartImagePath } from '@/tools/ObjectHelper'

export default {
  props: {
    info: {
      type: Object
    }
  },
  methods: {
    toDetail () {
      const id = this.info.gift_id ||
                this.info.need_id ||
                this.info.wish_id ||
                this.info.love_provision_id
      const types = {
        'gift': 'gift',
        'need': 'need',
        'wish': 'wish',
        'love': 'lovebox'
      }
      this.$router.push(`/${types[this.info.type]}/${id}`)
    }
  },
  computed: {
    isGift () {
      return this.info.type === 'gift'
    },
    title () {
      if (this.info.type === 'love') {
        return this.info.love_provision && this.info.love_provision.goods_name
      } else {
        return this.info[this.info.type] && this.info[this.info.type].title
      }
    },
    pic () {
      switch (this.info.type) {
        case 'gift':
        {
          const { image, gift } = this.info
          return smartImagePath(image || (gift && gift.image_path)) || defaultGift
        }
        case 'need':
        {
          const { image, need } = this.info
          return smartImagePath(image || (need && need.image_path)) || defaultNeed
        }
        case 'wish':
        {
          const { image, wish } = this.info
          return smartImagePath(image || (wish && wish.image_path)) || defaultGift
        }
        case 'love':
        {
          const { image, love_provision: loveProvision } = this.info
          return smartImagePath(image || (loveProvision && loveProvision.goods_picture)) || defaultGift
        }
        default:
          return defaultGift
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @light-black: rgba(40, 41, 43, .7);
  .text-overflow{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .thanks-wall-item{
    display: flex;
    flex-direction: column;
    padding: @pm-md;
    width: 100%;
    border-radius: 5px;
    overflow: hidden;
    > span{
      // flex: 0 0 100%;
      &.ta-right{
        text-align: right;
      }
      &.content{
        word-break: break-all;
      }
    }

    i{
      font-family: Times;
    }

    .to-user{
      position: relative;
      padding-bottom: 10px;
      border-bottom: 1px dashed #E5E5E5;
      font-weight: bold;
      white-space: nowrap;
      .text-overflow;
      &::after{
        content: ' ';
        width: 0;
        height: 0;
        border-radius: 50%;
        border: 3px solid #f3e5e3;
        position: absolute;
        top: 8px;
        right: 0;
      }

      i{
        font-weight: normal;
      }
    }
    .content{
      padding-top: 10px;
      color: @light-black;
    }

    .thing-item {
      display: flex;
      flex-direction: row;
      height: 50px;
      background-color: lighten(@color-CO, 45%);
      border-radius: 5px;
      overflow: hidden;
      margin: 10px 0;
      align-items: center;

      .pic {
        width: 50px;
        height: auto;
      }
      .name {
        font-size: 13px;
        color: @color-CO;
        padding: 0 10px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space:normal;
        word-break:break-all;
      }
    }
    .from-user{
      font-size: @font-S3;
      font-weight: bold;
      i{
        font-size: @font-S4;
        font-weight: normal;
      }
    }

    .date{
      color: @light-black;
      font-size: @font-S4;
    }

    .heart-icon{
      background-image: url('../assets/icon/thanks/thanks_pic_heart@2x.png');
      background-size: contain;
      background-repeat: no-repeat;
      width: 30px;
      height: 30px;
      margin-top: -30px;
    }
  }
</style>
