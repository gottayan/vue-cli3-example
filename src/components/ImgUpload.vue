<template>
  <div class="imgupload-container">
    <div class="thumb-item"
      :style="{ width: thumbSize + 'px', height: thumbSize + 'px' }"
      v-show="item.url"
      :key="index"
      v-for="(item, index) in imgList">
      <img :src="smartImagePath(item.url)" alt="" >
      <span class="delete">
        <i @click="removeImg(index, attach)" class="icon"></i>
      </span>
    </div>
    <div class="upload-loading" v-show="isLoaded">
      <inline-loading>
      </inline-loading>
      <span style="vertical-align:middle;display:inline-block;font-size:14px;">&nbsp;&nbsp;上傳中...</span>
    </div>
    <vue-core-image-upload
      v-if="maxLength > imgList.length && !isLoaded"
      :crop="crop"
      @imagechanged="imagechanged"
      :isXhr="false"
      inputAccept="image/jpg,image/jpeg,image/png"
      :class="['upload-wrapper']"
      :multiple="multiple"
      :multiple-size="maxCount"
      @errorhandle="errorhandle"
    >
      <slot name="uploadIcon">
        <img class="upload-icon"
          :style="{ width: thumbSize + 'px', height: thumbSize + 'px' }"
          :src="UploadIcon"
          alt=""/>
      </slot>
    </vue-core-image-upload>
  </div>
</template>

<script>
import { InlineLoading } from 'vux'
import UploadIcon from '@/assets/img/com_list_ic_picture_add_normal@2x.png'
import VueCoreImageUpload from 'vue-core-image-upload'
import checkPic from '@/tools/checkImg'
import { smartImagePath } from '@/tools/ObjectHelper'
import thingApi from '@/store/apis/thing'

export default {
  components: {
    VueCoreImageUpload,
    InlineLoading
  },
  data () {
    return {
      UploadIcon,
      thumbList: [],
      smartImagePath
    }
  },
  props: {
    imgloaded: {
      type: Function
    },
    imgupload: {
      type: Function
    },
    removeImg: {
      type: Function
    },
    type: {
      type: String,
      default: 'resource'
    },
    maxLength: {
      type: [String, Number],
      default: 3
    },
    crop: {
      type: Boolean,
      default: false
    },
    maxFileSize: {
      type: Number,
      default: 4194304
    },
    isLoaded: {
      type: Boolean,
      default: false
    },
    imgList: {
      type: Array,
      default: function () {
        return []
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    thumbSize: {
      type: Number,
      default: 100
    },
    attach: {
      type: Object
    }
  },
  computed: {
    maxCount () {
      if (this.multiple) {
        return this.maxLength - this.imgList.length
      }

      return 0
    }
  },
  methods: {
    imagechanged (file) {
      console.log('imagechanged', file)
      this.$emit('upLoading', true, this.attach)
      if (this.multiple) {
        if (file instanceof FileList) {
          this.uploadFiles(file)
        } else {
          checkPic(file, (blobArg, src) => {
            this.thumbList = [...this.thumbList, {src: src}]
            thingApi.uploadImgNew(blobArg, this.type, true)
              .then(data => this.imgloaded([data]))
          })
        }
      } else {
        checkPic(file, (blobArg, src) => {
          this.thumbList = [...this.thumbList, {src: src}]
          thingApi.uploadImgNew(blobArg, this.type, true)
            .then(data => this.imgloaded(data))
        })
      }
    },
    uploadFiles (files) {
      let count = files.length
      let uploadFiles = []
      let cb = (blobArg, src) => {
        this.thumbList.push({src: src})
        uploadFiles.push(blobArg)
        count--
        if (count === 0) {
          this.uploadMultiple(uploadFiles)
            .then((results) => this.imgloaded(results))
        }
      }
      for (let obj of files) {
        checkPic(obj, cb)
      }
    },
    async uploadMultiple (files) {
      let results = []
      for (let file of files) {
        try {
          const res = await thingApi.uploadImgNew(file, this.type, true)
          console.log(file, res)
          results.push(res)
        } catch (err) {
          console.log(err)
        }
      }
      return results
    },
    errorhandle (err) {
      console.log(err)
      this.$vux.toast.text('請最多選擇' + this.maxCount + '張圖片')
    }
  }
}
</script>
<style lang="less">
  .imgupload-container{
    &:after{
      display: none;
    }
  }
</style>

<style lang="less" scoped>
  @import "./../global.style.less";
  .imgupload-container{
    display: flex;
    align-items: center;
  }
  .upload-wrapper{
    display: inline-block;
  }
  .upload-icon{
    width: 100px;
    display: block;
  }
  .thumb-item{
    position: relative;
    width: 100px;
    height: 100px;
    overflow: hidden;
    display: inline-block;
    margin-right: @pm-bg;
    img {
      height: 100%;
      .center-horizontal;
    }
    .delete{
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, .3);
      i.icon{
        display: inline-block;
        width: 44px;
        height: 44px;
        background: url('../assets/icon/extort/com_list_ic_picture_delete_normal@2x.png') center center no-repeat;
        background-size: 44px 44px;
      }
    }
  }
  .upload-loading{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
  }
</style>
