<template>
  <div class="df-container">
    <div class="title-wrapper">
      <h2>熟食/食材捐贈</h2>
    </div>
    <section class="intro-panel">
      近年來食物不浪費、惜食理念廣受社會大眾關注，<br />
      本局也共同響應，媒合公有市場捐贈餘裕食材，提供社福單位領取，<br />
      但減少食物浪費，最重要的是從源頭做起，像是訂餐前確實控管用餐人數、計畫性消費，以減少剩餘產生。<br />
      <br />
      但若因種種不可抗力因素下，仍有多餘熟食或食材欲捐贈，請詳閱以下說明：<br /><br />
      單位可接受的捐贈<br />
      <ul>
        <li>熟食：未食用過便當、餐盒、菜餚等，請妥善包裝。</li>
        <li>食材：尚未煮食的生鮮食材(生鮮蔬果、魚肉類、加工食品等)，請確保食材新鮮尚可煮食。</li>
      </ul>
      <br />
      捐贈小叮嚀<br />
      <ul>
        <li>捐贈前，請務必注意食用期限，捐贈你、我皆願意吃的食物。</li>
        <li>因熟食賞味期限短，且需配合單位供餐時間，故請於單位方便接受捐贈時間聯繫捐贈。</li>
        <li>每個單位可接受物資類型、時間、數量及運送方式皆不同，請電話聯繫確認，勿逕自將物資送至單位，避免造成不必要困擾喔!</li>
      </ul>
      <br />
      閱讀完說明後，如您接受及認同，且有尚可食用、安全無虞的熟食或食材，<br />
      可直接聯繫以下單位喔! 謝謝您的愛心分享～<br />
    </section>
    <div class="title-wrapper">
      <h2 >社福單位</h2>
    </div>
    <section class="target-panel">
      <div class="row" :key="index" v-for="(item, index) in donateTarget">
        <div class="area-type">
          <span class="area">{{item.area}}</span>
          <span class="type">{{item.type}}</span>
        </div>
        <span :class="`col-${key}`" :key="key" v-for="key in Object.keys(item).filter(key => key !== 'area' && key !== 'type')">
          <span class="label">
            {{translate(key)}}：
          </span>
          <span class="value">
            {{item[key]}}
          </span>
        </span>
      </div>
      <!-- {donateTarget.map((item, index) => (
        <div key={index} class="row">
          <div class="area-type">
            <span class="area">{item.area}</span>
            <span class="type">{item.type}</span>
          </div>
          {Object.keys(item).filter(key => key !== 'area' && key !== 'type').map(key => (
            <span key={key} :class="`col-${key}`">
              <span class="label">
                {this.translate(key)}：
              </span>
              <span class="value">
                {item[key]}
              </span>
            </span>)
          )}
        </div>
      ))} -->
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      donateTarget: [{
        name: '臺北市健軍團體家庭',
        type: '身心障礙福利',
        area: '中正區',
        foodType: '熟食、食材',
        num: '7人份',
        time: '下午13點半到16點前',
        shipway: '捐贈者協助運送',
        phone: '02-2365-9037'
      }, {
        name: '臺北市鵬程啟能中心',
        type: '身心障礙福利',
        area: '松山區',
        foodType: '熟食、食材',
        num: '70人份',
        time: '24小時都可',
        shipway: '視物資遠近',
        phone: '02-2760-6277'
      }, {
        name: '創世基金會 萬華平安站',
        type: '綜合性服務',
        area: '萬華區',
        foodType: '熟食、食材',
        num: '70人份',
        time: `食材：週一至週五上午8時至17時(需冷藏及冷凍，需事先聯繫)
        便當及餐盒：晚餐，下午14-16時
        (僅接受晚餐時段。亦需事先聯繫)`,
        shipway: '視物資遠近',
        phone: '02-2336-1247'
      }, {
        name: '友緣基金會(高風險家綜單位)',
        type: '兒童青少年福利',
        area: '士林區',
        foodType: '熟食、食材',
        num: '38人份',
        time: '早上9點至下午16點',
        shipway: '捐贈者協助運送',
        phone: '02-2837-1910'
      }, {
        name: '財團法人基督教臺北市伯大尼兒少家園',
        type: '兒童青少年福利',
        area: '文山區',
        foodType: '食材',
        num: '50人份',
        time: '早上8點到下午17點',
        shipway: '視物資遠近',
        phone: '02-2939-6396'
      }, {
        name: '財團法人利伯他茲教育基金會-選擇家園',
        type: '兒童青少年福利',
        area: '信義區',
        foodType: '食材',
        num: '15人份',
        time: '24小時都可',
        shipway: '視物資遠近',
        phone: '02-2634-1363'
      }, {
        name: '財團法人利伯他茲教育基金會-曙光家園',
        type: '兒童青少年福利',
        area: '信義區',
        foodType: '食材',
        num: '8人份',
        time: '24小時都可',
        shipway: '視物資遠近',
        phone: '02-8791-7593'
      }, {
        name: '財團法人基督教芥菜種會',
        type: '兒童青少年福利',
        area: '南港區',
        foodType: '食材',
        num: '100人份',
        time: '早上9點到下午17點',
        shipway: '視物資遠近',
        phone: '02-2597-4868'
      }, {
        name: '財團法人天主教善牧社會福利基金會-德蓓之家',
        type: '兒童青少年福利',
        area: '信義區',
        foodType: '食材',
        num: '4人份',
        time: '早上9點至下午20點',
        shipway: '視物資遠近',
        phone: '02-2726-6617'
      }, {
        name: '財團法人臺北市基督教勵友中心-家處',
        type: '兒童青少年福利',
        area: '中山區',
        foodType: '食材',
        num: '10人份',
        time: '早上9點至下午17點',
        shipway: '捐贈者協助運送',
        phone: '02-2595-2052'
      }, {
        name: '內湖老人服務中心',
        type: '老人福利',
        area: '內湖區',
        foodType: '食材',
        num: '10人份',
        time: '早上9點至下午17點',
        shipway: '捐贈者協助運送',
        phone: '02-2632-5560'
      }, {
        name: '臺北市大同發展中心',
        type: '身心障礙福利',
        area: '大同區',
        foodType: '食材',
        num: '10人份',
        time: '早上9點至下午16點',
        shipway: '視物資遠近',
        phone: '02-2598-6886'
      }, {
        name: '臺北市東區單親家庭服務中心',
        type: '婦女福利',
        area: '松山區',
        foodType: '食材',
        num: '10人份',
        time: '週二、週四、週五、週六早上9點至下午17點；週三下午1點至晚間20點',
        shipway: '捐贈者協助運送',
        phone: '02-2768-5256'
      }, {
        name: '台北兒童福利中心',
        type: '兒童青少年福利',
        area: '信義區',
        foodType: '食材',
        num: '30人份',
        time: '週三下午1點至晚間20點',
        shipway: '捐贈者協助運送',
        phone: '02-3765-2575'
      }, {
        name: '台北市城中發展中心',
        type: '身心障礙福利',
        area: '中正區',
        foodType: '食材',
        num: '50人份',
        time: '週一至週五早上9點至晚間21點',
        shipway: '捐贈者協助運送',
        phone: '02-2364-3036'
      }, {
        name: '崇愛發展中心',
        type: '身心障礙福利',
        area: '新北市中和區',
        foodType: '食材',
        num: '150人份',
        time: '早上9點至下午16點',
        shipway: '視物資遠近',
        phone: '02-2246-0820'
      }]
    }
  },
  methods: {
    translate (key) {
      return {
        name: '單位名稱',
        type: '單位類別',
        area: '所在區域',
        foodType: '捐贈類型',
        num: '接受數量',
        time: '捐贈時間',
        shipway: '運送方式',
        phone: '聯絡電話'
      }[key]
    }
  }
}
</script>

<style lang="less" scoped>
.df-container{
  width: 100%;
  background-color: #aaaaaa;

  .title-wrapper{
    padding: 0 20px;
    background-color: white;
  }

  h2{
    margin: 0;
    background-color: white;
    font-size: 25px;
    color: #8F8E94;
    padding: 20px 0 10px;
    border-bottom: 4px solid #ebebeb;
  }

  section{
    background-color: white;
  }
}

.intro-panel{
  margin: 0 auto;
  /* max-width: 1200px; */
  padding: 20px;

  ul{
    list-style: inside;
    color: #f5aa38;
    padding-left: 15px;
  }
}

.target-panel{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* max-width: 1200px; */
  margin: 0 auto;
  padding: 30px 20px 0;
  justify-content: space-between;
}

.row{
  background-color: white;
  border: 1px solid #fafafa;
  margin: 0 10px 20px;
  width: 340px;
  border-radius: 5px;
  padding: 15px 20px;
  box-shadow: 0 10px 15px -8px rgba(0, 0, 0, .2);
  position: relative;
  overflow: hidden;
  .area-type{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 5px;
    border-bottom: 2px;
    border-bottom-color: #dedede;
    border-bottom-style: solid;
    margin-bottom: 10px;

    .area{
      font-size: 22px;
      font-weight: 700;
      display: inline-block;
      margin-right: 22px;
    }

    .type{
      background: #f4ab3d;
      color: white;
      padding: 2px 10px;
      border-radius: 12px;
    }
  }

  >span{
    display: flex;
  }

  .label{
    color: #aaa;
  }

  .value{
    flex: 1;
  }
}

@media screen and (max-width: 720px) {
  .target-panel{
    justify-content: center;
  }
}
</style>
