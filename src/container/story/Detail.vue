<template>
  <div class="story-detail-container g-smooth">
    <sticky :offset="0">
      <x-header
        :title="$route.meta.title"
        @on-click-title="goTop">
      </x-header>
    </sticky>
    <article
      class="story-detail-content-wrapper"
      v-if="data.title">
      <h2 class="title">{{data.title}}</h2>
      <span class="author-wrapper">
        <span class="author">
          <img class="user-pic" :src="data.user.pics" alt="">
          {{data.user.nickname || '無暱稱'}}
        </span>
        <span class="time">
          <img
            width="18"
            src="../../assets/icon/itemDetail/gift_list_ic_plan@2x.png"
            alt="">
          <span>{{data.created_at}}</span>
        </span>
      </span>
      <img
        v-if="data.image"
        class="main-img"
        width="100%"
        :src="data.image"
        alt="">
      <div
        class="story-detail-content story-scoped-content"
        v-html="data.content">
      </div>
    </article>
    <div class="story-detail-loading" v-else>
      <spinner type="lines">
      </spinner>
      載入中...
    </div>
    <div class="story-detail-type">
      <div class="story-detail-type_item">
        <icon name="story_type" :scale="1.5" />
        <span>
          文章分類：{{data.category_id | storyType}}
        </span>
      </div>
      <div class="story-detail-type_item">
        <img src="@/assets/icon/comment/sendFlowers.png" alt="" width="30">
        <span class="story-voteup">送花（{{data.vote_up}}）</span>
      </div>
    </div>
    <div class="story-detail-comments">
      <template v-if="comments.length">
        <div
          class="story-detail-comment-item"
          v-for="item in comments" :key="item.id">
          <div class="comment-item-row">
            <span class="comment-item-username" @click="toUserDetail(item.user_id)">
              <img :src="item.user.pics || UserDefault" alt="">
              {{item.user.nickname || '無暱稱'}}
            </span>
            <span class="comment-item-time">{{item.created_at}}</span>
          </div>
          <div class="comment-item-row">
            {{item.content}}
          </div>
          <div v-if="item.user_id === $store.state.user.userInfo.id"
            class="comment-item-row delete-btn"
            @click="onDeleteComment(item.id)"
          >
            刪除
          </div>
        </div>
      </template>
      <divider v-else>暫無評論</divider>
    </div>

     <div v-transfer-dom>
      <popup v-model="isVisible">
        <div class="popup2">
          <x-textarea v-model="content">
          </x-textarea>
        </div>
      </popup>
    </div>
    <div class="publish-comment">
      <group class="content">
        <x-input title="" placeholder="輸入評論" @on-focus="toComment('comment', null, '')" class="weui-vcode">
          <img slot="right-full-height" src="../../assets/icon/comment/sendFlowers.png" @click="sendLike">
          <img slot="right-full-height" src="../../assets/icon/comment/share.png" @click="toggleShareBar(true)">
        </x-input>
      </group>
    </div>
    <confirm
      class="message-confirm message-input"
      v-model="isComment"
      hide-on-blur
      theme="android">
      <x-header
        title="評論"
        :left-options="{
          preventGoBack: true,
          backText: '關閉'
        }"
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
            class="g-button red btn-story-comment"
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
    <div v-transfer-dom>
      <confirm v-model="deleteCommentModalShow"
               title="提示：即將刪除該評論"
               @on-confirm="onDeleteCommentConfirm"
               confirm-text="確定"
               cancel-text="取消"
      >
      </confirm>
    </div>
    <share-bar
      isCover
      :url="location"
      :title="data.title"
      :desc="data.summary"
      :image="data.image"
      :shareSuc="shareSuc"
      @hideShareBar="toggleShareBar(false)"
      :is-show="isShowShareBar">
    </share-bar>
  </div>
</template>

<script>
import { TransferDom, Divider, XTextarea, Spinner, Popup, Sticky, Confirm } from 'vux'
import goTopMixin from '@/mixins/goTop'
import UserDefault from '@/assets/img/default-sticker.jpg'
import ShareBar from '@/components/ShareBar'
import { mapActions } from 'vuex'
export default {
  mixins: [goTopMixin],
  directives: {
    TransferDom
  },
  components: {
    Sticky,
    Spinner,
    Popup,
    Divider,
    XTextarea,
    ShareBar,
    Confirm
  },
  data () {
    return {
      isVisible: false,
      content: '',
      UserDefault,
      isShowShareBar: false,
      location: '',
      isComment: false,
      cPlaceHolder: '請輸入評論',
      cMsg: '',
      deleteCommentModalShow: false,
      deleteCommentId: ''
    }
  },
  computed: {
    data () {
      return this.$store.state.story.storyDetail
    },
    comments () {
      return this.$store.state.story.comments.data
    }
  },
  methods: {
    ...mapActions({
      submitMsg: 'submitMsg',
      getCMsg: 'getCMsg',
      voteUpStory: 'voteUpStory',
      deleteComment: 'deleteComment'
    }),
    sendComment () {},
    sendLike () {
      if (this.data.my_vote) {
        return this.$vux.toast.text('您已送過花啦~', 'bottom')
      }
      this.voteUpStory({
        id: this.$route.params.id,
        cb: (data) => {
          if (!data.error) {
            this.$vux.toast.text('送花成功', 'bottom')
          }
        }
      })
    },
    // 分享成功
    shareSuc () {
      this.$vux.toast.text('分享成功', 'bottom')
      this.toggleShareBar(false)
    },
    // 分享
    toggleShareBar (flag) {
      this.isShowShareBar = flag
    },
    // 打开評論输入框
    toComment (cType = 'comment', id = null, name = '') {
      if (!localStorage.getItem('KEY_USER_TOKEN')) {
        return this.$router.replace('/login')
      }
      setTimeout(() => {
        this.$refs.commentInput.focus()
      }, 300)
      this.isComment = true
      this.parentCommentId = id
      this.cType = cType
      this.cPlaceHolder = name ? `回覆${name}` : '請輸入評論'
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
            story_id: this.$route.params.id,
            type: 'story',
            [`parent_${this.cType}${this.cType === 'thank' ? 's' : ''}_id`]: this.parentCommentId
          }
          this.submitMsg({cType: this.cType, data, cb: this.sendMsgCb})
        }
      }
    },
    sendMsgCb () {
      this.isSendCMsg = false
      // this.$refs.commentInput.reset()
      this.cMsg = ''
      this.isComment = false
      this.$vux.toast.text('評論成功~', 'bottom')
      this.getCMsg({
        type: 'gift',
        cType: this.cType,
        perPage: 20,
        id: this.$route.params.id,
        cb: this.getCommentCb
      })
    },
    getCommentCb () {
      return this.$store.dispatch('getStoryDetail', {id: this.$route.params.id})
    },
    toUserDetail (id) {
      if (id) {
        this.$router.push(`/user/${id}`)
      }
    },
    onDeleteComment (id) {
      this.deleteCommentModalShow = true
      this.deleteCommentId = id
    },
    onDeleteCommentConfirm () {
      this.deleteComment({
        id: this.deleteCommentId,
        cb: (data) => {
          if (!data.error) {
            this.$vux.toast.text('刪除成功', 'bottom')
          } else {
            this.$vux.toast.text('刪除失敗', 'bottom')
          }
        }
      })
      this.deleteCommentId = ''
    }
  },
  created () {
    this.$store.dispatch('getStoryDetail', {id: this.$route.params.id})
    this.location = window.location.href
  }
}
</script>

<style lang="less">
.story-scoped-content{
  img{
    max-width: 100%;
    vertical-align: middle;
  }
  p{
    margin: 20px 0;
    text-align: justify;
  }

  iframe{
    max-width: 100%;
  }
}
.story-detail-container{
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
  }
}
</style>

<style lang="less" scoped>
  .story-detail-container{
    height: 100%;
    overflow-y: scroll;
  }
  .story-detail-loading{
    text-align: center;
    margin: 20px 0;
  }
  .desc{
    color: @color-font-C2;
    font-size: @font-S1;
  }
  .story-detail-content-wrapper{
    padding: 0 15px;
    margin-bottom: 20px;
  }

  .title{
    font-size: 20px;
    margin: 30px 0 10px;
  }
  .author-wrapper{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 15px;
    margin-bottom: 10px;
    border-bottom: 1px solid @color-CBG;
    .author,.time{
      // .desc;
      color: @color-font-C2;
      font-size: @font-S3;
    }

    .author{
      display: flex;
      align-items: center;
    }
    .time *{
      vertical-align: middle;
    }
  }

  .main-img{
    width: 100%;
    display: block;
    margin-top: 20px;
  }

  .story-detail-type{
    color: @color-font-C2;
    font-size: @font-S3;
    padding: 0 15px;
    margin-bottom: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .story-detail-type_item{
      display: flex;
      align-items: center;
    }
    .story-voteup{
      color: @color-font-CR;
    }
  }
  .user-pic{
    width: 30px;
    border-radius: 50%;
    overflow: hidden;
  }
  .story-detail-content{
    width: 100%;
  }

  .story-detail-comments{
    padding: 0 15px;
  }

  .story-detail-comment-item{
    padding: 15px 0;
    border-top: 1px solid #eee;
    overflow: hidden;
    &:last-child{
      margin-bottom: 70px;
    }
  }

  .comment-item-row{
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    flex:1;
    word-wrap: break-word;
    word-break: normal;
    &+&{
      margin-top: 10px;
    }
  }

  .delete-btn {
    float: right;
    background-color: #D4554F;
    padding: 2px 8px;
    color: #fff;
    border-radius: 5px;
  }

  .comment-item-username{
    color: @color-CR;
    img{
      width: 36px;
      height: 36px;
      overflow: hidden;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 5px;
    }
  }
  .comment-item-time{
    color: @color-font-C3;
  }
  .publish-comment {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .btn-story-comment{
    display: block;
    margin: 15px auto 0;
    width: 95%;
  }
</style>
