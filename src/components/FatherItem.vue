<template>
  <div class="father-item-container votrInfoItem">
    <div
      class="active-cover"
      :style="`background-image: url(${smartPath})`"
      @click="handleClick(item)">
    </div>
    <div class="voteInfoItemTable">
      <div class="votrInfoItemName">No.{{item.no}} {{item.signature}}</div>
      <div class="votrInfoItemNum">
        <img class="like-icon" src="@/assets/img/father/voted.png" alt="">
        <span class="vote-count">{{item.vote_up}}</span>
      </div>
    </div>
    <div class="giveFatherword">{{item.content}}</div>
    <button @click="handleVoteup(item.id, item.isVoted)" :class="`btn-voteup${item.isVoted ? ' active' : ''}`"></button>
  </div>
</template>

<script>
import { newestImagePath } from '@/tools/ObjectHelper'
export default {
  data () {
    return {}
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    handleVoteup: {
      type: Function,
      required: true
    },
    handleClick: {
      type: Function,
      required: true
    }
  },
  computed: {
    smartPath () {
      return newestImagePath(this.item.image, true)
    }
  }
}
</script>

<style lang="less" scoped>
  .votrInfoItem{
    margin-bottom: 10px;
    justify-content: space-around;
    .active-cover{
      min-height: 40vw;
      max-height: 40vw;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      border: 5px solid;
      border-radius: 5px;
      border-top-color: @color-CO;
      border-left-color: @color-CO;
      border-right-color: #eb6b59;
      border-bottom-color: #eb6b59;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
    .voteInfoItemTable{
      overflow: hidden;
      margin-top: 10px;
      .votrInfoItemName{
        float: left;
        color: #FF9600;
        font-size: 15px;
        font-weight: bold;
      }
      .votrInfoItemNum{
        float: right;
        color: #989898;
        font-size: 12px;
        line-height: 24px;
      }
    }

    .like-icon{
      width: 15px;
      vertical-align: middle;
    }
    .vote-count{
      vertical-align: middle;
    }
  }

  .btn-voteup{
    background-image: url(../assets/img/father/details_btn_vote_normal@2x.png);
    background-repeat: no-repeat;
    background-color: transparent;
    width: 70%;
    margin: 10px auto 0;
    display: block;
    background-size: contain;
    height: 41px;
    border: 0;
    outline: none;
    &.active{
      background-image: url(../assets/img/father/details_btn_vote_disable@3x.png);
    }
  }

  .giveFatherword{
    font-size: 12px;
    color: #989898;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media screen and (min-width: 768px) {
    .votrInfoItem .active-cover{
      max-width: 330px;
      max-height: 330px;
      min-height: 330px;
    }
  }
</style>
