<template>
  <div
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="20"
    class="fathersday g-smooth">
    <sticky :offset="0">
      <x-header
        :left-options="{
          preventGoBack: true
        }"
        @on-click-back="goBack"
      >活動詳情</x-header>
    </sticky>
    <div class="banner">
      <img src="../assets/img/father/bg-mobile.png" alt="">
       <div class="count">
        <div class="item">
          <h2>{{dataInfo.total}}</h2>
          <P>上傳人數</P>
        </div>
        <div class="item">
          <h2>{{likes}}</h2>
          <p>累計投票</p>
        </div>
        <div class="item">
          <h2>{{views}}</h2>
          <p>訪問人次</p>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="searchTime">
        <div class="search">
          <input type="text" placeholder="輸入署名或作品編號" v-model="searchInfo.keyword">
          <button class="btn-search" type="button" @click="searchItem(searchInfo.keyword)"></button>
        </div>
        <div class="time">
          <div class="showtime" @click="goRewards">
            <div class="pic">
              <img src="../assets/img/father/home_ic_way_normal@3x.png" alt="">
            </div>
            <div class="countDown">
              <p>距離結束時間還有</p>
              <h2>{{leftTime}}</h2>
            </div>
          </div>
          <button class="btn-join" @click="handlePublish">
            <img src="@/assets/img/father/home_btn_font_join@2x.png" alt="">
          </button>
        </div>
      </div>
      <div class="all">
        <div class="allNav">
          <div
            :class="`allNavItem${activeIndex === index ? ' active' : ''}`"
            :key="item.value"
            v-for="(item, index) in tabAry"
            @click="toggleActiveIndex(index)"
          >
            <span class="navitem-label">{{item.label}}</span>
          </div>
        </div>
        <div class="voteInfo" v-show="activeIndex === 0">
          <grid
            class="infinite-container"
            :cols="2"
            :show-lr-borders="false"
            :show-vertical-dividers="false"
          >
            <grid-item
              v-for="(item) in dataInfo.data"
              :key="item.id"
            >
              <item-card
                :isEnd="isEnd"
                :item="item"
                :handleVoteup="handleVoteup"
                :handleClick="handleItemClick"
              ></item-card>
            </grid-item>
          </grid>
        </div>
        <div
          class="voteInfo"
          v-show="activeIndex === 1">
          <grid
            :cols="2"
            :show-lr-borders="false"
            :show-vertical-dividers="false"
          >
            <grid-item
              v-for="(item) in famousList"
              :key="item.id"
            >
              <item-card
                :isEnd="isEnd"
                :item="item"
                :handleVoteup="handleVoteup"
                :handleClick="handleItemClick"
              ></item-card>
            </grid-item>
          </grid>
        </div>
      </div>
    </div>
    <!-- <a id="goTop" @click.stop.prevent="goTop" href="javascript;">
      <img src="../assets/img/father/home_ic_top_normal@3x.png" v-show="goTopShow"  alt="" >
    </a> -->
    <festival-modal
      v-show="visibleModal"
      :item="currentData"
      :handleShare="showShareBar"
      :handleVoteup="handleVoteup"
      :handleClose="() => visibleModal = false"
    ></festival-modal>
    <share-bar
      title="Give543 贈物網——八月揪阿爸呷好料活動"
      :url="`${href}/${currentData.no}`"
      :desc="`我正在參加贈物網的“八月揪阿爸呷好料”活動，我是No.${currentData.no}-${currentData.signature}，快來投我一票吧~`"
      :image="currentData.image"
      :shareSuc="shareSuc"
      @hideShareBar="hideShareBar"
      :is-show="isShowShareBar">
    </share-bar>
  </div>
</template>

<script>
import { FATHERSDAY_ENDTIME } from '@/tools/constant'
import { Grid, GridItem, Sticky } from 'vux'
import ItemCard from '@/components/FatherItem'
import FestivalModal from '@/container/fathersDay/FathersDayInfo'
import { mapState, mapActions } from 'vuex'
import format from 'date-fns/format'
import infiniteScroll from 'vue-infinite-scroll'
import goBackMixin from '@/mixins/goBack'
import ShareBar from '@/components/ShareBar'
import isToday from 'date-fns/is_today'
import isTomorrow from 'date-fns/is_tomorrow'
// import { format, is_today as isToday, is_tomorrow as isTomorrow } from 'date-fns'

export default {
  mixins: [goBackMixin],
  directives: {
    infiniteScroll
  },
  components: {
    ItemCard,
    FestivalModal,
    Grid,
    GridItem,
    Sticky,
    ShareBar
  },
  data () {
    return {
      visibleModal: false,
      leftTime: '00天00時00分00秒',
      activeIndex: 0,
      timer: null,
      tabAry: [{
        label: '全部',
        value: 0
      }, {
        label: '人氣排行榜',
        value: 1
      }],
      searchInfo: {
        perPage: 20,
        festival_id: 2,
        keyword: ''
      },
      keyword: '',
      goTopShow: true,
      scrollTop: 0,
      currentData: {},
      busy: false,
      isShowShareBar: false,
      href: '',
      isEnd: false, // 標識活動是否結束
      myRecordInfo: {
        records: [],
        vote_ups: []
      }
    }
  },
  computed: {
    ...mapState({
      dataInfo: state => state.festival.dataInfo,
      famousList: state => state.festival.famousList,
      likes: state => state.festival.likes,
      views: state => state.festival.views,
      isLogin: state => !!state.user.userInfo.id,
      verifyPhone: state => state.user.userInfo.veriCell === 'Y',
      isEmailType: state => state.user.userInfo.types === 'EMAIL'
    })
  },
  methods: {
    ...mapActions({
      getFestival: 'getCurrentFestivalData',
      getFamous: 'getFestivalFamousData',
      getLike: 'getCurrentFestivalLike',
      handleVote: 'sendVote',
      getItemData: 'getFestivalUserInfoData',
      getViews: 'getCurrentFestivalViews',
      getMyRecordInfo: 'getMyFestivalInfo'
    }),
    shareSuc () {
      this.$vux.toast.text('分享成功', 'bottom')
      this.hideShareBar()
    },
    showShareBar () {
      this.isShowShareBar = true
    },
    hideShareBar () {
      this.isShowShareBar = false
    },
    goRewards () {
      this.$router.push('/fathersDay/rewards')
    },
    toggleActiveIndex (index) {
      this.activeIndex = index
    },
    handleLeftTime () {
      const ENDTIME = new Date(FATHERSDAY_ENDTIME)
      const now = new Date()
      const LEFTTIME = ENDTIME - now - 115200000
      const isHideDays = isToday(ENDTIME) || isTomorrow(ENDTIME)
      if ((now - ENDTIME) >= 0) {
        this.leftTime = '活動已結束'
        clearInterval(this.timer)
        this.timer = ''
        this.isEnd = true
        return
      }
      this.leftTime = format(LEFTTIME, isHideDays ? 'HH時mm分ss秒' : 'DD天HH時mm分ss秒')
    },
    handlePublish () {
      if (this.isEnd) {
        this.$vux.toast.text('活動已結束，感謝您的參與~', 'bottom')
      } if (!this.isLogin) {
        this.$router.replace('/login?redirect=/fathersday/release')
      } else if (this.myRecordInfo.records.length) {
        this.$vux.toast.text('您已參與本次活動，不可重複參與，去給喜歡的作品送愛心吧~', 'bottom')
      } else if (!this.verifyPhone && this.isEmailType) {
        this.$vux.toast.show({
          text: '完成手機快捷驗證，可參加活動及贈送索取物品，4秒後自動為您跳轉',
          position: 'bottom',
          time: 4000,
          type: 'text',
          width: '11em'
        })
        setTimeout(() => {
          this.$router.replace('/verifycellphone')
        }, 4500)
      } else {
        this.$router.push('/fathersday/release')
      }
    },
    searchItem (id) {
      if (!id) {
        return this.$vux.toast.text('請輸入編號')
      }

      this.getFestival({
        options: {
          keyword: id,
          festival_id: 2,
          perPage: 1
        },
        isSearch: true,
        cb: (data) => {
          if (data.error) {
            return this.$vux.toast.text(`查找錯誤`)
          } else if (!data.data.length) {
            return this.$vux.toast.text('暫未檢測到相關數據', 'bottom')
          }
          this.currentData = data.data[0]
          this.visibleModal = true
        }
      })
    },
    goTop () {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      window.pageYOffset = 0
      document.documentElement.scrollY = 0
    },
    handleVoteup (id) {
      if (this.isEnd) {
        this.$vux.toast.text('活動已結束，感謝您的參與~', 'bottom')
        return
      }

      if (!this.isLogin) {
        this.$vux.toast.text('請先登入，3秒後為您自動跳轉登入頁面', 'bottom')
        setTimeout(() => {
          this.$router.replace(`/login?redirect=${this.$route.fullPath}`)
        }, 3500)
        return
      }

      this.handleVote({
        id,
        cb: (data) => {
          if (data.error === 'NOT_VERIFY') {
            this.$vux.toast.show({
              text: '完成手機快捷驗證，可參加活動及贈送索取物品，4秒後自動為您跳轉',
              position: 'bottom',
              time: 4000,
              type: 'text',
              width: '11em'
            })
            setTimeout(() => {
              this.$router.replace('/verifycellphone')
            }, 4500)
            return
          }

          if (data.error) {
            return this.$vux.toast.text(`投票失敗，${data.error}`, 'bottom')
          }
          this.$vux.toast.text('投票成功！', 'bottom')
          this.currentData = {
            ...this.currentData,
            vote_up: data.vote_up,
            isVoted: true
          }
        }
      })
    },
    handleItemClick (item) {
      this.currentData = item
      this.visibleModal = true
    },
    loadMore () {
      if (this.activeIndex !== 0) {
        return
      }

      this.busy = true
      this.getFestival({
        options: this.searchInfo,
        cb: this.loadCb
      })
    },
    loadCb (data) {
      if (data.data.length) {
        this.searchInfo = {
          ...this.searchInfo
        }
        this.busy = false
      }

      if (!data.next_page_url) {
        this.busy = true
      }
    }
  },
  created () {
    if (this.$route.params.id) {
      this.searchItem(this.$route.params.id)
    }

    if (this.dataInfo.next_page_url) {
      this.loadMore()
    }
    this.getFamous({
      options: {
        festival_id: 2
      },
      cb: () => {}
    })
    this.handleLeftTime()
    this.timer = setInterval(() => this.handleLeftTime(), 1000)
    this.isEnd = new Date() - new Date(FATHERSDAY_ENDTIME) >= 0
  },
  mounted () {
    this.getViews({id: 1})
    this.getLike({id: 2})
    this.getMyRecordInfo({
      options: {
        festival_id: 2
      },
      cb: (data) => {
        this.myRecordInfo = data
      }
    })
    this.href = window.location.href
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>

 <style lang="less">
 @import '../container/fathersDay/style.less';
 .fathersday{
   .weui-grid:after{
     content: '';
     position: static;
   }
 }
 </style>

<style lang="less"  scoped>
@import '~vux/src/styles/1px.less';
.fathersday {
  overflow-y: scroll;
  height: 100%;
#goTop {
  display: inline-block;
  width: 50px;
  height: 50px;
  position: fixed;
  right: 10px;
  bottom: 10px;
  cursor: pointer;
  img{
    width: 100%;
    height:100%;
  }
  }
 .overwrite-title-demo {
  margin-top: 5px;
}
.flex-demo {
  text-align: center;
  color: #000;
  background-color: #fff;
  border-radius: 4px;
  background-clip: padding-box;
  height: 40px;
}
.fix{
  position: fixed;
  width: 100%;
  margin: 0;
  line-height: 44px !important;
  z-index: 999;
}
  .overwrite-title-demo {
    margin-top: 5px;
  }
  .flex-demo {
    text-align: center;
    color: #000;
    background-color: #fff;
    border-radius: 4px;
    background-clip: padding-box;
    height: 40px;
  }
.banner{
  position: relative;
  width: 100%;
  img{
    width: 100%;
    display: block;
  }
  .count{
    display: flex;
    margin: 0 auto;
    width: 95%;
    background-color: rgba(255, 255, 255, .8);
    height: 80px;
    border-radius: 10px;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -47.5%;
    z-index: 1;
    .item{
      flex-direction:column;
      flex:1;
      margin: 20px 32px;
      text-align: center;
      h2{
        color:#FF9600;
        font-size: 16px;
        text-align: center;
      }
      p{
        font-size: 12px;
        color: #989898;
        text-align: center;
      }
    }
  }
}
.container{
  width: 100%;
  background: url(../assets/img/father/com_pic_bg@3x.png) repeat center center;
  background-size: contain;
  overflow: hidden;
  padding: 15px;
  box-sizing: border-box;

  .searchTime{
    border-radius: 10px;
    background-color: #fff;
    height: 205px;
    width: 100%;
    // margin: 15px auto 0;
    .search{
      display: flex;
      width: 100%;
      box-sizing: border-box;
      height: 60px;
      align-items: center;
      input[type="text"]{
        padding-left: 20px;
        border:0;
        outline:none;
        flex: 1;
        font-size: @font-S3;
      }
      .btn-search{
        background: url(../assets/img/father/home_btn_search_normal@3x.png) no-repeat center center;
        background-size: contain;
        margin-right:15px ;
        width: 80px;
        height: 32px;
        border:0;
        outline:none;
        vertical-align: bottom;
      }
    }
    .time{
      width:  95%;
      height: 130px;
      margin: 0 auto;
      background-color: #ED583F;
      border-radius: 10px;
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
      .showtime{
        width: 90%;
        margin: 0 auto;
        display: flex;
        .pic{
          flex: 2;
          img{
            width: 100%;
          }
        }
        .countDown{
          margin-left: 32px;
          text-align: center;
          flex: 7;
          display: flex;
          flex-direction: column;
          justify-content: center;
          p{
            color: #fff;
            font-size: 14px;
          }
          h2{
            font-size:20px;
            color: #fff
          }
        }

      }
      .btn-join{
        height: 40px;
        width: 100%;
        background-color: #FFDB34;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        vertical-align: bottom;
        position: absolute;
        bottom:0;
        border:0;
        outline:none;
        img{
          height: 60%;
        }
      }
    }
  }
  .all{
    background-color: #fff;
    width: 100%;
    // margin: 10px auto;
    margin-top: 15px;
    border-radius: 15px;
    .allNav{
      height: 60px;
      width: inherit;
      font-size: 14px;
      display: flex;
      line-height: 60px;
      text-align: center;
      color: #989898;
      .allNavItem{
        flex:1;
        &.active{
          font-size:18px;
          color: #FF9600;
        }
        .navitem-label{
          vertical-align: middle;
          margin: 0 5px;
        }
        &::after,
        &::before{
          content:" ";
          display: inline-block;
          width: 0;
          height: 0;
          border-radius: 50%;
          border: 2px solid #0ff;
          vertical-align: middle;
        }
      }
    }
    .voteInfo{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width: 100%;
      flex-wrap: wrap;
    }
  }
}
}
</style>
