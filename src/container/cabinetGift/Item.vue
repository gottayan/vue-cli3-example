<template>
  <div class="logistics-item" v-if="showFirstCard">
    <div v-if="index === 0" :class="`item-content item-content-${this.classIndex}`">
      <div class="item-title-logo">
        <img :src="logoImg" alt="">
      </div>
      <div class="item-title-select">
        <group class="item-title-cell">
          <selector
            v-model="selected"
            :options="selectList"
            class="select-item"
            @on-change="handleSelect"
          />
        </group>
      </div>
      <div class="item-title-board">
        <div class="back-board">
          <div v-if="cabinetBanner" class="back-board-content">
            <p class="back-board-text">{{cabinetBanner.text}}</p>
          </div>
          <div v-else class="back-board-content">
            <p>暫無公告</p>
          </div>
        </div>
        <div class="board-rabbit">
          <img :src="titleRabbit" alt="" class="board-rabbit-item">
        </div>
      </div>
    </div>
    <div v-else
      :class="`item-content item-content-${this.classIndex}`">
      <router-link class="content-link" :to="`/gift/${giftItem.id}`" v-if="!noContent">
        <div v-if="!giftItem.left"
          :class="index % 2 === 0 ? `is-present is-present-left` : `is-present is-present-right`">
          <img
            :src="isPresentImg"
            alt=""
            width="100%"
            height="100%"
            >
        </div>
        <div class="item-image-wrap">
          <div class="item-image">
            <div
              class="item-image-img"
              :style="{backgroundImage: `url(${smartImagePath(giftItem.image_path) || defaultGift})`}"
              />
          </div>
        </div>
        <div class="item-title item-line">
          <h3>{{ giftItem.title }}</h3>
        </div>
        <div class="item-info item-line">
          <p class="item-nickname">{{ giftItem.user.nickname || '無暱稱' }}</p>
        </div>
        <!--<div class="item-info item-line">-->
          <!--<p class="item-left">尚有{{ giftItem.left }}個</p>-->
        <!--</div>-->
        <div class="item-demand item-line">
          <p>{{ giftItem.request_user_count }}人索取</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import yellow from '../../assets/img/cabinet/yellow.png'
import isPresentImg from '../../assets/img/cabinet/is_present.png'
import logoImg from '../../assets/img/logo/logo-transparent.png'
import titleRabbit from '../../assets/img/cabinet/rabbit_title.png'
import { Selector, Group } from 'vux'
import infiniteScroll from 'vue-infinite-scroll'
import {smartImagePath} from '@/tools/ObjectHelper'
import defaultGift from '@/assets/icon/img-default-gift.png'
import format from 'date-fns/format'
import compareDesc from 'date-fns/compare_desc'
import parse from 'date-fns/parse'
// import { format, compare_desc as compareDesc, parse } from 'date-fns'

export default {
  components: {
    Selector,
    Group
  },

  props: {
    index: [String, Number],
    giftItem: {
      type: Object,
      default () {
        return {}
      }
    },
    cabinetBanners: {
      type: Array,
      default () {
        return []
      }
    },
    showFirstCard: {
      type: Boolean,
      default () {
        return true
      }
    },
    noContent: {
      type: Boolean,
      default () {
        return false
      }
    },
    handleSelect: {
      type: Function,
      default: null
    }
  },

  computed: {
    classIndex () {
      const index = this.$props.index
      if (index >= 10) {
        let str = index.toString()
        return parseInt(str.charAt(str.length - 1))
      }
      return index
    },
    cabinetBanner () {
      if (this.cabinetBanners.length) {
        const hideAtTime = this.cabinetBanners[0].hide_at
        const hideAtTimeParse = parse(hideAtTime)
        const result = compareDesc(new Date(), hideAtTimeParse)
        if (hideAtTime === '0000-00-00 00:00:00') {
          return this.cabinetBanners[0]
        }
        if (result === -1) {
          return null
        }
      }
      return this.cabinetBanners[0] || null
    }
  },

  data () {
    return {
      yellow,
      isPresentImg,
      logoImg,
      titleRabbit,
      smartImagePath,
      defaultGift,
      selected: 'all',
      selectList: [{key: 'all', value: '所有'}, {key: 'ongoing', value: '贈送中'}, {key: 'finish', value: '已送完'}],
      format,
      compareDesc,
      parse
    }
  },
  directives: {
    infiniteScroll
  }
}
</script>

<style lang="less" scoped>
@cabinet-theme-color: #ff8533;
@cabinet-content-width: 120px;
@bg-url-prefix : "../../assets/img/cabinet/bg_";
@bg-url-suffix : ".png";
.c-background(@bgImg) {
  background-image: url(@bgImg);
  background-size: 100% 100%;
}
.c-ellipsis() {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.c-text() {
  width: @cabinet-content-width;
  margin: 0 auto;
  font-size: 14px;
  line-height: 20px;
}
.logistics-item {
  position: relative;
  background-color: @cabinet-theme-color;
  .bg-img {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -10;
  }
  .item-content-0 {
    @item-contentindex: 1;
    .c-background("@{bg-url-prefix}@{item-contentindex}@{bg-url-suffix}");
  }
  .item-content-1 {
    @item-contentindex: 2;
    .c-background("@{bg-url-prefix}@{item-contentindex}@{bg-url-suffix}");
  }
  .item-content-2 {
    @item-contentindex: 3;
    .c-background("@{bg-url-prefix}@{item-contentindex}@{bg-url-suffix}");
  }
  .item-content-3 {
    @item-contentindex: 4;
    .c-background("@{bg-url-prefix}@{item-contentindex}@{bg-url-suffix}");
  }
  .item-content-4 {
    @item-contentindex: 5;
    .c-background("@{bg-url-prefix}@{item-contentindex}@{bg-url-suffix}");
  }
  .item-content-5 {
    @item-contentindex: 6;
    .c-background("@{bg-url-prefix}@{item-contentindex}@{bg-url-suffix}");
  }
  .item-content-6 {
    @item-contentindex: 7;
    .c-background("@{bg-url-prefix}@{item-contentindex}@{bg-url-suffix}");
  }
  .item-content-7 {
    @item-contentindex: 8;
    .c-background("@{bg-url-prefix}@{item-contentindex}@{bg-url-suffix}");
  }
  .item-content-8 {
    @item-contentindex: 9;
    .c-background("@{bg-url-prefix}@{item-contentindex}@{bg-url-suffix}");
  }
  .item-content-9 {
    @item-contentindex: 10;
    .c-background("@{bg-url-prefix}@{item-contentindex}@{bg-url-suffix}");
  }
  .item-content {
    background-color: @cabinet-theme-color;
    height: 240px;
    position: relative;
    display: block;
    .content-link {
      color: #100007;
    }
    .item-title-logo {
      padding: 25px 35px 13px 25px;
      height: 70px;
      > img {
        height: 100%;
        width: 100%;
      }
    }
    .item-title-select {
      padding: 10px 20px 10px 10px;
      .item-title-cell {
        /deep/ .vux-no-group-title {
          margin: 0;
        }
        .select-item {
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .item-title-board {
      height: 125px;
      padding: 10px 20px 20px 10px;
      position: relative;
      .back-board {
        background: #fff;
        height: 100%;
        overflow: auto;
        .back-board-content {
          font-size: 12px;
          padding: 5px;
          overflow: hidden;
          .back-board-text {
            // overflow: hidden;
            // text-overflow: ellipsis;
            // display: -webkit-box;
            // -webkit-line-clamp: 4;
            // -webkit-box-orient: vertical;
          }
        }
      }
      .board-rabbit {
        position: absolute;
        width: 30px;
        bottom: 12px;
        right: 0;
        .board-rabbit-item {
          width: 100%;
          height: 100%;
        }
      }
    }
    .item-image-wrap {
      padding: 30px 0 10px 0;
      .item-image {
        width: @cabinet-content-width;
        height: @cabinet-content-width;
        margin: 0 auto;
        .item-image-img {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-repeat: no-repeat;
          background-color: white;
          background-position: center;
        }
      }
    }
    .item-title {
      font-size: 16px;
    }
    .item-info,
    .item-nickname,
    .item-demand {
      p {
        .c-text();
      }
    }
    .item-demand {
      padding: 0 0 15px 0;
      font-size: 16px;
    }
    .item-line {
      h3,
      p {
        .c-ellipsis();
        width: @cabinet-content-width;
        margin: 0 auto;
      }
    }
  }
  .is-present {
    width: 80px;
    height: 120px;
    position: absolute;
    z-index: 10;
  }
  .is-present-left {
    top: 1.5%;
    right: 5%;
  }
  .is-present-right {
    right: 2%;
    top: 1.6%;
  }
}
</style>
