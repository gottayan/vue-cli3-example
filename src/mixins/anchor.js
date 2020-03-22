/**
 * 在initAnchor方法传入容器id
 */
const anchorMixin = {
  data () {
    return {
      container: ''
    }
  },
  beforeRouteLeave (to, from, next) {
    const ele = document.getElementById(this.container)
    const eleScroll = ele && ele.scrollTop
    this.$route.meta.scrollY = eleScroll
    next()
  },
  methods: {
    /**
     * @param {string} container scroll容器id
     */
    initAnchor (container) {
      this.container = container
      const scrollY = this.$route.meta.scrollY
      const ele = document.getElementById(container)
      if (scrollY && ele) {
        ele.scrollTo(0, scrollY)
      }
    },
    handleUserRouteHash (cb) {
      if (this.$route.meta.userHash === this.$route.params.hash) {
        typeof cb === 'function' && cb()
        return false
      }
      this.$route.meta.userHash = this.$route.params.hash
      return true
    }
  }
}

export default anchorMixin
