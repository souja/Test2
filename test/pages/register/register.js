const app = getApp()
const api = require('../../utils/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: null,
    pwd: null,
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }

  },
  //跳转‘发送验证码’页面
  goVerify: function(e) {
    var phone = this.data.phone;
    if (!app.validatemobile(phone)) return;
    var passwd = this.data.pwd;
    if (!passwd) {
      app.toast("请输入密码");
      return;
    }
    if (passwd.length < 6) {
      app.toast("密码不能少于6位");
      return;
    }
    var username = this.data.userInfo ? this.data.userInfo.nickName : '';
    console.log('nickname:' + username);

    api._post(app.urls.signUp, {
      username: username,
      mobile: phone,
      password: passwd
    }).then(res => {

      console.log(res);
      if (res.status == 200) {
        res.data.phoneVerified = false;
        app.pUserInfo = res.data;

        wx.setStorage({
          key: "puinfo",
          data: JSON.stringify(res.data)
        })
        wx.navigateTo({
          url: '../finishRegister/finishRegister?phone=' + phone
        });
      }
    }).catch(e => {
      console.log(e);
      app.toast(e.data.errmsg);
    })

  },
  //跳转登录页
  goLogin: () => {
    wx.navigateTo({
      url: '../login/login'
    });
  },
  //输入手机号
  setupPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //输入密码
  setupPwd: function(e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getUserInfo: function(e) {
    wx.getUserInfo({
      success: res => {
        console.log("获取用户信息成功")
        console.log(res);
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
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