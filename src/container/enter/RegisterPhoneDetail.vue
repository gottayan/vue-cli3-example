<template>
  <!-- 手機註冊用戶成功后填寫詳細資料 -->
  <div class="rpd-container">
    <div class="rpd-inner-wrapper">
      <div class="linear-gradent">
        <icon name="right" :scale="5.5"></icon>
        <div class="desc-wrapper">
          <h3 class="desc">恭喜您！</h3>
          <span class="desc">註冊成功</span>
        </div>
      </div>
      <section-title class="title" title="完善個人資料" />
      <div class="info-item avatar">
        <div class="pics">
          <img-upload
            type="avatar"
            :maxLength="1"
            :imgloaded="imgloaded"
            :removeImg="removeImg"
            :isLoaded="isImgLoaded"
            :imgList="avatar"
            @upLoading="upLoadingImg"
          >
            <div slot="uploadIcon">
              <img class="default-avatar" :src="UserDefault" alt="">
              <img class="default-avatar-prop" src="../../assets/icon/login_ic_picture_normal@2x.png" alt="">
            </div>
          </img-upload>
        </div>
      </div>
      <group class="group-wrapper">
        <!-- <x-input
          title="暱稱"
          name="暱稱"
          aria-placeholder="請輸入暱稱"
          placeholder="請輸入暱稱"
          aria-required
          :max="20"
          placeholder-align="right"
          required
          v-model="nickname">
            <span slot="right" class="right-desc">{{nickname.length}}/20</span>
          </x-input> -->
        <x-input
          title="姓名"
          name="真實姓名"
          aria-placeholder="請輸入真實姓名"
          placeholder="請輸入真實姓名"
          aria-required
          required
          placeholder-align="right"
          :max="10"
          v-model="name"
        >
          <span slot="right" class="right-desc">{{name.length}}/10</span>
        </x-input>
        <x-input
          name="郵箱"
          title="郵箱"
          type="email"
          aria-placeholder="請輸入郵箱"
          placeholder="請輸入郵箱"
          aria-required
          required
          placeholder-align="right"
          is-type="email"
          v-model="email"
          :should-toast-error="false"
          @on-click-error-icon="handleEmailError"
        >
        </x-input>
        <!-- <template v-else>
          <x-input
            name="手機"
            title="手機"
            aria-placeholder="請輸入手機號"
            placeholder="請輸入手機號"
            aria-required
            required
            placeholder-align="right"
            :max="10"
            :is-type="checkCellPhone"
            v-model="cellphone"
          >
          </x-input>
          <span class="g-desc" style="padding: 0 15px">若手機未填寫，將影響部分功能的使用（如索取）</span>
        </template> -->
        <calendar
          disable-future
          class="calendar"
          title="生日"
          placeholder="請選擇生日"
          v-model="birthday">
        </calendar>
        <div class="vux-x-input weui-cell gender-label">
          <label for="gender" class="weui-label gender-label-text">
            性别
          </label>
          <zc-radio
            class="radio-box"
            :radioList="genderList"
            v-model="gender"
          >
          </zc-radio>
        </div>
        <popup-picker
          title="地區"
          aria-placeholder="請選擇地區"
          placeholder="請選擇地區"
          :data="areaMapLists"
          :columns="3"
          v-model="site"
        />
        <x-input
          title="詳細地址"
          aria-placeholder="請輸入詳細地址"
          placeholder="請輸入詳細地址"
          placeholder-align="right"
          v-model="address"
          @on-focus="handleFocus"
        >
        </x-input>
        <span class="g-desc" style="padding: 0 15px">若地址未填寫，將影響部分功能的使用（如索取）</span>
        <x-textarea
          title="自我介紹"
          aria-placeholder="請輸入自我介紹"
          placeholder="請輸入自我介紹"
          autosize
          :rows="4"
          :col="10"
          :max="200"
          v-model="infos"
        >
        </x-textarea>
      </group>
      <button class="g-button red" @click="handleSubmit">送出</button>
    </div>
  </div>
</template>

<script>
import { XTextarea, PopupPicker, Calendar } from 'vux'
import ZcRadio from '@/components/ZcRadio'
import SectionTitle from '@/components/Title'
import ImgUpload from '@/components/ImgUpload'
import UserDefault from '@/assets/icon/icon-default-avatar.png'
import { emailRegex } from '@/tools/regex'
import { mapActions, mapState } from 'vuex'
import { mapGeo } from '@/tools/strMap'
import { session } from '@/tools/storage'

export default {
  components: {
    XTextarea,
    PopupPicker,
    Calendar,
    ImgUpload,
    ZcRadio,
    SectionTitle
  },
  data () {
    return {
      name: '',
      // nickname: '',
      email: '',
      cellphone: '',
      birthday: '',
      gender: '',
      address: '',
      infos: '',
      pics: '',
      site: [],
      genderList: [{
        text: '女性',
        value: 'FEMALE',
        id: 'women'
      }, {
        text: '男性',
        value: 'MALE',
        id: 'man'
      }, {
        text: '其他',
        value: 'OTHER',
        id: 'other'
      }],
      UserDefault,
      isImgLoaded: false,
      avatar: []
      // checkCellPhone: function (e) {
      //   return {
      //     valid: phoneRegex.test(e),
      //     msg: '請填寫正確手機號碼'
      //   }
      // }
      // userAvatar: ''
    }
  },
  computed: {
    ...mapState({
      geoConfig: state => state.configs.geoConfig,
      userInfo: state => state.user.userInfo
    }),
    areaMapLists () {
      return mapGeo(this.geoConfig)
    }
  },
  methods: {
    ...mapActions({
      getGeoConfig: 'getGeoConfig',
      modify: 'modify',
      getLoginUserInfo: 'getLoginUserInfo'
    }),
    handleFocus (value, $event) {
      $event.target.scrollIntoView()
    },
    handleEmailError () {
      this.$vux.toast.text('郵箱格式不對哦~', 'middle')
    },
    removeImg (i) {
      // this.deleteMyAvatar({i})
      this.avatar = []
    },
    upLoadingImg () {
      this.isImgLoaded = true
    },
    imgloaded (data) {
      this.avatar = [{url: data.url}]
      // this.userAvatar = data.url
      this.isImgLoaded = false
    },
    modifyCb (data) {
      // console.log(data)
      this.getLoginUserInfo()
    },
    handleSubmit () {
      const isRegisterPhoneType = this.userInfo.types === 'PHONE'
      // if (!this.nickname.trim()) {
      //   return this.$vux.toast.text('請填寫暱稱', 'bottom')
      // }

      if (!this.name.trim()) {
        return this.$vux.toast.text('請填寫姓名', 'bottom')
      }

      if (isRegisterPhoneType && !emailRegex.test(this.email.trim())) {
        return this.$vux.toast.text('請填寫正確郵箱地址', 'bottom')
      }

      // if (!isRegisterPhoneType && !phoneRegex.test(this.cellphone.trim())) {
      //   return this.$vux.toast.text('請填寫正確手機號碼', 'bottom')
      // }
      const dataObj = {
        pics: this.avatar.length ? this.avatar[0].url : '',
        name: this.name,
        infos: this.infos,
        // nickname: this.nickname,
        birthday: this.birthday,
        gender: this.gender,
        email: isRegisterPhoneType ? this.email : this.userInfo.email,
        cellphone: isRegisterPhoneType ? this.userInfo.cellphone : this.cellphone,
        others: JSON.stringify({
          ...this.userInfo.others,
          addresses: {
            users: {
              city: this.site[0] || '',
              district: this.site[1] || '',
              address: this.address || ''
            },
            things: {
              city: this.site[0] || '',
              district: this.site[1] || '',
              address: this.address
            },
            rcvs: {
              city: this.site[0] || '',
              district: this.site[1] || '',
              address: this.address || ''
            },
            meets: {
              city: this.site[0] || '',
              district: this.site[1] || '',
              address: this.address || ''
            }
          }
        })
      }
      this.modify({dataObj, cb: this.modifyCb})
      this.$store.dispatch('getLoginUserInfo')
      const redirect = session.get('redirect')
      this.$router.push(`/${redirect || ''}`)
    }
  },
  created () {
    if (!this.areaMapLists.length) {
      this.getGeoConfig()
    }
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      return this.getLoginUserInfo()
    }
  }
}
</script>

<style lang="less">
  @gray: #c9c7ca;
  .rpd-container{
    .vux-calendar{
      &:before{
        display: none;
      }
    }

    .weui-cells{
      &::before{
        display: none;
      }
    }

    .weui-label{
      font-size: 15px;
    }

    .gender-label{
      display: flex;
      justify-content: space-between;
    }

    .vux-x-input,
    .vux-x-textarea{
      input::placeholder,
      textarea::placeholder{
        font-size: 15px;
        color: @gray;
      }

      input,
      textarea{
        font-size: 15px;
      }

      input{
        text-align: right;
      }
    }

    .vux-x-input[aria-required] label::after{
      content: '*';
      color: @color-font-CR;
    }

    .vux-cell-placeholder{
      font-size: 15px;
      color: @gray;
    }

    .imgupload-container{
      justify-content: center;
    }

    .thumb-item{
      border-radius: 50%;
    }

    .radio-box{
      label{
        font-size: 15px;
      }
    }
  }
</style>

<style lang="less" scoped>
  .rpd-container{
    padding: 15px;
    background-color: #f5f4f5;
    min-height: 100%;

    .rpd-inner-wrapper{
      background-color: white;
      width: 100%;
      border-radius: 10px;
      padding-bottom: 20px;
    }

    .linear-gradent{
      height: 100px;
      border-radius: 10px 10px 0 0;
      background-image: linear-gradient(to top, #DB471A, #F3762A);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .desc-wrapper{
      margin-left: 15px;
      display: flex;
      flex-direction: column;
    }

    .desc{
      text-align: center;
      display: block;
      color: white;

      &:last-child{
        letter-spacing: 7px;
        font-size: 14px;
      }
    }

    .right-desc{
      font-size: 15px;
    }

    .title{
      padding: 0 15px;
      margin: 20px 0;
    }

    .gender-label-text{
      width: 34px;
    }

    .default-avatar{
      border-radius: 50%;
      &-prop{
        width: 30px;
        margin-left: -58px;
        margin-bottom: -6px;
      }
    }

    .group-wrapper{
      padding-right: 15px;
    }

    .g-button{
      max-width: 90%;
      display: block;
      margin: 10px auto;
    }
  }
</style>
