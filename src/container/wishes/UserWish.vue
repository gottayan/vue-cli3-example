<template>
  <div class="container" id="container">
    <div v-show="isLoad && !userWishList1.length && !userWishList2.length" class="oops">
      當前心願認養為空~
    </div>
    <div v-show="isLoad && (userWishList1.length || userWishList2.length)" id="wrap" class="wrap wish-public-style">
      <div class="list-wishes" v-if="userWishList2.length">
        <div class="wish-title">
        <span class="wish-title-span"></span>
        <h3>2018心願認養</h3>
        </div>
        <div class="item-wrap">
          <div class="item"
               v-for="(item, index) in userWishList2"
               :key="index"
          >
            <wishes-card
              :item="item.wish"
              :index="index"
              :year="2018"
            />
          </div>
        </div>
        <div class="wish-title" v-if="userWishList1.length">
          <span class="wish-title-span"></span>
          <h3>2017心願認養</h3>
        </div>
        <div class="item-wrap">
          <div class="item"
               v-for="(item, index) in userWishList1"
               :key="index"
          >
            <wishes-card
              :item="item.wish"
              :index="index"
              :year="2017"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WishesCard from './Card'
import { mapState, mapActions } from 'vuex'
import anchorMixin from '@/mixins/anchor'

export default {
  mixins: [anchorMixin],
  components: {
    WishesCard
  },
  data () {
    return {
      isLoad: false,
      userHash: ''
    }
  },
  computed: {
    ...mapState({
      myUserWishList1: state => state.wishes.myUserWishList1,
      myUserWishList2: state => state.wishes.myUserWishList2,
      otherUserWishList1: state => state.wishes.otherUserWishList1,
      otherUserWishList2: state => state.wishes.otherUserWishList2,
      userId: state => state.user.userInfo.id
    }),
    isSelf () {
      return (Number(this.userId) === Number(this.$route.params.hash))
    },
    userWishList1 () {
      return this.isSelf ? this.myUserWishList1 : this.otherUserWishList1
    },
    userWishList2 () {
      return this.isSelf ? this.myUserWishList2 : this.otherUserWishList2
    }
  },
  methods: {
    ...mapActions({
      getUserWishList: 'getUserWishList'
    }),
    wishesCb () {
      this.getUserWishList({
        id: this.$route.params.hash,
        cb: () => {
          this.$vux.loading.hide()
          this.isLoad = true
        },
        isSelf: this.isSelf,
        batch: 2 // 2018
      })
    }
  },
  mounted () {
    this.initAnchor('wrap')
  },
  created () {
    if (!this.isSelf) {
      // TA的心愿切换用户重新请求，不切换缓存
      if (!this.handleUserRouteHash(() => { this.isLoad = true })) {
        return false
      }
    } else {
      // 我的心愿只要有数据就缓存
      if (this.myUserWishList1.length || this.myUserWishList2.length) {
        this.isLoad = true
        return false
      }
    }
    this.$vux.loading.show()
    this.getUserWishList({
      id: this.$route.params.hash,
      cb: this.wishesCb,
      isSelf: this.isSelf,
      batch: 1 // 2017
    })
  }
}
</script>

<style lang="less" scoped>
@import './style';
@import '../../global.mixin.less';
.oops {
  margin-top: 100px;
  color: #969797;
  font-size: 14px;
  text-align: center;
}
.container {
  height: 100%;
}
.wrap {
  .g-bg-repeat-y('./assets/img/wishes/wish_pic_bg@2x.png');
  .wish-title {
    padding: 12px 10px;
    position: relative;
    h3 {
      margin-left: 20px;
      line-height: 24px;
    }
    .wish-title-span {
      background: linear-gradient(to bottom, #e25443 50%, #ffa507 50%);
      width: 4px;
      height: 24px;
      display: block;
      position: absolute;
    }
  }
}
</style>
