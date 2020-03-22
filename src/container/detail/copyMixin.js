import clipboard from 'clipboard-copy'

export default {
  methods: {
    copyGiverBankInfo (info) {
      const copyPromise = clipboard(info)
      copyPromise.then(res => {
        this.$vux.toast.text('複製成功', 'bottom')
      }).catch(err => {
        console.log('出錯啦', err)
        this.$vux.toast.text('複製失敗，建議您手動複製', 'bottom')
      })
    }
  }
}
