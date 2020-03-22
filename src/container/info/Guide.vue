<template>
  <div class="guide-container">
    <div class="guide-title">
      <span class="guide-txt">
        <i>常見問題</i><i>Q&A</i>
      </span>
      <img src="@/assets/icon/guide/qa-bg.png" width="100%" height="auto" alt="常見問題" />
    </div>
    <tab :line-width="1">
      <tab-item
        v-for="(item, index) in guideNavList"
        :selected="(index === navActiveIndex)"
        :key="index"
      >{{item.label}}</tab-item>
    </tab>
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'
import { guideNavList } from '@/tools/constant'
export default {
  components: {
    Tab,
    TabItem
  },
  data () {
    return {
      guideNavList,
      navActiveIndex: 0
    }
  }
}
</script>

<style lang="less">
.guide-contaienr{
  .vux-tab-item{
    flex: 0 0 44%;
  }
}
</style>

<style lang="less" scoped>
@primary: #F5AA38;
@black: #444;
@paragraphBlack: #727376;
.static-subTitle{
  margin-top: 30px;
  margin-bottom: 0;
  display: inline-flex;
  align-items: center;
}

.static-content {
  font-size: 15px;
  letter-spacing: 0.3px;
  line-height: 27px;
  color: @paragraphBlack;
  margin: 20px 0 50px;
}

.guide-container{
  /*display: flex;*/
}

.guide-title{
  position: relative;
  margin-bottom: 20px;
}

.guide-txt{
  position: absolute;
  top: 50%;
  left: 20px;
  color: #FFF;
  font-size: 20px;
  font-style: normal;
  transform: translateY(-50%);

  i{
    font-style: normal;
  }
  i:nth-of-type(1){
    margin-right: 10px;
    padding-right: 10px;
    border-right: 1px solid #f0c585;
  }
}

.QA-static-block {
  margin: 0;
}

.QA-question {
  .static-subTitle;
  align-items: baseline;
}

.QA-question-mark {
  color: @primary;
  font-weight: bold;
  font-size: 30px;
  padding-right: 5px;
  vertical-align: text-top;
}

.QA-question-content {
  margin: 0;
  position: relative;
  font-size: 18px;
  color: @black;
  vertical-align: text-top;
}

.QA-answer {
  .static-content;
  margin: 20px 0 8px;
  > .desc{
    display: block;
    text-align: center;
  }
  img{
    max-width: 100%;
  }
}
.guide-content{
  margin-left: 20%;
  border-left: 1px solid #e0e0e0;
  min-height: 100%;
}
</style>
