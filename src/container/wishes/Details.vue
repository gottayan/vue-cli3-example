<template>
  <div class="wrap wish-public-style" id="wrap">
    <div class="header" v-if="!isComment">
      <sticky scroll-box="wrap" :offset="0" :check-sticky-support="false">
        <x-header
          title="心願詳情"
        ></x-header>
      </sticky>
      <div class="vux-sticky-fill" style="height:44px;"></div>
    </div>
    <div class="detail">
      <div class="card-show">
        <div class="img-wrap"
        >
          <img class="img"
               id="preview-img"
               v-gallery
               :src="wishItem.image_path ? smartImagePath(wishItem.image_path, false) : defaultGift"
          />
          <div class="num">
            <p class="np">
              {{wishItem.wish_no}}
            </p>
          </div>
        </div>
        <div class="content">
          <div class="title">
            <h3 class="tp">
              心願禮物：{{wishItem.title}}
            </h3>
          </div>
          <div class="adress">
           <span>
              <img :src="localImg" alt=""/>
            </span>
            <p class="ap">
              {{wishItem.school_name}}
            </p>
          </div>
          <div style="font-size: 15px;" class="desc" v-html="wishItem.desc">
          </div>
          <div
            class="btn"
            :class="isEnd && 'disabled-btn'"
            v-show="Object.keys(wishItem).length"
            @click="handleAdoptClick"
          >
            <p class="bp">
              {{statusMap()[wishItem.status]}}
            </p>
          </div>
          <div
            style="margin: 10px 0;"
            class="btn"
            v-if="isOwn"
            @click="$router.push(`/wish/after/${$route.params.id}`)"
          >
            <p class="bp">
              寄送資訊
            </p>
          </div>
          <div class="tools">
            <div class="view">
              <p>瀏覽：{{wishItem.reads_count}}</p>
            </div>
            <div class="work">
              <div class="like" @click="handleLikeClick">
                <img :src="like ? likeSelectedImg : likeImg" alt="">
                <span :class="like && 'selected'">{{voteCount}}</span>
              </div>
              <div class="share" @click="handleShare">
                <img :src="shareImg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <request-card
        :title="requestCardMap(wishItem.student_name).wish.title"
        :icon="requestCardMap().wish.icon"
      >
        <ul class="request-wish-list">
          <li>
            <span>年級：</span>
            <span>{{wishItem.class_name || '暫無'}}</span>
          </li>
          <li>
            <span>學校：</span>
            <span>{{wishItem.school_name || '暫無'}}</span>
          </li>
          <!--<li>-->
            <!--<span>截止時間：</span>-->
            <!--<span>2018/12/3</span>-->
          <!--</li>-->
        </ul>
      </request-card>
      <request-card
        v-if="wishItem.wish_donate"
        :title="requestCardMap().adopter.title"
        :icon="requestCardMap().adopter.icon"
      >
        <div class="adopter" v-if="wishItem.wish_donate.user">
          <div class="avatar" @click="() => handleClickUser(wishItem.wish_donate.user.id)">
            <img class="circle-avatar" :src="smartImagePath(wishItem.wish_donate.user.pics) || defaultAvatar" alt=""/>
          </div>
          <div class="info">
            <div class="user-name" @click="() => handleClickUser(wishItem.wish_donate.user.id)">
              <p>{{wishItem.wish_donate.user.nickname}}</p>
            </div>
            <!--<div class="get-time">-->
              <!--<span>認養時間：</span>-->
              <!--<span>{{wishItem.done_at}}</span>-->
            <!--</div>-->
          </div>
        </div>
      </request-card>
      <request-card
        v-if="wishItem.wish_donate && wishItem.wish_donate.thanks"
        :title="requestCardMap().word.title"
        :icon="requestCardMap().word.icon"
      >
        <div class="talk">
          <div class="send">
            <span>TO:</span>
            <span @click="() => handleClickUser(wishItem.wish_donate.user.id)">
              <img class="circle-avatar" :src="smartImagePath(wishItem.wish_donate.user.pics) || defaultAvatar" alt=""/>
            </span>
            <span @click="() => handleClickUser(wishItem.wish_donate.user.id)">{{wishItem.wish_donate.user.nickname}}</span>
          </div>
          <div class="thank-content">
            <p>{{wishItem.wish_donate.thanks}}</p>
          </div>
          <div class="thank-img">
            <img :src="wishItem.wish_donate.thanks_image_path" alt="">
          </div>
          <div style="margin: 5px 0;">
            在12/15(六)我們將會把滿滿的愛（心願禮物跟卡片、物資）一併帶到偏鄉國小， 歡迎您加入幸福偏鄉的粉絲團追蹤後續發送禮物的情況唷！<a target="_blank" href="https://www.facebook.com/happinessforkids/?fref=ts">https://www.facebook.com/happinessforkids/?fref=ts</a><br>
            去年幸福偏鄉發送聖誕禮物的情況：
            <a target="_blank" href="http://bit.ly/2hZiwru">http://bit.ly/2hZiwru</a>
          </div>
          <div class="receiver">
            <span>「幸福偏鄉」</span>
            <span>FROM:</span>
          </div>
        </div>
      </request-card>
      <request-card
        :noTitle="true"
        :toComment="toComment">
        <div v-if="commentsList.data && !commentsList.data.length" class="has-no-comments"><p>暫無詢問</p></div>
        <div v-else class="chat" v-for="(item, index) in commentsList.data" :key="index">
          <div class="chat-parent">
            <div class="user-info">
              <div class="avartar" @click="() => handleClickUser(item.user.id)">
                <img class="circle-avatar" :src="smartImagePath(item.user.pics) || defaultAvatar" alt="">
              </div>
              <div class="username" @click="() => handleClickUser(item.user.id)">
                <p>{{item.user.nickname}}</p>
              </div>
            </div>
            <div class="content">
              <p>{{item.content}}</p>
            </div>
          </div>
          <span class="reply-btn" @click="toComment(item.id)">回覆</span>
          <div class="chat-wrap">
            <div class="chat-children" v-for="(childItem, childIndex) in item.child_comments" :key="childIndex">
              <span class="reply-username" @click="() => handleClickUser(childItem.user.id)">{{childItem.user.nickname}}</span>：
              <span class="reply-content">{{childItem.content}}</span>
            </div>
          </div>
        </div>
      </request-card>
    </div>
    <share-bar
      :url="location"
      :title="'2018幸福偏鄉心願認養:' + wishItem.title"
      :desc="noTagDesc"
      :image="wishItem.image_path"
      :shareSuc="shareSuc"
      @hideShareBar="handleShare"
      :is-show="isShowShareBar"
    >
    </share-bar>
    <confirm
      class="message-confirm ask-input"
      v-model="isComment"
      hide-on-blur>
      <x-header
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
  </div>
</template>

<script>
import defaultGift from '@/assets/icon/img-default-gift.png'
import { smartImagePath } from '@/tools/ObjectHelper'
import { mapState, mapActions } from 'vuex'
import { Sticky, Confirm, Group, XTextarea } from 'vux'
import { statusMap, requestCardMap } from './constants'
import likeImg from '../../assets/img/wishes/wish_ic_praise_normal@2x.png'
import likeSelectedImg from '../../assets/img/wishes/wish_ic_praise_selected@2x.png'
import shareImg from '../../assets/img/wishes/wish_ic_share_normal@2x.png'
import localImg from '../../assets/img/wishes/wish_ic_location@2x.png'
import RequestCard from './RequestCard'
import ShareBar from '@/components/ShareBar'
import debounce from 'lodash.debounce'
import defaultAvatar from '@/assets/icon/icon-default-avatar.png'
export default {
  components: {
    Sticky,
    RequestCard,
    ShareBar,
    Confirm,
    Group,
    XTextarea
  },
  data () {
    return {
      defaultGift,
      defaultAvatar,
      smartImagePath,
      statusMap,
      likeImg,
      shareImg,
      likeSelectedImg,
      localImg,
      requestCardMap,
      like: false,
      viewer: 12,
      isShowShareBar: false,
      isComment: false,
      cMsg: '',
      cPlaceHolder: '請輸入要詢問的內容',
      parentCommentId: null,
      isSendCMsg: false,
      location: '',
      voteCount: 0
    }
  },
  computed: {
    ...mapState({
      wishItem: state => state.wishes.wishItem,
      commentsList: state => state.wishes.commentsList
    }),
    isEnd () {
      return this.wishItem.status !== 'on'
    },
    noTagDesc () {
      const reg = /<\/?.+?\/?>/g
      return this.wishItem.desc && this.wishItem.desc.replace(reg, '')
    },
    isOwn () {
      return this.wishItem.wish_donate && (this.$store.state.user.userInfo.id === this.wishItem.wish_donate.user_id)
    }
  },
  methods: {
    ...mapActions({
      getWishItem: 'getWishItem',
      getCommentsList: 'getCommentsList',
      submitComments: 'submitComments',
      voteUp: 'voteUp',
      cancelVote: 'cancelVote',
      sendRead: 'sendRead'
    }),
    getCb (data) {
      if (data.votes_count) {
        this.voteCount = data.votes_count
      }
      this.$vux.loading.hide()
    },
    handleLikeClick () {
      if (!localStorage.getItem('KEY_USER_TOKEN')) {
        return this.$router.replace(`/login?redirect=/wish/${this.$route.params.id}`)
      }
      this.like = !this.like
      this.voteUpLike()
    },
    voteUpLike: debounce(function () {
      const id = this.$route.params.id
      if (this.like) {
        this.voteUp({id: id, cb: this.voteCb})
      } else {
        this.cancelVote({id: id, cb: this.voteCb})
      }
    }, 500),
    voteCb (data) {
      if (data.votes_count !== null || undefined) {
        this.voteCount = data.votes_count
      }
    },
    handleAdoptClick () {
      const id = this.$route.params.id
      if (this.isEnd) {
        return null
      }
      if (!localStorage.getItem('KEY_USER_TOKEN')) {
        return this.$router.replace(`/login?redirect=/wish/${this.$route.params.id}`)
      }
      this.$router.push({
        path: `/wish/confirm/${id}`
      })
    },
    shareSuc () {
      this.$vux.toast.text('分享成功', 'bottom')
      this.handleShare()
    },
    handleShare () {
      this.isShowShareBar = !this.isShowShareBar
    },
    toComment (id = null) {
      if (!localStorage.getItem('KEY_USER_TOKEN')) {
        return this.$router.replace(`/login?redirect=/wish/${this.$route.params.id}`)
      }
      setTimeout(() => {
        this.$refs.commentInput.focus()
      }, 300)
      this.isComment = true
      this.parentCommentId = id
    },
    closeComment () {
      this.isComment = false
    },
    sendCMsg () {
      const content = this.cMsg && this.cMsg.trim()
      if (!content) {
        return this.$vux.toast.text('請輸入文字', 'bottom')
      } else if (content.length > 200) {
        return this.$vux.toast.text('最多可以輸入200個字符哦', 'bottom')
      } else {
        if (!this.isSendCMsg) {
          this.$vux.loading.show({
            text: '發佈中'
          })
          this.isSendCMsg = true
          const child = {parent_comment_id: this.parentCommentId}
          let data = {
            content,
            wish_id: this.$route.params.id,
            type: 'wish'
          }
          data = Object.assign({}, child, data)
          this.submitComments({data, cb: this.sendMsgCb})
        }
      }
    },
    sendMsgCb () {
      this.parentCommentId = null
      this.cMsg = null
      const id = this.$route.params.id
      this.closeComment()
      this.isSendCMsg = false
      this.getCommentsList({ id, cb: this.cb2 })
    },
    cb2 () {
      this.$vux.loading.hide()
      this.$vux.toast.text('發佈成功', 'bottom')
    },
    handleClickUser (id) {
      this.$router.push(`/user/${id}`)
    }
  },
  created () {
    this.$vux.loading.show({
      text: '加載中'
    })
    this.location = window.location.href
    const id = this.$route.params.id
    this.getWishItem({ id, cb: this.getCb })
    this.getCommentsList({ id, cb: this.getCb })
    this.sendRead({id})
  }
}
</script>

<style lang="less" scoped>
@import '../../global.mixin.less';
@import './style';
@selected-color: #E2462C;
@card-radius: 4px;
@icon-size: 24px;
@username-margin: 10px;
@avartar-size:28px;
.wrap {
  .g-bg-repeat-y('./assets/img/wishes/wish_pic_bg@2x.png');
  .detail {
    padding: 15px 10px 0 10px;
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
    .card-show {
      .img-wrap {
        height: 300px;
      }
      .content {
        color: #28292B;
        padding: 21px 13px;
        .btn {
          .btn(10px);
        }
        .tools {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
          .view {
            color: #969797;
            font-size: 14px;
          }
          .work {
            display: flex;
            align-items: center;
            .like {
              color: #969797;
              font-size: 14px;
              margin-right: 25px;
              display: table;
              .selected {
                color: @selected-color;
              }
              > img {
                display: table-cell;
                vertical-align: middle;
                width: @icon-size;
                height: @icon-size;
              }
              > span {
                display: table-cell;
                vertical-align: middle;
              }
            }
            .share {
              width: @icon-size;
              height: @icon-size;
              > img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
    .adopter {
      display: flex;
      align-items: center;
      padding: 24px 12px;
      .avatar {
        height: 50px;
        width: 50px;
        > img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        margin-left: 10px;
        .user-name {
          color: #28292B;
          font-size: 18px;
          font-weight: bold;
        }
        .get-time {
          color: #969797;
          font-size: 14px;
        }
      }
    }
    .talk {
      .send {
        color: #969797;
        display: flex;
        align-items: center;
        padding: 10px 0;
        span:nth-child(2) {
          margin-left: 10px;
          width: 24px;
          height: 24px;
          > img {
            width: 100%;
            height: 100%;
          }
        }
        span:nth-child(3) {
          margin-left: 10px;
        }
      }
      .thank-content {
        color: #28292B;
        padding: 15px 0;
      }
      .thank-img {
        max-width: 70%;
        > img {
          width: 100%;
          height: 100%;
        }
      }
      .receiver {
        display: flex;
        flex-direction: row-reverse;
        padding-bottom: 15px;
        color: #969797;
      }
    }
    .chat {
      margin-top: 15px;
      position: relative;
      .user-info {
        display: flex;
        align-items: center;
        .avartar {
          width: @avartar-size;
          height: @avartar-size;
          > img {
            width: 100%;
            height: 100%;
          }
        }
        .username {
          margin-left: @username-margin;
          color: #969797;
        }
      }
      .content {
        margin-left: @username-margin + @avartar-size;
        padding: 10px 0;
      }
      .chat-wrap {
        margin-bottom: 20px;
      }
      .chat-children {
        background-color: #F7F7F7;
        margin-left: 38px;
        padding: 8px 10px;
        font-size: 14px;
        .reply-username {
          color: #FF9600;
          background-color: transparent;
        }
        .reply-content {
          color: #7E807E;
          background-color: transparent;
        }
      }
      .reply-btn {
        position: absolute;
        top: 0;
        right: 0;
        background-color: #E2462C;
        padding: 3px 5px;
        border-radius: 3px;
        color: white;
        font-size: 14px;
      }
    }
  }
  .ask-input {
    /deep/ .weui-dialog__bd {
      height: 100%;
      padding: 0 !important;
      border-radius: 0;
    }
    /deep/ .weui-dialog {
      z-index: 5000;
      width: 100%;
      height: 100%;
      max-width: 100%;
      background-color: #FFFFFF;
      text-align: center;
      border-radius: 0;
;    }
    .box {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: calc(~"100% - 46px");
      background: #f6f6f6;
    }
  }
  .has-no-comments {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #d6d6d6;
    padding: 5px 0;
  }
  .circle-avatar {
    border-radius: 50%;
  }
}
</style>
