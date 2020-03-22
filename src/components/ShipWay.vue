<template>
  <div class="shipWay">
    <div class="ship">
      <section-title title="選擇寄送方式">
      </section-title>
      <div class="wrapper" :key="index" v-for="(shipWay, index) in shipWays">
        <div  class="ship-item vux-1px">
          <icon @click.native="selectShipWay(index)" class="icon" :type="mode.bundle[index].isSelected ? 'success' : 'circle'">
          </icon>
          <span class="way-name">{{shipWay.way}}</span>
          <span @click="showInfo(index)" :class="['triangle', mode.bundle[index].isShowInfo ? 'selected' : '']"></span>
        </div>
        <div v-if="mode.bundle[index].isShowInfo" class="info">
          <div v-if="shipWay.key !== 'homeng'" class="hint">
            <span v-html="shipWay.hint"></span>
            <a v-if="shipWay.key === 'fami'" target="_blank" :style="{color: '#e25443'}" href="https://www.give543.com/static/famiport/index.html">如何使用？</a>
            <a v-if="shipWay.key === 'hct'" target="_blank" :style="{color: '#e25443'}" href="https://www.give543.com/static/hct/543hct.html">如何使用？</a>
            <router-link v-if="shipWay.key === 'palmbox'" target="_blank" rel="noopener" to="/nearbyPalmBox" :style="{color: '#e25443', marginRight: '10px'}">查看我附近的掌櫃</router-link>
            <router-link
              v-if="shipWay.key === 'palmbox'"
              :to="`/palmboxusage${type === 'gift' ? '?step=donate' : ''}`"
              target="_blank"
              :style="{color: '#e25443'}">如何使用掌櫃</router-link>

          </div>
          <div v-else class="hint">
            賀盟物流運費請參考
            <a target="_blank" :style="{color: '#e25443'}" href="https://www.give543.com/static/homeng/homeng_charge.jpg">運費價目表</a>，
            <a target="_blank" :style="{color: '#e25443'}" href="https://www.give543.com/static/homeng/remote_charge.jpg">偏遠地區加價表</a>後自行填入總運費。
            <a target="_blank" :style="{color: '#e25443'}" href="https://www.give543.com/static/homeng/index.html">如何使用？</a>
          </div>
        <div v-if="shipWay.key !== 'meet'" class="fare-way">
            <div class="title">誰付運費?</div>
            <zc-radio
              class="ship-way-radio"
              :radioList="shipWay.radios"
              v-model="mode.bundle[index].fareWay"
            />
          </div>
          <div class="fare" v-if="shipWay.key !== 'meet'">
            <!--绑定v-model初始值触发两次watch-->
            <x-input
              v-if="isFareReadOnly(shipWay.key)"
              title="運費"
              type="number"
              :readonly="isFareReadOnly(shipWay.key)"
              text-align="right"
              :value="mode.bundle[index].fare"
              :placeholder="shipWay.farePlaceHolder"
            >
            </x-input>
            <x-input
              v-else
              title="運費"
              type="number"
              text-align="right"
              v-model="mode.bundle[index].fare"
              :placeholder="shipWay.farePlaceHolder"
            >
            </x-input>
          </div>
          <div v-if="shipWay.key === 'palmbox' && type === 'need'" class="">
            <div class="shipway-item-title">選擇掌櫃櫃機</div>
            <group class="no-margin">
              <palm-box-select
                :handleChange="handlePalmBoxChange"
                :value="mode.palmboxInfo"
              ></palm-box-select>
            </group>
          </div>
          <div v-if="shipWay.key === 'meet'" class="address">
            <popup-picker
              :title="$route.path.includes('gift') ? '物品所在地' : '需求所在市區'"
              :data="areaMapLists"
              :columns="3"
              v-model="mode.area"
            />
            <x-input
              :title="$route.path.includes('gift') ? '暫定面交地址' : '需求地址'"
              type="text"
              text-align="right"
              placeholder="請輸入詳細地址"
              v-model="mode.location"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Group, XInput, PopupPicker, Icon } from 'vux'
import SectionTitle from '@/components/Title'
import ZcRadio from '@/components/ZcRadio'
import {mapGeo} from '@/tools/strMap'
import {shipWays} from '@/tools/constant'
import { mapState, mapActions } from 'vuex'
import PalmBoxSelect from '@/components/PalmBoxSelect'

export default {
  props: {
    initShipWay: {
      type: Array,
      default: () => ([])
    },
    type: {
      type: String,
      required: true
    }
  },
  components: {
    SectionTitle,
    ZcRadio,
    Group,
    XInput,
    PopupPicker,
    Icon,
    PalmBoxSelect
  },
  data () {
    return {
      areaMapLists: [],
      shipWays,
      mode: {
        bundle: [{
          isSelected: false,
          isShowInfo: false,
          fareWay: 'pod',
          fare: 45,
          key: 'palmbox'
        }, {
          isSelected: false,
          isShowInfo: false,
          fareWay: 'receiver',
          fare: 60,
          key: 'fami'
        }, {
          isSelected: false,
          isShowInfo: false,
          fareWay: 'pod',
          fare: 150,
          key: 'hct'
        }, {
          isSelected: false,
          isShowInfo: false,
          fareWay: 'receiver',
          fare: '',
          key: 'others'
        }, {
          isSelected: false,
          isShowInfo: false,
          fareWay: 'pod',
          fare: '',
          key: 'meet'
        }, {
          isSelected: false,
          isShowInfo: false,
          fareWay: 'pod',
          fare: '',
          key: 'homeng'
        }],
        area: [],
        location: '',
        palmboxInfo: ['', '', '']
      }
    }
  },
  created () {
    if (this.initShipWay.length) {
      this.updateShipWay(this.initShipWay)
    }
    this.getGeoConfig({cb: this.getGeoConfigCb})
    if (localStorage.getItem('KEY_USER_TOKEN') && !this.userInfo.id) {
      return this.getLoginUserInfo({cb: this.getLoginUserInfoCb})
    }
    this.getLoginUserInfoCb()
  },
  methods: {
    ...mapActions({
      getGeoConfig: 'getGeoConfig',
      getLoginUserInfo: 'getLoginUserInfo'
    }),
    handlePalmBoxChange (value) {
      // const tmp = this.palmBoxPickerData[0].find(item => item.name === value[0])
      // this.mode.palmboxInfo.edcode = tmp
      this.mode.palmboxInfo = value
    },
    // beforeGetPalmBox (closeType) {
    //   if (closeType) {
    //     this.mode.palmboxInfo.edcode = {}
    //     this.mode.palmboxInfo.name = []
    //     this.getPalmBox({
    //       city: this.mode.palmboxInfo.area[0],
    //       area: this.mode.palmboxInfo.area[1],
    //       cb: () => {
    //         console.log('end')
    //       }
    //     })
    //   }
    // },
    isFareReadOnly (value) {
      const ary = ['palmbox', 'fami', 'hct']
      return ary.some(key => key === value)
    },
    getGeoConfigCb (data) {
      this.areaMapLists = mapGeo(data)
    },
    getLoginUserInfoCb () {
      const {others} = this.userInfo
      if (others) {
        const { city, district, address } = others.addresses && others.addresses.meets
        const { edcode } = others
        this.$set(this.mode.area, 0, city)
        this.$set(this.mode.area, 1, district)
        this.mode = {
          ...this.mode,
          location: address
        }
        if (edcode && edcode.value) {
          this.mode = {
            ...this.mode,
            palmboxInfo: [edcode.city, edcode.dict, edcode.value]
          }
        }
      }
    },
    selectShipWay (index) {
      if (this.mode.bundle[index].key === 'palmbox' && !this.userInfo.cellphone) {
        this.$vux.toast.text('使用掌櫃須通過手機驗證', 'bottom')
        setTimeout(() => {
          this.$router.push(`/user/${this.userInfo.id}/editBaseInfo`)
        }, 3000)
        return null
      }
      this.mode.bundle[index].isSelected = this.mode.bundle[index].isShowInfo = !this.mode.bundle[index].isSelected
    },
    showInfo (index) {
      this.mode.bundle[index].isShowInfo = !this.mode.bundle[index].isShowInfo
    },
    updateShipWay (shipWay) {
      if (shipWay.length) {
        this.mode.bundle.forEach((item, index) => {
          shipWay.forEach((itm) => {
            if (itm.shipway === item.key) {
              this.$set(
                this.mode.bundle, index,
                {
                  ...this.mode.bundle[index],
                  isSelected: true,
                  isShowInfo: true,
                  fare: itm.shipfee || item.fare,
                  fareWay: itm.shipopts || item.fareWay
                }
              )
            }
          })
        })
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  watch: {
    mode: {
      handler (cur, old) {
        this.$emit('shipWay', {mode: cur})
      },
      deep: true
    },
    initShipWay: {
      handler (cur, old) {
        this.updateShipWay(cur)
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
  @import '~vux/src/styles/1px.less';
  .shipWay{
    .vux-x-input{
      &:before{
        border: none;
      }
    }
    .ship{
      .wrapper{
        .ship-item{
          .weui-icon-success{
            color: @color-CR;
            font-size: 20px;
            &:before{
              margin: 0;
            }
          }
          .weui-icon-circle{
            font-size: 20px;
            &:before{
              margin: 0;
            }
          }
        }
        .info{
          .ship-way-radio{
            .radioItem{
              margin-top: @pm-md;
              color: @color-font-C2;
              font-size: @font-S3;
            }
          }
          .fare, .address{
            .weui-cell{
              padding: @pm-md;
              font-size: @font-S3;
              .weui-cell__hd{
                color: @color-font-C1;
                font-size: @font-S3;
              }
              .weui-cell__bd{
                .weui-input{
                  color: @color-font-C2;
                }
              }
            }
          }
        }
      }
    }

    .no-margin .weui-cells{
      margin-top: 0;
      font-size: 14px;
    }
  }
</style>
<style lang="less" scoped>
  .shipWay{
    .ship{
      .wrapper{
        margin: @pm-lg 0 0 0;
        &:nth-of-type(2){
          margin-top: @pm-md;
        }
        &:nth-of-type(4){
          .info{
            .fare-way{
              margin-top: 0;
            }
          }
        }
        &:nth-of-type(5){
          .info{
            padding-top: 0;
          }
        }
        .ship-item{
          position: relative;
          padding: 0 @pm-bg;
          margin-bottom: @pm-sm;
          height: 44px;
          line-height: 44px;
          color: @color-font-C1;
          font-size: @font-S3;
          .icon{
            position: absolute;
            left: @pm-bg;
            top: 50%;
            transform: translateY(-50%);
          }
          .way-name{
            padding-left: 30px;
          }
          .triangle{
            position: absolute;
            right: @pm-bg;
            top: 8px;
            width:0;
            height:0;
            border-width:10px;
            border-style:solid;
            border-color:transparent transparent @color-font-C3;
            &.selected{
              top: 20px;
              transform: rotate(180deg);
            }
          }
          &:last-child{
            margin-bottom: 0;
          }
        }
        &.selected{
          .ship-item{
            color: @color-font-C4;
            background-color: @color-CR;
          }
        }
        .info{
          padding: @pm-md;
          margin-left: @pm-bg;
          border: 1px solid @color-CL;
          .hint{
            color: @color-font-C2;
            font-size: @font-S3;
          }
          .fare-way{
            margin: @pm-bg 0;
            .title{
              margin: 5px 0;
              line-height: 1;
              font-size: @font-S3;
            }
            .ship-way-radio{
              display: flex;
              flex-direction: column;
            }
          }
          .fare, .address{
            margin-top: @pm-md;
            border: 1px solid @color-CL;
          }
        }
      }
    }
  }

  .shipway-item-title{
    margin: 5px 0;
    font-size: 14px;
    line-height: 2;
  }

  .no-margin{
    border: 1px solid #eee;
  }
</style>
