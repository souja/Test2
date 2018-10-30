const api = require('../../utils/api.js')

const app = getApp()

Page({
  data: {
    nick: null,
    real: null,
    wxNo: null,
    aptId: null,
    roomId: null,
    idType: "chinaID",
    idNo: null,
    phoneNo: null,
    items: [{
        name: 'chinaID',
        value: '身份证',
        checked: 'true'
      },
      {
        name: 'passport',
        value: '护照'
      },
    ],
    array: ['中国 +86'], //, '美国 +1', '巴西 +55', '日本 +81'
    index: 0
  },
  radioChange: function(e) {
    var typeStr = e.detail.value;
    console.log('当前选择', typeStr)
    this.setData({
      idType: typeStr
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(options) {
    var obj = JSON.parse(options.obStr);

    this.setData({
      curObj: obj
    })

  },
  syncNick: function(e) {
    console.log(e.detail.value);
    this.data.nick = e.detail.value;
  },
  syncReal: function(e) {
    console.log(e.detail.value);
    this.data.real = e.detail.value;
  },
  syncWxNo: function(e) {
    console.log(e.detail.value);
    this.data.wxNo = e.detail.value;
  },
  syncIdNo: function(e) {
    console.log(e.detail.value);
    this.data.idNo = e.detail.value;
  },
  syncPhone: function(e) {
    console.log(e.detail.value);
    this.data.phoneNo = e.detail.value;
  },
  /**
   * 支付
   */
  pay: function() {
    var nick = this.data.nick;
    if (nick == null || nick == undefined || nick.length == 0) {
      app.toast("昵称不能为空");
      return;
    }


    var real = this.data.real;
    if (real == null || real == undefined || real.length == 0) {
      app.toast("真实姓名不能为空");
      return;
    }


    var wxNo = this.data.wxNo;
    if (wxNo == null || wxNo == undefined || wxNo.length == 0) {
      app.toast("微信号不能为空");
      return;
    }

    var idNo = this.data.idNo;
    if (idNo == null || idNo == undefined || idNo.length == 0) {
      app.toast("证件号码不能为空");
      return;
    }

    var phoneNo = this.data.phoneNo;
    if (phoneNo == null || phoneNo == undefined || phoneNo.length == 0) {
      app.toast("手机号码不能为空");
      return;
    }


    var curOb = this.data.curObj;

    curOb.nickName = nick;
    curOb.realName = real;
    curOb.wechatAccountName = wxNo;
    curOb.documentType = this.data.idType;
    curOb.documentValue = idNo;
    curOb.mobileCountryCode = "86";
    curOb.mobileLocalNumber = phoneNo;

    console.log(JSON.stringify(curOb));

    api._post('/pairesBooking/create', curOb).then(res => {
      console.log(res);
      // switch (res.status) {
      //   case 200:
      //     break;
      //   case 403:
      //     wx.navigateTo({
      //       url: '../login/login',
      //     })
      //     break;
      // }
      if (res.status == 200) {
        console.log("下单成功")
        wx.navigateTo({
          url: '../pay/pay',
        })
      } else {
        var errMsg = res.errmsg;
        console.log("下单 err " + errMsg);
        app.toast(errMsg);
      }
    }).catch(e => {
      console.log(e)
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})