<template>
  <XHeader
    :leftOptions="_leftOptions"
    :title="title"
    :transition="transition"
    :rightOptions="rightOptions"
    @on-click-back="$emit('on-click-back')"
    @on-click-title="$emit('on-click-title')"
    @on-click-more="$emit('on-click-more')"
  >
    <div slot="right">
      <slot name="right"></slot>
    </div>
    <!--<div slot>-->
      <!--<slot></slot>-->
    <!--</div>-->
    <span v-if="noHistory" slot="overwrite-left" @click.stop="close">關閉</span>
  </XHeader>
</template>

<script>
import { XHeader } from 'vux'
export default {
  components: {
    XHeader
  },

  props: {
    leftOptions: Object,
    title: String,
    transition: String,
    rightOptions: {
      type: Object,
      default () {
        return {
          showMore: false
        }
      }
    }
  },

  methods: {
    close () {
      window.opener = null
      window.open('', '_self')
      window.close()
    }
  },

  computed: {
    _leftOptions () {
      return this.noHistory ? {
        showBack: false
      } : this.leftOptions
    },

    noHistory () {
      return window.history.length === 1
    }
  }
}
</script>
