<template>
  <div class="user-private">
    <div class="user-private-box">
      <tab
        v-model="tabIndex"
        :line-width="2"
        prevent-default
        custom-bar-width="24px"
        @on-before-index-change="switchTabItem">
        <tab-item :selected="tabIndex === 0">好名單</tab-item>
        <tab-item :selected="tabIndex === 1">壞名單</tab-item>
      </tab>
      <div class="container">
        <div class="private-note g-smooth">
          <div
            :key="index"
            class="note-item"
            v-for="(mark, index) in (tabIndex === 0 ?
            marks['WHITE'].data :  marks['BLACK'].data)">
            <div class="user-info">
              <div class="info-wrapper">
                <router-link :to="`/user/${mark.mark_user.id}`">
                  <img
                    :src="smartImagePath(mark.mark_user.pics) || defaultAvatar"
                    width="50"
                    height="50"
                    alt="icon">
                </router-link>
                <router-link :to="`/user/${mark.mark_user.id}`">
                  <span class="name">{{mark.mark_user.nickname || '無暱稱'}}</span>
                </router-link>
              </div>
              <div class="action">
                <span
                  class="edit"
                  @click="editNote(mark.content, mark.mark_user_id)">
                </span>
                <span
                  class="cancel"
                  @click="cancel(mark.mark_user_id)">
                </span>
              </div>
            </div>
            <div class="note">{{mark.content}}</div>
          </div>
        </div>
        <div class="hint">提示：在對方個人中心點擊頭像，可以標誌對方為我的好壞名單</div>
      </div>
      <div v-transfer-dom>
        <confirm
          class="private-note"
          v-model="show"
          hide-on-blur
          theme="android">
          <div class="edit-confirm">
            <section-title
              class="edit-confirm-title"
              :title="`編輯${tabIndex === 0 ? '好' : '壞'}名單筆記`">
            </section-title>
            <div class="section-note">
              <div class="title">筆記</div>
              <div class="container">
                <x-textarea
                  v-model="note"
                  :max="50"
                  show-counter
                  class="note-textarea"
                  placeholder="請輸入您的筆記"
                >
                </x-textarea>
              </div>
            </div>
            <div class="hint">此標記只有自己可見</div>
            <div class="save-btn" @click="onConfirm">保存</div>
          </div>
          <span class="close" @click="cancelConfirm"></span>
        </confirm>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Confirm, TransferDomDirective as TransferDom, XTextarea } from 'vux'
import defaultAvatar from '@/assets/icon/icon-default-avatar.png'
import SectionTitle from '@/components/Title'
import { mapActions, mapState, mapMutations } from 'vuex'
import {smartImagePath} from '@/tools/ObjectHelper'

export default {
  directives: {
    TransferDom
  },
  components: {
    Tab,
    TabItem,
    Confirm,
    XTextarea,
    SectionTitle
  },
  data () {
    return {
      show: false,
      note: '',
      // tabIndex: 0,
      defaultAvatar,
      smartImagePath,
      marksCategory: ['WHITE', 'BLACK'],
      markUserId: '',
      isEdit: false,
      isCancel: false
    }
  },
  created () {
    // 获取私人笔记
    if (!this.marks['WHITE'].curPage) {
      this.getUserMarks({type: 'WHITE'})
    }
    if (!this.marks['BLACK'].curPage) {
      this.getUserMarks({type: 'BLACK'})
    }
  },
  methods: {
    ...mapActions({
      getUserMarks: 'getUserMarks',
      cancelMark: 'cancelMark',
      makeMarks: 'makeMarks'
    }),
    ...mapMutations({
      setMarksCurIdx: 'setMarksCurIdx'
    }),
    switchTabItem (index) {
      this.tabIndex = index
    },
    cancel (userId) {
      if (!this.isCancel) {
        this.isCancel = true
        this.cancelMark({
          userId,
          cb: () => {
            this.getUserMarks({
              type: this.marksCategory[this.tabIndex],
              cb: (data) => {
                this.isCancel = false
                this.$vux.toast.text('刪除成功', 'bottom')
              }
            })
          }
        })
      }
    },
    editNote (content, userId) {
      this.show = true
      this.note = content
      this.markUserId = userId
    },
    onConfirm () {
      if (!this.isEdit) {
        this.isEdit = true
        const type = this.marksCategory[this.tabIndex]
        this.makeMarks({
          content: this.note,
          userId: this.markUserId,
          type,
          cb: () => {
            this.getUserMarks({
              type,
              cb: (data) => {
                this.isEdit = false
                this.show = false
                this.$vux.toast.text('編輯成功', 'bottom')
              }
            })
          }
        })
      }
    },
    cancelConfirm () {
      this.show = false
    }
  },
  computed: {
    ...mapState({
      marks: state => state.user.marks
    }),
    tabIndex: {
      get () {
        return this.$store.state.user.marks.curIdx
      },
      set (index) {
        this.setMarksCurIdx(index)
      }
    }
  }
}
</script>
<style lang="less">
  @import '../../../node_modules/vux/src/styles/1px.less';
  .user-private{
    &-box{
      padding-top: 46px;
      .vux-x-input{
        padding: 0 50px 0 @pm-bg;
        margin-bottom: 10px;
        background: #FFF;
        .weui-input{
          height: 50px;
        }
      }
      .vux-tab{
        .vux-tab-bar-inner{
          background: linear-gradient(to right, @color-font-CR 50%, @color-CO 50%)
        }
        .vux-tab-item{
          background: none;
          font-size: @font-S1;
          &.vux-tab-selected{
            color: @color-font-CR;
          }
        }
      }
      .container{
        .weui-cells{
          margin-top: 10px;
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  @import '../../global.mixin.less';
  .user-private{
    height: 100%;
    text-align: left;
    line-height: 1;
    background: #FFF;
    &-box{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      height: calc(~"100% - 44px");
      background: @color-CBG;
      .container{
        position: relative;
        padding: 24px 0 50px;
        height: 100%;
        background: #FFF;
        .private-note{
          padding: 0 @pm-bg;
          height: 100%;
          overflow-y: scroll;
          .note-item{
            padding: @pm-bg 0 12px;
            .g-border-1px();
            .user-info{
              display: flex;
              align-items: center;
              justify-content: space-between;
              .info-wrapper{
                display: inline-flex;
                align-items: center;
                img{
                  margin-right: @pm-bg;
                  border-radius: 50%;
                  overflow: hidden;
                }
                .name{
                  color: @color-font-C1;
                  font-size: @font-S2;
                  font-weight: 700;
                }
              }
              .action{
                .edit{
                  display: inline-block;
                  vertical-align: middle;
                  width: 44px;
                  height: 44px;
                  background: #fff url('../../assets/icon/profile/com_list_ic_edit_normal@2x.png') 0 0 no-repeat;
                  background-size: 44px 44px;
                }
                .cancel{
                  display: inline-block;
                  vertical-align: middle;
                  width: 44px;
                  height: 44px;
                  background: #fff url('../../assets/icon/profile/com_list_ic_delete_normal@2x.png') 0 0 no-repeat;
                  background-size: 44px 44px;
                }
              }
            }
            .note{
              margin-top: 9px;
              color: @color-font-C2;
              font-size: @font-S4;
              line-height: 19px;
              word-break: break-all;
            }
            &:last-child{
              .g-border-none();
            }
          }
        }
        .hint{
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          line-height: 18px;
          padding: 17px @pm-bg;
          color: @color-font-C2;
          text-align: center;
          font-size: 12px;
          border-radius: 8px 8px 0 0;
          box-shadow: 3px 0 20px rgba(0, 0, 0, .18);
          &:before{
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
  .edit-confirm{
    text-align: left;
    &-title{
      padding: 5px 0 @pm-lg 0;
      .g-border-1px();
    }
    .section-note{
      > .title{
        color: @color-font-C1;
        font-size: 15px;
      }
      margin-top: @pm-lg;
      .note-textarea{
        padding: @pm-md;
        margin: @pm-bg 0;
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
