<template>
  <div class="cabinet-item-wrap">
    <div class="cabinet-item">
      <div class="cabinet-item-content">
        <div class="item-image">
          <div
            class="item-image-img"
            :style="{backgroundImage: `url(${smartImagePath(image) || defaultGift})`}"
          />
        </div>
        <div class="item-title">
          {{title}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {smartImagePath} from '@/tools/ObjectHelper'
import defaultGift from '@/assets/icon/img-default-gift.png'

export default {
  props: {
    title: {
      type: [String],
      default: ''
    },
    image: {
      type: [String],
      default: ''
    }
  },
  data () {
    return {
      smartImagePath,
      defaultGift
    }
  }
}
</script>

<style lang="less" scoped>
.cabinet-item-wrap {
  display: inline-block;
  width: 33%;
  .cabinet-item {
    padding: 10px;
    .cabinet-item-content {
      .item-image {
        margin: 0 auto;
        height: 80px;
        .item-image-img {
          width: 100%;
          height: 100%;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-color: white;
        }
      }
      .item-title {
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        margin-top: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

}
</style>
