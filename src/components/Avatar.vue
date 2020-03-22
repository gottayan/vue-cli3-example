<template>
  <div class="avatar-container"></div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    hash: {
      type: [String, Number],
      required: true
    },
    pic: {
      type: String
    },
    name: {
      type: String,
      default: '匿名'
    },
    size: {
      type: [String, Number]
    },
    isRound: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="less" scoped>
  .avatar-container{

  }

  .round{
    border-radius: 50%;
  }
</style>
