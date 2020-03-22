<template>
  <div class="impeach">
    <confirm
      class="impeach"
      hide-on-blur
      :value="true"
      theme="android">
      <div class="impeach-confirm">
        <section-title
          class="impeach-confirm-title"
          title="檢舉">
        </section-title>
        <div class="section-reason">
          <div class="title">檢舉理由：</div>
          <div class="container">
            <zc-radio
              class="radio-box"
              :radioList="reasons"
              v-model="reason">
            </zc-radio>
          </div>
        </div>
        <div
          v-if="reason === '其他'"
          class="section-other">
          <div class="title">其他</div>
          <div class="container">
            <x-textarea
              v-model="otherReason"
              :max="200"
              show-counter
              class="reason-textarea"
              placeholder="請輸入檢舉理由">
            </x-textarea>
          </div>
        </div>
        <div
          class="save-btn"
          @click="onConfirm">
          確認
        </div>
      </div>
      <span
        class="close"
        @click="cancleConfirm">
      </span>
    </confirm>
  </div>
</template>

<script>
import { Confirm, XTextarea, TransferDomDirective as TransferDom } from 'vux'
import ZcRadio from '@/components/ZcRadio'
import SectionTitle from '@/components/Title'
import {mapActions} from 'vuex'

export default {
  directives: {
    TransferDom
  },
  props: {
    type: {
      type: String,
      default: 'gift'
    },
    id: {
      type: Number,
      required: true
    }
  },
  components: {
    Confirm,
    XTextarea,
    ZcRadio,
    SectionTitle
  },
  data () {
    return {
      reasons: [{
        text: '超收郵資',
        value: '超收郵資',
        id: 'reason01'
      }, {
        text: '內容違反規定',
        value: '內容違反規定',
        id: 'reason02'
      }, {
        text: '廣告嫌疑',
        value: '廣告嫌疑',
        id: 'reason03'
      }, {
        text: '其他',
        value: '其他',
        id: 'reason04'
      }],
      reason: '超收郵資',
      otherReason: '',
      isReport: false
    }
  },
  methods: {
    ...mapActions({
      report: 'report'
    }),
    onConfirm () {
      if (this.reason === '其他') {
        if (!this.otherReason) {
          return this.$vux.toast.text('請輸入檢舉理由', 'bottom')
        }
      }
      if (!this.isReport) {
        this.isReport = true
        const reason = this.reason === '其他' ? this.otherReason : this.reason
        this.report({
          type: this.type,
          id: this.id,
          reason,
          cb: this.reportCb
        })
      }
    },
    reportCb (data) {
      this.cancleConfirm()
      this.isReport = false
      const tip = this.type === 'gift' ? '禮物' : '需求'
      if (data.error) {
        if (data.error === 'YOU_HAVE_REPORTED') {
          return this.$vux.toast.text(`您已檢舉過該${tip}`, 'bottom')
        }
        return this.$vux.toast.text('提交檢舉失敗，請稍後重試', 'bottom')
      }
      this.$vux.toast.text(`已收到您提交的對該${tip}的檢舉，<br />我們將馬上審核該${tip}，<br />並對檢舉內容進行處理，感謝您的積極舉報。`, 'bottom')
    },
    cancleConfirm () {
      this.$emit('closeImpeach', false)
    }
  }
}
</script>

<style lang="less">
  .impeach-confirm{
    .weui-cell__bd{
      height: 70px;
      .weui-textarea-counter{
        display:block !important;
      }
    }
    .section-reason{
      .container{
        .radio-box{
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          .radioItem{
            display: inline-flex;
            flex-direction: column;
            justify-content: space-between;
            margin: @pm-bg 0 0;
            padding: @pm-bg @pm-md;
            text-align: center;
            border: 1px solid @color-CL;
            flex:0 0 45%;
            input{
              display: none;
            }
            label{
              color: @color-font-C2;
            }
            input[type="radio"]:checked + label{
              color: @color-CR;
            }
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  @import '../../global.mixin.less';
  .impeach{
    .impeach-confirm{
      text-align: left;
      &-title{
        padding: 5px 0 @pm-lg 0;
        .g-border-1px();
      }
      .section-reason, .section-other{
        > .title{
          color: @color-font-C1;
          font-size: 15px;
        }
        > .container{
          margin: 0 0 14px;
        }
      }
      .section-reason{
        margin-top: @pm-lg;

      }
      .section-other{
        margin-top: 24px;
        .reason-textarea{
          padding: @pm-md;
          margin: @pm-bg 0;
          font-size: @font-S3;
          border: 1px solid @color-CL;
        }
      }
      .save-btn{
        width: 100%;
        height: 40px;
        line-height: 40px;
        color: #FFF;
        font-size: @font-S2;
        text-align: center;
        border-radius: 3px;
        background: @color-CR;
      }
    }
  }
</style>
