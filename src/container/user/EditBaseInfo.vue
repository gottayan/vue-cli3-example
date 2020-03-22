<template>
  <div class="user-edit-base-info g-smooth">
    <group class="section-info">
      <section-title title="基本資料">
      </section-title>
      <div class="info-item avatar">
        <div class="pic-loading" v-show="isImgLoaded">
          <inline-loading>
          </inline-loading>
        </div>
        <div class="pics">
          <img-upload
            type="avatar"
            :maxLength="1"
            :imgloaded="imgloaded"
            :removeImg="removeImg"
            :isLoaded="isImgLoaded"
            :imgList="userInfo.avatar"
            @upLoading="upLoadingImg"
          >
          </img-upload>
        </div>
        <cell title="大頭貼" value="" is-link>
          <span class="pic" slot="icon" :style="{backgroundImage: `url(${info.userAvatar || UserDefault})`}">
          </span>
        </cell>
      </div>
      <div class="info-item">
        <x-input
          class="star"
          title="真實姓名"
          text-align="right"
          placeholder="請輸入"
          :max="10"
          :disabled="verify.ppl"
          :show-clear="!verify.ppl"
          v-model.trim="info.name"
        >
        </x-input>
      </div>
      <div class="hint">如果團體機構，請寫聯絡人名稱，已完成驗證無法直接修改</div>
      <div class="info-item">
        <x-input
          class="star"
          title="暱稱別名"
          text-align="right"
          placeholder="請輸入"
          :max="20"
          v-model="info.nickname"
        >
        </x-input>
      </div>
      <div class="hint">如為團體機構，請寫團體機構名稱</div>
      <div class="info-item">
        <x-input
          title="電子郵件"
          class="star"
          :disabled="verify.mail"
          :show-clear="!verify.mail"
          text-align="right"
          placeholder="請輸入"
          v-model="info.email"
        >
        </x-input>
      </div>
      <div class="hint">已完成驗證無法直接修改</div>
      <div class="info-item">
        <x-input
          title="手機號碼"
          text-align="right"
          placeholder="請輸入"
          :disabled="verify.cell"
          :show-clear="!verify.cell"
          :max="10"
          v-model="info.cellphone"
        >
        </x-input>
      </div>
      <div class="hint">請輸入手機號碼，若未填寫，將會影響網站部分功能的使用（如發佈/索取等）</div>
      <div class="info-item">
        <x-input
          title="電話號碼"
          text-align="right"
          placeholder="請輸入"
          v-model="info.phone"
        >
        </x-input>
      </div>
      <div class="info-item bir">
        <calendar
          disable-future
          class="calendar"
          title="生日"
          placeholder="請選擇"
          v-model="info.birthday">
        </calendar>
        <zc-checkbox v-model="info.pubBirthday" id="bir" label="可公開">
        </zc-checkbox>
      </div>
      <div class="info-item incomes">
        <popup-picker
          title="年收入"
          placeholder="請選擇年收入範圍"
          :data="incomes"
          v-model="info.incomes"
          @on-change="(e) => handleChangePopupPicker(e, 'incomes')"
        />
      </div>
      <div class="group-unit">
        <div class="title">
          <zc-radio
            class="radio-box"
            :radioList="radio.identity"
            v-model="info.isGroup"
          >
          </zc-radio>
        </div>
        <template v-if="!info.isGroup">
          <div class="info-item">
            <span class="label">性別</span>
            <zc-radio
              class="radio-box"
              :radioList="radio.sex"
              v-model="info.gender"
            >
            </zc-radio>
          </div>
          <div class="info-item">
            <span class="label">婚姻狀態</span>
            <zc-radio
              class="radio-box"
              :radioList="radio.marriage"
              v-model="info.marriage"
            >
            </zc-radio>
          </div>
          <div class="info-item">
            <div class="wrapper">
              <span class="label">是否育兒</span>
              <zc-radio
                class="radio-box"
                :radioList="radio.rearChild"
                v-model="info.childs"
              >
              </zc-radio>
            </div>
            <zc-checkbox v-model="info.pubChilds" id="isPubChilds" label="可公開">
            </zc-checkbox>
          </div>
          <div class="info-item">
            <div class="wrapper">
              <span class="label">職業</span>
              <zc-radio
                class="radio-box"
                :radioList="radio.profession"
                v-model="info.jobs"
              >
              </zc-radio>
            </div>
            <zc-checkbox v-model="info.pubJobs" id="isPubJobs" label="可公開">
            </zc-checkbox>
          </div>
        </template>
        <div v-else class="hint">如欲申請成為關懷會員/企業/學校/公益團體/政府單位身份，可於資料更新後，申請變更。</div>
      </div>
      <div class="info-item desc">
        <x-textarea
          :max="200"
          :row="3"
          :height="100"
          v-model.trim="info.infos"
          title="自我介紹"
          placeholder="請輸入您的介紹"
        />
      </div>
      <div class="group-issues">
        <div class="title">
          <span class="txt">關心議題</span>
          <zc-checkbox v-model="info.isPubIssues" id="isPubIssues" label="可公開">
          </zc-checkbox>
        </div>
        <div class="issues">
          <span
            :key="index"
            :class="['box', (info.pubIssues && info.pubIssues.includes(issue.label)) ? 'selected' : '']"
            v-for="(issue, index) in issues"
          >
            <input
              v-show="false"
              type="checkbox"
              :id="issue.id"
              :value="issue.label"
              v-model="info.pubIssues"
            />
            <label :for="issue.id">{{issue.label}}</label>
          </span>
        </div>
      </div>
    </group>
    <group class="section-welfare">
      <div class="title">
        <section-title title="捐款收據/感謝狀預設資料">
        </section-title>
        <span class="tips">當你送禮物給公益團體/學校/政府時，如需對方提供捐物收據或感謝狀時，系統將會帶入預設資訊供您確認。</span>
      </div>
      <div class="info-item">
        <x-input
          title="抬頭"
          text-align="right"
          placeholder="請輸入"
          v-model.trim="info.taxtitle"
        >
        </x-input>
      </div>
      <div class="info-item">
        <x-input
          title="統編"
          text-align="right"
          placeholder="請輸入"
          type="number"
          v-model.trim="info.taxnum"
        >
        </x-input>
      </div>
    </group>
    <div class="save-btn">
      <x-button @click.native="modifyUserInfo" class="btn" type="warn">保存</x-button>
    </div>
  </div>
</template>

<script>
import { Group, XTextarea, XButton, PopupPicker, Cell, Calendar, InlineLoading } from 'vux'
import ImgUpload from '@/components/ImgUpload'
import SectionTitle from '@/components/Title'
import UserDefault from '@/assets/img/default-sticker.jpg'
import ZcRadio from '@/components/ZcRadio'
import ZcCheckbox from '@/components/ZcCheckbox'
import { incomesList, issues } from '@/tools/constant'
import { nameRegex, emailRegex, phoneRegex, telRegex, taxnumRegex } from '@/tools/regex'
import { mapState, mapMutations, mapActions } from 'vuex'
import memberData from '@/tools/memberData'

export default {
  components: {
    Group,
    XTextarea,
    XButton,
    SectionTitle,
    ImgUpload,
    PopupPicker,
    ZcRadio,
    ZcCheckbox,
    Cell,
    Calendar,
    InlineLoading
  },
  data () {
    return {
      UserDefault,
      issues,
      isImgLoaded: false,
      incomes: [incomesList.map(item => item.label)],
      radio: {
        identity: [{
          text: '個人',
          value: false,
          id: 'person'
        }, {
          text: '團體',
          value: true,
          id: 'group'
        }],
        sex: [{
          text: '男性',
          value: 'MALE',
          id: 'man'
        }, {
          text: '女性',
          value: 'FEMALE',
          id: 'women'
        }, {
          text: '其他',
          value: 'OTHER',
          id: 'other'
        }],
        marriage: [{
          text: '未婚',
          value: false,
          id: 'marriage-no'
        }, {
          text: '已婚',
          value: true,
          id: 'marriage-yes'
        }],
        rearChild: [{
          text: '否',
          value: false,
          id: 'rearChild-no'
        }, {
          text: '是',
          value: true,
          id: 'rearChild-yes'
        }],
        profession: [{
          text: '有工作',
          value: 'Y',
          id: 'profession-yes'
        }, {
          text: '無工作',
          value: 'N',
          id: 'profession-no'
        }, {
          text: '學生',
          value: 'STUDENT',
          id: 'student'
        }]
      },
      info: {
        birthday: '',
        cellphone: '',
        email: '',
        gender: '',
        infos: '',
        name: '',
        nickname: '',
        userAvatar: '',
        phone: '',
        pubBirthday: '',
        pubJobs: '',
        isPubIssues: '',
        pubChilds: '',
        childs: '',
        jobs: '',
        pubIssues: [],
        marriage: '',
        incomes: [],
        taxtitle: '',
        taxnum: '',
        isGroup: false
      }
    }
  },
  created () {
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      return this.getLoginUserInfo({cb: () => this.getLoginUserInfoCb()})
    }
    this.getLoginUserInfoCb()
  },
  methods: {
    ...mapActions({
      getLoginUserInfo: 'getLoginUserInfo',
      modify: 'modify'
    }),
    ...mapMutations({
      setMyAvatar: 'setMyAvatar',
      deleteMyAvatar: 'deleteMyAvatar'
    }),
    getLoginUserInfoCb () {
      const {birthday, pics, name, nickname, cellphone, phone, email, others, infos} = this.userInfo
      const someOfUserInfo = {
        birthday: birthday || '',
        userAvatar: pics,
        name,
        nickname,
        cellphone,
        phone,
        email,
        infos
      }
      Object.assign(this.info, this.info, someOfUserInfo)
      if (others) {
        const {incomes, pub_birthday: pubBirthday,
          catHash, issues, pub_issues: isPubIssues,
          jobs, pub_jobs: pubJobs, marriage, childs, pub_childs: pubChilds, gender, taxtitle, taxnum} = others
        // 返回Y/N, true or false
        const someOtherUserInfo = {
          incomes: incomes ? [incomesList.find((item) => incomes === item.value).label] : [''],
          pubBirthday: typeof pubBirthday === 'boolean' ? pubBirthday : pubBirthday ? (pubBirthday === 'Y') : '',
          isGroup: !!catHash && (catHash !== 'normal'),
          pubIssues: (typeof issues === 'boolean' ? [] : issues) || [], // mabo:規避可能issues为true的情況
          isPubIssues: typeof isPubIssues === 'boolean' ? isPubIssues : isPubIssues ? (isPubIssues === 'Y') : '',
          jobs,
          pubJobs: typeof pubJobs === 'boolean' ? pubJobs : pubJobs ? (pubJobs === 'Y') : '',
          marriage: typeof marriage === 'boolean' ? marriage : marriage ? (marriage === 'Y') : '',
          childs: typeof childs === 'boolean' ? childs : childs ? (childs === 'Y') : '',
          pubChilds: typeof pubChilds === 'boolean' ? pubChilds : pubChilds ? (pubChilds === 'Y') : '',
          gender,
          taxtitle,
          taxnum
        }
        Object.assign(this.info, this.info, someOtherUserInfo)
      }
    },
    handleChangePopupPicker (e, type) {
      this.info[type] = e
    },
    upLoadingImg () {
      this.isImgLoaded = true
    },
    // 上传图片
    imgloaded (data) {
      this.setMyAvatar({data})
      this.info.userAvatar = data.url
      this.isImgLoaded = false
    },
    // 删除图片
    removeImg (i) {
      this.deleteMyAvatar({i})
    },
    modifyUserInfo () {
      const {birthday, cellphone, email, gender, infos, name,
        nickname, userAvatar, phone, pubBirthday, pubJobs, isPubIssues,
        pubChilds, marriage, childs, jobs, pubIssues, incomes, taxtitle, taxnum} = this.info
      if (!this.verify.ppl) {
        if (!name.trim() && !nameRegex.test(name)) {
          return this.$vux.toast.text('請輸入真實姓名', 'bottom')
        }
      }
      if (!nickname) {
        return this.$vux.toast.text('請輸入暱稱別名', 'bottom')
      } else if (!nameRegex.test(nickname)) {
        return this.$vux.toast.text('請輸入正确暱稱別名', 'bottom')
      }
      if (!this.verify.mail) {
        if (!email) {
          return this.$vux.toast.text('請輸入電子郵件', 'bottom')
        } else if (!emailRegex.test(email.trim())) {
          return this.$vux.toast.text('請輸入正確電子郵件', 'bottom')
        }
      }
      if (!this.verify.cell) {
        if (cellphone && !phoneRegex.test(cellphone.trim())) {
          return this.$vux.toast.text('請輸入正確手機號碼', 'bottom')
        }
      }
      if (phone && !telRegex.test(phone.trim())) {
        return this.$vux.toast.text('請輸入正確電話號碼', 'bottom')
      }
      if (taxnum && !taxnumRegex.test(taxnum.trim())) {
        return this.$vux.toast.text('請輸入正確統編', 'bottom')
      }
      const {others} = this.userInfo
      const othersUserInfo = {
        ...others,
        phone,
        cellphone,
        birthday,
        gender,
        infos,
        pub_birthday: pubBirthday ? 'Y' : 'N',
        pub_jobs: pubJobs ? 'Y' : 'N',
        pub_issues: isPubIssues ? 'Y' : 'N',
        pub_childs: pubChilds ? 'Y' : 'N',
        marriage: marriage ? 'Y' : 'N',
        childs: childs ? 'Y' : 'N',
        jobs,
        issues: pubIssues,
        incomes: incomes[0] ? incomesList.find((item) => incomes[0] === item.label).value : '',
        taxtitle,
        taxnum
      }
      const dataObj = {
        birthday,
        cellphone,
        email,
        gender,
        infos,
        name,
        nickname,
        pics: userAvatar,
        phone,
        others: JSON.stringify(othersUserInfo)
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
          this.getLoginUserInfoCb()
          const redirect = this.$route.query.redirect
          if (redirect) {
            if (!memberData.isValidAdr(this.$store.state)) {
              this.$vux.toast.text('請先完善聯絡地址', 'bottom')
              setTimeout(() => {
                this.$router.push(`/user/${this.userInfo.id}/editAdr?redirect=${redirect}`)
              }, 3000)
            }
            this.$router.push(`${redirect}`)
            return
          }
          setTimeout(() => this.$router.go(-1), 1000)
        }
      })
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    verify () {
      const {veriMail, veriCell, veriPpl} = this.userInfo
      return {
        mail: typeof veriMail === 'boolean' ? veriMail : (veriMail === 'Y'),
        cell: typeof veriCell === 'boolean' ? veriCell : (veriCell === 'Y'),
        ppl: typeof veriPpl === 'boolean' ? veriPpl : (veriPpl === 'Y')
      }
    }
  }
}
</script>
<style lang="less">
  .user-edit-base-info{
    input{
      &:disabled{
        background: #FFF !important;
      }
    }
    .weui-cells{
      margin-top: 0;
      padding: 30px 0 0 0;
      &:before, &:after{
        display: none;
      }
      .weui-cell{
        padding: 0;
        &:before{
          display: none;
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
      &.avatar, &.incomes, &.bir{
        position: relative;
        .weui-cell{
          .weui-cell__ft{
            &:after{
              content: " ";
              display: inline-block;
              margin-top: -6px;
              width: 8px;
              height: 13px;
              border-width: 0;
              background: #fff url('../../assets/icon/com_list_pic_arrow@2x.png') center center no-repeat;
              background-size: 8px 13px;
              transform: none;
            }
          }
        }
      }
      &.avatar{
        position: relative;
        .pics{
          position: absolute;
          right: 0;
          top: 0;
          width: 100px;
          height: 60px;
          z-index: 99;
          opacity: 0;
          overflow: hidden;
        }
        .weui-cell{
          .weui-cell__hd{
            .pic{
              position: absolute;
              top: 0;
              right: @pm-bg;
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background-size:60px auto;
              background-repeat:no-repeat;
              background-position: center center;
              border: 1px solid @color-CL;
              overflow: hidden;
            }
          }
        }
      }
      &.incomes, &.bir{
        .weui-cell{
          .weui-cell__ft{
            padding-left: 8px;
            &:after{
              width: 13px;
              height: 8px;
              background: #fff url('../../assets/icon/com_list_ic_unfold@2x.png') center center no-repeat;
              background-size: 13px 8px;
            }
          }
        }
      }
      &.bir{
        .vux-calendar{
          &:before{
            display: none;
          }
          .weui-cell{
            .vux-cell-bd{
              .vux-label{
                color: @color-font-C1;
                font-size: 15px;
              }
            }
            .weui-cell__ft{
              padding-right: 20px;
              .vux-cell-placeholder{
                font-size: @font-S3;
              }
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
  .user-edit-base-info{
    background: #fff;
    height: 100%;
    overflow-y: scroll;
    .hint{
      padding-top: 5px;
      color: @color-font-C2;
      font-size: 12px;
      font-weight: 400;
    }
    .section-info, .section-welfare{
      padding:0 @pm-bg;
      .info-item{
        height: 50px;
        line-height: 50px;
        .g-border-1px;
        &:nth-of-type(2){
          margin-top: 6px;
        }
        &.bir{
          display: flex;
          align-items: center;
          justify-content: space-between;
          .calendar{
            flex: 1;
            margin-right: 24px;
          }
        }
        &.desc{
          height: auto;
          line-height: 1.15;
          overflow: auto;
        }
      }
      .avatar{
        position: relative;
        height: 60px;
        line-height: 60px;
        .pic-loading{
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 0;
          right: @pm-bg;
          z-index: 9999;
          color: @color-font-C2;
          font-size: 12px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #FFF;
        }
      }
      .group-issues, .group-unit{
        > .title{
          display: flex;
          justify-content: space-between;
          padding: 18px 0 24px 0;
          color: @color-font-C1;
          font-size: 15px;
          font-weight: 700;
        }
      }
      .group-unit{
        > .title{
          padding: 30px 0 15px;
        }
        .info-item{
          display: flex;
          justify-content: space-between;
          .wrapper{
            flex: 1;
            display: inline-flex;
            justify-content: space-between;
            margin-right: @pm-bg;
          }
          .label{
            color: @color-font-C1;
            font-size: 15px;
          }
          .radio-box{
            color: @color-font-C2;
            font-size: @font-S3;
          }
        }
      }
      .group-issues{
        margin-bottom: 8px;
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
    }
    .section-welfare {
      .title{
        .tips{
          display: block;
          padding-top: 6px;
          color: @color-font-C2;
          font-size: 13px;
          line-height: 20px;
        }
      }
    }
    .save-btn{
      padding: 24px @pm-bg @pm-bg;
      width: 100%;
    }
  }
</style>
