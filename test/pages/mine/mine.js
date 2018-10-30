const app = getApp()
const api = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    naviIndex: 2,
    pUserInfo: null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    weilai: 6,
    zhengzai: 66,
    wancheng: 666,
    textMenuItems: [{
        title: "成为超级房东",
        subTitle: "托管房屋&nbsp;&nbsp;坐享收益",
        link: "../besuper/besuper"
      },
      {
        title: "成为联合房东",
        subTitle: "共同管理&nbsp;&nbsp;更低房租",
        link: "../beunion/beunion"
      },
      {
        title: "品牌房源入住"
      },
      {
        title: "服务协议"
      },
      {
        title: "关于Paires友舍"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              console.log("已经授权过");
              console.log(res.userInfo)
              //用户已经授权过
            }
          })
        } else {
          console.log("没有授权过");
        }
      }
    })

    if (app.globalData.userInfo) {
      console.log("有数据")
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      console.log("可以用")
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      console.log("没数据")
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res);
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    console.log(this.data.hasUserInfo + " " + this.data.canIUse);

    const ctx1 = wx.createCanvasContext('stara')
    ctx1.setFillStyle('#E6E522')
    ctx1.translate(40, 19);
    ctx1.rotate(45 * Math.PI / 180)
    ctx1.fillRect(0, 0, 6, 6)
    ctx1.draw()



    const ctx2 = wx.createCanvasContext('starb')
    ctx2.setFillStyle('#E6E522')
    ctx2.translate(84, 49);
    ctx2.rotate(45 * Math.PI / 180)
    ctx2.fillRect(0, 0, 6, 6)
    ctx2.draw()



    const ctx3 = wx.createCanvasContext('starc')
    ctx3.setFillStyle('#E6E522')
    ctx3.translate(94, 103);
    ctx3.rotate(45 * Math.PI / 180)
    ctx3.fillRect(0, 0, 6, 6)
    ctx3.draw()



    const ctx4 = wx.createCanvasContext('stard')
    ctx4.setFillStyle('#E6E522')
    ctx4.translate(265, 71);
    ctx4.rotate(45 * Math.PI / 180)
    ctx4.fillRect(0, 0, 10, 10)
    ctx4.draw()


    const ctx5 = wx.createCanvasContext('stare')
    ctx5.setFillStyle('#E6E522')
    ctx5.translate(286, 28);
    ctx5.rotate(45 * Math.PI / 180)
    ctx5.fillRect(0, 0, 4, 4)
    ctx5.draw()

    const ctx6 = wx.createCanvasContext('starf')
    ctx6.setFillStyle('#E6E522')
    ctx6.translate(338, 103);
    ctx6.rotate(45 * Math.PI / 180)
    ctx6.fillRect(0, 0, 6, 6)
    ctx6.draw()

    // ctx.setFillStyle('red')
    // ctx.translate(15, 45);
    // ctx.fillRect(0, 0, 4, 4)

    // ctx.setFillStyle('green')
    // ctx.translate(0, 55);
    // ctx.moveTo(100,100)
    // ctx.fillRect(0, 0, 4, 4)
  },

  getUserInfo: function(e) {
    wx.getUserInfo({
      success: res => {
        console.log("获取用户信息成功")
        console.log(res);
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
        var puinfo = wx.getStorage({
          key: 'puinfo',
          success: function(res) {
            console.log("有缓存")
            console.log("pUserInfo:" + res.data);
            app.pUserInfo = JSON.parse(res.data);
          },
          complete: function(res) {
            console.log("没有缓存")
            wx.navigateTo({
              'url': '../login/login'
            })
          }
        })
      }
    })
  },
  checkPUInfo: function(o) {
    if (app.pUserInfo == null) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else if (!app.pUserInfo.mobileVerified) {
      console.log("未验证手机号");
      wx.navigateTo({
        url: '../finishRegister/finishRegister?phone=' + app.pUserInfo.mobile
      })
    } else if (!app.pUserInfo.isLinkWeAPP) {
      api._post(app.urls.bindAccount, {
        code: app.globalData.wxCode
      }).then(res => {
        console.log(res);
        if (res.status == 200) {
          wx.reLaunch({
            url: '../mine/mine'
          });
        }
      }).catch(e => {
        console.log(e);
        app.toast(e.data.errmsg);
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})