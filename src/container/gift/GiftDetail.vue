<template>
  <div class="gift-detail g-smooth">
    <item>
    </item>
  </div>
</template>

<script>
import Item from '@/components/ItemGift'
export default {
  components: {
    Item
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
  .gift-detail{
    overflow-y: scroll;
    height: 100%;
  }
</style>
