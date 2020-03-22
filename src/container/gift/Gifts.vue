<template>
  <div class="gifts" >
    <div class="mask" v-if="giftShow">
      <demandtrip @demandHidden="demandHidden" v-if="giftShow"></demandtrip>
    </div>
    <pool pool-type="gift" :sort="sort">
    </pool>
    <Release></Release>
  </div>
</template>
<script>
import Pool from '@/components/Pool'
import Release from '@/components/Release'
import scrollMixin from '@/mixins/scroll'
import demandtrip from '../userGuide/demandTrip'
export default {
  mixins: [scrollMixin],
  components: {
    Pool,
    Release,
    demandtrip
  },
  data () {
    return {
      giftShow: false,
      sort: ''
    }
  },
  methods: {
    demandHidden (demandHidden) {
      this.demandHidden = demandHidden
    }
  },
  created () {
    this.sort = this.$route.query.sort
    this.initialContainer('.container', 'GIFT_OFFSET')
    setTimeout(() => {
      this.giftShow = this.$route.query.guide
    }, 4000)
  }
}
</script>
<style lang="less" scoped>
  .gifts{
    height: 100%;
  }
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    // z-index: 1;
  }
</style>
