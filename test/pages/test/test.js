const app = getApp()
Page({
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    chooseStatus:0   //选中状态   
  },
  onLoad: function(options) {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let days=now.getDate();
    
    let dateNum = new Date(year, month, 0).getDate();

    var dateNums=[];
  
    //var date = this.dateInit(year, month);
    for(var i=0;i<6;i++){
      var dateObj = {};
      let m = month + i > 12 ? month + i-12 : month + i
  
      let y = month + i > 12 ? year+1 : year
    
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
      var outToday = '' + year + month + ((days + 1) <= 9 ? '0' + (days + 1):(days + 1));
    } else {
      var defaultOutDate = days + 1 + '/' + month + '/' + year;
      
      var outToday = '' + year + month + ((days + 1) <= 9 ? '0' + (days + 1) : (days + 1));
    }
    if (options.indate) {
      var indateArr = options.indate.split('/')
 
      if (indateArr[1].length<2){
        indateArr[1] = '0' + indateArr[1]
      }
      if (indateArr[2].length <2){
        indateArr[2] = '0' + indateArr[2]
      }
      var inDate = indateArr[2] +'/'+ indateArr[1] +'/'+ indateArr[0];

      var isToday = indateArr[0] + indateArr[1] + indateArr[2];


    }else{
      var inDate = days + '/' + month + '/' + year;
      var isToday=0;
    }
    if (options.outdate){
      var outdateArr = options.outdate.split('/')
      if (outdateArr[1].length <  2) {
        outdateArr[1] = '0' + outdateArr[1]
      }
      if (outdateArr[2].length < 2) {
        outdateArr[2] = '0' + outdateArr[2]
      }
      var outDate = outdateArr[2] + '/' + outdateArr[1] + '/' + outdateArr[0];
      var outToday = outdateArr[0] + outdateArr[1] + outdateArr[2];
    }else{
      var outDate = defaultOutDate;
      var outToday = 0;
    }
 
    
    
    this.setData({
      inDate: inDate,
      outDate: outDate,
      isToday: isToday ? isToday:'' + year + month + (now.getDate() <= 9 ? '0' + now.getDate() : now.getDate()),
      nowDay: '' + year + month + (now.getDate() <= 9 ? '0' + now.getDate() : now.getDate()),
      outToday: outToday,
      dateNums: dateNums
    })
  },
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
    if(month<=9){
      month='0'+month
    }
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        if(num<=9){
          num='0'+num
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
  cancel:function(){
   wx.navigateBack({
      delta:0
   })
  },
  chooseDate:function(e){
     var chooseStatus = this.data.chooseStatus
    
    if (chooseStatus == 0 ){  //第一次点击
         var chooseDay = e.currentTarget.dataset.date
         var outToday=0 
         chooseStatus=1
       this.setData({
         isToday: chooseDay,
         outToday: outToday,
         chooseStatus: chooseStatus
       })
    } else if (chooseStatus == 1 && this.data.isToday != e.currentTarget.dataset.date){
        var chooseDay =this.data.isToday
        var outToday = e.currentTarget.dataset.date
        chooseStatus=0
       this.setData({
         isToday: chooseDay,
         outToday: outToday,
         chooseStatus: chooseStatus
       })
       var indate = chooseDay.substring(0, 4) + '/' + chooseDay.substring(4, 6) + '/' + chooseDay.substring(6, 8)
       var outdate = outToday.substring(0, 4) + '/' + outToday.substring(4, 6) + '/' + outToday.substring(6, 8)
         wx.redirectTo({
           url: '/pages/book/book?indate=' + indate + '&outdate=' + outdate,
         })
      
     }
     
  }
})