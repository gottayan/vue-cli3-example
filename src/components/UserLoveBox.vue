<template>
  <div class="user-love-box">
    <div class="side-info">
      <div class="info-wrapper">
        <span class="time">{{time.split(' ')[0]}}</span>
        <span
          v-if="type === 'love'"
          v-show="edelno"
          class="etc"
        >
          單號：<i class="digit">{{edelno}}</i>
        </span>
        <span
          @click="toLookLogisticsSn"
          v-show="logisticsSn"
          class="etc"
        >
          單號：<i class="digit">{{logisticsSn}}</i>
        </span>
      </div>
      <span
        v-if="type === 'love'"
        class="shipSn"
        @click="toLookShipSn(shipSn)"
      >
        查看托運單
      </span>
      <span
        v-else
        class="status"
      >
        {{logisticsSn ? '已出貨' : '撿貨中'}}
      </span>
    </div>
    <div class="item-wrapper">
      <div :key="index" class="item" v-for="(item, index) in items">
        <div class="pic-wrapper">
          <img class="pic" :src="smartImagePath(item.goods_picture) || defaultGift" alt="pic">
        </div>
        <div class="info-wrapper">
          <div class="name">{{item.goods_name}}</div>
          <div class="category">{{item.goods_class}}</div>
        </div>
        <span class="num">
          X {{type === 'love' ? item.remain : item.quantity}}
        </span>
        <span
          v-if="type !== 'love' && deliverAt"
          @click="item.thanked ? null : toThanks(item.id)"
          class="thank-btn"
        >{{item.thanked ? '已感謝' : '待感謝'}}</span>
      </div>
    </div>
    <div
      v-if="type !== 'love'"
      class="rest-info"
    >
      <div class="box">共 <i class="num">1</i> 箱，運費：<i class="num">NT$ 150</i></div>
    </div>
    <div class="track-info" v-if="edelno || logisticsSn">
      <x-button class="btn-track" @click.native.stop="showTrackInfo(edelno || logisticsSn)" mini type="primary">貨物追蹤</x-button>
    </div>
    <ship-sn
      :image="image"
      @toggleShow="toggleShow"
      :is-show="showShipSn"
    >
    </ship-sn>
  </div>
</template>

<script>
import defaultGift from '@/assets/icon/img-default-gift.png'
import ShipSn from '@/components/ShipSn'
import { XButton } from 'vux'
import { smartImagePath } from '@/tools/ObjectHelper'

export default {
  components: {
    ShipSn,
    XButton
  },
  props: {
    type: {
      type: String,
      default: 'love'
    },
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    edelno: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: '-'
    },
    shipSn: {
      type: String
    },
    logisticsSn: {
      type: String,
      default: ''
    },
    no: {
      type: String
    },
    deliverAt: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      defaultGift,
      image: '',
      showShipSn: false,
      smartImagePath
    }
  },
  methods: {
    toggleShow () {
      this.showShipSn = false
    },
    toLookShipSn (image) {
      this.image = image
      this.showShipSn = true
    },
    toLookLogisticsSn () {
      window.location.href = `https://www.hct.com.tw/phone/searchGoods_Main.aspx?no=${this.no}&v=0B1E6A6781133396C51F5501492D2C6B`
    },
    toThanks (id) {
      this.$router.push(`/loveboxThanks/${id}`)
    },
    showTrackInfo (sn) {
      this.$emit('showTrack', sn)
    }
  }
}
</script>

<style lang="less" scoped>
  .user-love-box{
    background: #FFF;
    .side-info{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: @pm-bg 0;
      color: @color-font-C2;
      font-size: @font-S4;
      .info-wrapper{
        display: flex;
        flex-direction: column;
        .digit{
          color: @color-CR;
          font-style: normal;
        }
      }
    }
    .item-wrapper{
      .item{
        position: relative;
        display: flex;
        justify-content: flex-start;
        padding: @pm-bg 0;
        border-top: 1px solid @color-CL;
        .pic-wrapper{
          position: relative;
          width: 72px;
          height: 72px;
          text-align: center;
          background-color: @color-CBG;
          .pic{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1;
            margin: auto;
            max-width: 100%;
            max-height: 100%;
          }
        }
        .info-wrapper{
          margin-left: @pm-bg;
          flex: 1;
          .name{
            margin: 4px 10px 6px 0;
            color: @color-font-C1;
            font-size: @font-S2;
            font-weight: 700;
            word-break: break-all;
          }
          .category{
            color: @color-font-C2;
            font-size: @font-S4;
            word-break: break-all;
          }
        }
        .num{
          flex: 0 0 auto;
          align-self: flex-start;
          color: @color-font-C1;
          font-size: @font-S3;
          margin-top: 5px;
        }
        .thank-btn{
          position: absolute;
          bottom: @pm-bg;
          right: 0;
          width: 64px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: #FFF;
          font-size: @font-S4;
          border-radius: 3px;
          background: @color-CR;
        }
      }
    }
    .track-info {
      padding-bottom: 10px;
      display: flex;
      justify-content: flex-end;
      .btn-track {
        margin: 0;
        padding:0 5px;
        height: 30px;
        font-size: @font-S3;
        line-height: 1;
        border: 1px solid @color-CBG;
        color: @color-font-C2;
        background: #FFF;
        &:hover {
          background: @color-CBG;
        }
      }
    }
    .rest-info{
      padding: 17px 0;
      border-top: 1px solid @color-CL;
      .box{
        color: @color-font-C1;
        font-size: @font-S3;
        text-align: right;
        .num{
          color: @color-CR;
          font-style: normal;
        }
      }
    }
  }
  .recent{
    color: @theme-color;
  }
</style>
