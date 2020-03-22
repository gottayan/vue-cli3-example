<template>
  <div class="mask" display="table">
    <div class="item-card">
      <div class="item-card-top">
        <div class="pic">
          <img src="../../assets/img/bg-default-gift.png" alt="">
        </div>
        <div class="info">
          <div class="title">推薦禮物</div>
          <div class="desc">線上許多物品，等你來尋寶，把他們都索取回家吧</div>
        </div>
        <span class="num">剩餘：<i>1</i></span>
        <button class="btn-demand">索取</button>
      </div>
    </div>
    <div class="demandTips">
      <div class="container">
        <div class="trips">
          <p>點擊下方「禮物」，可以在禮物池中挑選您喜歡的禮物進行索取~ 點擊列表查看禮物詳情~</p>
          <div class="btn-box">
            <button  class="btn-next" @click="next">下一步</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      demandHidden: false
    }
  },
  methods: {
    next () {
      this.$emit('demandHidden', this.demandHidden)
      this.$router.push({ path: '/needs?guide=1' })
    }
  }
}
</script>

<style lang="less" scoped>
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 999;
    }

  .item-card {
    background-color: #fff;
    height: 120px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 423px;
    z-index: 3;

    .item-card-top {
      width: 92%;
      height: 90px;
      display: flex;
      flex-direction: row;
      position: relative;
    }

    .pic {
      height: 90px;
      width: 26%;
      display: inline-block;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info{
      width: 47%;
      height: 90px;
      margin-left: 15px;
      margin-right: 75px;
      font-size: 16px;
      .desc {
        color: #969797;
        font-size: 13px;
        margin-top: 16px;
      }
    }

    .num {
      position: absolute;
      top: 0;
      right: 0;
      color: #969797;
      font-size: 13px;
      display: inline-block;
      width: 14%;
      height: 20px;

      i {
        color: #e25443;
      }
    }

    .btn-demand {
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: #e25443;
      border: 0;
      outline: none;
      color: #fff;
      height: 30px;
      width: 19%;
      border-radius: 5px;
    }
  }

  .demandTips {
    position: absolute;
    top: 243px;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    width: 77%;
    height: 157px;
    // overflow: hidden;
    border-radius: 8px;
    font-size: 15px;
    background-color: #fff;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .demandTips::after {
    content: '';
    width: 0;
    height: 0;
    border-width: 11px;
    border-style: solid;
    border-color: #fff transparent transparent transparent;
    z-index: 10;
    position: absolute;
    bottom: -21px;
    right: 18px;
  }

  .container {
    width: 96%;
    border: 1px dashed #FFA507;
    height: 145px;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    .trips {
      width: 89%;
      font-weight: bold;
      margin-top: 8px;
    }
    .btn-box {
      width: 39%;
      margin: 7px  0 0 140px ;

      .btn-next {
        width: 100%;
        height: 36px;
        background-color: #E2462C;
        border:0;
        outline: none;
        color: #fff;
        border-radius: 5px;
      }
    }
  }
</style>
