const goTopMixin = {
  methods: {
    goTop (rate = 4) {
      const doc = document.body.scrollTop ? document.body : document.documentElement
      let scrollTop = doc.scrollTop
      const top = function () {
        scrollTop = scrollTop + (0 - scrollTop) / (rate || 2)
        if (scrollTop < 1) {
          doc.scrollTop = 0
          return
        }
        doc.scrollTop = scrollTop
        requestAnimationFrame(top)
      }
      top()
    }
  }
}

export default goTopMixin
