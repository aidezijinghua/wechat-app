//order-detail.js
var app = getApp()
Page({
  data: {
    orderInfo : {},
    subOrderShow : {}
  },
  toggleSubOrder(e){
    var subOrderShow = this.data.subOrderShow;
    subOrderShow[e.currentTarget.dataset.sub] = !subOrderShow[e.currentTarget.dataset.sub];
    this.setData({
      subOrderShow: subOrderShow
    })
  },
  //事件处理函数
  confirmPay(){
    console.log(app.globalData)
    var _this = this;
    var order_num = _this.data.order_num;
    wx.request({
      url: app.globalData.host + '/pay/app-creat?openid='+ app.globalData.openid + '&order_num=' + order_num,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        
      },
      success: function (res) {
        wx.requestPayment({
          'timeStamp': res.data.timestamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
          },
          'fail': function (res) {
          }
        })
      }
    })
  },
  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    this.initPage()
  },
  initPage(){
    wx.showNavigationBarLoading(); //显示加载圈圈
    var _this = this;
    var order_num = _this.data.order_num;
    wx.request({
      url: app.globalData.host + '/api/order/info?' + 'accessToken=' + app.globalData.accessToken,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        order_num: order_num
      },
      success: function (res) {
        _this.setData({
          orderInfo: res.data
        });
        wx.hideNavigationBarLoading(); //隐藏加载圈圈
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  onLoad: function (options) {
    var order_num = options.order_num;
    this.setData({
      order_num: order_num
    });
    this.initPage()
  }
})
