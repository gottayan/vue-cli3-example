<template>
  <div class="resultpage-container">
    <div class="resultpage-content">
      <div name="icon">
        <img class="resultpage-icon"
             :src="icon || defaultIcon"
             alt="">
      </div>
      <slot name="title">
        <span class="resultpage-title">
          {{ title || "您的請求，已成功送出" }}
        </span>
      </slot>
      <slot name="desc">
        <span class="resultpage-desc">{{desc}}</span>
      </slot>
      <slot name="activeLink">
        <router-link v-if="activeLink" :to="activeLink" :target="activeTarget">
          <span class="resultpage-activelink">{{activeText}}</span>
        </router-link>
      </slot>
    </div>
    <div class="resultpage-btnPanel">
      <button :class="menu.type === 'primary' ? 'g-button red' : 'g-button blank'"
              @click="menu.func"
              v-bind:key="index"
              v-for="(menu, index) in menus">
        {{ menu.text }}
      </button>
    </div>
  </div>
</template>

<script>
import defaultIcon from './../assets/icon/gift/icon-sent-success.png'
export default {
  data () {
    return {
      defaultIcon,
      imagePath: ''
    }
  },
  props: {
    icon: {
      type: String
    },
    type: {
      type: String
    },
    title: {
      type: String
    },
    desc: {
      type: String
    },
    activeLink: {
      type: String, // 活動鏈接
      default: ''
    },
    activeText: {
      type: String
    },
    activeTarget: {
      type: String
    },
    menus: {
      type: Array
    }
  },
  created () {
    const { type, icon } = this.$props
    if (icon) {
      this.imagePath = icon
      return
    }
    switch (type) {
      case 'sent_success':
        this.imagePath = '@/assets/icon/gift/icon-sent-success.png'
        break
      default:
        this.imagePath = '@/assets/icon/gift/icon-sent-success.png'
    }
  }
}
</script>

<style lang="less">
  @import './../global.style.less';
  .resultpage-container{
    padding: 0 @pm-bg;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: white;
  }

  .resultpage-content{
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .resultpage-icon{
    width: auto;
    height: 150px;
    display: block;
    margin: 0 auto @pm-lg;
  }

  .resultpage-title,
  .resultpage-desc{
    text-align: center;
  }

  .resultpage-title{
    margin-top: 30px;
    font-weight: 700;
    color: @color-font-C1;
    font-size: @font-S1;
  }

  .resultpage-desc{
    margin-top: 15px;
    color: @color-font-C2;
    font-size: @font-S3;
  }

  .resultpage-btnPanel {
    flex: 1;
    padding: @pm-sm @pm-lg;
    button {
      margin-bottom: @pm-bg;
      border-radius: 20px;
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
</style>
