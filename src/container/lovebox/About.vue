<template>
  <div class="about-lovebox">
    <x-header title="關於愛箱送">
    </x-header>
    <div class="lovebox-wrapper g-smooth">
      <img :src="banner" class="banner" alt="banner">
      <div class="page-content-container">
        <div
          :key="index"
          class="page-content-item"
          v-for="(item, index) in items">
          <div class="page-item-pic">
            <img
              :src="item.pic"
              width="100%"
              height="auto"
              alt="pic">
          </div>
          <div class="page-item-desc">
            <div class="page-item-index">
              <span>0{{index + 1}}</span>
            </div>
            <div class="content">
              <div
                :key="index"
                class="desc-item"
                v-for="(desc, index) in item.descs">
                {{desc}}
              </div>
            </div>
          </div>
        </div>
        <div class="page-item-ft">
          <span
            @click="toContact"
            class="mail-btn">
            <icon
              name="mail_fill"
              :scale="4">
            </icon>
            <span
              class="txt">
              推薦企業加入
            </span>
          </span>
          <div
            class="hint">
            洽詢合作請點擊聯繫我們，或來信service@give543.com留下公司名稱、聯絡人姓名及聯絡方式，我們會主動與您聯繫～
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import iconNoGift from '@/assets/icon/com_pic_empty_gift@2x.png'
import pic1 from '@/assets/img/lovebox/pic-1.png'
import pic2 from '@/assets/img/lovebox/pic-2.png'
import pic3 from '@/assets/img/lovebox/pic-3.png'
import pic4 from '@/assets/img//lovebox/pic-4.png'
import banner from '@/assets/img//lovebox/banner.jpg'

export default {
  data () {
    return {
      iconNoGift,
      banner,
      items: [{
        pic: pic1,
        descs: [
          '加入愛箱送企業，我們將提供專門的紙箱和快遞上門服務',
          '您只需打包好物資，我們會幫您送到最適合的人手中專業代贈；輕鬆省心'
        ]
      }, {
        pic: pic2,
        descs: [
          '我們將在平臺顯示禮物是由您公司（公司名稱）',
          '某某員工（暱稱）提供，助人爲樂同時全網曝光，提升企業形象',
          '更利於企業發展、延續物命、員工生活品質提升、社會氛圍益善'
        ]
      }, {
        pic: pic3,
        descs: [
          '我們將建立專屬的「希望倉庫」管理愛心物資',
          '僱用弱勢族群擔任「贈物管家」，負責贈物入倉、整理、媒合贈出、去向回報等，教育訓練完整十二道流程',
          '助弱勢就業，讓好事加乘，全程多元照顧社會各個需求面向（物資分享、環境保護、協助弱勢就業自立…）'
        ]
      }, {
        pic: pic4,
        descs: [
          '將愛心禮物送給需要的人',
          '企業將收到完整的禮物流向、獲贈者的感謝等結案報告',
          '收獲滿滿的感動～'
        ]
      }]
    }
  },
  methods: {
    toContact () {
      this.$router.push('/contactLovebox')
    }
  }
}
</script>

<style lang="less" scoped>
  .about-lovebox{
    height: 100%;
    .lovebox-wrapper{
      height: calc(~"100% - 44px");
      overflow-y: scroll;
      .banner{
        width: 100%;
        height: auto;
      }
      .page-content-container{
        .page-content-item{
          display: flex;
          flex-direction: column;
          padding: 50px 0;
          margin: 0 auto;
          width: 75%;
          border-bottom: 1px dashed #ccc;
          text-align: right;
          .page-item-index{
            margin-bottom: 20px;
            text-align: center;
            &>span{
              border-bottom: 2px solid #F5AA38;
              color: #F5AA38;
              font-size: 60px;
            }
            &~div{
              color: @color-font-C1;
              font-size: 16px;
              text-align: center;
            }
          }
        }
        .page-item-ft{
          width: 80%;
          text-align: center;
          padding: 30px 0 60px;
          margin: 0 auto;
          .mail-btn{
            display: flex;
            justify-content: center;
            align-items: center;
            background: orange;
            height: 50px;
            width: 300px;
            border-radius: 25px;
            color: white;
            font-size: 15px;
            margin: 0 auto 20px;
            &:hover,
            &:active{
              color: white;
            }
            svg{
              width: 25px;
              height: 30px;
            }
          }
        }
      }
    }
  }
</style>
