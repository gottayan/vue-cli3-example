const redirectMixin = {
  methods: {
    redirectLogin (redirectUrl) {
      if (!localStorage.getItem('KEY_USER_TOKEN')) {
        return this.$router.replace(`/login?redirect=${redirectUrl}`)
      }
    }
  }
}

export default redirectMixin
