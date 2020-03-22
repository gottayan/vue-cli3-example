<template>
  <div class="userbaseinfo-container">
    <div class="user-baseinfo-container">
      <router-link
        v-if="isMyself"
        :to="`/user/${user.id}/setting`">
        <icon
          name="settings"
          :scale="2.2"
          class="user-setting">
        </icon>
      </router-link>
      <span
        @click="handleTraceUser"
        v-if="!isMyself"
        class="btn-trace">
        {{isTrace ? user.isTracing ? '取消中...' : '追蹤中...' : user.isTracing ? '已追蹤' : '追蹤TA'}}
      </span>
      <div class="user-baseinfo-panel">
        <div class="avatar-wrapper">
          <img
            v-if="!isMyself && isBindWhite"
            :src="profileAngle"
            width="auto"
            height="27"
            class="note-icon"
            alt="icon">
          <img
            v-if="!isMyself && isBindBlack"
            :src="profileDemon"
            width="auto"
            height="27"
            class="note-icon demon"
            alt="icon">
          <img
            @click="makeUserMark"
            class="avatar avatar-img"
            v-if="user.pics"
            :src="smartImagePath(user.pics)"
            alt="avatar">
          <div
            @click="makeUserMark"
            class="avatar"
            v-else>
            <img
              :src="defaultAvatar"
              width="66"
              height="66"
              alt="icon">
          </div>
          <img
            v-if="verify.mail && verify.cell"
            :src="picVip"
            width="20"
            height="20"
            class="vip"
            alt="icon">
        </div>
        <div class="user-baseinfo-wrapper">
          <span class="user-baseinfo-name">
            {{user.nickname || '無暱稱'}}
            <span
              class="user-baseinfo-action"
              v-if="!isMyself">
            </span>
          </span>
          <!-- <span
            class="user-commonweal-subtitle"
            v-if="user.catHash === 'commonweal' && user.verifyInfo">
            <span v-if="user.verifyInfo.fullname">{{user.verifyInfo.fullname}}</span>
            <span v-if="user.verifyInfo.position">-{{user.verifyInfo.position}}</span>
          </span> -->
          <div class="user-baseinfo-role-wrapper">
            <span class="user-baseinfo-role">
              <span class="user-baseinfo-icon">
                <img :src="mapRoleIcon(user.catHash)" alt="">
              </span>
              {{user.catHash | role}}：{{user.id}}
            </span>
            <img
              @click="isMyself && !verify.mail && toVerify('/verifyemail')"
              :src="verify.mail ? iconMailApprove : iconMailNormal"
              width="14"
              height="14"
              class="mail"
              alt="icon">
            <img
              @click="isMyself && !verify.cell && toVerify('/verifycellphone')"
              :src="verify.cell ? iconPhoneApprove : iconPhoneNormal"
              width="14"
              height="14"
              class="phone"
              alt="icon">
            <img
              @click="isMyself && !verify.ppl && toVerify('/verifyname')"
              :src="verify.ppl ? iconIdiApprove : iconIdiNormal"
              width="14"
              height="14"
              class="identity"
              alt="icon">
            <icon
              :scale="2"
              name="chat"
              v-if="!isMyself"
              @click.native="handleTalk">
            </icon>
          </div>
        </div>
      </div>
      <div
        @click="toUserInfos(user.infos)"
        class="user-baseinfo-infos">
        個人介紹：{{user.infos || '這個傢伙很懶，什麼也沒留下~'}}
      </div>
      <!-- <div class="user-baseinfo-infos g-sys-user__disabled" v-if="!isMyself && !validUser">
        提示：當前用戶因違反GIVE543相關規定，現已被暫停使用
      </div> -->
    </div>
    <section class="user-data-container">
      <div class="user-data-panel">
        <div class="user-data-numwrapper">
          <!--<div class="g-title">-->
            <!--追蹤情報-->
          <!--</div>-->
          <div class="content flex-container">
            <div class="fans g-cloumn-item">
              <span>{{user.fans}}</span><span>粉絲人數</span>
            </div>
            <div
              @click="toMyTraceUsers(!!user.traces)"
              class="traces g-cloumn-item">
              <span>{{user.traces}}</span><span>追蹤中</span>
            </div>
          </div>
        </div>
        <div class="user-data-numwrapper">
          <!--<div class="g-title">-->
            <!--感謝記錄-->
          <!--</div>-->
          <div class="content flex-container">
            <div class="bonus g-cloumn-item" @click="showMoreInfo('bonus')">
              <span>{{user.bonus}}</span>
              <span class="baseinfo-item">
                <span>好人點</span>
                <x-icon type="ios-help-outline" size="15"></x-icon>
              </span>
            </div>
            <div class="reviews-rate g-cloumn-item" @click="showMoreInfo('reviewsRate')">
              <span v-if="user.reviewsRate !== null">
                {{`${user.reviewsRate || 0}%`}}
              </span>
              <span v-else>-</span>
              <span class="baseinfo-item">
                <span>感謝率</span>
                <x-icon type="ios-help-outline" size="15"></x-icon>
              </span>
            </div>
            <div class="charitys g-cloumn-item">
              <span>{{user.charitys}}</span><span>公益捐贈</span>
            </div>
          </div>
        </div>
        <template v-if="isMyself">
          <deals-request>
          </deals-request>
          <deals-donate>
          </deals-donate>
        </template>
      </div>
      <group class="user-cell-container no-divider">
        <cell
          v-for="(item, index) in userInfoCellList"
          :key="index"
          :title="isMyself ? item.text : item.textOther"
          :link="item.link.replace(':hash', user.id)"
          :is-link="!!item.link"
          border-intent
          class="no-divider">
          <img
            class="user-cellItem-icon"
            :src="item.icon"
            alt=""
            slot="icon">
        </cell>
      </group>
    </section>
    <div v-transfer-dom>
      <confirm
        class="user-base-info-private-note"
        v-model="show"
        hide-on-blur
        theme="android">
        <div class="note-confirm">
          <section-title
            class="note-confirm-title"
            title="標記用戶">
          </section-title>
          <div class="section-sign">
            <div class="title">標記為</div>
            <div class="container">
              <zc-radio
                class="radio-box"
                :radioList="privateNote"
                v-model="type">
              </zc-radio>
            </div>
          </div>
          <div class="section-note">
            <div class="title">筆記</div>
            <div class="container">
              <x-textarea
                v-model="note"
                :max="50"
                show-counter
                class="note-textarea"
                placeholder="請輸入您的筆記">
              </x-textarea>
            </div>
          </div>
          <div class="hint">此標記只有自己可見</div>
          <div class="save-btn" @click="onConfirm">保存</div>
        </div>
        <span class="close" @click="cancleConfirm"></span>
      </confirm>
    </div>
    <div v-transfer-dom>
      <x-dialog class="g-modal__offset" :show="validUser && !isMyself" :dialog-style="{'top': '44px', 'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
        <p style="color: #fff; text-align: center;">
          <img src="@/assets/img/forbid.png" alt="" />
          <br />
          <span style="color: #c7c7c7; font-size: 30px; margin-top: 15px">此帳號目前停用</span>
          <br />
        </p>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import DAvatarS from '@/assets/img/default-sticker-S.jpg'
import SettingIcon from '@/assets/img/profile_ic_setting_pressed@2x.png'
import schoolIcon from '@/assets/img/profile_ic_school@2x.png'
import govIcon from '@/assets/img/profile_ic_office@2x.png'
import normalIcon from '@/assets/img/profile_ic_member@2x.png'
import careIcon from '@/assets/img/profile_ic_lovemember@2x.png'
import companylIcon from '@/assets/img/profile_ic_firm@2x.png'
import commonwealIcon from '@/assets/img/profile_ic_benefit@2x.png'
import iconMailNormal from '@/assets/icon/profile/profile_pic_mail_normal@2x.png'
import iconMailApprove from '@/assets/icon/profile/profile_pic_mail_approve@2x.png'
import iconIdiNormal from '@/assets/icon/profile/profile_pic_identity_normal@2x.png'
import iconIdiApprove from '@/assets/icon/profile/profile_pic_identity_approve@2x.png'
import iconPhoneNormal from '@/assets/icon/profile/profile_pic_phone_normal@2x.png'
import iconPhoneApprove from '@/assets/icon/profile/profile_pic_phone_approve@2x.png'
import profileAngle from '@/assets/icon/profile/profile_pic_angel@2x.png'
import profileDemon from '@/assets/icon/profile/profile_pic_demon@2x.png'
import ProfileLoveboxSend from '@/assets/icon/profile/profile_list_ic_send@2x.png'
import defaultAvatar from '@/assets/icon/icon-default-avatar.png'
import picVip from '../assets/icon/profile/profile_pic_vip@2x.png'
import ProfileAskfor from '@/assets/img/profile_ic_askfor@2x.png'
import { Cell, Group, Confirm, XDialog,
  TransferDomDirective as TransferDom, XTextarea } from 'vux'
import ZcRadio from '@/components/ZcRadio'
import SectionTitle from '@/components/Title'
import { userInfoCellList, userInfoExtraCellList, baseInfoDesc } from '@/tools/constant'
import { mapActions, mapState, mapMutations } from 'vuex'
import {smartImagePath} from '@/tools/ObjectHelper'
import DealsRequest from '@/components/deals/Request.vue'
import DealsDonate from '@/components/deals/Donate.vue'

export default {
  directives: {
    TransferDom
  },
  components: {
    Cell,
    Group,
    Confirm,
    XTextarea,
    ZcRadio,
    SectionTitle,
    DealsRequest,
    DealsDonate,
    XDialog
  },
  data () {
    return {
      show: false,
      note: '',
      type: 'WHITE',
      userInfoCellList,
      DAvatarS,
      SettingIcon,
      iconMailNormal,
      iconMailApprove,
      iconIdiNormal,
      iconIdiApprove,
      iconPhoneNormal,
      iconPhoneApprove,
      profileAngle,
      profileDemon,
      defaultAvatar,
      picVip,
      smartImagePath,
      userRoleIcon: {
        schoolIcon,
        govIcon,
        normalIcon,
        careIcon,
        companylIcon,
        commonwealIcon
      },
      privateNote: [{
        text: '好名單',
        value: 'WHITE',
        id: 'angle'
      }, {
        text: '壞名單',
        value: 'BLACK',
        id: 'evil'
      }],
      isMark: false,
      isTrace: false,
      isConfirm: false
    }
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    isMyself: {
      type: Boolean,
      default: false
    }
  },
  created () {
    if (!this.isMyself) {
      this.userInfoCellList = [...this.userInfoCellList, {
        text: '我的索取',
        textOther: 'TA的索取',
        link: '/user/:hash/deals',
        icon: ProfileAskfor
      }]
    }
    if (this.isMyself) {
      this.userInfoCellList = [].concat(this.userInfoCellList, userInfoExtraCellList)
      if (this.isBindLove) {
        this.userInfoCellList = [].concat(this.userInfoCellList, [{
          text: '我寄送的愛箱',
          textOther: 'TA寄送的愛箱',
          link: '/user/:hash/love',
          icon: ProfileLoveboxSend
        }])
      }
    } else if (localStorage.getItem('KEY_USER_TOKEN')) {
      // 获取私人笔记
      if (!this.marks['WHITE'].curPage) {
        this.getUserMarks({type: 'WHITE'})
      }
      if (!this.marks['BLACK'].curPage) {
        this.getUserMarks({type: 'BLACK'})
      }
    }
  },
  methods: {
    ...mapActions({
      makeMarks: 'makeMarks',
      getUserMarks: 'getUserMarks',
      traceUser: 'traceUser'
    }),
    ...mapMutations({
      setTraceIdx: 'setTraceIdx'
    }),
    handleTalk () {
      if (this.validUser) {
        this.$vux.alert.show({
          title: '提示',
          content: '當前用戶因違反GIVE543相關規定，現已被暫停使用',
          buttonText: '確定',
          hideOnBlur: true
        })
        return
      }
      this.$router.push(`/chatroom/${this.user.id}?type=user&directUserName=${this.user.nickname}`)
    },
    showMoreInfo (type) {
      this.$vux.alert.show({
        title: baseInfoDesc[type].label,
        content: baseInfoDesc[type].text,
        buttonText: '確定',
        onShow () {
        },
        onHide () {
        }
      })
    },
    toMyTraceUsers (isTrace) {
      if (isTrace && this.isMyself) {
        this.setTraceIdx({idx: 2})
        this.$router.push(`/user/${this.user.id}/traces`)
      }
    },
    mapRoleIcon (role) {
      const result = this.userRoleIcon[`${role}Icon`]
      return result || this.userRoleIcon.normalIcon
    },
    makeUserMark () {
      if (!this.isMyself && !this.isBindWhite && !this.isBindBlack) {
        this.show = true
      }
    },
    onConfirm () {
      if (this.isConfirm) {
        return
      }
      this.isConfirm = true
      if (!localStorage.getItem('KEY_USER_TOKEN')) {
        this.isConfirm = false
        return this.$vux.toast.text('請先登入', 'bottom')
      }
      if (!this.isMark) {
        this.isMark = true
        const hash = this.$route.params.hash
        this.makeMarks({
          content: this.note,
          userId: hash,
          type: this.type,
          cb: () => {
            this.getUserMarks({
              type: this.type,
              cb: (data) => {
                this.show = false
                this.isConfirm = false
                this.isMark = false
                this.$vux.toast.text('標記成功', 'bottom')
              }
            })
          }
        })
      }
    },
    cancleConfirm () {
      this.show = false
    },
    handleTraceUser () {
      if (!localStorage.getItem('KEY_USER_TOKEN')) {
        return this.$router.replace(`/login?redirect=/user/${this.$route.params.hash}`)
      }
      if (!this.isTrace) {
        this.isTrace = true
        this.traceUser({
          isTrace: this.user.isTracing,
          userId: this.user.id,
          cb: () => {
            this.isTrace = false
          }
        })
      }
    },
    toUserInfos (infos) {
      if (infos) {
        this.$router.push(`/user/${this.user.id}/infos`)
      }
    },
    toVerify (type) {
      this.$router.push(type)
    }
  },
  computed: {
    ...mapState({
      marks: state => state.user.marks
    }),
    validUser () {
      // 判断用户是否被停权 1 -> 正常 | 2 -> 被停权
      return this.user.useStatus === 2
    },
    isBindWhite () {
      return this.isMyself ? true : this.marks['WHITE'].data.some((item) => item.mark_user_id === Number(this.$route.params.hash))
    },
    isBindBlack () {
      return this.isMyself ? true : this.marks['BLACK'].data.some((item) => item.mark_user_id === Number(this.$route.params.hash))
    },
    isBindLove () {
      return this.user.love
    },
    verify () {
      const {veriMail, veriCell, veriPpl} = this.user
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
  .userbaseinfo-container{
    .weui-cells{
      &:before, &:after{
        display: none;
      }
    }
  }
  .note-confirm{
    .weui-cell__bd{
      height: 70px;
      .weui-textarea-counter{
        display:block !important;
      }
    }
    .section-sign{
      .container{
        .radio-box{
          display: flex;
          justify-content: space-around;
          margin-top: 24px;
          .radioItem{
            display: inline-flex;
            flex-direction: column;
            text-align: center;
            input{
              width: 54px;
              height: 54px;
            }
            label{
              margin-top: @pm-md;
              color: @color-font-C2;
            }
            &:nth-of-type(1){
              input{
                background-image: url('../assets/icon/profile/profile_dialog_ic_angel_normal@2x.png')
              }
              input[type="radio"]:checked{
                background-image: url('../assets/icon/profile/profile_dialog_ic_angel_selected@2x.png')
              }
            }
            &:nth-of-type(2){
              input{
                background-image: url('../assets/icon/profile/profile_dialog_ic_demon_normal@2x.png')
              }
              input[type="radio"]:checked{
                background-image: url('../assets/icon/profile/profile_dialog_ic_demon_selected@2x.png')
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  @import '../global.mixin.less';

  .userbaseinfo-container{
    background-color: @color-CBG;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-scrolling: touch;
    .user-data-container{
      padding-bottom: 50px;
    }
  }

  .user-baseinfo-container{
    background-image: url('../assets/img/profile_pic_topbg@2x.png');
    background-size: cover;
    min-height: 210px;
  }

  .user-setting{
    width: 50px;
    background-size: contain;
    position: absolute;
    right: 5px;
    top: 15px;
    z-index: 1;
  }
  .btn-trace{
    position: absolute;
    top: @pm-bg;
    right: @pm-bg;
    background-color: #ffa507;
    font-size: 14px;
    color: #ffffff;
    width: 64px;
    height: 30px;
    border-radius: 3px;
    text-align: center;
    line-height: 30px;
    z-index: 1;
  }

  .user-baseinfo-panel{
    position: relative;
    margin-top: 15px;
    padding: 0 15px;
    display: flex;
    .avatar-wrapper{
      display: flex;
      align-items: center;
      .note-icon{
        position: absolute;
        left: 13px;
        top: -11px;
        z-index: 2;
        &.demon{
          left: 18px;
          top: -10px;
        }
      }
      .avatar{
        position: relative;
        z-index: 10;
        img{
          border-radius: 50%;
        }
      }
      .vip{
        position: absolute;
        top: 46px;
        left: 60px;
        z-index: 10;
      }
    }
    .avatar{
      width: 66px;
      height: 66px;
      border-radius: 50%;
      margin-right: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &-img{
        background-color: white;
      }
    }

    .user-baseinfo-wrapper{
      display: flex-flex;
      align-items: center;
      flex-direction: column;
      >span{
        display: flex;
        align-items: center;
      }

      .user-baseinfo-name{
        color: @color-font-C4;
        font-size: 18px;
        font-weight: 700;
        max-width: 180px;
      }

      .user-baseinfo-icon{
        width: 16px;
        height: 16px;
        display: inline-block;
        margin-right: 8px;
        vertical-align: middle;

        img{
          width: 100%;
          height: 100%;
        }
      }
      .user-baseinfo-role-wrapper{
        display: flex;
        align-items: center;
        .user-baseinfo-role{
          height: 22px;
          background: rgba(81, 26, 10, .15);
          color: @color-font-C5;
          font-size: @font-S4;
          border-radius: 16px;
          padding: 0 10px;
        }
        .mail{
          margin-left: 12px;
        }
        .phone{
          margin: @pm-md;
        }
        .identity{
          margin-right: 12px;
        }
      }
    }
    .user-baseinfo-action{
      display: flex;
      align-items: center;
      margin-left: 10px;
    }
  }
  .user-commonweal-subtitle{
    color: white;
  }

  .user-baseinfo-infos{
    padding: 0 @pm-bg;
    margin-top: 20px;
    color: #FFF;
    font-size: @font-S3;
    line-height: 20px;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .user-data-panel{
    padding: 0 15px;
  }

  .user-data-container{
    margin: -28px 15px 0;
    background: white;
    border-radius: 6px 6px 0 0;
    flex: 1;
  }

  .user-cell-container{
    padding: 0 15px;

    .weui-cells:before{
      display: none;
      content: '';
      border-top: none;
      color: transparent;
    }
  }

  .user-cellItem-icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-right: 15px;
  }

  .weui-cell.no-divider::before{
    border-top: none;
  }

  .user-data-numwrapper{
    padding: 20px 0 20px;
    border-bottom: 1px solid #eee;

    .g-title{
      margin-bottom: 20px;
    }

    .baseinfo-item span,
    .baseinfo-item span+svg{
      vertical-align: middle;
    }
  }

  .flex-container{
    display: flex;
    justify-content: center;
    align-items: center;
    >div{
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .weui-cells{
    border-bottom: none;
    &:before{
      display: none;
    }
  }

  .weui-cells:after{
    border-bottom: 0!important;
    content: ''!important;
    height: 0!important;
    position: static!important;
    color: transparent;
  }
  .note-confirm{
    text-align: left;
    &-title{
      padding: 5px 0 @pm-lg 0;
      .g-border-1px();
    }
    .section-sign, .section-note{
      > .title{
        color: @color-font-C1;
        font-size: 15px;
      }
    }
    .section-sign{
      margin-top: @pm-lg;

    }
    .section-note{
      margin-top: 24px;
      .note-textarea{
        padding: @pm-md;
        margin: @pm-bg 0;
        /*height: 80px;*/
        font-size: @font-S3;
        border: 1px solid @color-CL;
      }
    }
    .hint{
      color: @color-font-C3;
      font-size: 12px;
    }
    .save-btn{
      margin-top: @pm-lg;
      width: 100%;
      height: 40px;
      line-height: 40px;
      color: #FFF;
      font-size: @font-S2;
      text-align: center;
      border-radius: 3px;
      background: @color-CR;
    }
  }
</style>
