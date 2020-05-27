import localForage from 'localforage'
// 基于localforage做了一个简单的封装，全部采用异步的方式进行操作，设置完以后会返回一个promise对象，我们可以接收到promise对象进行处理
// 基于localforage库来实现电子书的缓存，这个缓存其实是缓存在浏览器indexedDB，也就是手机或者PC的本地

export function setLocalForage(key, data, cb, cb2) {
  localForage.setItem(key, data).then((value) => {
    if (cb) cb(value)
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}

export function getLocalForage(key, cb) {
  localForage.getItem(key, (err, value) => {
    cb(err, value)
  })
}

export function removeLocalForage(key, cb, cb2) {
  localForage.removeItem(key).then(function() {
    if (cb) cb()
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}

export function clearLocalForage(cb, cb2) {
  localForage.clear().then(function() {
    if (cb) cb()
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}

export function lengthLocalForage(cb) {
  localForage.length().then(
    numberOfKeys => {
      if (cb) cb(numberOfKeys)
      console.log(numberOfKeys)
    }).catch(function(err) {
    console.log(err)
  })
}

export function iteratorLocalForage() {
  localForage.iterate(function(value, key, iterationNumber) {
    console.log([key, value])
  }).then(function() {
    console.log('Iteration has completed')
  }).catch(function(err) {
    console.log(err)
  })
}

// 判断我们当前浏览器是否支持indexedDB数据库
export function support() {
  const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null
  if (indexedDB) {
    return true
  } else {
    return false
  }
}
