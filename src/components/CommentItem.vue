<template>
  <div class="comment-item">
    <div class="detail">
      <div class="avatar-wrapper">
        <div
          @click="toUser"
          class="avatar"
          :style="{backgroundImage: `url(${(cType === 'comment' ? info.user.pics : info.from_user.pics) || UserDefault})`}">
        </div>
        <img v-if="isBindWhite" class="icon" :src="comAngle80" width="40" height="19" alt="angle">
        <img v-if="isBindBlack" class="icon demon" :src="comDemon80" width="40" height="19" alt="demon">
        <img v-if="verify.mail && verify.cell" :src="picVip" width="20" height="20" class="vip" alt="icon">
      </div>
      <div class="wrapper">
        <div
          class="user-name"
          @click="toUser"
        >
          {{ (cType === 'comment' ? info.user.nickname : info.from_user.nickname) || '無暱稱' }}
        </div>
        <div
          class="sum"
          v-if="itemType === 'gift' && (cType === 'request' || cType === 'thank')"
        >
          <span
            v-if="info.gift_request && info.gift_request.request_quantity"
            class="extort"
          >
            索取{{ info.gift_request.request_quantity}}個
          </span>
          <template v-if="info.gift_request && info.gift_request.quantity">
            <span class="dot">·</span>
            <span class="receive">獲贈{{info.gift_request.quantity}}個</span>
          </template>
        </div>
        <div v-if="itemType === 'need' && cType === 'thank'" class="sum">
          <span
            @click="toThankUser"
            class="extort"
          >
            給 <i class="thank-user-name">{{info.to_user.nickname || '無暱稱'}}</i> 的感謝
          </span>
        </div>
      </div>
      <div class="detail-right" v-if="(isMySelf || info.from_user_id === userInfo.id) && cType === 'request'">
        <div class="create-at">{{ info.created_at | smartDate }}</div>
        <div class="interact" @click.stop="toChatroom">來互動</div>
      </div>
      <div class="create-at" v-else>{{ info.created_at | smartDate }}</div>
    </div>
    <div class="content">
      <div
        @click="toComment"
        class="txt"
      >
        {{ info.content }}
      </div>
      <div
        v-show="info.image && info.image !== '0'"
        class="pic"
      >
        <img
          v-show="info.image"
          v-preview="smartImagePath(info.image, false)"
          :src="info.image | smallImage"
          alt="關閉"
          preview-title-enable="true"
          preview-nav-enable="true"
        >
      </div>
    </div>
    <slot name="child">
    </slot>
  </div>
</template>

<script>
import UserDefault from '@/assets/icon/icon-default-avatar.png'
import comAngle80 from '@/assets/icon/com_pic_angel_80@2x.png'
import comDemon80 from '@/assets/icon/com_pic_demon_80@2x.png'
import {smartImagePath} from '@/tools/ObjectHelper'
import picVip from '../assets/icon/profile/profile_pic_vip@2x.png'
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    info: {
      type: Object
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
    },
    cType: {
      type: String,
      default: 'comment'
    },
    itemType: {
      type: String,
      default: 'gift'
    },
    isMySelf: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      UserDefault,
      comAngle80,
      comDemon80,
      smartImagePath,
      picVip
    }
  },
  created () {
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      return this.getLoginUserInfo({cb: this.getLoginUserInfoCb})
    }
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo',
      getChatId: 'getChatId'
    }),
    toComment () {
      this.$emit('toComment')
    },
    toUser () {
      const userId = this.cType === 'comment' ? this.info.user_id : this.info.from_user_id
      this.$router.push(this.userInfo.id === userId ? '/userinfo' : `/user/${userId}`)
    },
    toThankUser () {
      const userId = this.info.to_user.id
      this.$router.push(this.userInfo.id === userId ? '/userinfo' : `/user/${userId}`)
    },
    getLoginUserInfoCb () {
      console.info('成功獲取登錄用戶信息')
    },
    toChatroom () {
      // 2017-07-01前的互动卡不做保留，点击即跳转至礼物或者需求详情
      const isOverdue = new Date(this.info.created_at.replace(/-/g, '/')).getTime() -
        new Date('2017/07/01 00:00:00').getTime()
      if (isOverdue < 0) {
        return this.$vux.toast.text('2017年6月之前的來互動不做保留', 'bottom')
      }
      const type = `${this.itemType === 'gift' ? 'gift_request' : 'need_donate'}`
      this.getChatId({
        type,
        thingId: this.info.gift_request_id,
        directUserId: this.isMySelf ? this.info.from_user_id : this.info.to_user_id,
        cb: this.getChatIdCb
      })
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
      userInfo: state => state.user.userInfo
    }),
    isBindWhite () {
      const isBeToSet = this.isMyself || (this.cType !== 'request')
      return isBeToSet ? false : this.marks['WHITE'].data.some((item) => item.mark_user_id === this.info.from_user.id)
    },
    isBindBlack () {
      const isBeToSet = this.isMyself || (this.cType !== 'request')
      return isBeToSet ? false : this.marks['BLACK'].data.some((item) => item.mark_user_id === this.info.from_user.id)
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
  @import '../global.mixin.less';
  .comment-item{
    padding: @pm-bg 0;
    .g-border-1px();
    &:last-child{
      .g-border-none();
    }
    .detail {
      display: flex;
      align-items: center;
      .avatar-wrapper{
        position: relative;
        .avatar {
          position: relative;
          z-index: 3;
          margin-right: @pm-bg;
          width: 40px;
          height: 40px;
          border: 1px solid @color-CL;
          border-radius: 50%;
          background-size: 40px auto;
          background-repeat: no-repeat;
          background-position: center center;
          background-color: #FFF;
        }
        .icon{
          position: absolute;
          top: -9px;
          left: 0;
          z-index: 2;
          &.demon{
            top: -7px;
          }
        }
        .vip{
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 10;
        }
      }
      & > .wrapper {
        flex: 1;
        .user-name {
          font-size: @font-S2;
          font-weight: bold;
        }
        .sum {
          margin-top: @pm-md;
          color: @color-font-C2;
          font-size: @font-S4;
          .extort{
            .thank-user-name{
              color: @color-font-C1;
              font-style: normal;
            }
          }
          .receive{}
        }
      }

      .detail-right {
        display: flex;
        flex-direction: column;
      }

      .interact {
        color: @color-font-CO;
        font-size: @font-S4;
        text-align: right;
        margin-top: 10px;
      }
      .create-at {
        color:  @color-font-C2;
        font-size: @font-S4;
        text-align: right;
      }
    }
    .content{
      padding:@pm-md 0 0;
      line-height: 23px;
      .txt{
        color: @color-font-C1;
        font-size: @font-S4;
        text-align: justify;
        word-break:break-all
      }
      .pic{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: @pm-md 0 0 0;
        width: 75px;
        height: 75px;
        overflow: hidden;
        background-color: @color-CBG;
        img{
          display: block;
          width: 75px;
        }
      }
    }
  }
</style>
