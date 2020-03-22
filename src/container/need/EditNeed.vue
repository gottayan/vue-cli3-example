<template>
  <div class="newneed-container">
    <x-header title="編輯需求">
    </x-header>
    <div class="content g-smooth">
      <div class="newneed-step-first">
        <section class="newneed-content-panel-imgs">
          <img-upload
            type="need"
            :imgloaded="imgloaded"
            :removeImg="removeImg"
            :isLoaded="isImgLoaded"
            :imgList="imgList"
            :multiple="true"
            :maxLength="3"
            @upLoading="upLoadingImg"
          >
          </img-upload>
        </section>
        <group class="newneed-content-panel">
          <div class="need-name">
            <x-input
              class="star"
              title="需求標題"
              required
              :min="1"
              :max="20"
              v-model.trim="newNeedBaseInfo.title"
              text-align="right"
              aria-required
              @on-change="calculateNeedName"
              aria-placeholder="請輸入"
              placeholder="請輸入"
            />
            <span class="counter">{{needNameLength}}/20</span>
          </div>
          <x-textarea
            :max="500"
            :rows="5"
            :cols="30"
            autosize
            v-model="newNeedBaseInfo.desc"
            title="需求描述"
          />
        </group>
        <group class="section-num">
          <section-title title="需求品項">
          </section-title>
          <div
            :key="index"
            v-for="(needItem, index) in newNeedBaseInfo.need_items"
          >
            <div class="item-info">
              <span class="name">{{needItem.name}}</span>
              <x-number
                v-model="needItem.quantity"
                button-style="round"
                :min="needItem.min || 1"
                :max="50"
              >
              </x-number>
            </div>
          </div>
        </group>
      </div>
      <div class="newneed-step-second">
        <div class="newneed-content-panel-ships">
          <group class="section-ships">
            <div class="ships">
              <ship-way :init-ship-way="currentNeed.need_ships" @shipWay="setShipWay" type="need">
              </ship-way>
            </div>
          </group>
          <div class="g-title" style="margin-top: 10px">上架日期</div>
          <group>
            <datetime
              title="刊登日期"
              readonly
              format="YYYY/MM/DD"
              v-model="newNeedBaseInfo.date"
              :default-selected-value="newNeedBaseInfo.date"
              :start-date="today"
              :end-date="endDate"
              confirm-text="確定"
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
import addDays from 'date-fns/add_days'
// import { format, add_days as addDays } from 'date-fns'
import { Group, XButton, XNumber, XTextarea, Datetime, Flexbox, FlexboxItem } from 'vux'
import ImgUpload from '../../components/ImgUpload'
import ShipWay from '../../components/ShipWay'
import { mapState, mapActions } from 'vuex'
import SectionTitle from '@/components/Title'

export default {
  components: {
    Group,
    XButton,
    XNumber,
    XTextarea,
    Datetime,
    ImgUpload,
    Flexbox,
    FlexboxItem,
    ShipWay,
    SectionTitle
  },
  data () {
    return {
      shipWayData: [],
      today: format(new Date(), 'YYYY-MM-DD'),
      newNeedBaseInfo: {
        desc: '',
        date: '',
        title: '',
        need_items: []
      },
      needNameLength: 0,
      imgList: [],
      isImgLoaded: false,
      isModify: false,
      palmboxInfo: ['', '', '']
    }
  },
  created () {
    // 获取当前物品信息
    if (!this.currentNeed.id) {
      this.getNeedInfo({id: this.$route.params.id, cb: this.getNeedInfoCb})
    }
    this.getNeedInfoCb()
    if (!this.userInfo.id) {
      return this.getLoginUserInfo()
    }
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo',
      getNeedInfo: 'getNeedInfo',
      editNeed: 'editNeed'
    }),
    goBack () {
      this.$router.go(-1)
    },
    getNeedInfoCb () {
      const {need_images: needImages, desc, title, show_at: showAt, need_items: needItems} = this.currentNeed
      console.log(showAt, 'show_at')
      this.imgList = needImages.map(item => ({url: item.path}))
      let items = needItems.map((item) => ({
        id: item.id,
        name: item.name,
        category_id: item.category_id,
        is_new: item.is_new,
        quantity: item.quantity,
        min: item.quantity - item.left
      }))
      console.log(items, 'items')
      this.newNeedBaseInfo = {
        ...this.newNeedBaseInfo,
        desc,
        title,
        date: showAt ? format(new Date(showAt), 'YYYY/MM/DD') : '',
        need_items: items
      }
    },
    upLoadingImg () {
      this.isImgLoaded = true
    },
    imgloaded (data) {
      for (let img of data) {
        this.imgList.push({url: img.url})
      }
      this.isImgLoaded = false
    },
    removeImg (index) {
      this.imgList = this.imgList.filter((item, idx) => idx !== index)
    },
    modify () {
      if (!this.shipWayData.some((item) => item.isSelected)) {
        return this.$vux.toast.text('請選擇寄送方式', 'bottom')
      }
      if (!this.isModify) {
        this.isModify = true
        const needShips = this.shipWayData.filter(item => item.isSelected).map(item => ({
          shipway: item.key,
          shipfee: item.fare || 0,
          shipopts: item.fareWay
        }))
        const { desc, title, need_items: needItems } = this.newNeedBaseInfo
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
        let data = {
          need_images: this.imgList.length ? this.imgList.map(item => ({ path: item.url })) : [],
          image_path: this.imgList.length ? this.imgList[0].url : '',
          need_ships: needShips,
          desc,
          title,
          need_items: needItems
        }
        const isHasMeet = needShips.some(item => item.shipway === 'meet')
        if (isHasMeet) {
          data = {
            ...data,
            city: things.city,
            district: things.district,
            address: things.address
          }
        }
        const isPalmBox = needShips.some(item => item.shipway === 'palmbox')
        if (isPalmBox && !this.palmboxInfo[2]) {
          this.isModify = false
          return this.$vux.toast.text('請選擇收件櫃機', 'bottom')
        } else if (isPalmBox) {
          data = {
            ...data,
            edcode: this.palmboxInfo[2]
          }
        }
        this.editNeed({data, id: this.$route.params.id, cb: this.editNeedCb})
      }
    },
    editNeedCb () {
      this.isModify = false
      this.$vux.loading.hide()
      this.$vux.toast.text('更新成功', 'bottom')
      setTimeout(() => this.$router.go(-1), 1000)
    },
    setShipWay (data) {
      this.shipWayData = data.mode.bundle
      this.palmboxInfo = data.mode.palmboxInfo
    },
    calculateNeedName (val) {
      this.needNameLength = val.trim().length
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      currentNeed: state => state.needs.currentNeed
    }),
    endDate () {
      return format(addDays(new Date(), 15), 'YYYY-MM-DD')
    }
  }
}
</script>

<style lang="less">
  .newneed-container{
    .weui-cells{
      &:after, &:before{
        display: none;
      }
    }
    .weui-cell__ft div *{
      box-sizing: content-box;
    }
    .vux-number-selector-sub{
      box-sizing: content-box;
    }
    .btn-box{
      .weui-btn{
        border-radius: 0;
      }
    }
  }

  .newneed-container .newneed-step-second .ship .wrapper{
    margin: 10px 15px 0 15px;
    >div::before{
      border-radius: 5px;
    }
  }

  .section-num {
    .weui-cell {
      padding: 0;
      &:before {
        display: none;
        border: none;
      }
      .vux-number-round {
        .vux-number-input {
          width: 32px !important;
          font-size: @font-S3;
        }
        .vux-number-selector {
          border: none;
          svg {
            fill: #FFF;
          }
          &.vux-number-selector-sub, &.vux-number-selector-plus {
            padding: 0;
            background: @color-CR;
          }
          &.vux-number-disabled{
            background: @color-DSA;
          }
        }
      }
    }
  }
</style>

<style lang="less" scoped>
  @import "../../global.mixin.less";
  @bottom-distance: 55px;
  .flexPanel(@direction) {
    display: flex;
    flex-direction: @direction;
  }
  .innerPd{
    padding: 0 15px;
  }

  .newneed-container{
    background-color: #f9f9f9;
    height: 100%;
    .flexPanel(column);
    > .content{
      height: calc(~"100% - 44px");
      overflow-y: scroll;
    }
  }

  .newneed-item{
    &:not(:last-child){
      margin-bottom: 10px;
    }

    &:last-child{
      margin-bottom: @bottom-distance;
    }
    .newneed-item-name{
      position: relative;
      padding-right: 40px;
      .counter{
        position: absolute;
        top: 0;
        right: @pm-bg;
        height: 100%;
        line-height: 44px;
        color: @color-font-C3;
        font-size: @font-S4;
      }
    }
  }

  .more-newneed-item{
    .innerPd;
    display: flex;
    justify-content: center;
    background-color: #f8f8f8;
    color: #999;
    margin-bottom: @bottom-distance;
    margin-top: 10px;
  }

  .newneed-step-first{
    flex: 1;
    .flexPanel(column);
    .need-name{
      position: relative;
      padding-right: 40px;
      .counter{
        position: absolute;
        top: 0;
        right: @pm-bg;
        height: 100%;
        line-height: 44px;
        color: @color-font-C3;
        font-size: @font-S4;
      }
    }
  }

  .newneed-content-panel-imgs{
    padding: 15px;
    background-color: white;
  }

  .newneed-step-second{
    .flexPanel(column);
    flex: 1;
    background-color: white;

    .newneed-content-panel-ships{
      flex: 1;
      .innerPd;
    }

    .prestep{
      background-color: transparent;
      color: black;
      border-top: 1px solid #ccc;
      height: 42px;
    }
    .prestep,
    .nextstep{
      &:after{
        border: none;
      }
    }
  }

  .newneed-step-third{
    flex: 1;
    .flexPanel(column);
    background: white;
    align-items: center;
    justify-content: center;
  }
  .section-num {
    padding: 15px;
    background-color: white;
    .item-info {
      display: flex;
      justify-content: flex-start;
      margin: @pm-bg 0;
      padding-right: @pm-bg;
      height: 50px;
      line-height: 50px;
      border: 1px solid @color-CL;
      border-radius: 6px;
      &.selected{
        background: #fffbf6;
      }
      &:nth-of-type(2){
        margin-top: @pm-lg;
      }
      .name{
        flex: 1;
        margin: 0 @pm-md;
        color: @color-font-CR;
        font-size: 15px;
        font-weight: bold;
        word-break: break-all;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
  }
</style>
