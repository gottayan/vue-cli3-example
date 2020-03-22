<template>
  <div class="oops">
    <img class="pic" :src="pic" width="150" height="auto" alt="圖片">
    <p class="desc">{{text}}</p>
  </div>
</template>

<script>
import iconNoGift from '@/assets/icon/com_pic_empty_gift@2x.png'
import iconNoNeed from '@/assets/icon/com_pic_empty_demand@2x.png'
import iconTraceUser from '@/assets/icon/com_pic_empty_vip@2x.png'
import iconChat from '@/assets/icon/com_pic_empty_news@2x.png'

export default {
  props: {
    oopType: {
      type: String,
      default: 'gift'
    }
  },
  data () {
    return {
    }
  },
  computed: {
    pic () {
      let icon = ''
      switch (this.oopType) {
        case 'gift': icon = iconNoGift; break
        case 'need':
        case 'needDonate': icon = iconNoNeed; break
        case 'member':
        case 'traceUser': icon = iconTraceUser; break
        case 'thanks': icon = iconChat; break
      }
      return icon
    },
    text () {
      let text = ''
      switch (this.oopType) {
        case 'gift': text = '目前還沒有任何禮物哦！'; break
        case 'need':
        case 'needDonate': text = '目前還沒有任何需求哦！'; break
        case 'traceUser': text = '目前還沒有追蹤的會員哦！'; break
        case 'thanks': text = '還未收到過感謝/送出過感謝哦！'; break
        case 'member': text = '目前還沒有任何會員哦！'; break
      }
      return text
    }
  }
}
</script>

<style lang="less" scoped>
  .oops{
    color: @color-font-C2;
    font-size: @font-S3;
    line-height: 1;
    text-align: center;
    .desc{
      margin-top: @pm-bg;
    }
  }
</style>
