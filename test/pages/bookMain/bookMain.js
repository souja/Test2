const app = getApp();
const api = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    naviIndex: 1,
    pageSize: 20,
    pageIndex: 0,
    pageAmount: 1,

    cityObj: null,
    curCity: null,

    priceDialogVisible: false,
    personCountDialogVisible: false,
    moreDialogVisible: false,

    slider: {
      min: 0,
      max: 10000,
      step: 10,
      left: 0,
      right: 10000
    },
    houseType: 'single', // single | all
    payType: 'day', // day | month

    list: null,
    loading: false,

    priceCheck: false,
    personCountCheck: false,

    roomType: '', //房型
    rentWay: '', //租赁方式
    priceLeft: 0,
    priceRight: 10000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var cityStr = options.city;
    if (cityStr != null) {
      console.log(cityStr);
      var cityObj = JSON.parse(cityStr);
      console.log("搜索：" + cityObj.text);
      this.setData({
        cityObj: cityObj,
        curCity: cityObj.text
      })
    }

    var goOrder = options.order;
    console.log("go order = " + goOrder);
    if (goOrder == 1) {
      wx.navigateTo({
        url: '../order/index',
      })
    }

    //获取列表数据
    this.search()
  },

  //搜索目的地
  goSearch: function(e) {
    wx.redirectTo({
      url: '../searchCity/searchCity',
    })
  },

  //加载更多
  loadMore: function() {
    this.setData({
      loading: true
    })
    this.search();
  },

  //公寓详情
  goRoomDetail: function() {
    wx.navigateTo({
      url: '../roomDetail/roomDetail'
    })
  },

  //搜索列表
  search: function(e) {
    console.log('获取列表数据')

    var pageIndex = this.data.pageIndex;
    pageIndex++;

    var requestParam = {
      page: {
        pageNo: pageIndex,
        pageSize: this.data.pageSize
      }
    };

    console.log("pageIndex=" + pageIndex);

    if (this.data.curCity != null) {
      requestParam.condition = [{
          field: 'text',
          op: '=',
          value: this.data.curCity
        },
        {
          field: 'city',
          op: 'pointer',
          value: this.data.cityObj.id
        }
      ];
    }

    requestParam.price = {
      priceRoomType: this.data.roomType,
      pricePeriodType: this.data.rentWay,
      priceRange: [this.data.priceLeft, this.data.priceRight]
    }

    if (this.data.personCountCheck) {
      // requestParam.personCount=5;
    }

    api._post('/apartment/search', requestParam).then(res => {
      console.log(res);
      if (res.status == 200) {
        console.log("获取第" + pageIndex + "页数据成功")
        var list;
        if (pageIndex == 1) list = [];
        else {
          list = this.data.list;
          if (list == null) list = []
        }

        list = list.concat(res.data.list);

        if (pageIndex == 1) {
          var pageAmount = app.getTotalPageNum(res.data.totalCount, this.data.pageSize);
          console.log("搜索城市下的公寓列表成功 共" + pageAmount + "页")
          this.setData({
            loading: false,
            pageIndex: pageIndex,
            pageAmount: pageAmount,
            list: list
          })
        } else {
          this.setData({
            loading: false,
            pageIndex: pageIndex,
            list: list
          })
        }
      } else {
        var errMsg = res.errmsg;
        console.log("搜索城市下的公寓列表 err " + errMsg);
      }
    }).catch(e => {
      console.log(e)
    })
  },
  preventTouchMove() {},
  //显示，隐藏“价格筛选”
  onTapPriceNav() {
    this.setData({
      priceDialogVisible: !this.data.priceDialogVisible
    })
  },
  //完成
  onTapHidePriceSelect() {
    this.setData({
      priceDialogVisible: false,

    })

    this.search()
  },
  //租赁方式
  onTapPayType(e) {
    let value = e.currentTarget.dataset.type
    if (this.data.payType == value) {
      return
    }
    this.setData({
      payType: value
    })
  },
  //房型
  onTapHouseType(e) {
    let value = e.currentTarget.dataset.type
    console.log(value)
    if (this.data.houseType == value) {
      return
    }
    this.setData({
      houseType: value
    })
  },
  leftSchange(e) {
    var left = e.detail.value
    let right = this.data.slider.right
    if (left > right) {
      this.setData({
        ["slider.left"]: right,
        ["slider.right"]: left
      })
    } else {
      this.setData({
        ["slider.left"]: left
      })
    }
  },
  rightSchange: function(e) {
    var right = e.detail.value
    let left = this.data.slider.left
    if (right < left) {
      this.setData({
        ["slider.left"]: right,
        ["slider.right"]: left
      })
    } else {
      this.setData({
        ["slider.right"]: right
      })
    }
  }
})