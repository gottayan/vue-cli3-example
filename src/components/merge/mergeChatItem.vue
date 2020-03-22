<template>
  <div class="chat">
    <div class="line-word">
      <div class="line"></div>
      <div class="word">
        <p>禮物「{{item.title}}」</p>
        <p>聊天記錄</p>
      </div>
    </div>
    <ChatItem v-for="(v, i) in messages"
              :key="i"
              :index="i"
              :type="v.type"
              :from-user-id="v.from_user_id"
              :isMine="v.isMine"
              :time="v.created_at"
              :content="v.content"
              :avatar="v.avatar"
              :isPicture="v.isPicture"
              :isMergeChild="true"
    >
    </ChatItem>
  </div>
</template>

<script>
import ChatItem from '@/components/ChatItem'
import { getConversationContent } from '@/tools/strMap'

export default {
  components: {
    ChatItem
  },
  data () {
    return {
      messages: []
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    userId: {
      type: Number,
      default: 0
    },
    userPic: {
      type: String,
      default: ''
    },
    directUserPic: {
      type: String,
      default: ''
    },
    myPic: {
      type: String,
      default: ''
    },
    detail: {
      type: Object,
      default: () => {}
    }
  },
  created () {
    this.messages = this.item.message.map(v => {
      v.isPicture = v.type === 'image'
      v.isMine = (this.userId === v.from_user_id)
      v.avatar = v.isMine
        ? this.myPic
        : this.userId === this.directUserId
          ? this.userPic
          : this.directUserPic
      v.type = v.is_system ? 3 : 1
      v.content = getConversationContent(v.content, this.detail, null, true, this.item.title)
      return v
    })
  }
}
</script>

<style lang="less" scoped>
.chat {
  .line-word {
    height: 70px;
    position: relative;
    padding-top: 10px;
    .line {
      position: absolute;
      background: #E4E4E4;
      height: 1px;
      width: 90%;
      transform: translateX(-50%);
      left: 50%;
      top: 20px;
    }
    .word {
      font-size: 14px;
      position: absolute;
      transform: translateX(-50%);
      left: 50%;
      text-align: center;
      line-height: 16px;
      background: #eeeeee;
      padding: 0 10px;
    }
  }
}
</style>
