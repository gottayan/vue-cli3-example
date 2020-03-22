<template>
  <div class="deals-donate">
    <div class="title-wrapper">
      <div class="g-title">我的贈送</div>
      <span
        @click="() => this.$router.push('/dealsDonate')"
        class="all"
      >
        全部
      </span>
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
import icAccept from '@/assets/icon/deals/profile_ic_accept_normal@2x.png'
import icAffirm from '@/assets/icon/deals/profile_ic_affirm_normal@2x.png'
import icSend from '@/assets/icon/deals/profile_ic_send_normal@2x.png'
import icOpposite from '@/assets/icon/deals/profile_ic_opposite_normal@2x.png'
import icMerge from '@/assets/img/merge/profile_ic_merge_normal@2x.png'
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
          link: '/dealsDonate/init',
          label: '待決定',
          icon: icAccept,
          num: 0,
          id: 'init_total'
        },
        {
          link: '/dealsDonate/remitting',
          label: '待收款',
          icon: icAffirm,
          num: 0,
          id: 'remitting_total'
        }, {
          link: '/dealsDonate/remitted',
          label: '待寄出',
          icon: icSend,
          num: 0,
          id: 'remitted_total'
        }, {
          link: '/merge/request',
          label: '合併寄送',
          icon: icMerge,
          num: 0,
          id: 'merge_list_total'
        }, {
          link: '/dealsDonate/sent',
          label: '待對方收件',
          icon: icOpposite,
          num: 0,
          id: 'sent_total'
        }
      ]
    }
  },
  created () {
    this.getDealsCategory()
  },
  methods: {
    ...mapActions({
      getDealsCategory: 'getDealsCategory'
    })
  },
  computed: {
    ...mapState({
      needDonate: state => state.deals.category.need_donate
    }),
    category () {
      const categories = this.statuses.map(item => {
        return {
          ...item,
          num: this.needDonate[item.id]
        }
      })
      return categories
    }
  }
}
</script>

<style lang="less">
  .deals-donate{
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
  .deals-donate{
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
