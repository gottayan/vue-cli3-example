<template>
  <div class="storysidebar-container">
    <transition name="fade" @touchmove.stop.prevent>
    <div class="menu-mask" v-show="isShow" @click="hideSideBar"></div>
  </transition>
  <transition name="side">
    <div class="menu-content" v-show="isShow">
      <div class="content">
        <group title="故事類別">
          <filter-option
            @click.native="selectOptions(index, option)"
            :selected="activeIndex === index"
            :key="'sort' + index"
            :option="option"
            v-for="(option, index) in storyType">
          </filter-option>
        </group>
      </div>
      <div class="btn-box">
        <flexbox :gutter="15">
          <flexbox-item>
            <x-button class="btn-close" @click.native="hideSideBar">取消</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button class="btn-confirm" @click.native="setFilterItem(option)" type="primary">確認</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </transition>
  </div>
</template>

<script>
import { storyType } from '@/tools/constant'
import { Group, XButton, Flexbox, FlexboxItem } from 'vux'
import FilterOption from '@/components/FilterOption'
export default {
  components: {
    Group,
    XButton,
    Flexbox,
    FlexboxItem,
    FilterOption
  },
  data () {
    return {
      activeIndex: 0,
      storyType,
      option: ''
    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    hideSideBar: {
      type: Function,
      required: true
    },
    setFilterItem: {
      type: Function,
      required: true
    }
  },
  methods: {
    selectOptions (index, option) {
      this.activeIndex = index
      this.option = option
    }
  },
  mounted () {
    let id = this.$route.query.category_id
    if (id) {
      id = parseInt(id)
      storyType.find((item, index) => {
        if (item.id === id) {
          this.selectOptions(index, item)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.storysidebar-container{
  .menu-mask{
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    opacity: 1;
    z-index: 9998;
    height: 100%;
    background: rgba(0,0,0,0.5);
    transfrom: translate3d(0,0,0);
    overflow: hidden;
    &.fade-enter-to, &.fade-leave-to{
      transition: opacity 0.3s;
    }
    &.fade-enter, &.fade-leave-to{
      opacity: 0;
    }
  }

  .menu-content{
    position: fixed;
    width: 250px;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 53px;
    z-index: 9999;
    padding: 0 @pm-bg 80px;
    overflow-y: auto;
    background: #fff;
    overflow-scrolling: touch;
    &.side-enter-to, &.side-leave-to{
      transition: transform 0.3s;
    }
    &.side-enter, &.side-leave-to{
      transform:translate3d(250px,0,0);
    }
    .content{
      background: #fff;
      display: block;
    }
    .btn-box{
      position: fixed;
      bottom: 15px;
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
