<template>
  <div class="v-id-container">
    <x-header :title="$route.meta.title"></x-header>
    <div v-if="step === 0" class="v-id-step v-step-first">
      <div class="g-desc">
        請上傳您的身分證件正反面檔案，以下附加檔案僅供站方審核，絕不對外公開，並由系統自動加上「限贈物網驗證使用」之浮水印，請放心上傳。
      </div>
      <section class="v-id-section">
        <div class="g-title">身份證檔案上傳（正面）</div>
        <img-upload
          :imgloaded="(data) => imgloaded(data, 'front')"
          :removeImg="removeImg"
          :isLoaded="img.front.isImgLoaded"
          :imgList="img.front.url"
          :maxLength="1"
          @upLoading="upLoadingImg('front')"
        >
        </img-upload>
      </section>
      <section class="v-id-section">
        <div class="g-title">身份證檔案上傳（反面）</div>
        <img-upload
          :imgloaded="(data) => imgloaded(data, 'back')"
          :removeImg="removeImg"
          :isLoaded="img.back.isImgLoaded"
          :imgList="img.back.url"
          :maxLength="1"
          @upLoading="upLoadingImg('back')"
        >
        </img-upload>
      </section>
      <button class="v-id-btn g-button red" @click="handleSubmit">確認</button>
    </div>
    <div v-else-if="step === 1" class="v-id-step v-step-second">
      <result-page
        :menus="[{
          text: '返回',
          func: () => {
            this.$router.go(-1)
          },
          type: 'primary'
        }]"
        title="驗證成功"
        desc=""
      >
        <div slot="desc" class="resultpage-desc">
          已完成驗證無法直接修改，如需修改請聯繫客服
        </div>
      </result-page>
    </div>
    <div v-else class="v-id-step v-step-third">
      <result-page
        :menus="[{
          text: '返回',
          func: () => {
            this.$router.go(-1)
          },
          type: 'primary'
        }]"
        title="申請成功"
        desc=""
      >
        <div slot="desc" class="resultpage-desc">
          您的實名驗證資料已成功送出，待站方審核通過後，將於您的個人頁面顯示驗證通過圖示，審核期間如無其他問題請勿重複申請，感謝您的配合～
        </div>
      </result-page>
    </div>
  </div>
</template>

<script>
import ResultPage from '@/components/ResultPage'
import ImgUpload from '@/components/ImgUpload'
export default {
  components: {
    ResultPage,
    ImgUpload
  },
  data () {
    return {
      step: 0,
      img: {
        front: {
          isImgLoaded: false,
          url: []
        },
        back: {
          isImgLoaded: false,
          url: []
        }
      }
    }
  },
  methods: {
    handleSubmit () {
      if (this.img.front.url.length && this.img.back.url.length) {
        this.$store.dispatch('confirmVerifyName', {
          idImage: this.img.front.url[0].url,
          docImage: this.img.back.url[0].url,
          cb: (data) => {
            if (data.error) {
              console.log('verify id fail and error is', data)
              this.$vux.toast.text('用戶實名驗證失敗', 'bottom')
            } else {
              this.step = 2
            }
          }
        })
      } else {
        this.$vux.toast.text('請上傳身份證正/反檔案', 'bottom')
      }
    },
    removeImg () {
      console.log('remove img')
    },
    upLoadingImg (type) {
      console.log('loading...')
      // this.isImgLoaded = true
      this.img[type].isImgLoaded = true
    },
    imgloaded (data, type) {
      console.log(type)
      console.log(data)
      this.img[type].isImgLoaded = false
      this.img[type].url = [data]
    }
  },
  created () {
    const flag = this.$store.state.user.userInfo.veriPpl === 'Y'
    if (flag) {
      this.step = 1
    }
  }
}
</script>

<style lang="less">
  .v-id-container{
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  .v-id-step{
    padding: 25px 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .v-id-section{
    margin-top: 25px
  }

  .v-id-btn{
    margin-top: 20px;
  }
</style>
