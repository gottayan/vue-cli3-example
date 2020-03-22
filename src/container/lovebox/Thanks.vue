<template>
  <!-- 發表感謝的頁面 -->
  <div class="g-block" style="padding: 0">
    <x-header title="發表感謝的話">
    </x-header>
    <div class="lovebox-thanks-wrapper">
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
import ImgUpload from '@/components/ImgUpload.vue'
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
      isThank: false,
      info: {
        thanks: '',
        thanks_image_path: ''
      }
    }
  },
  methods: {
    ...mapActions({
      thanksLovebox: 'thanksLovebox'
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
      if (!this.info.thanks) {
        this.$vux.toast.text('請輸入您的感謝語', 'bottom')
        return
      }
      this.$vux.loading.show({
        text: '感謝中...'
      })
      images.length !== 0 &&
      (this.info.thanks_image_path = images[0].url)
      if (!this.isThank) {
        this.isThank = true
        this.thanksLovebox({
          id: this.$route.params.id,
          data: {...this.info},
          cb: this.thanksLoveboxCb
        })
      }
    },
    thanksLoveboxCb () {
      this.isThank = false
      this.$vux.loading.hide()
      this.$vux.toast.text('發表感謝成功', 'bottom')
      setTimeout(() => {
        this.$router.go(-1)
      }, 1000)
    },
    goBack () {
      this.$router.go(-1)
    }
  },
  created () {
    document.title = '發表感謝的話'
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
  .lovebox-thanks-wrapper{
    height: calc(~"100% - 44px");
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .pad-uploader {
    padding: 0 @pm-bg;
  }
  .pad-stick-bottom {
    position: absolute;
    bottom: 0;
    padding: @pm-bg;
    width: 100%;
    button {
      margin-top: @pm-bg;
    }
  }
  .g-core-image-upload-btn.upload-wrapper {
    margin-left: 0;
  }
</style>
