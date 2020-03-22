<template>
  <div class="an-container">
    <x-header
      title="活動">
    </x-header>
    <div class="an-container-active" v-if="bannerList.length">
      <div class="an-slider-wrapper">
        <swiper
          loop
          height="350px"
          auto
          :interval="10000"
          @on-index-change="handleIndexChange">
          <swiper-item :key="index" v-for="(item, index) in bannerList">
            <!-- <a :href="item.url ? item.url.includes('www.give543.com') ? 'javascript:;' : item.url : 'javascript:;'" target="_blank"> -->
              <!-- <span class="left-time" v-if="!isActive">{{isActive ? `還剩 ${distanceDate}` : '活動未開啟' }}</span> -->
              <img class="cover-img" :src="item.pic | smallImage(false)" alt="">
            <!-- </a> -->
          </swiper-item>
        </swiper>
      </div>
      <div class="an-content-wrapper">
        <h2>{{currentActivity.name}}</h2>
        <span>{{currentActivity.email_send_at.slice(0, 10).replace(/-/g, '/')}} 活動開放 <span v-if="isActive">（還剩 {{distanceDate}}）</span></span>
        <p>{{currentActivity.description}}</p>
        <button
          v-if="isActive"
          @click="handleReceive"
          :disabled="isBooked"
          class="btn-receive">
          {{isBooked ? '已經預約' : '馬上預約'}}
        </button>
        <button
          v-else
          @click="viewDetail"
          class="btn-receive">
          查看詳情
        </button>
      </div>
      <div class="an-ft-wrapper" v-if="isActive">
        <span class="g-desc">預約成功後，活動上線時</span>
        <span class="g-desc">贈物小兔將會主動寄e-mail到您指定的信箱</span>
      </div>
      <!--<aside class="aside" @click="goHome">-->
        <!--<img src="../assets/img/com_bottom_ic_close_normal@2x.png" alt="">-->
      <!--</aside>-->
    </div>
    <div class="an-container-empty" v-else>
      <img
        class="an-container-empty-img"
        src="@/assets/icon/com_pic_empty_demand@2x.png"
        alt="">
      <div class="an-container-empty-desc">
        當前暫未開放活動，過一陣再來看吧！~
      </div>
      <button class="g-button plain" @click="$router.go(-1)">返回首頁</button>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from 'vux'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
// import { distance_in_words_to_now as distanceInWordsToNow, is_before as isBefore } from 'date-fns'
import isBefore from 'date-fns/is_before'
import { mapState } from 'vuex'
export default {
  components: {
    Swiper,
    SwiperItem
  },
  data () {
    return {
      activeIndex: 0,
      isLoading: false
    }
  },
  methods: {
    handleReceive () {
      // 未填寫郵箱的情況
      if (!this.userInfo || !this.userInfo.id) {
        this.$vux.toast.text('請先登入', 'bottom')
        setTimeout(() => {
          this.$router.replace(`/login?redirect=/activitynotice`)
        }, 1000)
        return
      }
      if (!this.userInfo.email) {
        this.$vux.toast.show({
          text: '預約活動將會發送活動詳情到您的信箱，您尚未填寫信箱，請先完善資料',
          position: 'bottom',
          time: 3000,
          type: 'text',
          width: '11em'
        })
        setTimeout(() => {
          this.$router.push(`/user/${this.userInfo.id}/editBaseInfo?redirect=/activitynotice`)
        }, 3000)
        return
      }
      if (this.isLoading) {
        return this.$vux.toast.text('正在為您預約活動', 'bottom')
      }
      this.isLoading = true
      this.$store.dispatch('receiveCurrentActivity', {
        id: this.currentActivity.id,
        cb: (data) => {
          this.$store.dispatch('getCurrentActivities')
          this.isLoading = false
          if (data.error) {
            this.$vux.toast.text(data.error, 'bottom')
            return
          }
          this.$vux.toast.text('預約成功', 'bottom')
        }
      })
    },
    viewDetail () {
      let url = this.currentActivity.url
      window.open(url, '_blank')
    },
    handleIndexChange (currentIndex) {
      this.activeIndex = currentIndex
    },
    goHome () {
      console.log('enter')
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    bannerList () {
      return this.$store.state.things.activities.data
    },
    currentActivity () {
      return this.bannerList[this.activeIndex]
    },
    isActive () {
      // return new Date() - new Date(this.currentActivity.time_start) > 0 && new Date() - new Date(this.currentActivity.time_end)
      return isBefore(new Date(), new Date(this.currentActivity.email_send_at.replace(/-/g, '/')))
    },
    distanceDate () {
      return distanceInWordsToNow(new Date(this.currentActivity.email_send_at.replace(/-/g, '/')))
        .replace('about', '')
        .replace(/days|day/g, '天')
        .replace(/hours|hour/g, '小时')
        .replace(/minutes|minute/g, '分钟')
    },
    isBooked () {
      return !!this.currentActivity.is_booked
    }
  },
  created () {
    this.$store.dispatch('getCurrentActivities')
  }
}
</script>

<style lang="less">
  .an-container{
    .vux-slider > .vux-indicator, .vux-slider .vux-indicator-right{
      left: 50%;
      right: auto;
      transform: translate3d(-50%, 0, 0);
    }
  }
  .an-ft-wrapper {
    .g-desc{
      display: block
    }
  }
</style>

<style lang="less" scoped>
  .an-container{
    height: 100%;
    &-active, &-empty{
      min-height: calc(~"100% - 44px");
      overflow-y: scroll;
      overflow-scrolling: touch;
      -webkit-overflow-scrolling: touch;
    }
  }
  .btn-receive{
    outline: transparent;
    color: white;
    background-color: @color-CO;
    width: 120px;
    height: 30px;
    border: none;
    border-radius: 5px;
    margin: 40px auto 10px;
    display: block;
  }

  .left-time{
    position: absolute;
    top: 10px;
    left: 15px;
    color: white;
    font-size: 20px;
  }

  .an-content-wrapper{
    padding: 0 20px;
    h2{
      margin-top: 10px;
    }

    h2+span{
      margin: 10px 0;
      display: inline-block;
    }
  }
  .an-ft-wrapper{
    padding: 0 20px;
    text-align: center;
    margin-bottom:40px;
  }

  .cover-img{
    width: 100%;
    display: block;
  }

  .aside{
    position: fixed;
    top: 5px;
    right: 5px;
    img{
      display: block;
      width: 40px;
      height: 40px;
    }
  }
  .an-container-empty-img{
    display: block;
    margin: 0 auto 20px;
  }

  .an-container-empty-desc{
    text-align: center;
  }

  .plain{
    color: #ffa507;
    background: transparent;
  }
</style>
