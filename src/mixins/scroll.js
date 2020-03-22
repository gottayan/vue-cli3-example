const scrollMixin = {
  data () {
    return {
      container: '',
      offset_key: ''
    }
  },
  methods: {
    initialContainer (container, key) {
      this.container = container
      this.offset_key = key
    }
  },
  activated () {
    const tmp = window.sessionStorage.getItem(this.offset_key)
    if (tmp) {
      const node = document.querySelector(this.container)
      node.scrollTo(0, tmp)
    }
  },
  beforeRouteLeave (to, from, next) {
    const node = document.querySelector(this.container)
    window.sessionStorage.setItem(this.offset_key, node.scrollTop)
    if (this.beforeLeaveCb && typeof this.beforeLeaveCb === 'function') {
      this.beforeLeaveCb(to, from, next)
    } else {
      next()
    }
  }
}

export default scrollMixin
