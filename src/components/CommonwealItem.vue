<template>
  <div class="commonwealitem-container">
    <router-link :to="`/need/${id}`">
      <div class="views">
        <x-img class="img" :src="url | smallImage" :default-src="DefaultSrc" >
        </x-img>
        <div class="progress">
          <span :style="'width: ' + progress + ''" class="progress-front"></span>
          <span class="progress-back"></span>
        </div>
        <div class="status">{{sents >= total ? '已完成' : '募集中' }}</div>
      </div>
      <div class="desc-title">{{title}}</div>
    </router-link>
  </div>
</template>

<script>
import DefaultSrc from '@/assets/img/bg-default-need.png'
import { XImg } from 'vux'
export default {
  data () {
    return {
      DefaultSrc
    }
  },
  components: {
    XImg
  },
  props: {
    url: {
      // required: true,
      type: String,
      default: DefaultSrc
    },
    title: {
      required: true,
      type: String
    },
    progress: {
      required: true,
      type: String
    },
    status: {
      required: true,
      type: String
    },
    id: {
      required: true,
      type: [String, Number]
    },
    total: {
      required: true,
      type: [String, Number]
    },
    sents: {
      required: true,
      type: [String, Number]
    }
  }
}
</script>

<style lang="less">
  .commonwealitem-container{
    margin-right: 10px;
    width: 140px;
    display: inline-block;
    .views{
      position: relative;
      width: 140px;
      height: 100px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      .b-error{
        width: 100%;
        height: 100%;
        background-color: #f2f2f2;
        /*padding: 0 20px;*/
      }
      .b-loaded{
        padding: 0;
        background-color: transparent;
      }
    }

    .img{
      position: relative;
      // display: block;
      // margin: auto;
    }

    .progress{
      position: absolute;
      width: 100%;
      height: 4px;
      bottom: 0;
      &-front,
      &-back{
        height: 4px;
        content: '';
        position: absolute;
      }

      &-front{
        z-index: 502;
        background-color: @color-CO;
        background-image: linear-gradient(to right, @color-CO, @color-CR);
        border-radius: 0 2px 2px 0;
      }

      &-back{
        z-index: 501;
        width: 100%;
        background-color: rgba(000, 000, 000, .3);
      }
    }

    .status{
      width: 66px;
      height: 20px;
      color: @color-font-C4;
      background-image: linear-gradient(to right, #ffa507 60%, rgba(255, 255, 255, 0));
      position: absolute;
      top: 0;
      left: 0;
      font-size: 14px;
      padding-left: 4px;
    }

    .desc-title{
      width: 100%;
      line-height: 1.5;
      margin-top: 15px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: @font-S3;
      color: @color-font-C1;
    }
  }
</style>
