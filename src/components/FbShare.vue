<template>
  <div @click="share" class="share-facebook">
    <img width="66" height="66" :src="iconFacebook" alt="iconFacebook">
    <span class="name">Facebook</span>
  </div>
</template>

<script>
import configs from '@/tools/configs'
// import { domain } from '@/tools/AppConfig'
import iconFacebook from '@/assets/icon/itemDetail/gift_share_ic_facebook_normal@2x.png'
import { mapActions } from 'vuex'
// import {smartImagePath} from '@/tools/ObjectHelper'

window.fbAsyncInit = () => {
  /* eslint-disable */
  FB.init({
    appId: configs.facebookAppID,
    cookie: true,
    xfbml: true,
    version: 'v2.8'
  })
  /* eslint-disable */
}

(function (d, s, id) {
  let js
  const fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) return
  js = d.createElement(s)
  js.id = id
  js.src = 'https://connect.facebook.net/en_US/sdk.js'
  fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'facebook-jssdk'))

export default {
  data () {
    return {
      iconFacebook
    }
  },
  props: {
    title: {
      type: String
    },
    desc: {
      type: String
    },
    image: {
      type: String
    },
    shareSuc: {
      type: Function
    },
    url: {
      type: String
    },
    type: {
      type: String
    }
  },
  created () {
    // this.initShareImage()
  },
  methods: {
    ...mapActions({
      getShareUrl: 'getShareUrl'
    }),
    share () {
      // let href = `${window.location.protocol}//${domain}/share.php?image=${image}&description=${desc || ''}&title=${title}&url=${this.url}`
      // if (this.type === 'sportsday') {
      //   href = ``
      // }
      /* eslint-disable */
      this.getShareUrl({
        para: {
          title: this.title,
          // description: this.desc,
          image: this.image,
          url: this.url,
        },
        cb: data => {
          let href = data.url
          console.log(href, '分享链接 href')
            FB.ui({
              method: 'share',
              href
            }, (response) => {
              if (response.constructor === Array) {
                this.shareSuc()
              } else {
                this.$vux.toast.text('分享失敗,請稍後重試', 'bottom')
              }
            })
        }
      })
      /* eslint-disable */
    }
    // initShareImage () {
    //   const shareImageMeta = document.getElementsByClassName('share-img')[0]
    //   if (shareImageMeta) {
    //     shareImageMeta.setAttribute('content', this.image)
    //   } else {
    //     const oMeta = document.createElement('meta')
    //     oMeta.property = 'og:image'
    //     oMeta.setAttribute('content', this.image)
    //     oMeta.setAttribute('property', 'og:image')
    //     oMeta.setAttribute('class', 'share-img')
    //     document.getElementsByTagName('head')[0].appendChild(oMeta)
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
  .share-facebook{
    display: flex;
    flex-direction: column;
    img {
      position: relative;
      top: 3px;
    }
    .name{
      margin-top: @pm-bg;
      font-size: @font-S2;
    }
  }
</style>
