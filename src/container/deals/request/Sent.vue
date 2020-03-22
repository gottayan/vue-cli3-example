<template>
  <Status status="sent" />
</template>

<script>
import Status from './status'
import anchorMixin from '@/mixins/anchor'

export default {
  mixins: [anchorMixin],
  components: {
    Status
  },
  activated () {
    this.initAnchor('requestStatusPanel')
  }
}
</script>
