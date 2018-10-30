// pages/verifyCodeSent/verifyCodeSent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    time: '发送验证码', //倒计时 
    currentTime: 59,
    inputDisable:true,
    phoneInsed:"13344445555"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  getCode: function(options) {
    var that = this;
    var currentTime = that.data.currentTime;

    that.setData({
      time: currentTime + '秒后可重发'
    });

    var interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: currentTime + '秒后可重发'
      });
      if (currentTime <= 0) {
        clearInterval(interval);
        that.setData({
          time: '发送验证码',
          currentTime: 59,
          disabled: false
        });
      }
    }, 1000);
  },
  getVerificationCode() {
    this.getCode();
    var that = this;
    that.setData({
      disabled: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getVerificationCode();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})