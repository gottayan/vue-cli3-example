<template>
  <div class="firm-identity">
    <x-header class="back-header" @on-click-back="goBack" :title="`${$route.meta.title}`">
    </x-header>
    <div class="container g-smooth">
      <group class="intro">
        <cell :key="index" :title="item.title" :inline-desc='item.desc' v-for="(item, index) in items">
          <img width="50" height="auto" slot="icon" :src="item.icon" alt="icon">
        </cell>
      </group>
      <div class="info-item category">
        <div class="wrapper">
          <span class="label">關懷會員類別</span>
        </div>
        <zc-radio
          class="radio-box"
          :radioList="category"
          v-model="info.type"
        >
        </zc-radio>
      </div>
      <div class="group-logo">
        <div class="title">
          <span class="txt">證明文件上傳</span>
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
      </div>
      <div class="info-item desc">
        <x-textarea
          :max="200"
          :row="3"
          :height="100"
          title="自述特殊狀況"
          placeholder="請您自述特殊狀況"
          v-model.trim="info.description"
        />
      </div>
      <div class="hint">提醒：申請關懷會員需先通過實名驗證</div>
      <x-button class="save-btn" @click.native="launch" type="warn">確認送出</x-button>
    </div>
  </div>
</template>

<script>
import icFirm from '@/assets/icon/profile/profile_data_ic_firm@2x.png'
import ZcRadio from '@/components/ZcRadio'
import ImgUpload from '@/components/ImgUpload'
import { Group, Cell, XButton, XTextarea } from 'vux'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    Group,
    Cell,
    ZcRadio,
    ImgUpload,
    XButton,
    XTextarea
  },
  data () {
    return {
      items: [{
        icon: icFirm,
        title: '申請為關懷會員',
        desc: '以下資料皆不對外公開，請放心填寫並上傳證明文件。'
      }],
      isImgLoaded: false,
      imgList: [],
      isLaunch: false,
      category: [{
        text: '低收入戶',
        value: '低收入戶',
        id: 'low'
      }, {
        text: '中低收入戶',
        value: '中低收入戶',
        id: 'low-middle'
      }, {
        text: '殘障手冊',
        value: '殘障手冊',
        id: 'disability-manual'
      }, {
        text: '其他',
        value: '其他',
        id: 'other'
      }],
      info: {
        type: '',
        doc: '',
        description: ''
      }
    }
  },
  created () {
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      this.getLoginUserInfo()
    }
    if (!this.userCategories.length) {
      this.getUserCategories()
    }
  },
  methods: {
    ...mapActions({
      changeUserRoles: 'changeUserRoles',
      getLoginUserInfo: 'getLoginUserInfo',
      getUserCategories: 'getUserCategories'
    }),
    launch () {
      if (!this.isLaunch) {
        const {type, doc} = this.info
        const {veriPpl} = this.userInfo
        const isVerifyPpl = (typeof veriPpl === 'boolean' ? veriPpl : veriPpl === 'Y')
        if (!isVerifyPpl) {
          return this.$vux.toast.text('請先通過實名驗證', 'bottom')
        }
        if (!type) {
          return this.$vux.toast.text('請選擇關懷會員類別', 'bottom')
        }
        if (!doc) {
          return this.$vux.toast.text('請上傳證明文件', 'bottom')
        }
        this.isLaunch = true
        const dataObj = {
          category_id: this.userCategories.find(item => item.title === '關懷會員').id,
          gov: 'N',
          info: {
            cat_hash: 'care',
            usr_hash: this.$route.params.hash,
            ...this.info
          }
        }
        this.changeUserRoles({
          dataObj,
          cb: () => {
            this.isLaunch = false
            this.$vux.toast.text('順利送出申請為關懷會員，請稍候幾天，我們將通知你審核結果', 'bottom')
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
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
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
        &.category{
          display: flex;
          flex-direction: column;
          height: auto;
          line-height: 1;
          padding-bottom: @pm-md;
          .wrapper{
            display: inline-flex;
            justify-content: space-between;
            margin: 18px 0 24px;
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
        &.desc{
          height: auto;
          line-height: 1.15;
          overflow: auto;
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
          > .hint{
            font-size: @font-S4;
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
