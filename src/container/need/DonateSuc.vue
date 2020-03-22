<template>
  <div class="donate-success">
    <icon class="icon-cancel" @click.native="toBack" type="cancel">
    </icon>
    <div class="pic">
      <img width="150" height="100" :src="picSendSucceed" alt="圖片">
    </div>
    <div class="desc">您的贈送請求，已經成功送出囉！</div>
    <div class="hint">
      看看TA的其他需求<br />
      贈送成功可與對方商量合併寄送哦~
    </div>
    <div v-if="userNeeds.length" class="item vux-1px-t">
      <div
        @click="toNeed(item.id)"
        :key="index" class="item-card"
        v-for="(item, index) in userNeeds"
      >
        <div class="pic-box" :style="{backgroundImage: `url(${item.image_path || picDefaultOtherNeed})`}">
        </div>
        <div class="title">{{item.title}}</div>
        <div class="sub-title">
          <!--{{ item.is_new ? '全新' : '二手'}}<span class="dot">·</span>-->
          {{ item.need_donates.length ? `${item.need_donates.length}人贈送` : ''}}
        </div>
      </div>
    </div>
    <x-button @click.native="toUserNeeds" class="donate-suc-btn" type="primary">更多</x-button>
  </div>
</template>

<script>
import { XButton, Icon } from 'vux'
import picDefaultOtherNeed from '@/assets/icon/com_pic_default_other_demand@2x.png'
import picSendSucceed from '@/assets/icon/extort/gift_pic_send_succeed@2x.png'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    XButton,
    Icon
  },
  data () {
    return {
      picDefaultOtherNeed,
      picSendSucceed
    }
  },
  methods: {
    ...mapActions({
      getUserNeeds: 'getUserNeeds'
    }),
    toBack () {
      this.$router.go(-2)
    },
    toNeed (id) {
      this.$router.push(`/need/${id}`)
    },
    toUserNeeds () {
      this.$router.push(`/user/${this.$route.query.needUserId}/needs`)
    },
    getUserNeedsCb (data) {
      // console.log(data)
    }
  },
  created () {
    if (!this.userNeeds.length) {
      const [userId, page] = [this.$route.query.needUserId, 1]
      this.getUserNeeds({page, userId, cb: this.getUserNeedsCb})
    }
  },
  computed: {
    ...mapState({
      userNeeds: state => state.user.otherUserInfo.myNeeds.data.slice(0, 2)
    })
  }
}
</script>
<style lang="less">
  .donate-success{
    .weui-icon-cancel{
      &:before{
        margin: 0;
      }
    }
  }
</style>
<style lang="less" scoped>
  @import '../../../node_modules/vux/src/styles/1px.less';
  .donate-success{
    position: relative;
    padding: 40px @pm-bg 0;
    text-align: center;
    .icon-cancel{
      position: absolute;
      top: @pm-bg;
      right: @pm-bg;
    }
    .pic{
      margin: 0 0 30px;
    }
    .desc{
      color: @color-font-C1;
      font-size: @font-S1;
      font-weight: bold;
      line-height: 1;
    }
    .hint{
      margin-top: 7px;
      padding-bottom: 30px;
      color: @color-font-C2;
      font-size: @font-S3;
      line-height: 22px;
    }
    .item{
      display: flex;
      justify-content: space-between;
      padding: @pm-bg 0 24px;
      .item-card{
        flex: 1;
        line-height: 1;
        margin-right: @pm-bg;
        .pic-box{
          width: 100%;
          height: 120px;
          overflow: hidden;
          background-size:100% auto;
          background-repeat:no-repeat;
          background-position: center center;
          background-color: @color-CBG;
        }
        .item-img{
          display: block;
        }
        .title{
          margin: @pm-md 0 8px;
          color: @color-font-C1;
          font-size: @font-S2;
          font-weight: bold;
        }
        .sub-title{
          color: @color-font-C2;
          font-size: @font-S4;
          .dot{
            margin: 0 8px;
          }
        }
        &:last-child{
          margin-right: 0;
        }
      }
    }
    .donate-suc-btn{
      background: @color-font-CR;
    }
  }
</style>
