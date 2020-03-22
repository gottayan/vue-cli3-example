<template>
  <div class="item-need g-smooth">
    <div class="pics">
      <swiper
        loop
        dots-class="item-dots"
        height="290px"
        v-if="itemInfo.need_images && itemInfo.need_images.length">
        <swiper-item
          class="swiper-img"
          v-for="(item, index) in itemInfo.need_images"
          height="500px"
          :key="index">
          <p
            @click="enLargeImage(smartImagePath(item.path, false))"
            class="img-item"
            :style="{backgroundImage: `url(${smartImagePath(item.path, false)})`}">
          </p>
        </swiper-item>
      </swiper>
      <p
        v-else
        class="img-item"
        :style="{backgroundImage: `url(${NeedDefault})`}">
      </p>
      <p class="title">{{ itemInfo.title }}</p>
      <span @click="showShareBar" class="share-btn"></span>
      <span
        @click="$router.go(-1)"
        class="back-icon">
       <icon
         class="g-btn-detail-goback"
         name="goback"
         :scale="3">
      </icon>
    </span>
    </div>
    <div class="container">
      <div class="info">
        <div class="user-info">
          <div class="detail">
            <div
              class="avatar"
              @click="toUser"
              :style="{backgroundImage: `url(${(itemInfo.user && itemInfo.user.pics) || UserDefault})`}">
            </div>
            <div class="wrapper">
              <div class="user-name" @click="toUser">
                {{ itemInfo.user && (itemInfo.user.nickname || '無暱稱') }}
              </div>
              <div class="pull-off-at" v-if="onGoing">
                <!-- filter 只能用在 {{}}模板插值和v-bind表達式，無法用在v-if上 -->
                <!-- 此處將下架時間從filter改為computed -->
                <span v-if="pulloffTime > 0">距離下架，還有<i class="num">{{ pulloffTime }}</i>天
                </span>
                <span v-else>24小時內即將下架</span>
              </div>
              <div class="pull-off-a" v-else>
                已下架
              </div>
            </div>
            <div class="show-date">
              {{ itemInfo.show_at | smartDate }} 刊登
            </div>
          </div>
          <div class="address">
            <div class="wrapper">
              <span class="icon"></span>
              <span class="txt">
                {{ `${itemInfo.city || '-'},` }}{{ itemInfo.district || '-' }}
              </span>
            </div>
            <div
              v-if="!isMySelf && isVerifyCell"
              @click="openImpeach"
              class="impeach-btn">
              檢舉
            </div>
          </div>
        </div>
        <div class="data">
          <div class="amount">
            <span class="icon"></span>
            <span class="txt">
              數量共{{needNum}}個，剩餘<i class="num">{{needLeft}}</i>個
            </span>
          </div>
          <div class="wrapper">
            <div class="desc">
              <div class="title">需求介紹：</div>
              <span v-if="itemInfo.desc" v-html="itemInfo.desc" class="txt"></span>
              <span v-else class="txt g-sys-desc">主人忘了幫它寫介紹...</span>
            </div>
          </div>
        </div>
        <div class="ships">
          <div class="title">
            <span class="icon"></span>
            <span class="txt">寄送方式任選：</span>
          </div>
          <div class="content">
            <div
              class="ship"
              :key="ship.id"
              v-for="ship in itemInfo.need_ships">
              <span class="way">
                {{shipMapping.way[ship.shipway]}}
              </span>
              <template v-if="typeof(ship.shipfee) === 'number'">
                <span class="ship-fee">{{ship.shipfee}}元</span>
                <span class="ship-opt">
                  <i class="dot">·</i>{{shipMapping.opt[ship.shipopts]}}
                </span>
              </template>
            </div>
          </div>
        </div>
        <div class="progress">
          <div class="title">
            <span class="icon"></span>
            <span class="txt">專案募集進度：</span>
          </div>
          <div class="content">
            <div
              class="needItem"
              :key="needItem.id"
              v-for="needItem in itemInfo.need_items">
              <span class="icon"></span>
              <span class="name">{{ needItem.name }}</span>
              <div class="progress-wrapper">
                <div class="progress-bar">
                  <span
                    :style="{width: `${parseFloat((needItem.quantity - needItem.left) / needItem.quantity).toFixed(2) * 100}%`}"
                    class="progress-bar-front">
                  </span>
                  <span class="progress-bar-back"></span>
                </div>
                <div class="num">
                  {{needItem.quantity - needItem.left}}/{{needItem.quantity}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="donate">
          <div class="title">
            <span class="icon"></span>
            <span class="txt">提供者</span>
          </div>
          <div
            v-if="itemInfo.need_donates && itemInfo.need_donates.length"
            class="content">
            <div
              class="donateItem"
              :key="needDonate.id"
              v-for="needDonate in itemInfo.need_donates">
              <span class="dot-wrapper"><i class="dot"></i></span>
              <div class="info">
                <router-link :to="`/user/${needDonate.user_id}`">
                  <span class="user-name">
                    {{ needDonate.user.nickname || '無暱稱' }}
                  </span>
                </router-link>
                <span class="donate-num">
                  提供了{{needDonate.quantity}}個：
                </span>
                <span class="item-name">
                  {{needDonate.need_item.name}}
                </span>
              </div>
              <div class="time">
                {{needDonate.created_at | smartDate}}
                <div v-if="isMySelf || needDonate.user_id === userInfo.id" class="interact" @click.stop="toChatroom(needDonate.id, isMySelf ? needDonate.user_id : itemInfo.user_id)">來互動</div>
              </div>
            </div>
          </div>
          <no-data v-else>
          </no-data>
        </div>
      </div>
    </div>
    <div class="tabs">
      <tab
        :line-width="2"
        custom-bar-width="24px">
        <tab-item
          :key="value.key"
          :selected="key === tabType"
          v-for="(value, key) in tabItems"
          @on-item-click="() => switchTabItem(key, value.index)">
          {{value.label}}
        </tab-item>
      </tab>
      <div class="content">
        <div
          v-show="tabType === key"
          :key="value.key"
          v-for="(value, key) in tabItems"
          :class="value.type">
          <p
            v-show="value.isLoading"
            style="text-align:center;">
            <inline-loading>
            </inline-loading>
            <span style="vertical-align:middle;display:inline-block;font-size:14px;">加載中...</span>
          </p>
          <no-data
            v-if="!value.data.length && !value.isLoading">
          </no-data>
          <comment-item
            v-else
            item-type="need"
            :c-type="value.type"
            @toComment="toComment(`${value.type}`, item.id, key === 'comment' ?
            (item.user.nickname || '無暱稱') : (item.from_user.nickname || '無暱稱'))"
            :key="'parent' + index"
            :info="item"
            v-for="(item, index) in (key === 'comment' ? value.data : thanks)">
            <child-comment
              :c-type="value.type"
              slot="child"
              :info="childItem"
              :parent-id="key === 'comment' ? item.user.id : ''" :parent-name="key === 'comment' ?
              (item.user.nickname || '無暱稱') : (item.from_user.nickname || '無暱稱')"
              :key="index"
              v-for="(childItem, index) in item[`child_${value.type}s`]">
            </child-comment>
          </comment-item>
        </div>
      </div>
    </div>
    <div
      v-if="userInfo.id !== itemInfo.user_id"
      class="tab-bar-box">
      <tabbar slot="bottom">
        <tabbar-item
          @click.native="toComment('comment', null, '')">
          <p slot="label" >
            <img
              width="24"
              height="24"
              :src="iconComment" />
            <span>留言</span>
          </p>
        </tabbar-item>
        <tabbar-item @click.native="toTrace">
          <p slot="label">
            <img width="24" height="24" :src="iconTrace" />
            <span>{{isTracing ? isTrace : itemInfo.is_tracing ? '已追蹤' : '追蹤'}}</span>
          </p>
        </tabbar-item>
        <tabbar-item
          v-if="itemInfo.status !== 'pending' && needLeft && !isOffOrFinish"
          @click.native="toHandle">
          <p slot="label" >
            <img
              width="24"
              height="24"
              :src="iconAskfor" />
            <span>贈送</span>
          </p>
        </tabbar-item>
      </tabbar>
    </div>
    <div v-else class="tab-bar-box">
      <tabbar slot="bottom">
        <tabbar-item
          @click.native="toEdit">
          <p slot="label">
            <img
              width="24"
              height="24"
              :src="iconEdit" />
            <span>編輯需求</span>
          </p>
        </tabbar-item>
        <tabbar-item
          @click.native="toUpdateStatus">
          <p slot="label">
            <img
              width="24"
              height="24"
              :src="iconPutAway" />
            <span>
              {{itemInfo.status === 'ongoing' ? '提前下架' : '重新上架'}}
            </span>
          </p>
        </tabbar-item>
      </tabbar>
    </div>
    <confirm
      class="message-confirm message-input"
      v-model="isComment"
      hide-on-blur
      theme="android">
      <x-header
        title="留言"
        :left-options="{preventGoBack: true}"
        @on-click-back="closeComment">
      </x-header>
      <div class="box">
        <div class="box-panel">
          <group>
            <x-textarea
              ref="commentInput"
              :rows="2"
              :cols="10"
              :autosize="true"
              :max="200"
              v-model.trim="cMsg"
              :placeholder="cPlaceHolder"
              :show-counter="true"
              class="message-textarea">
            </x-textarea>
          </group>
          <div class="pics">
            <img-upload
              type="gift"
              :maxLength="1"
              :imgloaded="imgLoaded"
              :removeImg="removeImg"
              :isLoaded="isImgLoaded"
              :imgList="imgLists"
              @upLoading="upLoadingImg">
            </img-upload>
          </div>
        </div>
        <div class="pad-stick-bottom">
          <button
            class="g-button red"
            @click="sendCMsg">
            確認發送
          </button>
          <button
            class="g-button blank red"
            @click="closeComment">
            稍後再寫
          </button>
        </div>
      </div>
    </confirm>
    <share-bar
      :url="location"
      :title="itemInfo.title"
      :desc="itemInfo.desc"
      :image="itemInfo.image_path"
      :shareSuc="shareSuc"
      @hideShareBar="hideShareBar"
      :is-show="isShowShareBar">
    </share-bar>
    <div v-transfer-dom>
      <confirm
        v-model="show"
        confirmText='確定'
        @on-confirm="onConfirm">
        <p>
          確定將物品狀態切換為
          <span class="status">
            {{ itemInfo.status === 'ongoing' ? '已下架' : '進行中'}}
          </span> 嗎？
        </p>
      </confirm>
    </div>
    <image-enlarge
      :image="image"
      @toggleShow="toggleShow"
      :is-show="isEnlargeImage">
    </image-enlarge>
    <impeach-confirm
      v-if="isToImpeach"
      type="need"
      :id="Number($route.params.id)"
      @closeImpeach="closeImpeach">
    </impeach-confirm>
  </div>
</template>

<script>
import { Tab, TabItem, Group, XTextarea,
  Swiper, SwiperItem, Tabbar, TabbarItem, InlineLoading,
  Confirm, TransferDomDirective as TransferDom } from 'vux'
import UserDefault from '@/assets/icon/icon-default-avatar.png'
import thingsPicM from '@/assets/icon/gift/things-pic-M.jpg'
import GiftDefault from '@/assets/img/bg-default-gift.png'
import NeedDefault from '@/assets/img/bg-default-need.png'
import iconComment from '@/assets/icon/itemDetail/gift_tool_ic_comment_normal@2x.png'
import iconEdit from '@/assets/icon/itemDetail/gift_tool_ic_edit_normal@2x.png'
import iconPutAway from '@/assets/icon/itemDetail/gift_tool_ic_putaway_normal@2x.png'
import iconTrace from '@/assets/icon/itemDetail/gift_tool_ic_trace_normal@2x.png'
import iconAskfor from '@/assets/icon/itemDetail/gift_tool_ic_askfor_normal@2x.png'
import CommentItem from '@/components/CommentItem'
import ChildComment from '@/components/ChildComment'
import { shipMapping } from '@/tools/constant'
import NoData from '@/components/NoData'
import ShareBar from '@/components/ShareBar'
import ImgUpload from '@/components/ImgUpload'
import { mapState, mapMutations, mapActions } from 'vuex'
import {smartImagePath} from '@/tools/ObjectHelper'
import memberData from '@/tools/memberData'
import { local, KEY_USER_TOKEN } from '@/tools/storage'
import ImageEnlarge from '@/components/ImageEnlarge'
import ImpeachConfirm from '@/components/confirm/Impeach'
import nl2br from 'nl2br'
import dateMixin from '@/mixins/date-fn'

export default {
  mixins: [dateMixin],
  props: {
    itemType: {
      type: String,
      default: 'gift'
    }
  },
  components: {
    Tab,
    TabItem,
    CommentItem,
    ChildComment,
    Group,
    Swiper,
    SwiperItem,
    Tabbar,
    TabbarItem,
    InlineLoading,
    NoData,
    ShareBar,
    ImgUpload,
    XTextarea,
    Confirm,
    ImageEnlarge,
    ImpeachConfirm
  },
  data () {
    return {
      UserDefault,
      thingsPicM,
      GiftDefault,
      NeedDefault,
      shipMapping,
      iconComment,
      iconTrace,
      iconAskfor,
      iconEdit,
      iconPutAway,
      smartImagePath,
      cMsg: '',
      isShowShareBar: false,
      isSendCMsg: false,
      cPlaceHolder: '回覆',
      isTrace: '追蹤',
      isTracing: false,
      parentCommentId: null,
      isComment: false,
      cType: '',
      tabIndex: 0,
      tabType: 'thank',
      tabItems: {
        thank: {
          index: 0,
          key: 'thank-1',
          label: '感謝',
          type: 'thank',
          isLoading: true,
          data: []
        },
        comment: {
          index: 1,
          key: 'comment-1',
          label: '留言提問',
          type: 'comment',
          isLoading: true,
          data: []
        }
      },
      isImgLoaded: false,
      show: false,
      location: '',
      image: '',
      isEnlargeImage: false,
      isToImpeach: false
    }
  },
  created () {
    this.location = window.location.href
    const id = this.$route.params.id
    this.getNeedInfo({
      id,
      cb: (data) => {
        if (data.code === 220 && data.error) {
          this.$router.replace('/unauthorized')
          return
        }
        if (data.error) {
          this.$vux.toast.text(data.error, 'bottom')
          return setTimeout(() => {
            this.$router.push('/needs')
          }, 3000)
        }
        this.getTabItemsInfo()
      }
    })
    const token = local.get('KEY_USER_TOKEN')
    if (token && !this.userInfo.id) {
      this.getLoginUserInfo()
    }
  },
  methods: {
    ...mapActions({
      getCMsg: 'getCMsg',
      submitMsg: 'submitMsg',
      traceItem: 'traceItem',
      removeCommentPic: 'removeCommentPic',
      getNeedInfo: 'getNeedInfo',
      updateStatus: 'updateStatus',
      getLoginUserInfo: 'getLoginUserInfo',
      getChatId: 'getChatId'
    }),
    ...mapMutations({
      setCurrentNeed: 'setCurrentNeed',
      setCommentPic: 'setCommentPic'
    }),
    openImpeach () {
      this.isToImpeach = true
    },
    closeImpeach (isShow) {
      this.isToImpeach = isShow
    },
    enLargeImage (url = '') {
      if (url) {
        this.image = url
        this.toggleShow()
      }
    },
    toggleShow () {
      this.isEnlargeImage = !this.isEnlargeImage
    },
    shareSuc () {
      this.$vux.toast.text('分享成功', 'bottom')
      this.hideShareBar()
    },
    toUpdateStatus () {
      this.show = true
    },
    getTabItemsInfo () {
      const id = this.$route.params.id
      // 获取当前物品留言提问
      this.getCMsg({
        type: 'need',
        cType: 'comment',
        perPage: 100,
        id,
        cb: this.getCommentCb
      })
      // 获取当前物品感谢留言
      this.getCMsg({
        type: 'need',
        cType: 'thank',
        perPage: 100,
        id,
        cb: this.getThankCb
      })
    },
    onConfirm () {
      this.updateStatus({
        type: 'need',
        id: this.$route.params.id,
        status: this.itemInfo.status === 'ongoing' ? 'pull_off' : 'ongoing',
        cb: () => {
          const id = this.$route.params.id
          this.getNeedInfo({
            id,
            cb: () => this.$vux.toast.text(`${this.itemInfo.status === 'ongoing' ? '重新上架' : '提前下架'}成功`, 'bottom')
          })
        }
      })
    },
    toEdit () {
      const id = this.$route.params.id
      this.$router.push(`/need/edit/${id}`)
    },
    toUser () {
      const userId = this.itemInfo.user_id
      const id = this.userInfo.id === userId ? '/userinfo' : `/user/${userId}`
      this.$router.push(id)
    },
    getItemInfoCb () {
      this.isTracing = false
    },
    getCommentCb (obj) {
      this.tabItems['comment'].data = obj.data
      this.tabItems['comment'].isLoading = false
    },
    getThankCb (obj) {
      this.tabItems['thank'].data = obj.data
      this.tabItems['thank'].isLoading = false
    },
    switchTabItem (type, index) {
      this.tabIndex = index
      this.tabType = type
    },
    // 打开评论输入框
    toComment (cType = 'comment', id = null, name = '') {
      const token = local.get('KEY_USER_TOKEN')
      if (!token) {
        return this.$router.replace('/login')
      }
      setTimeout(() => {
        this.$refs.commentInput.focus()
      }, 300)
      // this.$nextTick(() => {
      //   this.$refs.commentInput.focus()
      // })
      // this.$refs.commentInput.focus()
      this.isComment = true
      this.parentCommentId = id
      this.cType = cType
      this.cPlaceHolder = name ? `回覆${name}` : '留言'
    },
    closeComment () {
      this.isComment = false
    },
    // 发送留言
    sendCMsg () {
      const content = this.cMsg.trim()
      if (!content) {
        return this.$vux.toast.text('請輸入文字', 'bottom')
      } else if (content.length > 200) {
        return this.$vux.toast.text('最多可以輸入200個字符哦', 'bottom')
      } else {
        if (!this.isSendCMsg) {
          this.isSendCMsg = true
          const data = {
            content,
            image: this.imgLists[0] ? this.imgLists[0].url : '',
            need_id: this.$route.params.id,
            type: 'need',
            [`parent_${this.cType}${this.cType === 'thank' ? 's' : ''}_id`]: this.parentCommentId
          }
          this.submitMsg({
            cType: this.cType,
            data,
            cb: this.sendMsgCb
          })
        }
      }
    },
    sendMsgCb () {
      this.isSendCMsg = false
      // this.$refs.commentInput.reset()
      this.cMsg = ''
      this.removeCommentPic({i: 0})
      this.isComment = false
      this.$vux.toast.text('留言成功！', 'bottom')
      this.getCMsg({
        type: 'need',
        cType: this.cType,
        perPage: 100,
        id: this.$route.params.id,
        cb: this.cType === 'comment' ? this.getCommentCb : this.getThankCb
      })
    },
    // 追踪
    toTrace () {
      const token = local.get('KEY_USER_TOKEN')
      if (!token) {
        return this.$router.replace('/login')
      }
      if (!this.isTracing) {
        const [type, id, isTrace, cb] = [
          'need',
          this.$route.params.id,
          this.itemInfo.is_tracing,
          this.toTraceCb
        ]
        this.isTrace = `${this.itemInfo.is_tracing ? '取消追蹤...' : '追蹤中...'}`
        this.traceItem({
          type,
          id,
          isTrace,
          cb
        })
        this.isTracing = true
      }
    },
    toTraceCb () {
      const [id, cb] = [this.$route.params.id, this.getItemInfoCb]
      this.getNeedInfo({id, cb})
    },
    // 分享
    showShareBar () {
      this.isShowShareBar = true
    },
    hideShareBar () {
      this.isShowShareBar = false
    },
    toHandle () {
      const id = this.$route.params.id
      if (!local.get(KEY_USER_TOKEN)) {
        return this.$router.push(`/donate/${id}`)
      }
      if (!memberData.isValidBaseInfo(this.$store.state)) {
        this.$vux.toast.text('請先完善會員基本資料', 'bottom')
        setTimeout(() => {
          this.$router.push(`/user/${this.userInfo.id}/editBaseInfo?redirect=/donate/${id}`)
        }, 3000)
      } else if (!memberData.isValidAdr(this.$store.state)) {
        this.$vux.toast.text('請先完善聯絡地址', 'bottom')
        setTimeout(() => {
          this.$router.push(`/user/${this.userInfo.id}/editAdr?redirect=/donate/${id}`)
        }, 3000)
      } else {
        this.$router.push(`/donate/${id}`)
      }
    },
    upLoadingImg () {
      this.isImgLoaded = true
    },
    // 上传图片
    imgLoaded (data) {
      this.setCommentPic({data})
      this.isImgLoaded = false
    },
    // 删除图片
    removeImg (i) {
      this.removeCommentPic({i})
    },
    toChatroom (thingId, directUserId) {
      const type = 'need_donate'
      this.getChatId({ type, thingId, directUserId, cb: this.getChatIdCb })
      this.$vux.loading.show({
        text: '跳轉至互動卡中...'
      })
    },
    getChatIdCb (data) {
      this.$vux.loading.hide()
      if (data) {
        this.$router.push(`/chatroom/${data.id}`)
      }
    }
  },
  computed: {
    ...mapState({
      imgLists: state => state.things.commentPic,
      currentNeed: state => state.needs.currentNeed,
      userInfo: state => state.user.userInfo
    }),
    onGoing () {
      return this.itemInfo.status !== 'pull_off' && this.itemInfo.status !== 'finish'
    },
    isGift () {
      return this.itemType === 'gift'
    },
    itemInfo () {
      if (this.currentNeed.desc) {
        return {
          ...this.currentNeed,
          desc: nl2br(this.currentNeed.desc)
        }
      }
      return this.currentNeed
    },
    thanks () {
      const thanks = this.tabItems['thank'].data.filter((item) => {
        return item.parent_thanks_id === 0
      })
      const childRequests = this.tabItems['thank'].data.filter((item) => {
        return item.parent_thanks_id !== 0
      })
      for (let i = 0; i < thanks.length; i++) {
        thanks[i] = {
          ...thanks[i],
          child_thanks: []
        }
        childRequests.map((item) => {
          if (item.parent_thanks_id === thanks[i].id) {
            thanks[i].child_thanks.unshift(item)
          }
        })
      }
      return thanks
    },
    // 需求總數
    needNum () {
      const needItem = this.itemInfo.need_items
      if (needItem && needItem.length) {
        const numArr = this.itemInfo.need_items.map(item => item.quantity)
        return numArr.reduce((prev, cur) => cur + prev)
      } else {
        return []
      }
    },
    // 需求剩余总数
    needLeft () {
      const needItem = this.itemInfo.need_items
      if (!(needItem && needItem.length)) {
        return 0
      }
      const numArr = this.itemInfo.need_items.map(item => {
        return item.left > 0 ? item.left : 0
      })
      return numArr.reduce((prev, cur) => cur + prev)
    },
    progress () {
      return `${parseFloat((this.needNum - this.needLeft) / this.needNum).toFixed(2) * 100}%`
    },
    isMySelf () {
      return this.userInfo.id === this.itemInfo.user_id
    },
    isVerifyCell () {
      const { veriCell } = this.userInfo
      return typeof veriCell === 'boolean' ? veriCell : (veriCell === 'Y')
    },
    isOffOrFinish () {
      return this.itemInfo.status === 'finish' || this.itemInfo.status === 'pull_off'
    }
  },
  directives: {
    TransferDom
  }
}
</script>
<style lang="less">
  .item-need{
    > .pics{
      .item-dots{
        z-index: 50;
        a {
          margin-left: 0 !important;
          .vux-icon-dot{
            height: 3px !important;
            width: 15px !important;
            background-color: rgba(255,255,255,.25) !important;
            &.active{
              background-color: @color-font-C4 !important;
            }
          }
        }
      }
    }
    .tabs{
      .vux-tab{
        .vux-tab-item{
          background: none;
          font-size: @font-S1;
          &.vux-tab-selected{
            color: @color-font-CR;
            font-size: 19px;
          }
        }
        .vux-tab-bar-inner{
          background: linear-gradient(to right, @color-font-CR 50%, @color-CO 50%)
        }
      }
    }
    .message-input{
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
    .weui-tabbar, .vux-tabbar-simple {
      .weui-tabbar__item {
        padding-top: 0;
        .weui-tabbar__label{
          > p{
            display: inline-flex;
            align-items: center;
          }
          span{
            margin-left: 8px;
            font-size: 14px;
          }
        }
        &.weui-bar__item_on, &.weui-bar__item {
          .weui-tabbar__label {
            color: @color-font-C1;
          }
        }
      }
    }
    .weui-tabbar__label {
      color: @color-font-C1;
    }
  }
  .message-confirm{
    .vux-x-dialog{
      .weui-dialog{
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 1000 !important;
        width: 100%;
        max-width: 100%;
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
  }
</style>
<style lang="less" scoped>
  @import '../global.mixin.less';
  .item-need{
    overflow-y: scroll;
    padding-bottom: 50px;
    text-align: left;
    line-height: 1;
    > .pics{
      position: relative;
      .img-item{
        width: 100%;
        height: 290px;
        overflow: hidden;
        background-size:100% auto;
        background-repeat:no-repeat;
        background-position: center center;
        background-color: @color-CBG;
      }
      .swiper-img{
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .title{
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 60px 85px @pm-md @pm-md ;
        width: 100%;
        color: @color-font-C4;
        font-size: 18px;
        background-image: url("./../assets/img/bg-banner-mask.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
      .share-btn{
        position: fixed;
        top: @pm-bg;
        right: @pm-bg;
        z-index: 99;
        width: 36px;
        height: 36px;
        background: url('../assets/icon/itemDetail/gift_nav_ic_share_normal@2x.png') center center no-repeat;
        background-size: 36px 36px;
      }
      .back-icon{
        position: fixed;
        left: 15px;
        top: 15px;
        z-index: 99;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(0, 0, 0, .2);
      }
    }
    .container{
      padding: 0 @pm-bg;
      .info{
        .user-info{
          padding: @pm-lg 0;
          .g-border-1px();
          .detail{
            display: flex;
            align-items: center;
            .avatar{
              margin-right: @pm-bg;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: 1px solid @color-CL;
              overflow: hidden;
              background-size:40px auto;
              background-repeat:no-repeat;
              background-position: center center;
            }
            & > .wrapper{
              flex: 1;
              .user-name{
                color: @color-font-C1;
                font-size: @font-S2;
                font-weight: 700;
              }
              .pull-off-at{
                margin-top: @pm-md;
                color: @color-font-C2;
                font-size: @font-S4;
                .num{
                  color: @color-font-CR;
                  font-style: normal;
                }
              }
            }
            .show-date{
              color: @color-font-C2;
              font-size: @font-S4;
            }
          }
          .address{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            > .wrapper{
              display: inline-flex;
              align-items: center;
              .icon{
                margin-right: 8px;
                width: 20px;
                height: 20px;
                background: url('../assets/icon/itemDetail/gift_list_ic_location.png') center center no-repeat;
                background-size:20px 20px ;
              }
              .txt{
                color: @color-font-C1;
                font-size: @font-S3;
              }
            }
            .impeach-btn{
              color: @color-font-C2;
              font-size: @font-S4;
            }
          }
        }
        .data{
          padding: @pm-lg 0;
          .g-border-1px();
          .amount{
            display: flex;
            align-items: center;
            .icon{
              margin-right: 8px;
              width: 20px;
              height: 20px;
              background: url('../assets/icon/itemDetail/gift_list_ic_amount@2x.png') center center no-repeat;
              background-size:20px 20px ;
            }
            .txt{
              font-size: @font-S2;
              font-weight: 700;
              .num{
                color: @color-font-CR;
                font-style: normal;
              }
            }
          }
          > .wrapper{
            margin-top: @pm-bg;
            font-size: @font-S3;
            .desc{
              .title{
              }
              .txt{
                line-height: 20px;
                word-break: break-all;
              }
            }
          }
        }
        .ships{
          margin: @pm-lg 0;
          .title{
            display: flex;
            align-items: center;
            .icon{
              margin-right: @pm-md;
              width: 20px;
              height: 20px;
              background: url('../assets/icon/itemDetail/gift_list_ic_send@2x.png') center center no-repeat;
              background-size:20px 20px ;
            }
            .txt{
              font-size: @font-S2;
              font-weight: 700;
            }
          }
          .content{
            .ship{
              margin-top: @pm-bg;
              font-size: 0;
              span{
                color: @color-font-C1;
                font-size: @font-S3;
                &.ship-opt{
                  .dot{
                    margin: 0 8px;
                  }
                }
              }
            }
          }
        }
        .progress{
          margin: @pm-lg 0;
          padding-top: @pm-lg;
          border-top: 1px solid @color-CL;
          .title{
            display: flex;
            align-items: center;
            > .icon{
              margin-right: @pm-md;
              width: 20px;
              height: 20px;
              background: url('../assets/icon/itemDetail/gift_list_ic_plan@2x.png') center center no-repeat;
              background-size:20px 20px ;
            }
            .txt{
              font-size: @font-S2;
              font-weight: 700;
            }
          }
          .content{
            .needItem{
              display: flex;
              align-items: center;
              margin-top: 8px;
              font-size: 0;
              &:first-child{
                margin-top: @pm-bg;
              }
              > .icon{
                margin-right: @pm-md;
                width: 20px;
                height: 20px;
                background: url('../assets/icon/itemDetail/com_list_ic_gift@2x.png') center center no-repeat;
                background-size:20px 20px ;
              }
              .name{
                flex:none;
                width: 60%;
                color: @color-font-C1;
                font-size: @font-S3;
              }
              .progress-wrapper{
                flex: 1;
                display: inline-flex;
                justify-content: space-between;
                align-items: center;
                .progress-bar{
                  position: relative;
                  width: 100%;
                  height: 4px;
                  bottom: 0;
                  display: flex;
                  overflow: hidden;
                  &-front,
                  &-back{
                    height: 4px;
                    content: '';
                    position: absolute;
                  }

                  &-front{
                    z-index: 2;
                    background-color: @color-CO;
                    background-image: linear-gradient(to right, @color-CO, @color-CR);
                    border-radius: 0 2px 2px 0;
                  }

                  &-back{
                    z-index: 1;
                    width: 100%;
                    background-color: #e5e5e5;
                  }
                }
                .num{
                  margin:0 0 0 @pm-md;
                  color: @color-font-C2;
                  font-size: @font-S4;
                }
              }
            }
          }
        }
        .donate{
          margin: @pm-lg 0;
          padding-top: @pm-lg;
          border-top: 1px solid @color-CL;
          .title{
            display: flex;
            align-items: center;
            > .icon{
              margin-right: @pm-md;
              width: 20px;
              height: 20px;
              background: url('../assets/icon/itemDetail/com_pic_default_head@2x.png') center center no-repeat;
              background-size:20px 20px ;
            }
            .txt{
              font-size: @font-S2;
              font-weight: 700;
            }
          }
          .content{
            margin-left: 2px;
            .donateItem{
              position: relative;
              display: flex;
              flex-direction: column;
              margin-top: 8px;
              padding-left: @pm-bg;
              font-size: @font-S3;
              border-left: 1px solid @color-CL;
              padding-bottom: @pm-bg;
              &:first-child{
                margin-top: @pm-bg;
              }
              .dot-wrapper{
                position: absolute;
                top: 0;
                left: -8px;
                width: 15px;
                height: 15px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #FFF;
                .dot{
                  display: block;
                  width: 5px;
                  height: 5px;
                  background: @color-CBG;
                }
              }
              &:last-child{
                border: none;
                padding-bottom: 0;
                .dot-wrapper{
                  left: -7px;
                }
              }
              .info{
                display: flex;
                align-items: center;
                > .user-name a{
                  color: @color-font-C1;
                  font-weight: 700;
                }
                > .donate-num{
                  margin: 0 @pm-sm;
                  color: @color-font-C1;
                }
                > .item-name{
                  color: @color-font-CR;
                }
              }
              .time{
                margin-top: 8px;
                color: @color-font-C3;
              }
              .interact {
                color: @color-font-CO;
                display: inline-block;
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
    .tabs{
      border-top: 10px solid @color-CBG;
      .content{
        margin-top: 30px;
        padding: 0 @pm-bg;
        min-height: 100px;
      }
    }
    .tab-bar-box{
      position: fixed;
      bottom: 0;
      z-index: 50;
      width: 100%;
      max-width: @max-width;
    }
    .message-input{
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
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: calc(~"100% - 46px");
        background: @color-CBG;
        .box-panel{
          > .pics{
            margin-top: @pm-bg;
            padding: 0 @pm-bg @pm-bg;
          }
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
</style>
