/**
 * 解析用户个人资料，老用户的个人资料可能为富文本，尽可能去掉这部分html标签
 */
import nl2br from 'nl2br'

const parseInfos = (value) => {
  const info = value
    .replace(/<p>|<\/p>|<br \/>|NULL|null|&nbsp;/g, '')
    .replace(/<(img|iframe|br).*>/, '')
    .replace(/<embed.*>.*<\/embed>/, '')
    .replace(/<a.*>.*<\/a>/, '')
    .replace(/<br \/>$/, '')
    .trim()
  return nl2br(info)
}

export default parseInfos
