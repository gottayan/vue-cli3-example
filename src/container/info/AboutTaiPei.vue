<template>
  <div class="page-container">
    <div class="static-content-container">
      <h1 class="static-title">臺北市社會局與GIVE543贈物網合作緣起</h1>
      <hr class="static-hr" />
      <div class="static-block-no-subsitle">
        <div class="static-content">
          「我有100多箱餅乾想捐，請問社會局可以收嗎?」<br />
          「我想捐贈嬰兒用品跟嬰兒床，請問可以捐給誰?」<br />
          臺北市政府社會局常接到很多善心企業、民眾詢問如何捐贈物資…
        </div>
        <div class="static-content">
          為了能即時找到有需求的單位，將物資快速分配、送達，<br />
          於是發想建置一個物資媒合平台，<br />
          讓想捐贈的人可以方便捐贈；有需求的人可以索取，<br />
          也因緣結識理念相同的GIVE543贈物網。
        </div>
        <div class="static-content">
          GIVE543贈物網不僅是物資分享的平台，<br />
          藉由分享串起人的交流與互動，是個充滿人情味及溫度的空間。
        </div>
        <div class="static-content">
          所以我們攜手合作，<br />
          期待讓每份愛能夠分享出去，<br />
          期待讓有需要的人都獲得幫助，<br />
          讓各界溫暖傳遞到社會每個角落!
        </div>
        <router-link to="/faq">常見問題Q&A</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutTaiPei'
}
</script>

<style lang="less" scoped>
  .page-container {
    background-color: @color-font-C3;
    width: 100%;
    height: 100%;
     scroll-behavior: smooth;
    -webkit-scroll-behavior: smooth;
    overflow-scrolling: touch;
    -webkit-overflow-scrolling: touch;
  }

  .static-content-container {
    /*margin: 0 auto;*/
    /*width: 80%;*/
    height: 100%;
    overflow-y: auto;
    background-color: white;
    /*padding: 60px;*/
    padding: @pm-lg;
    text-align: justify;
  }

  .static-title {
    margin-top: 0;
    font-size: 25px;
    color: @color-font-C2;
  }

  .static-hr {
    height: 4px;
    border: 0;
    background-color: #EBEBEB;
  }

  .static-block {
    margin-bottom: 50px;
  }

  .static-subTitle {
    margin-top: 30px;
    margin-bottom: 0;
    display: inline-flex;
    align-items: center;
  }

  .static-content {
    font-size: 15px;
    letter-spacing: 0.3px;
    line-height: 27px;
    color: #727376;
    margin: 20px 0 50px;
  }

  .static-block-no-subsitle {
    margin-top: 50px;
  }

  .router-link {
    color: @color-CO;
  }
</style>
