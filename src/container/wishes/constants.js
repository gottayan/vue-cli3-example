import wishImg from '@/assets/img/wishes/wish_title_ic_wish@2x.png'
import adopterImg from '@/assets/img/wishes/wish_title_ic_adoption@2x.png'
import wordImg from '@/assets/img/wishes/wish_title_ic_talk@2x.png'

export const statusMap = (wishes) => {
  return {
    'on': wishes ? '認養' : '我要認養',
    'end': '已認養',
    'done': '認養已送達'
  }
}

export const requestCardMap = (name) => {
  return {
    'wish': {
      title: `來自<span style="color:rgb(255,165,0)">${name || ''}</span>小朋友的心願`,
      icon: wishImg
    },
    'adopter': {
      title: '心願認養人',
      icon: adopterImg
    },
    'word': {
      title: '感謝的話',
      icon: wordImg
    }
  }
}

export const schoolMap = {
  '2018': {
    '嘉義縣過路國小': '過路國小',
    '嘉義縣南興國小': '南興國小'
  },
  '2017': {
    '嘉義縣鹿草鄉 碧潭國小': '碧潭國小',
    '嘉義縣鹿草鄉 竹園國小': '竹園國小'
  }
}
