<template>
<div class="sidebar">
  <transition name="fade" @touchmove.stop.prevent>
    <div class="menu-mask" v-show="isShow" @click="hideSideBar"></div>
  </transition>
  <transition name="side">
    <div class="menu-content" v-show="isShow">
      <div class="content">
        <group :title="poolType === 'gift' ? '篩選器' : '會員類別'">
          <filter-option @click.native="selectOptions('other', index)" :selected="filterSelected.other[index]" :key="'other' + index" :option="option" v-for="(option, index) in (poolType === 'gift' ? filterOptions.isNew : filterOptions.userRoleType)">
          </filter-option>
        </group>
        <group title="排序方式">
          <filter-option @click.native="selectOptions('sort', index)" :selected="filterSelected.sort[index]" :key="'sort' + index" :option="option" v-for="(option, index) in filterOptions.sort">
          </filter-option>
        </group>
        <group title="物品類別">
          <filter-option @click.native="selectOptions('category', index)" :selected="filterSelected.category[index]" :key="'category' + index" :option="option" v-for="(option, index) in filterOptions.category">
          </filter-option>
        </group>
      </div>
      <div class="btn-box">
        <flexbox :gutter="15">
          <flexbox-item>
            <x-button class="btn-close" @click.native="hideSideBar">取消</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button class="btn-confirm" @click.native="setFilterItem" type="primary">確認</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
import { filterOptionsGift, filterOptionsNeed } from '@/tools/constant'
import { local, KEY_USER_TOKEN } from '@/tools/storage'
import { Group, XButton, Flexbox, FlexboxItem } from 'vux'
import FilterOption from '@/components/FilterOption'

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    poolType: {
      type: String
    }
  },
  components: {
    Group,
    XButton,
    Flexbox,
    FlexboxItem,
    FilterOption
  },
  data () {
    return {
      filterSelected: {
        other: [],
        sort: [],
        category: []
      },
      searchType: '',
      sort: '',
      category: ''
    }
  },
  created () {
    // 设置过滤选项
    const userRoleType = this.$route.query.userRoleType
    if (this.poolType === 'need' && userRoleType) {
      this.searchType = 'commonweal'
    }
    if (this.poolType === 'need' && userRoleType === 'commonweal') {
      this.$set(this.filterSelected.other, 0, true)
    }
    const {searchType, sort, category} = this.options
    if (this.poolType === 'gift') {
      this.filterOptions.isNew.forEach((item, index) => {
        if (searchType === item.key) {
          this.$set(this.filterSelected.other, index, true)
        }
      })
    } else {
      this.filterOptions.userRoleType.forEach((item, index) => {
        if (searchType === item.key) {
          this.$set(this.filterSelected.other, index, true)
        }
      })
    }
    this.filterOptions.sort.forEach((item, index) => {
      if (sort === item.key) {
        this.$set(this.filterSelected.sort, index, true)
      }
    })
    this.filterOptions.category.forEach((item, index) => {
      if (category === item.key) {
        this.$set(this.filterSelected.category, index, true)
      }
    })
  },
  methods: {
    // 显示菜单
    hideSideBar () {
      this.$emit('hideSideBar')
    },
    selectOptions (type, idx) {
      let options = []
      switch (type) {
        case 'other':
          options = (this.poolType === 'gift' ? this.filterOptions.isNew : this.filterOptions.userRoleType)
          break
        case 'sort':
          options = this.filterOptions.sort
          break
        case 'category':
          options = this.filterOptions.category
          break
      }
      options.forEach((item, index) => {
        if (index !== idx) {
          this.$set(this.filterSelected[type], index, false)
        } else {
          this.$set(this.filterSelected[type], index, !this.filterSelected[type][index])
          const isSelected = this.filterSelected[type][index]
          if (type === 'other') {
            if (this.poolType === 'gift') {
              this.searchType = isSelected ? this.filterOptions.isNew[index].key : ''
            } else {
              this.searchType = isSelected ? this.filterOptions.userRoleType[index].key : ''
            }
          } else if (type === 'sort') {
            this.sort = isSelected ? this.filterOptions.sort[index].key : ''
          } else {
            this.category = isSelected ? this.filterOptions.category[index].key : ''
          }
        }
      })
    },
    // 设置搜索过滤项目
    setFilterItem () {
      const optionsCommon = {
        sort: this.sort,
        category: this.category
      }
      let [val, options] = ['', {}]
      val = (this.searchType === '2') ? '1' : this.searchType
      if (this.poolType === 'gift') {
        options = {
          [this.searchType === '2' ? 'orgFirst' : 'isNew']: val,
          ...optionsCommon
        }
      } else if (this.poolType === 'need') {
        options = {
          [this.searchType === '2' ? 'isTraceUser' : 'userRoleType']: val,
          ...optionsCommon
        }
      }
      this.$store.commit('setFilterOptions', {searchType: this.searchType, sort: this.sort, category: this.category, poolType: this.poolType})
      this.hideSideBar()
      this.$emit('search', options)
    }
  },
  computed: {
    filterOptions () {
      const bundle = local.get(KEY_USER_TOKEN)
      let options = filterOptionsNeed
      if (bundle) {
        options = {
          ...options,
          userRoleType: [
            ...options.userRoleType, {
              key: '2',
              value: '我追蹤的會員'
            }
          ]
        }
      }
      return (this.poolType === 'gift') ? filterOptionsGift : options
    },
    // 获取已设置的过滤选项
    options () {
      const {need, gift} = this.$store.state.configs.filterOptions
      return this.poolType === 'need' ? need : gift
    }
  }
}
</script>
<style lang="less">
  .sidebar{
    .content{
      .weui-cells__title{
        padding: 0;
        margin: 24px 0 @pm-bg;
        font-size: @font-S1;
        font-weight: 700;
        color: @color-font-C1;

        &::before{
          display: inline-block;
          content: '';
          width: 4px;
          height: 18px;
          vertical-align: text-top;
          margin: 2px 10px 0 0;
          background-image: linear-gradient(to bottom, @color-CR 50%, @color-CO 50%);
        }
      }
      .weui-cells{
        &:hover:after{
          height: 0;
        }
        .weui-cells_radio{
          .weui-cell_radio{
            color: @color-font-C2;
            height: 38px;
            .weui-cell__ft{
              .weui-icon-checked{
                position: relative;
                width: 16px;
                height: 16px;
                border: 1px solid @color-font-C2;
                border-radius: 50%;
                &:before{
                  position: absolute;
                  top: -1px;
                  left: -1px;
                  margin: 0;
                  width: 16px;
                  height: 16px;
                  color: @color-CR;
                  font-size: @font-S4;
                  border-radius: 50%;
                  background: #f9dad5;
                  overflow: hidden;
                }
              }
            }
            .weui-cell__bd{
              > p{
                display: flex;
                align-items: center;
                img{
                  width: 20px;
                  height: 20px;
                  margin-right: @pm-bg;
                }
                .vux-radio-label{
                  line-height: 1;
                }
              }
            }
          }
        }
      }
    }
  }
</style>

<style lang="less" scoped>
.sidebar{
  .menu-mask{
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    opacity: 1;
    z-index:9998;
    height:calc(~"100% - 50px");
    background:rgba(0,0,0,0.5);
    transfrom:translateZ(0);
    overflow: hidden;
    &.fade-enter-to, &.fade-leave-to{
      transition: opacity 0.3s;
    }
    &.fade-enter, &.fade-leave-to{
      opacity: 0;
    }
  }

  .menu-content{
    position:fixed;
    width:250px;
    height:calc(~"100% - 50px");
    top:0;
    right:0;
    bottom:53px;
    z-index:9999;
    padding: 0 @pm-bg 80px;
    overflow-y:auto;
    background:#fff;
    overflow-scrolling:touch;
    &.side-enter-to, &.side-leave-to{
      transition: transform 0.3s;
    }
    &.side-enter, &.side-leave-to{
      transform:translate3d(250px,0,0);
    }
    .content{
      background:#fff;
      display:block;
    }
    .btn-box{
      position: fixed;
      bottom: 50px;
      right: @pm-bg;
      padding-top: 15px;
      width: 220px;
      height: 70px;
      background: linear-gradient(top,rgba(255,255,255,.6),rgba(255,255,255,1));
      .btn-close{
        border: none;
        color: #FFF;
        background: @color-DSA;
      }
      .btn-confirm{
        background: @color-CR;
      }
    }
  }
}
</style>
