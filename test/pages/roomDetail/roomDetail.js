const api = require('../../utils/api.js');
const app = getApp;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipLines: 1,
    showAllEquip: false,
    brandSrc: "",
    imgUrlList: [],
    imgCount: 0,
    roomDetail: null,
    coHost: null,
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/res/imgs/xing_normal.png',
    selectedSrc: '/res/imgs/xing.png',
    activeIndex: 0, //房间index
    commentAction: false, //评论控制开关
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      brandSrc: options.src
    })
    var aptId = options.aid;
    console.log("公寓id:" + aptId);
    this.getDetail(aptId);
  },
  /**
   * 切换房间
   */
  changeRoom: function(e) {
    var index = e.currentTarget.dataset.id
    this.setData({
      activeIndex: index,
      commentAction: false
    })
  },
  /**
   * 评论
   */
  comment: function(e) {
    var hasRoom = this.data.roomDetail.roomList != null && this.data.roomDetail.roomList.length > 0;


    var bAction = this.data.commentAction;

    if (hasRoom && bAction) return;


    bAction = !bAction;


    console.log('bAction:' + bAction);
    this.setData({
      commentAction: bAction,
      activeIndex: -1
    })
  },
  //无房间时，点击‘暂无房间’跳回主要信息（如果打开了评论）
  showMain: function() {
    this.setData({
      commentAction: false
    })
  },

  imageLoad: function() {
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth, //图片宽度      
    })
  },
  //立即预定
  order: function() {
    // var aptObj = this.data.roomDetail;
    // var tempObj = {
    //   id: aptObj.id,
    //   city: aptObj.city,
    //   district: aptObj.district,
    //   roomList: aptObj.roomList,
    //   fullTitle: aptObj.fullTitle,
    //   cover: aptObj.cover
    // }
    // var aptStr = JSON.stringify(tempObj);
    var aptInfo = this.data.roomDetail;
    console.log("apId:" + aptInfo.id);
    var roomIndex = this.data.activeIndex;
    console.log("roomIndex:" + roomIndex);
    var roomId = aptInfo.roomList[roomIndex].id;
    console.log("roomId:" + roomId);

    wx.navigateTo({
      url: '../book/book?roomId=' + roomId + "&apId=" + aptInfo.id + "&roomIndex=" + roomIndex
    })
  },
  //图片放大
  previewImg: function(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: this.data.imgUrlList
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //获取详情
  getDetail: function(aid) {
    api._get('/apartment/' + aid).then(res => {
      console.log(res);
      if (res.status == 200) {
        var roomInfo = res.data;
        console.log("获取公寓详情成功111")
        var imgCount = roomInfo.pictureList.length;
        var urlList = [];
        for (var i = 0; i < imgCount; i++) {
          urlList.push(roomInfo.pictureList[i].pictureContent);
        }
        console.log("图片数量111：" + urlList.length);
        var lines = Math.ceil(roomInfo.facilityList.length / 6);

        var lng = roomInfo.lnglat.substring(0, roomInfo.lnglat.indexOf(','));
        var lat = roomInfo.lnglat.substring(lng.length + 1);
        console.log(lng + "&" + lat);

        var hostInfo = null;
        if (!this.isEmptyObject(roomInfo.coHost)) {
          console.log('有房东信息');
          hostInfo = roomInfo.coHost;
        }

        this.setData({
          longitude: lng,
          latitude: lat,
          equipLines: lines,
          imgCount: imgCount,
          imgUrlList: urlList,
          roomDetail: roomInfo,
          coHost: hostInfo
        })

      }
    }).catch(e => {
      console.log(e);
    })
  },
  showAllEquipment: function() {
    this.setData({
      showAllEquip: true
    })
  },
  isEmptyObject: function(e) {
    var t;
    for (t in e)
      return !1;
    return !0
  }
})