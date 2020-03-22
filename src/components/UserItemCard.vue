<template>
  <div
    class="user-item-card"
    @click.stop="toItemDetail"
    v-if="cardInfo">
    <div class="user-item-card-top">
      <div
        class="pic"
        :style="{backgroundImage: `url(${smartImagePath(cardInfo.image_path) || (poolType === 'gift' ? defaultGift : defaultNeed)})`}">
      </div>
      <div class="info">
        <div class="title">
          {{poolType === 'gift' ? cardInfo.title : cardInfo.need_item.name}}
        </div>
        <div class="info-wrapper">
          <span class="left">
            <i class="title">
              {{poolType === 'gift' ? '剩餘：' : '數量：'}}
            </i>
            <i class="content">
              {{poolType === 'gift' ? `${cardInfo.left}/${cardInfo.quantity}` : `${cardInfo.quantity}`}}
            </i>
          </span>
          <span class="pullOff">
            <i class="title">
              {{poolType === 'gift' ? '下架：' : '提供日期：'}}
            </i>
            <i
              v-if="poolType === 'gift'"
              class="content">
              {{cardInfo.show_at | pullOffDate}},剩{{cardInfo.show_at | distanceDays}}天
            </i>
            <i v-else class="content">{{cardInfo.created_at.split(' ')[0]}}</i>
          </span>
          <template v-if="poolType !== 'gift'">
            <div v-if="isSelf" class="origin-detail">
              <i class="title">贈送詳情：</i>
              <span
                class="content"
                @click.stop="toChatroom(cardInfo.id, cardInfo.need.user_id)"
                :style="{backgroundImage: `url(${smartImagePath(cardInfo.need.user.pics) || UserDefault})`}">
              </span>
            </div>
            <div class="origin-need">
              <i class="title">需求來源：</i>
              <span
                @click.stop="toNeed(cardInfo.need.id)"
                class="content"
                :style="{backgroundImage: `url(${smartImagePath(cardInfo.need.image_path) || defaultNeed})`}">
              </span>
            </div>
          </template>
        </div>
      </div>
      <span v-if="poolType === 'gift'" class="status">{{cardInfo.status | thingStatus}}</span>
      <span v-else class="status">{{cardInfo.status | needDonateDealStatus}}</span>
      <x-button
        v-if="poolType === 'gift'"
        @click.native.stop="poolType === 'gift' ? toGift(itemId) : null"
        class="btn"
        mini
        type="primary"
      >
        詳情
      </x-button>
    </div>
    <div v-if="isSelf && poolType === 'gift' && cardInfo.gift_requests.length" class="user-item-card-bottom">
      <div  class="request">
        <i class="title">索取者：</i>
        <div class="content">
          <span
            class="avatar-wrapper"
            :key="index"
            v-for="(giftRequest, index) in cardInfo.gift_requests"
          >
            <i
              :class="(giftRequest.status === ShipStatus.SHIP_STATUS_FINISHED) ||
              (giftRequest.status === ShipStatus.SHIP_STATUS_THANKS) ||
              (giftRequest.status === ShipStatus.SHIP_STATUS_SENT) ||
              (giftRequest.status === ShipStatus.SHIP_STATUS_REMITTING) ||
              (giftRequest.status === ShipStatus.SHIP_STATUS_REMITTED) ||
              (giftRequest.status === ShipStatus.SHIP_STATUS_RECEIVED_MONEY)
              ? 'request-item finish' : 'request-item'"
              @click.stop="toChatroom(giftRequest.id, giftRequest.user.id)"
              :style="{backgroundImage: `url(${smartImagePath(giftRequest.user.pics) || UserDefault})`}"
            >
            </i>
            <img
              v-if="isBindWhite(giftRequest.user.id)"
              class="icon"
              :src="comAngle54"
              width="30"
              height="auto"
              alt="angle"
            >
            <img
              v-if="isBindBlack(giftRequest.user.id)"
              class="icon demon"
              :src="comDemon54"
              width="30"
              height="auto"
              alt="demon"
            >
          </span>
        </div>
        <icon
          v-if="cardInfo.gift_requests.length > 5"
          class="arrow"
          type="download"
        >
        </icon>
      </div>
    </div>
  </div>
</template>

<script>
import addDays from 'date-fns/add_days'
// import { add_days as addDays, format } from 'date-fns'
import format from 'date-fns/format'
import { XButton, Icon } from 'vux'
import defaultGift from '@/assets/icon/img-default-gift.png'
import defaultNeed from '@/assets/icon/img-default-need.png'
import UserDefault from '@/assets/icon/icon-default-avatar.png'
import {smartImagePath} from '@/tools/ObjectHelper'
import comAngle54 from '@/assets/icon/com_pic_angel_54@2x.png'
import comDemon54 from '@/assets/icon/com_pic_demon_54@2x.png'
import { mapState, mapActions } from 'vuex'
import {ShipStatus} from '../tools/constant'

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
    },
    isSelf: {
      type: Boolean,
      default: true
    },
    marks: {
      type: Object,
      default: () => {
        return {
          WHITE: {
            data: []
          },
          BLACK: {
            data: []
          }
        }
      }
    }
  },
  components: {
    XButton,
    Icon
  },
  data () {
    return {
      UserDefault,
      defaultGift,
      defaultNeed,
      smartImagePath,
      comAngle54,
      comDemon54,
      ShipStatus
    }
  },
  methods: {
    ...mapActions({
      getChatId: 'getChatId'
    }),
    // 禮物詳情
    toGift (id) {
      this.$router.push(`/gift/${id}`)
    },
    // 需求詳情
    toNeed (id) {
      this.$router.push(`/need/${id}`)
    },
    toItemDetail () {
      if (this.poolType === 'gift') {
        return this.toGift(this.itemId)
      }
      this.toNeed(this.itemId)
    },
    toChatroom (thingId, directUserId) {
      const type = `${this.poolType === 'gift' ? 'gift_request' : 'need_donate'}`
      this.getChatId({ type, thingId, directUserId, cb: this.getChatIdCb })
      this.$vux.loading.show({
        text: '跳轉至互動卡中...'
      })
    },
    getChatIdCb (data) {
      this.$vux.loading.hide()
      this.$router.push(`/chatroom/${data.id}`)
    },
    isBindWhite (userId) {
      return this.marks['WHITE'].data.some((item) => item.mark_user_id === userId)
    },
    isBindBlack (userId) {
      return this.marks['BLACK'].data.some((item) => item.mark_user_id === userId)
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
  .user-item-card{
    padding: @pm-bg;
    width: 100%;
    &-top{
      position: relative;
      display: flex;
      justify-content: left;
      > .status{
        position: absolute;
        top: 0;
        right: 0;
        color: @color-font-C2;
        font-size: @font-S4;
      }
    }
    &-bottom{
      .request{
        display: flex;
        flex-wrap: wrap;
        justify-content: left;
        padding-top: @pm-bg;
        height: 30px;
        box-sizing: content-box;
        > .title{
          margin-right: 33px;
          font-style: normal;
          font-size: @font-S4;
        }
        .content{
          margin-top: -10px;
          flex: 0 0 auto;
          width: calc(~"100% - 112px");
          height: 50px;
          overflow-x: scroll;
          white-space: nowrap;
          .avatar-wrapper{
            position: relative;
            top: 10px;
            margin-right: @pm-bg;
            flex:0 0 30px;
            height: 30px;
            overflow-x: visible;
            .request-item{
              position: relative;
              z-index: 3;
              display: inline-block;
              width: 30px;
              height: 30px;
              border: 1px solid @color-CL;
              border-radius: 50%;
              overflow: hidden;
              background-size: 30px auto;
              background-repeat: no-repeat;
              background-position: center center;
              background-color: #FFF;
              &.finish{
                border: 1px solid @color-CO;
              }
            }
            .icon{
              position: absolute;
              top: -18px;
              left: 0;
              z-index: 2;
              &.demon{
                left: 0;
                top: -17px;
              }
            }
          }
        }
        .arrow{
          color: @color-CR;
          &:before{
            margin: 4px 0 0 4px;
            transform: rotate(-90deg);
          }
        }
      }
    }
    .g-border-1px;
    .pic{
      position: relative;
      flex: 0 0 70px;
      height: 70px;
      background-size: 70px auto;
      background-repeat: no-repeat;
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
        .left, .pullOff{
          display: flex;
          justify-content: left;
          padding: 3px 0;
        }
        .origin-need, .origin-detail{
          display: flex;
          margin-top: @pm-bg;
          .content{
            width: 30px;
            height: 30px;
            border: 1px solid @color-CL;
            overflow: hidden;
            background-size:30px auto;
            background-repeat:no-repeat;
            background-position: center center;
          }
        }
        .origin-detail{
          position: absolute;
          right: 0;
          bottom: 0;
          .content{
            border-radius: 50%;
          }
        }
      }
    }
    .btn{
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 0;
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
