<template>
  <div class="wrap wish-public-style" id="wrap">
    <div class="header">
      <sticky scroll-box="wrap" :offset="0" :check-sticky-support="false">
        <x-header
          title="Ta要對你說"
        ></x-header>
      </sticky>
      <div class="vux-sticky-fill" style="height:44px;"></div>
    </div>
    <div class="finish-title">
      <h2>{{wishItem.student_name}}小朋友想要對你說</h2>
    </div>
    <div class="card-wrap">
      <div class="card" id="card">
        <div class="img-wrap">
          <img id="card-img"
               height="100%"
               width="100%"
               :src="noCacheImg"
               alt=""
               crossorigin="anonymous">
        </div>
        <div class="content">
          <div class="info">
            <div class="title">
              <h2>
                <span>{{wishItem.student_name}}</span>
                <span>@你</span>
              </h2>
            </div>
            <div class="word">
              <p>{{wishItem.wish_donate && wishItem.wish_donate.greeting}}</p>
            </div>
          </div>
          <div class="footer">
            <div class="img">
              <img :src="loveImg" alt="">
            </div>
            <div class="right">
              <span>心願認養</span>
              <span class="dot"></span>
              <span>贈物網</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btns">
      <div class="share" @click="handleShare">
        <p>分享</p>
      </div>
      <!--<a class="save" id="save-img">-->
        <!--<p>保存</p>-->
      <!--</a>-->
    </div>
    <share-bar
      :url="location"
      title="2018幸福偏鄉感謝卡片"
      :desc="wishItem.desc"
      :image="wishItem.wish_donate && wishItem.wish_donate.greeting_image_path"
      :shareSuc="shareSuc"
      @hideShareBar="handleShare"
      :is-show="isShowShareBar"
    >
    </share-bar>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Sticky } from 'vux'
import { smartImagePath } from '@/tools/ObjectHelper'
import defaultGift from '@/assets/icon/img-default-gift.png'
import loveImg from '@/assets/img/wishes/wish_title_ic_wish@2x.png'
import ShareBar from '@/components/ShareBar'
import html2canvas from 'html2canvas'
import { dataURLtoBlob } from '../../tools/url'
export default {
  components: {
    Sticky,
    ShareBar
  },
  data () {
    return {
      smartImagePath,
      defaultGift,
      loveImg,
      isShowShareBar: false,
      location: '',
      cardImg: '',
      saveHref: '',
      imgSrc: ''
    }
  },
  computed: {
    ...mapState({
      wishItem: state => state.wishes.wishItem,
      userInfo: state => state.user.userInfo
    }),
    noCacheImg () {
      // 时间戳防止缓存
      return this.wishItem.wish_donate ? this.wishItem.wish_donate.greeting_image_path + '?' + +new Date() : ''
    }
    // noTagDesc () {
    //   const reg = /<\/?.+?\/?>/g
    //   return this.wishItem.desc.replace(reg, '')
    // }
  },
  methods: {
    ...mapActions({
      getWishItem: 'getWishItem'
    }),
    shareSuc () {
      this.$vux.toast.text('分享成功', 'bottom')
      this.handleShare()
    },
    handleShare () {
      this.isShowShareBar = !this.isShowShareBar
    },
    // async handleSave () {
    //   const dom = document.querySelector('#card')
    //   const width = dom.clientWidth
    //   const height = dom.clientHeight
    //   const canvas = document.createElement('canvas')
    //   const scale = this.DPR()
    //   canvas.width = width * scale
    //   canvas.height = height * scale
    //
    //   canvas.style.width = width * scale + 'px'
    //   canvas.style.height = height * scale + 'px'
    //   canvas.getContext('2d').scale(scale, scale)
    //
    //   await html2canvas(dom, {
    //     scale,
    //     canvas,
    //     useCORS: true
    //   })
    //   const dataImg = canvas.toDataURL()
    //   const url = URL.createObjectURL(this.dataURLtoBlob(dataImg))
    //   const saveElement = document.createElement('a')
    //   saveElement.download = '明信片.png'
    //   saveElement.href = url
    //   const evt = document.createEvent('MouseEvents')
    //   evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
    //
    //   saveElement.dispatchEvent(evt)
    // },
    DPR () {
      if (window.devicePixelRatio && window.devicePixelRatio > 1) {
        return window.devicePixelRatio
      }
      return 1
    },
    parseValue (value) {
      return parseInt(value, 10)
    },
    async imageLoaded () {
      const dom = document.querySelector('#card')
      const width = dom.clientWidth
      const height = dom.clientHeight
      const canvas = document.createElement('canvas')
      const scale = this.DPR()
      canvas.width = width * scale
      canvas.height = height * scale

      canvas.style.width = width * scale + 'px'
      canvas.style.height = height * scale + 'px'
      canvas.getContext('2d').scale(scale, scale)

      await html2canvas(dom, {
        scale,
        canvas,
        useCORS: true
      })
      const dataImg = canvas.toDataURL()
      if (window.navigator.userAgent.toLowerCase().indexOf('crios') > -1) {
        this.imgSrc = dataImg
      } else {
        this.imgSrc = URL.createObjectURL(dataURLtoBlob(dataImg))
      }
      const saveElement = document.getElementById('save-img')
      saveElement.download = '明信片.png'
      saveElement.href = this.imgSrc
      this.$vux.loading.hide()
    },
    getCb (data) {
      // if (data.wish_donate.user.id !== this.userInfo.id) {
      //   this.$router.push({
      //     path: `/wish/${data.id}`
      //   })
      // }
      this.$vux.loading.hide()
    }
  },
  created () {
    const id = this.$route.params.id
    // if (!localStorage.getItem('KEY_USER_TOKEN')) {
    //   return this.$router.replace(`/login?redirect=/wish/finish/${id}`)
    // }
    this.$vux.loading.show()
    this.getWishItem({ id, cb: this.getCb })
    this.location = window.location.href
  }
}
</script>

<style lang="less" scoped>
@import "./style";
.wrap {
  background-color: #FFFAEA;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-repeat: repeat-y;
  background-size: 100% 100%;
  .finish-title {
    .father-flex-center();
    padding: 20px 0;
    color: #2A2A2A;
  }
  .card-wrap {
    padding: 0 15px 15px 15px;
  }
  .card {
    .card-style();
    padding: 15px 14px 0 14px;
    .img-wrap {
      .img {
        height: 300px;
        width: 100%;
        background-size: 100% 100%;
        background-color: white;
        background-repeat: no-repeat;
      }
    }
    .content {
      color: #28292B;
      padding: 21px 13px;
      .info {
        padding-bottom: 10px;
        border-bottom: 1px dashed #E5E5E5;
        .title {
          padding-bottom: 15px;
        }
        .word {
          padding-bottom: 10px;
        }
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 15px;
        .img {
          width: 32px;
          height: 32px;
          > img {
            width: 100%;
            height: 100%;
          }
        }
        .right {
          color: #969797;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .btns {
    padding: 0 15px 15px 15px;
    display: flex;
    align-items: center;
    margin: 10px 0 20px 0;
    .share,
    .save {
      width: 100%;
    }
    .share {
      .btn(8px, #FFA507);
      /*margin-right: 5px;*/
    }
    .save {
      .btn(8px);
      margin-left: 5px;
    }
  }
}
</style>
