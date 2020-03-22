<template>
  <div class="newneed-container">
    <x-header
      :left-options="{
        preventGoBack: true
      }"
      @on-click-back="preventBack"
      title="發佈需求"
    >
    </x-header>
    <div class="content">
      <div
        class="newneed-step-first"
        v-show="step === 1">
        <div class="step-first-panel g-smooth">
          <section
            class="newneed-content-panel-imgs">
            <!-- imgloaded 上传完成的回调 -->
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
          <group
            class="newneed-content-panel">
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
          <group
            title="需求物品品項（名稱 / 數量）"
          >
            <div class="newneed-item" v-for="(item, index) in newNeedList" :key="index">
              <div style="height: 10px; background-color: #f9f9f9" v-if="index !== 0"></div>
              <div class="newneed-item-name">
                <x-input
                  class="star"
                  title="物品名稱"
                  required
                  :min="1"
                  :max="20"
                  v-model="item.name"
                  text-align="right"
                  aria-required
                  @click.native="changeNeedItemNameIndex(index)"
                  @on-change="calculateNeedItemName"
                  aria-placeholder="請輸入物品名稱"
                  placeholder="請輸入物品名稱"
                />
                <span class="counter">{{item.nameLength}}/20</span>
              </div>
              <popup-picker
                class="star"
                title="物品分類"
                :data="thingOptions"
                :value="item.category_label"
                @on-change="(e) => handleChangeCategory(e, index)"
              />
              <div class="vux-cell-box">
                <div class="weui-cell">
                  <div class="weui-cell__hd star"><label class="weui-label">物品狀況</label></div>
                  <div class="weui-cell__bd" style="text-align: right">
                    <zc-radio
                      :radioList="radioList"
                      v-model="item.isAllNew"
                      :radioListIndex="index"
                    >
                    </zc-radio>
                  </div>
                </div>
              </div>
              <x-number
                class="star-p"
                title="數量"
                :max="50"
                :min="1"
                v-model="item.number"
              />
              <div
                @click="toggleNewNeedItem(false, index)"
                v-if="index !== 0"
                style="padding: 10px 15px; color: #e23a38; text-align: right">
                删除
              </div>
            </div>
          </group>
        </div>
        <div class="more-newneed-item" @click="toggleNewNeedItem(true)" v-show="newNeedList.length !== 5">
          <icon name="add_need_item" :scale="2.5">
          </icon>
          <span>新增更多需求品項</span>
        </div>
        <x-button @click.native="nextStep" class="g-without-bRadius g-button-bottom" type="warn" text="下一步">
        </x-button>
      </div>

      <div class="newneed-step-second g-smooth" v-show="step === 2">
        <div class="newneed-content-panel-ships">
          <group class="section-ships">
            <div class="ships">
              <ship-way @shipWay="setShipWay" type="need">
              </ship-way>
            </div>
          </group>
          <group>
          </group>
          <div class="g-title">上架日期</div>
          <group>
            <datetime
              title="刊登日期"
              v-model="newNeedBaseInfo.date"
              :default-selected-value="today"
              :start-date="today"
              :end-date="endDate"
              confirm-text="確定"
            >
            </datetime>
          </group>
          <span class="g-desc">若您不希望立即刊登，請於設定刊登日期，刊登期最長15天</span>
        </div>
        <div class="btn-box">
          <flexbox :gutter="0">
            <flexbox-item>
              <x-button
                class="g-without-bRadius prestep"
                type="warn"
                @click.native="preStep">
                上一步
              </x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button
                class="g-without-bRadius nextstep"
                type="warn"
                :disabled="preventMulti"
                @click.native="nextStep">
                確定刊登
              </x-button>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <div
        class="newneed-step-third"
        v-show="step === 3">
        <result-page
          :icon="SuccessSendIcon"
          title="恭喜您完成上架"
          desc="分享到Facebook，讓好友都來贈送吧"
          :menus="[{
          text: '分享',
          func: () => {
            this.handleShare()
          },
          type: 'primary'
        }, {
          text: '回到首頁',
          func: () => {
            this.$router.push('/')
          },
          type: 'primary'
        }]"
        >
          <template v-if="onGoing" slot="activeLink">
            <router-link :to="projectInfo.link" :style="`color: ${projectInfo.color}`">
              {{projectInfo.name}}
            </router-link>
          </template>
        </result-page>
        <share-bar
          :url="shareInfo.url"
          :title="shareInfo.title"
          :desc="shareInfo.desc"
          :image="shareInfo.image"
          :shareSuc="shareSuc"
          @hideShareBar="handleShare"
          :is-show="isShowShareBar"
        >
        </share-bar>
      </div>
    </div>
  </div>
</template>

<script>
import format from 'date-fns/format'
import addDays from 'date-fns/add_days'
// import { format, add_days as addDays } from 'date-fns'
import { filterOptionsNeed, projectInfo } from '@/tools/constant'
import { Group, PopupPicker, XButton, XNumber,
  XTextarea, Datetime, Flexbox, FlexboxItem } from 'vux'
import ZcRadio from '../../components/ZcRadio'
import ImgUpload from '../../components/ImgUpload'
import ShipWay from '../../components/ShipWay'
import SuccessSendIcon from '../../assets/img/gift_pic_putaway_succeed@2x.png'
import ResultPage from '@/components/ResultPage'
import ShareBar from '@/components/ShareBar'
import { doClickSendNewNeed } from '@/tools/GAEvent'

const FORMAT = 'YYYY/MM/DD'

export default {
  components: {
    Group,
    PopupPicker,
    XButton,
    XNumber,
    XTextarea,
    Datetime,
    ZcRadio,
    ImgUpload,
    Flexbox,
    FlexboxItem,
    ShipWay,
    ResultPage,
    ShareBar
  },
  data () {
    return {
      projectInfo,
      SuccessSendIcon,
      isShowShareBar: false,
      shareInfo: {
        title: '',
        desc: '',
        image: '',
        url: ''
      },
      needNameLength: 0,
      shipWayData: [],
      today: format(new Date(), FORMAT),
      step: 1,
      maxStep: 3,
      thingOptions: [filterOptionsNeed.category.map(item => item.label)],
      newNeedBaseInfo: {
        title: '',
        desc: ''
      },
      needItemNameIndex: 0,
      newNeedList: [{
        name: '',
        number: 1,
        category: '',
        category_label: [], // 用于存放popuppicker显示label
        isAllNew: '',
        nameLength: 0
      }],
      imgList: [],
      isImgLoaded: false,
      radioList: [{
        text: '全新',
        value: 1,
        id: 'new'
      }, {
        text: '二手',
        value: 0,
        id: 'old'
      }],
      preventMulti: false, // 步驟二 下一步按鈕防呆
      palmboxInfo: {
        area: [],
        edcode: {},
        name: []
      },
      isPalmBox: false,
      onGoing: false
    }
  },
  created () {
    const now = new Date()
    this.onGoing = now - new Date(this.projectInfo.startTime) >= 0 && now - new Date(this.projectInfo.endTime) < 0

    this.newNeedBaseInfo = Object.assign({}, this.newNeedBaseInfo, {date: format(new Date(), FORMAT)})
  },
  computed: {
    endDate () {
      return format(addDays(new Date(), 15), FORMAT)
    }
  },
  methods: {
    preventBack () {
      if (this.step === 1 || this.step === this.maxStep) {
        this.$router.go(-1)
      } else {
        this.step = this.step - 1
      }
    },
    // 分享
    handleShare () {
      this.isShowShareBar = !this.isShowShareBar
    },
    shareSuc () {
      this.$vux.toast.text('分享成功', 'bottom')
      this.handleShare()
    },
    async submitNewNeed () {
      if (this.isPalmBox && !this.palmboxInfo[2]) {
        this.$vux.toast.show({
          type: 'text',
          position: 'bottom',
          text: '請選擇掌櫃櫃機'
        })
        return null
      }

      this.preventMulti = true
      this.$vux.toast.show({
        type: 'text',
        position: 'bottom',
        text: '發佈中...'
      })
      const others = this.$store.state.user.userInfo.others
      // 对用户地址做默认处理
      let things = {
        city: '',
        district: '',
        address: ''
      }
      if (others) {
        const { addresses } = others
        if (addresses && addresses.things) {
          things = addresses.things
        }
      }
      // 設置刊登時分秒
      const currentTime = new Date()
      const curDate = format(new Date(), FORMAT)
      let currentHms = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`
      if (curDate !== this.newNeedBaseInfo.date) {
        currentHms = '00:00:00'
      }
      let data = {
        title: this.newNeedBaseInfo.title,
        desc: this.newNeedBaseInfo.desc,
        city: things.city,
        district: things.district,
        address: things.address,
        show_at: `${this.newNeedBaseInfo.date} ${currentHms}`,
        need_items: this.newNeedList.map(item => ({
          name: item.name,
          quantity: item.number,
          category_id: item.category,
          is_new: item.isAllNew
        })),
        image_path: (this.imgList.length && this.imgList[0].url) || '',
        need_images: this.imgList.map(item => ({path: item.url})),
        need_ships: this.shipWayData.filter(item => item.isSelected).map((item, index) => ({
          shipway: item.key,
          shipfee: item.fare || 0,
          shipopts: item.fareWay
        }))
      }
      if (this.isPalmBox) {
        data = Object.assign({}, data, {
          edcode: this.palmboxInfo[2],
          receiver_city: this.palmboxInfo[0],
          receiver_district: this.palmboxInfo[1],
          receiver_address: `${this.palmboxInfo[0]}${this.palmboxInfo[1]}`
        })
      }

      const cb = (data) => {
        this.$vux.toast.hide()
        doClickSendNewNeed()
        if (data.id) {
          const {title, desc, image_path: image, id} = data
          this.shareInfo = {
            title,
            desc,
            image,
            url: `${window.location.origin}/need/${id}`
          }
          this.step += 1
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: '刊登失敗，請稍後再試',
            position: 'bottom'
          })
          this.preventMulti = false
        }
      }
      this.$store.dispatch('submitNewNeed', {data, cb})
    },
    handleChangeCategory (e, index) {
      this.newNeedList[index].category_label = e
      this.newNeedList[index].category = filterOptionsNeed.category.find(item => item.label === e[0]).key
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
    toggleNewNeedItem (flag, idx) {
      const maxLen = 5
      const currentLen = this.newNeedList.length
      if ((!flag && currentLen === 1) || (flag && currentLen >= maxLen)) {
        this.$vux.toast.show({
          type: 'text',
          text: flag ? '需求物品不得超過 5 項' : '請填寫正確數量',
          position: 'bottom'
        })
      } else if (!flag) {
        this.newNeedList = this.newNeedList.filter((item, index) => index !== idx)
      } else {
        this.newNeedList = [
          ...this.newNeedList,
          {
            name: '',
            number: 1,
            category: '',
            category_label: [],
            isAllNew: '',
            nameLength: 0
          }
        ]
      }
    },
    validFirstStep () {
      const flag = this.newNeedList.every(item => {
        return Object.keys(item).every(key => item[key] !== '')
      })
      if (!(this.newNeedBaseInfo.title && flag)) {
        this.$vux.toast.show({
          text: '請填寫完整資料',
          position: 'bottom',
          type: 'text'
        })
      } else {
        this.step = this.step + 1
      }
    },
    validSecondStep () {
      const date = this.newNeedBaseInfo.date
      if (date && this.shipWayData.some(item => item.isSelected)) {
        this.submitNewNeed()
      } else {
        if (date) {
          this.$vux.toast.show({
            text: '請選擇寄送方式',
            position: 'bottom',
            type: 'text'
          })
        } else {
          this.$vux.toast.show({
            text: '請選擇刊登日期',
            position: 'bottom',
            type: 'text'
          })
        }
      }
    },
    nextStep () {
      if (this.step < this.maxStep) {
        this.step === 1 ? this.validFirstStep() : this.validSecondStep()
      }
    },
    preStep () {
      if (this.step > 1) {
        this.step = this.step - 1
      }
    },
    setShipWay (data) {
      this.shipWayData = data.mode.bundle
      this.palmboxInfo = data.mode.palmboxInfo
      this.isPalmBox = data.mode.bundle.filter(item => item.isSelected).some(item => item.key === 'palmbox')
    },
    resetNewNeed () {
      this.step = 1
      this.newNeedBaseInfo = {
        title: '',
        desc: ''
      }
      this.newNeedList = [{
        name: '',
        number: 1,
        category: '',
        category_label: [],
        isAllNew: '',
        nameLength: 0
      }]
    },
    calculateNeedName (val) {
      this.needNameLength = val.trim().length
    },
    calculateNeedItemName (val) {
      this.newNeedList[this.needItemNameIndex].nameLength = val.trim().length
    },
    changeNeedItemNameIndex (index) {
      this.needItemNameIndex = index
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

    .star {
      .weui-label {
        &:after{
          content: "*";
          display: inline-block;
          width: 6px;
          height: 6px;
          color: @color-CR;
        }
      }
    }
    .star-p {
      p {
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

  .newneed-container .newneed-step-second .ship .wrapper{
    margin: 10px 15px 0 15px;
    >div::before{
      border-radius: 5px;
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
    .content{
      height: calc(~"100% - 44px");
    }
  }

  .newneed-item{
    &:not(:last-child){
      margin-bottom: 10px;
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
    height: 100%;
    .step-first-panel{
      height: calc(~"100% - 42px");
      overflow-y: scroll;
    }
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
    height: 100%;
    overflow-y: scroll;

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
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>
