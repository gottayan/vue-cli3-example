<template>
  <div class="g-block null pad-chatroom-main" style="overflow: hidden">
    <x-header
      v-if="isTrade"
      title="互動卡">
    </x-header>
    <div :class="isTrade ? 'content' : 'content for-user-content'">
      <Steps :steps="steps"
             :is-cancel="(detail.item && detail.item.status) === ShipStatus.SHIP_STATUS_CANCEL"
             :not-obtained="(detail.item && detail.item.status) === ShipStatus.SHIP_STATUS_NOT_OBTAINED"
             :substate="detail.item && detail.item.substate"
             v-if="isTrade"
             :iAmOwner="detail.iAmOwner"
             :currentStep="detail.currentStep">
      </Steps>
      <merge-room-card
        v-if="detail.item && detail.item.children && detail.item.children.length"
        :items="detail.item && detail.item.children"
        :detail="detail.item"
      />
      <x-header
        v-if="!isTrade"
        :title="chatTitle">
      </x-header>
      <div :class="isTrade ? 'pad-chatroom' : 'pad-chatroom for-user'">
        <div class="console-chatroom" id="console-chatroom"
        ref="console-chatroom"
        >
          <MergeChatItem
            v-for="(item, index) in mergeMsgList"
            :key="index + 'm'"
            :item="item"
            :userId="user.id"
            :myPic="user.pics"
            :userpIC="detail.user.pics"
            :directUserPic="detail.direct_user.pics"
            :directUserId="detail.direct_user.id"
            :detail="detail"
          />
          <ChatItem v-for="(item, index) in messages"
                    v-bind:key="index"
                    v-on:enlarge="doEnlargeImage"
                    :type="item.type"
                    :from-user-id="item.from_user_id"
                    :isMine="item.isMine"
                    :isPicture="item.isPicture"
                    :time="item.created_at | smartDate"
                    :content="item.content"
                    :avatar="item.avatar">
          </ChatItem>
        </div>
        <div class="pad-functions">
          <div v-if="detail.item">
            <MergeStep v-if="detail.item.status === ShipStatus.SHIP_STATUS_MERGE_REQUESTING && detail.iAmOwner"
            :gift="detail.gift_request"
            :getDetail="getDetail"
            >
            </MergeStep>
            <RequestingStep v-if="
            (detail.item.status === ShipStatus.SHIP_STATUS_REQUESTING) ||
            (detail.item.status === ShipStatus.SHIP_STATUS_MERGE_REQUESTING && !detail.iAmOwner)
            "
                      :iAmOwner="detail.iAmOwner"
                      :doSend="doSendItem"
                      :doIgnore="doIgnore"
                      :toggleModal="toggleModal">
            </RequestingStep>
            <InitStep v-if="detail.item.status === ShipStatus.SHIP_STATUS_INIT"
                      :iAmOwner="detail.iAmOwner"
                      :doIgnore="doIgnore"
                      :doTake="doSendItem"
                      :toggleModal="toggleModal">
            </InitStep>
            <PassStep v-if="detail.item.status === ShipStatus.SHIP_STATUS_PASS"
                      :iAmOwner="detail.iAmOwner"
                      :wantType="detail.wantType"
                      :doCancel="doCancel"
                      :doAction="doSendItem"
                      :toggleModal="toggleModal">
            </PassStep>
            <RemittingStep v-if="detail.item.status === ShipStatus.SHIP_STATUS_REMITTING"
                           :iAmOwner="detail.iAmOwner"
                           :doCancel="doCancel"
                           :doTransfer="doTransfer"
                           :toggleModal="toggleModal">
            </RemittingStep>
            <RemittedStep v-if="detail.item.status === ShipStatus.SHIP_STATUS_REMITTED"
                          :iAmOwner="detail.iAmOwner"
                          :doCancel="doCancel"
                          :shipway="detail.item.shipway"
                          :doSend="doConfirmShip"
                          :doReceiveMoney="doReceiveMoney"
                          :toggleModal="toggleModal">
            </RemittedStep>
            <ReceivedMoneyStep v-if="detail.item.status === ShipStatus.SHIP_STATUS_RECEIVED_MONEY"
                               :iAmOwner="detail.iAmOwner"
                               :shipway="detail.item.shipway"
                               :shipsn="detail.item.shipsn
                               || (deal.gift_request && (deal.gift_request.gift_ec_order) && deal.gift_request.gift_ec_order.check_code)
                               || (deal.need_donate && (deal.need_donate.need_ec_order) && deal.need_donate.need_ec_order.check_code)
                               || ''"
                               :optIsReceiver="detail.item.shipopts"
                               :doCancel="doCancel"
                               :doSent="doSent"
                               :toggleModal="toggleModal">
            </ReceivedMoneyStep>
            <SentStep v-if="detail.item.status === ShipStatus.SHIP_STATUS_SENT"
                      :iAmOwner="detail.iAmOwner"
                      :identity="user.catHash"
                      :doReceived="doReceived"
                      :toggleModal="toggleModal">
            </SentStep>
            <CanceledStep v-if="(detail.item.status === ShipStatus.SHIP_STATUS_MERGE_REJECTED) ||
                                detail.item.status === ShipStatus.SHIP_STATUS_CANCEL ||
                                detail.item.status === ShipStatus.SHIP_STATUS_NOT_OBTAINED"
                          :canceled="detail.item.status === ShipStatus.SHIP_STATUS_CANCEL"
                          :notObtained="detail.item.status === ShipStatus.SHIP_STATUS_NOT_OBTAINED"
                          :toggleModal="toggleModal">
            </CanceledStep>
            <FinishedStep v-if="detail.item.status === ShipStatus.SHIP_STATUS_FINISHED"
                          :iAmOwner="detail.iAmOwner"
                          :doThanks="doThanks"
                          :mergeChildren="detail.item && detail.item.children"
                          :toggleModal="toggleModal">
            </FinishedStep>
            <ThankedStep v-if="detail.item.status === ShipStatus.SHIP_STATUS_THANKS"
                         :iAmOwner="detail.iAmOwner"
                         :identity="user.catHash"
                         :toggleModal="toggleModal">
            </ThankedStep>
          </div>
          <div class="pad-input-detail">
            <input class="input-message"
                   type="text"
                   ref="inputMessage"
                   v-model.trim="content"
                   placeholder="輸入訊息...">
            <input type="file"
                   accept="image/*"
                   class="input-uploader"
                   @change="uploadImage">
            <button class="btn-choose-image"
                    @click="doTriggerUpload"></button>
            <button class="btn-send-message"
                    @click="sendMessage"></button>
          </div>
        </div>
        <image-enlarge
          :image="enlargeImgSrc"
          @toggleShow="toggleShow"
          :is-show="isEnlargeImage"
        >
        </image-enlarge>
      </div>
      <div :class="showModal ? 'g-modal show' : 'g-modal'">
        <IndexInfo
          :deal="deal"
          :toggleModal="toggleModal"
          :iAmOwner="detail.iAmOwner">
        </IndexInfo>
      </div>
      <TransferModal
        :showTransferModal="showTransferModal"
        :toggleTransferModal="toggleTransferModal"
        :transferInfo="transferInfo"
        :banklist="banklist"
        :chooseBank="chooseBank"
        :showPicker="showPicker"
        :doConfirmTransfer="doConfirmTransfer"
      />
    </div>
  </div>
</template>
<script>
import chatroomMixin from './chatroomMixin'
import Steps from '../../components/Steps'
import RequestingStep from '../../components/tradeStepButtons/RequestingStep'
import ChatItem from '../../components/ChatItem'
import CanceledStep from '../../components/tradeStepButtons/CanceledStep'
import FinishedStep from '../../components/tradeStepButtons/FinishedStep'
import InitStep from '../../components/tradeStepButtons/InitStep'
import PassStep from '../../components/tradeStepButtons/PassStep'
import ReceivedMoneyStep from '../../components/tradeStepButtons/ReceivedMoneyStep'
import RemittedStep from '../../components/tradeStepButtons/RemittedStep'
import RemittingStep from '../../components/tradeStepButtons/RemittingStep'
import SentStep from '../../components/tradeStepButtons/SentStep'
import ThankedStep from '../../components/tradeStepButtons/ThankedStep'
import IndexInfo from '../../components/tradeInfos/Index'
import MergeRoomCard from '@/components/merge/RoomCard'
import MergeStep from '../../components/tradeStepButtons/MergeStep'
import MergeChatItem from '../../components/merge/mergeChatItem'
import ImageEnlarge from '@/components/ImageEnlarge'
import TransferModal from './TransferModal'

export default {
  mixins: [chatroomMixin],
  components: {
    Steps,
    RequestingStep,
    ChatItem,
    CanceledStep,
    FinishedStep,
    InitStep,
    PassStep,
    ReceivedMoneyStep,
    RemittedStep,
    RemittingStep,
    SentStep,
    ThankedStep,
    IndexInfo,
    ImageEnlarge,
    MergeRoomCard,
    MergeStep,
    MergeChatItem,
    TransferModal
  }
}
</script>
<style lang="less">
  @import "./../../global.style.less";
  @height-steps: 72px;
  @height-functions: 104px;
  @height-gift: 44px;
  @height-row: 44px;
  .pad-chatroom-main {
    .weui-cell {
      padding: 0!important;
      .weui-cell__ft {
        display: none;
      }
    }
    .bank-picker{
      .weui-cell{
        .weui-cell__ft{
          display: inline-block;
          width: 27px;
          height: 8px;
          &:after{
            width: 13px;
            height: 8px;
            background: #fff url('./../../assets/icon/message/icon-arrow-down.png') right center no-repeat;
            background-size: 13px 8px;
            transform: none;
            border: none;
          }
        }
      }
    }
    .pad-chatroom {
      height: calc(~"100% - @{height-steps}");
      display: block;
      width: 100%;
      &.for-user {
        height: calc(~"100% - @{height-gift}");
        .console-chatroom {
          height: calc(~"100% - 44px");
        }
      }
      .console-chatroom {
        height: calc(~"100% - 104px");
        overflow-y: auto;
        width: 100%;
        display: block;
        overflow-scrolling: touch;
        -webkit-overflow-scrolling: touch;
        background-color: @color-CL;
        padding: 24px @pm-bg @pm-md;
      }
      .pad-functions {
        .functions {
          padding: @pm-md @pm-bg;
          display: flex;
          background-color: white;
          .item {
            flex: 1;
            list-style: none;
            & + .item {
              margin-left: @pm-md;
            }
            button {
              height: 34px;
              font-size: @font-S4;
            }
            .g-button:disabled {
              border: 1px solid #ebebeb;
              color: #aaa;
              background-color: transparent!important;
            }
          }
        }
        .pad-input-detail {
          height: 50px;
          display: block;
          border-top: 1px solid @color-CL;
          padding: @pm-sm 8px @pm-sm @pm-bg;
          background-color: white;
          .input-message {
            float: left;
            width: calc(~"100% - 85px");
            height: 100%;
            font-size: @font-S3;
            color: @color-font-C1;
            outline: none;
            border: none;
            box-shadow: none;
          }
          [class^='btn-'] {
            height: 40px;
            width: 40px;
            border: none;
            background-color: transparent;
            background-size: 100% 100%;
            outline: hidden;
          }
          .btn-choose-image {
            background-image: url("./../../assets/icon/message/icon-choose-image.png");
          }
          .btn-send-message {
            background-image: url("./../../assets/icon/message/icon-send-message.png");
          }
        }
      }
    }
    .x-row {
      position: relative;
      height: @height-row;
      width: 100%;
      display: block;
      border-bottom: 1px solid @color-CL;
      label, input, .degree, .content {
        font-size: @font-S3;
        height: @height-row;
        line-height: @height-row;
      }
      label {
        width: 100px;
        display: inline-block;
      }
      input, .content {
        float: right;
        text-align: right;
        top: -1px;
        position: relative;
        background-color: transparent;
        border: none;
        outline: none;
        width: calc(~"100% - 140px");
      }
      .degree {
        float: right;
        margin-left: @pm-md;
        img {
          opacity: .8;
          width: 15px;
        }
      }
      .vux-cell-value {
        color: @color-font-C1;
      }
    }
    .input-uploader {
      display: none;
    }
  }
  .chatroom-message-confirm{
    .vux-x-dialog{
      .weui-dialog{
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 1000 !important;
        width: 100%;
        max-width: 100%;
        height: 100%;
        transform: none;
        border-radius: 0 !important;
        .weui-dialog__bd{
          height: 100%;
          background: @color-CBG;
          .weui-cells{
            margin-top: 0;
          }
          &:first-child{
            padding: 0;
          }
        }
      }
    }
    .vux-x-textarea{
      .weui-textarea, .weui-textarea-counter{
        font-size: @font-S3;
      }
      .weui-textarea-counter{
        margin-top: 5px;
      }
    }
    &.chatroom-message-input{
      position: relative;
      .weui-cell__ft{
        display: flex;
        align-items: center;
      }
      .weui-cell__hd{
        position: absolute;
        right: @pm-bg;
        top: 0;
      }
      .box{
        .weui-cells{
          &:before, &:after{
            display: none;
          }
          .vux-x-textarea{
            padding: 0;
            .weui-cell__bd{
              padding: @pm-md;
            }
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .pad-chatroom-main{
    height: 100%;
    > .content{
      height: calc(~"100% - 44px");
      &.for-user-content{
        height: 100%;
      }
    }
    .chatroom-message-input{
      &.fade-enter-to, &.fade-leave-to{
        transition: opacity 0.3s;
      }
      &.fade-enter, &.fade-leave-to{
        opacity: 0;
      }
      .mask{
        width: 100%;
        height: 100%;
        background:rgba(0,0,0,0.5);
      }
      .box{
        width: 100%;
        height: calc(~"100% - 44px");
        background: @color-CBG;
        .box-panel{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
          > .pics{
            margin-top: @pm-bg;
            padding: 0 @pm-bg @pm-bg;
          }
          .pad-stick-bottom {
            padding: @pm-bg;
            width: 100%;
            button {
              margin-top: @pm-bg;
            }
          }
        }
      }
    }
  }
</style>
