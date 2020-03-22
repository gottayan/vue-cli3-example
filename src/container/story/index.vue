<template>
  <div class="story">
    <x-header title="讀故事">
      <img
        @click.self="toggleShow"
        :src="searchIcon"
        slot="right"
        width="40"
        height="40">
    </x-header>
    <group
      class="container"
      id="storyContainer"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="20">
      <cell-box :key="index" v-for="(item, index) in storyList.data">
        <story-item
          :data="item">
        </story-item>
      </cell-box>
      <inline-loading v-show="this.page !==1 && isLoading">
      </inline-loading>
      <divider v-if="storyList.data.length && !storyList.nextPageUrl" class="g-divider p-divider">沒有更多了</divider>
    </group>
    <side-bar
      :hideSideBar="toggleShow"
      :setFilterItem="setFilterItem"
      :is-show="isShowSideBar">
    </side-bar>
  </div>
</template>

<script>
import { CellBox, Divider } from 'vux'
import StoryItem from '@/components/StoryItem.vue'
import infiniteScroll from 'vue-infinite-scroll'
import { mapActions, mapState } from 'vuex'
import searchIcon from '@/assets/icon/gift/icon-nav-screen-white.png'
import SideBar from '../../components/StorySideBar.vue'
import scrollMixin from '@/mixins/scroll'
import InlineLoading from '@/components/InlineLoading'

export default {
  mixins: [scrollMixin],
  components: {
    CellBox,
    StoryItem,
    SideBar,
    InlineLoading,
    Divider
  },
  data () {
    return {
      busy: false,
      searchIcon,
      isShowSideBar: false,
      category_id: '',
      keyword: '',
      isLoading: false,
      isSearch: false
    }
  },
  methods: {
    ...mapActions({
      getStoryList: 'getStoryList'
    }),
    setFilterItem (value) {
      // 篩選了故事類別
      this.busy = false
      const id = value.id || ''
      if (this.category_id !== id) {
        const div = document.getElementById('storyContainer')
        div.scrollTo(0, 0)
        this.category_id = id
        this.isShowSideBar = false
        this.loadMore(true, true)
      }
    },
    toggleShow () {
      this.isShowSideBar = !this.isShowSideBar
    },
    // 滚动加载更多
    loadMore (isSearch = false, showLayer = false) {
      this.isSearch = isSearch
      if ((!this.busy && this.storyList.nextPageUrl) || (!this.busy && isSearch)) {
        this.busy = true
        this.isLoading = true
        if (this.page === 1) {
          this.$Loading.show(showLayer)
        }
        const page = isSearch ? 1 : this.storyList.currentPage + 1
        const categoryId = this.category_id
        const keyword = this.keyword
        this.getStoryList({ page, categoryId, keyword, isSearch, cb: this.loadMoreCb })
      }
    },
    loadMoreCb () {
      this.isLoading = false
      this.$Loading.hide()
      if (this.storyList.nextPageUrl) {
        this.busy = false
      }
    },
    beforeLeaveCb (to, from, next) {
      if (to.path === '/' && from.path === '/story') {
        window.sessionStorage.removeItem(this.offset_key)
      }
      next()
    }
  },
  mounted () {
    this.initialContainer('.container', 'STORY_OFFSET')
    if (this.$route.query.category_id) {
      this.categoryId = this.$route.query.category_id
      this.setFilterItem({id: this.$route.query.category_id})
    }
  },
  computed: {
    ...mapState({
      storyList: state => state.story.storyNew
    }),
    page () {
      return this.isSearch ? 1 : this.storyList.currentPage + 1
    }
  },
  directives: {
    infiniteScroll
  }
}
</script>
<style lang="less">
  .story{
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
      }
      &:before{
        border-width: 0;
      }
      &:after{
        border: none;
      }
      &:hover:after{
        height: 0;
      }
    }

    .vux-header .vux-header-right{
      top: 4px
    }
  }
</style>
<style lang="less" scoped>
  .story{
    height: 100%;
    text-align: left;
    line-height: 1;
    .container{
      padding: 0 15px;
      max-height: 100%;
      height: calc(~"100% - 44px");
      overflow-y: auto;
      scroll-behavior: smooth;
      -webkit-scroll-behavior: smooth;
      overflow-scrolling: touch;
      -webkit-overflow-scrolling: touch;
      .search-oops{
        margin: @pm-md auto 0;
      }
      .p-divider{
        padding: @pm-bg 0 !important;
      }
    }
  }

  .search{
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: white;
    border-bottom: 1px solid #eee;
    &-body{
      flex: 1;
    }
  }
</style>
