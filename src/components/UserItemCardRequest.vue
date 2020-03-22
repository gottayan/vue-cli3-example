<template>
  <div class="item-card" v-if="cardInfo">
    <div class="item-card-top">
      <div
        class="pic"
        :style="{backgroundImage: `url(${smartImagePath(cardInfo.image_path) || (poolType === 'need' ? defaultNeed : defaultGift)})`}"
      >
        <img v-if="cardInfo.left && !!cardInfo.is_new" class="tag" width="18" height="30" :src="picLabelNew" alt="picLabelNew">
        <img v-if="!cardInfo.left" class="tag" width="18" height="30" :src="picLabelSend" alt="picLabelSend">
      </div>
      <div class="info">
        <div class="title">{{cardInfo.title}}</div>
        <div class="info-wrapper">
          <span class="pullOff">
            <i class="title">日期：</i>
            <i class="content">{{time}}</i>
          </span>
          <span class="donate">
            <i class="title">贈送者：</i>
            <i class="content">{{cardInfo.user.nickname}}</i>
          </span>
        </div>
      </div>
      <!--<span class="num">{{poolType === 'need' ? '數量' : '剩餘'}}：<i>{{poolType === 'need' ? left : cardInfo.left}}</i></span>-->
      <x-button @click.native.stop="toGift(itemId)" class="btn" mini type="primary">詳情</x-button>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux'
import defaultGift from '@/assets/icon/img-default-gift.png'
import defaultNeed from '@/assets/icon/img-default-need.png'
import picLabelNew from '@/assets/icon/gift/home_pic_label_new_2@2x.png'
import picLabelSend from '@/assets/icon/gift/home_pic_label_send@2x.png'
import {smartImagePath} from '@/tools/ObjectHelper'
import { mapState } from 'vuex'

export default {
  props: {
    poolType: {
      type: String
    },
    cardInfo: {
      type: Object
    },
    itemId: {
      type: Number
    },
    time: {
      type: String
    }
  },
  components: {
    XButton
  },
  data () {
    return {
      defaultGift,
      defaultNeed,
      picLabelNew,
      picLabelSend,
      smartImagePath
    }
  },
  methods: {
    // 禮物詳情
    toGift (id) {
      this.$router.push(`/gift/${id}`)
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    // 需求總數
    total () {
      const numTotal = this.cardInfo.need_items.map(item => item.quantity)
      return numTotal.reduce((prev, cur) => cur + prev)
    },
    left () {
      const numTotal = this.cardInfo.need_items.map(item => item.left)
      return numTotal.reduce((prev, cur) => cur + prev)
    },
    progress () {
      return `${parseFloat((this.total - this.left) / this.total).toFixed(2) * 100}%`
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../global.mixin.less';
  .item-card{
    padding: @pm-bg 0;
    margin: 0 @pm-bg;
    width: 100%;
    &-top{
      position: relative;
      display: flex;
      justify-content: left;
      > .num{
        position: absolute;
        top: 0;
        right: 0;
        color:@color-font-C2;
        font-size: @font-S4;
        i{
          color: @color-CR;
          font-style: normal;
        }
      }
    }
    .g-border-1px;
    .pic{
      position: relative;
      flex: 0 0 70px;
      height: 70px;
      background-size:70px auto;
      background-repeat:no-repeat;
      background-position: center center;
      background-color: @color-CBG;
      overflow: hidden;
      .tag{
        position: absolute;
        top: 0;
        left: 6px;
        width: 18px;
        height: 30px;
      }
    }
    .info{
      flex: 1;
      margin: 0 0 0 @pm-bg;
      padding-right: 75px;
      > .title{
        font-size: @font-S2;
      }
      &-wrapper{
        margin-top: @pm-md;
        color: @color-font-C2;
        font-size: @font-S4;
        line-height: 1;
        i{
          font-style: normal;
        }
        > .conds, .pullOff, .donate{
          display: flex;
          flex-wrap: wrap;
          justify-content: left;
          padding: 3px 0;
        }
        .conds{
          .content{
            flex: 1;
            display: inline-flex;
            flex-wrap: wrap;
            .donate-item{
              margin: 0 @pm-sm  @pm-sm 0;
              width: 30px;
              height: 30px;
              border: 1px solid @color-CL;
              overflow: hidden;
              background-size:30px auto;
              background-repeat:no-repeat;
              background-position: center center;
              &:nth-of-type(3n){
                margin-right: 0;
              }
            }
          }
        }
      }
    }
    .btn{
      position: absolute;
      bottom: 0;
      right: 0;
      padding:0;
      width: 64px;
      height: 30px;
      font-size: @font-S3;
      line-height: 1;
      background: @color-CR;
      &[disabled]{
        background: @color-DSA;
      }
    }
  }
</style>
