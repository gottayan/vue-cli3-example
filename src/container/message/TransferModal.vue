<template>
  <div :class="showTransferModal ? 'g-modal show' : 'g-modal'">
    <div class="modal-content">
      <header class="header">
          <span class="g-title">
            確認 <small>/ 請填寫您匯款給對方的帳戶資料</small>
          </span>
        <button class="btn-close" @click="toggleTransferModal">
          <img src="./../../assets/icon/message/icon-times.png" alt="" class="src">
        </button>
      </header>
      <div class="x-row">
        <span class="degree">元</span>
        <x-input title="匯款金額"
                  required
                  v-model="transferInfo.receiver_remit_money"
                  type="number">
        </x-input>
      </div>
      <div class="x-row">
        <label >匯款銀行</label>
        <!--<span class="degree">-->
        <!--<img src="./../../assets/icon/message/icon-arrow-down.png" alt="" />-->
        <!--</span>-->
        <PopupPicker :data="banklist"
                      class="content bank-picker"
                      v-model="myChooseBank"
                      :columns="1"
                      :show="showPicker">
        </PopupPicker>
      </div>
      <div class="x-row">
        <x-input title="匯款分行"
                  required
                  placeholder="請輸入"
                  v-model="transferInfo.receiver_bank_branch"
                  type="text">
        </x-input>
      </div>
      <div class="x-row">
        <x-input title="匯款戶名"
                  required
                  placeholder="請輸入"
                  v-model="transferInfo.receiver_bank_account_name"
                  type="text">
        </x-input>
      </div>
      <div class="x-row">
        <x-input title="帳號末五碼"
                  :max="5"
                  required
                  placeholder="請輸入"
                  v-model="transferInfo.receiver_bank_account_number"
                  type="text">
        </x-input>
      </div>
      <div class="x-row" style="margin-top: 15px">
        <button class="g-button red" @click="doConfirmTransfer">通知對方您已匯款</button>
      </div>
    </div>
  </div>
</template>

<script>
import { PopupPicker } from 'vux'

export default {
  data () {
    return {
      chooseBankData: this.chooseBank
    }
  },
  components: {
    PopupPicker
  },
  computed: {
    myChooseBank: {
      get: function () {
        return this.chooseBank
      },
      set: function () {
      }
    }
  },
  props: {
    showTransferModal: {
      type: Boolean,
      default: false
    },
    toggleTransferModal: {
      type: Function,
      default: () => {}
    },
    transferInfo: {
      type: Object,
      default: () => {}
    },
    banklist: {
      type: Array,
      default: () => []
    },
    chooseBank: {
      type: Array,
      default: () => []
    },
    showPicker: {
      type: Boolean,
      default: false
    },
    doConfirmTransfer: {
      type: Function,
      default: () => {}
    }
  }
}
</script>

<style lang="less">
@import "./../../global.style.less";
@height-steps: 72px;
@height-functions: 104px;
@height-gift: 44px;
@height-row: 44px;
.modal-content {
  .weui-cell {
    padding: 0!important;
    .weui-cell__ft {
      display: none;
    }
  }
  .x-row {
  position: relative;
  height: @height-row;
  width: 100%;
  display: block;
  border-bottom: 1px solid @color-CL;
  label, input, .degree, .content {
    font-size: @font-S3;
    height: @height-row;
    line-height: @height-row;
  }
  label {
    width: 100px;
    display: inline-block;
  }
  input, .content {
    float: right;
    text-align: right;
    top: -1px;
    position: relative;
    background-color: transparent;
    border: none;
    outline: none;
    width: calc(~"100% - 140px");
  }
  .degree {
    float: right;
    margin-left: @pm-md;
    img {
      opacity: .8;
      width: 15px;
    }
  }
  .vux-cell-value {
    color: @color-font-C1;
  }
}
.bank-picker{
  .weui-cell{
    .weui-cell__ft{
      display: inline-block;
      width: 27px;
      height: 8px;
      &:after{
        width: 13px;
        height: 8px;
        background: #fff url('./../../assets/icon/message/icon-arrow-down.png') right center no-repeat;
        background-size: 13px 8px;
        transform: none;
        border: none;
      }
    }
  }
}
}

</style>
