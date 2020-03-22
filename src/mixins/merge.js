/* eslint-disable */ 
import { Shipways } from '../tools/constant'
const routeMap = {
  '/dealsReq': ['demands', 'gift'],
  '/dealsReq/remitting': ['demands', 'remitting', 'gift'],
  '/dealsReq/remitted': ['demands', 'remitted', 'gift'],
  '/dealsDonate': ['donates', 'gift'],
  '/dealsDonate/remitting': ['donates', 'remitting', 'gift'],
  '/dealsDonate/remitted': ['donates', 'remitted', 'gift']
}
const anchorMixin = {
  data () {
    return {
      currentValue: [],
      currentTitle: [],
      currentCheckbox: [],
      mergeSelete: false,
      isCheckboxShow: true
    }
  },
  created () {
    if (this.isMerge()) {
      this.isCheckboxShow = false
    }
  },
  computed: {
    currData () {
      return this.demands || this.donates
    }
  },
  watch: {
    curIdx (val) {
      const path = this.$route.path
      if (val === 1) {
        this.isCheckboxShow = false
        this.mergeSelete = false
      } else {
        if (!this.isMerge()) {
          this.isCheckboxShow = true
        }
      }
    }
  },
  methods: {
    handleMerge () {
      this.mergeSelete = !this.mergeSelete
    },
    handleCheck (id) {
      if (this.currentValue.indexOf(id) >= 0) {
        // 没有选择的时候不做筛选用户操作
        this.currentTitle.pop()
        // this.currentValue = this.currentValue.filter(item => item !== id)
        this.currentValue.pop()
        if (!this.currentValue.length) {
          this.setDefaultSelect()
        }
      } else {
        const type = this.type[this.curIdx]
        let data = this.currData[type].data
        let curData = data.filter(item => item.id === id)[0]
        const title = curData.gift.title
        const selectData = data.filter(item => {
          // 状态要可合并
          // 相同赠送者或者索取者才可以合并
          if (this.canMerge(item)) {
            if (this.demands) {
              // 我的索取
              if (type === 'gift') {
                return item[type].user_id === curData[type].user_id && this.allCondition(item, curData)
              } else if (type === 'need') {
                return item.user_id === curData.user_id && this.allCondition(item, curData)
              }
            } else {
              // 我的赠送
              if (type === 'gift') {
                return item.user_id === curData.user_id && this.allCondition(item, curData)
              } else if (type === 'need') {
                return item[type].user_id === curData[type].user_id && this.allCondition(item, curData)
              }
            }
          }
        })
        this.currentCheckbox = selectData
        this.currentValue.push(id)
        this.currentTitle.push(title)
      }
    },
    allCondition (item, curData) {
      // 念宜：「合併寄送：
      // 1.索取的禮物必需是一樣的物流方式才能合併
      // 2.不給合併的情況：一樣物流，但不同收件資訊
      // 例如：2個禮物的收件姓名不同、收件手機不同、收件地址/櫃機不同/店號不同」
      return this.shipoptsCondition(item, curData) && this.receiverCondition(item, curData) && this.shipwayCondition(item, curData)
    },
    shipoptsCondition (item, curData) {
      // 1.相同的物流商，不同運費負款方，不給合併（剛測試，「掌櫃-索取者負擔」和「掌櫃-贈送者負擔」目前可以合併）
      // 2.相同物流方式
      return item.shipopts === curData.shipopts && item.shipway === curData.shipway
    },
    receiverCondition (item, curData) {
      // 個禮物的收件姓名不同、收件手機不同
      return item.receiver_name === curData.receiver_name && item.receiver_phone === curData.receiver_phone
    },
    isMerge () {
      const path = this.$route.path
      return path.indexOf('dealsReq/requesting') >= 0 ||
      path.indexOf('dealsReq/finished') >= 0 ||
      path.indexOf('dealsReq/sent') >= 0 ||
      path.indexOf('dealsDonate/init') >= 0 ||
      path.indexOf('dealsDonate/sent') >= 0
    },
    shipwayCondition (item, curData) {
      // 收件地址/櫃機不同/店號不同」
      if (item.shipway === Shipways.SHIPWAY_PALMBOX) {
        const itemOrder = JSON.parse(item.gift_ec_order.cabinet_info)
        const curOrder = JSON.parse(curData.gift_ec_order.cabinet_info)
        // 掌柜柜机相同
        return itemOrder.THROWBUILDINGNAME === curOrder.THROWBUILDINGNAME
      } else if (item.shipway === Shipways.SHIPWAY_MEET ||
        item.shipway === Shipways.SHIPWAY_OTHERS ||
        item.shipway === Shipways.SHIPWAY_HOMENG) {
        // 地址相同
        return item.receiver_address === curData.receiver_address
          && item.receiver_city === curData.receiver_city
          && item.receiver_district === curData.receiver_district
      } else if (item.shipway === Shipways.SHIPWAY_FAMI) {
        // 全家店号相同
        return item.receiver_fami === curData.receiver_fami
      } else if (item.shipway === Shipways.SHIPWAY_HCT) {
        // 新竹物流，不同寄件地址和不同收件地址也不給合併
        return item.giver_city === curData.giver_city
          && item.giver_district === curData.giver_district
          && item.giver_address === curData.giver_address
          && item.receiver_address === curData.receiver_address
          && item.receiver_city === curData.receiver_city
          && item.receiver_district === curData.receiver_district
      }
    },
    setDefaultSelect () {
      this.currentValue = []
      this.currentTitle = []
      if (this.curIdx === 0) {
        this.currentCheckbox =
          this.currData[this.type[this.curIdx]].data
            .filter(item => this.canMerge(item))
      } else {
        this.currentCheckbox = []
      }
    },
    handleSubmitMerge () {
      const that = this
      if (this.demands) {
        this.$vux.confirm.show({
          title: '確認要送出該合併請求嗎',
          content: '確定後請等待贈送者同意此申請，同意申請后多個索取將合併為一條。',
          confirmText: '確定',
          onConfirm () {
            that.dealMerge({
              ids: [...that.currentValue],
              cb: that.mergeCb
            })
          }
        })
      } else {
        this.$vux.confirm.show({
          title: `確認要將${this.currentTitle[0]}、${this.currentTitle[1]}${this.currentTitle[2] ? '等': ''}禮物合併嗎`,
          content: '您可以將此合併禮物中物品一併寄出，在按下確認寄出後，您將獲得全部的好人點數。',
          confirmText: '確定',
          onConfirm () {
            that.dealMerge({
              ids: [...that.currentValue],
              cb: that.mergeCb
            })
          }
        })
      }
    },
    mergeCb (data) {
      this.mergeSelete = false
      this.resetSectionDeals([...routeMap[this.$route.path]])
      this.gift.busy = true
      setTimeout(() => {
        this.gift.busy = false
      }, 0)
    },
    canMerge (item) {
      if (
        (
          item.status === 'remitting' ||
          item.status === 'remitted' ||
          item.status === 'received_money'
        )
      ) {
        if (item.parent) {
          if (item.parent.status === 'merge_rejected') {
            // 父请求拒绝状态子请求可以合并
            return true
          } else {
            // 父请求非拒绝状态不能合并
            return false
          }
        } else {
          // 没有父请求，子请求状态可合并
          return true
        }
      } else {
        // 状态不可合并
        return false
      }
    }
  }
}

export default anchorMixin
