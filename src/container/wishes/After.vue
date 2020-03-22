<template>
  <div class="wrap" id="wrap">
    <div class="header">
      <x-header
      ></x-header>
    </div>
    <div class="card">
      <icon @click.native="$router.go(-1)"
        class="cancel-btn" type="cancel">
      </icon>
      <div class="img"><img :src="successImg" alt=""></div>
      <div style="text-align: center;"><h3>認養成功</h3></div>
      <ul>
        <li>感謝您的愛心，已成功認養2018幸福偏鄉的聖誕心願，請在10天內將禮物寄出，我們將在收到禮物的五天內留言通知您。謝謝您～</li>
        <li>請您將禮物寄到以下資料：</li>
        <li>姓名：GIVE543 幸福偏鄉小組 收</li>
        <li>電話：02-2747-6107</li>
        <li>地址：114台北市內湖區新明路273巷6號4樓</li>
        <li>溫馨小提醒：</li>
        <li>1.禮物請採簡易包裝，並在收件地址旁註明『禮物編號』及『您的暱稱』</li>
        <li>2.除了心願禮物外，還有手寫的鼓勵祝福卡片1張唷~</li>
      </ul>
    </div>
  </div>
</template>

<script>
import successImg from '../../assets/icon/com_pic_succeed@2x.png'
import {Icon} from 'vux'
export default {
  components: {
    Icon
  },
  data () {
    return {
      successImg
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../global.mixin.less';
.wrap {
  .g-bg-repeat-y('./assets/img/wishes/wish_pic_bg@2x.png');
  .card {
    position: relative;
    color: #28292B;
    margin: 25px 10px;
    padding: 20px;
    background-color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    line-height: 40px;
    .cancel-btn{
      position: absolute;
      font-size: 35px;
      top: 0;
      right: 0;
      &:before{
        margin: 0;
      }
    }
  }
  .img {
    margin: 0 auto;
    width: 150px;
    height: 150px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
