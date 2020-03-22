<template>
  <div class="newgift-container">
    <x-header title="編輯物品">
    </x-header>
    <div class="content g-smooth">
      <div class="newgift-step-first">
        <group class="newgift-content-panel-imgs">
          <img-upload
            type="gift"
            :imgloaded="imgloaded"
            :removeImg="removeImg"
            :isLoaded="isImgLoaded"
            :imgList="imgLists"
            :multiple="true"
            :maxLength="3"
            @upLoading="upLoadingImg"
          >
          </img-upload>
        </group>
        <group class="newgift-content-panel">
          <div class="gift-name">
            <x-input
              title="禮物名稱"
              :max="20"
              :min="1"
              v-model.trim="newGift.title"
              text-align="right"
              placeholder="請輸入"
              @on-change="calculateGiftName"
            />
            <span class="counter">{{giftNameLength}}/20</span>
          </div>
          <x-number
            title="數量"
            :max="50"
            :min="sentNum || 1"
            width="30px"
            button-style="round"
            v-model="newGift.quantity"
          />
          <x-textarea
            :max="500"
            :row="5"
            :height="150"
            v-model.trim="newGift.desc"
            title="物品描述"
            placeholder="請輸入您的物品描述內容"
          />
        </group>
      </div>
      <div class="newgift-step-second">
        <div class="newgift-step-second-wrapper">
          <group class="section-ships">
            <div class="ships">
              <ship-way :initShipWay="currentGift.gift_ships" @shipWay="setShipWay" type="gift">
              </ship-way>
            </div>
          </group>
          <group class="section-date">
            <section-title title="刊登日期">
            </section-title>
            <datetime
              title="刊登日期"
              readonly
              format="YYYY/MM/DD"
              v-model="newGift.date"
              :default-selected-value="today"
              :start-date="today"
            >
            </datetime>
          </group>
        </div>
        <div class="btn-box">
          <flexbox :gutter="0">
            <flexbox-item>
              <x-button class="prestep" type="warn" @click.native="goBack">取消編輯</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button class="nextstep" type="warn" @click.native="modify">確認送出</x-button>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import format from 'date-fns/format'
// import { format } from 'date-fns'
import { XInput, Group, XButton, XNumber, XTextarea,
  Datetime, Flexbox, FlexboxItem } from 'vux'
import ImgUpload from '@/components/ImgUpload'
import ShipWay from '@/components/ShipWay'
import SectionTitle from '@/components/Title'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    XInput,
    Group,
    XButton,
    XNumber,
    XTextarea,
    Datetime,
    ImgUpload,
    Flexbox,
    FlexboxItem,
    SectionTitle,
    ShipWay
  },
  data () {
    return {
      today: format(new Date(), 'YYYY/MM/DD'),
      imgLists: [],
      giftNameLength: 0,
      isModify: false,
      sentNum: 0,
      newGift: {
        quantity: 1,
        title: '',
        desc: '',
        gift_images: [],
        gift_ships: [],
        date: '' // 刊登日期
      },
      shipWay: {
        bundle: [{
          isSelected: false,
          fareWay: 'receiver',
          fare: 60
        }, {
          isSelected: false,
          fareWay: 'pod',
          fare: 150
        }, {
          isSelected: false,
          fareWay: 'receiver',
          fare: ''
        }, {
          isSelected: false,
          fareWay: 'pod',
          fare: ''
        }, {
          isSelected: false,
          fareWay: 'pod',
          fare: ''
        }],
        area: [],
        location: ''
      },
      isImgLoaded: false
    }
  },
  created () {
    // 获取当前物品信息
    if (!this.currentGift.id) {
      this.getGiftInfo({id: this.$route.params.id, cb: this.getGiftInfoCb})
    }
    this.getGiftInfoCb()
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      return this.getLoginUserInfo()
    }
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo',
      getGiftInfo: 'getGiftInfo',
      editGift: 'editGift'
    }),
    goBack () {
      this.$router.go(-1)
    },
    getGiftInfoCb () {
      const {gift_images: giftImages, quantity,
        title, desc, show_at: showAt, left} = this.currentGift
      this.sentNum = quantity - left
      this.imgLists = giftImages.map(item => ({url: item.path}))
      this.newGift = {
        ...this.newGift,
        title,
        desc,
        quantity,
        date: showAt.slice(0, 10)
      }
    },
    modify () {
      // 发布礼物第二步表单验证
      const {bundle} = this.shipWay
      if (!bundle.some((item) => item.isSelected)) {
        return this.$vux.toast.text('請選擇寄送方式', 'bottom')
      }
      if (!this.isModify) {
        this.isModify = true
        const giftShips = bundle.filter(item => item.isSelected).map(item => ({
          shipway: item.key,
          shipfee: item.fare || 0,
          shipopts: item.fareWay
        }))
        const others = this.userInfo.others
        let things = {
          city: '',
          district: '',
          address: ''
        }
        if (others) {
          const { addresses } = others
          // 对用户地址做默认处理
          if (addresses && addresses.things) {
            things = addresses.things
          }
        }
        const {desc, quantity, title} = this.newGift
        if (!title) {
          this.$vux.toast.text('請輸入禮物標題', 'bottom')
          return
        }
        let data = {
          gift_images: this.imgLists.length ? this.imgLists.map(item => ({ path: item.url })) : [],
          image_path: this.imgLists.length ? this.imgLists[0].url : '',
          gift_ships: giftShips,
          desc,
          quantity,
          title
        }
        const isHasMeet = giftShips.some(item => item.shipway === 'meet')
        if (isHasMeet) {
          data = {
            ...data,
            city: things.city,
            district: things.district,
            address: things.address
          }
        }
        this.editGift({data, id: this.$route.params.id, cb: this.edithGiftCb})
        return this.$vux.loading.show({
          text: '更新中...'
        })
      }
    },
    edithGiftCb () {
      this.isModify = false
      this.$vux.loading.hide()
      this.$vux.toast.text('更新成功', 'bottom')
      setTimeout(() => this.$router.go(-1), 1000)
    },
    // 上传图片
    upLoadingImg () {
      this.isImgLoaded = true
    },
    imgloaded (data) {
      for (let img of data) {
        this.imgLists.push({url: img.url})
      }
      this.isImgLoaded = false
    },
    // 删除图片
    removeImg (index) {
      this.imgLists = this.imgLists.filter((item, idx) => idx !== index)
    },
    setShipWay (data) {
      this.shipWay = data.mode
    },
    calculateGiftName (val) {
      this.giftNameLength = val.trim().length
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      currentGift: state => state.gifts.currentGift
    })
  }
}
</script>

<style lang="less">
  .newgift-container{
    input:disabled{
      background: #FFF !important;
    }
    .vux-number-selector,
    .vux-number-input{
      box-sizing: content-box;
    }
    .weui-cells, .weui-cell, .weui-cell-box{
      margin-top: 0;
      &:before, &:after{
        border: none;
        display: none;
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
      .vux-number-input{
        padding: 0;
        color: @color-font-C3;
        font-size: @font-S3;
      }
    }
    .newgift-content-panel{
      flex: 1;
      .weui-cells{
        padding: 0 @pm-bg;
        .weui-cell{
          height: 44px;
          line-height: 44px;
          &:before{
            left: 0;
          }
          .weui-cell__hd .weui-label, p{
            color: @color-font-C1;
            font-size: 15px;
          }
          .weui-cell__bd .weui-input, .vux-cell-primary .vux-popup-picker-select .vux-cell-value{
            color: @color-font-C2;
            font-size: @font-S3;
          }
          .weui-cell__ft{
            .weui-icon-warn{
              font-size: 18px;
              &:before{
                font-size: 18px;
              }
            }
          }
          &.vux-x-textarea{
            height: auto;
            display: block;
            .weui-cell__hd{
              height: auto;
              line-height: 1;
              padding: @pm-md 0;
            }
            .weui-cell__bd{
              line-height: 24px;
              font-size: @font-S3;
              border: 1px solid @color-CBG;
              padding: @pm-bg;
              .weui-textarea-counter{
                height: 24px;
                line-height: 24px;
              }
            }
          }
        }
      }
      .vux-cell-box{
        &:before{
          left: 0;
        }
        .weui-cell__hd{
          color: @color-font-C1;
          font-size: 15px;
        }
        .weui-cell__bd .radioItem label{
          color: @color-font-C3;
          font-size: @font-S3;
        }
      }
    }
    .newgift-step-first{
      .weui-cells{
        padding: 0;
        margin: 0 @pm-bg;
        border: none;
        .weui-cell{
          padding-left: 0;
          padding-right: 0;
        }
      }
    }
    .newgift-step-second{
      .weui-cells{
        .vux-cell-box{
          &:before{
            display: none;
            border: none;
          }
        }
      }
      .section-bank{
        .vux-cell-box{
          padding: @pm-md 0;
          &:last-child{
            padding-bottom: 0;
          }
          .weui-cell{
            padding: 0;
            .weui-cell__hd{
              .weui-label{
                color: @color-font-C2;
                font-size: @font-S3;
              }
            }
            .vux-cell-primary{
              .vux-popup-picker-value{
                color: @color-font-C1;
                font-size: @font-S3;
              }
            }
          }
        }
      }
      .section-prior{
        .prior-radios{
          .radioItem{
            label{
              color: @color-font-C1;
              font-size: @font-S3;
            }
          }
        }
      }
      .section-date{
        .weui-cells{
          .weui-cell{
            padding: @pm-md 0;
            color: @color-font-C1;
            font-size: @font-S3;
          }
        }
      }
    }
    .btn-box{
      .weui-btn{
        border-radius: 0;
      }
    }
  }
</style>
<style lang="less" scoped>
  .newgift-container{
    height: 100%;
    display: flex;
    flex-direction: column;
    > .content{
      height: calc(~"100% - 44px");
      overflow-y: scroll;
    }
    .newgift-step-first,
    .newgift-step-second{
      display: flex;
      flex-direction: column;
      flex: 1;
      .prestep{
        background-color: white;
        color: black;
        border-top: 1px solid #ccc;
        height: 42px;
      }
      .prestep,
      .nextstep{
        &:after{
          display: none;
          border: none;
        }
      }
    }
    .newgift-step-first{
      .newgift-content-panel-imgs{
        padding: @pm-bg 0;
        border-bottom: @pm-bg solid @color-CBG;
      }
      .gift-name{
        position: relative;
        padding-right: 40px;
        color: @color-font-C1;
        .counter{
          position: absolute;
          top: 0;
          right: 0;
          padding: @pm-md 0;
          box-sizing: border-box;
          height: 44px;
          line-height: 24px;
          color: @color-font-C3;
          font-size: @font-S4;
        }
      }
    }
    .newgift-step-second{
      &-wrapper{
        padding: 0 15px 0;
      }
      .prior-radios{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin: @pm-sm 0 0 0;
        height: 92px;
        .radioItem{
          label{
            font-size: 10px;
          }
        }
      }
      .section-ships, .section-bank, .section-prior, .section-date{
        padding: @pm-md 0;
      }
    }
  }
</style>
