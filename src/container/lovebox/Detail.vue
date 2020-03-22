<template>
  <div :class="isMine ? 'love-box-detail my-love-box' : 'love-box-detail'">
    <div class="pics">
      <swiper
        loop
        dots-class="item-dots"
        height="290px"
        v-if="currentLovebox.goods_picture">
        <swiper-item
          class="swiper-img"
          v-for="(item, index) in [currentLovebox.goods_picture]"
          height="500px"
          :key="index">
          <p class="img-item"
           :style="{backgroundImage: `url(${smartImagePath(item, false)})`}"
           @click="enLargeImage(smartImagePath(item, false))"
           ></p>
        </swiper-item>
      </swiper>
      <p v-else class="img-item" :style="{backgroundImage: `url(${GiftDefault})`}"></p>
      <p class="title">{{ currentLovebox.goods_name }}</p>
      <span @click="showShareBar" class="share-btn"></span>
      <span class="back-icon">
        <icon
          @click.native="$router.go(-1)"
          name="goback"
          :scale="3">
        </icon>
      </span>
    </div>
    <div class="container">
      <div class="info">
        <div class="user-info">
          <div class="detail">
            <div
              class="avatar"
              @click="toUser"
              :style="{backgroundImage: `url(${(currentLovebox.employee && currentLovebox.employee.pics) || UserDefault})`}"
            >
            </div>
            <div class="wrapper">
              <div class="user-name" @click="toUser">
                {{ currentLovebox.employee && (currentLovebox.employee.nickname || currentLovebox.employee.name) }}
              </div>
              <div v-if="currentLovebox.remain" class="pull-off-at">
                <div v-if="isOnShelve">
                  <span v-if="pulloffTime > 0">距離下架,還有<i class="num">{{ pulloffTime }}</i>天</span>
                  <span v-else>即將下架</span>
                </div>
                <div v-else>已下架</div>
              </div>
              <div v-else class="pull-off-at">
                已送出
              </div>
            </div>
            <div class="show-date">
              {{ currentLovebox.on_shelve_at | smartDate }} 刊登
            </div>
          </div>
          <div class="address">
            <span class="icon"></span>
            <span class="txt">
              {{ currentLovebox.company && (currentLovebox.company.company_name || currentLovebox.company.name) }}
            </span>
          </div>
        </div>
        <div class="data">
          <div class="amount">
            <span class="icon"></span>
            <span class="txt">
              數量共{{currentLovebox.total}}個,剩餘
              <i class="num">{{currentLovebox.remain}}</i>個
            </span>
          </div>
          <div class="wrapper">
            <div class="category">物品類別：{{ currentLovebox.goods_class }}</div>
          </div>
        </div>
        <div class="ships">
          <div class="title">
            <span class="icon"></span>
            <span class="txt">寄送方式任選：</span>
          </div>
          <div class="content">
            <div class="ship">
              <span class="way">新竹物流</span>
              <span class="ship-fee">150元</span>
              <span class="ship-opt"> <i class="dot">·</i>索取者貨到付款</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tabs">
      <tab
        :line-width="2"
        custom-bar-width="24px"
      >
        <tab-item
          :key="value.key"
          :selected="key === tabType"
          v-for="(value, key) in tabItems"
          @on-item-click="() => switchTabItem(key, value.index)"
        >
          {{value.label}}
        </tab-item>
      </tab>
      <div class="content">
        <div v-show="tabType === key" :key="value.key" v-for="(value, key) in tabItems" :class="value.type">
          <p v-show="value.isLoading" style="text-align:center;">
            <inline-loading>
            </inline-loading>
            <span style="vertical-align:middle;display:inline-block;font-size:14px;">加載中...</span>
          </p>
          <no-data v-if="!value.data.length && !value.isLoading">
          </no-data>
          <template v-if="!(!value.data.length && !value.isLoading) && key === 'thank'">
            <comment-item
              :item-type="itemType"
              :c-type="value.type"
              :key="'parent' + index"
              :info="item"
              v-for="(item, index) in thanks">
            </comment-item>
          </template>
          <template v-if="!(!value.data.length && !value.isLoading) && key === 'request'">
              <love-box-request
                :key="index"
                :info="item"
                v-for="(item, index) in requests">
              >
            </love-box-request>
          </template>
        </div>
      </div>
    </div>
    <div v-if="!isMine" class="shop-box">
      <x-number
        class="num-btn"
        :max="currentLovebox.remain"
        :min="1"
        fillable
        width="30px"
        button-style="round"
        v-model="quantity"
      />
      <x-button
        @click.native="addToShopCart"
        :disabled="!currentLovebox.remain"
        class="add-btn"
        type="warn"
      >
        加入禮物車
      </x-button>
    </div>
    <share-bar
      :title="currentLovebox.goods_name"
      :desc="currentLovebox.desc"
      :image="currentLovebox.goods_picture"
      :shareSuc="shareSuc"
      @hideShareBar="hideShareBar"
      :is-show="isShowShareBar"
    >
    </share-bar>
    <image-enlarge
      :image="image"
      @toggleShow="toggleShow"
      :is-show="isEnlargeImage">
    </image-enlarge>
  </div>
</template>

<script>
import { Tab, TabItem, XButton, Swiper, SwiperItem, InlineLoading, XNumber } from 'vux'
import UserDefault from '@/assets/icon/icon-default-avatar.png'
import GiftDefault from '@/assets/img/bg-default-gift.png'
import CommentItem from '@/components/CommentItem'
import { shipMapping, LOVE_BOX_STATUS } from '@/tools/constant'
import NoData from '@/components/NoData'
import ShareBar from '@/components/ShareBar'
import { mapState, mapActions } from 'vuex'
import {smartImagePath} from '@/tools/ObjectHelper'
import LoveBoxRequest from '@/components/LoveBoxRequest'
import Elapsed from 'elapsed'
import {dateStandard} from '@/tools/datetime'
import { local, KEY_USER_TOKEN } from '@/tools/storage'
import ImageEnlarge from '@/components/ImageEnlarge'
import addDays from 'date-fns/add_days'
import isAfter from 'date-fns/is_after'
// import { is_after as isAfter, add_days as addDays } from 'date-fns'

export default {
  props: {
    itemType: {
      type: String,
      default: 'need'
    }
  },
  components: {
    Tab,
    TabItem,
    XButton,
    CommentItem,
    Swiper,
    SwiperItem,
    InlineLoading,
    NoData,
    ShareBar,
    XNumber,
    LoveBoxRequest,
    ImageEnlarge
  },
  data () {
    return {
      UserDefault,
      GiftDefault,
      shipMapping,
      smartImagePath,
      cMsg: '',
      isShowShareBar: false,
      isSendCMsg: false,
      cPlaceHolder: '回覆',
      parentCommentId: null,
      cType: '',
      tabIndex: 0,
      tabType: 'thank',
      tabItems: {
        thank: {
          index: 0,
          key: 'thank-1',
          label: '感謝',
          type: 'thank',
          isLoading: true,
          data: []
        },
        request: {
          key: 'request-1',
          index: 1,
          label: '索取者',
          type: 'request',
          isLoading: true,
          data: []
        }
      },
      show: false,
      quantity: 1,
      isAdd: false,
      isEnlargeImage: false,
      image: ''
    }
  },
  created () {
    const id = this.$route.params.id
    const token = local.get(KEY_USER_TOKEN)
    if (token && !this.userInfo.id) {
      this.getLoginUserInfo()
    }
    this.getLoveboxInfo({
      id,
      cb: this.getTabItemsInfo
    })
  },
  methods: {
    ...mapActions({
      getLoveboxInfo: 'getLoveboxInfo',
      getLoginUserInfo: 'getLoginUserInfo',
      getLoveboxThanks: 'getLoveboxThanks',
      getLoveboxOrderItems: 'getLoveboxOrderItems',
      addlovboxItem: 'addlovboxItem',
      getLoveCart: 'getLoveCart'
    }),
    shareSuc () {
      this.$vux.toast.text('分享成功', 'bottom')
      this.hideShareBar()
    },
    getTabItemsInfo () {
      const id = this.$route.params.id
      // 获取当前物品索取者留言
      this.getLoveboxOrderItems({
        id,
        cb: this.getRequestCb
      })
      // 获取当前物品感谢留言
      this.getLoveboxThanks({
        id,
        cb: this.getThankCb
      })
    },
    toUser () {
      const userId = this.currentLovebox.employee_id
      this.$router.push(this.userInfo.id === userId ? '/userinfo' : `/user/${userId}`)
    },
    // 加入禮物車
    addToShopCart () {
      if (!localStorage.getItem('KEY_USER_TOKEN')) {
        return this.$router.replace(`/login?redirect=/lovebox/${this.$route.params.id}`)
      }
      if (!this.currentLovebox.remain) {
        return this.$vux.toast.text('物品庫存不足，無法加入禮物車', 'bottom')
      }
      if (this.userInfo.catHash !== 'commonweal' &&
          this.userInfo.catHash !== 'school') {
        if (!this.canNormalRequest) {
          return this.$vux.toast.text('愛箱送禮物上架5天內，限定公益團體/學校單位索取，之後開放全站索取~', 'bottom')
        }

        if (this.userInfo.verify && !this.userInfo.verify.vip) {
          this.$vux.toast.show({
            type: 'text',
            width: 'auto',
            position: 'bottom',
            time: 5000,
            text: '只有贈物網的大V才能索取愛箱送物品哦～趕快前往個人中心完成郵箱驗證和手機驗證，完成兩項驗證立即獲得大V標誌！'
          })
          return
        }
      }

      if (!this.isAdd) {
        this.isAdd = true
        const id = this.$route.params.id
        this.addlovboxItem({
          id,
          quantity: this.quantity,
          cb: (data) => {
            this.isAdd = false
            if (data.error) {
              if (data.error === 'NO_ENOUGH_PROVISIONS') {
                this.$vux.toast.text('當前禮物庫存不足', 'bottom')
                return
              } else if (data.error === 'CAN_NOT_ADD_TO_CART' || data.error === 'ACCESS_DENY') {
                this.$vux.toast.text('愛箱送禮物上架5天內，限定公益團體/學校單位索取～', 'bottom')
                return
              } else {
                this.$vux.toast.text('加入禮物車失敗，請稍後重試', 'bottom')
                return
              }
            }
            this.getLoveCart()
            this.getLoveboxInfo({
              id,
              cb: () => {
                return this.$vux.toast.text('成功加入禮物車，請您在10分鐘內確認索取', 'bottom')
              }
            })
          }
        })
      }
    },
    getRequestCb (obj) {
      this.tabItems['request'].data = obj.data
      this.tabItems['request'].isLoading = false
    },
    getThankCb (obj) {
      this.tabItems['thank'].data = obj.data
      this.tabItems['thank'].isLoading = false
    },
    switchTabItem (type, index) {
      this.tabIndex = index
      this.tabType = type
    },
    // 分享
    showShareBar () {
      this.isShowShareBar = true
    },
    hideShareBar () {
      this.isShowShareBar = false
    },
    enLargeImage (url = '') {
      if (url) {
        this.image = url
        this.toggleShow()
      }
    },
    toggleShow () {
      this.isEnlargeImage = !this.isEnlargeImage
    }
  },
  computed: {
    ...mapState({
      currentLovebox: state => state.lovebox.curLovebox,
      userInfo: state => state.user.userInfo
    }),
    isMine () {
      return this.userInfo.id === this.currentLovebox.employee_id
    },
    requests () {
      return this.tabItems['request'].data
    },
    thanks () {
      const thanks = this.tabItems['thank'].data.filter((item) => {
        return item.parent_thanks_id === 0
      })
      const childRequests = this.tabItems['thank'].data.filter((item) => {
        return item.parent_thanks_id !== 0
      })
      for (let i = 0; i < thanks.length; i++) {
        thanks[i] = {
          ...thanks[i],
          child_thanks: []
        }
        childRequests.map((item) => {
          if (item.parent_thanks_id === thanks[i].id) {
            thanks[i].child_thanks.unshift(item)
          }
        })
      }
      return thanks
    },
    canNormalRequest () {
      let onDate = new Date(dateStandard(this.currentLovebox.on_shelve_at))
      onDate.setHours(0)
      onDate.setMinutes(0)
      onDate.setSeconds(0)
      let requestDate = addDays(onDate, 5)
      return isAfter(new Date(), requestDate)
    },
    pulloffTime () {
      const days = 15 - new Elapsed(new Date(dateStandard(this.currentLovebox.on_shelve_at)), new Date()).days.num - 1
      return days > 0 ? days : 0
    },

    isOnShelve () {
      return this.currentLovebox.status === LOVE_BOX_STATUS.STATUS_ON_SHELVE
    }
  }
}
</script>

<style lang="less">
  .love-box-detail{
    > .pics{
      .item-dots{
        z-index: 50;
        a {
          margin-left: 0 !important;
          .vux-icon-dot{
            height: 3px !important;
            width: 15px !important;
            background-color: rgba(255,255,255,.25) !important;
            &.active{
              background-color: @color-font-C4 !important;
            }
          }
        }
      }
    }
    .tabs{
      .vux-tab{
        .vux-tab-item{
          background: none;
          font-size: @font-S1;
          &.vux-tab-selected{
            color: @color-font-CR;
            font-size: 19px;
          }
        }
        .vux-tab-bar-inner{
          background: linear-gradient(to right, @color-font-CR 50%, @color-CO 50%)
        }
      }
    }
    .message-input{
      position: relative;
      .weui-cell__ft{
        display: flex;
        align-items: center;
      }
      .weui-cell__hd{
        position: absolute;
        right: @pm-bg;
        top: 0;
      }
      .box{
        .weui-cells{
          &:before, &:after{
            display: none;
          }
          .vux-x-textarea{
            padding: 0 50px 0 @pm-bg;
            .weui-cell__bd{
              padding: @pm-md;
              border: 1px solid @color-CL;
            }
          }
        }
      }
    }
    .weui-tabbar, .vux-tabbar-simple {
      .weui-tabbar__item {
        padding-top: 0;
        .weui-tabbar__label{
          > p{
            display: inline-flex;
            align-items: center;
          }
          span{
            margin-left: 8px;
            font-size: 14px;
          }
        }
        &.weui-bar__item_on, &.weui-bar__item {
          .weui-tabbar__label {
            color: @color-font-C1;
          }
        }
      }
    }
    .weui-tabbar__label {
      color: @color-font-C1;
    }
    .weui-cell{
      .vux-cell-primary{
        flex: 0 0 auto;
      }
      .vux-number-round{
        .vux-number-input{
          width: 32px !important;
          font-size: @font-S3;
        }
        .vux-number-selector{
          border: none;
          svg {
            fill: #FFF;
          }
          &.vux-number-selector-sub, &.vux-number-selector-plus{
            padding: 0;
            background: @color-CR;
          }
          &.vux-number-disabled{
            background: @color-DSA;
          }
        }
      }
      .vux-number-input{
        padding: 0;
        color: @color-font-C3;
        font-size: @font-S3;
      }
    }
    .add-btn.weui-btn{
      border-radius: 0;
      &:after{
        border-radius: 0;
      }
      &.weui-btn_disabled{
        &:after{
          border: none;
        }
      }
    }
  }
</style>

<style lang="less" scoped>
  @import '../../global.mixin.less';
  .love-box-detail{
    padding-bottom: 50px;
    text-align: left;
    line-height: 1;
    -webkit-overflow-scrolling: touch;
    &.my-love-box{
      padding-bottom: 0;
    }
    .shop-box{
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 4;
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 50px;
      box-shadow: 3px 0 20px rgba(0, 0, 0, .18);
      background: #FFF;
      .num-btn{
        flex: 1;
      }
      .add-btn{
        flex: 0 0 120px;
      }
    }
    > .pics{
      position: relative;
      .img-item{
        width: 100%;
        height: 290px;
        overflow: hidden;
        background-size:100% auto;
        background-repeat:no-repeat;
        background-position: center center;
        background-color: @color-CBG;
      }
      .swiper-img{
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .title{
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 60px 85px @pm-md @pm-md ;
        width: 100%;
        color: @color-font-C4;
        font-size: 18px;
        background-image: url("./../../assets/img/bg-banner-mask.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
      .share-btn{
        position: fixed;
        top: @pm-bg;
        right: @pm-bg;
        width: 36px;
        height: 36px;
        background: url('../../assets/icon/itemDetail/gift_nav_ic_share_normal@2x.png') center center no-repeat;
        background-size: 36px 36px;
      }
      .back-icon{
        position: fixed;
        left: 15px;
        top: 15px;
        z-index: 99;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(0, 0, 0, .2);
      }
    }
    .container{
      padding: 0 @pm-bg;
      .info{
        .user-info{
          padding: @pm-lg 0;
          .g-border-1px();
          .detail{
            display: flex;
            align-items: center;
            .avatar{
              margin-right: @pm-bg;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: 1px solid @color-CL;
              overflow: hidden;
              background-size:40px auto;
              background-repeat:no-repeat;
              background-position: center center;
            }
            & > .wrapper{
              flex: 1;
              .user-name{
                color: @color-font-C1;
                font-size: @font-S2;
                font-weight: 700;
              }
              .pull-off-at{
                margin-top: @pm-md;
                color: @color-font-C2;
                font-size: @font-S4;
                .num{
                  color: @color-font-CR;
                  font-style: normal;
                }
              }
            }
            .show-date{
              color: @color-font-C2;
              font-size: @font-S4;
            }
          }
          .address{
            display: flex;
            align-items: center;
            margin-top: 20px;
            .icon{
              margin-right: 8px;
              width: 20px;
              height: 20px;
              background: url('../../assets/icon/itemDetail/gift_list_ic_company@2x.png') center center no-repeat;
              background-size:20px 20px ;
            }
            .txt{
              color: @color-font-C1;
              font-size: @font-S3;
            }
          }
        }
        .data{
          padding: @pm-lg 0;
          .g-border-1px();
          .amount{
            display: flex;
            align-items: center;
            .icon{
              margin-right: 8px;
              width: 20px;
              height: 20px;
              background: url('../../assets/icon/itemDetail/gift_list_ic_amount@2x.png') center center no-repeat;
              background-size:20px 20px ;
            }
            .txt{
              font-size: @font-S2;
              font-weight: 700;
              .num{
                color: @color-font-CR;
                font-style: normal;
              }
            }
          }
          > .wrapper{
            margin-top: @pm-bg;
            font-size: @font-S3;
            .category{
              margin-top: 12px;
            }
            .desc{
              line-height: 20px;
              word-break: break-all;
            }
          }
        }
        .ships{
          margin: @pm-lg 0;
          .title{
            display: flex;
            align-items: center;
            .icon{
              margin-right: @pm-md;
              width: 20px;
              height: 20px;
              background: url('../../assets/icon/itemDetail/gift_list_ic_send@2x.png') center center no-repeat;
              background-size:20px 20px ;
            }
            .txt{
              font-size: @font-S2;
              font-weight: 700;
            }
          }
          .content{
            .ship{
              margin-top: @pm-bg;
              font-size: 0;
              span{
                color: @color-font-C1;
                font-size: @font-S3;
                &.ship-opt{
                  .dot{
                    margin: 0 8px;
                  }
                }
              }
            }
          }
        }
        .progress{
          margin: @pm-lg 0;
          padding-top: @pm-lg;
          border-top: 1px solid @color-CL;
          .title{
            display: flex;
            align-items: center;
            > .icon{
              margin-right: @pm-md;
              width: 20px;
              height: 20px;
              background: url('../../assets/icon/itemDetail/gift_list_ic_plan@2x.png') center center no-repeat;
              background-size:20px 20px ;
            }
            .txt{
              font-size: @font-S2;
              font-weight: 700;
            }
          }
          .content{
            .needItem{
              display: flex;
              align-items: center;
              margin-top: 8px;
              font-size: 0;
              &:first-child{
                margin-top: @pm-bg;
              }
              > .icon{
                margin-right: @pm-md;
                width: 20px;
                height: 20px;
                background: url('../../assets/icon/itemDetail/com_list_ic_gift@2x.png') center center no-repeat;
                background-size:20px 20px ;
              }
              .name{
                flex:none;
                width: 60%;
                color: @color-font-C1;
                font-size: @font-S3;
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
                  margin:0 0 0 @pm-md;
                  color: @color-font-C2;
                  font-size: @font-S4;
                }
              }
            }
          }
        }
        .donate{
          margin: @pm-lg 0;
          padding-top: @pm-lg;
          border-top: 1px solid @color-CL;
          .title{
            display: flex;
            align-items: center;
            > .icon{
              margin-right: @pm-md;
              width: 20px;
              height: 20px;
              background: url('../../assets/icon/itemDetail/com_pic_default_head@2x.png') center center no-repeat;
              background-size:20px 20px ;
            }
            .txt{
              font-size: @font-S2;
              font-weight: 700;
            }
          }
          .content{
            margin-left: 2px;
            .donateItem{
              position: relative;
              display: flex;
              flex-direction: column;
              margin-top: 8px;
              padding-left: @pm-bg;
              font-size: @font-S3;
              border-left: 1px solid @color-CL;
              padding-bottom: @pm-bg;
              &:first-child{
                margin-top: @pm-bg;
              }
              .dot-wrapper{
                position: absolute;
                top: 0;
                left: -8px;
                width: 15px;
                height: 15px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #FFF;
                .dot{
                  display: block;
                  width: 5px;
                  height: 5px;
                  background: @color-CBG;
                }
              }
              &:last-child{
                border: none;
                padding-bottom: 0;
                .dot-wrapper{
                  left: -7px;
                }
              }
              .info{
                display: flex;
                align-items: center;
                > .user-name{
                  color: @color-font-C1;
                  font-weight: 700;
                }
                > .donate-num{
                  margin: 0 @pm-sm;
                  color: @color-font-C1;
                }
                > .item-name{
                  color: @color-font-CR;
                }
              }
              .time{
                margin-top: 8px;
                color: @color-font-C3;
              }
            }
          }
        }
      }
    }
    .tabs{
      border-top: 10px solid @color-CBG;
      .content{
        margin-top: 30px;
        padding: 0 @pm-bg;
        min-height: 100px;
      }
    }
    .tab-bar-box{
      position: fixed;
      bottom: 0;
      z-index: 50;
      width: 100%;
      max-width: @max-width;
    }
    .message-input{
      position: absolute;
      bottom: 0;
      left: 0;
      top: 0;
      right: 0;
      z-index: 501;
      &.fade-enter-to, &.fade-leave-to{
        transition: opacity 0.3s;
      }
      &.fade-enter, &.fade-leave-to{
        opacity: 0;
      }
      .mask{
        width: 100%;
        height: 100%;
        background:rgba(0,0,0,0.5);
      }
      .box{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #FFF;
        > .pics{
          margin-top: @pm-bg;
          padding: 0 @pm-bg @pm-bg;
        }
      }
    }
  }
</style>
