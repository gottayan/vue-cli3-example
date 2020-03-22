<template>
  <div class="user-edit-remit g-smooth">
    <group class="section-remit">
      <section-title title="匯款及寄送資訊">
      </section-title>
      <div :key="i" class="bank" v-for="i in 2">
        <div class="title">
          <span class="txt">匯款資訊{{i}}</span>
        </div>
        <div class="info-item">
          <PopupPicker
            :data="banklist"
            title="匯款銀行"
            class="content"
            v-model="banks[i - 1].banks"
            :columns="1"
            placeholder="請選擇匯款銀行"
          />
        </div>
        <div class="info-item">
          <x-input
            type="text"
            title="分行"
            text-align="right"
            placeholder="請輸入"
            v-model="banks[i - 1].branchs"
          />
        </div>
        <div class="info-item">
          <x-input
            type="text"
            title="帳號"
            text-align="right"
            placeholder="請輸入銀行帳號"
            v-model="banks[i - 1].accounts">
          </x-input>
        </div>
        <div class="info-item">
          <x-input
            type="text"
            title="匯款戶名"
            text-align="right"
            placeholder="請輸入"
            v-model="banks[i -1 ].title">
          </x-input>
        </div>
      </div>
      <div class="info-item">
        <popup-picker
          title="全家店號"
          :data="famiPickerData"
          :columns="3"
          v-model="fami"
          show-name
          @on-hide="toggleMoreInfo"
          @on-show="toggleMoreInfo"
        ></popup-picker>
      </div>
      <div class="hint">請輸入六碼全家店到店之取件店號。<a :style="{color: '#e25443'}" href="http://www.famiport.com.tw/shop.asp" rel="noopener" target="_blank">查詢店號</a></div>

      <section-title title="掌櫃櫃機預設地址" class="section-panel">
      </section-title>
      <palm-box-select
        :handleChange="handlePalmBoxChange"
        :value="palmbox.value"
      ></palm-box-select>
    </group>
    <div class="save-btn">
      <x-button class="btn" @click.native="modifyUserInfo" type="warn">保存</x-button>
    </div>
  </div>
</template>

<script>
import {
  Group,
  XButton,
  PopupPicker
} from 'vux'
import SectionTitle from '@/components/Title'
import PalmBoxSelect from '@/components/PalmBoxSelect'
import { banklist } from '@/tools/constant'
import { mapGeo } from '@/tools/strMap'
import { setDefaultFami } from '@/tools/ObjectHelper'
import { noNumberRegex, noSpaceRegex, accountRegex } from '@/tools/regex'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    Group,
    XButton,
    SectionTitle,
    PopupPicker,
    PalmBoxSelect
  },
  data () {
    return {
      famiStores: [[]],
      banklist: [],
      fami: ['', '', ''],
      banks: [
        {
          banks: [''],
          branchs: '',
          accounts: '',
          title: ''
        },
        {
          banks: [''],
          branchs: '',
          accounts: '',
          title: ''
        }
      ],
      palmbox: {
        site: [''],
        name: [''],
        edcode: '',
        value: ['', '', '']
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      geoConfig: state => state.configs.geoConfig
    }),
    famiPickerData () {
      return this.$store.getters.famiPickerData
    },
    areaMapLists () {
      return mapGeo(this.geoConfig)
    },
    palmBoxPickerData () {
      return this.$store.getters.palmBoxPickerData
    }
  },
  methods: {
    ...mapActions({
      getGeoConfig: 'getGeoConfig',
      getFamiStores: 'getFamiStores',
      getLoginUserInfo: 'getLoginUserInfo',
      modify: 'modify',
      getPalmBox: 'getPalmBox'
    }),
    toggleMoreInfo () {
      const node = document.querySelector('#app')
      node.classList.toggle('g-picker__moreinfo')
    },
    handlePalmBoxChange (value) {
      this.palmbox = {
        ...this.palmbox,
        value
      }
    },
    beforeGetPalmBox (closeType) {
      if (closeType) {
        this.palmbox.edcode = {}
        this.palmbox.name = ['']
        this.getPalmBox({
          city: this.palmbox.site[0],
          area: this.palmbox.site[1],
          cb: () => {
            console.log('end')
          }
        })
      }
    },
    getLoginUserInfoCb () {
      this.getFamiStores({ cb: this.getFamiStoresCb })
    },
    // 获取全家店号，并匹配个人资料默认全家店号
    getFamiStoresCb (data) {
      const { others } = this.userInfo
      if (data) {
        this.famiStores = [
          ['無', ...data.data.map(({ name, code }) => `${code} ${name}`)]
        ]
        if (others) {
          const { famicodes, banks, edcode } = others
          if (edcode && edcode.value) {
            this.palmbox = {
              ...this.palmbox,
              value: [edcode.city, edcode.dict, edcode.value]
            }
          }
          if (famicodes && famicodes[0]) {
            const famiStore = data.data.filter(
              item => item.code === famicodes[0]
            )
            if (famiStore.length) {
              this.fami = setDefaultFami(famicodes[0], data.data)
            }
          }
          if (banks) {
            this.banks.forEach((item, index) => {
              const filterBanks = banklist.filter((temp) => temp.code === banks[index].banks)
              if (filterBanks.length > 0) {
                const initBank = filterBanks[0]
                this.$set(this.banks, index, {...banks[index], banks: [`${initBank.code} ${initBank.name}`]})
              }
            })
          }
        }
      }
    },
    modifyUserInfo () {
      let isAbledToMod = true
      this.banks.forEach((item, index) => {
        if (
          item.branchs &&
          (!noSpaceRegex.test(item.branchs) ||
            !noNumberRegex.test(item.branchs))
        ) {
          isAbledToMod = false
          return this.$vux.toast.text(
            `匯款資訊${index}：請輸入正確分行`,
            'bottom'
          )
        }
        if (item.accounts && !accountRegex.test(item.accounts)) {
          isAbledToMod = false
          return this.$vux.toast.text(
            `匯款資訊${index}：請輸入正確帳號`,
            'bottom'
          )
        }
        if (item.title && !noNumberRegex.test(item.title)) {
          isAbledToMod = false
          return this.$vux.toast.text(
            `匯款資訊${index}：請輸入正確匯款戶名`,
            'bottom'
          )
        }
      })
      // forEach语句中return无法终止函数
      if (!isAbledToMod) {
        return false
      }
      const { others } = this.userInfo
      const banks = this.banks.map(item => {
        return {
          ...item,
          banks: item.banks[0].split(' ')[0]
        }
      })
      const otherUserInfo = {
        ...others,
        banks,
        edcode: {
          city: this.palmbox.value[0],
          dict: this.palmbox.value[1],
          value: this.palmbox.value[2]
        },
        famicodes: [this.fami[2] || '無']
      }
      const dataObj = {
        others: JSON.stringify(otherUserInfo)
      }
      this.modify({ dataObj, cb: this.modifyUserInfoCb })
      this.$vux.loading.show({
        text: '更新資料中...'
      })
    },
    modifyUserInfoCb () {
      this.$vux.loading.hide()
      this.$vux.toast.text('更新成功', 'bottom')
      this.getLoginUserInfo({
        cb: () => {
          setTimeout(() => this.$router.go(-1), 1000)
        }
      })
    }
  },
  created () {
    this.banklist = banklist.map(v => {
      return {
        name: `${v.code} ${v.name}`,
        value: `${v.code} ${v.name}`
      }
    })
    if (!this.areaMapLists.length) {
      this.getGeoConfig()
    }
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      return this.getLoginUserInfo({ cb: () => this.getLoginUserInfoCb() })
    }
    this.getLoginUserInfoCb()
  }
}
</script>
<style lang="less">
.user-edit-remit {
  .plambox-s-container .vux-cell-box{
    line-height: 50px;
  }

  .weui-cells {
    margin-top: 0;
    padding: 30px 0 0 0;
    &:before,
    &:after {
      display: none;
    }
    .weui-cell {
      padding: 0;
      &:before {
        display: none;
      }
    }
  }
  .info-item {
    .weui-cell {
      .weui-cell__hd,
      .vux-cell-bd .vux-label {
        color: @color-font-C1;
        font-size: 15px;
      }
      .weui-cell__bd,
      .vux-popup-picker-select-box {
        color: @color-font-C2;
        font-size: @font-S3;
      }
      .vux-popup-picker-select-box {
        color: @color-font-C3;
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import "../../../node_modules/vux/src/styles/1px.less";
@import "../../global.mixin.less";
.user-edit-remit {
  background: #fff;
  height: 100%;
  overflow-y: scroll;

  .section-panel{
    margin-top: 30px;
  }

  .hint {
    padding-top: 5px;
    color: @color-font-C2;
    font-size: 12px;
    font-weight: 400;
  }
  .section-remit {
    padding: 0 @pm-bg;
    .info-item {
      height: 50px;
      line-height: 50px;
      .g-border-1px;
      &:nth-of-type(2) {
        margin-top: 6px;
      }
    }
  }
  .section-remit {
    .bank {
      > .title {
        display: flex;
        justify-content: space-between;
        padding: 24px 0 0 0;
        color: @color-font-C2;
        font-size: @font-S3;
      }
    }
  }
  .save-btn {
    padding: 24px @pm-bg @pm-bg;
    width: 100%;
  }
}
.last {
  display: flex;
  // color: #0f0;
  .logistics {
    flex: 2;
    font-size: 15px;
  }
  .search {
    flex: 2;
  }
}
</style>
