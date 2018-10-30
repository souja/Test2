const api = require('../../../utils/api.js');
const py = require('../../../utils/py.js');
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

Component({
  properties: {
    // 根据 url 获取不同的订单列表
    url: {
      type: String,
      value: '' //normal/history/unpaid
    }
  },
  data: {
    unpayOrderList: [],
    weekMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    pageIndex: 0,
    pageAmount: 1,
    isScrollLoading: false,
    isScrollLoadingComplete: false,
    page: -1,
    orderList: [],
    dateDescList: [],
    rentDays: []
  },
  ready() {
    console.log("cur url:" + this.properties.url);
    this.getOrderList()
  },
  methods: {
    onTapGoDetail(e) {
      var index = e.currentTarget.dataset.index;
      app.curOrder = this.data.orderList[index];

      console.log(app.curOrder);
      wx.navigateTo({
        url: '/pages/order/detail'
      })
    },
    onReachBottom() {
      if (this.data.pageIndex >= this.data.pageAmount) return;

      if (!this.data.isScrollLoading && !this.data.isScrollLoadingComplete) {
        this.setData({
          isScrollLoading: true
        })
        this.getOrderList();
      }
    },
    getUnpayOrders(needCount, requestParamIn) {
      var requestParam = {
        condition: [{
          field: 'status',
          op: '=',
          value: 'ORDERED'
        }]
      };
      if (needCount) {
        requestParam.page = {
          pageNo: 1,
          pageSize: 100
        }
      } else {
        requestParam.page = requestParamIn.page;
      }
      api._post('/pairesBooking/search', requestParam).then(res => {
        console.log(res)

        if (res.status == 200) {
          if (res.data == null) {
            this.setData({
              isScrollLoading: false,
            })
            return;
          }
          var list = res.data.list;
          console.log("获取未支付订单列表成功:" + list.length);

          if (needCount) {
            if (list.length > 0) {
              var unpayCount = 0;
              for (var i = 0; i < list.length; i++) {
                var orderObj = list[i];
                if (orderObj.status == "ORDERED") {
                  unpayCount++;
                  console.log("未支付+1," + unpayCount);
                }
              }

              this.triggerEvent('myevent', unpayCount)
            }
          } else {
            this.handleList(list, res.data.totalCount, requestParamIn.page.pageNo);
          }

        } else {
          var errMsg = res.errmsg;
          console.log("获取未支付订单列表失败 " + errMsg);
          this.setData({
            isScrollLoading: false,
          })
        }
      }).catch(e => {
        console.log(e)
      })

    },
    getOrderList() {
      this.setData({
        isScrollLoading: true
      })

      var pageIndex = this.data.pageIndex;
      pageIndex++;

      var requestParam = {
        page: {
          pageNo: pageIndex,
          pageSize: 10
        }
      };
      switch (this.properties.url) {
        case 'history': //过往
          requestParam.condition = [{
            field: 'endDate',
            op: '<=',
            value: app.getNowFormatDate()
          }];
          this.getCommonList(pageIndex, requestParam);
          break;
        case 'unpaid': //未支付
          this.getUnpayOrders(false, requestParam);
          break;
        default: //normal
          requestParam.condition = [{
            field: 'endDate',
            op: '>',
            value: app.getNowFormatDate()
          }];
          this.getUnpayOrders(true);
          this.getCommonList(pageIndex, requestParam);
          break;
      }
    },
    getCommonList(pageIndex, requestParam) {
      api._post('/pairesBooking/search', requestParam).then(res => {
        console.log(res)

        if (res.status == 200) {
          console.log("获取第" + pageIndex + "页订单列表成功")

          if (res.data == null) {
            this.setData({
              isScrollLoading: false,
            })
            return;
          }
          this.handleList(res.data.list, res.data.totalCount, pageIndex);
        } else {
          console.log("获取订单列表失败");
          this.setData({
            isScrollLoading: false,
            errMsg: res.errmsg
          })
        }
      }).catch(e => {
        console.log(e)
      })
    },
    handleList(dataList, totalCount, pageIndex) {
      var list;
      if (pageIndex == 1) {
        list = [];
      } else {
        list = this.data.orderList;
        if (list == null) list = []
      }

      list = list.concat(dataList);

      var dateStrDesc = [];
      var rentDaysList = [];
      for (var i = 0; i < list.length; i++) {
        var order = list[i];

        var dateIn = new Date(order.startDate);
        var dateOut = new Date(order.endDate);

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

        var dateDescObj = {
          inDesc: descIn,
          outDesc: descOut
        }
        dateStrDesc.push(dateDescObj);
        if (this.properties.url == 'unpaid') {
          var rentDays = app.calcDays(dateIn, dateOut);
          console.log(rentDays + "晚");
          rentDaysList.push(rentDays);
        }
      }
      if (pageIndex == 1) {
        var pageAmount = app.getTotalPageNum(totalCount, 10);
        console.log("共" + pageAmount + "页")

        this.setData({
          isScrollLoading: false,
          rentDays: rentDaysList,
          dateDescList: dateStrDesc,
          pageIndex: pageIndex,
          pageAmount: pageAmount,
          orderList: list,
        })
      } else {
        this.setData({
          isScrollLoading: false,
          rentDays: rentDaysList,
          dateDescList: dateStrDesc,
          pageIndex: pageIndex,
          orderList: list
        })
      }
    },
    requestPay(orderId) {
      api._post('/pairesBooking/wxmpPay', {
        bookingID: orderId
      }).then(res => {
        console.log(res)

        if (res.status == 200) {
          console.log("请求支付接口成功");

        } else {
          console.log("请求支付接口成功失败");
          app.toast(res.errMsg);
        }
      }).catch(e => {
        console.log(e)
      })
    }
  }
})