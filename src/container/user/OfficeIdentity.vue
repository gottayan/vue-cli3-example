<template>
  <div class="office-identity">
    <x-header class="back-header" @on-click-back="goBack" :title="`${$route.meta.title}`">
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
          title="單位全名"
          text-align="right"
          placeholder="請輸入"
          v-model.trim="info.name"
          :max="60"
        >
        </x-input>
      </div>
      <div class="hint">(開通後公開顯示,不顯示個人暱稱)</div>
      <div class="info-item">
        <x-input
          class="star"
          title="主要窗口"
          text-align="right"
          placeholder="請輸入"
          v-model.trim="info.main_contact"
          :max="60"
        >
        </x-input>
      </div>
      <div class="info-item">
        <x-input
          class="star"
          title="聯絡電話"
          text-align="right"
          placeholder="請輸入"
          v-model.trim="info.tel"
          :max="10"
        >
        </x-input>
      </div>
      <div class="group-address">
        <div class="info-item">
          <popup-picker
            title="地區選擇"
            :data="areaMapLists"
            :columns="3"
            :value="site"
            @on-change="(e) => handleChangePopupPicker(e, 'site')"
          />
        </div>
        <div class="info-item">
          <x-input
            title="詳細地址"
            class="star"
            text-align="right"
            placeholder="請輸入"
            :max="20"
            v-model="info.address"
          >
          </x-input>
        </div>
      </div>
      <div class="info-item purpose">
        <x-textarea
          :max="200"
          :row="3"
          :height="100"
          title="成立宗旨"
          v-model.trim="info.purpose"
          placeholder="請輸入您的成立宗旨"
        />
      </div>
      <div class="group-issues">
        <div class="title">
          <span class="txt">組織屬性</span>
          <zc-checkbox v-model="info.pub_issues" id="isPubIssues" label="可公開">
          </zc-checkbox>
        </div>
        <div class="issues">
          <span :key="index" :class="['box', info.issues.includes(issue.label) ? 'selected' : '']" v-for="(issue, index) in issues">
            <input v-show="false" type="checkbox" :id="issue.id" :value="issue.label" v-model="info.issues" />
            <label :for="issue.id">{{issue.label}}</label>
          </span>
        </div>
      </div>
      <div class="group-logo">
        <div class="title">
          <span class="txt">公文掃描檔上傳</span>
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
      </div>
      <div class="info-item">
        <popup-picker
          title="服務範圍"
          placeholder="請選擇服務範圍"
          :data="[serviceArea]"
          v-model="info.serv_zone"
        />
      </div>
      <div class="info-item">
        <popup-picker
          title="服務總人數"
          placeholder="請選擇服務人數"
          :data="[servicePeoNum]"
          v-model="info.serv_num"
        />
      </div>
      <x-button class="save-btn" @click.native="launch" type="warn">確認送出</x-button>
    </div>
  </div>
</template>

<script>
import icFirm from '@/assets/icon/profile/profile_data_ic_firm@2x.png'
import ZcCheckbox from '@/components/ZcCheckbox'
import ImgUpload from '@/components/ImgUpload'
import { issues, serviceArea, servicePeoNum } from '@/tools/constant'
import {mapGeo} from '@/tools/strMap'
import { Group, Cell, XButton, PopupPicker, XTextarea } from 'vux'
import { telRegexVerify } from '@/tools/regex'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    Group,
    Cell,
    ZcCheckbox,
    ImgUpload,
    XButton,
    PopupPicker,
    XTextarea
  },
  data () {
    return {
      items: [{
        icon: icFirm,
        title: '申請為政府機關',
        desc: '填寫以下申請資料，站方審核成功，部分資訊會公開顯示於您的名片'
      }],
      issues,
      serviceArea,
      servicePeoNum,
      isImgLoaded: false,
      imgList: [],
      site: [''],
      isLaunch: false,
      info: {
        name: '',
        main_contact: '',
        tel: '',
        city: '',
        district: '',
        address: '',
        purpose: '',
        issues: [],
        pub_issues: false,
        doc: '',
        serv_zone: [],
        serv_num: []
      }
    }
  },
  created () {
    if (!this.areaMapLists.length) {
      this.getGeoConfig()
    }
    if (!this.userCategories.length) {
      this.getUserCategories()
    }
  },
  methods: {
    ...mapActions({
      getGeoConfig: 'getGeoConfig',
      changeUserRoles: 'changeUserRoles',
      getUserCategories: 'getUserCategories'
    }),
    launch () {
      if (!this.isLaunch) {
        const {name, main_contact: mainContact, tel, city,
          address, issues, doc, serv_zone: servZone, serv_num: servNum
        } = this.info
        if (!name) {
          return this.$vux.toast.text('請輸入單位全名', 'bottom')
        }
        if (!mainContact) {
          return this.$vux.toast.text('請輸入主要窗口', 'bottom')
        }
        if (!tel) {
          return this.$vux.toast.text('請輸入聯繫電話', 'bottom')
        } else if (!telRegexVerify.test(tel)) {
          return this.$vux.toast.text('請輸入正確聯繫電話', 'bottom')
        }
        if (!city) {
          return this.$vux.toast.text('請選擇地區', 'bottom')
        } else if (!address) {
          return this.$vux.toast.text('請輸入詳細地址', 'bottom')
        }
        if (!issues.length) {
          return this.$vux.toast.text('請選擇組織屬性', 'bottom')
        }
        if (!doc) {
          return this.$vux.toast.text('請上傳公文掃描檔', 'bottom')
        }
        this.isLaunch = true
        const dataObj = {
          category_id: this.userCategories.find(item => item.title === '政府單位').id,
          gov: 'Y',
          info: {
            cat_hash: 'gov',
            usr_hash: this.$route.params.hash,
            ...this.info,
            serv_zone: servZone[0],
            serv_num: servNum[0]
          }
        }
        this.changeUserRoles({dataObj,
          cb: () => {
            this.isLaunch = false
            this.$vux.toast.text('順利送出申請為政府機關，請稍候幾天，我們將通知你審核結果', 'bottom')
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
      this.info.doc = data.url
      this.isImgLoaded = false
    },
    // 删除图片
    removeImg (index) {
      this.imgList = this.imgList.filter((item, idx) => idx !== index)
      this.info.doc = ''
    },
    handleChangePopupPicker (e, type) {
      this[type] = e
      const [city, district] = e
      this.info.city = city
      this.info.district = district
    }
  },
  computed: {
    ...mapState({
      geoConfig: state => state.configs.geoConfig,
      userCategories: state => state.configs.userCategories
    }),
    areaMapLists () {
      return mapGeo(this.geoConfig)
    }
  }
}
</script>
<style lang="less">
  .office-identity{
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
        &.vux-x-textarea{
          display: block;
          width: 100%;
          height: auto;
          .weui-cell__hd{
            height: auto;
            line-height: 1;
            padding: 18px 0;
          }
          .weui-cell__bd{
            line-height: 24px;
            color: @color-font-C1;
            font-size: @font-S3;
            .weui-textarea-counter{
              margin-bottom: @pm-md;
              height: 24px;
              line-height: 24px;
            }
          }
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
    .group-address{
      .info-item{
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
</style>
<style lang="less" scoped>
  @import '../../global.mixin.less';
  .office-identity{
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
        &.purpose{
          height: auto;
          line-height: 1.15;
          overflow: auto;
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
        padding-bottom: 18px;
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
      }
      .save-btn{
        margin: 24px 0 @pm-bg;
        width: 100%;
      }
    }
  }
</style>
