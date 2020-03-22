<template>
  <div class="setting g-smooth">
    <group v-for="(item, index) in Object.keys(settings)" :key="index">
      <cell
        :value="child.value"
        :key="idx"
        :title="child.title"
        is-link
        :link="child.link"
        v-for="(child, idx) in settings[item]">
        <img v-if="child.icon" slot="icon" width="20" :src="child.icon" alt="icon">
      </cell>
    </group>
    <x-button @click.native="logout" type="warn" class="usersetting-btn-logout">登出</x-button>
  </div>
</template>

<script>
import { Group, XButton, Cell } from 'vux'
import { mapMutations } from 'vuex'
import icFeedback from '@/assets/icon/profile/profile_data_ic_feedback@2x.png'
import icAbout from '@/assets/icon/profile/profile_data_ic_about@2x.png'
import icData from '@/assets/icon/profile/profile_data_ic_data@2x.png'
import icSend from '@/assets/icon/profile/profile_data_ic_send@2x.png'
import icSite from '@/assets/icon/profile/profile_data_ic_site@2x.png'
import icMail from '@/assets/icon/profile/profile_data_ic_mail@2x.png'
import icChange from '@/assets/icon/profile/profile_data_ic_change@2x.png'
import icName from '@/assets/icon/profile/profile_data_ic_name@2x.png'
import icLove from '@/assets/icon/profile/profile_data_ic_love@2x.png'
import icPwd from '@/assets/icon/profile/profile_data_ic_password@2x.png'
import icPhone from '@/assets/icon/profile/profile_data_ic_phone@2x.png'
import icNewConnect from '@/assets/img/profile_ic_list@2x.png'
import { local } from '@/tools/storage'
import { doClickLogout } from '@/tools/GAEvent'
export default {
  components: {
    Group,
    XButton,
    Cell
  },
  data () {
    return {
      settings: {
        accountList: [{
          title: '基本資料',
          link: 'editBaseInfo',
          value: '',
          icon: icData
        }, {
          title: '匯款及寄送資訊',
          link: 'editRemit',
          value: '',
          icon: icSend
        }, {
          title: '聯絡地址',
          link: 'editAdr',
          value: '',
          icon: icSite
        }, {
          title: '會員變更',
          link: 'change',
          value: '',
          icon: icChange
        }, {
          title: '綁定愛箱送',
          link: '/verifylovebox',
          value: '',
          icon: icLove
        }],
        featureList: [{
          title: '郵箱驗證',
          link: '/verifyemail',
          value: '',
          icon: icMail
        }, {
          title: '手機驗證',
          link: '/verifycellphone',
          value: '',
          icon: icPhone
        }, {
          title: '實名驗證',
          link: '/verifyname',
          value: '',
          icon: icName
        }, {
          title: '修改密碼',
          link: '/chpw',
          value: '',
          icon: icPwd
        }],
        otherList: [{
          title: '用戶反饋',
          link: '/feedback',
          value: '',
          icon: icFeedback
        }, {
          title: '關於我們',
          link: '/about543new',
          value: '',
          icon: icAbout
        }]
      }
    }
  },
  methods: {
    ...mapMutations({
      logoutCommit: 'logout',
      recoverEnvMessage: 'recoverEnvMessage',
      recoverSysMessage: 'recoverSysMessage'
    }),
    logout () {
      this.logoutCommit()
      this.recoverEnvMessage()
      this.recoverSysMessage()
      // 登出時清除輪詢定時器
      let localReadInterval = local.get('READ_INTERVAL', true)
      if (localReadInterval) {
        window.clearInterval(localReadInterval)
        localReadInterval = null
        local.remove('READ_INTERVAL')
      }
      doClickLogout()
      this.$router.replace('/login')
    }
  },
  computed: {
    showNewConnect () {
      const ary = [32, 35, 44]
      const id = this.$store.state.user.userInfo.categoryId
      return ary.some(num => num === id)
    }
  },
  created () {
    if (this.showNewConnect) {
      this.settings = {
        ...this.settings,
        featureList: this.settings.featureList.concat({
          title: '交接預告',
          link: '/newconnect',
          value: '',
          icon: icNewConnect
        })
      }
    }
  }
}
</script>

<style lang="less">
  .setting{
    .weui-cells{
      // margin-top: 0;
      .weui-cell{
        // height: 50px;
        // line-height: 50px;
        &:before{
          left: 0;
        }
        .weui-cell__hd{
          img{
            display: block;
            margin-right: @pm-md;
          }
        }
        .vux-cell-bd{
          .vux-label{
            color: @color-font-C1;
            font-size: 15px;
          }
        }
        .weui-cell__ft{
          padding-right: 20px;
          color: @color-font-C2;
          font-size: @font-S3;
          &:after{
            content: " ";
            display: inline-block;
            margin-top: -7px;
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
  }
</style>

<style lang="less" scoped>
  .setting{
    .usersetting-btn-logout{
      display: block;
      margin: @pm-lg auto;
      width: 90%;
      line-height: 2.5;
      font-size: 16px;
    }
  }
</style>
