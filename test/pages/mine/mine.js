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
    future: 0,
    confirming: 0,
    finished: 0,
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

    this.checkUserInfo();

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
        wx.navigateTo({
          'url': '../login/login'
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
  getCount: function(flag) {
    var condition;
    switch (flag) {
      case 0: //未来入住
        condition = [{
          field: 'status',
          op: '=',
          value: 'CONFIRMED'
        }, {
          field: 'startDate',
          op: '>',
          value: app.getNowFormatDate()
        }]
        break;
      case 1: //正在确认
        condition = []
        break;
      default: //完成旅程
        condition = [{
          field: 'status',
          op: '=',
          value: 'CONFIRMED'
        }, {
          field: 'endDate',
          op: '<=',
          value: app.getNowFormatDate()
        }]
    }

    api._post(flag != 1 ? app.urls.searchOrder : app.urls.confirmingOrderList, {
      condition: condition
    }).then(res => {
      var tag = flag == 0 ? "未来入住" : (flag == 1 ? "正在确认" : "完成旅程");
      console.log(tag)
      console.log(res)


      if (res.status == 200) {
        var length = res.data.list.length;
        console.log(tag + ":" + length);
        if (length > 0) {
          switch (flag) {
            case 0:
              this.setData({
                future: length
              })
              break;
            case 1:
              this.setData({
                confiming: length
              })
              break;
            default:
              this.setData({
                finished: length
              })

          }
        }
      }
    }).catch(e => {
      console.log(e)
    })
  },
  checkUserInfo: function() {
    if (app.globalData.userInfo) {
      console.log("有wx用户数据")
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    if (app.pUserInfo) {
      console.log("有Paires用户数据");
      this.getCount(0); //未来入住
      this.getCount(1); //正在确认
      this.getCount(2); //完成旅程
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})