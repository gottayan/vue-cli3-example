<template>
  <div class="nc-container">
    <x-header :title="$route.meta.title"></x-header>
    <div class="nc-content-wrapper">
      <div class="nc-tip-wrapper">
        <x-icon type="ios-information" size="30"></x-icon>
        <span class="g-desc">
          該功能僅適用于「公益團體」及「政府機構」，用於團體或機構聯絡人發生變更時更新資訊，申請送出后，我們會有專人盡快聯繫您
        </span>
      </div>
      <group>
        <datetime
          title="交接時間"
          v-model="info.time"
          :start-date="startTime"
          confirm-text="確定"
          format="YYYY/MM/DD"
          required
        ></datetime>
        <x-input
          title="接替人姓名"
          text-align="right"
          v-model="info.name"
          required></x-input>
        <x-input
          title="市話"
          text-align="right"
          v-model="info.phone"
          required type="number"></x-input>
        <x-input
          title="手機號碼"
          text-align="right"
          :max="10"
          v-model="info.cellphone"
          type="number"></x-input>
        <x-input
          title="郵箱"
          text-align="right"
          v-model="info.email"
          type="email"
          is-type="email"></x-input>
      </group>
      <button class="g-button red btn-sumbit" @click="handleSubmit">確認送出</button>
    </div>
  </div>
</template>

<script>
import { Group, Datetime } from 'vux'
import format from 'date-fns/format'
import addDays from 'date-fns/add_days'
// import { format, add_days as addDays } from 'date-fns'
const tomorrow = format(addDays(new Date(), 1), 'YYYY/MM/DD')
export default {
  name: 'NewConnect',
  components: {
    Group,
    Datetime
  },
  data () {
    return {
      startTime: tomorrow,
      info: {
        time: tomorrow,
        name: '',
        phone: '',
        cellphone: '',
        email: ''
      }
    }
  },
  methods: {
    handleSubmit () {
      if (!this.info.name) {
        return this.$vux.toast.text('請填寫交接人名稱', 'bottom')
      }
      if (!this.info.phone) {
        return this.$vux.toast.text('請填寫交接人聯絡電話', 'bottom')
      }

      const data = {
        transfer_time: this.info.time,
        replacement: this.info.name,
        phone: this.info.phone,
        cell_phone: this.info.cellphone,
        email: this.info.email
      }

      this.$store.dispatch('updateConnect', {
        data,
        cb: this.cb
      })
    },
    cb (data) {
      if (!data.error) {
        this.$vux.toast.text('成功送出申請，我們會安排專人盡快與您聯繫', 'bottom')
        this.info = {
          time: tomorrow,
          name: '',
          phone: '',
          cellphone: '',
          email: ''
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.nc-container{
  .nc-tip-wrapper{
    padding: 0 15px;
    margin-top: 20px;
    display: flex;
    align-items: flex-start;

    svg{
      fill: #0fa5ff;
      margin-right: 10px;
    }
  }
  .btn-sumbit{
    display: block;
    margin: 20px auto;
    width: 95%;
  }
}
</style>
