<template>
  <div class="child-comment">
    <div class="wrapper">
      <span class="user-name">
        <i @click="toUser(info.user_id, info.from_user_id)" class="name">{{ cType === 'comment' ? info.user.nickname : info.from_user.nickname }}</i>
        <template v-if="cType === 'comment' ? parentName !== info.user.nickname : parentName !== info.from_user.nickname">
          <i  class="reply">回覆</i> <i @click="toUser(parentId, info.to_user_id)" class="name">{{parentName}}</i>
        </template> :
      </span>
      <span class="txt">{{info.content}}</span>
    </div>
    <div v-show="info.image" class="pic">
      <img v-preview="smartImagePath(info.image, false)"
           :src="info.image | smallImage"
           alt="關閉"
           preview-title-enable="true"
           preview-nav-enable="true">
    </div>
  </div>
</template>

<script>
import {smartImagePath} from '@/tools/ObjectHelper'
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    info: {
      type: Object
    },
    parentName: {
      type: String,
      default: ''
    },
    parentId: {
      type: [Number, String]
    },
    cType: {
      type: String,
      default: 'comment'
    }
  },
  data () {
    return {
      smartImagePath
    }
  },
  created () {
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      this.getLoginUserInfo()
    }
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo'
    }),
    toComment () {
      this.$emit('toComment')
    },
    toUser (userId, fromUserId) {
      const id = this.cType === 'comment' ? userId : fromUserId
      this.$router.push(this.userInfo.id === id ? '/userinfo' : `/user/${id}`)
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  }
}
</script>

<style lang="less" scoped>
  .child-comment{
    margin-bottom: 7px;
    font-size: @font-S4;
    line-height: 23px;
    &:last-child{
      margin-bottom: 0;
    }
    &:nth-of-type(3){
      margin-top: @pm-bg;
    }
    .wrapper{
      .user-name{
        i{
          font-style: normal;
        }
        .name{
          color: @color-CR;
        }
        .reply{
          color: @color-font-C2;
        }
      }
      .txt{
        color: @color-font-C1;
        text-align: justify;
        word-break:break-all;
      }
    }
    .pic{
      display: flex;
      justify-content: center;
      align-items: center;
      margin: @pm-md 0 0 0;
      width: 75px;
      height: 75px;
      overflow: hidden;
      background-color: @color-CBG;
      img{
        display: block;
        width: 75px;
      }
    }
  }

</style>
