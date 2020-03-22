<template>
  <div class="unauth-container">
    <x-header :title="$route.meta.title"></x-header>
    <div class="unauth-content-wrapper">
      <img class="unauth-img" src="@/assets/icon/com_pic_loading@2x.gif" alt="">
      <div class="unauth-content">
        <div class="title">
          抱歉，此為私人頁面，您無法瀏覽...
        </div>
        <div class="desc">誤入贈物網？點擊下列連結認識贈物網🍰</div>
        <div class="unauth-intro">
          <router-link class="link" to="/about543">關於我們</router-link>
          <router-link class="link" to="/">返回首頁</router-link>
          <router-link class="link" to="/gifts">禮物池</router-link>
          <router-link class="link" to="/needs">需求池</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Unauthorized'
}
</script>

<style lang="less" scoped>
  .unauth-container{
    height: 100%;
  }
  .unauth-content-wrapper{
    height: calc(~"100% - 44px");
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .unauth-img{
      max-width: 200px;
    }

    .title{
      font-size: 18px;
      margin: 20px 0;
      font-weight: bold;
    }

    .desc{
      font-size: 16px;
      color: #969797;
    }

    .link{
      font-size: 16px;
      color: @color-font-CR;
      line-height: 2;
    }
  }
</style>
