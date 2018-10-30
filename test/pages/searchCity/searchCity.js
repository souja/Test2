const api = require('../../utils/api.js')

const app = getApp();

Page({
  data: {
    cities: [],
    syncCities: []
  },
  onShow: function() {
    var cityList = app.globalData.cityList;
    if (cityList.length > 0) {
      this.setData({
        cities: cityList,
        syncCities: cityList
      })
    }
  },

  goSearch: function(e) {
    console.log(e);
    var selectedItemIndex = e.currentTarget.dataset.index;
    var sltCity = this.data.syncCities[selectedItemIndex];
    var cityStr = JSON.stringify(sltCity);
    console.log("选中index:" + selectedItemIndex + "," + sltCity.text);

    wx.reLaunch({
      url: '../bookMain/bookMain?city=' + cityStr
    })
  },

  containsInput: function(city, inputVal) {
    var cityName = city.text;
    var cityPy = city.cityPy;
    var cityPyLow = cityPy.toLowerCase();

    if (cityName.indexOf(inputVal) != -1 || cityPy.indexOf(inputVal) != -1 || cityPyLow.indexOf(inputVal) != -1) {
      console.log("push city" + cityName + "," + cityPy + "," + cityPyLow);
      return true;
    }
    return false;
  },
  contiansInputB: function(city, inputVal) {
    var cityName = city.text;
    var cityPy = city.cityPy;
    var cityPyLow = cityPy.toLowerCase();

    var inputs = inputVal.split("");
    var bContain = true;

    var bContainName = true;
    for (var i = 0; i < inputs.length; i++) {
      var curVal = inputs[i];
      if (cityName.indexOf(curVal) == -1) {
        // console.log('name中不包含' + curVal);
        bContainName = false;
        break
      }
    }

    var bContainPy = true;
    for (var i = 0; i < inputs.length; i++) {
      var curVal = inputs[i];
      if (cityPy.indexOf(curVal) == -1) {
        // console.log('pinyin中不包含' + curVal);
        bContainPy = false;
        break
      }
    }

    var bContainPyLow = true;
    for (var i = 0; i < inputs.length; i++) {
      var curVal = inputs[i];
      if (cityPyLow.indexOf(curVal) == -1) {
        // console.log('pinyinLowerCase中不包含' + curVal);
        bContainPyLow = false;
        break
      }
    }
    // console.log('nameContain ' + bContainName + ",pyContain " + bContainPy + ",pyLowContain " + bContainPyLow);
    bContain = bContainName || bContainPy || bContainPyLow;

    return bContain;
  },
  syncList: function(e) {
    var inputVal = e.detail.value;
    var cities = this.data.cities;

    if (inputVal.length == 0) {
      this.setData({
        syncCities: cities
      })
      return;
    }
    var syncList = [];
    for (var i = 0; i < cities.length; i++) {
      var city = cities[i];

      if (this.containsInput(city, inputVal)) {
        syncList.push(city);
      } else if (inputVal.length > 1) {
        if (this.contiansInputB(city, inputVal)) {
          syncList.push(city);
        }
      }
    }
    this.setData({
      syncCities: syncList
    })
  },
  searchCity: function(e) {
    var cityStr = e.detail.value;

    api._post('/city/search', {
      condition: [{
        field: 'text',
        op: '=',
        value: cityStr
      }]
    }).then(res => {
      console.log(res);
      var syncList = [];

      if (res.status == 200) {
        console.log("搜索城市下的公寓列表成功")
        if (res.data.list != null && res.data.list.length > 0)
          syncList.push(res.data.list);
      } else {
        var errMsg = res.errmsg;
        console.log("搜索城市下的公寓列表 err " + errMsg);
      }
      this.setData({
        syncCities: syncList
      })
    }).catch(e => {
      console.log(e)
    })
  }

})