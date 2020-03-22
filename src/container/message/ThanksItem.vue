<template>
  <!-- 發表感謝的頁面 -->
  <div class="g-block message-thanks-item" style="padding: 0">
    <x-header title="感謝">
    </x-header>
    <div class="content">
      <div class="pad-thanks-panel">
        <div class="pad-thanks">
          <x-textarea
            :max="200"
            name="description"
            v-model="info.thanks"
            placeholder="請輸入您想感謝的話">
          </x-textarea>
        </div>
        <div class="pad-uploader">
          <img-upload
            type="gift"
            :imgloaded="imgloaded"
            :removeImg="removeImg"
            :isLoaded="isImgLoaded"
            :imgList="images"
            :maxLength="1"
            @upLoading="upLoadingImg"
          >
          </img-upload>
        </div>
      </div>
      <div class="pad-stick-bottom">
        <button class="g-button red" @click="doThanks">
          確認發送
        </button>
        <button class="g-button blank red" @click="goBack">
          稍後再寫
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import ImgUpload from './../../components/ImgUpload.vue'
import GiftAPI from './../../store/apis/gift'
import NeedAPI from './../../store/apis/need'
import { XTextarea } from 'vux'
import {mapActions} from 'vuex'

export default {
  components: {
    ImgUpload,
    XTextarea
  },
  data () {
    return {
      isImgLoaded: false,
      images: [],
      info: {
        thanks: '',
        thanks_image_path: ''
      },
      chatroom_id: ''
    }
  },
  methods: {
    ...mapActions({
      getMyDemands: 'getMyDemands'
    }),
    upLoadingImg () {
      this.isImgLoaded = true
    },
    imgloaded (data) {
      this.images.push(data)
      this.isImgLoaded = false
    },
    removeImg (i) {
      this.images.splice(i, 1)
    },
    doThanks () {
      const { images } = this
      const { type } = this.$route.query
      const { id } = this.$route.params
      if (!this.info.thanks) {
        this.$vux.toast.text('請輸入您的感謝語', 'bottom')
        return
      }
      this.$vux.loading.show({
        text: '感謝中...'
      })
      images.length !== 0 &&
      (this.info.thanks_image_path = images[0].url)
      if (type === 'need') {
        this.info.need_donate_id = id
        NeedAPI.thanksNeed(this.info, () => {
          this.$vux.loading.hide()
          this.goBack()
        })
      } else {
        this.info.gift_request_id = id
        GiftAPI.thanksGift(this.info, () => {
          this.$vux.loading.hide()
          this.goBack()
        })
      }
    },
    goBack () {
      if (this.chatroom_id) {
        return this.$router.push(`/chatroom/${this.chatroom_id}`)
      }
      return this.$router.go(-1)
    }
  },
  created () {
    document.title = '發表感謝的話'
    const { chatroom_id: chatroomId } = this.$route.query
    this.chatroom_id = chatroomId
  }
}
</script>
<style lang="less" scoped>
  @import './../../global.style.less';
  .pad-thanks {
    padding: @pm-bg;
    background-color: white;
    margin-bottom: @pm-bg;
    .weui-cell {
      padding: 0;
    }
    textarea {
      padding: 0!important;
    }
  }
  .pad-uploader {
    padding: 0 @pm-bg;
  }
  .g-core-image-upload-btn.upload-wrapper {
    margin-left: 0;
  }
  .message-thanks-item{
    height: 100%;
    .content{
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: calc(~"100% - 44px");
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }
    .pad-stick-bottom {
      padding: @pm-bg;
      width: 100%;
      button {
        margin-top: @pm-bg;
      }
    }
  }
</style>
