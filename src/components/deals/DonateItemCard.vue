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
        :cardInfo="cardInfo"
      />
      <div style="width:90px;height:90px;">
        <div v-if="!cardInfo.is_parent"
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
      <div @click.stop="handleItemCard">
        <div class="info" v-if="poolType !== 'gift'">
          <div class="title">
            {{cardInfo[poolType] && cardInfo[poolType].title}}
          </div>
        </div>
        <div class="info" v-else>
          <div v-if="!cardInfo.children.length" class="title">
            {{cardInfo[poolType] && cardInfo[poolType].title}}
          </div>
          <div v-else style="
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
          </div>
          <div class="info-wrapper">
            <span
              v-if="cardInfo.status === 'requesting'"
              class="left"
            >
              <i class="title">剩餘：</i>
              <i class="content">
                {{cardInfo.gift.left}} / {{cardInfo.gift.quantity}}
              </i>
            </span>
            <span
              v-else-if="cardInfo.is_parent"
              class="left"
            >
              <i class="title">索取数量：</i>
              <i class="content">
                {{cardInfo.children.length}}
              </i>
            </span>
            <span
              v-else
              class="left"
            >
              <i class="title">贈送數量：</i>
              <i class="content">
                {{poolType === 'gift' ? cardInfo.request_quantity : cardInfo.quantity}}
              </i>
            </span>
            <div
              class="origin-detail"
            >
              <i class="title">索取者：</i>
              <span
                v-if="(cardInfo.status !== 'requesting') && !cardInfo.receivers.length"
                @click.stop="toUser(poolType === 'gift' ? cardInfo.user_id : cardInfo.need.user_id)"
                class="content"
                :style="{backgroundImage: `url(${smartImagePath(cardInfo.pics) || UserDefault})`}"
              >
              </span>
              <span class="name">
                {{(cardInfo.status === 'requesting') && cardInfo.receivers.length ?
                `${cardInfo.receivers.length}人` :
                (cardInfo.receiver_nickname)}}
              </span>
            </div>
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
      <span class="time">
        {{cardInfo.created_at.split(' ')[0]}}
      </span>
    </div>
    <div
      v-if="cardInfo.receivers.length && cardInfo.status === 'requesting'"
      class="req-item-card-bottom"
    >
      <div
        :key="index"
        class="request-item"
        @click.stop="toChatroom({itemId: receiver.id, userId: receiver.dirUserId, createdAt: receiver.createdAt})"
        v-for="(receiver, index) in cardInfo.receivers.slice(0, receiversNum)"
      >
        <span class="avatar">
          <img
            class="pic-avatar"
            :src="smartImagePath(receiver.pics) || UserDefault"
            width="20"
            height="auto"
            alt="avatar"
          >
          <img
            v-if="receiver.isBindWhite"
            class="icon"
            :src="comAngle48"
            width="20"
            height="auto"
            alt="angle"
          >
          <img
            v-if="receiver.isBindBlack"
            class="icon demon"
            :src="comDemon48"
            width="20"
            height="auto"
            alt="demon"
          >
          <img
            v-if="verify.mail && verify.cell"
            :src="picVip"
            width="12"
            height="12"
            class="vip"
            alt="icon">
        </span>
        <span class="name">{{receiver.receiver_nickname}}</span>
        <span class="num">
          <i class="dot"></i>
          <i class="txt">索取{{receiver.request_quantity}}個</i>
        </span>
        <span
          @click.stop="toChatroom({itemId: receiver.id, userId: receiver.dirUserId, createdAt: receiver.createdAt})"
          class="btn"
        >
          {{donateStatus(receiver.status, receiver.shipway,  receiver.shipsn)}}
        </span>
      </div>
      <div
        v-if="cardInfo.receivers.length > 3"
        @click="toggleFold"
        class="spread"
      >
        <div class="spread-wrapper">
          <div class="content">
            {{isFold ? `展開全部${cardInfo.receivers.length}位索取者` : '折疊'}}
          </div>
          <img
            :src="isFold ? arrowDown : arrowUp"
            width="13"
            height="8"
            alt="arrow"
          >
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
import { smartImagePath } from '@/tools/ObjectHelper'
import { mapActions, mapState } from 'vuex'
import {ShipStatus} from '@/tools/constant'
import NeedAPI from '@/store/apis/need'
import GiftAPI from '@/store/apis/gift'
import { queryString } from '@/tools/axios'
import arrowUp from '@/assets/icon/message/com_list_ic_packup@2x.png'
import arrowDown from '@/assets/icon/message/com_list_ic_unfold@2x.png'
import comAngle48 from '@/assets/icon/com_pic_angel_48@2x.png'
import comDemon48 from '@/assets/icon/com_pic_demon_48@2x.png'
import picVip from '@/assets/icon/profile/profile_pic_vip@2x.png'
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
      ShipStatus,
      isFold: true,
      arrowDown,
      arrowUp,
      comAngle48,
      comDemon48,
      picVip
    }
  },
  methods: {
    ...mapActions({
      getConversationId: 'getConversationId',
      getMyDemands: 'getMyDemands',
      getMyDonates: 'getMyDonates'
    }),
    handleItemCard () {
      if (this.cardInfo.status === 'requesting') {
        return this.toItem()
      }
      this.toChatroom({})
    },
    toItem () {
      const id = this.cardInfo[`${this.poolType}_id`]
      this.$router.push(`/${this.poolType}/${id}`)
    },
    toChatroom ({itemId = '', userId = '', createdAt = ''}) {
      const dueTime = createdAt || this.cardInfo.created_at
      const isOverdue = new Date(dueTime.replace(/-/g, '/')).getTime() -
        new Date('2017/07/01 00:00:00').getTime()
      if (isOverdue < 0) {
        // 送给他不跳转
        if (createdAt) {
          return this.$vux.toast.text('2017年6月之前的互動卡信息不做保留', 'bottom')
        }
        return this.toItem()
      }
      const type = this.poolType === 'gift' ? 'gift_request' : 'need_donate'
      const tab = 'give'
      const id = itemId || this.cardInfo.id
      const dirUserId = userId || `${this.poolType === 'gift'
        ? this.cardInfo.user_id : this.cardInfo.need.user_id}`
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
      if (!data.data.length) {
        return this.$vux.toast.text('跳轉失敗，請稍後重試', 'bottom')
      }
      // this.poolType !== 'gift'?
      this.$router.push(`/chatroom/${data.data[0].id}?from=userInfo&type=${this.poolType}`)
      // :this.$router.push(`/dealsDetail/${data.data[0].id}`)
    },
    // 取消贈物
    doCancel () {
      const that = this
      const { id } = this.cardInfo
      this.$vux.confirm.show({
        content: '是否確定取消？',
        theme: 'android',
        confirmText: '決定了',
        cancelText: '再想想',
        onConfirm () {
          if (that.poolType === 'need') {
            NeedAPI.cancelNeedDonate(id, (data) => {
              that.getMyDonates({
                status: 'remitting',
                type: 'present'
              })
            })
          } else if (that.poolType === 'gift') {
            GiftAPI.cancelGift(id, (data) => {
              that.getMyDonates({
                status: 'remitting'
              })
            })
          }
        }
      })
    },
    // 送給他
    doSend (rowItem) {
      const { gift } = this.cardInfo
      const {
        id,
        request_quantity: max,
        shipway,
        shipfee,
        shipopts,
        recity,
        redistrict,
        readdress,
        edcode,
        receiver_nickname: receiverName
      } = rowItem
      let params = {
        id,
        max,
        shipway,
        shipfee,
        pic: gift.image_path,
        name: encodeURIComponent(gift.title), // 特殊字符編碼
        directUserName: receiverName,
        shipopts,
        left: gift.left
      }
      params = (shipway === 'palmbox' && (shipopts === 'sender' || shipopts === 'pod')) ? Object.assign({}, params, {
        recity,
        readdress,
        redistrict,
        edcode
      }) : params
      const str = queryString(params)
      this.$router.push(`/gift/send${str}`)
    },
    handleDonateStatus (status, time, rowItem) {
      const isOverdue = new Date(time.replace(/-/g, '/')).getTime() -
        new Date('2017/07/01 00:00:00').getTime()
      switch (status) {
        case ShipStatus.SHIP_STATUS_REQUESTING:
          if (isOverdue < 0) {
            return this.$vux.toast.text('2017年6月之前的互動卡信息不做保留', 'bottom')
          }
          // this.doSend(rowItem)
          this.toChatroom({})
          break
        case ShipStatus.SHIP_STATUS_INIT:
          this.toChatroom({})
          break
        case ShipStatus.SHIP_STATUS_REMITTING:
          this.doCancel({})
          break
        case ShipStatus.SHIP_STATUS_REMITTED:
          this.toChatroom({})
          break
        case ShipStatus.SHIP_STATUS_RECEIVED_MONEY:
          this.toChatroom({})
          break
        case ShipStatus.SHIP_STATUS_SENT:
          this.toChatroom({})
          break
        case ShipStatus.SHIP_STATUS_FINISHED:
          this.toChatroom({})
          break
      }
    },
    donateStatus (value, shipway, shipsn) {
      let status = ''
      switch (value) {
        case ShipStatus.SHIP_STATUS_REQUESTING:
          status = '送給他'
          break
        case ShipStatus.SHIP_STATUS_INIT:
          // 取消贈送
          status = '基本詳情'
          break
        case ShipStatus.SHIP_STATUS_REMITTING:
          status = '取消贈送'
          break
        case ShipStatus.SHIP_STATUS_REMITTED:
          status = '確認收款'
          break
        case ShipStatus.SHIP_STATUS_RECEIVED_MONEY:
          status = '確認寄出'
          if (shipway === 'hct' && !shipsn) {
            status = '已寄出'
          } else if (shipway === 'meet') {
            status = '確認面交'
          }
          break
        case ShipStatus.SHIP_STATUS_SENT:
          // 完成
          status = '基本詳情'
          break
      }
      return status
    },
    toUser (id) {
      this.$router.push(`/user/${id}`)
    },
    toggleFold () {
      this.isFold = !this.isFold
    },
    handleCheck (index) {
      this.$emit('handleCheck', index)
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    status () {
      let status = [{txt: '查看詳情', func: this.toChatroom}]
      if (this.cardInfo.status === ShipStatus.SHIP_STATUS_REQUESTING) {
        status = [{txt: '查看詳情', func: this.toItem}]
      }
      return status
    },
    receiversNum () {
      return this.isFold ? 3 : this.cardInfo.receivers.length
    },
    verify () {
      const {veriMail, veriCell, veriPpl} = this.userInfo
      return {
        mail: typeof veriMail === 'boolean' ? veriMail : (veriMail === 'Y'),
        cell: typeof veriCell === 'boolean' ? veriCell : (veriCell === 'Y'),
        ppl: typeof veriPpl === 'boolean' ? veriPpl : (veriPpl === 'Y')
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
      > .status{
        position: absolute;
        top: 0;
        right: 0;
        color:@color-font-C2;
        font-size: @font-S4;
      }
      > .time{
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
    &-bottom{
      padding: @pm-bg 0;
      margin-top: @pm-bg;
      background: @color-CBG;
      .request-item{
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: @pm-bg;
        padding: 0 86px 0 @pm-md;
        color: @color-font-C1;
        font-size: @font-S3;
        &:last-child{
          margin-bottom: 0;
        }
        .avatar{
          position: relative;
          flex: 0 0 24px;
          height: 24px;
          background: @color-CBG;
          border-radius: 50%;
          > img.pic-avatar{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 3;
            margin: auto;
            max-width: 100%;
            max-height: 100%;
            border-radius: 50%;
          }
          .icon{
            position: absolute;
            top: -1px;
            left: 2px;
            z-index: 2;
            &.demon{
              left: 2px;
              top: -1px;
            }
          }
          .vip{
            position: absolute;
            top: 12px;
            left: 12px;
            z-index: 10;
          }
        }
        .name{
          margin-left: @pm-md;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .num{
          display: flex;
          align-items: center;
          i{
            font-style: normal;
            &.dot{
              margin: 0 8px;
              width: 3px;
              height: 3px;
              border-radius: 50%;
              background: @color-DSA;
            }
          }
        }

        .btn{
          position: absolute;
          top: 0;
          right: @pm-bg;
          width: 56px;
          height: 26px;
          line-height: 26px;
          color: #FFF;
          font-size: 12px;
          text-align: center;
          border-radius: 3px;
          background: @color-CO;
          &.close{
            background: @color-DSA;
          }
        }
      }
      .spread{
        color: @color-font-C2;
        font-size: @font-S4;
        &-wrapper{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: @pm-bg @pm-bg 0;
          border-top: 1px solid @color-CL;
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
