import MessageAPI from './../../store/apis/message'
import GiftAPI from './../../store/apis/gift'
import NeedAPI from './../../store/apis/need'
import ThingAPI from './../../store/apis/thing'
import { queryString } from './../../tools/axios'
import { messageType, statusMap, ShipStatus, banklist, shipMapping, Shipways } from './../../tools/constant'
import { getSmartDate } from './../../tools/datetime'
import { getConversationContent, getLastChar, getBankFromCode, statusMapStep } from './../../tools/strMap'
import { mapState, mapActions } from 'vuex'

const chatroomMixin = {
  data () {
    return {
      deal: {},
      isTrade: true, // 是否為交易窗口
      detail: {
        messages: []
      },
      title: '',
      chatTitle: '',
      from: '',
      showModal: false,
      ShipStatus,
      Shipways,
      content: '', // 文本栏
      steps: [
        { text: '索取中' },
        { text: '匯款中' },
        { text: '寄送中' },
        { text: '已完成' }
      ],
      info: { // 寄送資訊
        receiver_name: '',
        receiver_phone: '',
        shipway: '',
        address: '',
        shipsn: '',
        giver_name: '',
        giver_phone: '',
        giver_bank_info: '',
        receiver_bank_info: ''
      },
      transferInfo: {
        receiver_bank: '',
        receiver_bank_account_name: '',
        receiver_bank_account_number: '',
        receiver_bank_branch: '',
        receiver_remit_money: ''
      },
      chooseBank: ['無'],
      showTransferModal: false,
      messages: [],
      timer: null,
      showPicker: false,
      needScroll: false,
      banklist: [],
      isOpenMsgConfirm: false,
      cMsg: '',
      isEnlargeImage: false,
      enlargeImgSrc: '',
      mergeRoomCardHeight: '',
      mergeMsgList: [],
      isLoadDetail: false
    }
  },
  methods: {
    ...mapActions({
      getMyDemands: 'getMyDemands',
      getConversationId: 'getConversationId'
    }),
    sendMessage () {
      /* eslint-disable camelcase */
      if (!this.content) {
        this.$vux.toast.text('訊息內容不能為空', 'bottom')
        return
      }
      const { isTrade } = this
      this.$vux.loading.show({
        text: '發送訊息中...'
      })
      if (isTrade) {
        const { direct_user_id, gift_request_id, type, need_donate_id } = this.detail
        const bundle = {
          message_content: this.content,
          message_type: 'text',
          direct_user_id,
          gift_request_id,
          type,
          need_donate_id
        }
        MessageAPI.sendTradeMessage(bundle, (data) => {
          this.$vux.loading.hide()
          this.content = ''
          this.getDetail()
        })
      } else {
        const { id: direct_user_id } = this.$route.params
        const bundle = {
          message_content: this.content,
          message_type: 'text',
          direct_user_id
        }
        MessageAPI.sendUserMessage(bundle, (data) => {
          this.$vux.loading.hide()
          this.content = ''
          this.getDetail()
        })
      }
    },
    _analyseMerge (data) {
      if (data.gift_request && data.gift_request.children && data.gift_request.children.length) {
        data.gift_request.children.forEach(item => {
          this.getConversationId({
            tab: this.user.id === this.detail.gift_request.gift.user_id ? 'give' : 'receive',
            type: 'gift_request',
            id: item.id,
            dirUserId: data.direct_user.id,
            cb: this.getConversationIdCb
          })
        })
      }
    },
    getConversationIdCb (data) {
      const id = data && data.data && data.data[0].id
      MessageAPI.getConversationDetail(id, (item, index) => {
        let message = item.messages
        this.mergeMsgList.push({
          title: item.gift_request.gift.title,
          message
        })
      })
    },
    getDetail (cb) {
      const { isTrade } = this
      const { id } = this.$route.params
      if (isTrade) {
        this.needScroll = false
        MessageAPI.getConversationDetail(id, (data) => {
          (this.detail.messages.length !== data.messages.length) && (this.needScroll = true)
          this.detail = data
          if (this.isDetail) {
            this.getUserOtherGifts({
              page: 1,
              userId: data.gift_request.gift.user_id,
              cb: () => {}
            })
          }
          this.isLoadDetail = true
          // 定義物品內容
          this.detail.item = data.gift_request || data.need_donate
          // 定義是否為索取類型
          this.detail.wantType = data.type !== 'gift_request'
          // 定義是否為該贈物主人
          this.detail.iAmOwner =
            (data.gift_request && data.gift_request.user_id === data.direct_user_id) ||
            (data.need_donate && data.need_donate.user_id === data.user_id)
          // 定義是否為索取者付運費
          // this.detail.optIsReceiver = this.detail.shipopts === 'receiver'
          for (let item of statusMap) {
            if (item.text === this.detail.item.status) {
              this.detail.currentStep = item.step
              break
            }
          }
          this.title = `${getSmartDate(data.created_at, true)}索取${this.detail.item.title}`
          this._analyseTradeMessages()
          this._analyseTransferInfo()
          this._transferData()
          const dom = document.getElementById('console-chatroom')
          if (this.detail.item.children && this.detail.item.children.length) {
            this.$nextTick(() => {
              const merge = document.getElementById('mergeRoomCard')
              if (merge) {
                const height = merge.clientHeight
                dom.style.height = `calc(100% - 104px - ${height}px)`
                dom.style.marginTop = `${height}px`
              }
            })
          }
          return data
        }).then((data) => {
          if (cb) {
            cb(data)
          }
        })
      } else {
        this.needScroll = false
        MessageAPI.getChattingDetail(id, (data) => {
          if (data) {
            this.detail.messages.length !== data.length && (this.needScroll = true)
            this.detail.messages = data
            this._analyseUserMessages()
          }
        })
      }
    },
    // 分析消息方法
    _analyseTradeMessages () {
      const { user, direct_user: directUser } = this.detail
      this.messages = this.detail.messages.map((v) => {
        v.isPicture = v.type === 'image'
        v.type = v.type === 'text'
          ? messageType.MESSAGE_TYPE_TEXT
          : v.type = messageType.MESSAGE_TYPE_PICTURE
        if (v.business_type === 'request_reason') {
          v.type = messageType.MESSAGE_TYPE_REQUEST_REASON
        }
        if (v.business_type === 'thanks') {
          v.type = messageType.MESSAGE_TYPE_THANKS
        }
        v.is_system && (v.type = messageType.MESSAGE_TYPE_SYSTEM)
        v.isMine = (this.user.id === v.from_user_id)
        v.avatar = v.isMine
          ? this.user.pics
          : this.user.id === this.detail.direct_user_id
            ? user.pics
            : directUser.pics
        v.content = getConversationContent(v.content, this.detail)
        return v
      })
      this.needScroll && this.initScrollToBottom()
    },
    _analyseUserMessages () {
      // const { id: direct_user_id, directUserName: nickname } = this.$route.params
      const { directUserName: nickname } = this.$route.query
      this.chatTitle = `與會員${nickname || ''}聊天`
      if (this.detail.messages.length) {
        // const { from_user_id } = this.detail.messages[0]
        // const nickname = (parseInt(direct_user_id) === parseInt(from_user_id)
        //   ? this.detail.messages[0].from_user.nickname
        //   : this.detail.messages[0].to_user.nickname)
        this.messages = this.detail.messages.map((msg) => {
          const { from_user_id, user_id, content, is_system, type } = msg
          return {
            ...msg,
            isMine: from_user_id === user_id,
            content,
            // 消息類型： 1 表示文本 2 表示圖片 3 表示系統消息
            type: is_system ? 3 : (type === 'text' ? 1 : 2),
            avatar: msg.from_user.pics,
            isPicture: type === 'image'
          }
        }).reverse()
        this.needScroll && this.initScrollToBottom()
      }
    },
    _analyseTransferInfo () {
      const { item } = this.detail
      if (item) {
        let {
          receiver_name,
          receiver_phone,
          shipway,
          shipfee,
          shipsn,
          receiver_fami,
          giver_bank_account_name,
          giver_bank_account_number,
          giver_bank_branch,
          giver_bank,
          giver_name,
          giver_phone,
          giver_city,
          giver_district,
          giver_address,
          receiver_bank_account_name,
          receiver_bank_account_number,
          receiver_bank_branch,
          receiver_bank
        } = item
        let address = shipMapping.infos.STRING_SHOW_AFTER_SEND
        let giver_bank_info = ``
        let receiver_bank_info = ''
        if (shipway === Shipways.SHIPWAY_FAMI) {
          address = `全家店號 ${receiver_fami}`
          if (giver_bank) {
            giver_bank_info = `${getBankFromCode(giver_bank)} ${giver_bank_branch} ${giver_bank_account_name} ${giver_bank_account_number}`
          } else {
            giver_bank_info = shipMapping.infos.STRING_SHOW_AFTER_SEND
          }
          if (receiver_bank) {
            receiver_bank_info = `${getBankFromCode(receiver_bank)} ${receiver_bank_branch} ${receiver_bank_account_name} ${receiver_bank_account_number}`
          } else {
            receiver_bank_info = shipMapping.infos.STRING_SHOW_AFTER_TRANSFER
          }
        } else if (shipway === Shipways.SHIPWAY_MEET) {
          address = `${giver_city} ${giver_district} ${giver_address}`
        } else if (shipway === Shipways.SHIPWAY_HCT) {
          shipsn = shipMapping.infos.STRING_SHIPSN_TIPS_FOR_HCT
        }

        this.info = {
          ...this.info,
          receiver_name,
          receiver_phone,
          shipway,
          shipfee,
          shipsn: shipsn || shipMapping.infos.STRING_SHOW_AFTER_GOT_MONEY,
          address,
          giver_name: giver_name || shipMapping.infos.STRING_SHOW_AFTER_SEND,
          giver_phone:
            giver_phone ||
            (!giver_name
              ? shipMapping.infos.STRING_SHOW_AFTER_SEND
              : shipMapping.infos.STRING_NOT_PROVIDE),
          giver_bank_info,
          receiver_bank_info
        }
      }
    },
    // 舊代碼
    _transferData () {
      /* eslint-disable */
      const { detail: payload } = this
      const status = (
        payload &&
        payload.gift_request &&
        payload.gift_request.status) ||
        (payload && payload.need_donate && payload.need_donate.status);
      const step = statusMapStep(status);
      const accepter = payload && payload.need_donate &&
        (payload.need_donate.user_id === payload.user.id ? payload.user : payload.direct_user) ||
        payload && payload.gift_request &&
        (payload.gift_request.user_id === payload.user_id ? payload.direct_user : payload.user);
      const gift = payload && payload.gift_request;
      const needDonate = payload && payload.need_donate;
      const receiver = payload && payload.need_donate && (payload.need_donate.user_id === payload.user.id ? payload.direct_user : payload.user) ||
                       payload.gift_request && (payload.gift_request.user_id === payload.user_id ? payload.user : payload.direct_user);
      this.deal = {
        types: payload.type === 'gift_request' ? 'GIVES':'WANTS',
        step,
        infoHash: payload.id,
        chatHash: payload.id,
        need_donate: payload.need_donate ? payload.need_donate : false,
        need_donate_id:payload.need_donate_id,
        direct_user: payload.direct_user,
        gift_request_id:payload.gift_request_id,
        id: payload.gift_request && payload.gift_request_id || payload.need_donate && payload.need_donate_id,
        updatetime: payload.updated_at,
        title: payload.gift_request && payload.gift_request.gift.title || payload.need_donate && payload.need_donate.need_item.name,
        pic: payload.gift_request && payload.gift_request.gift.image_path ||
        payload.need_donate && payload.need_donate.image_path,
        quant: payload.gift_request && payload.gift_request.quantity || payload.need_donate && payload.need_donate.quantity || 0,
        orgquant: payload.orgquant,
        iAmOwner: payload.gift_request && payload.gift_request.user_id == payload.direct_user_id || payload.need_donate && payload.need_donate.user_id == payload.user_id,
        thgHash: payload.gift_request && payload.gift_request.gift_id || payload.need_donate && payload.need_donate.id,
        shipway: payload.gift_request && payload.gift_request.shipway || payload.need_donate && payload.need_donate.shipway,
        shipfee: (payload.gift_request && payload.gift_request.shipfee) || (payload.need_donate && payload.need_donate.shipfee) || 0,
        shipopts: payload.gift_request && payload.gift_request.shipopts || payload.need_donate && payload.need_donate.shipopts,
        shipsn: payload.gift_request && payload.gift_request.shipsn || payload.need_donate && payload.need_donate.shipsn || '',
        boxes: gift ? (gift.giver_boxes || 0) : 0,		// 新竹物流配送的箱數
        pickdate: gift && gift.giver_sent_at || needDonate && needDonate.giver_sent_at || '待定',
        famiCode: needDonate && needDonate.receiver_fami || gift && gift.receiver_fami,
        ownerHash: payload.user_id,
        address: payload.address,
        wantType: (payload.type !== 'gift_request'),
        items: {
          id: payload.gift_request && payload.gift_request_id || payload.need_donate && payload.need_donate_id,
          ...(payload.gift_request && payload.gift_request.gift || payload.need_donate && payload.need_donate.need_item),
          sums: payload.gift_request && payload.gift_request.gift.quantity || payload.need_donate && payload.need_donate.need_item && payload.need_donate.need_item.quantity,
          sents: payload.gift_request && (payload.gift_request.gift.quantity - payload.gift_request.gift.left) || payload.need_donate && payload.need_donate.need_item && (payload.need_donate.need_item.quantity - payload.need_donate.need_item.left) || 0,
        },
        counts: {
          totalSums: payload.gift_request && payload.gift_request.gift.quantity || payload.need_donate && payload.need_donate.need_item && payload.need_donate.need_item.quantity,
          sums: payload.gift_request && payload.gift_request.quantity || payload.need_donate && payload.need_donate.quantity,
          left: payload.gift_request && payload.gift_request.gift.left || payload.need_donate && payload.need_donate.need_item && payload.need_donate.need_item.left,
          sents: payload.gift_request && (payload.gift_request.gift.quantity - payload.gift_request.gift.left) || payload.need_donate && payload.need_donate.need_item && (payload.need_donate.need_item.quantity - payload.need_donate.need_item.left) || 0,
        },
        accepter: accepter && {
          name: gift ? (gift.giver_name || '-') : '-',
          phone: gift ? (gift.giver_phone || '-') : '-', // 不清楚座机还是手机
          address: gift ? ((gift.giver_city || '') + (gift.giver_district || '') + (gift.giver_address || '')) : '-',
          title: payload.need_donate && payload.need_donate.giver_bank_account_name || payload.gift_request && payload.gift_request.giver_bank_account_name,
          number: payload.need_donate && payload.need_donate.giver_bank_account_number || payload.gift_request && payload.gift_request.giver_bank_account_number,
          bank: payload.need_donate && payload.need_donate.giver_bank || payload.gift_request && payload.gift_request.giver_bank,
          branch: payload.need_donate && payload.need_donate.giver_bank_branch || payload.gift_request && payload.gift_request.giver_bank_branch,
          account_number: gift ? (gift.giver_bank_account_number || '') : '',
          account_name: gift ? (gift.giver_bank_account_name || '') : ''
          // note: accepter.acc_note || (state.deal.accepter && state.deal.accepter.note) || '',     // ?
        },
        receiver: receiver && {
          name: gift ? (gift.receiver_name || '暫無') : '暫無',
          phone: gift ? (gift.receiver_phone || '暫無') : '暫無',
          address: gift ? (gift.receiver_address || '-') : '-',
          title: payload.need_donate && payload.need_donate.receiver_name || payload.gift_request && payload.gift_request.receiver_name,
          last5num: payload.need_donate && payload.need_donate.receiver_bank_account_number || payload.gift_request && payload.gift_request.receiver_bank_account_number,
          fee: payload.need_donate && payload.need_donate.receiver_remit_money || payload.gift_request && payload.gift_request.receiver_remit_money,
          bank: payload.need_donate && payload.need_donate.receiver_bank || payload.gift_request && payload.gift_request.receiver_bank,
          branch: payload.need_donate && payload.need_donate.receiver_bank_branch || payload.gift_request && payload.gift_request.receiver_bank_branch,
          account_number: (gift) ?
            (gift.receiver_bank_account_number || '') :
            (needDonate ? (needDonate.receiver_bank_account_number || '') : ''),
          account_name: (gift) ? (gift.receiver_bank_account_name || '') :
            (needDonate ? (needDonate.receiver_bank_account_name || '') : '')
          // note: receiver.rcv_note || (state.deal.receiver && state.deal.receiver.note) || '',
        },
        gift_request: payload.gift_request,
        user: {
          showName: payload.user && payload.user.name,
          name: payload.user && payload.user.name,
          isGOV: payload.direct_user.gov == 'Y',
          cat_hash: payload.direct_user.cat_hash,
          marks: payload.direct_user.marks || '',
          pic: payload.direct_user.pics,  // 不清楚是字符串还是数组
        },
      }
    },
    doTriggerUpload () {
      // console.log('CLICK:', document.querySelector('.input-uploader'))
      document.querySelector('.input-uploader').click()
    },
    uploadImage () {
      let files = document.querySelector('.input-uploader').files
      this.$vux.loading.show({
        text: '發送圖檔中...'
      })
      const type = 'chat'
      ThingAPI.uploadImg(files[0], type, (data) => {
        if (data === null) {
          this.$vux.loading.hide()
          document.querySelector('.input-uploader').value = ''
          this.$vux.toast.text('圖檔上傳失敗')
          return
        }
        const { isTrade } = this
        if (isTrade) {
          const { direct_user_id, gift_request_id, type, need_donate_id } = this.detail
          const bundle = {
            message_content: data.url,
            message_type: 'image',
            direct_user_id,
            gift_request_id,
            type,
            need_donate_id
          }
          MessageAPI.sendTradeMessage(bundle, (data) => {
            this.$vux.loading.hide()
            document.querySelector('.input-uploader').value = ''
            this.getDetail()
          })
        } else {
          const { id: direct_user_id } = this.$route.params
          const bundle = {
            message_content: data.url,
            message_type: 'image',
            direct_user_id
          }
          MessageAPI.sendUserMessage(bundle, (data) => {
            this.$vux.loading.hide()
            document.querySelector('.input-uploader').value = ''
            this.getDetail()
          })
        }
      })
    },
    // 送給他/收下他
    doSendItem () {
      if (this.detail.gift_request_id) {
        const { id, gift, request_quantity: max, shipway, shipfee, shipopts } = this.detail.item
        let params = {
          id,
          max,
          shipway,
          shipfee,
          pic: gift.image_path,
          name: gift.title,
          shipopts,
          directUserName: this.detail.direct_user.nickname,
          left: gift.left
        }
        params = (shipway === 'palmbox' && shipopts !== 'receiver') ? Object.assign({}, params, {
          recity: this.detail.item.receiver_city,
          readdress: this.detail.item.receiver_address,
          redistrict: this.detail.item.receiver_district,
          edcode: JSON.parse(this.detail.item.gift_ec_order.cabinet_info).EDCODE
        }) : params
        const str = queryString(params)
        this.$router.push(`/gift/send${str}`)
      } else {
        // console.log('ITEM:', this.detail.item)
        const { id, need_item: needItem, need, quantity, shipway, shipfee, shipopts } = this.detail.item
        let params = { id, quantity, shipway, shipfee, shipopts, pic: need.image_path, name: needItem.name }
        params = shipway === 'palmbox' ? Object.assign({}, params, {
          recity: this.getPalmBoxInfo.CITYNAME,
          redistrict: this.getPalmBoxInfo.DICTNAME,
          readdress: this.getPalmBoxInfo.TW_THROWADDRESS
        }) : params
        if (shipopts !== 'receiver' && shipway === 'palmbox') {
          const edcode = JSON.parse(this.detail.item.need_ec_order.cabinet_info).EDCODE
          params = Object.assign({}, params, {
            edcode,
          })
        }
        const str = encodeURI(queryString(params))
        this.$router.push(`/need/take${str}`)
      }
    },
    // 新竹物流确认汇款资讯
    doConfirmShip () {
      // console.log('ITEM:', this.detail.item)
      const { id, need_item: needItem, need, quantity, shipway, shipfee, shipopts } = this.detail.item
      const params = { id, quantity, shipway, shipfee, shipopts, pic: need.image_path, name: needItem.name, max: needItem.left }
      const str = queryString(params)
      this.$router.push(`/confirmShip${str}`)
    },
    initScrollToBottom () {
      const scrollToBottom = () => {
        let div = document.getElementById('console-chatroom')
        if (div) {
          const { scrollTop, offsetHeight, scrollHeight } = div
          const offset = scrollHeight - offsetHeight
          if (offset > 0) {
            div.scrollTo(0, offset)
          }
        }
      }

      setTimeout(scrollToBottom, 0)
    },
    toggleModal () {
      this.showModal = !this.showModal
    },
    toggleTransferModal () {
      this.showTransferModal = !this.showTransferModal
    },
    // 取消贈物
    doCancel () {
      const that = this
      const { need_donate_id: needDonateId, gift_request_id: giftRequestId } = this.detail
      this.$vux.confirm.show({
        content: '是否確定取消？',
        theme: 'android',
        confirmText: '決定了',
        cancelText: '再想想',
        onConfirm () {
          if (needDonateId) {
            NeedAPI.cancelNeedDonate(needDonateId, (data) => {
              that.getDetail()
            })
          } else if (giftRequestId) {
            GiftAPI.cancelGift(giftRequestId, (data) => {
              that.getDetail()
            })
          }
        }
      })
    },
    // 忽略此物
    doIgnore () {
      const that = this
      this.$vux.confirm.show({
        content: '是否確定忽略此項？',
        theme: 'android',
        confirmText: '決定了',
        cancelText: '再想想',
        onConfirm () {
          const { need_donate_id: needDonateId, gift_request_id: giftRequestId } = that.detail
          that.$vux.loading.show({
            text: '確認中'
          })
          if (needDonateId) {
            NeedAPI.ignoreNeedDonate(needDonateId, (data) => {
              that.$vux.loading.hide()
              that.getDetail()
            })
          } else if (giftRequestId) {
            GiftAPI.ignoreGift(giftRequestId, (data) => {
              that.$vux.loading.hide()
              that.getDetail()
            })
          }
        }
      })
    },
    // 從已忽略回復贈送流程 同 doSendItem
    // 確認送出
    doSent () {
      const {
        gift_request_id: giftRequestId,
        need_donate_id: needDonateId
      } = this.detail
      this.$vux.loading.show({
        text: '確認中'
      })
      if (giftRequestId) {
        GiftAPI.sentGift(giftRequestId, (data) => {
          this.$vux.loading.hide()
          this.$router.push('/confirmSent')
        })
      } else if (needDonateId) {
        NeedAPI.sentNeed(needDonateId, (data) => {
          this.$vux.loading.hide()
          this.$router.push('/confirmSent')
        })
      }
    },
    // 彈出確認轉帳對話框
    doTransfer () {
      const { others } = this.user
      let bankInfo = null
      if (others &&
          others.banks &&
          Array.isArray(others.banks) &&
          others.banks.length !== 0) {
        bankInfo = others.banks[0]
      }
      if (bankInfo) {
        this.transferInfo = {
          receiver_bank: bankInfo.banks,
          receiver_bank_account_name: bankInfo.title,
          receiver_bank_account_number: getLastChar(bankInfo.accounts, 5),
          receiver_bank_branch: bankInfo.branchs,
          receiver_remit_money: this.detail.item.shipfee
        }
        for (const bank of banklist) {
          if (bank.code === bankInfo.banks) {
            this.chooseBank = [`${bank.code} ${bank.name}`]
            break
          }
        }
      }
      this.toggleTransferModal()
    },
    // 確認轉帳
    doConfirmTransfer () {
      const { chooseBank } = this
      const { gift_request_id, need_donate_id } = this.detail
      const {
        receiver_bank_account_name,
        receiver_bank_branch,
        receiver_bank_account_number
      } = this.transferInfo
      if (chooseBank[0].indexOf('無') !== -1) {
        this.$vux.toast.text('請選擇匯款銀行')
        return
      }
      if (!receiver_bank_account_name || !receiver_bank_branch || !receiver_bank_account_number) {
        this.$vux.toast.text('請完善匯款資訊')
        return
      }
      this.transferInfo = {
        ...this.transferInfo,
        receiver_bank: chooseBank[0].split(' ')[0]
      }
      this.$vux.loading.show({
        text: '確認中...'
      })
      if (gift_request_id) {
        this.transferInfo.gift_request_id = gift_request_id
        GiftAPI.transferGift(this.transferInfo, (data) => {
          this.$vux.loading.hide()
          this.showTransferModal = false
          this.getDetail()
          const {from} = this.$route.query
          if (from === 'userInfo') {
            this.getMyDemands({
              status: 'remitting'
            })
          }
        })
      } else {
        this.transferInfo.need_donate_id = need_donate_id
        NeedAPI.transferNeed(this.transferInfo, (data) => {
          this.$vux.loading.hide()
          this.showTransferModal = false
          this.getDetail()
          const {from} = this.$route.query
          if (from === 'userInfo') {
            this.getMyDemands({
              status: 'remitting',
              type: 'present'
            })
          }
        })
      }
    },
    // 確認收款
    doReceiveMoney () {
      const { need_donate_id: needDonateId,
        gift_request_id: giftRequestId } = this.detail
      this.$vux.loading.show({
        text: '確認中...'
      })
      if (needDonateId) {
        let tmp = {}
        if (this.detail.need_donate.need_ec_order) {
          tmp = JSON.parse(this.detail.need_donate.need_ec_order.cabinet_info)
        }
        NeedAPI.receiveMoneyNeed(needDonateId, (data) => {
          this.$vux.loading.hide()
          this.getDetail()
        }, tmp.EDCODE)
      } else if (giftRequestId) {
        let tmp = {}
        if (this.detail.gift_request.gift_ec_order) {
          tmp = JSON.parse(this.detail.gift_request.gift_ec_order.cabinet_info)
        }
        GiftAPI.receiveMoneyGift(giftRequestId, (data) => {
          this.$vux.loading.hide()
          this.getDetail()
        }, tmp.EDCODE)
      }
    },
    // 確認收到
    doReceived () {
      const { need_donate_id: needDonateId,
        gift_request_id: giftRequestId } = this.detail
      this.$vux.loading.show({
        text: '確認中...'
      })
      const isMergeFlag = this.detail.item && this.detail.item.children && this.detail.item.children.length
      if (needDonateId) {
        NeedAPI.finishNeed(needDonateId, (data) => {
          this.$vux.loading.hide()
          this.getDetail()
          this.doThanks()
        })
      } else if (giftRequestId) {
        GiftAPI.finishGift(giftRequestId, (data) => {
          this.$vux.loading.hide()
          this.getDetail()
          if (!isMergeFlag) {
            this.doThanks()
          }
        })
      }
    },
    // 前往感谢页面
    doThanks () {
      const { id } = this.$route.params
      const { need_donate_id: needDonateId,
        gift_request_id: giftRequestId } = this.detail
      if (giftRequestId) {
        this.$router.push(`/thanksItem/${giftRequestId}?chatroom_id=${id}`)
      }
      if (needDonateId) {
        this.$router.push(`/thanksItem/${needDonateId}?chatroom_id=${id}&type=need`)
      }
    },
    toggleShow () {
      this.isEnlargeImage = !this.isEnlargeImage
      if (!this.isEnlargeImage) {
        this.enlargeImgSrc = ''
      }
    },
    doEnlargeImage (src) {
      this.isEnlargeImage = true
      this.enlargeImgSrc = src
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.userInfo
    }),
    getPalmBoxInfo () {
      const edcode = JSON.parse(this.detail.item.need_ec_order.cabinet_info).EDCODE
      return this.$store.getters.currentPalmBoxInfo(edcode)
    }
  },
  created () {
    const { type, from } = this.$route.query
    type === 'user' && (this.isTrade = false)
    from === 'env' && (this.from = 'env')
    this.getDetail((data) => {
      this._analyseMerge(data)
    })
    this.banklist = banklist.map((v) => {
      return {
        name: `${v.code} ${v.name}`,
        value: `${v.code} ${v.name}`
      }
    })
    this.timer = setInterval(() => {
      this.getDetail()
    }, 1000 * 15)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}

export default chatroomMixin