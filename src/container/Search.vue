<template>
  <div class="search">
    <div class="search-box">
      <x-input
        placeholder="請輸入關鍵字"
        novalidate
        :debounce="300"
        @on-change="onSearch"
        v-model="searchVal"
        ref="searchInput"
        placeholder-align="left">
        <img
          slot="label"
          style="display:block;margin-right: 8px;"
          :src="iconSearch" width="14" height="14">
        <img
          slot="label"
          @click="goBack"
          style="position:absolute; top:0; right: 0;"
          :src="searchIconClose"
          width="50"
          height="50">
      </x-input>
      <tab
        :line-width="2"
        prevent-default
        custom-bar-width="24px"
        @on-before-index-change="switchTabItem">
        <tab-item
          :key="index"
          :selected="tabIndex === index"
          v-for="(tabItem, index) in tabItems">
          {{tabItem.value}}
        </tab-item>
      </tab>
    </div>
    <group
      class="container g-smooth"
      id="searchContainer"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10">
      <cell-box
        :key="index"
        @click.native="toDetail(item.id)"
        v-for="(item, index) in items.data">
        <item-card
          :itemId="item.id"
          :pool-type="tabItems[tabIndex].type"
          :card-info="item">
        </item-card>
      </cell-box>
      <inline-loading v-show="items.curPage !== 0 && isLoading">
      </inline-loading>
      <div
        class="wrapper"
        v-show="!items.data.length && !items.nextPageUrl">
        <cell-box>
          <oops
            :oop-type="tabItems[tabIndex].type"
            class="search-oops">
          </oops>
        </cell-box>
        <div class="keywords" v-if="tabIndex !== 2">
          <div class="hint">
            添加“<i class="word">{{searchVal}}</i>
            ”訂閱關鍵字，可收到新{{tabIndex === 0 ? '禮物' : '需求'}}通知
          </div>
          <span
            class="subscribe-btn"
            @click="batchKeywords">
            添加到我的關鍵字
          </span>
        </div>
      </div>
      <divider
        v-show="items.data.length && !items.nextPageUrl"
        class="g-divider">
        沒有更多了
      </divider>
    </group>
  </div>
</template>

<script>
import { Group, CellBox, Tab, TabItem, Divider } from 'vux'
import Oops from '@/components/Oops'
import iconSearch from '@/assets/icon/gift/icon-search.png'
import ItemCard from '@/components/ItemCard'
import infiniteScroll from 'vue-infinite-scroll'
import searchIconClose from '@/assets/icon/gift/icon-nav-close.png'
import thingsPicM from '@/assets/icon/gift/things-pic-M.jpg'
import { mapActions, mapState, mapMutations } from 'vuex'
import InlineLoading from '@/components/InlineLoading'
import anchorMixin from '@/mixins/anchor'

export default {
  mixins: [anchorMixin],
  components: {
    CellBox,
    Tab,
    TabItem,
    Oops,
    ItemCard,
    Group,
    InlineLoading,
    Divider
  },
  data () {
    return {
      iconSearch,
      searchIconClose,
      thingsPicM,
      tabItems: [{
        type: 'gift',
        value: '禮物池',
        action: 'searchGift'
      }, {
        type: 'need',
        value: '需求池',
        action: 'searchNeed'
      }, {
        type: 'member',
        value: '會員',
        action: 'searchMember'
      }],
      searchVal: '',
      isOops: false,
      searchItems: [],
      searchPage: 1,
      isBatching: false,
      gift: {
        isLoading: false,
        busy: false
      },
      need: {
        isLoading: false,
        busy: false
      },
      member: {
        isLoading: false,
        busy: false
      },
      enable: true
    }
  },
  created () {
    if (this.keyW) {
      this.searchVal = this.keyW
      this.enable = false
    } else {
      // 根据进入页面给予默认搜索选项
      const type = this.$route.query.type
      switch (type) {
        case 'need':
          this.setSearchTabIndex({index: 1})
          break
        default:
          this.setSearchTabIndex({index: 0})
          break
      }
    }
  },
  mounted () {
    this.$refs.searchInput.focus()
    this.initAnchor('searchContainer')
  },
  methods: {
    ...mapActions({
      getSubKeyW: 'getSubKeyW',
      batchSubKeyW: 'batchSubKeyW'
    }),
    ...mapMutations({
      setSearchKeyW: 'setSearchKeyW',
      setSearchTabIndex: 'setSearchTabIndex',
      initSearch: 'initSearch',
      setTypeKeyW: 'setTypeKeyW'
    }),
    // 详情
    toDetail (id) {
      //  判断是否是礼物或需求跳转
      if (this.tabIndex === 2) {
        this.$router.push(`/user/${id}`)
      } else {
        this.$router.push(`${this.tabItems[this.tabIndex].type}/${id}`)
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    // 搜索
    onSearch () {
      const type = this.tabItems[this.tabIndex].type
      // console.log(type)
      const keyW = this.searchVal.trim()
      // console.log(keyW)
      this.setSearchKeyW({keyW})
      this.enable = true
      if (keyW) {
        if (this.keyW !== this[`${type}s`].keyW) {
          this.initSearch({type: `${type}s`})
          this.setTypeKeyW({type: `${type}s`, keyW: this.keyW})
          this.isOops = false
          // console.log(1)
          this.$Loading.show()
          const [actionType, page] = [
            this.tabItems[this.tabIndex].action,
            this.items.curPage + 1
          ]
          this.$store.dispatch(
            actionType,
            {
              keyW,
              page,
              onPool: 1,
              cb: this.loadMoreCb
            }
          )
        }
      } else {
        this.initSearch({type: 'gifts'})
        this.initSearch({type: 'needs'})
        this.initSearch({type: 'members'})
        this.setTypeKeyW({type: 'gifts', keyW: ''})
        this.setTypeKeyW({type: 'needs', keyW: ''})
        this.setTypeKeyW({type: 'members', keyW: ''})
      }
    },
    // 切换搜索tab
    switchTabItem (index) {
      if (this.tabIndex !== index) {
        const div = document.getElementById('searchContainer')
        div.scrollTo(0, 0)
        this.setSearchTabIndex({index})
        if (!this.keyW) {
          return this.$vux.toast.text('請輸入關鍵字', 'bottom')
        }
        if (this.keyW !== this.items.keyW ||
          (!this.items.data.length && this.items.curPage === 0)) {
          this.setSearchKeyW({keyW: this.keyW})
          this.onSearch(this.keyW)
        }
      }
    },
    // 滚动加载更多
    loadMore () {
      // 设置 this.enable 标志以在搜索之后跳转到其他页面再重新返回拦截loadMore事件
      const type = this.tabItems[this.tabIndex].type
      // console.log(this.nextPageUrl, 'this.nextPageUrl')
      if (this.keyW && this.enable && !this[type].busy && this.nextPageUrl) {
        const type = this.tabItems[this.tabIndex].type
        this[type].busy = true
        this.isOops = false
        if (this.items.curPage !== 0) {
          this[type].isLoading = true
        }
        const [actionType, page] = [
          this.tabItems[this.tabIndex].action,
          this.items.curPage + 1
        ]
        this.$store.dispatch(actionType, this.tabIndex !== 2 ? {
          keyW: this.searchVal,
          page,
          onPool: 1,
          cb: this.loadMoreCb
        } : {
          keyW: this.searchVal,
          page,
          cb: this.loadMoreCb
        })
      }
    },
    loadMoreCb (obj) {
      this.$Loading.hide()
      const type = this.tabItems[this.tabIndex].type
      this[type].isLoading = false
      const {
        data,
        next_page_url: nexPageUrl
      } = obj
      if (!data.length && this.items.curPage === 2) {
        this.isOops = true
      } else {
        this.searchItems = [
          ...this.searchItems,
          ...data
        ]
        if (nexPageUrl) {
          const type = this.tabItems[this.tabIndex].type
          this[type].busy = false
        }
      }
    },
    batchKeywords () {
      if (!localStorage.getItem('KEY_USER_TOKEN')) {
        return this.$router.replace('/login?redirect=search')
      }
      if (!this.isBatching) {
        this.getSubKeyW({cb: this.batchKeywordsCb})
      }
    },
    batchKeywordsCb (data) {
      this.isBatching = false
      if (data.length === 5) {
        return this.$vux.toast.text('添加關鍵字數量超過限制,請前往個人中心進行管理', 'bottom')
      }
      const isSetted = data.some((item) => {
        return (this.searchVal === item.content) &&
          (this.tabItems[this.tabIndex].type === item.type)
      })
      if (isSetted) {
        return this.$vux.toast.text('該關鍵字已經添加,請前往個人中心進行管理', 'bottom')
      }
      const originKeywords = data.map((item) => {
        return {
          type: item.type,
          content: item.content
        }
      })
      const keywords = [
        ...originKeywords,
        {
          type: this.tabItems[this.tabIndex].type,
          content: this.searchVal
        }
      ]
      this.batchSubKeyW({
        keywords,
        cb: () => this.$vux.toast.text('設置成功', 'bottom')
      })
    }
  },
  computed: {
    ...mapState({
      keyW: state => state.searchs.keyW,
      tabIndex: state => state.searchs.tabIndex,
      gifts: state => state.searchs.gifts,
      needs: state => state.searchs.needs,
      members: state => state.searchs.members
    }),
    items () {
      switch (this.tabIndex) {
        case 0:
          return this.gifts
        case 1:
          return this.needs
        default:
          return this.members
      }
      // return (this.tabIndex === 0) ? this.gifts : ((this.tabIndex === 1) ? this.needs : this.members)
    },
    busy () {
      const type = this.tabItems[this.tabIndex].type
      return this[type].busy
    },
    isLoading () {
      const type = this.tabItems[this.tabIndex].type
      return this[type].isLoading
    },
    nextPageUrl () {
      const type = this.tabItems[this.tabIndex].type
      return this[`${type}s`].nextPageUrl
    }
  },
  directives: {
    infiniteScroll
  }
}
</script>
<style lang="less">
  .search{
    .search-box{
      .vux-x-input{
        padding: 0 50px 0 @pm-bg;
        margin-bottom: 10px;
        background: #FFF;
        .weui-input{
          height: 50px;
        }
      }
      .vux-tab{
        .vux-tab-bar-inner{
          background: linear-gradient(to right, @color-font-CR 50%, @color-CO 50%)
        }
        .vux-tab-item{
          background: none;
          font-size: @font-S1;
          &.vux-tab-selected{
            color: @color-font-CR;
          }
        }
      }
    }
    .weui-cells{
      position: relative;
      margin: 0;
      border-bottom: none;
      /*height: 100%;*/
      /*overflow: auto;*/
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
        &:nth-last-child(4){
          .item-card{
            &:after{
              display: none;
            }
          }
        }
        &:before{
          display:none;
        }
      }
      &:after, &:before{
        display: none;
      }
      &:hover:after{
        height: 0;
      }
    }
  }
</style>
<style lang="less" scoped>
  .search{
    text-align: left;
    line-height: 1;
    height: 100%;
    background: @color-CBG;
    .search-box{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
      width: 100%;
      background: @color-CBG;
    }
    .container{
      padding-top: 102px;
      height: 100%;
      overflow-y: scroll;
      background-color: #FFF;
      .wrapper{
        margin-top: 100px;
        .search-oops{
          margin: @pm-md auto 0;
        }
        .keywords{
          color: @color-font-C2;
          font-size: @font-S3;
          text-align: center;
          .hint{
            margin-top: 3px;
            .word{
              color: @color-CR;
              font-style: normal;
            }
          }
          .subscribe-btn{
            position: fixed;
            left: @pm-bg;
            bottom: 30px;
            width: calc(~"100% - 30px");
            height: 46px;
            line-height: 46px;
            text-align: center;
            color: #FFF;
            font-size: @font-S2;
            border-radius: 3px;
            background: @color-CR;
          }
        }
      }
    }
  }
</style>
