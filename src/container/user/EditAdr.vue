<template>
  <div class="user-edit-adr g-smooth">
    <group class="section-address">
        <section-title title="聯絡地址">
        </section-title>
        <div class="group-address">
          <div class="title">
            <span class="txt">將聯絡地址設定為物品所在預設地址及收件預設地址</span>
            <zc-checkbox
              v-model="isInitAdr"
              id="isSetInitAdr"
              @change="initAdr"
            >
            </zc-checkbox>
          </div>
          <div class="info-item">
            <popup-picker
              title="地區選擇"
              :data="areaMapLists"
              :columns="3"
              v-model="addresses.users.site"
            />
          </div>
          <div class="info-item">
            <x-input
              title="詳細地址"
              text-align="right"
              placeholder="請輸入"
              v-model="addresses.users.adr"
            >
            </x-input>
          </div>
        </div>
        <template v-if="!isInitAdr">
          <div class="group-address">
            <div class="title">
              <span class="txt">物品所在預設地址</span>
            </div>
            <div class="info-item">
              <popup-picker
                title="地區選擇"
                :data="areaMapLists"
                :columns="3"
                v-model="addresses.things.site"
              />
            </div>
            <div class="info-item">
              <x-input
                title="詳細地址"
                text-align="right"
                placeholder="請輸入"
                v-model="addresses.things.adr"
              >
              </x-input>
            </div>
          </div>
          <div class="group-address">
            <div class="title">
              <span class="txt">收件預設地址</span>
            </div>
            <div class="info-item">
              <popup-picker
                title="地區選擇"
                :data="areaMapLists"
                :columns="3"
                v-model="addresses.rcvs.site"
              />
            </div>
            <div class="info-item">
              <x-input
                title="詳細地址"
                text-align="right"
                placeholder="請輸入"
                v-model="addresses.rcvs.adr"
              >
              </x-input>
            </div>
          </div>
        </template>
        <div class="group-address">
          <div class="title">
            <span class="txt">面交預設地址</span>
          </div>
          <div class="info-item">
            <popup-picker
              title="地區選擇"
              :data="areaMapLists"
              :columns="3"
              v-model="addresses.meets.site"
            />
          </div>
          <div class="info-item">
            <x-input
              title="詳細地址"
              text-align="right"
              placeholder="請輸入"
              v-model="addresses.meets.adr"
            >
            </x-input>
          </div>
        </div>
      </group>
    <div class="save-btn">
      <x-button class="btn" @click.native="modifyUserInfo" type="warn">保存</x-button>
    </div>
  </div>
</template>

<script>
import { Group, XButton, PopupPicker } from 'vux'
import SectionTitle from '@/components/Title'
import ZcCheckbox from '@/components/ZcCheckbox'
import {mapGeo} from '@/tools/strMap'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    Group,
    XButton,
    SectionTitle,
    PopupPicker,
    ZcCheckbox
  },
  data () {
    return {
      isInitAdr: false,
      addresses: {
        users: {
          site: [''],
          adr: ''
        },
        things: {
          site: [''],
          adr: ''
        },
        rcvs: {
          site: [''],
          adr: ''
        },
        meets: {
          site: [''],
          adr: ''
        }
      }
    }
  },
  created () {
    if (!this.areaMapLists.length) {
      this.getGeoConfig()
    }
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      return this.getLoginUserInfo({cb: () => this.getLoginUserInfoCb()})
    }
    this.getLoginUserInfoCb()
  },
  methods: {
    ...mapActions({
      getGeoConfig: 'getGeoConfig',
      getLoginUserInfo: 'getLoginUserInfo',
      modify: 'modify'
    }),
    getLoginUserInfoCb () {
      const {others} = this.userInfo
      if (others) {
        const category = ['users', 'things', 'rcvs', 'meets']
        if (others.addresses) {
          category.forEach((item) => {
            const location = others.addresses[item]
            if (location) {
              this.addresses[item].site = [`${location.city || ''}`, `${location.district || ''}`]
              this.addresses[item].adr = location.address || ''
            } else {
              this.addresses[item].site = ['', '']
              this.addresses[item].adr = ''
            }
          })
        }
      }
    },
    initAdr (val) {
      const {others} = this.userInfo
      if (others) {
        if (others.addresses) {
          const {users} = others.addresses
          const category = ['things', 'rcvs']
          if (val) {
            category.forEach((item) => {
              this.addresses[item].site = [`${users.city}`, `${users.district}`]
              this.addresses[item].adr = users.address
            })
          } else {
            category.forEach((item) => {
              const location = others.addresses[item]
              if (location) {
                this.addresses[item].site = [`${location.city}`, `${location.district}`]
                this.addresses[item].adr = location.address
              } else {
                this.addresses[item].site = ['', '']
                this.addresses[item].adr = ''
              }
            })
          }
        }
      }
    },
    modifyUserInfo () {
      const {others} = this.userInfo
      const {users, things, rcvs} = this.addresses
      if (!users.site[0]) {
        return this.$vux.toast.text('請選擇聯絡地址地區', 'bottom')
      } else if (!users.adr.trim()) {
        return this.$vux.toast.text('請輸入聯絡地址詳細地址', 'bottom')
      }
      if (!this.isInitAdr) {
        if (!things.site[0]) {
          return this.$vux.toast.text('請選擇物品所在預設地址地區', 'bottom')
        } else if (!things.adr.trim()) {
          return this.$vux.toast.text('請輸入物品所在預設地址詳細地址', 'bottom')
        }
        if (!rcvs.site[0]) {
          return this.$vux.toast.text('請選擇收件預設預設地址地區', 'bottom')
        } else if (!rcvs.adr.trim()) {
          return this.$vux.toast.text('請輸入收件預設地址詳細地址', 'bottom')
        }
      }
      let addresses = {}
      for (let [key, value] of Object.entries(this.addresses)) {
        if (this.isInitAdr &&
          (key === 'things' || key === 'rcvs')) {
          addresses[key] = {
            city: this.addresses.users.site[0],
            district: this.addresses.users.site[1],
            address: this.addresses.users.adr
          }
        } else {
          addresses[key] = {
            city: value.site[0],
            district: value.site[1],
            address: value.adr
          }
        }
      }
      const otherUserInfo = {
        ...others,
        addresses
      }
      const dataObj = {
        others: JSON.stringify(otherUserInfo)
      }
      this.modify({dataObj, cb: () => this.modifyUserInfoCb()})
      this.$vux.loading.show({
        text: '更新資料中...'
      })
    },
    modifyUserInfoCb () {
      this.$vux.loading.hide()
      this.$vux.toast.text('更新成功', 'bottom')
      this.getLoginUserInfo({
        cb: () => {
          const redirect = this.$route.query.redirect
          if (redirect) {
            return this.$router.push(`${redirect}`)
          }
          setTimeout(() => this.$router.go(-1), 1000)
        }
      })
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      geoConfig: state => state.configs.geoConfig
    }),
    areaMapLists () {
      return mapGeo(this.geoConfig)
    }
  }
}
</script>
<style lang="less">
  .user-edit-adr{
    .weui-cells{
      margin-top: 0;
      padding: 30px 0 0 0;
      &:before, &:after{
        display: none;
      }
      .weui-cell{
        padding: 0;
        &:before{
          border: none;
        }
        .vux-number-round{
          .vux-number-input{
            width: 32px !important;
            font-size: @font-S3;
          }
          .vux-number-selector{
            border: none;
            svg {
              fill: #FFF;
            }
            &.vux-number-selector-sub, &.vux-number-selector-plus{
              padding: 0;
              background: @color-CR;
            }
            &.vux-number-disabled{
              background: @color-DSA;
            }
          }
        }
      }
      .weui-cells_radio{
        .weui-cell_radio{
          padding: 0 @pm-bg;
          height: 36px;
          color: @color-font-C2;
          font-size: @font-S3;
          .weui-cell__ft{
            .weui-icon-checked{
              position: relative;
              width: 16px;
              height: 16px;
              border: 1px solid @color-font-C2;
              border-radius: 50%;
              &:before{
                position: absolute;
                top: -1px;
                left: -1px;
                margin: 0;
                width: 16px;
                height: 16px;
                color: @color-CR;
                font-size: @font-S4;
                border-radius: 50%;
                background: #f9dad5;
                overflow: hidden;
              }
            }
          }
        }
      }
    }
    .info-item{
      .weui-cell{
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
  @import '../../../node_modules/vux/src/styles/1px.less';
  @import '../../global.mixin.less';
  .user-edit-adr{
    background: #FFF;
    height: 100%;
    overflow-y: scroll;
    .hint{
      padding-top: 5px;
      color: @color-font-C2;
      font-size: 12px;
      font-weight: 400;
    }
    .section-address{
      padding:0 @pm-bg;
      .info-item{
        height: 50px;
        line-height: 50px;
        .g-border-1px;
        &:nth-of-type(2){
          margin-top: 6px;
        }
      }
    }
    .section-address{
      .info-item{
        &.init-address{
          display: flex;
          justify-content: space-between;
          margin: 24px 0 @pm-bg;
          height: auto;
          line-height: 1.15;
          .tips{
            color: @color-font-C2;
            font-size: @font-S4;
          }
        }
      }
      .group-address{
        > .title{
          display: flex;
          justify-content: space-between;
          padding: 24px 0 @pm-bg 0;
          color: @color-font-C2;
          font-size: @font-S4;
        }
      }
    }
    .save-btn{
      padding: 24px @pm-bg @pm-bg;
      width: 100%;
    }
  }
</style>
