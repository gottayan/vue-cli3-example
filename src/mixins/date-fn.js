import { dateStandard } from '@/tools/datetime'
import Elapsed from 'elapsed'

const dateMixin = {
  computed: {
    pulloffTime () {
      const value = this.itemInfo.show_at
      const days = 15 - new Elapsed(new Date(dateStandard(value)), new Date()).days.num - 1
      return days > 0 ? days : 0
    }
  }
}

export default dateMixin
