<template>
  <div class="user-subscribe">
    <div class="user-subscribe-box">
      <group>
        <x-input
          placeholder="請輸入關鍵字"
          :max="10"
          class="vux-1px-b"
          v-model="keyW"
          placeholder-align="left"
        >
          <img slot="label" style="display: block;margin-right: 8px; margin-left: 15px;" :src="iconSearch" width="14" height="14">
          <span slot="label" @click="addKeyW" class="add-btn">添加</span>
        </x-input>
      </group>
      <div class="container">
        <tab
          v-model="tabIndex"
          :line-width="2"
          prevent-default
          custom-bar-width="24px"
          @on-before-index-change="switchTabItem"
        >
          <tab-item :selected="tabIndex === 0">禮物池</tab-item>
          <tab-item :selected="tabIndex === 1">需求池</tab-item>
        </tab>
        <div class="keywords g-smooth">
          <div :key="index" class="wrapper" v-for="(keyW, index) in specificKeyWs">
            <span class="item" >{{keyW.content}}</span>
            <span class="delete" @click="deleteKeyW(keyW)">
            </span>
          </div>
        </div>
        <div class="hint">提示：設定關鍵字，贈物小兔會定期巡邏，當站上出現禮物/需求的標題與您的設定相符，小兔便會傳送通知給您唷；）</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Group, XInput, Tab, TabItem } from 'vux'
import iconSearch from '@/assets/icon/gift/icon-search.png'
import { mapActions, mapState, mapMutations } from 'vuex'
import anchorMixin from '@/mixins/anchor'

export default {
  mixins: [anchorMixin],
  components: {
    Group,
    XInput,
    Tab,
    TabItem
  },
  data () {
    return {
      keyW: '',
      // tabIndex: 0,
      tabTypes: ['gift', 'need'],
      // keywords: [],
      isAdding: false,
      isDeleting: false,
      iconSearch
    }
  },
  created () {
    // 获取关键字
    this.getSubKeyW({
      isUser: true,
      cb: (data) => {
        // this.keywords = data
      }
    })
  },
  methods: {
    ...mapActions({
      getSubKeyW: 'getSubKeyW',
      batchSubKeyW: 'batchSubKeyW'
    }),
    ...mapMutations({
      setKeywordsCurIdx: 'setKeywordsCurIdx'
    }),
    addKeyW () {
      if (!this.keyW) {
        return this.$vux.toast.text('請輸入關鍵字', 'bottom')
      }
      if (!this.isAdding) {
        this.isAdding = true
        this.getSubKeyW({cb: this.addKeyWCb})
      }
    },
    switchTabItem (index) {
      this.tabIndex = index
    },
    addKeyWCb (data) {
      if (data.length === 5) {
        this.isAdding = false
        return this.$vux.toast.text('最多設置5個關鍵字', 'bottom')
      }
      const isSetted = data.some((item) => {
        return (this.keyW === item.content) && (this.tabTypes[this.tabIndex] === item.type)
      })
      if (isSetted) {
        this.isAdding = false
        return this.$vux.toast.text('該關鍵字已存在', 'bottom')
      }
      const originKeywords = data.map((item) => {
        return {type: item.type, content: item.content}
      })
      const keywords = [...originKeywords, {type: this.tabTypes[this.tabIndex], content: this.keyW}]
      this.batchSubKeyW({
        keywords,
        cb: () => {
          this.getSubKeyW({
            cb: (data) => {
              // this.keywords = data
              this.keyW = ''
              this.isAdding = false
              this.$vux.toast.text('添加成功', 'bottom')
            }
          })
        }
      })
    },
    deleteKeyW (keyW) {
      if (!this.isDeleting) {
        this.isDeleting = true
        const tempKews = [...this.keywords.data]
        tempKews.forEach((item, index) => {
          if (item.content === keyW.content && item.type === keyW.type) {
            tempKews.splice(index, 1)
          }
        })
        this.batchSubKeyW({
          keywords: tempKews,
          cb: () => {
            this.getSubKeyW({
              cb: (data) => {
                // this.keywords = data
                this.isDeleting = false
                this.$vux.toast.text('删除成功', 'bottom')
              }
            })
          }
        })
      }
    }
  },
  computed: {
    ...mapState({
      keywords: state => state.configs.keywords
    }),
    tabIndex: {
      get () {
        return this.$store.state.configs.keywordsIdx
      },
      set (index) {
        this.setKeywordsCurIdx(index)
      }
    },
    // 过滤礼物需求池关键字
    specificKeyWs () {
      return this.keywords ? this.keywords.data.filter((item) => item.type === this.tabTypes[this.tabIndex]) : []
    }
  },
  mounted () {
    this.initAnchor()
  }
}
</script>
<style lang="less">
  @import '../../../node_modules/vux/src/styles/1px.less';
  .user-subscribe{
    &-box{
      padding-top: 44px;
      .vux-x-input{
        padding: 0 44px 0 0;
        border-bottom: 10px solid @color-CBG;
        background: #FFF;
        .weui-input{
          height: 50px;
        }
        .weui-cell__bd{
          font-size: @font-S3;
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
      .weui-cells{
        margin-top: 0;
        .weui-cells{
          &:before, &:after{
            display: none;
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
@import '../../global.mixin.less';
.user-subscribe{
    height: 100%;
    text-align: left;
    line-height: 1;
    background: #FFF;
    &-box{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      height: calc(~"100% - 46px");
      background: @color-CBG;
      .add-btn{
        position: absolute;
        top: 10px;
        right: @pm-bg;
        width: 64px;
        height: 30px;
        line-height: 30px;
        color: #FFF;
        font-size: @font-S3;
        text-align: center;
        border-radius: 3px;
        background: @color-font-CR;
      }
      .container{
        position: relative;
        height: 100%;
        background: #FFF;
        .keywords{
          display: flex;
          flex-direction: column;
          padding: 0 @pm-bg 80px;
          margin-top: 6px;
          height: calc(~"100% - 60px");
          .wrapper{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 50px;
            line-height: 50px;
            color: @color-font-C1;
            font-size: 15px;
            .g-border-1px();
            .delete{
              display: block;
              width: 44px;
              height: 44px;
              background: #fff url('../../assets/icon/profile/com_list_ic_delete_normal@2x.png') 0 0 no-repeat;
              background-size: 44px 44px;
            }
            &:last-child{
              .g-border-none();
            }
          }
        }
        .hint{
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          line-height: 18px;
          padding: 17px @pm-bg;
          color: @color-font-C2;
          text-align: center;
          font-size: 12px;
          border-radius: 8px 8px 0 0;
          box-shadow: 3px 0 20px rgba(0, 0, 0, .18);
          &:before{
            content: "*";
            display: inline-block;
            width: 6px;
            height: 6px;
            color: @color-CR;
          }
        }
      }
    }
  }
</style>
