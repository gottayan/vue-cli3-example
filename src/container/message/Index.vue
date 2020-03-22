<template>
  <div class="g-block null pad-messages message-index">
    <header class="message-tabs" >
      <button
        :class="tabIndex === 1 ? 'btn-tab selected' : 'btn-tab'"
        @click="doSelectTab(1)">
        <img
          v-if="tabIndex !== 1"
          src="./../../assets/icon/enter/icon-sys-msg.png"
          alt="">
        <img
          v-if="tabIndex === 1"
          src="./../../assets/icon/enter/icon-sys-msg-focus.png"
          alt="">
        系統通知
      </button>
      <button
        :class="tabIndex === 0 ? 'btn-tab selected' : 'btn-tab'"
        @click="doSelectTab(0)">
        <img
          v-if="tabIndex !== 0"
          src="./../../assets/icon/enter/icon-mail.png" alt="">
        <img
          v-if="tabIndex === 0"
          src="./../../assets/icon/enter/icon-mail-focus.png"
          alt="">
        訊息
      </button>
    </header>
    <div class="message-content">
      <div class="g-block pad-sys-message pad-env-message show">
        <template v-if="tabIndex === 1">
          <div
            v-if="sysMessage && sysMessage.items.length === 0 && !sysMessage.nextPageUrl"
            class="g-emptyset">
            <img
              class="icon"
              :src="iconNoMessage" alt="">
            <span class="tip">暫時還沒有系統通知</span>
          </div>
        </template>
        <template v-if="tabIndex === 0">
          <div
            v-if="envMessage && envMessage.items.length === 0 && !envMessage.nextPageUrl"
            class="g-emptyset">
            <img class="icon" :src="iconNoMessage" alt="">
            <span class="tip">暫時還沒有訊息</span>
          </div>
        </template>
        <div
          id="msgContainer"
          class="container-sysMessage mescroll"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="20">
          <template v-if="tabIndex === 1">
            <div
              :class="item.isLeftMsg ? 'card-sys-message special' : 'card-sys-message'"
              :key="index"
              @click="toSysMessageDetail(item)"
              v-for="(item, index) in sysMessage.items">
              <span class="sys-info">
                {{ item.text }}
              </span>
              <span class="sys-date">
                {{ item.created_at | smartDate }}
              </span>
              <i class="red-dot" v-if="!item.is_read"></i>
            </div>
            <inline-loading v-show="sysMessage.page !== 1 && isLoading.sys">
            </inline-loading>
            <divider
              v-show="sysMessage.items.length && !sysMessage.nextPageUrl"
              class="g-divider">
              沒有更多了
            </divider>
          </template>
          <template v-if="tabIndex === 0">
            <template v-if="item.last_message">
              <div
                class="card-message"
                :key="index"
                @click="toEnvMessageDetail(item)"
                v-for="(item, index) in envMessage.items">
                <div class="row-userinfo">
                  <img
                    :src="item.direct_user.pics || defaultAvatar"
                    alt="">
                  <div class="name-and-detail">
                    <span class="name">
                      {{ item.direct_user.nickname || '無暱稱'}}
                    </span>
                    <br>
                    <span class="detail" v-if="item.gift_request_id || item.need_donate_id">
                      <span>{{ item.item_name }}</span> ·
                      {{ item.status | shipStatus }}
                    </span>
                    <span class="content">
                      {{ item.last_message && item.content }}
                    </span>
                  </div>
                  <span class="datetime">
                    {{ item.last_time | smartDate }}
                  </span>
                </div>
                <i class="red-dot" v-if="!item.is_read"></i>
              </div>
            </template>
            <inline-loading v-show="envMessage.page !== 1 && isLoading.env">
            </inline-loading>
            <divider
              v-if="envMessage.items.length && !envMessage.nextPageUrl"
              class="g-divider">
              沒有更多了
            </divider>
          </template>
        </div>
      </div>
      <!--tabIndex === 1 ? (sysMessage.items.length && msgStatus.messages) : (envMessage.items.length && msgStatus.conversations)-->
      <div
        @click="readAll"
        v-if="tabIndex === 1 ? sysMessage.items.length : envMessage.items.length"
        class="message-read">
        <img
          :src="checkboxSelected"
          width="16"
          height="16"
          alt="">
        <span class="txt">全部標示為已讀</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import defaultAvatar from './../../assets/icon/icon-default-avatar.png'
import iconNoMessage from './../../assets/icon/com_pic_empty_news@2x.png'
import { getConversationContent, mapBusinessId } from './../../tools/strMap'
import infiniteScroll from 'vue-infinite-scroll'
import checkboxSelected from '@/assets/img/gift_screen_ic_checkbox_selected@2x.png'
import InlineLoading from '@/components/InlineLoading'
import { Divider } from 'vux'
import anchorMixin from '@/mixins/anchor'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'

export default {
  mixins: [anchorMixin],
  components: {
    InlineLoading,
    Divider
  },
  data () {
    return {
      defaultAvatar,
      iconNoMessage,
      checkboxSelected,
      isReadAll: false,
      isLoading: {
        env: false,
        sys: false
      },
      mescroll: null
    }
  },
  methods: {
    ...mapActions({
      readMsg: 'readMsg',
      readAllMsg: 'readAllMsg',
      getEnvMessageList: 'getEnvMessageList',
      getSysMessageList: 'getSysMessageList'
    }),
    ...mapMutations({
      setMessageAllRead: 'setMessageAllRead',
      setCurrent: 'setCurrent',
      setEnvMessageBusy: 'setEnvMessageBusy',
      setSysMessageBusy: 'setSysMessageBusy',
      updateEnvMessageList: 'updateEnvMessageList',
      updateSysMessageList: 'updateSysMessageList',
      setSysMessagePage: 'setSysMessagePage',
      setEnvMessagePage: 'setEnvMessagePage',
      updateEnvMessageNextPageUrl: 'updateEnvMessageNextPageUrl',
      updateSysMessageNextPageUrl: 'updateSysMessageNextPageUrl'
    }),
    readAll () {
      if (!this.isReadAll) {
        this.isReadAll = true
        const type = this.tabIndex === 1 ? 'messages' : 'conversations'
        this.readAllMsg({
          type,
          cb: (data) => {
            this.isReadAll = false
            if (data.error) {
              return this.$vux.toast.text('操作失敗，請稍後重試', 'bottom')
            }
            this.setMessageAllRead({type})
          }
        })
      }
    },
    toEnvMessageDetail (item) {
      const {
        last_message: lastMessage,
        gift_request_id: giftRequestId,
        need_donate_id: needDonateId,
        direct_user: directUser
      } = item
      if (!item.is_read) {
        this.readMsg({
          type: 'envMessage',
          msgId: item.id,
          cb: (data) => console.log(data)
        })
      }
      if (lastMessage) {
        const { conversation_id: conversationId } = lastMessage
        const _url = (giftRequestId || needDonateId)
          ? `/chatroom/${conversationId}`
          : `/chatroom/${directUser.id}?type=user&directUserName=${directUser.nickname || '無暱稱'}`
        if (conversationId) {
          this.$router.push(_url)
        }
      }
    },
    toSysMessageDetail (item) {
      if (!item.is_read) {
        this.readMsg({
          type: 'sysMessage',
          msgId: item.id,
          cb: (data) => console.log(data)
        })
      }
      const result = mapBusinessId(item)
      if (result.tips) {
        this.$vux.toast.text(result.tips)
      } else if (result.modal === 'openChatRoomModal') {
        this.$router.push(`/chatroom/${item.conversation_id}`)
      } else if (result.path) {
        this.$router.push(result.path)
      }
    },
    doSelectTab (tabIndex) {
      if (this.tabIndex !== tabIndex) {
        this.setCurrent(tabIndex)
        const div = document.getElementById('msgContainer')
        div.scrollTo(0, 0)
        if (this.envMessage.items.length === 0 || this.sysMessage.items.length === 0) {
          this.loadMore()
        }
      }
    },
    loadMore () {
      const { tabIndex } = this
      if ((tabIndex === 0 && this.envMessage.busy) ||
          (tabIndex === 1 && this.sysMessage.busy)) {
        return
      }
      if (tabIndex === 1) {
        this.isLoading.sys = true
      } else if (tabIndex === 0) {
        this.isLoading.env = true
      }
      if (tabIndex === 0) {
        if (this.envMessage.page === 1) {
          this.$Loading.show()
        }
        this.setEnvMessageBusy(true)
        this.getEnvMessageList({
          page: this.envMessage.page,
          cb: this.loadMoreEnvMsgCb
        })
      } else {
        if (this.sysMessage.page === 1) {
          this.$Loading.show()
        }
        this.setSysMessageBusy(true)
        this.getSysMessageList({
          page: this.sysMessage.page,
          cb: this.loadMoreSysMsgCb
        })
      }
    },
    loadMoreEnvMsgCb (obj) {
      if (!obj) {
        console.log('暫無更多信息')
        return
      }
      // this.$vux.loading.hide()
      this.isLoading.env = false
      if (this.envMessage.page === 1) {
        this.$Loading.hide()
      }

      if (obj.error) {
        this.mescroll.endErr()
      } else {
        this.mescroll.endSuccess()
      }

      const {data, next_page_url: nexPageUrl, current_page: currentPage} = obj
      // 封裝消息信息
      const newItems = data.map((v) => {
        if (!v.last_message) {
          return v
        }
        const { last_message: lastMsg } = v
        if (lastMsg.type === 'image') {
          v.content = '傳送了一張圖片'
        } else {
          v.content = getConversationContent(lastMsg.content, v, lastMsg.business_id)
        }
        v.last_time = lastMsg.created_at
        v.item_name = (v.gift_request ? '贈送' : '索取') +
                      ((v.gift_request && v.gift_request.gift && v.gift_request.gift.title) ||
                      (v.need_donate && v.need_donate.need && v.need_donate.need.title))
        v.status = (v.gift_request && v.gift_request.status) || (v.need_donate && v.need_donate.status)
        return v
      })
      this.updateEnvMessageList({
        data: newItems,
        currentPage
      })
      this.updateEnvMessageNextPageUrl(nexPageUrl)
      if (nexPageUrl) {
        const page = currentPage + 1
        this.setEnvMessagePage(page)
        this.setEnvMessageBusy(false)
      }
    },
    loadMoreSysMsgCb (obj) {
      if (!obj) {
        console.log('暫無更多信息')
        return
      }
      // this.$vux.loading.hide()
      this.isLoading.sys = false
      if (this.sysMessage.page === 1) {
        this.$Loading.hide()
      }

      if (obj.error) {
        this.mescroll.endErr()
      } else {
        this.mescroll.endSuccess()
      }

      let {data, next_page_url: nexPageUrl, current_page: currentPage} = obj
      data = data.map((v, i) => {
        const text = getConversationContent(v.content, v.conversation, v.business_id)
        return ({
          ...v,
          text,
          isLeftMsg: !text
        })
      })
      this.updateSysMessageList({
        data,
        currentPage
      })
      this.updateSysMessageNextPageUrl(nexPageUrl)
      if (nexPageUrl) {
        const page = currentPage + 1
        this.setSysMessagePage(page)
        this.setSysMessageBusy(false)
      }
    },
    downRefreshCallback () {
      const { tabIndex } = this
      if (tabIndex === 1) {
        this.isLoading.sys = true
      } else if (tabIndex === 0) {
        this.isLoading.env = true
      }
      if (tabIndex === 0) {
        this.setEnvMessageBusy(true)
        this.getEnvMessageList({
          page: 1,
          cb: this.loadMoreEnvMsgCb
        })
      } else {
        this.setSysMessageBusy(true)
        this.getSysMessageList({
          page: 1,
          cb: this.loadMoreSysMsgCb
        })
      }
    }
  },
  directives: {
    infiniteScroll
  },
  computed: {
    ...mapState({
      tabIndex: state => state.messages.current,
      envMessage: state => state.messages.envMessage,
      sysMessage: state => state.messages.sysMessage,
      msgStatus: state => state.messages.msgStatus
    }),
    busy () {
      return this.tabIndex === 1 ? this.sysMessage.busy : this.envMessage.busy
    }
  },
  mounted () {
    this.initAnchor('msgContainer')
    this.mescroll = new MeScroll('msgContainer', {
      down: {
        callback: this.downRefreshCallback,
        auto: false,
        outOffset: (mescroll) => {
          if (mescroll.downTipDom) {
            mescroll.downTipDom.innerHTML = '下拉放開立即更新'
          }
        },
        showLoading: (mescroll) => {
          if (mescroll.downTipDom) {
            mescroll.downTipDom.innerHTML = '加載中 ...'
          }
          if (mescroll.downProgressDom) {
            mescroll.downProgressDom.classList.add('mescroll-rotate')
          }
        }
      }
    })
  },
  activated () {
    this.initAnchor('msgContainer')
  }
}
</script>
<style lang="less">
.message-index{
  .weui-cells {
    border-bottom: 1px solid @color-CL;
    .weui-cell {
      padding-left: 0;
      padding-right: 0;
      font-size: @font-S2;
    }
    &:before {
      display: none;
    }
    &:after {
      width: 0;
      transition: width .4s;
    }
    &:before, &:after{
      display: none !important;
    }
    &:hover {
      &:after {
        width: 100%;
        background-color: @color-CR;
        margin: 0 auto;
        height: 4px;
        bottom: -1px;
      }
    }
  }

  .vux-tab{
    box-sizing: content-box;
  }
}
</style>
<style lang="less" scoped>
  @import "./../../theme";
  @height-banner: 72px;
  @height-top: 72px;
  @height-avatar: 40px;
  .pad-messages {
    .message-tabs {
      display: flex;
      height: @height-banner;
      background-color: white;
      border-bottom: 1px solid @color-CL;
      button.btn-tab {
        flex: 1;
        height: @height-banner;
        font-size: @font-S3;
        color: @color-font-C2;
        outline: hidden;
        background-color: transparent;
        border: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        &.selected {
          color: @color-CR;
        }
        img {
          height: 24px;
          width: 24px;
          display: block;
          margin: @pm-sm auto;
        }
      }
    }
    .message-content {
      height: calc(~"100% - @{height-top}");
      width: 100%;
      display: block;
      overflow: hidden;
      position: relative;
      .pad-env-message,
      .pad-sys-message {
        position: absolute;
        padding: 0;
        transition: left .4s;
        overflow: auto;
      }
      .pad-env-message {
        position: absolute;
        left: 100%;
        &.show {
          left: 0;
        }
      }
      .pad-sys-message {
        position: absolute;
        left: -100%;
        &.show {
          left: 0;
        }
      }
      .weui-cells {
        margin-top: 0;
      }
      .container-envMessage, .container-sysMessage{
        height: 100%;
        overflow-y: auto;
        background-color: #FFF;
      }
      .message-read{
        position: absolute;
        top: 25px;
        right: 0;
        display: flex;
        align-items: center;
        padding: @pm-md;
        border: 1px solid @color-CL;
        border-radius: 20px 0 0 20px;
        background: #FFF;
        box-shadow: 3px 4px 14px rgba(0, 0, 0, .18);
        .txt{
          margin-left: @pm-md;
          color: @color-font-CR;
          font-size: @font-S3;
        }
      }
    }
    .card-message, .card-sys-message {
      padding: @pm-bg;
      position: relative;
      &.special {
        background-color: #fafafa;
      }
      &:after {
        content: "";
        bottom: 0;
        left: @pm-bg;
        height: 1px;
        position: absolute;
        background-color: @color-CL;
        width: calc(~"100% - 30px");
      }
      &:nth-last-of-type(2) {
        &:after {
          display: none;
        }
      }
      .row-userinfo {
        display: flex;
        align-items: center;
        img {
          height: @height-avatar;
          width: @height-avatar;
          margin-right: @pm-bg;
          border-radius: 50% 50%;
          /*float: left;*/
        }
        .datetime {
          flex: 1;
          text-align: right;
          line-height: @height-avatar;
          height: @height-avatar;
          display: inline-block;
        }
        .name-and-detail {
          display: inline-block;
          overflow-y: hidden;
          width: calc(~"100% - 130px");
          .name {
            color: @color-font-C1;
            font-size: @font-S2;
            float: left;
            display: block;
            line-height: @pm-lg;
          }
          .detail {
            display: block;
            line-height: @pm-bg;
            color: @color-font-C2;
            font-size: @font-S4;
            span {
              display: inline-block;
              max-width: calc(~"100% - 65px");
              float: left;
              .nowrap;
            }
          }
        }

        .datetime {
          float: right;
          color: @color-font-C2;
          font-size: @font-S4;
        }
      }
      .content {
        font-size: @font-S3;
        color: @color-font-C1;
        display: block;
        width: 100%;
        text-align: justify;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-top: @pm-md;
        line-height: @pm-lg;
      }
      .sys-info,
      .sys-date {
        display: block;
        width: calc(~"100% - 15px");
        // .nowrap;
      }
      .sys-info {
        color: @color-font-C1;
        font-size: @font-S2;
      }
      .sys-date {
        color: @color-font-C2;
        font-size: @font-S3;
        margin-top: @pm-sm;
      }
      .red-dot {
        position: absolute;
        right: @pm-bg;
        height: @pm-md;
        width: @pm-md;
        border-radius: 50% 50%;
        background-color: @color-CR;
        .center-vertical;
      }
    }
    .card-message{
      .red-dot{
        top: @pm-bg;
        transform: none;
      }
    }
  }
</style>
