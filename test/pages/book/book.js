const app = getApp();
const api = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    chooseStatus: 0, //选中状态   
    //////////////////////////////
    hideMain: false,
    hidePicker: true,
    aptId: null,
    roomId: null,
    hotelInfo: [],
    roomIndex: 0,
    hotelpeople: [1],
    countIndex: 0,
    weekMap: ['日', '一', '二', '三', '四', '五', '六'],
    priceDetail: [],
    //////////////
    rentDays: 1, //入住天数，默认1天,
    startDate: null,
    endDate: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log("options:" + JSON.stringify(options));
    // var aptStr = options.aptInfo;
    // var aptInfo = JSON.parse(aptStr);

    var apId = options.apId;
    console.log("aptId:" + apId);

    this.getDetail(apId);

    var roomId = options.roomId;
    console.log("roomId:" + roomId);

    this.setData({
      aptId: apId,
      roomId: roomId,
      roomIndex: options.roomIndex
    })

    // console.log("apartmentID=" + options.apartmentID + "&roomID=" + options.roomID);

    this.getPriceInfo(apId, roomId);

    this.initDateInfo(options, true);
  },
  //显示时间选择
  chooseTime: function() {
    this.setData({
      hideMain: true,
      hidePicker: false
    })
  },
  //选项改变事件
  bindPickerChange: function(e) {
    let types = e.currentTarget.dataset.type;
    if (types == 'hotelInfo') {
      var curIndex = e.detail.value;
      console.log("curIndex:" + curIndex);

      var roomId = this.data.aptInfo.roomList[curIndex].id;
      console.log("cur room id:" + roomId);
      this.getPriceInfo(this.data.aptId, roomId);

      this.setData({
        roomIndex: curIndex,
        roomId: roomId
      })
    } else if (types == 'hotelnum') {
      this.setData({
        countIndex: e.detail.value
      })
    }

  },
  agreeProtocol: function(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        isAgreeProtocol: true
      })
    } else {
      this.setData({
        isAgreeProtocol: false
      })
    }
  },
  //下一步
  nextInfo: function() {
    // : '59ba30dca22b9d0064508c84',
    //   : '59ba30dc128fe1006aec6b1a',
    //     startDate: '2018-03-28',
    //       endDate: '2018-03-29',
    //         personCount: 1,
    //           nickName: '1',
    //             realName: '2',
    //               wechatAccountName: 'w1',
    //                 documentType: 'chinaID',
    //                   documentValue: '12345678900987654X',
    //                     mobileCountryCode: '86',
    //                       mobileLocalNumber: '13800138000'
    var personCount = this.data.hotelpeople[this.data.countIndex];
    var curOb = {
      apartmentID: this.data.aptId,
      roomID: this.data.roomId,
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      personCount: personCount
    };
    var obStr = JSON.stringify(curOb);
    console.log(obStr);

    if (this.data.isAgreeProtocol)
      wx.navigateTo({
        url: '../info/info?obStr=' + obStr
      })
    else {
      app.toast("阅读并同意平台的服务协议后才能继续");
    }
  },
  //价格详情
  priceDetail: function() {
    let priceSwitch = this.data.priceSwitch
    if (!priceSwitch) {
      this.setData({
        showDeatil: 1,
        priceSwitch: 1,
      })
    } else {
      this.setData({
        showDeatil: 0,
        priceSwitch: 0,
      })
    }

  },
  ///////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////
  dateInit: function(setYear, setMonth) { //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据	
    let arrLen = 0; //dateArr的数组长度	
    let now = setYear ? new Date(setYear, setMonth) : new Date();

    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数	

    let nextMonth = (month + 1) > 12 ? 1 : month;

    let startWeek = new Date(year + '/' + month + '/' + 1).getDay();
    //目标月1号对应的星期	
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天	

    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    if (month <= 9) {
      month = '0' + month
    }
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        if (num <= 9) {
          num = '0' + num
        }

        obj = {
          isToday: '' + year + month + num,
          dateNum: num,
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }

    this.setData({
      dateArr: dateArr
    })

    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
    return dateArr;
  },
  lastMonth: function() {
    //全部时间的月份都是按0~11基准，显示月份才+1	
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  nextMonth: function() { //全部时间的月份都是按0~11基准，显示月份才+1	
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  //取消
  cancel: function() {
    wx.navigateBack({
      delta: 0
    })
  },
  //选中日期
  chooseDate: function(e) {
    var chooseStatus = this.data.chooseStatus

    if (chooseStatus == 0) { //第一次点击
      var chooseDay = e.currentTarget.dataset.date
      var outToday = 0
      chooseStatus = 1
      this.setData({
        isToday: chooseDay,
        outToday: outToday,
        chooseStatus: chooseStatus
      })
    } else if (chooseStatus == 1 && this.data.isToday != e.currentTarget.dataset.date) {
      var chooseDay = this.data.isToday
      var outToday = e.currentTarget.dataset.date
      chooseStatus = 0
   
      var indate = chooseDay.substring(0, 4) + '/' + chooseDay.substring(4, 6) + '/' + chooseDay.substring(6, 8)
      var outdate = outToday.substring(0, 4) + '/' + outToday.substring(4, 6) + '/' + outToday.substring(6, 8)


      var date1 = chooseDay.substring(0, 4) + '-' + chooseDay.substring(4, 6) + '-' + chooseDay.substring(6, 8)
      var date2 = outToday.substring(0, 4) + '-' + outToday.substring(4, 6) + '-' + outToday.substring(6, 8)

      console.log("chosen date:" + indate + "&" + outdate);
      console.log("chosen date2:" + date1 + "&" + date2);

      var op = {
        indate: indate,
        outdate: outdate
      }

      this.calcRentDays(date1, date2);
      this.initDateInfo(op, false);

      this.setData({
        isToday: chooseDay,
        outToday: outToday,
        chooseStatus: chooseStatus,
        startDate: date1,
        endDate: date2,
        hideMain: false,
        hidePicker: true
      })

    }

  },
  initDatePicker: function(options) {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let days = now.getDate();

    let dateNum = new Date(year, month, 0).getDate();

    var dateNums = [];

    for (var i = 0; i < 6; i++) {
      var dateObj = {};
      let m = month + i > 12 ? month + i - 12 : month + i

      let y = month + i > 12 ? year + 1 : year

      dateObj.year = y
      dateObj.month = m
      dateObj.dateArr = this.dateInit(y, m);
      // console.log(dateObj)
      dateNums.push(dateObj)
      // console.log(dateNums)
    }
    // console.log(dateNums) 

    //默认入驻 搬出时间
    if (days + 1 > dateNum) {
      month = month + 1;
      if (month > 12) {
        year = year + 1
      }
      var defaultOutDate = days + 1 + '/' + month + '/' + year;
      var outToday = '' + year + month + ((days + 1) <= 9 ? '0' + (days + 1) : (days + 1));
    } else {
      var defaultOutDate = days + 1 + '/' + month + '/' + year;

      var outToday = '' + year + month + ((days + 1) <= 9 ? '0' + (days + 1) : (days + 1));
    }
    if (options.indate) {
      var indateArr = options.indate.split('/')

      if (indateArr[1].length < 2) {
        indateArr[1] = '0' + indateArr[1]
      }
      if (indateArr[2].length < 2) {
        indateArr[2] = '0' + indateArr[2]
      }
      var inDate = indateArr[2] + '/' + indateArr[1] + '/' + indateArr[0];

      var isToday = indateArr[0] + indateArr[1] + indateArr[2];


    } else {
      var inDate = days + '/' + month + '/' + year;
      var isToday = 0;
    }
    if (options.outdate) {
      var outdateArr = options.outdate.split('/')
      if (outdateArr[1].length < 2) {
        outdateArr[1] = '0' + outdateArr[1]
      }
      if (outdateArr[2].length < 2) {
        outdateArr[2] = '0' + outdateArr[2]
      }
      var outDate = outdateArr[2] + '/' + outdateArr[1] + '/' + outdateArr[0];
      var outToday = outdateArr[0] + outdateArr[1] + outdateArr[2];
    } else {
      var outDate = defaultOutDate;
      var outToday = 0;
    }


    this.setData({
      inDate: inDate,
      outDate: outDate,
      isToday: isToday ? isToday : '' + year + month + (now.getDate() <= 9 ? '0' + now.getDate() : now.getDate()),
      nowDay: '' + year + month + (now.getDate() <= 9 ? '0' + now.getDate() : now.getDate()),
      outToday: outToday,
      dateNums: dateNums
    })
  },
  initDateInfo: function(options, bInitPicker) {

    var currentTime = new Date();
    var year = currentTime.getFullYear()
    var month = currentTime.getMonth() + 1
    var days = currentTime.getDate()
    var daysNum = new Date(year, month, 0).getDate();

    var sttrtotime1 = new Date(options.indate)
    var sttrtotime2 = new Date(options.outdate)
    if (sttrtotime1 > sttrtotime2 && sttrtotime1) { //交换顺序
      var tmp;
      tmp = options.indate;
      options.indate = options.outdate;
      options.outdate = tmp;
    }
    var indate = options.indate ? options.indate : year + '/' + month + '/' + days;
    var startDate = year + "-" + month + "-" + days;
    if (days + 1 > daysNum) {
      month = month + 1;
      if (month > 12) {
        year = year + 1
      }
      var outDates = year + '/' + month + '/' + (days + 1);
    } else {
      var outDates = year + '/' + month + '/' + (days + 1);
    }

    var outdate = options.outdate ? options.outdate : outDates;
    var indateArr = indate.split('/')
    var outDateArr = outdate.split('/')
    var endDate = outDateArr[0] + "-" + outDateArr[1] + "-" + outDateArr[2];

    var indates = new Date(indate)
    var outdates = new Date(outdate)
    var indateWeek = this.data.weekMap[indates.getDay()]
    var outdateWeek = this.data.weekMap[outdates.getDay()]

    var hour = currentTime.getHours();
    var min = currentTime.getMinutes();
    if (hour <= 9) {
      hour = '0' + hour
    }
    if (min <= 9) {
      min = '0' + min
    }
    var dateObj = {}
    dateObj.inday = indateArr[1] + '月' + indateArr[2] + '日'
    dateObj.inweek = indateWeek
    dateObj.hour = hour + ':' + min
    dateObj.outday = outDateArr[1] + '月' + outDateArr[2] + '日'
    dateObj.outweek = outdateWeek

    this.setData({
      startDate: startDate,
      endDate: endDate,
      indate: indate,
      outdate: outdate,
      hotelDate: dateObj
    })

    if (bInitPicker) {
      console.log("init picker in=" + indate + "&out=" + outdate);
      var op = {
        indate: indate,
        outdate: outdate
      }
      this.initDatePicker(op);
    }
  },
  getDetail: function(aid) {
    api._get('/apartment/' + aid).then(res => {
      console.log(res);
      if (res.status == 200) {
        var roomInfo = res.data;
        // console.log("获取公寓详情成功222")

        var imgCount = roomInfo.pictureList.length;
        var urlList = [];
        for (var i = 0; i < imgCount; i++) {
          urlList.push(roomInfo.pictureList[i].pictureContent);
        }
        // console.log("图片数量：" + urlList.length);

        var rooms = [];
        for (var i = 0; i < roomInfo.roomList.length; i++) {
          var name = roomInfo.roomList[i].roomDescription;
          console.log(name);
          rooms[i] = name;
        }

        var items = [];
        var personCount = roomInfo.totalPersonCount;
        for (var i = 1; i <= personCount; i++) {
          items.push(i);
        }

        this.setData({
          hotelInfo: rooms,
          aptInfo: roomInfo,
          hotelpeople: items
        })

      }
    }).catch(e => {
      console.log(e);
    })
  },
  //获取价格信息
  getPriceInfo: function(apId, roomId) {
    var requestParam = {
      apartmentID: apId,
      roomID: roomId
    };
    api._post('/pairesBooking/price', requestParam).then(res => {
      console.log(res);
      if (res.status == 200) {
        console.log("获取价格成功")
        this.setData({
          priceObj: res.data
        })
      } else {
        var errMsg = res.errmsg;
        console.log("获取价格 err " + errMsg);
      }
    }).catch(e => {
      console.log(e)
    })
  },
  calcRentDays: function(indate, outdate) {
    var date1 = app.toDate(indate);
    var date2 = app.toDate(outdate);

    //时间差的毫秒数
    var date3 = date2.getTime() - date1.getTime();
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    this.setData({
      rentDays: days
    })
  }
})