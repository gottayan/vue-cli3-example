<template>
  <div class="firm-identity">
    <x-header class="back-header" @on-click-back="goBack" :title="`${$route.meta.title}`">
    </x-header>
    <div class="container g-smooth">
      <group class="intro">
        <cell
          :key="index"
          :title="item.title"
          :inline-desc='item.desc'
          v-for="(item, index) in items"
        >
          <img width="50" height="auto" slot="icon" :src="item.icon" alt="icon">
        </cell>
      </group>
      <div class="info-item">
        <x-input
          class="star"
          title="學校全名"
          text-align="right"
          placeholder="請輸入"
          v-model.trim="info.name"
        >
        </x-input>
      </div>
      <div class="hint">(開通後公開顯示,不顯示個人暱稱)</div>
      <div class="info-item">
        <x-input
          title="主要窗口"
          text-align="right"
          placeholder="請輸入"
          v-model="info.main_contact"
        >
        </x-input>
      </div>
      <div class="info-item">
        <x-input
          title="統一編號"
          text-align="right"
          placeholder="請輸入"
          :max="8"
          v-model.trim="info.taxnum"
        >
        </x-input>
      </div>
      <div class="info-item grade">
        <div class="wrapper">
          <span class="label">級別</span>
          <zc-checkbox id="govCheck" v-model="info.govCheck" label="教育部認定偏鄉學校">
          </zc-checkbox>
        </div>
        <zc-radio
          class="radio-box"
          :radioList="grade"
          v-model="info.type"
        >
        </zc-radio>
      </div>
      <div class="group-logo">
        <div class="title">
          <span class="txt">學校Logo上傳</span>
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
        title: '申請為學校單位',
        desc: '填寫以下申請資料，站方審核成功，部分資訊會公開顯示於您的名片'
      }],
      isImgLoaded: false,
      imgList: [],
      isLaunch: false,
      grade: [{
        text: '幼稚園',
        value: '幼稚園',
        id: 'kindergarten'
      }, {
        text: '小學',
        value: '小學',
        id: 'primary '
      }, {
        text: '中學',
        value: '中學',
        id: 'middle'
      }, {
        text: '高中職',
        value: '高中職',
        id: 'high'
      }, {
        text: '大專院校',
        value: '大專院校',
        id: 'college'
      }],
      info: {
        name: '',
        main_contact: '',
        taxnum: '',
        logo: '',
        type: '',
        govCheck: false
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
        const {name, type, logo, taxnum} = this.info
        if (!name) {
          return this.$vux.toast.text('請輸入學校全名', 'bottom')
        }
        if (taxnum && !taxnumRegexVerify.test(taxnum)) {
          return this.$vux.toast.text('請輸入正確統一編號', 'bottom')
        }
        if (!type) {
          return this.$vux.toast.text('請選擇級別', 'bottom')
        }
        if (!logo) {
          return this.$vux.toast.text('請上傳學校Logo', 'bottom')
        }
        this.isLaunch = true
        const dataObj = {
          category_id: this.userCategories.find(item => item.title === '學校').id,
          gov: 'N',
          info: {
            cat_hash: 'school',
            usr_hash: this.$route.params.hash,
            ...this.info
          }
        }
        this.changeUserRoles({
          dataObj,
          cb: () => {
            this.isLaunch = false
            this.$vux.toast.text('順利送出申請為學校單位，請稍候幾天，我們將通知你審核結果', 'bottom')
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
    .back-header{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 10;
    }
    .container{
      padding: 44px @pm-bg 0;
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
        &.grade{
          display: flex;
          flex-direction: column;
          padding-bottom: 10px;
          height: auto;
          line-height: 1;
          .wrapper{
            display: inline-flex;
            justify-content: space-between;
            padding: 18px 0 24px;
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
          }
          .radio-box{
            display: flex;
            flex-wrap: wrap;
            color: @color-font-C2;
            font-size: @font-S3;
            line-height: 30px;
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
