<template>
  <div class="needs">
    <div class="mask" v-if="needShow">
      <needtips></needtips>
    </div>
    <pool pool-type="need">
    </pool>
    <Release></Release>
  </div>
</template>

<script>
import Pool from '@/components/Pool'
import Release from '@/components/Release'
import scrollMixin from '@/mixins/scroll'
import needtips from '../userGuide/needTips'
// import { setTimeout } from 'timers';
export default {
  mixins: [scrollMixin],
  components: {
    Pool,
    Release,
    needtips
  },
  data () {
    return {
      needShow: false
    }
  },
  mounted () {
    this.initialContainer('.container', 'NEED_OFFSET')
    setTimeout(() => {
      this.needShow = this.$route.query.guide
    }, 4000)
  }
}
</script>
<style lang="less" scoped>
  .needs {
    height: 100%;
  }
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 999;
  }
</style>
