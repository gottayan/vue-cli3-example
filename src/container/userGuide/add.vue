<template>
  <div class="model-mask" display="table">
    <div class="add">
      <div class="container">
      <div class="welcome-text">
          <p class="details">
          點擊“+”按鈕可以上傳禮物或者發佈需求，上傳完成它們就會展示在禮物池或需求池了~</p>
          <div class="welcome-check">
        <button class="ok" @click="next">好的</button>
      </div>
      </div>
      </div>
    </div>
    <div class="pic">
      <img src="../../assets/img/userGuide/add.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // addHidden 为fasle时为隐藏
      addHidden: false
    }
  },
  methods: {
    next () {
      this.$emit('addHidden', this.addHidden)
      // guide表示是否显示引导页面
      this.$router.push({ path: '/gifts?guide=1' })
    }
  }
}
</script>

<style lang="less" scoped>
  .pic {
    position: fixed;
    z-index: 505;
    right: 0px;
    bottom: 58px;
    text-align: right;
    width: 20vw;
    height: 20vw;

    img {
      width: 100%;
    }
  }

  .model-mask {
    position: relative;
    width: 100%;;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);

    .add {
    position:absolute;
    bottom: 133px;
    right: 13px;
    width: 77%;
    height: 157px;
    background-color: #fff;
    border-radius:7px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;

      &::before{
        content: '';
        width: 0;
        height: 0;
        border-width: 11px;
        border-style: solid;
        border-color: #fff transparent transparent transparent;
        z-index: 999;
        position: absolute;
        bottom:-21px;
        right: 18px;
      }
    }
  }

  .container {
    width: 98%;
    height: 145px;
    position: relative;
    border: #FFA507 dashed 2px;
    border-radius:7px;

    .welcome-text {
      width: 89%;
      margin: 15px auto 10px;
      text-align: center;
      overflow: hidden;
      height: 110px;

      .title {
        font-size: 17px;
        color: #E2462C;
      }

      p {
        font-size: 15px;
        color: #28292B;
        margin-top: 6px;
        line-height: 18px;
        text-align: left;
      }

    }

    .welcome-check {
      width: 40%;
      margin: 1px 0 0 122px;
      font-size:15px;
      line-height: 21px;
      align-self: flex-end !important;
      align-items:flex-end !important;

      .ok {
        width: 100%;
        height: 36px;
        background-color: #E2462C;
        border: 0;
        outline: none;
        color: #fff;
        border-radius: 5px;
        margin-left: 10px;
        margin-right: 20px;
        align-self: flex-end !important;
        align-items:flex-end !important;
      }
    }
  }

</style>
