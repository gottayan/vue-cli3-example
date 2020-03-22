<template>
  <div class="taipei-about">
    <x-header title="合作緣起">
    </x-header>
    <div class="content g-smooth">
      <div class="section">
        「我有100多箱餅乾想捐，請問社會局可以收嗎?」<br />
        「我想捐贈嬰兒用品跟嬰兒床，請問可以捐給誰?」<br />
        臺北市政府社會局常接到很多善心企業、民眾詢問如何捐贈物資…
      </div>
      <div class="section">
        為了能即時找到有需求的單位，將物資快速分配、送達，<br />
        於是發想建置一個物資媒合平台，<br />
        讓想捐贈的人可以方便捐贈；有需求的人可以索取，<br />
        也因緣結識理念相同的GIVE543贈物網。
      </div>
      <div class="section">
        GIVE543贈物網不僅是物資分享的平台，<br />
        藉由分享串起人的交流與互動，是個充滿人情味及溫度的空間。
      </div>
      <div class="section">
        所以我們攜手合作，<br />
        期待讓每份愛能夠分享出去，<br />
        期待讓有需要的人都獲得幫助，<br />
        讓各界溫暖傳遞到社會每個角落!
      </div>
      <router-link class="userIntro-nav" to="/faq">常見問題</router-link>
      <router-link class="userIntro-nav" to="/city/taipei/commonweal">公益一覽</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
  .taipei-about{
    height: 100%;
    .content{
      padding: 0 @pm-bg;
      height: calc(~"100% - 46px");
      overflow: scroll;
      .section{
        font-size: 15px;
        letter-spacing: 0.3px;
        line-height: 27px;
        color: #727376;
        margin: 20px 0 50px;
        &:nth-of-type(4){
          margin-bottom: 0;
        }
      }
      .userIntro-nav{
        display: block;
        margin: @pm-lg 0;
      }
    }
  }
</style>
