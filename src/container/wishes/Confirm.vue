<template>
  <div class="wrap wish-public-style" id="wrap">
    <div class="header">
      <sticky scroll-box="wrap" :offset="0" :check-sticky-support="false">
        <x-header
          title="心願詳情"
        ></x-header>
      </sticky>
      <div class="vux-sticky-fill" style="height:44px;"></div>
    </div>
    <div class="confirm-title">
      <h2>您確定認養該心願嗎?</h2>
    </div>
    <div class="card">
      <div class="img-wrap">
        <div class="img"
             :style="{backgroundImage: `url(${wishItem.image_path || defaultGift})`}"
        />
        <div class="num">
          <p class="np">
            {{wishItem.wish_no}}
          </p>
        </div>
      </div>
      <div class="content">
        <div class="info">
          <div class="title">
            <h3 class="tp">
              心願禮物：{{wishItem.title}}
            </h3>
          </div>
          <!--<div class="adress">-->
           <!--<span>-->
              <!--<img :src="localImg" alt=""/>-->
            <!--</span>-->
            <!--<p class="ap">-->
              <!--{{wishItem.city + wishItem.district+ wishItem.school_name}}-->
            <!--</p>-->
          <!--</div>-->
        </div>
        <div class="list">
          <ul class="request-wish-list">
            <li>
              <span>編號：</span>
              <span>{{wishItem.wish_no || '暫無'}}</span>
            </li>
            <li>
              <span>姓名：</span>
              <span>{{wishItem.student_name || '暫無'}}</span>
            </li>
            <li>
              <span>年級：</span>
              <span>{{wishItem.class_name || '暫無'}}</span>
            </li>
            <li>
              <span>學校：</span>
              <span>{{wishItem.school_name || '暫無'}}</span>
            </li>
            <!--<li>-->
              <!--<span>截止時間：</span>-->
              <!--<span>{{wishItem.done_at || '暫無'}}</span>-->
            <!--</li>-->
          </ul>
        </div>
        <div class="notice">
          <h3>注意事項</h3>
          <p>1.準備全新聖誕禮物，請勿贈送二手物並於收件地址旁註明『禮物編號』及『您的暱稱』，以免禮物找不到認養主人，郵寄至114台北市內湖區新明路273巷6號4F『GIVE543贈物網 幸福偏鄉小組 收』</p>
          <p>2.活動心願認養時間：即日起至12/3</p>
          <p>於認養後開始計算10天內，未收到您所認捐的禮物，將重新開放認養</p>
          <p>✪ 11/25後認養的心願禮物，請最晚於12/04寄出禮物，以郵戳為憑，逾期之禮物將作為隔年的聖誕禮物物資</p>
          <p>3.禮物需符合小朋友卡片願望</p>
          <p>每份聖誕禮物內容：小朋友許下的心願禮物+親手寫下的鼓勵祝福卡片1張</p>
          <p>4.為方便作業流程，禮物請採簡易包裝，核對內容無誤後，主辦單位有大學⽣生志工會再統一包裝禮物</p>
          <p>5.主辦單位收到心願禮物時，心願網站會顯示『認養已送達』，認養人會收到在GIVE543贈物網站中系統通知的感謝留言</p>
          <p>6.主辦單位於聖誕節前夕送禮物至學校(活動花絮可追蹤<a target="_blank" href="https://www.facebook.com/happinessforkids/">幸福偏鄉粉絲頁</a>)</p>
          <p>7.主辦單位寄發小朋友親手寫的感謝卡至資料地址</p>
          <div
            class="btn"
            :class="isEnd && 'disabled-btn'"
            v-show="Object.keys(wishItem).length"
            @click="handleAdoptClick"
          >
            <p class="bp">
              {{statusMap()[wishItem.status]}}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Sticky } from 'vux'
import { smartImagePath } from '@/tools/ObjectHelper'
import defaultGift from '@/assets/icon/img-default-gift.png'
import localImg from '../../assets/img/wishes/wish_ic_location@2x.png'
import { statusMap } from './constants'
export default {
  components: {
    Sticky
  },
  data () {
    return {
      smartImagePath,
      defaultGift,
      localImg,
      statusMap
    }
  },
  computed: {
    ...mapState({
      wishItem: state => state.wishes.wishItem
    }),
    isEnd () {
      return this.wishItem.status !== 'on'
    }
  },
  methods: {
    ...mapActions({
      donate: 'donate',
      getWishItem: 'getWishItem'
    }),
    handleAdoptClick () {
      if (this.isEnd) {
        return null
      }
      const id = this.$route.params.id
      this.$vux.loading.show({
        text: '正在認養'
      })
      this.donate({id, cb: this.AdoptCb})
    },
    AdoptCb (data) {
      this.$vux.loading.hide()
      if (data.code === 212) {
        this.$vux.toast.text('已經有人認養了哦', 'bottom')
        this.$router.push({
          path: `/wish/${this.$route.params.id}`
        })
      } else {
        this.$vux.toast.text('認養成功', 'bottom')
        this.$router.push({
          path: `/wish/after/${this.$route.params.id}`
        })
      }
    },
    getCb (data) {
      console.log(data)
      if (data.status !== 'on') {
        this.$router.replace(`/wish/${this.$route.params.id}`)
      }
    }
  },
  created () {
    const id = this.$route.params.id
    this.getWishItem({ id, cb: this.getCb })
  }
}
</script>

<style lang="less" scoped>
@import '../../global.mixin.less';
@import "./style";
.wrap {
  .g-bg-repeat-y('./assets/img/wishes/wish_pic_bg@2x.png');
  .confirm-title {
    .father-flex-center();
    padding: 20px 0;
    color: #E2462C;
  }
  .card {
    padding: 0 10px 0 10px;
    .img-wrap {
      .img {
        height: 300px;
      }
    }
    .content {
      color: #28292B;
      padding: 21px 13px;
      .info {
        padding-bottom: 10px;
        border-bottom: 1px dashed #E5E5E5;
      }
    }
    .notice {
      .btn {
        .btn(10px);
      }
      > h3 {
      }
      > p {
        margin: 15px 0;
        color: #969797;
      }
    }
  }
}
</style>
