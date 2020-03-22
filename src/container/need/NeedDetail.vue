<template>
  <div class="need-detail g-smooth">
    <item item-type="need">
    </item>
  </div>
</template>

<script>
import Item from '@/components/ItemNeed'
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
  .need-detail{
    overflow-y: scroll;
    height: 100%;
  }
</style>
