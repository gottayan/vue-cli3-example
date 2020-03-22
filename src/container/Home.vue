<template>
  <div class="g-block null">
    <div class="maskwelcome" v-if="welcomeFlag">
      <welcome  @welcomeHidden="welcomeHidden"></welcome>
    </div>
     <div class="maskadd" v-if="addFlag">
      <add  @addHidden="addHidden"></add>
    </div>
     <div class="mask" v-if="giftFlag">
      <gift  @giftHidden="giftHidden"></gift>
    </div>
    <div class="pad-search-bar">
      <button class="btn-to-search" @click="toSearch">
        <img class="icon"
             src="../assets/icon/gift/icon-search.png">
        搜尋您心儀的禮物或者需求
      </button>
      <img
        @click="toFeedback"
        :src="iconNav"
        class="right-icon"
        width="22"
        height="22">
    </div>
    <div class="home-container">
      <swiper
        loop
        auto
        dots-class="home-container-dots"
        :show-desc-mask="false">
        <swiper-item :key="index" v-for="(item, index) in bannerList">
          <a
            :href="item.url && item.url.replace('www.give543.com', 'm.give543.com') || 'javascript;'"
            target="_blank">
            <img
              class="home-swiperitem-img"
              :src="item.img | smallImage"
              alt="">
            <span
              v-if="item.title"
              class="home-swiperitem-desc">
              {{item.title}}
            </span>
          </a>
        </swiper-item>
      </swiper>
      <home-modules
        :activityTitle="activities.length ? activities[0].name.slice(0, 5) : ''"
      >
      </home-modules>
      <section v-if="commonwealList.length" class="home-commonweal-panel">
        <give-title
          title="公益團體需求"
          link="/needs?userRoleType=commonweal">
        </give-title>
        <div class="home-commonweal-wrapper">
          <commonweal-item
            v-for="item in commonwealList"
            :key="item.id"
            :url="item.image_path"
            :title="item.title"
            :progress="item.progress"
            :status="item.status"
            :id="item.id"
            :total="item.total"
            :sents="item.sents"/>
        </div>
      </section>
      <section v-if="giftList.length" class="home-cabinet-panel">
        <router-link to="/cabinetGift" class="home-cabinet-link">
          <give-title
            moreText="掌櫃快捷寄送"
            title="名櫃好禮"
            link="/cabinetGift">
          </give-title>
          <div class="home-cabinet-wrapper">
            <cabinet-gift-item
              v-for="(item, index) in giftList"
              :key="index"
              :image="item.image_path"
              :title="item.title"
            />
          </div>
        </router-link>
      </section>
      <div class="home-loading" v-if="!giftsList.length">
        <spinner type="lines">
        </spinner>
        載入中...
      </div>
      <home-gift-card
        v-else
        v-for="item in giftsList"
        :key="item.id"
        :userName="(item.user && item.user.nickname) || '無暱稱'"
        :userId="item.user_id"
        pics=""
        :isNew="item.is_new"
        :status="item.status"
        :time="item.show_at"
        :giftId="item.id"
        :desc="item.desc"
        :city="item.city || ''"
        :district="item.district || ''"
        :image="item.image_path"
        :portrait="item.user && item.user.pics"
        :left="item.left"
        :title="item.title || ''"
        :isTracing="item.is_tracing">
      </home-gift-card>
      <divider v-if="giftsList.length" class="g-divider p-divider">
        <router-link to="/gifts" class="link">點擊查看更多禮物</router-link>
      </divider>
      <release>
      </release>
    </div>
  </div>
</template>

<script>
import GiveTitle from '../components/Title'
import CommonwealItem from '../components/CommonwealItem'
import HomeGiftCard from '../components/HomeGiftCard'
import HomeModules from '../components/HomeModules'
import Release from '../components/Release'
import { Swiper, SwiperItem, Spinner, Divider } from 'vux'
import { mapState, mapActions } from 'vuex'
import iconNav from '@/assets/icon/lovebox/com_nav_ic_q&a_normal@2x.png'
import scrollMixin from '@/mixins/scroll'
import welcome from './userGuide/welcome'
import add from './userGuide/add'
import gift from './userGuide/gift'
import CabinetGiftItem from '../container/cabinetGift/HomeItem'

export default {
  mixins: [scrollMixin],
  components: {
    Swiper,
    SwiperItem,
    Spinner,
    GiveTitle,
    CommonwealItem,
    HomeGiftCard,
    HomeModules,
    Divider,
    Release,
    welcome,
    add,
    gift,
    CabinetGiftItem
  },
  data () {
    return {
      iconNav,
      welcomeFlag: false,
      addFlag: false,
      giftFlag: false
    }
  },
  computed: {
    ...mapState({
      bannerList: state => state.home.bannerList,
      commonwealList: state => {
        const tmp = state.home.commonwealList
        const result = tmp.map((item) => {
          let total = 0
          let left = 0
          item.need_items.forEach(child => {
            total += child.quantity
            left += child.left
          })
          return {
            ...item,
            total,
            sents: total - left,
            progress: `${parseFloat((total - left) / total).toFixed(2) * 100}%`
          }
        })
        return result
      },
      isLogin: state => !!state.user.token,
      giftsList: state => state.home.giftsList,
      userInfo: state => state.user.userInfo,
      giftList: state => state.gifts.homeGiftList,
      activities: state => state.things.activities.data
    })
  },
  methods: {
    toSearch () {
      this.$router.push('/search')
    },
    toFeedback () {
      this.$router.push('/faq')
    },
    ...mapActions({
      getBanner: 'getHomeBanner',
      getHomeCommonweal: 'getHomeCommonweal',
      getHomeGifts: 'getHomeGifts',
      getLoginUserInfo: 'getLoginUserInfo',
      getGiftList: 'getGiftList',
      getCurrentActivities: 'getCurrentActivities'
    }),
    welcomeHidden: function (welcomeHidden, addShow) {
      this.welcomeFlag = welcomeHidden
      this.addFlag = addShow
    },
    addHidden (addHidden) {
      this.addFlag = addHidden
    },
    giftHidden (giftHidden) {
      this.giftFlag = giftHidden
    }

  },
  created () {
    var localStorage = null
    localStorage = window.localStorage
    if (localStorage.getItem('isShow')) {
      this.welcomeFlag = false
    } else {
      localStorage.setItem('isShow', '1')
      this.welcomeFlag = true
    }
    if (parseInt(this.$route.query.guide) === 1) {
      this.welcomeFlag = false
      this.giftFlag = this.$route.query.guide
    }
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      this.getLoginUserInfo()
    }
    if (!this.bannerList.length) {
      this.getBanner()
    }
    if (!this.commonwealList.length) {
      this.getHomeCommonweal()
    }
    if (!this.giftsList.length) {
      this.getHomeGifts()
    }
    if (!this.getGiftList.length) {
      this.getGiftList({
        page: 1,
        onPool: 1,
        type: 2,
        perPage: 3,
        home: true,
        noRequestList: true
      })
    }
    if (!this.activities.length) {
      this.getCurrentActivities()
    }
  },
  mounted () {
    this.initialContainer('.home-container', 'HOME_OFFSET')
  }
}
</script>

<style lang="less">
  @import "./../global.mixin.less";
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    // z-index: 1;
    z-index: 999;
  }
  .maskwelcome {
    position: fixed;
    width: 100%;
    max-width: @max-width;
    height: 100%;
    overflow: hidden;
    z-index: 999;
  }
  .maskadd {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 999;
  }
  .pad-search-bar {
    position: relative;
    background: linear-gradient(to right, #ff9616 20%, #ff8415);
    padding: 5px 52px 5px @pm-bg;
    overflow: hidden;
    .btn-to-search {
      height: 34px;
      width: 100%;
      float: left;
      border: none;
      color: rgba(255,255,255,.75);
      background-color: rgba(255,255,255,.15);
      border-radius: 20px;
      vertical-align: middle;
      font-size: @font-S3;
      .icon {
        opacity: .75;
        height: @font-S2;
        width: @font-S2;
        position: relative;
        top: 3px;
        margin-right: @pm-sm;
        filter: brightness(150%);
      }
    }
    .right-icon{
      position: absolute;
      top: 11px;
      right: @pm-bg;
    }
  }
  .home-container{
    background-color: @color-CBG;
    height: calc(~"100% - 50px");
    overflow-y: auto;
    overflow-x: hidden;
    .vux-swiper-item {
      overflow: hidden;
      position: relative;
      img {
        height: 100%;
        width: auto;
        position: absolute;
        .center-horizontal;
      }
    }
    .vux-swiper-desc{
      box-sizing: content-box;
    }

    .home-swiperitem-img{
      width: 100%;
    }

    .p-divider{
      padding: @pm-bg 0 !important;
    }
    .p-divider .link{
      color: @color-font-C2;
    }

    .home-swiperitem-desc{
      position: absolute;
      padding: 60px 85px @pm-md @pm-md ;
      bottom: 0;
      left: 0;
      right: 0;
      color: white;
      font-size: @font-S4;
      font-weight: 500;
      background-image: url("./../assets/img/bg-banner-mask.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      // background-image: linear-gradient(to top, rgba(0,0,0,.7), rgba(255, 255, 255, .1))
      /* background-color: rgba(223, 95, 60, .7); */
    }
    .vux-indicator.vux-indicator-right {
      right: @pm-bg;
      bottom: @pm-bg;
      a {
        margin: 0;
        height: 3px;
        vertical-align: top;
      }
      .vux-icon-dot {
        width: 15px;
        height: 3px;
        float: left;
        background-color: rgba(255,255,255,.25);
        transition: background-color .3s;
        &.active {
          background-color: white;
        }
      }
    }
  }
  .home-commonweal-panel{
    padding: 0 15px 24px;
    background-color: white;
    border-top: 10px solid @color-CBG;
    .g-title{
      margin: 24px 0;
    }
    .home-commonweal-wrapper{
      white-space: nowrap;
      overflow-x: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .home-cabinet-panel {
    padding: 0 15px 24px;
    background-color: white;
    border-top: 10px solid #f6f6f6;
    .home-cabinet-link,
    .home-cabinet-link:hover {
      color: #28292b;
    }
    .home-cabinet-wrapper {
      overflow: hidden;
    }
    .g-title{
      margin: 24px 0;
    }
  }

  .home-loading{
    text-align: center;
    margin: 20px 0;
  }
</style>
