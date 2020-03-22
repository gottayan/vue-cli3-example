<template>
  <div class="popUp" @click.self="handleClose">
    <div class="festival-modal-container">
      <div class="info">
        <div class="headSculpture">
          <img class="img-big" :src="smartPath" alt="">
          <img @click="handleClose" class="btn-close" src="@/assets/img/father/com_ic_close_normal@2x.png" alt="">
        </div>
        <div class="title">No.{{item.no}} {{item.signature}}</div>
        <div class="synopsis">{{item.content}}</div>
      </div>
      <div class="count">
        <div class="num">
          <img src="@/assets/img/father/voted.png" alt="">
          <span>{{item.vote_up}}</span>
        </div>
        <div class="time">
          <img src="@/assets/img/father/details_ic_time@3x.png" alt=""><span>{{item.created_at}}</span>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="share link" @click="handleShare">
        <img src="@/assets/img/father/details_btn_share_normal@3x.png" alt="">
      </div>
      <div class="vote link" @click="handleVoteup(item.id, item.isVoted)">
        <img :src="item.isVoted ? disVoteIcon : voteIcon" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { newestImagePath } from '@/tools/ObjectHelper'
import disVoteIcon from '@/assets/img/father/details_btn_vote_disable@3x.png'
import voteIcon from '@/assets/img/father/details_btn_vote_normal@3x.png'
export default {
  props: {
    item: {
      type: Object
    },
    handleClose: {
      type: Function,
      required: true
    },
    handleVoteup: {
      type: Function,
      required: true
    },
    handleShare: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      disVoteIcon,
      voteIcon
    }
  },
  computed: {
    smartPath () {
      return newestImagePath(this.item.image, false)
    }
  }
}
</script>
<style lang="less" scoped>
.popUp{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .festival-modal-container{
    width: 80%;
    max-height: 70vh;
    overflow: scroll;
    margin: 0 auto;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    padding: 20px 0;
  }

  .pic{
    width: 92%;
    height: 345px;
    margin: 10px auto 0;
    img{
      width: 100%;
    }
    .cancel{
      right: 0;
      top: 0;
      width: 25px;
      height: 25px;
      img{
        width: 100%;
      }
    }
  }
  .info{
    width: 92%;
    .headSculpture{
      margin: 0 auto;
      border: 5px solid;
      border-top-color: @color-CO;
      border-left-color: @color-CO;
      border-right-color: #eb6b59;
      border-bottom-color: #eb6b59;
      border-radius: 5px;
      position: relative;
      margin-bottom: 10px;
      .img-big{
        display: block;
        min-height: 100px;
        width: 100%;
      }
      .btn-close{
        position: absolute;
        right: 0;
        top: 0;
        width: 20px;
      }
    }
    .title{
      font-size: 17px;
      color: #FF9600;
      line-height: 22px;
      font-weight: 700;
    }
    .synopsis{
      font-size: 13px;
      color:#989898;
      line-height: 20px;
      word-break: break-word;
    }
  }
  .count{
    width: 92%;
    margin: 10px auto 0;
    color: #989898;
    font-size: 12px;
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .num{
      img{
        vertical-align: middle;
        width: 15px;
        margin-top: -3px;
      }
      span{
        margin-left: 5px;
        font-size: @font-S3;
        vertical-align: middle;
      }
    }
    .time{
      img{
        width: 17px;
        width: 17px;
        vertical-align: text-bottom;
      }
      span{
        margin-left: 10px ;
      }
    }
  }
  .bottom{
    width: 80%;
    // border-top: 1px dotted #E2E2E2;
    padding: 10px 10px;
    margin: 20px 10px ;
    display: flex;
    justify-content: space-between;
    .link{
      flex: 1;
      &:not(:last-child){
        margin-right: 15px;
      }
      img{
        width: 100%;
      }
    }
  }
}
</style>
