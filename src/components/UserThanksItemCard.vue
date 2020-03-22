<template>
  <div class="user-thanks-item-card" >
   <div class="container" @click="toDetail">
      <div class="user-pic"
        :style="{backgroundImage: `url(${smartImagePath(picPath)})`}">
      </div>
      <div class="user-text">
        <div class="thanks-word">{{cardInfo.content}}</div>
        <div class="user-info">
          <p class="to-user"><i>{{result.desc}}</i> {{result.target}}</p>
          <div class="write-time">{{time}}</div>
        </div>
     </div>
   </div>
  </div>
</template>

<script>
import defaultGift from '@/assets/icon/img-default-gift.png'
import format from 'date-fns/format'
// import { format } from 'date-fns'
import { smartImagePath } from '@/tools/ObjectHelper'

export default {
  data () {
    return {
      picPath: '',
      smartImagePath
    }
  },
  props: {
    cardInfo: {
      type: Object
    },
    type: {
      type: Boolean // 判断 0 收到感谢 1 发出的感谢
    }
  },
  computed: {
    time () {
      return format(this.cardInfo.updated_at, 'YYYY-MM-DD')
    },
    result () {
      return {
        target: this.cardInfo[this.type ? 'to_user' : 'from_user'].nickname || '暫無',
        desc: this.type ? 'To' : 'From'
      }
    }
  },
  methods: {
    toDetail () {
      const id = this.cardInfo.gift_id ||
                this.cardInfo.need_id ||
                this.cardInfo.wish_id ||
                this.cardInfo.love_provision_id
      const types = {
        'gift': 'gift',
        'need': 'need',
        'wish': 'wish',
        'love': 'lovebox'
      }
      this.$router.push(`/${types[this.cardInfo.type]}/${id}`)
    }
  },
  created () {
    switch (this.cardInfo.type) {
      case 'gift':
      {
        const { image, gift } = this.cardInfo
        this.picPath = image || (gift && gift.image_path) || defaultGift
        break
      }
      case 'need':
      {
        const { image, need } = this.cardInfo
        this.picPath = image || (need && need.image_path) || defaultGift
        break
      }
      case 'wish':
      {
        const { image, wish } = this.cardInfo
        this.picPath = image || (wish && wish.image_path) || defaultGift
        break
      }
      case 'love':
      {
        const { image, love_provision: loveProvision } = this.cardInfo
        this.picPath = image || (loveProvision && loveProvision.goods_picture) || defaultGift
        break
      }
      default:
        this.picPath = defaultGift
    }
  }
}
</script>

<style lang="less" scoped>

  .user-thanks-item-card {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding: 15px;
    margin: 0 auto;
    &:before {
      display: block;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #eeeeee;
      content: ' ';
    }
    .container {
      overflow: hidden;
      width: 100%;
      display: flex;
      .user-pic {
        height: 67px;
        width: 67px;
        background-color: #E1E2E4;
        background-position: center;
        background-size: 100%;
        background-repeat: no-repeat;
        vertical-align: bottom;
      }
    }
    .user-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      padding: 5px 10px;
      .to-user {
        font-size: 13px;
        line-height: 13px;
        color: #969797;
      }
      .thanks-word {
        font-size: 14px;
        line-height: 20px;
        padding-top: 5px;
        word-wrap: break-word;
        word-break: normal;
        margin-bottom: 15px;
      }
      .write-time {
        font-size: 13px;
        line-height: 13px;
        color: #969797;
        align-self: flex-end;
      }
    }
    .user-info {
      display: flex;
      justify-content: space-between;
    }
  }
</style>
