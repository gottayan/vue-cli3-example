<template>
  <div class="user-needs">
    <group
      id="userNeedsPanel"
      class="container"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="20">
      <cell-box
        :key="index"
        v-for="(item, index) in needs.data">
        <item-card
          pool-type="need"
          :item-id="item.id"
          :card-info="item">
        </item-card>
      </cell-box>
      <cell-box
        v-show="!needs.data.length && !needs.nextPageUrl">
        <oops
          oop-type="need"
          class="search-oops">
        </oops>
      </cell-box>
      <inline-loading
        v-show="needs.currentPage !== 0 && isLoading">
      </inline-loading>
      <divider
        v-show="needs.data.length && !needs.nextPageUrl"
        class="g-divider p-divider">
        沒有更多了
      </divider>
    </group>
  </div>
</template>

<script>
import { CellBox, Divider } from 'vux'
import Oops from '@/components/Oops'
import ItemCard from '@/components/UserItemCardNeed'
import infiniteScroll from 'vue-infinite-scroll'
import { mapState } from 'vuex'
import InlineLoading from '@/components/InlineLoading'
import anchorMixin from '@/mixins/anchor'

export default {
  mixins: [anchorMixin],
  components: {
    CellBox,
    Oops,
    ItemCard,
    InlineLoading,
    Divider
  },
  data () {
    return {
      busy: false,
      isLoading: false
    }
  },
  created () {
  },
  methods: {
    // 滚动加载更多
    loadMore () {
      if (!this.busy && this.needs.nextPageUrl) {
        this.busy = true
        // this.$vux.loading.show({
        //   text: '加載中...'
        // })
        if (this.needs.currentPage === 0) {
          this.$Loading.show()
        }
        this.isLoading = true
        const [actionType, userId, page] = [
          'getUserNeeds',
          this.$route.params.hash,
          this.needs.currentPage + 1
        ]
        this.$store.dispatch(actionType, {page, userId, cb: this.loadMoreCb})
      }
    },
    loadMoreCb () {
      // this.$vux.loading.hide()
      if (this.needs.currentPage === 1) {
        this.$Loading.hide()
      }
      this.isLoading = false
      if (this.needs.nextPageUrl) {
        this.busy = false
      }
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.userInfo.id,
      myNeeds: state => state.user.userInfo.myNeeds,
      otherUserNeeds: state => state.user.otherUserInfo.myNeeds
    }),
    needs () {
      const isSelf = (Number(this.userId) === Number(this.$route.params.hash))
      return isSelf ? this.myNeeds : this.otherUserNeeds
    }
  },
  directives: {
    infiniteScroll
  },
  mounted () {
    this.initAnchor('userNeedsPanel')
  }
}
</script>
<style lang="less">
  .user-needs{
    .weui-cells{
      margin: 0;
      border-bottom: none;
      .weui-cell{
        padding: 0;
        &:after{
          border-bottom: none;
        }
        &:nth-child(1){
          .item{
            border: none;
          }
        }
        &:before{
          display:none;
        }
        &:nth-last-child(4){
          .item-card{
            &:after{
              display: none;
            }
          }
        }
      }
      &:after{
        border: none;
      }
      &:hover:after{
        height: 0;
      }
    }
  }
</style>
<style lang="less" scoped>
  .user-needs{
    height: 100%;
    text-align: left;
    line-height: 1;
    background: #FFF;
    .container{
      max-height: 100%;
      overflow-y: scroll;
      .search-oops{
        margin: 100px auto 0;
      }
    }
  }
</style>
