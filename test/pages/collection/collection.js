const app = getApp()
const api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectCount: 0,
    errMsg: null,
    list: null,
    pageIndex: 1,
    pageAmount: 3,
    isScrollLoading: false,
    isScrollLoadingComplete: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var puinfo = wx.getStorage({
      key: 'puinfo',
      success: function(res) {
        console.log("puinfo:" + res.data);
        app.pUserInfo = JSON.parse(res.data);
      }
    })


    this.getCollections(1, true)
  },
  getCollections: function(pageIndex, showLoading) {
    if (showLoading) {
      wx.showLoading({
        title: '加载中..',
        mask: true
      })
    }
    // this.setData({
    //   isScrollLoading: true
    // })
    // 模拟
    // setTimeout(() => {
    //   for (let i = 0; i < 10; i++) {
    //     this.data.list.push(1)
    //   }
    //   wx.hideLoading()
    //   this.setData({
    //     pageIndex: pageIndex,
    //     list: this.data.list,
    //     isScrollLoading: false
    //   })
    // }, 500)

    api._post('/favApartment/search').then(res => {
      console.log(res)

      if (res.status == 200) {
        console.log("获取收藏列表成功")

        this.setData({
          collectCount: res.data.length,
          list: res.data
        })
      } else {
        var errMsg = res.errmsg;
        console.log("获取收藏列表失败 " + errMsg);
        this.setData({
          errMsg: errMsg
        })
      }
    }).catch(e => {
      console.log(e)
      wx.hideLoading()
      app.toast(e.data.errmsg);
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getCollections(1, false);
    wx.stopPullDownRefresh()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.isScrollLoading && this.data.pageIndex < this.data.pageAmount) {
      var index = this.data.pageIndex;
      index++;

      this.setData({
        isScrollLoading: true
      })
      this.getCollections(index, false);
    }
  },

  goRoomDetail: function(e) {
    console.log(e);
    wx.navigateTo({
      url: '../roomDetail/roomDetail?aid=' + e.currentTarget.dataset.aid +
        "&src=" + e.currentTarget.dataset.src
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})