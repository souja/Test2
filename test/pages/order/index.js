const api = require('../../utils/api.js');
const py = require('../../utils/py.js');
const app = getApp();

Page({
  data: {
    unpayCount: 0,
    currentNav: "normal",
    navFirstClass: "nav-item-on",
    navSecondClass: ""
  },
  onDataReady: function(e) {
    console.log(e);
    this.setData({
      unpayCount: e.detail
    })
  },
  // 订单关联(上拉加载更多)
  onReachBottom() {
    if (this.data.currentNav == "normal") {
      this.selectComponent("#order-list-component").onReachBottom()
    } else {
      this.selectComponent("#order-history-list-component").onReachBottom()
    }
  },
  onTapShowNav(e) {
    let nav = e.currentTarget.dataset.nav
    if (this.data.currentNav == nav) {
      return
    }
    if (nav == "normal") {
      this.setData({
        currentNav: "normal",
        navFirstClass: "nav-item-on",
        navSecondClass: ""
      })
    } else {
      this.setData({
        currentNav: "history",
        navFirstClass: "",
        navSecondClass: "nav-item-on"
      })
    }
  },
  onShow: function() {
    if (app.curOrder != null) app.curOrder = null;
  }
})