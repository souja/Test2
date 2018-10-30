//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    array: {
      mode: 'scaleToFill',
      text: 'scaleToFill：不保持纵横比缩放图片，使图片完全适应'
    },
    src: '../../res/imgs/qr.jpg'
  },
  onLoad: function() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  goOrders: function() {
    // wx.navigateTo({
    //   url: '../order/index',
    // })
    wx.reLaunch({
      url: '../bookMain/bookMain?order=1',
    })
    // wx.navigateBack({
    //   delta: 5
    // })
  }
})