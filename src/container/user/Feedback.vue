<template>
  <div class="fb-container-new">
    <x-header title="用戶反饋">
    </x-header>
    <div class="content g-smooth">
      <section class="fb-step-first" v-if="!step">
        <section class="fb-menu-panel">
          <span style="line-height: 2">請選擇您的反饋類型：</span>
          <ul class="fb-menu">
            <li
              v-for="(item, index) in feedBackList"
              :key="index"
              :class="`fb-menu-item ${index === activeIndex ? 'active' : ''}`"
              @click="selectType(index, item)">
              {{item.label}}
            </li>
          </ul>
        </section>
        <section>
          <img-upload
            type="chat"
            :imgloaded="imgloaded"
            :removeImg="removeImg"
            :isLoaded="isImgLoaded"
            :imgList="imgLists"
            :multiple="true"
            :maxLength="3"
            @upLoading="upLoadingImg"
          >
          </img-upload>
        </section>
        <section>
          <group>
            <x-textarea
              ref="textarea"
              v-model="content"
              :rows="6"
              :max="500"
              autosize
              :aria-placeholder="placeholder"
              :placeholder="placeholder">
            </x-textarea>
            <x-input
              required
              type="email"
              title="聯繫方式"
              placeholder="請填寫聯繫方式"
              :should-toast-error="false"
              @on-click-error-icon="handleError"
              v-model="email">
            </x-input>
          </group>
        </section>
        <button class="g-button red"
                style="margin-top: 20px"
                @click="hanldeSendFeedBack">
          送出
        </button>
      </section>
      <section v-else class="fb-step-second">
        <result-page
          :menus="[{
          text: '好，我知道了',
          func: () => {
            this.$router.go(-1)
          },
          type: 'primary'
        }]"
          title="您的訊息已成功傳送至客服中心"
          desc="客服人員將在 2-5 個工作日內回覆至您的信箱，謝謝！"
        >
        </result-page>
      </section>
    </div>
  </div>
</template>

<script>
import ImgUpload from '@/components/ImgUpload'
import ResultPage from '@/components/ResultPage'
import { isEmail } from './../../tools/strMap'
import { XTextarea, Group, XInput } from 'vux'
import { feedBackList } from '../../tools/constant'

export default {
  components: {
    XTextarea,
    Group,
    XInput,
    ImgUpload,
    ResultPage
  },
  data () {
    return {
      step: 0,
      isImgLoaded: false,
      imgLists: [],
      content: '',
      type: feedBackList[0].label,
      activeIndex: 0,
      feedBackList,
      email: this.$store.state.user.userInfo.email,
      placeholder: '想和我們說什麼嗎？請儘可能詳細描述您所遇到的問題或建議，若回報使用問題，請提供您的設備資訊、截圖畫面，以便客服人員能更準確即時地提供支援。'
    }
  },
  methods: {
    // 上传图片
    upLoadingImg () {
      this.isImgLoaded = true
    },
    imgloaded (data) {
      this.imgLists = [
        ...this.imgLists,
        ...data
      ]
      this.isImgLoaded = false
    },
    removeImg (index) {
      this.imgLists = this.imgLists.filter((item, idx) => idx !== index)
    },
    selectType (index, item) {
      console.log(index, item)
      this.activeIndex = index
      this.type = item.label

      if (index === 1) {
        const _this = this
        this.$vux.confirm.show({
          content: '點擊『確認』查看常見問題',
          title: '提示',
          confirmText: '確認',
          theme: _this.$store.state.configs.mobileType,
          onCancel () {
            console.log('取消了查看常見問題')
          },
          onConfirm () {
            _this.$router.push('/faq')
          }
        })
      }
    },
    handleError () {
      this.$vux.toast.text('請填寫正確郵箱地址', 'bottom')
    },
    resetFeedBack () {
      this.email = this.$store.state.user.userInfo.email || ''
      this.imgLists = []
      this.content = ''
      this.type = feedBackList[0].label
      this.activeIndex = 0
    },
    hanldeSendFeedBack () {
      if (!this.content.trim()) {
        return this.$vux.toast.text('請填寫反饋內容', 'bottom')
      } else if (!this.email.trim()) {
        return this.$vux.toast.text('請填寫郵箱地址', 'bottom')
      } else if (!isEmail(this.email)) {
        return this.handleError()
      }
      const data = {
        email: this.email,
        feedback_images: this.imgLists.length ? this.imgLists.map(item => ({path: item.url})) : [],
        image_path: '',
        content: this.content,
        subject: this.type,
        ua: window.navigator.userAgent
      }
      const cb = this.handleSendCallBack
      this.$store.dispatch('sendFeedBack', {data, cb})
    },
    handleSendCallBack (data) {
      if (data.message === 'success') {
        this.resetFeedBack()
        this.step = 1
      } else {
        console.log('something error in feedback', data)
        this.$vux.toast.text('反饋失敗，請檢查反饋內容和聯繫方式，或稍後再試')
      }
    }
  },
  mounted () {
    this.$refs.textarea.focus()
  }
}
</script>

<style lang="less" scoped>
  .fb-container-new{
    display: flex;
    flex-direction: column;
    height: 100%;
    .content{
      height: calc(~"100% - 44px");
      overflow-y: scroll;
    }
  }

  .fb-menu-panel{
    margin-top: 20px;
  }
  .fb-menu{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
    border: 1px solid #eee;
    border-right-color: transparent;
    border-bottom-color: transparent;
  }
  .fb-menu-item{
    width: 50%;
    border-bottom: 1px solid #eee;
    border-right: 1px solid #eee;
    box-sizing: border-box;
    background-color: white;
    line-height: 60px;
    transition: all .15s ease-out;
    text-align: center;
    color: #424242;

    &:nth-of-type(1),
    &:nth-of-type(2),
    &:nth-of-type(3){
      border-bottom: 1px solid #eee;
    }
    &:hover{
      box-shadow: none;
    }
    &.active{
      box-shadow: inset 0 0 28px rgba(0,0,0,.08);
    }
  }

  .fb-step-first{
    padding: 0 15px;
  }

  .fb-step-second{
    height: 100%;
  }
</style>
