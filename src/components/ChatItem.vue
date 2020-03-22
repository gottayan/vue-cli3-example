<template>
  <div :class="isMine ? 'item-chat mine' : 'item-chat'">
    <div class="row-time">
      <span class="text-time">
        {{ time }}
      </span>
    </div>
    <div class="row" v-if="type !== messageType.MESSAGE_TYPE_SYSTEM">
      <img
        @click.stop="toUser"
        class="avatar"
        :src="smartImagePath(avatar) || defaultAvatar"
        alt="" >
      <section :class="(isBusinessType && !isPicture) ? 'line business' : 'line'">
        <span class="text"
              v-if="(type === messageType.MESSAGE_TYPE_TEXT || isBusinessType) && (!isPicture)" >
          <span class="label" v-if="isBusinessType">{{ businessLabel }}</span>
          {{ content }}
        </span>
        <img
          @click="enlargeImage"
          :src="smartImagePath(content)"
          alt="圖片"
          style="width: 160px; float: left"
          v-if="isPicture">
      </section>
    </div>
    <div class="row system" v-if="type === messageType.MESSAGE_TYPE_SYSTEM">
      <span class="text-content">{{ content }}</span>
    </div>
  </div>
</template>
<script>
import { messageType } from './../tools/constant'
import defaultAvatar from './../assets/icon/icon-default-avatar.png'
import {smartImagePath} from '@/tools/ObjectHelper'

export default {
  props: {
    isMine: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    },
    // 消息類型： 1 表示文本 2 表示圖片 3 表示系統消息
    type: {
      type: Number,
      default: messageType.MESSAGE_TYPE_TEXT
    },
    avatar: {
      type: String
    },
    time: {
      type: String
    },
    isPicture: {
      type: Boolean,
      default: false
    },
    fromUserId: {
      type: Number
    },
    isMergeChild: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      messageType,
      defaultAvatar,
      smartImagePath,
      isBusinessType: false,
      businessLabel: '',
      image: ''
    }
  },
  mounted () {
    const { type } = this.$props
    if (type === messageType.MESSAGE_TYPE_REQUEST_REASON) {
      this.isBusinessType = true
      this.businessLabel = '索取理由'
    } else if (type === messageType.MESSAGE_TYPE_THANKS) {
      this.isBusinessType = true
      this.businessLabel = '感謝的話'
    }
  },
  methods: {
    enlargeImage () {
      if (!this.isPicture) {
        return
      }
      this.$emit('enlarge', smartImagePath(this.content, false))
    },
    toUser () {
      this.$router.push(this.isMine ? '/userinfo' : `/user/${this.fromUserId}`)
    }
  }
}
</script>
<style lang="less">
  @import './../theme.less';
  .item-chat {
    display: block;
    overflow: hidden;
    margin-bottom: @pm-lg;
    .row-time {
      display: block;
      width: 100%;
      margin-bottom: @pm-md ;
      position: relative;
      height: 22px;
      .text-time {
        margin: 0 auto;
        background-color: #d4d4d4;
        padding: 0 @pm-md;
        border-radius: 20px;
        color: white;
        font-size: 12px;
        line-height: 22px;
        float: left;
        .center-horizontal;
      }
    }
    .row {
      display: block;
      .avatar {
        height: 40px;
        width: 40px;
        display: inline-block;
        margin-right: @pm-md;
        border-radius: 50%;
        float: left;
      }
      .line {
        display: inline-block;
        max-width: calc(~"90% - 50px");
        word-break: break-all;
        height: auto;
        float: left;
        overflow: hidden;
        border-radius: 8px;
        border-top-left-radius: 0;
        background-color: white;
        &.business {
          background-color: @color-CO;
          .text {
            color: white;
            .label {
              color: @color-font-C5;
              display: block;
              width: 100%;
            }
          }
        }
        .text {
          padding: @pm-md;
          line-height: @pm-lg;
          display: block;
          color: @color-font-C1;
          font-size: @font-S3;
        }
      }
      &.system {
        padding-bottom: @pm-bg;
        position: relative;
        &:after {
          position: absolute;
          content: "";
          height: 1px;
          width: 72px;
          display: block;
          bottom: 0;
          background-color: #d8d8d8;
          .center-horizontal;
        }
        [class^='text-'] {
          display: block;
          text-align: center;
          color: @color-font-C2;
          font-size: @font-S3;
        }
        // .text-time {
        // }
        // .text-content {
        // }
      }
    }
    &.mine {
      .avatar {
        float: right;
        margin-right: 0;
        margin-left: @pm-md;
      }
      .line {
        float: right;
        border-top-right-radius: 0;
        border-top-left-radius: 8px;
        background-color: @color-CR;
        .text {
          color: white;
        }
      }
    }
  }
</style>
