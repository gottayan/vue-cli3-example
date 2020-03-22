<template>
  <div class="deals-req">
    <div class="title-wrapper">
      <div class="g-title">我的索取</div>
      <span
        @click="() => this.$router.push('/dealsReq')"
        class="all"
      >全部</span>
    </div>
    <div class="container">
      <grid
        :show-lr-borders="false"
        :show-vertical-dividers="false"
      >
        <grid-item
          :key="index"
          :link="status.link"
          :label="status.label"
          v-for="(status, index) in category"
        >
          <img
            width="50"
            height="50"
            slot="icon"
            :src="status.icon"
          >
          <span
            v-if="status.num"
            class="grid-num"
          >
            {{status.num}}
          </span>
        </grid-item>
      </grid>
    </div>
  </div>
</template>

<script>
import { Grid, GridItem } from 'vux'
import icAskFor from '@/assets/icon/deals/profile_ic_askfor_normal@2x.png'
import icFreight from '@/assets/icon/deals/profile_ic_freight_normal@2x.png'
import icOpposite from '@/assets/icon/deals/profile_ic_opposite_normal@2x.png'
import icShipments from '@/assets/icon/deals/profile_ic_shipments_normal@2x.png'
import icThanks from '@/assets/icon/deals/profile_ic_thanks_normal@2x.png'
import {mapState, mapActions} from 'vuex'

export default {
  components: {
    Grid,
    GridItem
  },
  data () {
    return {
      statuses: [
        {
          link: '/dealsReq/requesting',
          label: '索取中',
          icon: icAskFor,
          num: 0,
          id: 'requesting_total'
        },
        {
          link: '/dealsReq/remitting',
          label: '待匯運費',
          icon: icFreight,
          num: 0,
          id: 'remitting_total'
        }, {
          link: '/dealsReq/remitted',
          label: '寄送中',
          icon: icShipments,
          num: 0,
          id: 'remitted_total'
        }, {
          link: '/dealsReq/sent',
          label: '待收件',
          icon: icOpposite,
          num: 0,
          id: 'sent_total'
        }, {
          link: '/dealsReq/finished',
          label: '待感謝',
          icon: icThanks,
          num: 0,
          id: 'finished_total'
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      getDealsCategory: 'getDealsCategory'
    })
  },
  computed: {
    ...mapState({
      giftRequest: state => state.deals.category.gift_request
    }),
    category () {
      const categories = this.statuses.map(item => {
        return {
          ...item,
          num: this.giftRequest[item.id]
        }
      })
      return categories
    }
  }
}
</script>

<style lang="less">
  .deals-req{
    .weui-grids{
      padding: 24px 0;
      &:before, &:after{
        display: none;
      }
      .weui-grid{
        position: relative;
        padding: 0;
        &:before, &:after{
          border: none;
        }
        .weui-grid__label{
          margin-top: @pm-bg;
          color: @color-font-C1;
          font-size: @font-S4;
        }
        .grid-num{
          position: absolute;
          top: -6px;
          right: 11px;
          width: 18px;
          height: 18px;
          line-height: 18px;
          color: #FFF;
          font-size: 10px;
          text-align: center;
          border-radius: 50%;
          border: 1px solid #FFF;
          background: @color-CR;
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .deals-req{
    .title-wrapper{
      display: flex;
      justify-content: space-between;
      margin: 24px 0 0 0;
      .all{
        display: block;
        padding-right: 18px;
        color: @color-font-C2;
        font-size: @font-S3;
        height: 27px;
        line-height: 27px;
        background: #fff url('../../assets/icon/message/com_list_pic_arrow-right.png') right center no-repeat;
        background-size: 8px 13px;
      }
    }
    .container{
      border-bottom: 1px solid@color-CL;
    }
  }
</style>
