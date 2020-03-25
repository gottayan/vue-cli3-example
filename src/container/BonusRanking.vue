<template>
  <div class="bonus-ranking">
    <x-header
      @on-click-back="goBack"
      class="back-header"
      title="上週好人點排行榜">
    </x-header>
    <div class="container g-smooth">
      <div
        :style="{justifyContent: bonusRank.length === 1 ? 'center' : 'space-around'}"
        class="top-wrapper">
        <div
          v-if="index <= 2"
          :key="index"
          @click="toUser(rank.user_id)"
          :style="{order: index === 0 ? 1 : index === 1 ? 0 : 3}"
          :class="index === 0 ? 'top-rank-item first' : 'top-rank-item'"
          v-for="(rank, index) in bonusRank">
          <span
            class="avatar">
          <img
            width="55"
            height="55"
            :src="smartImagePath(rank.user.pics) || defaultAvatar"
            alt="icon">
          </span>
          <span
            class="name">
            {{ rank.user.nickname || '無暱稱'}}
          </span>
          <span class="bonus">{{ rank.bonus }} 點</span>
          <img
            class="rank-icon"
            width="auto"
            :src="index === 0 ? rankFirst : index === 1 ? rankSecond : rankThird"
            alt="icon">
        </div>
        <div
          :style="{visibility: 'hidden', order: 3}"
          v-if="bonusRank.length === 2"
          class="top-rank-item">
        </div>
      </div>
      <div class="other-wrapper">
        <div
          v-if="index > 2"
          :key="index"
          class="rank-item"
          @click="toUser(rank.user_id)"
          v-for="(rank, index) in bonusRank">
          <span class="rank">{{index + 1}}</span>
          <span class="avatar">
            <img
              width="40"
              height="40"
              :src="smartImagePath(rank.user.pics) || defaultAvatar"
              alt="icon">
          </span>
          <span
            class="name">
            {{ rank.user.nickname || '無暱稱'}}
          </span>
          <span class="bonus">{{ rank.bonus }} 點</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultAvatar from '@/assets/icon/icon-default-avatar.png'
import rankSecond from '@/assets/icon/ranking_pic_second@2x.png'
import rankFirst from '@/assets/icon/ranking_pic_first@2x.png'
import rankThird from '@/assets/icon/ranking_pic_thirdly@2x.png'
import {smartImagePath} from '@/tools/ObjectHelper'
import { mapState, mapActions } from 'vuex'
import { local, KEY_USER_TOKEN } from '@/tools/storage'

export default {
  data () {
    return {
      defaultAvatar,
      rankFirst,
      rankSecond,
      rankThird,
      smartImagePath
    }
  },
  created () {
    const token = local.get(KEY_USER_TOKEN)
    if (token && !this.userInfo.id) {
      this.getLoginUserInfo()
    }
    if (!this.bonusRank.length) {
      this.getBonusRank()
    }
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo',
      getBonusRank: 'getBonusRank'
    }),
    goBack () {
      this.$router.go(-1)
    },
    toUser (id) {
      const isSelf = Number(this.userInfo.id) === Number(id)
      this.$router.push(isSelf ? '/userinfo' : `/user/${id}`)
    }
  },
  computed: {
    ...mapState({
      bonusRank: state => state.configs.bonusRank,
      userInfo: state => state.user.userInfo
    })
  }
}
</script>

<style lang="less" scoped>
  @import '../global.mixin.less';
.bonus-ranking{
    height: 100%;
    .container{
      padding: 0 @pm-bg;
      height: calc(~"100% - 44px");
      overflow-y: scroll;
      background: #FFF url('../assets/icon/ranking_pic_topbg@2x.png') top center no-repeat;
      background-size: 100% 230px;
      .top-wrapper{
        display: flex;
        justify-content: space-around;
        .top-rank-item{
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          margin-top: 64px;
          padding-bottom: 64px;
          width: 100px;
          min-height: 127px;
          line-height: 1.12;
          border-radius: 8px;
          background: #FFF;
          .avatar{
            margin-top: -28px;
            width: 55px;
            height: 55px;
            border-radius: 50%;
            overflow: hidden;
          }
          .name{
            margin: 8px 0 5px;
            color: @color-font-C1;
            font-weight: 700;
            font-size: @font-S3;
            text-align: center;
          }
          .bonus{
            color: @color-font-C2;
            font-size: 12px;
          }
          .rank-icon{
            position: absolute;
            bottom: 0;
            margin: @pm-md 0;
            width: 42px;
          }
          &.first{
            padding-bottom: 80px;
            margin: 56px 0 0;
            width: 120px;
            min-height: 150px;
            .avatar{
              width: 62px;
              height: 62px;
              img{
                width: 62px;
                height: 62px;
              }
            }
            .name{
              font-size: @font-S2;
            }
            .bonus{
              font-size: @font-S4;
            }
            .rank-icon{
              width: 120px;
            }
          }
        }
      }
      .other-wrapper{
        margin-top: 30px;
        .rank-item{
          position: relative;
          display: flex;
          align-items: center;
          height: 70px;
          line-height: 70px;
          .g-border-1px();
          .rank{
            color: @color-font-C2;
            font-size: 18px;
            font-family: "PingFang-SC";
            font-weight: 700;
          }
          .avatar{
            margin: 0 @pm-md 0 @pm-bg;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
          }
          .name{
            color: @color-font-C1;
            font-weight: 700;
          }
          .bonus{
            position: absolute;
            top: 0;
            right: 0;
            color: @color-font-C2;
            font-size: @font-S4;
          }
        }
      }
    }
  }
</style>
