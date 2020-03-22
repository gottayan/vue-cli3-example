<template>
  <div class="deal-detail pad-chatroom-main">
    <x-header :title="mergeMap === 'isNotMerge' ? headerMap[mergeMap][iAmOwnerMap] : headerMap[mergeMap]">
    </x-header>
    <div>
      <div class="title" :style="`background-image: url(${bgPic});`">
        <div class="air">
          <img :src="detailIcons(detail)[status]" alt="">
        </div>
        <div class="word-wrap">
          <div :key="index"
            :class="`word${index}`"
            class="word"
            v-for="(item, index) in detailMap(detail)[iAmOwnerMap][status]">
            {{item}}
          </div>
        </div>
      </div>
      <div class="card1">
        <PalmBoxInfo v-if="shipway === Shipways.SHIPWAY_PALMBOX"
        :deals="detail"
        :iAmOwner="iAmOwner"
        />
        <FamiInfo v-if="shipway === Shipways.SHIPWAY_FAMI"
        :deals="detail"
        :iAmOwner="iAmOwner"
        />
        <MeetInfo v-if="shipway === Shipways.SHIPWAY_MEET"
        :deals="detail"
        :iAmOwner="iAmOwner"
        />
        <HCTInfo v-if="shipway === Shipways.SHIPWAY_HCT"
        :deals="detail"
        :iAmOwner="iAmOwner"
        />
        <OthersInfo v-if="shipway === Shipways.SHIPWAY_OTHERS"
        :deals="detail"
        :iAmOwner="iAmOwner"
        />
        <HomengInfo v-if="shipway === Shipways.SHIPWAY_HOMENG"
        :deals="detail"
        :iAmOwner="iAmOwner"
        />
      </div>
      <div class="card2">
        <div class="user">
          <div class="ava" @click="toUser">
            <img :src="pointer(detail).direct_user.pics()" alt="">
            <p>{{pointer(detail).direct_user.nickname()}}</p>
          </div>
          <div class="msg">
            <div class="img" @click="toChatRoom">
              <img :src="msgPic" alt="">
              <span class="grid-num">
                {{pointer(detail).messages.length()}}
              </span>
            </div>
          </div>
        </div>
        <div v-if="children && children.length">
          <div class="item"
          v-for="(item, index) in children"
          :key="index"
          >
            <img @click="toItem(item.gift_id)" :src="item.gift.image_path || defaultGift" alt="">
            <p @click="toItem(item.gift_id)">{{item.gift.title}}</p>
            <div class="btn-wrap">
              <x-button
                :disabled="item.status === 'thanks'"
                @click.native.stop="handleThanks(item.id)"
                class="btn"
                mini
                type="primary"
              >
                {{item.status === 'thanks' ? '已感謝' : '去感謝'}}
              </x-button>
              <span>x{{item.quantity}}</span>
            </div>
          </div>
        </div>
        <div v-else class="item" @click="toItem(pointer(detail).gift_request.gift_id())">
          <img :src="pointer(detail).gift_request.gift.image_path() || defaultGift" alt="">
          <p>{{pointer(detail).gift_request.gift.title()}}</p>
          <span>x{{pointer(detail).gift_request.quantity() || pointer(detail).gift_request.request_quantity()}}</span>
        </div>
        <div class="gray-line" v-if="iAmOwner"></div>
        <div class="good" v-if="iAmOwner">
          <div class="good-icon">
            <img :src="lovePic" alt=""/>
            <span>好人點</span>
          </div>
          <div class="good-word">
            <div v-if="children && children.length">
              增加 <span>{{children.reduce((acc, cur) => acc + cur.quantity, 0)}}點</span>
            </div>
            <div v-else>
              增加 <span>{{pointer(detail).gift_request.quantity() || pointer(detail).gift_request.request_quantity()}}點</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card3" v-if="gifts">
        <div class="row">禮物編號：{{gifts.gift_id}}</div>
        <div class="row" v-if="gifts.created_at">{{pointer(gifts).children.length() ? '合併時間' : '索取時間'}}：{{gifts.created_at}}</div>
        <div v-if="isOpen">
          <div class="row" v-if="gifts.remitted_at">送出時間：{{gifts.remitted_at}}</div>
          <div class="row" v-if="gifts.remitting_at">{{ gifts.shipopts === 'pod' ? '送出時間' : '匯款時間'}}：{{gifts.remitting_at}}</div>
          <div class="row" v-if="gifts.received_money_at">收款時間：{{gifts.received_money_at}}</div>
          <div class="row" v-if="gifts.sent_at">寄出時間：{{gifts.sent_at}}</div>
          <div class="row" v-if="gifts.finished_at">收下時間：{{gifts.finished_at}}</div>
          <div class="row" v-if="gifts.thanks_at">寫下感謝時間：{{gifts.thanks_at}}</div>
          <div class="row" v-if="gifts.pass_at">已略過時間：{{gifts.pass_at}}</div>
          <div class="row" v-if="gifts.cancel_at">取消贈送時間：{{gifts.cancel_at}}</div>
        </div>
        <div v-if="isRequested(status)" class="toggle" :class="isOpen ? 'close' : 'open'" @click="handleToggle">
          <img :src="openPic" alt="">
        </div>
        <div class="contact">
          <a @click="toFeedback">聯繫官方客服</a>
        </div>
      </div>
      <div class="card4" v-if="filteUserGifts && filteUserGifts.length && !iAmOwner">
        <div class="line-word">
          <div class="line"></div>
          <div class="word">
            <p>看看TA的其他禮物</p>
            <p>可能跟你特別投緣哦～</p>
          </div>
        </div>
        <div class="items">
          <div class="item"
          :class="index % 2 ? 'right' : (filteUserGifts.length !== 1 && 'left')"
          @click="toItem(item.id)"
          :key="index"
          v-for="(item, index) in filteUserGifts"
          >
            <div class="pic">
              <img :src="item.image_path || defaultGift" alt="">
            </div>
            <div class="word">
              <p>{{item.title}}</p>
              <p>剩餘{{item.left}}個</p>
            </div>
          </div>
        </div>
      </div>
      <div class="btns">
        <MergeStep v-if="status === ShipStatus.SHIP_STATUS_MERGE_REQUESTING && detail.iAmOwner"
          :gift="gifts"
          :getDetail="getDetail"
          >
          </MergeStep>
          <RequestingStep v-if="
          (status === ShipStatus.SHIP_STATUS_REQUESTING) ||
          (status === ShipStatus.SHIP_STATUS_MERGE_REQUESTING && !detail.iAmOwner)
          "
                    :iAmOwner="detail.iAmOwner"
                    :doSend="doSendItem"
                    :doIgnore="doIgnore"
                    :toggleModal="toggleModal">
          </RequestingStep>
          <InitStep v-if="status === ShipStatus.SHIP_STATUS_INIT"
                    :iAmOwner="detail.iAmOwner"
                    :doIgnore="doIgnore"
                    :doTake="doSendItem"
                    :toggleModal="toggleModal">
          </InitStep>
          <PassStep v-if="status === ShipStatus.SHIP_STATUS_PASS"
                    :iAmOwner="detail.iAmOwner"
                    :wantType="detail.wantType"
                    :doCancel="doCancel"
                    :doAction="doSendItem"
                    :toggleModal="toggleModal">
          </PassStep>
          <RemittingStep v-if="status === ShipStatus.SHIP_STATUS_REMITTING"
                          :iAmOwner="detail.iAmOwner"
                          :doCancel="doCancel"
                          :doTransfer="doTransfer"
                          :toggleModal="toggleModal">
          </RemittingStep>
          <RemittedStep v-if="status === ShipStatus.SHIP_STATUS_REMITTED"
                        :iAmOwner="detail.iAmOwner"
                        :doCancel="doCancel"
                        :shipway="shipway"
                        :doSend="doConfirmShip"
                        :doReceiveMoney="doReceiveMoney"
                        :toggleModal="toggleModal">
          </RemittedStep>
          <ReceivedMoneyStep v-if="status === ShipStatus.SHIP_STATUS_RECEIVED_MONEY"
                              :iAmOwner="detail.iAmOwner"
                              :shipway="shipway"
                              :shipsn="detail.item.shipsn
                              || (deal.gift_request && (deal.gift_request.gift_ec_order) && deal.gift_request.gift_ec_order.check_code)
                              || (deal.need_donate && (deal.need_donate.need_ec_order) && deal.need_donate.need_ec_order.check_code)
                              || ''"
                              :optIsReceiver="detail.item.shipopts"
                              :doCancel="doCancel"
                              :doSent="doSent"
                              :toggleModal="toggleModal">
          </ReceivedMoneyStep>
          <SentStep v-if="status === ShipStatus.SHIP_STATUS_SENT"
                    :iAmOwner="detail.iAmOwner"
                    :identity="user.catHash"
                    :doReceived="doReceived"
                    :toggleModal="toggleModal">
          </SentStep>
          <CanceledStep v-if="(status === ShipStatus.SHIP_STATUS_MERGE_REJECTED) ||
                              status === ShipStatus.SHIP_STATUS_CANCEL ||
                              status === ShipStatus.SHIP_STATUS_NOT_OBTAINED"
                        :canceled="status === ShipStatus.SHIP_STATUS_CANCEL"
                        :notObtained="status === ShipStatus.SHIP_STATUS_NOT_OBTAINED"
                        :toggleModal="toggleModal">
          </CanceledStep>
          <FinishedStep v-if="status === ShipStatus.SHIP_STATUS_FINISHED"
                        :iAmOwner="detail.iAmOwner"
                        :doThanks="doThanks"
                        :mergeChildren="detail.item && detail.item.children"
                        :toggleModal="toggleModal">
          </FinishedStep>
          <ThankedStep v-if="status === ShipStatus.SHIP_STATUS_THANKS"
                        :iAmOwner="detail.iAmOwner"
                        :identity="user.catHash"
                        :toggleModal="toggleModal">
          </ThankedStep>
      </div>
      <TransferModal
        :showTransferModal="showTransferModal"
        :toggleTransferModal="toggleTransferModal"
        :transferInfo="transferInfo"
        :banklist="banklist"
        :chooseBank="chooseBank"
        :showPicker="showPicker"
        :doConfirmTransfer="doConfirmTransfer"/>
    </div>
  </div>
</template>

<script>
import { detailMap, headerMap, detailIcons, isRequested } from './constants'
import msgPic from '@/assets/icon/merge/order_list_ic_chat_normal@2x.png'
import msgRightPic from '@/assets/icon/icon-msg-right.png'
import { mapState, mapActions } from 'vuex'
import PalmBoxInfo from './PalmBoxInfo'
import FamiInfo from './FamiInfo'
import MeetInfo from './MeetInfo'
import HCTInfo from './HCTInfo'
import OthersInfo from './OthersInfo'
import HomengInfo from './HomengInfo'
import { Shipways } from '@/tools/constant'
import defaultGift from '@/assets/icon/img-default-gift.png'
import defaultAvatar from '@/assets/icon/icon-default-avatar.png'
import bgPic from '@/assets/icon/merge/order_top_bg@2x.png'
import chatroomMixin from '@/container/message/chatroomMixin'
import pointer from '@/tools/pointer'
import RequestingStep from '@/container/detail/tradeStepButtons/RequestingStep'
import CanceledStep from '@/container/detail/tradeStepButtons/CanceledStep'
import FinishedStep from '@/container/detail/tradeStepButtons/FinishedStep'
import InitStep from '@/container/detail/tradeStepButtons/InitStep'
import PassStep from '@/container/detail/tradeStepButtons/PassStep'
import ReceivedMoneyStep from '@/container/detail/tradeStepButtons/ReceivedMoneyStep'
import RemittedStep from '@/container/detail/tradeStepButtons/RemittedStep'
import RemittingStep from '@/container/detail/tradeStepButtons/RemittingStep'
import SentStep from '@/container/detail/tradeStepButtons/SentStep'
import ThankedStep from '@/container/detail/tradeStepButtons/ThankedStep'
import lovePic from '@/assets/icon/merge/order_list_ic_love@2x.png'
import TransferModal from '@/container/message/TransferModal'
import openPic from '@/assets/icon/icon-merge-open.png'
import { XButton } from 'vux'

export default {
  mixins: [chatroomMixin],
  components: {
    PalmBoxInfo,
    FamiInfo,
    MeetInfo,
    HCTInfo,
    OthersInfo,
    HomengInfo,
    RequestingStep,
    CanceledStep,
    FinishedStep,
    InitStep,
    PassStep,
    ReceivedMoneyStep,
    RemittedStep,
    RemittingStep,
    SentStep,
    ThankedStep,
    TransferModal,
    XButton
  },
  data () {
    return {
      detailMap,
      msgPic,
      msgRightPic,
      Shipways,
      defaultGift,
      headerMap,
      defaultAvatar,
      bgPic,
      pointer,
      isDetail: true,
      lovePic,
      detailIcons,
      openPic,
      isOpen: false,
      isRequested
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      userGifts: state => state.user.otherUserInfo.myOthGifts.data
    }),
    type () {
      return this.$route.params.type
    },
    filteUserGifts () {
      return this.userGifts
        .filter(item => item.id !== Number.parseInt(this.detail.gift_id)).slice(0, 2)
        .filter(item => item.left)
        .filter(item => item.status !== 'cancel')
    },
    iAmOwner () {
      return pointer(this.detail).iAmOwner()
    },
    iAmOwnerMap () {
      return this.iAmOwner ? 'iAmOwner' : 'iAmNotOwner'
    },
    mergeMap () {
      if (this.detail.gift_request) {
        return ''
      }
      return this.status.indexOf('merge') > -1 ? 'isMerge' : 'isNotMerge'
    },
    shipway () {
      return pointer(this.detail).gift_request.shipway()
    },
    status () {
      const gifts = pointer(this.detail).gift_request()
      if (pointer(gifts).children.length()) {
        if (gifts.children.some(v => v.status === 'thanks')) {
          return 'thanks'
        }
      }
      return gifts && gifts.status
    },
    children () {
      return pointer(this.detail).gift_request.children()
    },
    gifts () {
      return pointer(this.detail).gift_request()
    }
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo',
      getUserOtherGifts: 'getUserOtherGifts',
      getConversationId: 'getConversationId'
    }),
    handleThanks (id) {
      return this.$router.push(`/thanksItem/${id}`)
    },
    handleToggle () {
      this.isOpen = !this.isOpen
    },
    toFeedback () {
      this.$router.push('/feedback')
    },
    toUser () {
      const id = this.deals.direct_user.id
      this.$router.push(`/user/${id}`)
    },
    toItem (id) {
      this.$router.push(`/gift/${id}`)
    },
    toChatRoom () {
      // 2017-07-01前的互动卡不做保留，点击即跳转至礼物或者需求详情
      const isOverdue = new Date(this.detail.created_at.replace(/-/g, '/')).getTime() -
        new Date('2017/07/01 00:00:00').getTime()
      if (isOverdue < 0) {
        return this.$vux.toast.text('2017年6月之前的來互動不做保留', 'bottom')
      }
      this.$router.push(`/chatroom/${this.$route.params.id}?from=userInfo&type=${'gift_request'}`)
    }
  }
}
</script>

<style lang="less">

.deal-detail {
  background-color: #F6F6F6;
  color: #28292B;
  min-height: 100vh;
  .btns {
    padding: 15px 0;
    .functions {
      display: flex;
      justify-content: center;
      .item {
        width: 50%;
        border-radius: 0;
      }
    }
  }
  .detail-shipway-view {
    color: #E2462C;
    background-color: #FBE9E5;
    padding: 3px 6px;
    border-radius: 3px;
  }
  .card-title {
    font-weight: bold;
    font-size: 16px;
    color: #28292B;
    margin: 5px 0;
  }
  .right-msg-pic {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    margin-right: 5px;
    position: relative;
    .red-dot {
      right: -5px;
      top: 5px;
    }
    > img {
      width: 20px;
      height: 20px;
    }
  }
  .grid-num {
      position: absolute;
      top: 5px;
      right: 7px;
      width: 18px;
      height: 18px;
      line-height: 18px;
      color: #FFF;
      font-size: 10px;
      text-align: center;
      border-radius: 50%;
      border: 1px solid #FFF;
      background: #e25443;
  }
  .red-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    position: absolute;
    background-color: red;
    text-align: center;
    font-size: 14px;
    > p {
      color: #FFFFFF;
      margin-bottom: 1px;
      top: -2px;
      left: 4px;
      position: absolute;
    }
  }
  .title {
    height: 90px;
    background-color: #FFA508;
    background-size: 100% 100%;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    .air {
      width: 40px;
      height: 40px;
      margin-right: 25px;
      > img {
        width: 100%;
        height: 100%;
      }
    }
    .word-wrap {
      .word {
        font-size: 18px;
        color: #FFFFFF;
        line-height: 28px;
      }
      .word0 {
        font-weight: 600;
      }
      .word1 {
        font-size: 13px;
      }
    }
  }
  .gray-line {
    height: 1px;
    background-color: #EEE;
    margin: 0 15px;
  }
  .toggle {
    text-align: center;
    height: 20px;
    > img {
      height: 20px;
    }
  }
  .open {
    transform: rotate(0);
  }
  .close {
    transform: rotate(180deg);
  }
  .card1 {
    .detail-card {
      display: flex;
      // align-items: center;
      // border-bottom: 1px solid rgba(242, 242, 242, 1);
      padding: 5px 0;
      background-color: #FFFFFF;
      .icon {
        width: 20%;
        text-align: center;
        > img {
          width: 45px;
          height: 45px;
        }
      }
      .content {
        width: 80%;
        font-size: 14px;
        .row {
          line-height: 28px;
          margin-right: 5px;
          > div {
            display: inline-block;
          }
        }
      }
    }
  }
  .card2 {
    background-color: #FFFFFF;
    margin: 10px 0;
    .btn-wrap {
      display: flex;
      align-items: center;
      width: 30%;
      > span {
        color: #C9C9C9;
        font-size: 14px;
        margin-right: 15px;
        display: flex;
        align-items: center;
      }
    }
    .btn{
      margin: 0;
      padding:0;
      width: 150px;
      height: 26px;
      font-size: @font-S3;
      line-height: 1;
      background: @color-CR;
      margin-right: 20px;
      &[disabled]{
        background: @color-DSA;
      }
    }
    .good {
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
      align-items: center;
      .good-icon {
        color: #E2462C;
        background: #FBE9E5;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px 6px;
        border-radius: 3px;
        > img {
          width: 14px;
          height: 14px;
          margin-right: 3px;
        }
      }
      .good-word {
        color: #969697;
        font-size: 14px;
        > div {
          > span {
            color: #E2462C;
          }
        }
      }
    }
    .user {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .ava {
      display: flex;
      align-items: center;
      margin: 10px 15px;
      > p {
        font-size: 12px;
        color: #AEAEAE;
        margin-left: 10px;
      }
      > img {
        border-radius: 50%;
        width: 30px;
        height: 30px;
      }
    }
    .msg {
      display: flex;
      align-items: center;
      .img {
        position: relative;
        > img {
          width: 50px;
          height: 50px;
        }
        .red-dot {
          right: -5px;
          top: 0px;
        }
      }
      > p {
        margin-left: 5px;
        font-size: 12px;
        color: #AEAEAE;
      }
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0 15px 0;
      > img {
        min-width: 60px;
        height: 60px;
        margin: 0 15px;
      }
      > p {
        font-size: 14px;
        color: #333333;
        margin: 0 10px;
        width: 100%;
      }
    }
  }
  .card3 {
    position: relative;
    background-color: #FFFFFF;
    padding: 10px;
    .row {
      font-size: 14px;
      line-height: 28px;
    }
    .contact {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 14px;
      color: #E2462C;
    }
  }
  .card4 {
    margin-top: 10px;
    background-color: #FFFFFF;
    padding-bottom: 20px;
    .line-word {
      height: 70px;
      position: relative;
      padding-top: 10px;
      .line {
        position: absolute;
        background: #E4E4E4;
        height: 1px;
        width: 90%;
        transform: translateX(-50%);
        left: 50%;
        top: 20px;
      }
      .word {
        font-size: 14px;
        position: absolute;
        transform: translateX(-50%);
        left: 50%;
        text-align: center;
        line-height: 16px;
        background: #FFFFFF;
        padding: 0 10px;
      }
    }
    .items {
      display: flex;
      justify-content: center;
      align-items: center;
      .left {
        margin-right: 40px;
      }
      .item {
        .pic {
          > img {
            width: 100px;
            height: 100px;
          }
        }
        .word {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
