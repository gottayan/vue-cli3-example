<template>
  <ul class="functions">
    <li class="item">
      <button class="g-button orange"
              @click="toggleModal">寄送資訊</button>
    </li>
    <li class="item" >
      <button class="g-button gray" disabled>
        {{notObtained ? "未获赠" : "已取消"}}
      </button>
    </li>
  </ul>
</template>
<script>
/**
 * step #80, 已取消贈送
 */
export default {
  props: {
    toggleModal: {
      type: Function,
      default: () => { console.log('查看咨询') }
    },
    notObtained: {
      type: Boolean,
      default: false
    }
  }
}
</script>
