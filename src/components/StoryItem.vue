<template>
  <div class="story-item-container">
    <router-link :to="`/story/${data.id}`" v-if="data.title">
      <div class="story-item-img" :style="`background-image: url(${smartImagePath(data.image)})`">
      </div>
      <div class="story-item-desc">
        <div class="title">
          {{data.title}}
        </div>
        <div class="desc" v-html="data.content">
          <!-- {{data.desc}} -->
        </div>
        <div class="time">
          <img src="../assets/icon/itemDetail/gift_list_ic_plan@2x.png" alt="">
          <span>{{data.created_at}}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import {smartImagePath} from '@/tools/ObjectHelper'
export default {
  data () {
    return {
      smartImagePath
    }
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
  .story-item-container{
    width: 100%;
    a{
      padding: 15px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      &:not(:last-child){
        border-bottom: 1px solid #ccc;
      }
    }
  }
  .story-item-img{
    margin-right: 10px;
    height: 80px;
    width: 80px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    img {
      height: 50px;
      display: block;
    }
  }

  .story-item-desc{
    width: calc(~"100% - 90px");
    .title{
      color: @color-font-CR;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .desc{
      height: 38px;
      color: @color-font-C2;
      font-size: @font-S3;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .time{
      color: @color-font-C2;
      font-size: @font-S4;
      *{
        vertical-align: middle;
      }
      img{
        width: 18px;
        height: 18px;
      }
    }
  }
</style>
