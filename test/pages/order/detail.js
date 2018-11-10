const api = require('../../utils/api.js');
const py = require('../../utils/py.js');
const app = getApp();

Date.prototype.Format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

Page({
  data: {
    weekMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    status: 'unpaid',
    currentNav: "normal",
    navFirstClass: "nav-item-on",
    navSecondClass: "",
    showCancelDialog: false,
    showCancelSuccessDialog: false
  },
  onLoad(opt) {
    // this.getOrderDetail();
    var dateIn = new Date(app.curOrder.startDate);
    var dateOut = new Date(app.curOrder.endDate);

    var inDateStr = dateIn.Format("yyyy-MM-dd");
    var inDateArr = inDateStr.split('-');
    var descIn = inDateArr[1] + '月' + inDateArr[2] + '日';
    var inDateWeek = this.data.weekMap[app.toDate(inDateStr).getDay()]
    descIn += " " + inDateWeek;
    console.log(descIn);

    var outDateStr = dateOut.Format("yyyy-MM-dd");
    var outDateArr = outDateStr.split('-');
    var descOut = outDateArr[1] + '月' + outDateArr[2] + '日';
    var outDateWeek = this.data.weekMap[app.toDate(outDateStr).getDay()]
    descOut += " " + outDateWeek;
    console.log(descOut);

    var rentDays = app.calcDays(dateIn, dateOut);
    console.log(rentDays + "晚");

    this.setData({
      rentDays: rentDays,
      inDesc: descIn,
      outDesc: descOut,
      orderDetail: app.curOrder
    })
  },
  requstPay: function() {
    // api._post(app.urls.requestPay, {
    //   bookingID: this.data.orderDetail.id
    // }).then(res => {
    //   console.log(res)

    //   if (res.status == 200) {

    //     console.log("请求支付成功");

    //   } else {
    //     var errMsg = res.errmsg;
    //     console.log("请求支付失败 " + errMsg);
    //   }
    // }).catch(e => {
    //   console.log(e)
    // })
    var timeStamp = Date.parse(new Date()) / 1000;
    console.log('timeStamp:' + timeStamp);
    var nonceStr = '';
    console.log('nonceStr:' + nonceStr);
    // wx.requestPayment({
    //   timeStamp: timeStamp,
    //   nonceStr: '',
    //   package: '',
    //   signType: '',
    //   paySign: '',
    // })
    app.toast("todo")
  },
  preventTouchMove() {},
  onTapShowCancelDialog() {
    this.setData({
      showCancelDialog: true
    })
  },
  onTapHideCancelDialog() {
    this.setData({
      showCancelDialog: false
    })
  },
  onTapRealCancelOrder() {
    // TODO test
    this.setData({
      showCancelDialog: false,
      showCancelSuccessDialog: true
    })
  },
  onTapCloseSuccessDialog() {
    this.setData({
      showCancelSuccessDialog: false
    })
  },
  //当前是用的列表中的数据，是否需要联网再获取一次订单详情
  getOrderDetail() {
    api._get('/pairesBooking/' + app.curOrder.id, {
      condition: []
    }).then(res => {
      console.log(res)

      if (res.status == 200) {

        console.log("获取订单详情成功");

      } else {
        var errMsg = res.errmsg;
        console.log("获取订单详情失败 " + errMsg);
      }
    }).catch(e => {
      console.log(e)
    })

  }
})