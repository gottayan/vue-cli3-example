<template>
  <div
    class="req-item-card"
    v-if="cardInfo"
  >
    <div
      class="req-item-card-top"
    >
      <merge-checkbox
        :mergeSelete="mergeSelete"
        :currentCheckbox="currentCheckbox"
        :currentValue="currentValue"
        :handleCheck="handleCheck"
        :index="index"
        :itemId="itemId"
        :cardInfo="cardInfo"
      />
      <div v-if="poolType !== 'gift'"
          @click.stop="toItem"
          class="pic"
          :style="{backgroundImage: `url(${smartImagePath(cardInfo[poolType] && cardInfo[poolType].image_path) || defaultGift})`}"
      ></div>
      <div v-else style="width:90px;height:90px;">
        <div
          v-if="!cardInfo.children.length"
          @click.stop="toItem"
          class="pic"
          :style="{backgroundImage: `url(${smartImagePath(cardInfo[poolType] && cardInfo[poolType].image_path) || defaultGift})`}"
        >
        </div>
        <MergeImage v-else
          :mergeChild="cardInfo.children"
          :poolType="poolType"
        />
      </div>
      <div @click.stop="toChatroom">
        <div class="info">
          <div class="title" v-if="poolType !== 'gift'">
            <p>{{cardInfo[poolType] && cardInfo[poolType].title}}</p>
          </div>
          <div v-else class="title">
            <p v-if="!mergeLen">{{cardInfo[poolType] && cardInfo[poolType].title}}</p>
            <p v-else style="
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              width: 40vw;
            ">
              合併禮物（
              {{ cardInfo.children[0][poolType].title }}、
              {{ cardInfo.children[1][poolType].title }}
              {{ cardInfo.children[2] ? '等' : '' }}
              ）
            </p>
          </div>
          <div class="info-wrapper">
            <span
              class="left"
              v-if="!mergeLen"
            >
              <i class="title">索取數量：</i>
              <i class="content">
                {{poolType === 'gift' ?
                cardInfo.request_quantity : cardInfo.quantity}}
              </i>
            </span>
            <span class="left" v-else>
              <i class="title">禮物數量：</i>
              <i class="content">
                {{ mergeLen }}
              </i>
            </span>
            <div
              class="origin-detail"
            >
              <i class="title">贈送者：</i>
              <span
                class="content"
                @click.stop="toUser(poolType === 'gift' ?
                (cardInfo.gift && cardInfo.gift.user && cardInfo.gift.user.id) : cardInfo.user_id)"
                :style="{backgroundImage: `url(${smartImagePath(poolType === 'gift' ?
                (cardInfo.gift && cardInfo.gift.user && cardInfo.gift.user.pics) : (cardInfo.user && cardInfo.user.pics)) || UserDefault})`}">
              </span>
              <span class="name">
                {{poolType === 'gift' ?
                (cardInfo.gift && cardInfo.gift.user && cardInfo.gift.user.nickname) :
                (cardInfo.user && cardInfo.user.nickname)}}</span>
            </div>
          </div>
        </div>
        <span
          v-if="poolType === 'gift'"
          class="status">
          {{cardInfo.status | shipStatus}}
        </span>
        <span
          v-else
          class="status">
          {{cardInfo.status | needDonateDealStatus}}
        </span>
        <span class="time">
          {{cardInfo.created_at.split(' ')[0]}}
        </span>
        <div class="btns" v-show="!mergeSelete">
          <x-button
            v-for="(item, index) in status"
            :key="index"
            @click.native.stop="item.func"
            class="btn"
            mini
            type="primary"
          >
            {{item.txt}}
          </x-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux'
import defaultGift from '@/assets/icon/img-default-gift.png'
import defaultNeed from '@/assets/icon/img-default-need.png'
import UserDefault from '@/assets/icon/icon-default-avatar.png'
import {smartImagePath} from '@/tools/ObjectHelper'
import { mapActions } from 'vuex'
import {ShipStatus} from '@/tools/constant'
import NeedAPI from '@/store/apis/need'
import GiftAPI from '@/store/apis/gift'
import { queryString } from '@/tools/axios'
import MergeCheckbox from '@/components/merge/Checkbox'
import MergeImage from '@/components/merge/Image'

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
    dealType: {
      type: String,
      default: 'request'
    },
    currentValue: {
      type: Array,
      default: () => []
    },
    mergeSelete: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    },
    currentCheckbox: {
      type: Array,
      default: () => []
    }
  },
  components: {
    XButton,
    MergeCheckbox,
    MergeImage
  },
  data () {
    return {
      UserDefault,
      defaultGift,
      defaultNeed,
      smartImagePath,
      ShipStatus
    }
  },
  methods: {
    ...mapActions({
      getConversationId: 'getConversationId',
      getMyDemands: 'getMyDemands'
    }),
    toItem () {
      const id = this.cardInfo[`${this.poolType}_id`]
      this.$router.push(`/${this.poolType}/${id}`)
    },
    toChatroom () {
      // 2017-07-01前的互动卡不做保留，点击即跳转至礼物或者需求详情
      const isOverdue = new Date(this.cardInfo.created_at.replace(/-/g, '/')).getTime() -
        new Date('2017/07/01 00:00:00').getTime()
      if (isOverdue < 0) {
        return this.toItem()
      }
      const type = this.poolType === 'gift' ? 'gift_request' : 'need_donate'
      const tab = 'receive'
      const {id} = this.cardInfo
      const dirUserId = this.poolType === 'gift'
        ? this.cardInfo.gift.user_id : this.cardInfo.user_id
      this.getConversationId({
        id,
        tab,
        type,
        dirUserId,
        cb: this.getConversationIdCb
      })
      this.$vux.loading.show({
        text: '跳轉至互動卡中...'
      })
    },
    getConversationIdCb (data) {
      /* eslint-disable */
      this.$vux.loading.hide()
      // this.poolType !== 'gift'?
      this.$router.push(`/chatroom/${data.data[0].id}?from=userInfo&type=${this.poolType}`)
      // :this.$router.push(`/dealsDetail/${data.data[0].id}`)
    },
    // 確認收到
    doReceived () {
      const id = this.cardInfo.id
      this.$vux.loading.show({
        text: '確認中...'
      })
      if (this.poolType === 'gift') {
        GiftAPI.finishGift(id, (data) => {
          this.getMyDemands({
            page: 1,
            status: 'sent',
            cb: () => {
              this.$vux.loading.hide()
            }
          })
        })
      } else {
        NeedAPI.finishNeed(id, (data) => {
          this.getMyDemands({
            page: 1,
            status: 'sent',
            type: 'present',
            cb: () => {
              this.$vux.loading.hide()
            }
          })
        })
      }
    },
    // 感謝
    doThanks () {
      const id = this.cardInfo.id
      if (this.cardInfo.children && this.cardInfo.children.length) {
        return this.toChatroom()
      }
      if (this.poolType === 'gift') {
        return this.$router.push(`/thanksItem/${id}`)
      }
      return this.$router.push(`/thanksItem/${id}?type=need`)
    },
    // 收下他
    doTake () {
      const { id, need_item: needItem, need, quantity, shipway, shipfee, shipopts } = this.cardInfo
      const params = {
        id,
        quantity,
        shipway,
        shipfee,
        shipopts,
        pic: need.image_path,
        name: needItem.name,
        from: 'userInfo'
      }
      const str = queryString(params)
      this.$router.push(`/need/take${str}`)
    },
    toUser (id) {
      this.$router.push(`/user/${id}`)
    },
    handleCheck (index) {
      this.$emit('handleCheck', index)
    }
  },
  computed: {
    status () {
      let status = ''
      const isOverdue = new Date(this.cardInfo.created_at.replace(/-/g, '/')).getTime() -
        new Date('2017/07/01 00:00:00').getTime()
      switch (this.cardInfo.status) {
        case ShipStatus.SHIP_STATUS_REQUESTING:
          // 等待中
          status = [{
            txt: '查看詳情',
            func: this.toChatroom
          }]
          break
        case ShipStatus.SHIP_STATUS_INIT:
          status = [{
            txt: isOverdue < 0 ? '查看詳情' : '收下禮物',
            func: isOverdue < 0 ? this.toItem : this.doTake
          }]
          break
        case ShipStatus.SHIP_STATUS_REMITTING:
          status = [{
            txt: '查看詳情',
            func: isOverdue < 0 ? this.toItem : this.toChatroom
          }]
          break
        case ShipStatus.SHIP_STATUS_REMITTED:
        case ShipStatus.SHIP_STATUS_RECEIVED_MONEY:
          // 等待中
          status = [{
            txt: '查看詳情',
            func: this.toChatroom
          }]
          break
        case ShipStatus.SHIP_STATUS_SENT:
          // 確認收到
          status = [{
            txt: '查看詳情',
            func: this.toChatroom
          }]
          break
        case ShipStatus.SHIP_STATUS_FINISHED:
          status = [{
            txt: isOverdue < 0 ? '查看詳情' : '感謝',
            func: isOverdue < 0 ? this.toItem : this.doThanks
          }]
          break
        default:
          status = [{
            txt: '查看詳情',
            func: this.toChatroom
          }]
      }
      return status
    },
    mergeLen () {
      if (this.poolType === 'gift') {
        return this.cardInfo.children.length
      }
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../../global.mixin.less';
  .req-item-card{
    padding: @pm-bg 0;
    width: 100%;
    &-top{
      position: relative;
      display: flex;
      justify-content: left;
       .status{
        position: absolute;
        top: 0;
        right: 0;
        color:@color-font-C2;
        font-size: @font-S4;
      }
       .time{
        position: absolute;
        top: 27px;
        right: 0;
        color:@color-font-C2;
        font-size: @font-S4;
      }
      .btns{
        position: absolute;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        .btn{
          margin: 0;
          padding:0;
          width: 64px;
          height: 30px;
          font-size: @font-S3;
          line-height: 1;
          background: @color-CR;
          &[disabled]{
            background: @color-DSA;
          }
          &:last-child{
            margin-top: @pm-sm;
          }
        }
      }
    }
    .g-border-1px;
    .pic{
      position: relative;
      flex: 0 0 90px;
      height: 90px;
      background-size:90px auto;
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
    }
    .info{
      flex: 0 0 calc(~"100% - 174px");
      margin: 0 0 0 @pm-bg;
      > .title{
        font-size: @font-S2;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      &-wrapper{
        margin-top: 3px;
        color: @color-font-C2;
        font-size: @font-S4;
        i{
          font-style: normal;
        }
        .left{
          display: flex;
          justify-content: left;
        }
        .origin-detail{
          display: flex;
          align-items: center;
          margin-top: 16px;
          .title{
            flex: 0 0 auto;
          }
          .content{
            flex: 0 0 auto;
            margin: 0 @pm-md;
            width: 24px;
            height: 24px;
            border: 1px solid @color-CL;
            border-radius: 50%;
            overflow: hidden;
            background-size:24px auto;
            background-repeat:no-repeat;
            background-position: center center;
          }
          .name{
            overflow : hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
</style>
