<template>
  <div class="card wish-public-style"
       :class="index % 2 ? 'card-right' : 'card-left'"
       @click="handleClick()"
  >
    <div class="img-wrap">
      <div class="img"
         :style="{backgroundImage: `url(${smartImagePath(item.image_path) || defaultGift})`}"
      />
      <div class="num">
        <p class="np">
          {{ item.wish_no }}
        </p>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <h3 class="tp">{{ item.title }}</h3>
      </div>
      <div class="request">
        <p class="rp">
        <span class="dibm">{{item.student_name }}</span>
        <span class="dot" style="margin: 0;"></span>
        <span class="dibm">{{ schoolMap[year][item.school_name] }}</span>
        </p>
      </div>
      <div
        class="btn"
        :class="isEnd && 'disabled-btn'"
      >
        <p class="bp">{{statusMap(true)[item.status]}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import defaultGift from '@/assets/icon/img-default-gift.png'
import { smartImagePath } from '@/tools/ObjectHelper'
import { statusMap, schoolMap } from './constants'
export default {
  props: {
    item: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: 0
    },
    isUser: {
      type: Boolean,
      default: false
    },
    year: {
      type: Number,
      default: 2018
    }
  },
  data () {
    return {
      defaultGift,
      smartImagePath,
      statusMap,
      schoolMap
    }
  },
  computed: {
    number () {
      const index = this.index
      return index < 9 ? `0${index + 1}` : index + 1
    },
    isEnd () {
      return this.item.status !== 'on'
    }
  },
  methods: {
    handleClick () {
      this.$router.push({
        path: `/wish/${this.item.id}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../theme';
@import './style';
// 卡片圆角
@card-radius: 6px;
.card {
  .img-wrap {
    height: 150px;
  }
  .content {
    padding: 12px;
    .title {
      > .tp {
        .nowrap();
      }
    }
    .request {
      > .rp {
        color: #969797;
        .nowrap();
      }
    }
    .btn {
      .btn(6px);
    }
  }
  .dibm {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
