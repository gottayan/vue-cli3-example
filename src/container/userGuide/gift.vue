
<template>
  <div class="model-mask" display="table">
    <div class="welcome">
      <div class="container">
        <div class="logo-box">
          <img class="rabbit" src="../../assets/img/userGuide/guide_pic_rabbit@2x.png" alt="">
        </div>
        <div class="welcome-text">
          <p class="details">小兔帶您去逛逛熱門禮物~</p>
        </div>
        <div class="welcome-check">
          <button class="skip" @click="skip">跳過</button>
          <button class="ok" @click="next">好的</button>
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
      giftHidden: false
    }
  },
  methods: {
    skip () {
      this.$emit('giftHidden', this.giftHidden)
    },
    next () {
      this.$router.push('/gifts?sort=1')
    }
  }
}
</script>

<style lang="less" scoped>
  .model-mask {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 0;
    .welcome {
      width: 77%;
      height: 212px;
      background-color: #fff;
      border-radius:7px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .container {
    width: 98%;
    height: 202px;
    position: relative;
    border: #FFA507 dashed 2px;
    border-radius:7px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .logo-box {
      width: 33%;
      height: 96px;
      position: absolute;
      top: -60px;
      left: 50%;
      margin-left: -16%;
    }

    .rabbit {
      width: 100%;
    }

    .welcome-text {
      width: 80%;
      margin: 40px auto 10px;
      text-align: center;
      overflow: hidden;

      .title {
        font-size: 17px;
        color: #E2462C;
      }

      p {
        font-size: 15px;
        color: #28292B;
        margin-top: 6px;
        line-height: 18px;
      }

    }
    .welcome-check {
      width: 85%;
      margin: 24px auto 0;
      font-size:15px;
      line-height: 21px;
      display: flex;

      .skip {
        flex: 1;
        height: 36px;
        border: 1px solid #FFA507;
        outline: none;
        color: #FFA507;
        background-color: #fff;
        border-radius: 5px;
      }

      .ok{
        flex: 1;
        height: 36px;
        background-color: #E2462C;
        border: 0;
        outline: none;
        color: #fff;
        border-radius: 5px;
        margin-left: 10px;
      }
    }
  }

</style>
