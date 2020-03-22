<template>
  <div class="userGives-container user-wishes">
    <tab :line-width="1">
      <tab-item
        v-for="(tab, index) in userWishesNavList"
        :key="index"
        :selected="index === idx"
        @on-item-click="toggleGiftsTabItem"
      >
        {{tab.text}}
      </tab-item>
    </tab>
    <swiper v-model="idx" height="100px" :show-dots="false">
      <swiper-item v-for="(item, index) in userWishesNavList" :key="index">
        <div class="tab-swiper vux-center">{{item.text}} Container</div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Tab, TabItem, Swiper, SwiperItem } from 'vux'
import { userWishesNavList } from '@/tools/constant'
export default {
  components: {
    Tab,
    TabItem,
    Swiper,
    SwiperItem
  },
  data () {
    return {
      userWishesNavList,
      idx: 0
    }
  },
  methods: {
    toggleGiftsTabItem (idx) {
      this.idx = idx
    }
  }
}
</script>

<style lang="less">
.user-wishes{
  .weui-cells {
    border-bottom: 1px solid @color-CL;
    .weui-cell {
      padding-left: 0;
      padding-right: 0;
      font-size: @font-S2;
    }
    &:before {
      display: none;
    }
    &:after {
      width: 0;
      transition: width .4s;
    }
    &:hover {
      &:after {
        width: 100%;
        background-color: @color-CR;
        margin: 0 auto;
        height: 4px;
        bottom: -1px;
      }
    }
  }

  .vux-tab{
    box-sizing: content-box;
  }
}
</style>
