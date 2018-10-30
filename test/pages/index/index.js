const api = require('../../utils/api.js');
const py = require('../../utils/py.js');
const app = getApp();

Page({
  data: {
    test: false,
    naviIndex: 0,
    cityErrMsg: null,
    apartmentErrMsg: null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cities: null,
    apartments: null,
    apIndex: 1,
    apTotalPage: 1,
    success: null,
    fail: null
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onLoad: function() {

    var puinfo = wx.getStorage({
      key: 'puinfo',
      success: function(res) {
        console.log("index-get pUserInfo suc")
        console.log(res.data);
        app.pUserInfo = JSON.parse(res.data);
      }
    })
   

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (app.globalData.cityList == null) {
      console.log("no city")
      this.getCities()
    } else {
      console.log("yes city")
      this.setData({
        cities: app.globalData.cityList
      })
    }

    if (app.globalData.aptmts == null) {
      console.log("no aptmts")
      this.getApartments()
    } else {
      console.log("yes aptmts")
      this.setData({
        apartments: app.globalData.aptmts
      })
    }

  },
  //获取城市列表
  getCities: function(e) {

    api._get('/city').then(res => {
      console.log(res)
      this.setData({
        success: JSON.stringify(res)
      })

      if (res.status == 200) {
        console.log("获取城市成功")
        var datas = res.data;
        for (var i = 0; i < datas.length; i++) {
          var pinyin = py.ConvertPinyin(datas[i].text)
          if (pinyin.length >= 1) {
            var first = pinyin.substr(0, 1).toUpperCase();
            var spare = pinyin.substr(1, pinyin.length);
            pinyin = first + spare;
          }
          datas[i].cityPy = pinyin;
          datas[i].src = "../../res/imgs/ic_cd_bg.png";
        }

        datas.sort(function(ca, cb) {
          return ca.sequence - cb.sequence;
        })

        if (datas.length > 0)
          app.globalData.cityList = datas;
        this.setData({
          cities: datas
        })

      } else {
        var errMsg = res.errmsg;
        console.log("get cities err " + errMsg);
        this.setData({
          cityErrMsg: errMsg
        })
      }
    }).catch(e => {
      console.log(e)
      this.setData({
        fail: JSON.stringify(e)
      })

    })
  },


  //获取热门公寓列表!!!!!!!!!!!!!!!!!!!!!!!!
  getApartments: function(e) {
    api._post('/apartment/popularList', {
      page: {
        pageNo: this.data.apIndex,
        pageSize: 20
      }
    }).then(res => {
      console.log(res);
      if (res.status == 200) {
        console.log("获取热门公寓成功")
        var list = res.data.list;

        var cityMap = new Map();
        var aptmts = [];

        for (var i = 0; i < list.length; i++) {

          var cityObj = list[i];

          var cityName = cityObj.city.text;

          var brandText = cityObj.brand.text;
          switch (brandText) {
            case '友舍':
              cityObj.mBrandSrc = "../../res/imgs/logo-ys.png";
              break;
            case 'LOFT42':
              cityObj.mBrandSrc = "../../res/imgs/logo-loft.jpg";
              break;
            case '共享际':
              cityObj.mBrandSrc = "../../res/imgs/logo-gxj.png";
              break;
            case 'iHome':
              cityObj.mBrandSrc = "../../res/imgs/logo-ihome.jpg";
              break;
            case '青舍':
              cityObj.mBrandSrc = "../../res/imgs/logo-qs.jpg";
              break;
            case '猫系屋企':
              cityObj.mBrandSrc = "../../res/imgs/logo-mxwq.jpg";
              break;
            default:
              cityObj.mBrandSrc = "";
          }

          //map将公寓按城市归类
          let cityArr = cityMap.get(cityName);
          if (cityArr == null) cityArr = [];

          cityArr.push(cityObj);

          cityMap.set(cityName, cityArr);
        }

        for (let key of cityMap.keys()) {

          var pinyin = py.ConvertPinyin(key);
          if (pinyin.length >= 1) {
            var first = pinyin.substr(0, 1).toUpperCase();
            var spare = pinyin.substr(1, pinyin.length);
            pinyin = first + spare;
          }

          aptmts.push({
            'name': key,
            'py': pinyin,
            'list': cityMap.get(key)
          });

          console.log(key + "&" + pinyin + "&" + cityMap.get(key).length);
        }
        if (aptmts.length > 0)
          app.globalData.aptmts = aptmts;
        this.setData({
          apartments: aptmts
        })

        console.log("总共" + res.data.totalCount + "条数据");

      }
    }).catch(e => {
      console.log(e);
    })
  },
  goSearch: function(e) {
    wx.navigateTo({
      url: '../searchCity/searchCity',
    })
  },
  sortCity: function(cityA, cityB) {
    if (cityA.sequence == null) cityA.sequence = -1;
    if (cityB.sequence == null) cityB.sequence = -1;
    return cityA.sequence - cityB.sequence;
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("底部》。。");
    var curPageIndex = this.data.apIndex;
    var totalPage = this.data.apTotalPage;

    if (curPageIndex >= totalPage) {
      console.log("没有更多..");
      return;
    }
    curPageIndex++;
    console.log("加载下一页" + curPageIndex);
    this.setData({
      apIndex: curIndex
    })
    getApartments()
  },
  goRoomDetail: function(e) {
    console.log(e);
    wx.navigateTo({
      url: '../roomDetail/roomDetail?aid=' + e.currentTarget.dataset.aid +
        "&src=" + e.currentTarget.dataset.src
    })
  }
})