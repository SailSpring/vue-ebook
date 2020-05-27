import axios from 'axios'
import { setLocalForage } from '../utils/localForage'
// 用来做api请求 整个store.js文件

export function flatList() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/flat-list`
  })
}

export function download (book, onSuccess, onError, onProgress) {
 if (!onProgress) {
   onProgress = onError
   onError = null
 }
 // creat会返回一个axios的实例，通过实例的get方法来实现请求
 return axios.create({
   baseURL: process.env.VUE_APP_EPUB_URL,
   method: 'get',
   responseType: 'blob',
   timeout: 180 * 1000,
 //  监听下载时的进度变化，axios提供了onDownloadProgress
   onDownloadProgress: progressEvent => {
     // 如果onProgress存在，调onProgress的回调，把progressEvent传进去
     if (onProgress) onProgress(progressEvent)
   }
 }).get(`${book.categoryText}/${book.fileName}.epub`)
//  会返回一个promise对象，通过then进行异步操作
   .then(res => {
     // 对电子书进行处理,首先获取到Blob对象,这个blob对象epub.js可以直接打开
     const blob = new Blob([res.data])
     // 通过localforage库将其存入浏览器的indexedDB
     setLocalForage(book.fileName, blob, () => {
       if (onSuccess) onSuccess(book)
     }, err => {
       if (onError) onError(err)
     })
   }).catch(err => {
     if (onError) onError(err)
   })
}

// 然后开放一个方法,定义一个接口
export function shelf() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
  })
}

// 然后开放一个方法,定义一个接口
export function home() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}

export function list() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}

export function detail (book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}
