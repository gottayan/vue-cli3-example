<template>
  <div class="mask" display="table">
    <div class="item-card">
      <div class="item-card-top">
        <div class="pic">
          <img src="../../assets/img/bg-default-need.png" alt="">
        </div>
        <div class="info">
          <div class="title">推薦需求</div>
          <div class="desc">大夥兒正需要這些物資，剛好有這些物品可以送出嗎？快來看看吧！</div>
        </div>
        <span class="num">剩餘：<i>2</i></span>
        <button class="btn-demand">贈送</button>
      </div>
    </div>
    <div class="needTips">
      <div class="container">
        <div class="trips">
          <p>點擊下方「需求」，可以在需求池中贈送他人需要的物品~點擊列表查看需求詳情~</p>
        </div>
        <div class="btn-box">
          <button  class="btn-next" @click="next">下一步</button>
        </div>
      </div>
    </div>
 </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      // childValue: false
    }
  },
  methods: {
    next () {
      // this.$emit('childByValue', this.childValue)
      this.$router.push({ path: '/?guide=1' })
    }
  }
}
</script>

<style lang="less" scoped>
 .mask {
    position: relative;
    width: 100%;;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
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
    z-index: 10;

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
      img{
      width: 100%;
      height: 100%;
      }
    }
    .info {
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
      top:0;
      right:0;
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
      bottom:0;
      right:0;
      background-color: #e25443;
      border: 0;
      outline: none;
      color: #fff;
      height: 30px;
      width: 19%;
      border-radius: 5px;
    }
  }

  .needTips{
    position: absolute;
    top: 243px;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    width: 77%;
    height: 157px;
    border-radius: 8px;
    font-size: 15px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &::after {
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
  }

  .container{
    width: 96%;
    height: 145px;
    border: 1px dashed #FFA507;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow: hidden;

    .trips{
      width: 89%;
      font-weight: bold;
      margin-top: 8px;
    }
    .btn-box{
      width: 39%;
      margin: 22px 0 7px 140px;

      .btn-next{
        width: 100%;
        height: 36px;
        background-color: #E2462C;
        border: 0;
        outline: none;
        color: #fff;
        border-radius: 5px;
      }
    }
  }
</style>
