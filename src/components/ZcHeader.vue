<template>
  <sticky v-if="isFixed">
    <x-header
      :title="title"
    ></x-header>
  </sticky>
  <x-header
    v-else
    :title="title"
  ></x-header>
</template>

<script>
import { Sticky } from 'vux'

export default {
  components: {
    Sticky
  },
  data () {
    return {}
  },
  props: {
    title: {
      type: String
    },
    isFixed: {
      type: Boolean,
      default: false
    },
    offsetTop: {
      type: [Number, String],
      default: 0
    }
  }
}
</script>

<style lang="less" scoped>

</style>
