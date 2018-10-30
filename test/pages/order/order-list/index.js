const api = require('../../../utils/api.js');
const py = require('../../../utils/py.js');
const app = getApp();

Component({
  properties: {
    // 根据 url 获取不同的订单列表
    url: {
      type: String,
      value: '' //normal/history/unpay
    }
  },
  data: {
    unpayOrderList: [],
    pageIndex: 0,
    pageAmount: 1,
    isScrollLoading: false,
    isScrollLoadingComplete: false,
    page: -1,
    orderList: []
  },
  ready() {
    console.log("cur url:" + this.properties.url);
    this.getOrderList()
  },
  methods: {
    onTapGoDetail(e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/order/detail?id=${id}`
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
      api._post('/pairesBooking/search', needCount ? {
        page: {
          pageNo: 1,
          pageSize: 100
        },
        condition: [{
          field: 'status',
          op: '=',
          value: 'ORDERED'
        }]
      } : requestParamIn).then(res => {
        console.log(res)

        if (res.status == 200) {

          var list = res.data.list;
          console.log("获取未支付订单列表成功:" + listSize);

          if (needCount) {
            var listSize = list.length;
            if (listSize > 0) {
              var unpayCount = 0;
              for (var i = 0; i < listSize; i++) {
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
            op: '<',
            value: app.getNowFormatDate()
          }];
          this.getCommonList(pageIndex, requestParam);
          break;
        case 'unpay': //未支付
          this.getUnpayOrders(false, requestParam);
          break;
        default: //normal
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

          this.handleList(res.data.list, res.data.totalCount, pageIndex);
        } else {
          var errMsg = res.errmsg;
          console.log("获取订单列表失败 " + errMsg);
          this.setData({
            errMsg: errMsg
          })
          app.toast(errMsg);
        }
      }).catch(e => {
        console.log(e)
        app.toast(e.data.errmsg);
      })
    },
    handleList(dataList, totalCount, pageIndex) {
      var list;
      if (pageIndex == 1) list = [];
      else {
        list = this.data.orderList;
        if (list == null) list = []
      }

      list = list.concat(dataList);

      if (pageIndex == 1) {
        var pageAmount = app.getTotalPageNum(totalCount, 10);
        console.log("共" + pageAmount + "页")

        this.setData({
          isScrollLoading: false,
          pageIndex: pageIndex,
          pageAmount: pageAmount,
          orderList: list
        })
      } else {
        this.setData({
          isScrollLoading: false,
          pageIndex: pageIndex,
          orderList: list
        })
      }
    }
  }
})