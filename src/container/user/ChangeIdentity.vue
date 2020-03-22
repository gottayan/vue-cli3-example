<template>
  <div class="user-changeIdentity-container g-smooth">
    <group>
      <cell :key="index" :title="item.title" :link="item.link" :inline-desc='item.desc' v-for="(item, index) in items">
        <img width="50" height="auto" slot="icon" :src="item.icon" alt="icon">
      </cell>
    </group>
  </div>
</template>

<script>
import icFirm from '@/assets/icon/profile/profile_data_ic_firm@2x.png'
import icLoveMember from '@/assets/icon/profile/profile_data_ic_lovemember@2x.png'
import icBenefit from '@/assets/icon/profile/profile_data_ic_benefit@2x.png'
import icSchool from '@/assets/icon/profile/profile_data_ic_school@2x.png'
import icOffice from '@/assets/icon/profile/profile_data_ic_office@2x.png'
import { Group, Cell } from 'vux'

export default {
  components: {
    Group,
    Cell
  },
  data () {
    return {
      items: [{
        icon: icFirm,
        title: '企業行號',
        link: `/firmIdentity/${this.$route.params.hash}`,
        desc: '政府立案、合法經營之企業行號'
      }, {
        icon: icLoveMember,
        title: '關懷會員',
        link: `/loveMemIdentity/${this.$route.params.hash}`,
        desc: '持有中低收入、低收入戶、殘障手冊等證明者'
      }, {
        icon: icBenefit,
        title: '公益團體',
        link: `/BenefitIdentity/${this.$route.params.hash}`,
        desc: '於政府立案登記之公益團體、機構等'
      }, {
        icon: icSchool,
        title: '學校單位',
        link: `/schoolIdentity/${this.$route.params.hash}`,
        desc: '幼稚園、國小、國中、高中職、大專院校等教育機構'
      }, {
        icon: icOffice,
        title: '政府機關',
        link: `/officeIdentity/${this.$route.params.hash}`,
        desc: '地方或中央政府所屬單位'
      }]
    }
  }
}
</script>
<style lang="less">
  .user-changeIdentity-container{
    .weui-cells{
      margin-top: 0;
      padding: 0 @pm-bg;
      line-height: 1;
      .weui-cell{
        padding: 30px 0;
        &:before{
          left: 0;
        }
        .weui-cell__hd{
          img{
            display: block;
            margin-right: @pm-bg;
          }
        }
        .vux-cell-bd{
          .vux-label{
            color: @color-font-C1;
            font-size: @font-S2;
          }
          .vux-label-desc{
            display: block;
            margin-top: 5px;
            color: @color-font-C2;
            font-size: @font-S4;
            line-height: 18px;
          }
        }
        .weui-cell__ft{
          padding-right: 20px;
          color: @color-font-C2;
          font-size: @font-S3;
          &:after{
            content: " ";
            display: inline-block;
            margin-top: -7px;
            width: 8px;
            height: 13px;
            border-width: 0;
            background: #fff url('../../assets/icon/com_list_pic_arrow@2x.png') center center no-repeat;
            background-size: 8px 13px;
            transform: none;
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .user-changeIdentity-container{
    height: 100%;
    overflow-y: scroll;
  }
</style>
