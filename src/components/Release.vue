<template>
  <div class="release-container">
    <div
      class="release-mask"
      @click="toggleMoreBtn"
      v-show="isShowMore">
    </div>
    <div v-show="isShowMore">
      <div @click="toGiftNew" class="release-btn-wrapper">
        <span class="release-btn-title">上傳禮物</span>
        <img class="release-btn-item" :src="NewGift" />
      </div>
    </div>
    <div v-show="isShowMore">
      <!-- to="/need/new" -->
      <div @click="toNeedNew" class="release-btn-wrapper">
        <span class="release-btn-title">發佈需求</span>
        <img class="release-btn-item" :src="NewNeed" />
      </div>
    </div>
    <!-- <img
      class="relase-btn-oldversion"
      v-show="!isShowMore"
      @click="setOldVersion"
      src="../assets/img/com_bottom_ic_back02_normal@2x.png"
      alt=""
    > -->
    <img
      class="release-btn-main release-btn-item"
      :src="isShowMore ? ReleaseBtnShow : ReleaseBtn"
      alt=""
      @click="toggleMoreBtn"
    >
  </div>
</template>

<script>
import ReleaseBtn from '@/assets/img/com_bottom_ic_add_normal@2x.png'
import NewGift from '@/assets/img/com_bottom_ic_gift_normal@2x.png'
import NewNeed from '@/assets/img/com_bottom_ic_need_normal@2x.png'
import ReleaseBtnShow from '@/assets/img/com_bottom_ic_close_normal@2x.png'
import memberData from '@/tools/memberData'
import { oldVersionUrl } from '@/tools/constant'
import {mapState, mapActions} from 'vuex'
import { doClickOldVersion, doClickSendNew } from '@/tools/GAEvent'
import { local, KEY_USER_TOKEN } from '@/tools/storage'

export default {
  data () {
    return {
      ReleaseBtn,
      ReleaseBtnShow,
      NewGift,
      NewNeed,
      isShowMore: false
    }
  },
  created () {
    if (local.get(KEY_USER_TOKEN) && !this.userInfo.id) {
      return this.getLoginUserInfo()
    }
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo'
    }),
    setOldVersion () {
      doClickOldVersion()
      document.cookie = `goOldVersion=1;domain=${oldVersionUrl.path};max-age=${60 * 60}`
      window.location.href = oldVersionUrl.url
    },
    toGiftNew () {
      if (!local.get(KEY_USER_TOKEN) || memberData.isValid(this.$store.state)) {
        this.isShowMore = false
        return this.$router.push('/gift/new')
      }
      if (!memberData.isValidBaseInfo(this.$store.state)) {
        this.$vux.toast.text('請先完善會員基本資料', 'bottom')
        setTimeout(() => {
          this.$router.push(`/user/${this.userInfo.id}/editBaseInfo?redirect=/gift/new`)
        }, 1000)
      } else if (!memberData.isValidAdr(this.$store.state)) {
        this.$vux.toast.text('請先完善會員聯絡地址', 'bottom')
        setTimeout(() => {
          this.$router.push(`/user/${this.userInfo.id}/editAdr?redirect=/gift/new`)
        }, 1000)
      }
    },
    toNeedNew () {
      if (!local.get(KEY_USER_TOKEN) || memberData.isValid(this.$store.state)) {
        this.isShowMore = false
        return this.$router.push('/need/new')
      }
      if (!memberData.isValidBaseInfo(this.$store.state)) {
        this.$vux.toast.text('請先完善會員基本資料', 'bottom')
        setTimeout(() => {
          this.$router.push(`/user/${this.userInfo.id}/editBaseInfo?redirect=/need/new`)
        }, 1000)
      } else if (!memberData.isValidAdr(this.$store.state)) {
        this.$vux.toast.text('請先完善會員聯絡地址', 'bottom')
        setTimeout(() => {
          this.$router.push(`/user/${this.userInfo.id}/editAdr?redirect=/need/new`)
        }, 1000)
      }
    },
    toggleMoreBtn () {
      if (!this.isShowMore) {
        doClickSendNew()
      }
      this.isShowMore = !this.isShowMore
    },
    pending (e) {
      e.preventDefault()
      this.$vux.toast.show({
        type: 'text',
        position: 'bottom',
        text: '正在開發中...'
      })
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
  .release-container{
    // width: 80px;
    // height: 80px;
    position: fixed;
    z-index: 505;
    right: 0;
    bottom: 50px;
    text-align: right;
  }

  .release-mask{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: -1;
    background-color: rgba(0, 0, 0, .6);
  }

  .release-btn-title{
    color: @color-font-C4;
    font-size: @font-S3;
  }

  .release-btn-item{
    width: 20vw;
    max-width: 100px;
    height: 20vw;
    max-height: 100px;
  }

  .release-btn-wrapper{
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .relase-btn-oldversion{
    display: block;
    width: 20vw;
    height: 20vw;
    margin-bottom: -10px;
  }
</style>
