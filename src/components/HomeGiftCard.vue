<template>
  <div class="hcard-container">
    <div class="hcard-userinfo">
      <router-link :to="userInfo.id === userId ? '/userinfo' : `/user/${userId}`">
        <span class="hcard-pics-wrapper">
          <img
            class="hcard-userinfo-pics"
            :src="smallAvatar || UserDefault"
            alt="用戶頭像"/>
        </span>
      </router-link>
      <div class="hcard-username-wrapper">
        <router-link :to="userInfo.id === userId ? '/userinfo' : `/user/${userId}`" class="hcard-username">
          {{userName}}
        </router-link>
        <span class="hcard-address" v-if="city && district">
          <img class="hcard-address-icon" :src="LocationIcon" alt="">{{city}},　{{district}}
        </span>
      </div>
      <span class="hcard-gift-time">{{time | smartDate}}</span>
    </div>
    <div style="margin-top: 15px">
      <router-link :to="`/gift/${giftId}`" class="hcard-view">
        <div class="hcard-gift-image-wrapper">
          <img
            v-if="left && !!isNew"
            class="tag"
            width="18"
            height="30"
            :src="picLabelNew"
            alt="picLabelNew"
          >
          <img
            v-if="!left"
            class="tag"
            width="18"
            height="30"
            :src="picLabelSend"
            alt="picLabelSend"
          >
          <x-img
            class="hcard-gift-image"
            success-class="hcard-gift-image-s"
            error-class="hcard-gift-image-e"
            :default-src="(image || GiftDefault) | smallImage"
            :src="image | smallImage"
          />
        </div>
        <div class="hcard-gift-baseinfo">
          <div class="hcard-title-wrapper">
            <span class="hcard-gift-title">{{title}}</span>
            <span class="hcard-gift-left">剩餘：<span>{{left}}</span></span>
          </div>
          <span v-html="desc" class="hcard-gift-desc"></span>
        </div>
      </router-link>
    </div>
    <div class="hcard-action">
      <div class="hcard-action-left">
        <!--<div class="hcard-btn-comment" @click="handleSendComment(giftId)">-->
          <!--<img :src="CommentIcon" alt="">-->
          <!--留言-->
        <!--</div>-->
        <div class="hcard-btn-share" @click="handleShare">
          <img :src="ShareIcon" alt="">
          分享
        </div>
      </div>
      <div v-if="userInfo.id !== userId" class="hcard-action-right">
        <button
          class="hcard-btn-trace"
          @click="handleToggleTrace(giftId, isTracing)"
        >
          {{isTraced ? isTracing ? '已追蹤' : '追蹤' : isTracing ? '取消中...' : '追蹤中...'}}
        </button>
        <button
          class="hcard-btn-request"
          :disabled="!left"
          @click="handleRequest(giftId)"
        >
          {{left ? '索取' : '已送出'}}
        </button>
      </div>
    </div>
    <!--<div class="hcard-comments">-->
      <!--<div class="hcard-btn-all">查看全部</div>-->
    <!--</div>-->
    <share-bar
      :title="title"
      :desc="desc"
      :image="image"
      :shareSuc="shareSuc"
      @hideShareBar="handleShare"
      :is-show="isShowShareBar"
    >
    </share-bar>
  </div>
</template>

<script>
import UserDefault from '@/assets/icon/icon-default-avatar.png'
import GiftDefault from '@/assets/icon/img-default-gift.png'
import LocationIcon from '@/assets/img/gift_list_ic_location@2x.png'
import CommentIcon from '@/assets/img/home_list_ic_comment_normal@2x.png'
import ShareIcon from '@/assets/img/home_list_ic_share_normal@2x.png'
import picLabelNew from '@/assets/icon/gift/home_pic_label_new_2@2x.png'
import picLabelSend from '@/assets/icon/gift/home_pic_label_send@2x.png'
import ShareBar from '@/components/ShareBar'
import { XImg } from 'vux'
import { mapState } from 'vuex'
import memberData from '@/tools/memberData'
import { local, KEY_USER_TOKEN } from '@/tools/storage'
import {smartImagePath} from '@/tools/ObjectHelper'

export default {
  components: {
    XImg,
    ShareBar
  },
  data () {
    return {
      UserDefault,
      GiftDefault,
      LocationIcon,
      CommentIcon,
      ShareIcon,
      picLabelNew,
      picLabelSend,
      isTraced: true,
      isShowShareBar: false
    }
  },
  props: {
    pics: {
      type: String
    },
    userName: {
      type: String,
      required: true
    },
    userId: {
      type: [String, Number],
      required: true
    },
    giftId: {
      type: [String, Number],
      required: true
    },
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    portrait: {
      type: String
    },
    image: {
      type: String
    },
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      default: '暂无描述'
    },
    left: {
      type: [String, Number],
      required: true
    },
    isTracing: {
      type: [String, Number, Boolean]
    },
    time: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    isNew: {
      type: [Number, Boolean],
      required: true
    }
  },
  methods: {
    handleToggleTrace (giftId, isTracing) {
      // 拦截未登录用户
      if (!local.get(KEY_USER_TOKEN)) {
        return this.$router.replace('/login')
      }
      if (this.isTraced) {
        this.isTraced = false
        this.$store.dispatch('toggleTraceGift', {giftId, isTracing, cb: this.handleToggleTraceCb})
      }
    },
    handleToggleTraceCb () {
      this.isTraced = true
    },
    handleRequest (id) {
      if (!local.get(KEY_USER_TOKEN)) {
        return this.$router.push(`/request/${id}`)
      }
      if (!memberData.isValidBaseInfo(this.$store.state)) {
        this.$vux.toast.text('請先完善會員基本資料', 'bottom')
        setTimeout(() => {
          this.$router.push(`/user/${this.userInfo.id}/editBaseInfo?redirect=/request/${id}`)
        }, 3000)
      } else if (!memberData.isValidAdr(this.$store.state)) {
        this.$vux.toast.text('請先完善聯絡地址', 'bottom')
        setTimeout(() => {
          this.$router.push(`/user/${this.userInfo.id}/editAdr?redirect=/request/${id}`)
        }, 3000)
      } else {
        this.$router.push(`/request/${id}`)
      }
    },
    // 分享
    handleShare () {
      this.isShowShareBar = !this.isShowShareBar
    },
    handleSendComment (id) {
      this.$router.push(`/gift/${id}#comments`)
    },
    shareSuc () {
      this.$vux.toast.text('分享成功', 'bottom')
      this.handleShare()
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    smallAvatar () {
      return smartImagePath(this.portrait)
    }
  }
}
</script>

<style lang="less" scoped>
  .desc{
  color: @color-font-C2;
  font-size: @font-S4;
}

.btn{
  font-size: @font-S3;
  color: @color-font-C4;
  width: 64px;
  height: 30px;
  border-radius: 3px;
  text-align: center;
  line-height: 30px;
}

.hcard-container{
  padding: @pm-bg;
  // margin-bottom: @pm-bg;
  margin-top: 10px;
  background-color: #fff;
}

.hcard-userinfo{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hcard-pics-wrapper{
  position: relative;
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid @color-CL;
  overflow: hidden;
  .hcard-userinfo-pics{
    position: absolute;
    top: 50%;
    width: 100%;
    border-radius: 50%;
    transform: translateY(-50%);
  }
}

.hcard-username-wrapper{
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 15px;
}

.hcard-username{
  font-size: @font-S2;
  color: @color-font-C1;
}

.hcard-gift-time{
  .desc;
}

.hcard-address,
.hcard-timeago{
  .desc;
}

.hcard-address-icon{
  width: 12px;
  height: 12px;
  display: inline-block;
  margin-right: 5px;
  margin-bottom: -2px;
}

.hcard-view{
  margin-top: 15px;
  display: flex;
  flex-direction: row;
}

.hcard-gift-image-wrapper{
  position: relative;
  width: 90px;
  height: 90px;
  overflow: hidden;
  display: flex;
  align-items: center;
  background-color: @color-CBG;
  .tag{
    position: absolute;
    top: 0;
    left: 6px;
    width: 18px;
    height: 30px;
  }
}

.hcard-gift-image{
  width: 100%;
  display: inline-block;
}

.hcard-gift-baseinfo{
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 15px;
  background-color: @color-BG;
}

.hcard-title-wrapper{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hcard-gift-title{
  color: @color-font-CR;
  font-size: @font-S2;
  font-weight: 700;
  max-width: 150px;
  overflow: hidden;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.hcard-gift-left{
  display: inline-block;
  .desc;
  >span{
    color: @color-font-CR;
  }
}

.hcard-gift-desc{
  /*display: inline-block;*/
  height: 40px;
  overflow: hidden;
  .desc;
  display: -webkit-box;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* autoprefixer: on */
  overflow: hidden;
  white-space:normal;
  word-break:break-all;
}

.hcard-action{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;

  &-left,
  &-right{
    display: flex;

    button {
      border: none;
    }
  }
}

.hcard-btn-comment,
.hcard-btn-share{
  .desc;
  display: flex;
  align-items: center;
  margin-right: 15px;
  img{
    width: 24px;
    height: 24px;
    display: inline-block;
    margin-right: 5px;
  }
}

.hcard-btn-trace{
  background-color: @color-CO;
  .btn;
}
.hcard-btn-request{
  background-color: @color-CR;
  margin-left: 15px;
  .btn;
}
.hcard-btn-all{
  color: @color-font-C2;
  font-size: @font-S3;
  height: 100px;
  line-height: 100px;
}
</style>
