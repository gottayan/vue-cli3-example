<template>
  <div class="lovebox-contact">
    <x-header title="愛箱送企業聯絡">
    </x-header>
    <div class="container g-smooth">
      <div class="info-item">
        <x-input
          class="star"
          title="公司名稱"
          text-align="right"
          placeholder="請輸入公司名稱"
          v-model.trim="info.company_name"
        >
        </x-input>
      </div>
      <div class="info-item">
        <x-input
          title="公司統編"
          text-align="right"
          placeholder="請輸入公司統編"
          :max="8"
          v-model.trim="info.company_no"
        >
        </x-input>
      </div>
      <div class="info-item">
        <x-input
          title="聯絡地址"
          text-align="right"
          placeholder="請輸入聯絡地址"
          v-model.trim="info.address"
        >
        </x-input>
      </div>
      <div class="info-item">
        <x-input
          class="star"
          title="聯絡人"
          text-align="right"
          placeholder="請輸入聯絡人"
          v-model.trim="info.contact"
        >
        </x-input>
      </div>
      <div class="info-item">
        <x-input
          class="star"
          title="聯絡電話"
          text-align="right"
          placeholder="請輸入聯絡電話"
          :max="10"
          v-model.trim="info.phone"
        >
        </x-input>
      </div>
      <div class="info-item">
        <x-input
          class="star"
          title="E-mail"
          text-align="right"
          placeholder="請輸入mail"
          v-model.trim="info.email"
        >
        </x-input>
      </div>
      <div class="info-item">
        <x-input
          title="公司網址"
          text-align="right"
          placeholder="請輸入公司網址"
          v-model.trim="info.website"
        >
        </x-input>
      </div>
      <div class="info-item">
        <x-input
          title="備註"
          text-align="right"
          placeholder="請輸入備註"
          v-model.trim="info.remark"
        >
        </x-input>
      </div>
      <span @click="toSave" class="btn">保存</span>
    </div>
  </div>
</template>

<script>
import { taxnumRegexVerify, emailRegex } from '@/tools/regex'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      isSend: false,
      info: {
        company_name: '',
        company_no: '',
        address: '',
        contact: '',
        phone: '',
        email: '',
        website: '',
        remark: ''
      }
    }
  },
  methods: {
    ...mapActions({
      contactCompany: 'contactCompany'
    }),
    toSave () {
      const {company_name: companyName, company_no: companyNo, contact, phone, email} = this.info
      if (!companyName) {
        return this.$vux.toast.text('請輸入公司名稱', 'bottom')
      }
      if (companyNo && !taxnumRegexVerify.test(companyNo)) {
        return this.$vux.toast.text('請輸入正確公司統編', 'bottom')
      }
      if (!contact) {
        return this.$vux.toast.text('請輸入聯絡人', 'bottom')
      }
      if (!phone) {
        return this.$vux.toast.text('請輸入聯絡電話', 'bottom')
      }
      if (!email) {
        return this.$vux.toast.text('請輸入email', 'bottom')
      } else if (!emailRegex.test(email)) {
        return this.$vux.toast.text('請輸入正確email', 'bottom')
      }
      if (!this.isSend) {
        this.isSend = true
        let data = {}
        for (let [key, value] of Object.entries(this.info)) {
          if (value) {
            data = {
              ...data,
              [key]: value
            }
          }
        }
        this.contactCompany({
          data,
          cb: () => {
            this.isSend = false
            this.$vux.toast.text('提交申請成功，請耐心等候，我們會有專人盡快回覆聯繫', 'bottom')
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style lang="less">
  .lovebox-contact{
    .info-item{
      .weui-cell{
        padding: 0;
        .weui-cell__hd, .vux-cell-bd .vux-label{
          color: @color-font-C1;
          font-size: 15px;
        }
        .weui-cell__bd, .vux-popup-picker-select-box{
          color: @color-font-C2;
          font-size: @font-S3;
        }
        .vux-popup-picker-select-box{
          color: @color-font-C3;
        }
        &.star{
          .weui-label{
            &:after{
              content: "*";
              display: inline-block;
              width: 6px;
              height: 6px;
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
  .lovebox-contact{
    height: 100%;
    .container{
      padding: 0 @pm-bg;
      height: calc(~"100% - 44px");
      overflow-y: scroll;
      .info-item{
        height: 50px;
        line-height: 50px;
        .g-border-1px;
      }
      .btn{
        display: block;
        margin: 24px 0;
        width: 100%;
        height: 42px;
        line-height: 42px;
        color: #FFF;
        font-size: 18px;
        text-align: center;
        border-radius: 5px;
        background: @color-CR;
      }
    }
  }
</style>
