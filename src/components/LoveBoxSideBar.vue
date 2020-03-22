<template>
  <div class="sidebar">
    <transition name="fade" @touchmove.stop.prevent>
      <div class="menu-mask" v-show="isShow" @click="hideSideBar"></div>
    </transition>
    <transition name="side">
      <div class="menu-content" v-show="isShow">
        <div class="content">
          <group title="篩選器">
            <filter-option @click.native="selectOptions('other', index)" :selected="filterSelected.other[index]" :key="'base' + index" :option="option" v-for="(option, index) in filterOptions.userRoleType">
            </filter-option>
          </group>
          <group title="排序方式">
            <filter-option @click.native="selectOptions('sort', index)" :selected="filterSelected.sort[index]" :key="'sort' + index" :option="option" v-for="(option, index) in filterOptions.sort">
            </filter-option>
          </group>
          <!--<group title="物品類別">-->
            <!--<filter-option @click.native="selectOptions('category', index)" :selected="filterSelected.category[index]" :key="'category' + index" :option="option" v-for="(option, index) in filterOptions.category">-->
            <!--</filter-option>-->
          <!--</group>-->
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
import { filterOptionsLoveBox } from '@/tools/constant'
import { Group, XButton, Flexbox, FlexboxItem } from 'vux'
import FilterOption from '@/components/FilterOption'
import { local, KEY_USER_TOKEN } from '@/tools/storage'
import {mapState, mapMutations} from 'vuex'

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
    const {searchType, sort, category} = this.options
    this.filterOptions.userRoleType.forEach((item, index) => {
      if (searchType === item.key) {
        this.searchType = searchType
        this.$set(this.filterSelected.other, index, true)
      }
    })
    this.filterOptions.sort.forEach((item, index) => {
      if (sort === item.key) {
        this.sort = sort
        this.$set(this.filterSelected.sort, index, true)
      }
    })
    this.filterOptions.category.forEach((item, index) => {
      if (category === item.key) {
        this.category = category
        this.$set(this.filterSelected.category, index, true)
      }
    })
  },
  methods: {
    ...mapMutations({
      setLoveboxFilterOptions: 'setLoveboxFilterOptions'
    }),
    // 显示菜单
    hideSideBar () {
      this.$emit('hideSideBar')
    },
    selectOptions (type, idx) {
      let options = []
      switch (type) {
        case 'other':
          options = this.filterOptions.userRoleType
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
            this.searchType = isSelected ? this.filterOptions.userRoleType[index].key : ''
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
      const options = {
        sort: this.sort,
        category: this.category,
        searchType: this.searchType
      }
      this.setLoveboxFilterOptions({...options, poolType: this.poolType})
      this.hideSideBar()
      this.$emit('search', options)
    }
  },
  computed: {
    ...mapState({
      options: state => state.lovebox.filterOptions.lovebox
    }),
    filterOptions () {
      const bundle = local.get(KEY_USER_TOKEN)
      let options = filterOptionsLoveBox
      if (bundle) {
        options = {
          ...options,
          userRoleType: [
            ...options.userRoleType, {
              key: 'MINE',
              value: '我的愛箱'
            }, {
              key: 'isTraceUser',
              value: '我追蹤的會員'
            }
          ]
        }
      }
      return options
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
      height:100%;
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
      height:100%;
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
        bottom: @pm-md;
        right: @pm-bg;
        padding-top: 15px;
        width: 220px;
        height: auto;
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
