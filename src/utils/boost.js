// 针对数组做一个扩展，增加一个方法。push不重复的元素
// 引入到main.js中

// eslint-disable-next-line no-extend-native
Array.prototype.pushWithoutDuplicate = function () {
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    if (this.indexOf(arg) === -1) {
      this.push(arg)
    }
  }
}
