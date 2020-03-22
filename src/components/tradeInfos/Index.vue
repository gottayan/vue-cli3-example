<template>
  <div class="modal-content">
    <header class="header">
      <span class="g-title">
        寄送資訊
      </span>
      <button class="btn-close" @click="toggleModal">
        <img src="./../../assets/icon/message/icon-times.png" alt="" class="src">
      </button>
    </header>
    <FamiInfo
      :deal="deal"
      :iAmOwner="iAmOwner"
      v-if="deal.shipway === Shipways.SHIPWAY_FAMI">
    </FamiInfo>
    <MeetInfo
      :deal="deal"
      :iAmOwner="iAmOwner"
      v-if="deal.shipway === Shipways.SHIPWAY_MEET">
    </MeetInfo>
    <HCTInfo
      :deal="deal"
      :iAmOwner="iAmOwner"
      v-if="deal.shipway === Shipways.SHIPWAY_HCT">
    </HCTInfo>
    <OthersInfo
      :deal="deal"
      :iAmOwner="iAmOwner"
      v-if="deal.shipway === Shipways.SHIPWAY_OTHERS">
    </OthersInfo>
    <HomengInfo
      :deal="deal"
      :iAmOwner="iAmOwner"
      v-if="deal.shipway === Shipways.SHIPWAY_HOMENG">
    </HomengInfo>
    <PalmBoxInfo
      :deal="deal"
      :iAmOwner="iAmOwner"
      v-if="deal.shipway === Shipways.SHIPWAY_PALMBOX"
    >
    </PalmBoxInfo>
  </div>
</template>
<script>
import { Shipways } from '../../tools/constant'
import FamiInfo from '../../components/tradeInfos/FamiInfo'
import MeetInfo from '../../components/tradeInfos/MeetInfo'
import HCTInfo from '../../components/tradeInfos/HCTInfo'
import OthersInfo from '../../components/tradeInfos/OthersInfo'
import HomengInfo from '../../components/tradeInfos/HomengInfo'
import PalmBoxInfo from '../../components/tradeInfos/PalmBoxInfo'
export default {
  components: {
    FamiInfo,
    MeetInfo,
    HCTInfo,
    OthersInfo,
    HomengInfo,
    PalmBoxInfo
  },
  data () {
    return {
      Shipways
    }
  },
  props: {
    deal: {
      type: Object,
      required: true
    },
    iAmOwner: {
      type: Boolean
    },
    toggleModal: {
      type: Function
    }
  }
}
</script>
