<template>
  <ul class="functions">
    <li class="item">
      <button class="g-button orange"
              @click="handleAgree">同意</button>
    </li>
    <li class="item">
      <button @click="handleRefuse" class="g-button gray">
        拒绝
      </button>
    </li>
    <!-- <Alert
    @on-hide="shipwayHide"
    :value="isShipwayShow"
    title="請選擇合併后禮物的物流方式">
      <group>
        <radio :options="shipway" v-model="shipwayValue" @on-change="handleChange"></radio>
      </group>
    </Alert> -->
    <Alert
    @on-hide="refuseHide"
    :value="isRefuseShow"
    title="確定拒绝此合併請求嗎？">
      <group>
        <x-textarea v-model="value" placeholder="請輸入備註"></x-textarea>
      </group>
    </Alert>
  </ul>
</template>
<script>
/**
 * 合并请求
 */
import {mapActions} from 'vuex'
import { Alert, Group, XTextarea } from 'vux'

export default {
  props: {
    gift: {
      type: Object,
      default: () => {}
    },
    getDetail: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    Alert,
    Group,
    XTextarea
  },
  data () {
    return {
      value: '',
      isShipwayShow: false,
      isRefuseShow: false,
      shipway: Array.from(new Set(this.gift.children.map(item => item.shipway)))
    }
  },
  computed: {
    shipwayValue: {
      get: function () {
        return this.shipway[0]
      },
      set: function () {
      }
    }
  },
  methods: {
    ...mapActions({
      processMerge: 'processMerge'
    }),
    handleChange (val) {
      this.shipwayValue = val
    },
    refuseHide () {
      this.handleProcessMerge('merge_rejected')
    },
    shipwayHide () {
      this.handleProcessMerge('merge_allowed')
    },
    handleProcessMerge (status) {
      this.processMerge({
        giftRequestId: this.gift.id,
        // status: "merge_allowed",
        status,
        mergeRejectedReason: this.value,
        cb: (data) => {
          this.getDetail()
        }
      })
    },
    handleAgree () {
      const that = this
      this.$vux.alert.show({
        title: '您已同意此合併請求',
        content: '您可以將此合併禮物中物品一併寄出，當完成交易后，您將獲得全部的好人點數。',
        onHide () {
          const children = that.gift.children
          const set = new Set()
          children.forEach(i => set.add(i.shipway))
          that.handleProcessMerge('merge_allowed')
        }
      })
    },
    handleRefuse () {
      this.isRefuseShow = true
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .weui-cell__ft {
  display: block !important;
}
/deep/ .weui-cell {
  padding: 10px 15px !important;
  display: flex;
  justify-content: space-between;
}
/deep/ .weui-cell__bd {
  flex: none;
}
</style>
