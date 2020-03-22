<template>
  <div class="nearby-container">
    <x-header :title="$route.meta.title"></x-header>
    <group>
      <popup-picker
        title="請選擇要查詢地區"
        :data="areaMapLists"
        :columns="3"
        v-model="address"
      />
    </group>
    <button class="g-button red btn-query" @click="queryPalmBox">查詢</button>
    <section class="nearby-palmbox-container">
      <div class="total">總數：{{total}}</div>
      <palmbox-item
        :key="index"
        v-for="(item, index) in data"
        :info="item"
      >
      </palmbox-item>
    </section>
  </div>
</template>

<script>
import PalmboxItem from '@/components/PalmboxItem'
import { PopupPicker, Group } from 'vux'
import { mapState, mapActions } from 'vuex'
import {mapGeo} from '@/tools/strMap'

export default {
  components: {
    PopupPicker,
    Group,
    PalmboxItem
  },
  data () {
    return {
      address: [''],
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      geoConfig: state => state.configs.geoConfig,
      data: state => state.things.palmBoxData.data,
      total: state => state.things.palmBoxData.total
    }),
    areaMapLists () {
      return mapGeo(this.geoConfig)
    }
  },
  methods: {
    ...mapActions({
      getGeoConfig: 'getGeoConfig',
      getPalmBox: 'getPalmBox'
    }),
    queryPalmBox () {
      if (this.address.length !== 2) {
        return this.$vux.toast.text('請先選擇查詢地區', 'bottom')
      }

      if (this.isLoading) {
        return this.$vux.toast.text('正在為您查詢...', 'bottom')
      }
      this.isLoading = true
      this.getPalmBox({
        city: this.address[0],
        area: this.address[1],
        cb: this.queryCb
      })
    },
    queryCb (data) {
      this.isLoading = false
    }
  },
  created () {
    if (!this.areaMapLists.length) {
      this.getGeoConfig()
    }
  }
}
</script>

<style lang="less" scoped>
  .btn-query{
    width: 90%;
    margin: 15px auto;
    display: block;
  }
  .nearby-palmbox-container{
    padding: 0 15px;
  }
</style>
