<template>
  <div class="home-modules">
    <swiper
      dots-class="home-module-dots"
      :show-desc-mask="false"
      height="102px"
      :class="specialIconFestival ? 'christmas-swiper': ''"
    >
      <swiper-item
        :key="item"
        v-for="(item) in swiperItem">
        <grid
          :show-lr-borders="false"
          :show-vertical-dividers="false">
          <grid-item
            :key="index"
            @click.native="toModules(module.link)"
            :label="(module.name === 'activity' && activityTitle) || ((module.name === 'activity' && wishActivity) ? wishModule.label : module.label)"
            :class="[item === 1 ? 'icon': '',
            specialIconFestival && module.name === 'rank' ? 'christmas-icon' : '']
            "
            v-for="(module, index) in modules[item]"
          >
            <img
              width="50"
              height="auto"
              slot="icon"
              :src="module.icon"
              :alt="module.label">
          </grid-item>
        </grid>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Grid, GridItem, Swiper, SwiperItem } from 'vux'
import icActivity from '@/assets/icon/home_ic_activity_normal@2x.png'
import icLove from '@/assets/icon/home_ic_love_normal@2x.png'
import icRank from '@/assets/icon/home_ic_ranking_normal@2x.png'
import icStory from '@/assets/icon/home_ic_story_normal@2x.png'
import icThanks from '@/assets/icon/home_ic_thanks_normal@2x.png'
import icFami from '@/assets/icon/home_ic_family_normal@2x.png'
import icShiwu from '@/assets/icon/home_ic_shiwu_normal@2x.png'
import icHct from '@/assets/icon/home_ic_xinzhu_normal@2x.png'
import icPalmBox from '@/assets/icon/home_ic_palmbox_normal.png'

import icSpringActivity from '@/assets/icon/spring/home_ic_spring01_normal@2x.png'
import icSpringLove from '@/assets/icon/spring/home_ic_spring02_normal@2x.png'
import icSpringRank from '@/assets/icon/spring/home_ic_spring03_normal@2x.png'
import icSpringStory from '@/assets/icon/spring/home_ic_spring04_normal@2x.png'
import icSpringThanks from '@/assets/icon/spring/home_ic_spring05_normal@2x.png'

// import XmasActivity from '@/assets/icon/christmas/home_ic_xmas05_normal@2x.png'
// import XmasLove from '@/assets/icon/christmas/home_ic_xmas01_normal@2x.png'
// import XmasRank from '@/assets/icon/christmas/home_ic_xmas03_normal@2x.png'
// import XmasStory from '@/assets/icon/christmas/home_ic_xmas02_normal@2x.png'
// import XmasThanks from '@/assets/icon/christmas/home_ic_xmas04_normal@2x.png'

// import icFatherLove from '@/assets/img/father/home_ic_faday01_normal@2x.png'
// import icFatherStory from '@/assets/img/father/home_ic_faday02_normal@2x.png'
// import icFatherRank from '@/assets/img/father/home_ic_faday03_normal@2x.png'
// import icFatherThanks from '@/assets/img/father/home_ic_faday04_normal@2x.png'
// import icFatherActive from '@/assets/img/father/home_ic_faday05_normal@2x.png'

// import icSportsLove from '@/assets/img/festival/home_ic_sports01_normal@2x.png'
// import icSportsStory from '@/assets/img/festival/home_ic_sports02_normal@2x.png'
// import icSportsRank from '@/assets/img/festival/home_ic_sports03_normal@2x.png'
// import icSportsThanks from '@/assets/img/festival/home_ic_sports04_normal@2x.png'
// import icSportsActive from '@/assets/img/festival/home_ic_sports05_normal@2x.png'
import isAfter from 'date-fns/is_after'
import isBefore from 'date-fns/is_before'
// import { is_before as isBefore, is_after as isAfter } from 'date-fns'

export default {
  components: {
    Grid,
    GridItem,
    Swiper,
    SwiperItem
  },
  props: {
    activityTitle: {
      type: String,
      defalut: ''
    }
  },
  data () {
    return {
      festival: 'spring', // normal christmas spring
      icon: {
        normal: {
          activity: icActivity,
          love: icLove,
          rank: icRank,
          story: icStory,
          thanks: icThanks
        },
        spring: {
          activity: icSpringActivity,
          love: icSpringLove,
          rank: icSpringRank,
          story: icSpringStory,
          thanks: icSpringThanks
        }
      },
      swiperItem: [0, 1]
    }
  },
  computed: {
    specialIconFestival () {
      return this.festival === 'spring' || this.festival === 'christmas'
    },
    wishActivity () {
      let today = new Date()
      let begin = new Date(2018, 10, 9, 12)
      let finish = new Date(2018, 11, 31)
      return isAfter(today, begin) && isBefore(today, finish)
    },
    modules () {
      return [
        [{
          link: '/activitynotice',
          label: '活動',
          icon: this.icon[this.festival]['activity'],
          name: 'activity'
        }, {
          link: '/lovebox',
          label: '愛箱送',
          icon: this.icon[this.festival]['love'],
          name: 'lovebox'
        }, {
          link: '/bonusRanking',
          label: '好人榜',
          icon: this.icon[this.festival]['rank'],
          name: 'rank'
        }, {
          link: '/story',
          label: '讀故事',
          icon: this.icon[this.festival]['story'],
          name: 'story'
        }, {
          link: '/thanks',
          label: '感謝牆',
          icon: this.icon[this.festival]['thanks'],
          name: 'thanks'
        }],
        [{
          link: 'fami',
          label: '全家物流',
          icon: icFami,
          name: 'fami'
        }, {
          link: '/city/taipei',
          label: '社會局',
          icon: icShiwu,
          name: 'taipei'
        }, {
          link: 'hct',
          label: '新竹物流',
          icon: icHct,
          name: 'hct'
        }, {
          link: 'palmboxusage',
          label: '掌櫃',
          icon: icPalmBox,
          name: 'palm'
        }]
      ]
    },
    wishModule () {
      return {
        link: '/wishes',
        label: '心願認養',
        icon: this.icon[this.festival]['activity']
      }
    }
  },
  methods: {
    toModules (url) {
      if (this.wishActivity && !this.activityTitle) {
        url = url === '/activitynotice' ? this.wishModule.link : url
      }
      if (url === 'fami') {
        window.open('https://www.give543.com/static/famiport/index.html')
      } else if (url === 'hct') {
        window.open('https://www.give543.com/static/hct/543hct.html')
      }
      this.$router.push(url)
    }
  }
}
</script>
<style lang="less">
  .home-modules{
    .christmas-icon > div > img {
      transform: scale(2) !important;
      top: -32px !important;
    }
    .christmas-swiper {
      overflow: visible;
      .vux-swiper {
        overflow: visible;
        .vux-swiper-item {
          overflow: visible;
          .weui-grids {
            overflow: visible;
          }
        }
      }
    }
    .weui-grids{
      &:before, &:after{
        display: none;
      }
      .weui-grid{
        padding: @pm-lg 0 26px;
        &:before, &:after{
          display: none;
        }
        .weui-grid__label{
          margin-top: 8px;
          color: @color-font-C1;
          font-size: @font-S4;
        }
        .weui-grid__icon{
          position: relative;
          img{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            max-width: 100%;
            max-height: 100%;
            width: 100%;
            height: auto;
            display: block;
            transform: none;
          }
        }
        &.icon{
          padding: 26px 0;
          .weui-grid__icon{
            width: 80% !important;
          }
        }
      }
    }
    .home-module-dots {
      right: 50% !important;
      bottom: @pm-md !important;
      transform: translateX(50%);
      a {
        margin: 0;
        height: 3px;
        vertical-align: top;
      }
      .vux-icon-dot {
        width: 15px;
        height: 3px;
        float: left;
        background-color: @color-CBG !important;
        transition: background-color .3s;
        &.active {
          background-color: @color-CR !important;
        }
      }
    }
  }
</style>

<style lang="less" scoped>
  .home-modules{
    background: #FFF;
  }
</style>
