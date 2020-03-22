const goBackMixin = {
  methods: {
    goBack () {
      console.log('will excute goback-mixin goback method')
      if (!document.referrer) {
        this.$router.push('/')
      } else {
        this.$router.go(-1)
      }
    }
  }
}

export default goBackMixin
