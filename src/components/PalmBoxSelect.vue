<template>
  <div class="plambox-s-container">
    <popup-picker
      title="選擇掌櫃櫃機"
      aria-placeholder="請選擇掌櫃"
      placeholder="請選擇掌櫃"
      :columns="3"
      :display-format="format"
      @on-hide="toggleMoreInfo"
      @on-show="toggleMoreInfo"
      :data="palmboxList"
      @on-change="handleChange"
      :value="value"
      class="palmbox-s-content"
    ></popup-picker>
    <span class="palmbox-address">{{palmBoxAddress}}</span>
  </div>
</template>

<script>
import { PopupPicker } from 'vux'
export default {
  name: 'palmbox-select',
  data () {
    return {
      format (value) {
        return value[2]
      }
    }
  },
  components: {
    PopupPicker
  },
  props: {
    handleChange: {
      type: Function,
      required: true
    },
    title: {
      type: String,
      default: '選擇掌櫃櫃機'
    },
    value: {
      type: Array,
      default () {
        return ['', '', '']
      }
    }
  },
  computed: {
    palmboxList () {
      return this.$store.getters.palmBoxPickerData
    },
    palmBoxAddress () {
      const result = this.$store.getters.currentPalmBoxInfo(this.value[2])
      if (result) {
        return `${result.THROWBUILDINGNAME} / ${result.TW_THROWADDRESS}`
      }
      return result
    }
  },
  methods: {
    toggleMoreInfo () {
      const node = document.querySelector('#app')
      node.classList.toggle('g-picker__moreinfo')
    }
  },
  created () {
    this.$store.dispatch('getPalmBox', {city: '', area: '', cb: () => console.info('success')})
  }
}
</script>

<style lang="less">
  .plambox-s-container .vux-cell-box{
    font-size: 15px;
    color: #28292b;
  }
</style>

<style lang="less" scoped>
  .palmbox-s-content{
    position: relative;
    margin-bottom: 10px;
    &::after {
      display: block;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #eeeeee;
      content: ' ';
    }
  }
  .palmbox-address{
    font-size: 12px;
    color: @color-font-CR;
  }
</style>
