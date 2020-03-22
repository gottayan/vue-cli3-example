<template>
  <div class="item-card" v-if="cardInfo">
    <div class="item-card-top" v-show="isNG">
      <div
        class="pic"
        :style="{backgroundImage: `url(${smartImagePath(cardInfo.image_path) || (isNeed ?
        defaultNeed : defaultGift)})`}"
      >
        <img
          v-if="(isNeed ? left : cardInfo.left) && !!cardInfo.is_new"
          class="tag"
          width="18"
          height="30"
          :src="picLabelNew"
          alt="picLabelNew">
        <img
          v-if="!(isNeed ? left : cardInfo.left)"
          class="tag"
          width="18"
          height="30"
          :src="isGift ? picLabelSend : picLabelSucceed"
          alt="picLabelSend"
          >
        <div
          v-if="isNeed"
          class="progress"
        >
          <span :style="{width: progress}" class="progress-front"></span>
          <span class="progress-back"></span>
        </div>
      </div>

      <div class="info">
        <div class="title">{{cardInfo.title}}</div>
        <div v-html="cardInfo.desc" class="desc"></div>
      </div>
        <span class="num">
          {{isNeed ? '數量' : '剩餘'}}：
          <i>{{isNeed ? left : cardInfo.left}}</i>
        </span>
        <x-button
          v-if="userInfo.id !== cardInfo.user_id && !isOffOrFinish"
          @click.native.stop="isGift ? toRequest(itemId) : toDonate(itemId)"
          :disabled="(isNeed ? !left : !cardInfo.left)"
          class="btn"
          mini
          type="primary"
        >
          {{isGift ? cardInfo.left ? '索取' : '已送出' : left ? '贈送' : '募集成功'}}
        </x-button>
      </div>

      <div
        v-show="isNeed"
        class="item-card-bottom"
      >
        <div
          class="needItem"
          :key="needItem.id"
          v-for="needItem in cardInfo.need_items"
        >
          <span class="icon"></span>
          <span class="name">{{ needItem.name }}</span>
          <div class="progress-wrapper">
            <div class="progress-bar">
              <span
                :style="{width: `${parseFloat((needItem.quantity - needItem.left) / needItem.quantity).toFixed(2) * 100}%`}"
                class="progress-bar-front">
              </span>
              <span class="progress-bar-back"></span>
            </div>
            <div class="num">{{needItem.quantity - needItem.left}}/{{needItem.quantity}}</div>
          </div>
        </div>
      </div>
    <!-- member -->
    <div class="item-card-top member-top" v-show="poolType === 'member'">
      <div
        class="pic member-pic"
        :style="{backgroundImage: `url(${cardInfo.pics || defaultMember})`}"
      >
      </div>
      <div class="info member-info">
        <div class="title member-title"><p>{{cardInfo.nickname}}</p><div class="rank">{{cardInfo.cat_hash | role}}</div></div>
        <div v-html="cardInfoInfos" class="desc member-desc" v-if="cardInfoInfos !== ''"></div>
      </div>
    </div>

  </div>
</template>

<script>
import { XButton } from 'vux'
import defaultGift from '@/assets/icon/img-default-gift.png'
import defaultNeed from '@/assets/icon/img-default-need.png'
import picLabelNew from '@/assets/icon/gift/home_pic_label_new_2@2x.png'
import picLabelSend from '@/assets/icon/gift/home_pic_label_send@2x.png'
import picLabelSucceed from '@/assets/icon/need/com_pic_label_succeed@2x.png'
import defaultMember from '@/assets/icon/icon-default-avatar.png'
import {smartImagePath} from '@/tools/ObjectHelper'
import memberData from '@/tools/memberData'
import { local, KEY_USER_TOKEN } from '@/tools/storage'
import { mapState } from 'vuex'

export default {
  props: {
    poolType: {
      type: String
    },
    cardInfo: {
      type: Object
    },
    itemId: {
      type: Number
    }
  },
  components: {
    XButton
  },
  data () {
    return {
      defaultGift,
      defaultNeed,
      picLabelNew,
      picLabelSend,
      picLabelSucceed,
      smartImagePath,
      defaultMember,
      memberType: ''
      // cardInfoInfos: this.cardInfo.infos
    }
  },
  // mounted () {
  //   this.cardInfo.infos = String(this.cardInfo.infos).replace(/<p>|<\/p>|<br \/>|NULL|null/g, '').trim()
  // },
  methods: {
    // 索取
    toRequest (id) {
      if (!local.get(KEY_USER_TOKEN)) {
        return this.$router.push(`/request/${id}`)
      }
      if (!memberData.isValidBaseInfo(this.$store.state)) {
        this.$vux.toast.text('請先完善會員基本資料', 'bottom')
        setTimeout(() => {
          this.$router.push(`/user/${this.userInfo.id}/editBaseInfo?redirect=/request/${id}`)
        }, 3000)
      } else if (!memberData.isValidAdr(this.$store.state)) {
        this.$vux.toast.text('請先完善聯絡地址', 'bottom')
        setTimeout(() => {
          this.$router.push(`/user/${this.userInfo.id}/editAdr?redirect=/request/${id}`)
        }, 3000)
      } else {
        this.$router.push(`/request/${id}`)
      }
    },
    // 贈送
    toDonate (id) {
      if (!local.get(KEY_USER_TOKEN)) {
        return this.$router.push(`/donate/${id}`)
      }
      if (!memberData.isValidBaseInfo(this.$store.state)) {
        this.$vux.toast.text('請先完善會員基本資料', 'bottom')
        setTimeout(() => {
          this.$router.push(`/user/${this.userInfo.id}/editBaseInfo?redirect=/donate/${id}`)
        }, 1000)
      } else if (!memberData.isValidAdr(this.$store.state)) {
        this.$vux.toast.text('請先完善會員聯絡地址', 'bottom')
        setTimeout(() => {
          this.$router.push(`/user/${this.userInfo.id}/editAdr?redirect=/donate/${id}`)
        }, 1000)
      } else {
        this.$router.push(`/donate/${id}`)
      }
    }
  },
  computed: {
    cardInfoInfos () {
      if (!this.cardInfo.infos) {
        return ''
      }
      return this.cardInfo.infos
        .replace(/<p>|<\/p>|<br \/>|NULL|null|&nbsp;/g, '')
        .replace(/<(img|iframe|br).*>/, '')
        .replace(/<a.*>.*<\/a>/, '')
        .trim()
    },
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    // 需求總數
    total () {
      if (!this.isNG || !this.cardInfo.need_items.length) {
        return 0
      }
      const numTotal = this.cardInfo.need_items.map(item => item.quantity)
      return numTotal.reduce((prev, cur) => cur + prev)
    },
    left () {
      if (!this.isNG || !this.cardInfo.need_items.length) {
        return 0
      }
      const numTotal = this.cardInfo.need_items.map(item => {
        return item.left > 0 ? item.left : 0
      })
      return numTotal.reduce((prev, cur) => cur + prev)
    },
    progress () {
      return `${parseFloat((this.total - this.left) / this.total).toFixed(2) * 100}%`
    },
    isOffOrFinish () {
      return this.cardInfo.status === 'finish' || this.cardInfo.status === 'pull_off'
    },
    isNeed () {
      if (this.poolType === 'need') {
        return true
      } else {
        return false
      }
    },
    isGift () {
      if (this.poolType === 'gift') {
        return true
      } else {
        return false
      }
    },
    // 判断poolType的了类型是否为need或gift的条件
    isNG () {
    //  if(this.poolType === 'need' || this.poolType === 'gift'){
      if (this.isGift || this.isNeed) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="less">
.member-desc *{
  font-size: 13px!important;
  font-weight: normal!important;
  font-style: normal!important;
  color: #969797!important;
}
</style>

<style lang="less" scoped>
  @import '../global.mixin.less';
  .item-card{
    padding: @pm-bg 0;
    margin: 0 @pm-bg;
    width: 100%;
    &-top{
      position: relative;
      display: flex;
      justify-content: left;
      > .num{
        position: absolute;
        top: 0;
        right: 0;
        color:@color-font-C2;
        font-size: @font-S4;
        i{
          color: @color-CR;
          font-style: normal;
        }
      }
    }
    &-bottom{
      background-color: @color-CBG;
      .needItem{
        display: flex;
        align-items: center;
        margin: 8px 0 0 @pm-bg;
        font-size: 0;
        &:first-child{
          padding-top: @pm-bg;
        }
        &:last-child{
          padding-bottom: @pm-bg;
        }
        > .icon{
          margin-right: @pm-md;
          width: 20px;
          height: 20px;
          background: url('../assets/icon/itemDetail/com_list_ic_gift@2x.png') center center no-repeat;
          background-size:20px 20px ;
        }
        .name{
          flex:none;
          width: 60%;
          margin-right: @pm-bg;
          color: @color-font-C1;
          font-size: @font-S3;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .progress-wrapper{
          flex: 1;
          display: inline-flex;
          justify-content: space-between;
          align-items: center;
          .progress-bar{
            position: relative;
            width: 100%;
            height: 4px;
            bottom: 0;
            display: flex;
            overflow: hidden;
            &-front,
            &-back{
              height: 4px;
              content: '';
              position: absolute;
            }

            &-front{
              z-index: 2;
              background-color: @color-CO;
              background-image: linear-gradient(to right, @color-CO, @color-CR);
              border-radius: 0 2px 2px 0;
            }

            &-back{
              z-index: 1;
              width: 100%;
              background-color: #e5e5e5;
            }
          }
          .num{
            margin:0 12px 0 @pm-md;
            color: @color-font-C2;
            font-size: @font-S4;
          }
        }
      }
    }
    .g-border-1px;
    .pic{
      position: relative;
      flex: 0 0 90px;
      height: 90px;
      background-size:90px auto;
      background-repeat:no-repeat;
      background-position: center center;
      background-color: @color-CBG;
      overflow: hidden;
      .tag{
        position: absolute;
        top: 0;
        left: 6px;
        width: 18px;
        height: 30px;
      }
      .progress{
        position: absolute;
        width: 100%;
        height: 4px;
        bottom: 0;
        z-index: 9;
        &-front,
        &-back{
          height: 4px;
          content: '';
          position: absolute;
        }
        &-front{
          z-index: 2;
          background-color: @color-CO;
          background-image: linear-gradient(to right, @color-CO, @color-CR);
          border-radius: 0 2px 2px 0;
        }
        &-back{
          z-index: 1;
          width: 100%;
          background-color: rgba(000, 000, 000, .3);
        }
      }
    }
    .info{
      flex: 1;
      margin: 0 0 0 @pm-bg;
      padding-right: 75px;
      .title{
        font-size: @font-S2;
        display: -webkit-box;
        /* autoprefixer: off */
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        /* autoprefixer: on */
        overflow: hidden;
        white-space:normal;
        word-break:break-all;
      }
      .desc{
        margin-top: @pm-md;
        display: -webkit-box;
        /* autoprefixer: off */
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        /* autoprefixer: on */
        overflow: hidden;
        font-size: @font-S4;
        white-space:normal;
        word-break:break-all;
        color: @color-font-C2!important;
        font-size: 13px!important;
      }
    }
    .btn{
      position: absolute;
      bottom: 0;
      right: 0;
      padding:0;
      width: 64px;
      height: 30px;
      font-size: @font-S3;
      line-height: 1;
      background: @color-CR;
      &[disabled]{
        background: @color-DSA;
      }
    }
  }
  /*member*/
  .member-top {
    // width: 89%;
    width: 100%;
    height: 65px;
    display: flex;
    align-items: center;
    .member-pic {
      height: 50px;
      border-radius: 50%;
      background-size: 100%;
      flex: 0 0 50px;
    }
    .member-desc {
      width: 100%;
      // 高度不够
      // height: 33px;
      margin: 0;
      text-overflow: ellipsis;
      flex: 1;
      margin-top: 5px;
      -webkit-line-clamp: 2 !important;
      max-height: 36px;
    }
    .member-info {
      display: flex;
      padding-right: 0;
      justify-content: center;
      flex-direction: column;
      margin: 0 0 0 15px;
    }
  }
  .member-title {
    flex:1;
    font-size: 14px;
    line-height: 20px;
    height: 30px;
    display: flex;
    justify-content: center;
    p {
      display: inline-block;
      max-width: 150px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      line-height: 30px;
    }
    .rank {
      // display: inline-block;
      position: relative;
      font-size: 13px;
      background-color:rgba(51, 51, 51, 0.298039215686275);
      border-radius: 20px;
      padding:1px 10px 1px 24px;
      height: 20px;
      line-height: 17px;
      color: #fff;
      // top:-10px;
      top:6px;
      // right: 0px;
      float: right;
      // align-self:flex-end;
      &::before {
        position: absolute;
        content: '';
        background: url('../assets/icon/profile/profile_pic_identity_approve@2x.png') no-repeat center;
        width: 13px;
        height: 13px;
        background-size: 100%;
        left: 8px;
        top: 3px;
      }
    }
  }
</style>
