<template>
  <div class="image-enlarge" v-show="isShow">
    <icon @click.native="toggleShow" class="cancel-btn" type="cancel">
    </icon>
    <img :src="image" class="image" width="100%" height="auto" alt="image">
  </div>
</template>

<script>
import {Icon} from 'vux'
export default {
  components: {
    Icon
  },
  props: {
    image: {
      type: String,
      required: true
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    toggleShow () {
      this.$emit('toggleShow')
    }
  }
}
</script>

<style lang="less" scoped>
  .image-enlarge{
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, .6);
    .cancel-btn{
      position: absolute;
      top: @pm-bg;
      right: @pm-bg;
      &:before{
        margin: 0;
      }
    }
  }
</style>
