<template>
  <div class="line-share-container">
    <img src="@/assets/icon/itemDetail/gift_share_ic_line_normal@2x.png" class="btn-line__fake" alt="" @click="share">
    <span class="btn-line-name">Line</span>
    <!-- <div class="line-it-button" data-lang="zh_Hant" data-type="share-d" :data-url="url" style="display: none;"></div> -->
  </div>
</template>

<script>
import {domain} from '@/tools/AppConfig'
import { mapActions } from 'vuex'

export default {
  name: 'line-share-btn',
  props: {
    title: {
      type: String
    },
    desc: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: 'https://m.give543.com/static/ogimgsmall.jpg'
    },
    shareSuc: {
      type: Function
    },
    url: {
      type: String
    },
    isCover: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    }
  },
  computed: {
    href () {
      if (this.type === 'sportsday') {
        return `${this.desc}${this.url}`
      }
      if (this.isCover) {
        return `分享給你一篇文章：${this.title}，點擊連接查看詳情${this.url}`
      }
      return `${window.location.protocol}//${domain}/share.php?image=${encodeURI(this.image)}&description=${this.desc.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '') || ''}&title=${this.title}&url=${this.url}&type=article`.replace(/ /g, '%20')
    }
  },
  methods: {
    ...mapActions({
      getShareUrl: 'getShareUrl'
    }),
    share () {
      this.getShareUrl({
        para: {
          // description: this.desc.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ''),
          url: this.url,
          title: this.title,
          image: encodeURI(this.image)
        },
        cb: data => {
          window.open(`line://msg/text/${data.url}`, '_blank')
        }
      })
    }
  }
  // created () {
  //   const node = document.createElement('script')
  //   node.src = 'https://d.line-scdn.net/r/web/social-plugin/js/thirdparty/loader.min.js'
  //   node.async = 'async'
  //   node.defer = 'defer'
  //   document.body.appendChild(node)
  // }
}
</script>

<style lang="less" scoped>
  .line-share-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    iframe{
      position: absolute!important;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      z-index: 2;
      width: 100%!important;
      height: 100%!important;
      opacity: 0!important;
    }
  }

  .btn-line__fake{
    width: 66px;
    height: 66px;
    position: relative;
    top: 3px;
  }

  .btn-line-name{
    margin-top: 15px;
    font-size: @font-S2;
  }
</style>
