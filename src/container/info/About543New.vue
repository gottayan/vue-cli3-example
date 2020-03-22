<template>
  <div class="about543-container">
    <x-header :title="$route.meta.title">
    </x-header>
    <main class="about543-content">
      <img class="logo" src="@/assets/icon/GIVE543_logo_svg.svg" alt="">
      <group>
        <cell title="認識543" is-link link="/about543">
        </cell>
        <cell title="常見問題" is-link link="/faq">
        </cell>
      </group>
      <group>
        <cell title="版本更新" is-link @click.native="$vux.toast.text('敬請期待...', 'bottom')">
        </cell>
      </group>
    </main>
    <footer class="about543-ft">
      <span class="ft-item">
        <router-link to="/service-protocol">《使用者條款》</router-link>和<router-link to="/privacy">《隱私權政策》</router-link>
      </span>
      <span class="ft-item">
        專利申請中 法律顧問 明沂律師事務所
      </span>
      <span class="ft-item">
        本網站版權屬於 贈物網共享平台股份有限公司 所有
      </span>
      <span class="ft-item">
        Copyright &copy; 2009-{{new Date().getFullYear()}} GIVE543.All rights reserved.
      </span>
    </footer>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
export default {
  components: {
    Group,
    Cell
  },
  data () {
    return {}
  }
}
</script>

<style lang="less">
  .about543-container{
    .weui-cell{
      &:before{
        left: 0;
      }
      .vux-cell-bd{
        color: @color-font-C1;
        font-size: 15px;
      }
    }
  }
</style>
<style lang="less" scoped>
  .about543-container{
    background: #f5f4f5;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .logo{
    width: 50%;
    max-width: 200px;
    display: block;
    margin: 30px auto;
  }

  .about543-content{
    flex: 1;
  }

  .about543-ft{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }

  .ft-item a{
    color: @color-CO;
  }

  .ft-item:first-child{
    margin-bottom: 10px;
  }

  .ft-item:not(:first-child){
    color: @color-font-C2;
    font-size: @font-S3;
  }
</style>
