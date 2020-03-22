<template>
  <div class="share-bar">
    <transition name="fade" @touchmove.stop.prevent>
      <div class="menu-mask" v-show="isShow" @click="hideShareBar"></div>
    </transition>

    <transition name="side">
      <div v-show="isShow" class="menu-content">
        <div class="share-container">
          <fb-share
            :type="type"
            :url="url"
            :title="title"
            :desc="desc"
            :image="image"
            :shareSuc="shareSuc"
          >
          </fb-share>
          <line-share
            :type="type"
            :isCover="isCover"
            :url="url"
            :title="title"
            :desc="desc && desc.slice(0, 100)"
            :image="image"
            :shareSuc="shareSuc"
          ></line-share>
        </div>
        <div class="close-btn">
          <img @click="hideShareBar" width="44" height="44" :src="iconClose" alt="close">
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import iconClose from '@/assets/icon/itemDetail/gift_share_ic_close_normal@2x.png'
import FbShare from '@/components/FbShare'
import LineShare from '@/components/LineShare'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    image: {
      type: String
    },
    title: {
      type: String
    },
    desc: {
      type: String,
      default: ''
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
  components: {
    FbShare,
    LineShare
  },
  data () {
    return {
      iconClose
    }
  },
  methods: {
    // 显示菜单
    hideShareBar () {
      this.$emit('hideShareBar')
    }
  }
}
</script>

<style lang="less" scoped>
  .share-bar{
    .menu-mask{
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      opacity: 1;
      z-index: 9998;
      background: rgba(0,0,0,0.5);
      transform: translateZ(0);
      &.fade-enter-to, &.fade-leave-to{
        transition: opacity 0.3s;
      }
      &.fade-enter, &.fade-leave-to{
        opacity: 0;
      }
    }
    .menu-content{
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 9999;
      padding-top: 30px;
      width: 100%;
      border-radius: 8px 8px 0 0;
      background: #FFF;
      .share-container{
        display: flex;
        justify-content: space-around;
      }
      .close-btn{
        display: flex;
        justify-content: center;
        margin: @pm-md 0;
      }
      &.side-enter-to, &.side-leave-to{
        transition: transform 0.3s;
      }
      &.side-enter, &.side-leave-to{
        transform:translate3d(0, 186px, 0);
      }
    }
  }
</style>
