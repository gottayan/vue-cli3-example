// 适用于全家以及掌柜重写的三级联动
// 主要为三级联动第三栏展示更多信息
const moreInfoPickerMixin = {
  methods: {
    toggleMoreInfo () {
      const node = document.querySelector('#app')
      node.classList.toggle('g-picker__moreinfo')
    }
  }
}

export default moreInfoPickerMixin
