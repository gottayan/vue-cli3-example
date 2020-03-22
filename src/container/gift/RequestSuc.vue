<template>
  <div class="request-success">
    <icon class="icon-cancel" @click.native="toBack" type="cancel">
    </icon>
    <div class="pic">
      <img width="150" height="100" :src="picSendSucceed" alt="圖片">
    </div>
    <div class="desc">您的索取請求，已經成功送出囉！</div>
    <div class="hint">
      看看TA的其他禮物<br />
      可能跟你特別投緣哦~
    </div>
    <div v-if="filteUserGifts.length" class="item vux-1px-t">
      <div
        @click="toGift(item.id)"
        :key="index" class="item-card"
        v-for="(item, index) in filteUserGifts"
      >
        <div class="pic-box" :style="{backgroundImage: `url(${item.image_path || picDefaultOtherGift})`}">
        </div>
        <div class="title">{{item.title}}</div>
        <div class="sub-title">
          {{ item.is_new ? '全新' : '二手'}}
          <span v-if="item.gift_requests.length" class="dot">·</span>
          {{ item.gift_requests.length ? `${item.gift_requests.length}人索取` : ''}}
        </div>
      </div>
    </div>
    <x-button @click.native="toUserGifts" class="request-suc-btn" type="primary">更多</x-button>
  </div>
</template>

<script>
import { XButton, Icon } from 'vux'
import picDefaultOtherGift from '@/assets/icon/com_pic_default_other_gift@2x.png'
import picSendSucceed from '@/assets/icon/extort/gift_pic_send_succeed@2x.png'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    XButton,
    Icon
  },
  data () {
    return {
      picDefaultOtherGift,
      picSendSucceed
    }
  },
  methods: {
    ...mapActions({
      getUserGifts: 'getUserGifts'
    }),
    toBack () {
      this.$router.go(-2)
    },
    toGift (id) {
      this.$router.push(`/gift/${id}`)
    },
    toUserGifts () {
      this.$router.push(`/user/${this.$route.query.giftUserId}/gifts`)
    },
    getUserGiftsCb (data) {
      // console.log(data)
    }
  },
  created () {
    if (!this.userGifts.length) {
      const [userId, page] = [this.$route.query.giftUserId, 1]
      this.getUserGifts({page, userId, cb: this.getUserGiftsCb})
    }
  },
  computed: {
    ...mapState({
      userGifts: state => state.user.otherUserInfo.myGifts.data
    }),
    filteUserGifts () {
      return this.userGifts.filter(item => item.id !== Number.parseInt(this.$route.query.giftId)).slice(0, 2)
    }
  }
}
</script>
<style lang="less">
  .request-success{
    .weui-icon-cancel{
      &:before{
        margin: 0;
      }
    }
  }
</style>
<style lang="less" scoped>
  @import '../../../node_modules/vux/src/styles/1px.less';
  .request-success{
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
    .request-suc-btn{
      background: @color-font-CR;
    }
  }
</style>
