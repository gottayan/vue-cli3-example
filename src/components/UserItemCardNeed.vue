<template>
  <div class="item-card" v-if="cardInfo">
    <div class="item-card-top">
      <div
        class="pic"
        :style="{backgroundImage: `url(${smartImagePath(cardInfo.image_path) || (poolType === 'need' ? defaultNeed : defaultGift)})`}"
      >
        <img v-if="!!cardInfo.is_new" class="tag" width="18" height="30" :src="cardInfo.left ? picLabelNew : picLabelSend" alt="picLabelNew">
        <div v-if="poolType === 'need'" class="progress">
          <span :style="{width: progress}" class="progress-front"></span>
          <span class="progress-back"></span>
        </div>
      </div>
      <div class="info">
        <div class="title">{{cardInfo.title}}</div>
        <div class="info-wrapper">
          <span class="pullOff">
            <i class="title">下架：</i>
            <i class="content">{{cardInfo.show_at | pullOffDate}}，剩{{cardInfo.show_at | distanceDays}}天</i>
          </span>
          <span class="donate">
            <i class="title">募集進度：</i>
            <i class="content">{{`${total - left}/${total}`}}</i>
          </span>
        </div>
      </div>
      <span class="status">{{cardInfo.status | thingStatus}}</span>
      <x-button @click.native.stop="toNeed(itemId)" class="btn" mini type="primary">詳情</x-button>
    </div>
    <div v-if="cardInfo.need_donates.length" class="item-card-bottom">
      <div class="conds">
        <i class="title">募集概況：</i>
        <span class="content">
          <i
            :key="index"
            @click="toChatroom(needDonate.id, needDonate.user_id)"
            class="donate-item" :style="{backgroundImage: `url(${needDonate.image_path || defaultGift})`}"
            v-for="(needDonate, index) in cardInfo.need_donates"
          >
          </i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import addDays from 'date-fns/add_days'
import format from 'date-fns/format'
// import { format, add_days as addDays } from 'date-fns'
import { XButton } from 'vux'
import defaultGift from '@/assets/icon/img-default-gift.png'
import defaultNeed from '@/assets/icon/img-default-need.png'
import picLabelNew from '@/assets/icon/gift/home_pic_label_new@2x.png'
import picLabelSend from '@/assets/icon/gift/home_pic_label_send@2x.png'
import {smartImagePath} from '@/tools/ObjectHelper'
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    poolType: {
      type: String
    },
    cardInfo: {
      type: Object
    },
    itemId: {
      type: Number
    }
  },
  components: {
    XButton
  },
  data () {
    return {
      defaultGift,
      defaultNeed,
      picLabelNew,
      picLabelSend,
      smartImagePath
    }
  },
  methods: {
    ...mapActions({
      getChatId: 'getChatId'
    }),
    toChatroom (thingId, directUserId) {
      const type = `${this.poolType === 'need' ? 'need_donate' : 'gift_request'}`
      this.getChatId({ type, thingId, directUserId, cb: this.getChatIdCb })
      this.$vux.loading.show({
        text: '跳轉至互動卡中...'
      })
    },
    getChatIdCb (data) {
      this.$vux.loading.hide()
      this.$router.push(`/chatroom/${data.id}`)
    },
    // 需求
    toNeed (id) {
      this.$router.push(`/need/${id}`)
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    // 需求總數
    total () {
      const numTotal = this.cardInfo.need_items.map(item => item.quantity)
      return numTotal.reduce((prev, cur) => cur + prev)
    },
    left () {
      const numTotal = this.cardInfo.need_items.map(item => item.left)
      return numTotal.reduce((prev, cur) => cur + prev)
    },
    progress () {
      return `${parseFloat((this.total - this.left) / this.total).toFixed(2) * 100}%`
    }
  },
  filters: {
    pullOffDate (date) {
      return format(addDays(new Date(date.replace(/-/g, '/')), 15), 'YYYY-MM-DD')
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../global.mixin.less';
  .item-card{
    padding: @pm-bg 0;
    margin: 0 @pm-bg;
    width: 100%;
    &-top{
      position: relative;
      display: flex;
      justify-content: left;
      > .status{
        position: absolute;
        top: 0;
        right: 0;
        color:@color-font-C2;
        font-size: @font-S4;
      }
    }
    &-bottom{
      .conds{
        display: flex;
        flex-wrap: wrap;
        justify-content: left;
        padding-top: @pm-bg;
        > .title{
          margin-right: @pm-lg;
          font-style: normal;
          font-size: @font-S4;
        }
        .content{
          flex: 1;
          display: inline-flex;
          overflow-x: scroll;
          .donate-item{
            margin-right: @pm-bg;
            flex:0 0 30px;
            height: 30px;
            border: 1px solid @color-CL;
            overflow: hidden;
            background-size:30px auto;
            background-repeat:no-repeat;
            background-position: center center;

          }
        }
      }
    }
    .g-border-1px;
    .pic{
      position: relative;
      flex: 0 0 70px;
      height: 70px;
      background-size:70px auto;
      background-repeat:no-repeat;
      background-position: center center;
      background-color: @color-CBG;
      overflow: hidden;
      .tag{
        position: absolute;
        top: 0;
        left: 6px;
        width: 18px;
        height: 30px;
      }
      .progress{
        position: absolute;
        width: 100%;
        height: 4px;
        bottom: 0;
        z-index: 9;
        &-front,
        &-back{
          height: 4px;
          content: '';
          position: absolute;
        }
        &-front{
          z-index: 502;
          background-color: @color-CO;
          background-image: linear-gradient(to right, @color-CO, @color-CR);
          border-radius: 0 2px 2px 0;
        }
        &-back{
          z-index: 501;
          width: 100%;
          background-color: rgba(000, 000, 000, .3);
        }
      }
    }
    .info{
      flex: 1;
      margin: 0 0 0 @pm-bg;
      padding-right: 75px;
      > .title{
        font-size: @font-S2;
      }
      &-wrapper{
        margin-top: @pm-md;
        color: @color-font-C2;
        font-size: @font-S4;
        line-height: 1;
        i{
          font-style: normal;
        }
        .pullOff, .donate{
          display: flex;
          flex-wrap: wrap;
          justify-content: left;
          padding: 3px 0;
        }
      }
    }
    .btn{
      position: absolute;
      bottom: 0;
      right: 0;
      padding:0;
      width: 64px;
      height: 30px;
      font-size: @font-S3;
      line-height: 1;
      background: @color-CR;
      &[disabled]{
        background: @color-DSA;
      }
    }
  }
</style>
