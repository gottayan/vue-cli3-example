/**
 * 矫正iOS设备拍照图片方向不正确的问题
 */
import EXIF from 'exif-js'
import dataURLtoBlob from 'blueimp-canvas-to-blob'

const extractByOrientation = (file, orientation, uploadcb) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const reader = new FileReader()
  const img = new Image()
  let imgWidth = ''
  let imgHeight = ''
  reader.readAsDataURL(file)
  reader.onload = function (e) {
    img.src = e.target.result
    img.onload = function () {
      imgWidth = this.width
      imgHeight = this.height
      canvas.width = imgWidth
      canvas.height = imgHeight
      if (orientation !== 1) {
        switch (orientation) {
          case 3:
            ctx.rotate(Math.PI)
            ctx.drawImage(this, -imgWidth, -imgHeight, imgWidth, imgHeight)
            break
          case 6:
            canvas.width = imgHeight
            canvas.height = imgWidth
            ctx.rotate(Math.PI / 2)
            ctx.drawImage(this, 0, -imgHeight, imgWidth, imgHeight)
            break
          case 8:
            canvas.width = imgHeight
            canvas.height = imgWidth
            ctx.rotate(3 * Math.PI / 2)
            ctx.drawImage(this, -imgWidth, 0, imgWidth, imgHeight)
            break
        }
        uploadcb(dataURLtoBlob(canvas.toDataURL('image/jpeg', 0.7)), e.target.result)
      }
    }
  }
}

const extractNormal = (image, uploadcb) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  // 瓦片canvas
  const tCanvas = document.createElement('canvas')
  const tctx = tCanvas.getContext('2d')

  const img = new Image()
  const reader = new FileReader()
  reader.readAsDataURL(image)
  reader.onload = function (e) {
    img.src = e.target.result
    img.onload = function () {
      let width = this.width
      let height = this.height
      // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio = width * height / 10000000
      if (ratio > 1) {
        ratio = Math.sqrt(ratio)
        width /= ratio
        height /= ratio
      } else {
        ratio = 1
      }

      // canvas 清屏
      ctx.fillStyle = '#fff'
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // 重置canvas宽高
      canvas.width = width
      canvas.height = height
      // 绘制
      // 如果图片像素大于100万则使用瓦片绘制
      let count = width * height / 1000000
      if (count > 1) {
        // 计算要分成多少块瓦片
        count = ~~(Math.sqrt(count) + 1)
        // 计算每块瓦片的宽和高
        const nw = ~~(width / count)
        const nh = ~~(height / count)

        tCanvas.width = nw
        tCanvas.height = nh

        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(this, i * nw * ratio, j * nh * ratio,
              nw * ratio, nh * ratio, 0, 0, nw, nh)

            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
          }
        }
      } else {
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height)
      }
      uploadcb(dataURLtoBlob(canvas.toDataURL('image/jpeg', 0.7)), e.target.result)
    }
  }
}

const checkPic = function (file, uploadcb) {
  let orientation = ''
  EXIF.getData(file, function () {
    orientation = EXIF.getTag(this, 'Orientation')
    if (!orientation || orientation === 1) {
      extractNormal(file, uploadcb)
    } else {
      // exif-orientation 拍摄照片非“正”时
      extractByOrientation(file, orientation, uploadcb)
    }
  })
}

export default checkPic
