<template>
  <div class="FathersDayRelease">
    <x-header>發佈</x-header>
    <div class="container">
      <div class="main">
        <x-input
          v-model="signature"
          :max="5"
          placeholder="你的名字"
          class="ipt-signature"
        ></x-input>
        <x-input
          v-model="address"
          :max="40"
          placeholder="輸入收件地址（不公開）"
          class="ipt-address"
        ></x-input>
        <textarea
          :max="80"
          placeholder="寫下給選手鼓勵的話吧~（80個字內）"
          v-model="content"
        ></textarea>
        <div class="banner">
          <div class="bannerDetailed2">
            <img-upload
              :maxLength="1"
              :imgloaded="imgloaded"
              :removeImg="removeImg"
              :isLoaded="isImgLoaded"
              :imgList="imgList"
              @upLoading="upLoadingImg"
            >
              <div slot="uploadIcon">
                <img src="../../assets/img/father/issue_ic_add_normal@3x.png" alt="">
              </div>
            </img-upload>
          </div>
        </div>
        <div class="g-desc important">*上傳的內容將有機會在比賽中展出</div>
        <div class="g-desc important">*若有填地址，將在開賽前收到您專屬的運動明信片</div>
        <div class="btn-release" @click="handleSubmit">
          <img src="../../assets/img/father/issue_btn_issue_normal@3x.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { FATHERSDAY_ENDTIME } from '@/tools/constant'
import { SPORTSDAY_ENDTIME } from '@/tools/constant'
import ImgUpload from '@/components/ImgUpload'
import { mapState } from 'vuex'

const FESTIVAL_ID = 3

export default {
  components: {
    ImgUpload
  },
  data () {
    return {
      content: '',
      image: '',
      image_id: '',
      signature: '',
      address: '', // 用戶參與活動的收件地址
      imgList: [],
      isImgLoaded: false,
      isLoading: false,
      isEnd: false
    }
  },
  computed: {
    ...mapState({
      verifyPhone: state => state.user.userInfo.veriCell === 'Y',
      others: state => state.user.userInfo.others
    })
  },
  watch: {
    others (newValue, oldValue) {
      if (!this.address && newValue && newValue.addresses && newValue.addresses.rcvs) {
        const { city, district, address } = newValue.addresses.rcvs
        this.address = `${city}${district}${address}`
      }
    }
  },
  methods: {
    removeImg () {
      this.imgList = []
    },
    upLoadingImg () {
      this.isImgLoaded = true
    },
    imgloaded (data) {
      this.imgList = [{url: data.url, id: data.id}]
      this.isImgLoaded = false
    },
    handleSubmit () {
      if (this.isEnd) {
        return this.$vux.toast.text('活動已結束，感謝您的參與~', 'bottom')
      }

      if (this.isLoading) {
        return this.$vux.toast.text('發佈中...請稍後', 'bottom')
      }

      if (!this.content) {
        return this.$vux.toast.text('請寫下你給選手鼓勵的話~', 'bottom')
      }
      if (!this.signature) {
        return this.$vux.toast.text('請寫下你的名字', 'bottom')
      }
      if (!this.imgList.length) {
        return this.$vux.toast.text('請上傳圖片', 'bottom')
      }
      this.isLoading = true

      const bundle = {
        content: this.content,
        signature: this.signature,
        image: this.imgList[0].url,
        image_id: this.imgList[0].id,
        receive_address: this.address,
        festival_id: FESTIVAL_ID
      }
      this.$store.dispatch('sendRecord', {
        bundle,
        cb: (data) => {
          this.isLoading = false
          if (data.error === 'NOT_VERIFY') {
            this.$vux.toast.show({
              text: '完成手機快捷驗證，可參加活動及贈送索取物品，4秒後自動為您跳轉',
              position: 'bottom',
              time: 4000,
              type: 'text',
              width: '11em'
            })
            setTimeout(() => {
              this.$router.replace('/verifycellphone')
            }, 4500)
            return
          }
          if (data.error) {
            return this.$vux.toast.text(data.error, 'bottom')
          }
          // this.content = ''
          // this.signature = ''
          // this.address = ''
          // this.image = ''
          // this.image_id = ''
          // this.$vux.toast.text('發佈成功, 3秒後即將離開當前頁面', 'bottom')
          this.$vux.toast.show({
            text: '感謝您的參與，歐旻基金會替你捐出50元，支持 〈台灣的第一場地板滾球國際積分賽事〉 ！',
            position: 'bottom',
            type: 'text',
            width: '11em',
            time: 3000
          })
          setTimeout(() => {
            this.$router.replace(`/sportsday/${data.no}`)
          }, 4000)
        }
      })
    },
    joined (data) {
      if (this.isEnd) {
        this.$vux.toast.text('活動已結束，感謝您的參與~', 'bottom')
      } else {
        this.$vux.toast.text('您已參與本次活動，不可重複參與，去給喜歡的作品送愛心吧~', 'bottom')
      }
      setTimeout(() => {
        this.$router.replace(`/sportsday/${data.no}`)
      }, 3000)
    }
  },
  mounted () {
    this.isEnd = new Date() - new Date(SPORTSDAY_ENDTIME) >= 0
    this.$store.dispatch('getMyFestivalInfo', {
      options: {
        festival_id: FESTIVAL_ID
      },
      cb: (data) => {
        if (data.records && data.records.length) {
          this.joined(data.records[0])
        }
      }
    })
  }
}
</script>

 <style lang="less">
 @import './style.less';
 .FathersDayRelease{
   .weui-cells{
     margin-top: 0;
   }
 }
 </style>
<style lang="less" scoped>
  .FathersDayRelease{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .container {
      padding: 10px 0;
      width: 100%;
      height: 100%;
      background: url(../../assets/img/father/com_pic_bg@3x.png);
      .main{
        background-color: #fff;
        width: 95%;
        height: 100%;
        margin: 0 auto;
        padding: 0 15px;
        border-radius: 5px;
        .ipt-signature,
        .ipt-address{
          border-bottom: 1px dashed #989898;
        }
        textarea{
          display: block;
          width: 100%;
          height: 200px;
          outline: none;
          padding: 10px 15px;
          border: 0;
          border-bottom: 1px dashed;
          color: #989898;
          position: relative;
          font-size: @font-S2;
          resize: none;
          &::-webkit-input-placeholder {
            color: @color-DSA;
          }
          &:before{
            content: '';
            background: url('../../assets/img/father/issue_ic_edit@3x.png') no-repeat  center center;
            background-size: contain;
            display: block;
            position: absolute;
            width: 14px;
            height: 12px;
          }
        }
        .banner{
          display: flex;
          overflow: hidden;
          margin-top: 20px;

          .bannerDetailed1,
          .bannerDetailed2,{
            width: 33%;
            &:first-of-type{
            margin-right: 10px;
            }
            &:nth-of-type(2){
            margin-right: 10px;
            }
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
        .btn-release{
          width: 90%;
          left: 50%;
          position:fixed;
          bottom: 5%;
          transform: translate(-50%, 0);
          img{
            width: 100%;
            display: block;
            margin: 0 auto;
          }
        }
      }
    }
  }
</style>
