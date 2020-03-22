<template>
  <x-dialog
    :show="showDialog"
    class="dialog-demo"
    hide-on-blur
    :dialog-style="{
      'overflow-y': 'auto',
      'max-height': '300px'
    }">
    <div>
      <div class="header">
        <div>貨物追蹤</div>
        <div>單號：{{sn}}</div>
      </div>
      <div class="no-track" v-if="loading">
        <inline-loading />
        <span class="txt">查詢中...</span>
      </div>
      <timeline class="content" v-else-if="trackings.length">
        <timeline-item v-for="(item, index) in trackings" :key="index">
          <div :class="[index === 0 ? 'recent' : 'pass']">{{item.status}}</div>
          <div :class="[index === 0 ? 'recent' : 'pass']">{{item.time}}</div>
        </timeline-item>
      </timeline>
      <div class="no-track" v-else>暫無追蹤信息</div>
    </div>
    <div @click="$emit('close')" class="btn-close">
      <x-icon type="ios-close-empty" size="30"></x-icon>
    </div>
  </x-dialog>
</template>

<script>
import { XDialog, Timeline, TimelineItem, InlineLoading } from 'vux'
import loveboxApi from '@/store/apis/lovebox'

export default {
  components: {
    XDialog,
    Timeline,
    TimelineItem,
    InlineLoading
  },

  props: {
    sn: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      showDialog: false,
      loading: false,
      trackings: []
    }
  },
  watch: {
    sn: function (val) {
      if (!val) {
        this.trackings = []
        return
      }
      if (val !== '') {
        this.loading = true
        loveboxApi.getTrackingInfo(this.sn, 'hct')
          .then(data => {
            this.trackings = data.trackings
            this.loading = false
          })
          .catch(err => {
            console.log(err)
            this.loading = false
          })
      }
    },
    show: function (val) {
      this.showDialog = val
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  padding: 10px 0;
  color: @color-font-C1;
}
.content {
  max-height: 400px;
  overflow-y: auto;
  overflow-scrolling: touch;
  -webkit-overflow-scrolling: touch;
}

.no-track {
  padding: 50px 0;
  color: @color-font-C3;
}
.recent {
  text-align: left;
  color: @theme-color;
}

.pass {
  text-align: left;
  color: @color-font-C3;
}

.btn-close {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
