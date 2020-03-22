<template>
  <div class="firm-identity">
    <x-header
      @on-click-back="goBack"
      :title="`${$route.meta.title}`">
    </x-header>
    <div class="container g-smooth">
      <group class="intro">
        <cell :key="index" :title="item.title" :inline-desc='item.desc' v-for="(item, index) in items">
          <img width="50" height="auto" slot="icon" :src="item.icon" alt="icon">
        </cell>
      </group>
      <div class="info-item">
        <x-input
          class="star"
          title="公司全名"
          text-align="right"
          placeholder="請輸入"
          :max="60"
          v-model="info.name"
        >
        </x-input>
      </div>
      <div class="hint">(開通後公開顯示,不顯示個人暱稱)</div>
      <div class="info-item">
        <x-input
          class="star"
          title="統一編號"
          text-align="right"
          placeholder="請輸入"
          :max="8"
          v-model="info.taxnum"
        >
        </x-input>
      </div>
      <div class="info-item">
        <x-input
          class="star"
          title="產業別"
          text-align="right"
          placeholder="請輸入"
          :max="20"
          v-model="info.type"
        >
        </x-input>
      </div>
      <div class="group-issues">
        <div class="title">
          <span class="txt">關心議題</span>
          <zc-checkbox v-model="info.pub_issues" id="pubIssues" label="可公開">
          </zc-checkbox>
        </div>
        <div class="issues">
          <span :key="index" :class="['box', info.issues.includes(issue.label) ? 'selected' : '']" v-for="(issue, index) in issues">
            <input v-show="false" type="checkbox" :id="issue.id" :value="issue.label" v-model="info.issues" />
            <label :for="issue.id">{{issue.label}}</label>
          </span>
        </div>
      </div>
      <div class="info-item isBeListed">
        <div class="wrapper">
          <span class="label">上市上櫃公司</span>
          <zc-radio
            class="radio-box"
            :radioList="ipoCompany"
            v-model="info.ipo_company"
          >
          </zc-radio>
        </div>
      </div>
      <div class="group-logo">
        <div class="title">
          <span class="txt">企業Logo上傳</span>
          <span class="hint">圖片大小限制為 4M</span>
        </div>
        <div class="pics">
          <img-upload
            type="request"
            :maxLength="1"
            :imgloaded="imgloaded"
            :removeImg="removeImg"
            :isLoaded="isImgLoaded"
            :imgList="imgList"
            @upLoading="upLoadingImg"
          >
          </img-upload>
        </div>
        <div class="tips">(開通後公開顯示Logo，不顯示個人大頭照)</div>
      </div>
      <x-button class="save-btn" @click.native="launch" type="warn">確認送出</x-button>
    </div>
  </div>
</template>

<script>
import icFirm from '@/assets/icon/profile/profile_data_ic_firm@2x.png'
import ZcRadio from '@/components/ZcRadio'
import ZcCheckbox from '@/components/ZcCheckbox'
import ImgUpload from '@/components/ImgUpload'
import { issues } from '@/tools/constant'
import { taxnumRegexVerify } from '@/tools/regex'
import { Group, Cell, XButton } from 'vux'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    Group,
    Cell,
    ZcCheckbox,
    ZcRadio,
    ImgUpload,
    XButton
  },
  data () {
    return {
      items: [{
        icon: icFirm,
        title: '申請為企業行號',
        desc: '填寫以下申請資料，站方審核成功，部分資訊會公開顯示於您的名片'
      }],
      imgList: [],
      ipoCompany: [{
        text: '是',
        value: 'Y',
        id: 'ipoCompany-yes'
      }, {
        text: '否',
        value: 'N',
        id: 'ipoCompany-no'
      }],
      issues,
      isImgLoaded: false,
      isLaunch: false,
      info: {
        name: '',
        taxnum: '',
        type: '',
        issues: [],
        pub_issues: false,
        ipo_company: 'N',
        logo: ''
      }
    }
  },
  created () {
    if (!this.userCategories.length) {
      this.getUserCategories()
    }
  },
  methods: {
    ...mapActions({
      changeUserRoles: 'changeUserRoles',
      getUserCategories: 'getUserCategories'
    }),
    launch () {
      if (!this.isLaunch) {
        const {name, taxnum, type, issues, logo} = this.info
        if (!name) {
          return this.$vux.toast.text('請輸入公司全名', 'bottom')
        }
        if (!taxnum) {
          return this.$vux.toast.text('請輸入統一編號', 'bottom')
        } else if (!taxnumRegexVerify.test(taxnum)) {
          return this.$vux.toast.text('請輸入正確統一編號', 'bottom')
        }
        if (!type) {
          return this.$vux.toast.text('請輸入產業別', 'bottom')
        }
        if (!issues.length) {
          return this.$vux.toast.text('請選擇關心議題', 'bottom')
        }
        if (!logo) {
          return this.$vux.toast.text('請上傳企業Logo', 'bottom')
        }
        this.isLaunch = true
        const dataObj = {
          category_id: this.userCategories.find(item => item.title === '企業').id,
          gov: 'N',
          info: {
            cat_hash: 'company',
            usr_hash: this.$route.params.hash,
            ...this.info
          }
        }
        this.changeUserRoles({
          dataObj,
          cb: () => {
            this.isLaunch = false
            this.$vux.toast.text('順利送出申請為企業行號，請稍候幾天，我們將通知你審核結果', 'bottom')
            setTimeout(() => this.goBack(), 1000)
          }
        })
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    upLoadingImg () {
      this.isImgLoaded = true
    },
    // 上传图片
    imgloaded (data) {
      this.imgList = [
        ...this.imgList,
        {url: data.url}
      ]
      this.info.logo = data.url
      this.isImgLoaded = false
    },
    // 删除图片
    removeImg (index) {
      this.imgList = this.imgList.filter((item, idx) => idx !== index)
      this.info.logo = ''
    }
  },
  computed: {
    ...mapState({
      userCategories: state => state.configs.userCategories
    })
  }
}
</script>
<style lang="less">
  .firm-identity{
    .weui-cells{
      margin-top: 0;
      line-height: 1;
      .weui-cell{
        padding: 25px 0;
        &:before{
          left: 0;
        }
        .weui-cell__hd{
          img{
            display: block;
            margin-right: @pm-bg;
          }
        }
        .vux-cell-bd{
          .vux-label{
            color: @color-font-C1;
            font-size: @font-S2;
          }
          .vux-label-desc{
            display: block;
            margin-top: 5px;
            color: @color-font-C2;
            font-size: @font-S4;
            line-height: 18px;
          }
        }
      }
    }
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
  .firm-identity{
    height: 100%;
    .container{
      padding: 0 @pm-bg;
      height: calc(~"100% - 44px");
      overflow-y: scroll;
      .intro{
        .g-border-1px;
      }
      .hint{
        padding-top: 5px;
        color: @color-font-C2;
        font-size: 12px;
        font-weight: 400;
      }
      .info-item{
        height: 50px;
        line-height: 50px;
        .g-border-1px;
        &.isBeListed{
          display: flex;
          justify-content: space-between;
          .wrapper{
            flex: 1;
            display: inline-flex;
            justify-content: space-between;
          }
          .label{
            color: @color-font-C1;
            font-size: 15px;
            &:after{
              content: "*";
              display: inline-block;
              width: 6px;
              height: 6px;
              color: @color-CR;
            }
          }
          .radio-box{
            color: @color-font-C2;
            font-size: @font-S3;
          }
        }
      }
      .group-issues{
        padding-bottom: 8px;
        .g-border-1px;
        > .title{
          display: flex;
          justify-content: space-between;
          padding: 18px 0 24px 0;
          color: @color-font-C1;
          font-size: 15px;
          .txt{
            &:after{
              content: "*";
              display: inline-block;
              width: 6px;
              height: 6px;
              color: @color-CR;
            }
          }
        }
        .box{
          label{
            display: inline-block;
            vertical-align: top;
            padding: 0 @pm-md;
            margin:0 @pm-md @pm-md 0;
            height: 34px;
            line-height: 34px;
            color: @color-font-C2;
            font-size: @font-S3;
            border-radius: 3px;
            background: #F8F8F8;
          }
          &.selected{
            label{
              color: #FFF;
              background: @color-CR;
            }
          }
        }
      }
      .group-logo{
        .g-border-1px;
        > .title{
          display: flex;
          justify-content: space-between;
          padding: 18px 0 24px 0;
          color: @color-font-C1;
          font-size: 15px;
          .txt{
            &:after{
              content: "*";
              display: inline-block;
              width: 6px;
              height: 6px;
              color: @color-CR;
            }
          }
          > .hint{
            font-size: @font-S4;
          }
        }
        .tips{
          padding: @pm-bg 0 18px 0;
          color: @color-font-C2;
          font-size: 12px;
          font-weight: 400;
        }
      }
      .save-btn{
        margin: 24px 0 @pm-bg;
        width: 100%;
      }
    }
  }
</style>
