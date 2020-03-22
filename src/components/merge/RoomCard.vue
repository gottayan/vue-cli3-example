<template>
  <div class="wrap" id="mergeRoomCard">
    <transition name="into">
      <div v-show="isOpen">
        <div class="title">合併禮物</div>
        <div class="content">
          <div :key="index" class="item" v-for="(item, index) in items">
            <div class="left">
              <img @click="toItem(item.gift_id)" :src="item.gift.image_path || defaultGift" alt="">
              <div @click="toItem(item.gift_id)">{{item.gift.title}}</div>
            </div>
            <div style="display: flex;">
              <div class="middle" v-if="statusMapStep(detail.status) >= 128">
                <x-button
                  :disabled="item.status === 'thanks'"
                  @click.native.stop="handleThanks(item.id)"
                  class="btn"
                  mini
                  type="primary"
                >
                  {{item.status === 'thanks' ? '已感謝' : '去感謝'}}
                </x-button>
              </div>
              <div class="right">x{{item.quantity}}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="toggle" :class="isOpen ? 'close' : 'open'" @click="handleToggle">
      <img :src="openPic" alt="">
    </div>
  </div>
</template>

<script>
import openPic from '@/assets/icon/icon-merge-open.png'
import defaultGift from '@/assets/icon/img-default-gift.png'
import { XButton } from 'vux'
import { statusMapStep } from '@/tools/strMap'
import { statusMap } from '@/tools/constant'

export default {
  components: {
    XButton
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      openPic,
      defaultGift,
      isOpen: true,
      curHeight: 0,
      statusMapStep,
      statusMap
    }
  },
  watch: {
    isOpen (val) {
      setTimeout(() => {
        const dom = document.getElementById('console-chatroom')
        if (val) {
          dom.style.height = `calc(100% - 104px - ${this.curHeight}px)`
          dom.style.marginTop = `${this.curHeight}px`
        } else {
          dom.style.height = `calc(100% - 104px - 31px)`
          dom.style.marginTop = `31px`
        }
      }, 0)
    }
  },
  methods: {
    handleToggle () {
      this.isOpen = !this.isOpen
      if (!this.isOpen) {
        const merge = document.getElementById('mergeRoomCard')
        this.curHeight = merge.clientHeight
      }
    },
    handleThanks (id) {
      return this.$router.push(`/thanksItem/${id}`)
    },
    toItem (id) {
      return this.$router.push(`/gift/${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
  .wrap {
    background-color: #fff;
    border-top: 1px dashed #CCCCCC;
    padding: 5px 0;
    position: absolute;
    width: 100%;
    .into-enter, .into-leave-to {
      height: 0;
    }
    .title {
      text-align: center;
      font-size: 14px;
    }
    .content {
      margin: 0 20px;
      max-height: 130px;
      overflow: scroll;
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 3px 0;
        .left {
          > img {
            display: inline-block;
            vertical-align: middle;
            width: 30px;
            height: 30px;
          }
          > div {
            display: inline-block;
            vertical-align: middle;
          }
        }
        .right {
          color: #cccccc;
        }
      }
    }
    .toggle {
      text-align: center;
      height: 20px;
      > img {
        height: 20px;
      }
    }
    .open {
      transform: rotate(0);
    }
    .close {
      transform: rotate(180deg);
    }
    .btn{
      margin: 0;
      padding:0;
      width: 50px;
      height: 26px;
      font-size: @font-S3;
      line-height: 1;
      background: @color-CR;
      margin-right: 20px;
      &[disabled]{
        background: @color-DSA;
      }
    }
  }
</style>
