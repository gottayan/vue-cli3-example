<template>
  <div class="benefit-identity">
    <x-header
      @on-click-back="goBack"
      :title="`${$route.meta.title}`">
    </x-header>
    <div class="panel g-smooth">
      <group class="intro">
        <cell
          :key="index"
          :title="item.title"
          :inline-desc="item.desc"
          v-for="(item, index) in items">
          <img
            width="50"
            height="auto"
            slot="icon"
            :src="item.icon"
            alt="icon">
        </cell>
      </group>
      <template v-if="step === 1">
        <div class="container">
          <div class="group-logo">
            <div class="title">
              <span class="txt">組織Logo上傳</span>
              <span class="hint">圖片大小限制為 1M</span>
            </div>
            <img-upload
              type="request"
              :maxLength="1"
              :imgloaded="(data) => imgloaded(data, 'logo')"
              :removeImg="(index) => removeImg(index, 'logo')"
              :isLoaded="imgList.logo.isImgLoaded"
              :imgList="imgList.logo.pics"
              @upLoading="upLoadingImg('logo')"
            >
            </img-upload>
          </div>
          <div class="info-item">
            <x-input
              class="star"
              title="單位全名"
              text-align="right"
              placeholder="請輸入"
              v-model.trim="info.fullname"
            >
            </x-input>
          </div>
          <div class="hint">（需與立案登記相同，審核通過將顯示於前台）</div>
          <div class="info-item">
            <x-input
              class="star"
              title="單位常用名稱"
              text-align="right"
              placeholder="請輸入"
              v-model.trim="info.name"
            >
            </x-input>
          </div>
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
              title="立案字號"
              text-align="right"
              placeholder="請輸入"
              v-model.trim="info.no"
            >
            </x-input>
          </div>
          <div class="group-logo">
            <div class="title">
              <span class="txt">立案字號文件/掃描檔</span>
            </div>
            <img-upload
              type="request"
              :maxLength="1"
              :imgloaded="(data) => imgloaded(data, 'doc')"
              :removeImg="(index) => removeImg(index, 'doc')"
              :isLoaded="imgList.doc.isImgLoaded"
              :imgList="imgList.doc.pics"
              @upLoading="upLoadingImg('doc')"
            >
            </img-upload>
          </div>
          <div class="group-address">
            <div class="title">
              <span class="txt">登記地址</span>
            </div>
            <div class="info-item">
              <popup-picker
                title="地區選擇"
                :data="areaMapLists"
                :columns="3"
                :value="site.register"
                @on-change="(e) => handleChangePopupPicker(e, 'register')"
              />
            </div>
            <div class="info-item">
              <x-input
                title="詳細地址"
                text-align="right"
                placeholder="請輸入"
                :max="20"
                v-model="info.register.address"
              >
              </x-input>
            </div>
          </div>
          <div class="group-address">
            <div class="title">
              <span class="txt">通訊地址</span>
              <zc-checkbox
                @change="initContactAdr"
                v-model="isWithRegister"
                id="isWithRegister"
                label="同登記地址">
              </zc-checkbox>
            </div>
            <template v-if="!isWithRegister">
              <div class="info-item">
                <popup-picker
                  title="地區選擇"
                  :data="areaMapLists"
                  :columns="3"
                  :value="site.contact"
                  @on-change="(e) => handleChangePopupPicker(e, 'contact')"
                />
              </div>
              <div class="info-item">
                <x-input
                  title="詳細地址"
                  text-align="right"
                  placeholder="請輸入"
                  :max="20"
                  v-model="info.contact.address"
                >
                </x-input>
              </div>
            </template>
          </div>
          <div class="info-item organization">
            <div class="wrapper">
              <span class="label">組織類別</span>
            </div>
            <zc-radio
              class="radio-box"
              :radioList="organization"
              v-model="info.type"
            >
            </zc-radio>
          </div>
          <div class="group-issues">
            <div class="title">
              <span class="txt">組織屬性</span>
              <zc-checkbox v-model="info.pub_issues" id="pubIssues" label="可公開">
              </zc-checkbox>
            </div>
            <div class="issues">
        <span
          :key="index"
          :class="['box', info.issues.includes(issue.label) ? 'selected' : '']"
          v-for="(issue, index) in issues">
          <input
            v-show="false"
            type="checkbox"
            :id="issue.id"
            :value="issue.label"
            v-model="info.issues" />
          <label
            :for="issue.id">
            {{issue.label}}
          </label>
        </span>
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
          <div class="info-item placementService">
            <div class="wrapper">
              <span class="label">是否提供安置照顧服務</span>
              <zc-radio
                class="radio-box"
                :radioList="placementService"
                v-model="info.placement_service"
              >
              </zc-radio>
            </div>
          </div>
          <div class="info-item private">
            <div class="wrapper">
              <span class="label">機構公私立組織別</span>
            </div>
            <zc-radio
              class="radio-box"
              :radioList="privateCategory"
              v-model="privateClassify"
            >
            </zc-radio>
          </div>
        </div>
        <div class="btn-panel">
          <x-button
            class="btn"
            @click.native="nextStep"
            type="warn">
            下一步
          </x-button>
        </div>
      </template>
      <template v-if="step === 2">
        <div class="container">
          <div class="info-item desc">
            <x-textarea
              :max="200"
              :row="3"
              :height="100"
              title="單位介紹"
              v-model="info.purpose"
              placeholder="(例如成立宗旨、提供服務等)"
            />
          </div>
          <div class="info-item">
            <x-input
              title="勸募許可文號"
              text-align="right"
              placeholder="請輸入"
              v-model.trim="info.advise_no"
            >
            </x-input>
          </div>
          <div class="hint">（帳號開通後顯示於名片）</div>
          <div class="group-donate">
            <div class="title">
              <span class="txt">郵政劃撥捐款</span>
            </div>
            <div class="info-item">
              <x-input
                title="劃撥戶名"
                text-align="right"
                placeholder="請輸入"
                v-model.trim="info.postal_title"
              >
              </x-input>
            </div>
            <div class="info-item">
              <x-input
                title="劃撥帳號"
                text-align="right"
                placeholder="請輸入"
                v-model.trim="info.postal_accounts"
              >
              </x-input>
            </div>
          </div>
          <div class="group-bank">
            <div class="title">
              <span class="txt">銀行帳戶捐款</span>
            </div>
            <div class="info-item">
              <popup-picker
                title="銀行"
                :data="banklist"
                :columns="3"
                v-model="banks.banks_banks"
              />
            </div>
            <div class="info-item">
              <x-input
                title="銀行分行"
                text-align="right"
                placeholder="請輸入"
                v-model.trim="banks.banks_branchs"
              >
              </x-input>
            </div>
            <div class="info-item">
              <x-input
                title="銀行帳號"
                text-align="right"
                placeholder="請輸入"
                v-model.trim="banks.banks_accounts"
              >
              </x-input>
            </div>
            <div class="info-item">
              <x-input
                title="銀行戶名"
                text-align="right"
                placeholder="請輸入"
                v-model.trim="banks.banks_title"
              >
              </x-input>
            </div>
          </div>
          <div class="info-item">
            <x-input
              title="電子愛心號碼"
              text-align="right"
              placeholder="請輸入"
              v-model.trim="info.e_love_number"
            >
            </x-input>
          </div>
          <div class="info-item">
            <x-input
              title="官方網址"
              text-align="right"
              placeholder="請輸入"
              v-model.trim="info.website"
            >
            </x-input>
          </div>
          <div class="info-item">
            <x-input
              title="facebook臉書網址"
              text-align="right"
              placeholder="請輸入"
              v-model.trim="info.facebook"
            >
            </x-input>
          </div>
          <div class="group-assess">
            <div class="title">
              <span class="txt">自評推薦勾選</span>
            </div>
            <div class="assesses">
            <span
              :key="index"
              :class="['box', info.recommend.includes(assess.label) ? 'selected' : '']"
              v-for="(assess, index) in assesses">
              <input
                v-show="false"
                type="checkbox"
                :id="assess.id"
                :value="assess.label"
                v-model="info.recommend" />
              <label
                :for="assess.id">
                {{assess.label}}
              </label>
            </span>
            </div>
          </div>
          <div class="info-item">
            <x-input
              class="star"
              title="聯絡人"
              text-align="right"
              placeholder="請輸入"
              v-model.trim="info.contact_name"
            >
            </x-input>
          </div>
          <div class="info-item">
            <x-input
              class="star"
              title="聯絡人手機號碼"
              text-align="right"
              placeholder="請輸入"
              :max="10"
              v-model.trim="info.contact_phone"
            >
            </x-input>
          </div>
          <div class="group-phone">
            <div class="title">
              <span class="txt">聯絡人電話號碼</span>
            </div>
            <div class="info-item">
              <x-input
                class="star"
                title="電話號碼"
                text-align="right"
                placeholder="請輸入"
                :max="10"
                v-model.trim="info.contact_tel"
              >
              </x-input>
            </div>
            <div class="info-item">
              <x-input
                title="分機"
                text-align="right"
                placeholder="請輸入"
                type="number"
                v-model.trim="info.contact_tel_ex"
              >
              </x-input>
            </div>
          </div>
          <div class="info-item">
            <x-input
              title="聯絡人line帳號"
              text-align="right"
              placeholder="請輸入"
              v-model.trim="info.contact_line"
            >
            </x-input>
          </div>
          <div class="info-item">
            <x-input
              class="star"
              title="聯絡人職稱"
              text-align="right"
              placeholder="請輸入"
              v-model.trim="info.position"
            ></x-input>
          </div>
          <div class="group-way">
            <div class="title">
              <span class="txt">經由何種管道得知GIVE543贈物網</span>
            </div>
            <div class="way">
        <span
          :key="index"
          :class="['box', info.how_know.includes(item.label) ? 'selected' : '']"
          v-for="(item, index) in howKnow">
          <input
            v-show="false"
            type="checkbox"
            :id="item.id"
            :value="item.label"
            v-model="info.how_know" />
          <label
            :for="item.id">
            {{item.label}}
          </label>
        </span>
            </div>
          </div>
        </div>
        <flexbox :gutter="0">
          <flexbox-item>
            <x-button
              class="vux-1px-t btn pre"
              @click.native="preStep"
              type="warn">
              上一步
            </x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button
              class="btn"
              @click.native="nextStep"
              type="warn">
              下一步
            </x-button>
          </flexbox-item>
        </flexbox>
      </template>
      <template v-if="step === 3">
        <div class="container">
          <div class="group-case">
            <div class="title">
              <span class="txt">個別案</span>
            </div>
            <div class="info-item">
              <x-number
                title="兒童（位）"
                :min="0"
                fillable
                width="30px"
                button-style="round"
                v-model="individualCase.child"
              />
            </div>
            <div class="info-item">
              <x-number
                title="少年（位）"
                :min="0"
                fillable
                width="30px"
                button-style="round"
                v-model="individualCase.juvenile"
              />
            </div>
            <div class="info-item">
              <x-number
                title="老人（位）"
                :min="0"
                fillable
                width="30px"
                button-style="round"
                v-model="individualCase.old"
              />
            </div>
            <div class="info-item">
              <x-number
                title="婦女（位）"
                :min="0"
                fillable
                width="30px"
                button-style="round"
                v-model="individualCase.women"
              />
            </div>
            <div class="info-item">
              <x-number
                title="身心障礙（位）"
                :min="0"
                fillable
                width="30px"
                button-style="round"
                v-model="individualCase.disability"
              />
            </div>
            <div class="info-item">
              <x-number
                title="弱勢家庭（戶）"
                :min="0"
                fillable
                width="30px"
                button-style="round"
                v-model="individualCase.vulnerable"
              />
            </div>
          </div>
          <div class="info-item">
            <popup-picker
              title="員工規模"
              placeholder="員工規模"
              :data="[staffScale]"
              v-model="info.staff_scale"
            />
          </div>
          <div class="info-item">
            <popup-picker
              title="全年收入額區間"
              placeholder="全年收入額區間"
              :data="[annualIncome]"
              v-model="info.annual_income"
            />
          </div>
          <div class="group-case">
            <div class="title">
              <span class="txt">年收入比</span>
            </div>
            <div class="info-item">
              <x-number
                title="政府輔助（%）"
                :max="100"
                :min="0"
                fillable
                width="30px"
                button-style="round"
                v-model="info.income_ratio.gov"
              />
            </div>
            <div class="info-item">
              <x-number
                title="大眾捐款（%）"
                :max="100"
                :min="0"
                fillable
                width="30px"
                button-style="round"
                v-model="info.income_ratio.public"
              />
            </div>
            <div class="info-item">
              <x-number
                title="庇護銷售（%）"
                :max="100"
                :min="0"
                fillable
                width="30px"
                button-style="round"
                v-model="info.income_ratio.sales"
              />
            </div>
            <div class="info-item">
              <x-number
                title="其他（%）"
                :max="100"
                :min="0"
                fillable
                width="30px"
                button-style="round"
                v-model="info.income_ratio.other"
              />
            </div>
          </div>
          <div class="info-item">
            <popup-picker
              title="機構全年所需經費"
              placeholder="所需經費"
              :data="[needFunds]"
              v-model="info.need_funds"
            />
          </div>
          <div class="group-case">
            <div class="title">
              <span class="txt">經費用途佔比</span>
            </div>
            <div class="info-item">
              <x-number
                title="人事費（%）"
                :max="100"
                :min="0"
                fillable
                width="30px"
                button-style="round"
                v-model="info.fund_use_ratio.personnel"
              />
            </div>
            <div class="info-item">
              <x-number
                title="機構行政費（%）"
                :max="100"
                :min="0"
                fillable
                width="30px"
                button-style="round"
                v-model="info.fund_use_ratio.admin"
              />
            </div>
            <div class="info-item">
              <x-number
                title="投入個案相關費用（%）"
                :max="100"
                :min="1"
                fillable
                width="30px"
                button-style="round"
                v-model="info.fund_use_ratio.case"
              />
            </div>
          </div>
        </div>
        <flexbox :gutter="0">
          <flexbox-item>
            <x-button
              class="vux-1px-t btn pre"
              @click.native="preStep"
              type="warn">
              上一步
            </x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button
              class="btn"
              @click.native="nextStep"
              type="warn">
              確認送出
            </x-button>
          </flexbox-item>
        </flexbox>
      </template>
    </div>
  </div>
</template>

<script>
import icFirm from '@/assets/icon/profile/profile_data_ic_firm@2x.png'
import ZcRadio from '@/components/ZcRadio'
import ZcCheckbox from '@/components/ZcCheckbox'
import ImgUpload from '@/components/ImgUpload'
import { issues, serviceArea, servicePeoNum, banklist, assesses, howKnow } from '@/tools/constant'
import { taxnumRegexVerify, noSpaceRegex, noNumberRegex, accountRegex, phoneRegex, telRegexVerify } from '@/tools/regex'
import {mapGeo} from '@/tools/strMap'
import { Group, Cell, XButton, PopupPicker, XTextarea, XNumber, Flexbox, FlexboxItem } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    Group,
    Cell,
    ZcCheckbox,
    ZcRadio,
    ImgUpload,
    XButton,
    PopupPicker,
    XTextarea,
    XNumber,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      items: [{
        icon: icFirm,
        title: '申請為公益團體',
        desc: '填寫以下申請資料，站方審核成功，部分資訊會公開顯示於您的名片'
      }],
      step: 1,
      isLaunch: false,
      banklist: [],
      imgList: {
        logo: {
          pics: [],
          isImgLoaded: false
        },
        doc: {
          pics: [],
          isImgLoaded: false
        }
      },
      placementService: [{
        text: '是',
        value: 'Y',
        id: 'service-yes'
      }, {
        text: '否',
        value: 'N',
        id: 'service-no'
      }],
      organization: [{
        text: '財團法人',
        value: '財團法人',
        id: 'consortium'
      }, {
        text: '社團法人',
        value: '社團法人',
        id: 'corporation'
      }, {
        text: '人民團體',
        value: '人民團體',
        id: 'people'
      }, {
        text: '其他',
        value: '其他',
        id: 'other'
      }],
      privateCategory: [{
        text: '公立',
        value: '公立',
        id: 'public'
      }, {
        text: '私立（民營）',
        value: '私立（民營）',
        id: 'private'
      }, {
        text: '公設（民營）',
        value: '公設（民營）',
        id: 'postulate'
      }],
      issues,
      assesses,
      howKnow,
      staffScale: ['1~2', '20', '50', '100', '200以上'],
      annualIncome: ['10', '20', '50', '100', '200以上'],
      needFunds: ['10', '20', '50', '100', '200以上'],
      serviceArea,
      servicePeoNum,
      banks: {
        banks_banks: ['無'],
        banks_branchs: '',
        banks_accounts: '',
        banks_title: ''
      },
      individualCase: {
        child: 0,
        disability: 0,
        juvenile: 0,
        old: 0,
        vulnerable: 0,
        women: 0
      },
      site: {
        register: [''],
        contact: ['']
      },
      isWithRegister: false,
      privateClassify: '公立',
      info: {
        logo: '',
        fullname: '',
        name: '',
        taxnum: '',
        no: '',
        doc: '',
        register: {
          city: '',
          district: '',
          address: ''
        },
        contact: {
          city: '',
          district: '',
          address: ''
        },
        type: '財團法人',
        pub_issues: false,
        issues: [],
        serv_zone: [],
        serv_num: [],
        placement_service: 'N',
        // step === 2
        purpose: '',
        advise_no: '',
        postal_title: '',
        postal_accounts: '',
        e_love_number: '',
        website: '',
        facebook: '',
        contact_line: '',
        recommend: [],
        contact_name: '',
        contact_phone: '',
        contact_tel: '',
        contact_tel_ex: '',
        how_know: [],
        position: '',
        // step == 3
        staff_scale: [],
        annual_income: [],
        income_ratio: {
          gov: 0,
          other: 0,
          public: 0,
          sales: 0
        },
        fund_use_ratio: {
          admin: 0,
          case: 0,
          personnel: 0
        },
        need_funds: []
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
    this.banklist = banklist.map((v) => {
      return {
        name: `${v.code} ${v.name}`,
        value: `${v.code} ${v.name}`
      }
    })
  },
  methods: {
    ...mapActions({
      getGeoConfig: 'getGeoConfig',
      changeUserRoles: 'changeUserRoles',
      getUserCategories: 'getUserCategories'
    }),
    goBack () {
      this.$router.go(-1)
    },
    nextStep () {
      const {logo, fullname, name, taxnum, no, doc, register,
        contact, issues, purpose, contact_name: contactName, contact_phone: contactPhone,
        contact_tel: contactTel, staff_scale: staffScale, annual_income: annualIncome,
        need_funds: needFunds, serv_num: serNum, serv_zone: servZone, position
      } = this.info
      // 第一步表单验证
      if (this.step === 1) {
        if (!logo) {
          return this.$vux.toast.text('請上傳組織Logo', 'bottom')
        }
        if (!fullname) {
          return this.$vux.toast.text('請輸入單位全名', 'bottom')
        }
        if (!name) {
          return this.$vux.toast.text('請輸入單位常用名稱', 'bottom')
        }
        if (!taxnum) {
          return this.$vux.toast.text('請輸入統一編號', 'bottom')
        } else if (!taxnumRegexVerify.test(taxnum)) {
          return this.$vux.toast.text('請輸入正確統一編號', 'bottom')
        }
        if (!no) {
          return this.$vux.toast.text('請輸入立案字號', 'bottom')
        }
        if (!doc) {
          return this.$vux.toast.text('請上傳立案字號文件/掃描檔', 'bottom')
        }
        if (!register.city) {
          return this.$vux.toast.text('請選擇登記地址地區', 'bottom')
        } else if (!register.address) {
          return this.$vux.toast.text('請輸入登記地址詳細地址', 'bottom')
        }
        if (!this.isWithRegister) {
          if (!contact.city) {
            return this.$vux.toast.text('請選擇通訊地址地區', 'bottom')
          } else if (!contact.address) {
            return this.$vux.toast.text('請輸入通訊地址詳細地址', 'bottom')
          }
        }
        if (!issues.length) {
          return this.$vux.toast.text('請選擇組織屬性', 'bottom')
        }
      }
      // 第一步表单验证
      const {banks_branchs: branchs, banks_accounts: accounts, banks_title: title} = this.banks
      if (this.step === 2) {
        if (!purpose) {
          return this.$vux.toast.text('請輸入單位介紹', 'bottom')
        }
        if (branchs && (!noSpaceRegex.test(branchs) || !noNumberRegex.test(branchs))) {
          return this.$vux.toast.text('請輸入正確分行', 'bottom')
        }
        if (accounts && !accountRegex.test(accounts)) {
          return this.$vux.toast.text(`請輸入正確銀行帳號`, 'bottom')
        }
        if (title && !noNumberRegex.test(title)) {
          return this.$vux.toast.text(`請輸入正確銀行戶名`, 'bottom')
        }
        if (!contactName) {
          return this.$vux.toast.text('請輸入聯絡人', 'bottom')
        }
        if (!contactPhone) {
          return this.$vux.toast.text('請輸入聯絡人手機號碼', 'bottom')
        } else if (!phoneRegex.test(contactPhone.trim())) {
          return this.$vux.toast.text('請輸入正確聯絡人手機號碼', 'bottom')
        }
        if (!contactTel) {
          return this.$vux.toast.text('請輸入聯絡人電話號碼', 'bottom')
        } else if (!telRegexVerify.test(contactTel.trim())) {
          return this.$vux.toast.text('請輸入正確聯絡人電話號碼', 'bottom')
        }

        if (!position) {
          return this.$vux.toast.text('請輸入聯絡人職稱', 'bottom')
        }
      }
      if (this.step < 3) {
        this.step += 1
      } else {
        if (!this.isLaunch) {
          this.isLaunch = true
          const dataObj = {
            category_id: this.userCategories.find(item => item.title === '公益團體').id,
            gov: 'N',
            info: {
              ...this.info,
              cat_hash: 'commonweal',
              usr_hash: this.$route.params.hash,
              need_funds: needFunds[0],
              serv_num: serNum[0],
              serv_zone: servZone[0],
              private: this.privateClassify,
              ...this.banks,
              banks_banks: this.banks.banks_banks[0].split(' ')[0],
              case: {
                ...this.individualCase
              },
              staff_scale: staffScale[0],
              annual_income: annualIncome[0]
            }
          }
          this.changeUserRoles({
            dataObj,
            cb: () => {
              this.isLaunch = true
              this.$vux.toast.text('順利送出申請為公益團體，請稍候幾天，我們將通知你審核結果', 'bottom')
              setTimeout(() => this.goBack(), 1000)
            }
          })
        }
      }
    },
    preStep () {
      this.step -= 1
    },
    upLoadingImg (type) {
      this.imgList[type].isImgLoaded = true
    },
    // 上传图片
    imgloaded (data, type) {
      this.imgList[type].pics = [
        ...this.imgList[type].pics,
        {url: data.url}
      ]
      this.info[type] = data.url
      this.imgList[type].isImgLoaded = false
    },
    // 删除图片
    removeImg (index, type) {
      this.imgList[type].pics = this.imgList[type].pics.filter((item, idx) => idx !== index)
      this.info[type] = ''
    },
    initContactAdr (isWith) {
      if (isWith) {
        this.site.contact = this.site.register
        this.info.contact = {...this.info.register}
      }
    },
    handleChangePopupPicker (e, type) {
      this.site[type] = e
      const [city, district] = e
      this.info[type].city = city
      this.info[type].district = district
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
  .benefit-identity{
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
        // step === 3
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
    }
  }
</style>
<style lang="less" scoped>
  @import '../../global.mixin.less';
  @import '../../../node_modules/vux/src/styles/1px.less';
  .benefit-identity{
    height: 100%;
    .panel{
      height: calc(~"100% - 44px");
      overflow-y: scroll;
      .intro{
        margin: 0 @pm-bg 0;
        .g-border-1px;
      }
      .container{
        padding: 0 @pm-bg 0;
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
          &.private, &.organization{
            display: flex;
            flex-direction: column;
            height: auto;
            line-height: 1;
            padding-bottom: 18px;
            .wrapper{
              display: inline-flex;
              justify-content: space-between;
              padding: 18px 0 24px;
              color: @color-font-C1;
              font-size: 15px;
              .label{
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
            }
          }
          &.placementService{
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
          // step === 2
          &.desc{
            height: auto;
            line-height: 1.15;
            overflow: auto;
          }
        }
        .group-address, .group-donate, .group-bank, .group-phone, .group-case{
          > .title{
            display: flex;
            justify-content: space-between;
            padding: 24px 0 @pm-bg 0;
            color: @color-font-C2;
            font-size: @font-S4;
          }
        }
        .group-address{
          > .title{
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
        .group-issues, .group-assess, .group-way{
          padding-bottom: 8px;
          .g-border-1px;
          > .title{
            display: flex;
            justify-content: space-between;
            padding: 18px 0 24px 0;
            color: @color-font-C1;
            font-size: 15px;
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
        .group-way, .group-case{
          .g-border-none();
        }
        .group-issues{
          > .title{
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
      }
      .btn{
        border-radius: 0;
        border: none;
        padding: 0;
        &:after{
          border-radius: 0;
          border: none;
        }
        &.pre{
          color: @color-font-C1;
          background: #FFF;
        }
      }
      .btn-panel{
        padding: 0 @pm-bg @pm-bg;
      }
    }
  }
</style>
