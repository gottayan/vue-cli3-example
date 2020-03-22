<template>
  <div class="ship-sn" v-show="isShow">
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
      type: String
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
  .ship-sn{
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    padding: @pm-bg;
    color: #FFF;
    font-size: @font-S3;
    background: rgba(0, 0, 0, .6);
    .title{
      margin-top: 30px;
      text-align: center;
    }
    .image{
      margin: 50px 0;
    }
    .tip-2{
      margin-top: @pm-bg;
    }
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
