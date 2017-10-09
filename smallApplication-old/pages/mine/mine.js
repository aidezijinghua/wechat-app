//mine.js
var app = getApp();
Page({
  data: {
    userInfo: {},
    isLogin : false,
    firstLoad : true,
    tel : ''
  },
  setUserInfo(userInfo){
    this.setData({
      userInfo: userInfo
    })
  },
  loginOut(){
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '退出后部分功能将受限制！',
      showCancel: true,
      confirmText: '退出登录',
      cancelColor : '#666',
      confirmColor: '#f65b25',
      success: function (res) {
        if (res.confirm) {
          _this.setData({
            isLogin: false,
            tel: ''
          })
          wx.setStorageSync('accessToken', '');
          app.globalData.accessToken = '';
          wx.setStorageSync('tel', '');
          app.globalData.tel = '';
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  pageInit(){
    var _this = this;
    if (app.globalData.accessToken) {
      this.setData({
        isLogin: true,
        tel: app.globalData.tel
      })
    } else {
      this.setData({
        isLogin: false
      })
    }
    if (app.globalData.userInfo) {
      _this.setUserInfo(app.globalData.userInfo)
    } else {
      app.getUserInfo(function (userInfo) {
        _this.setUserInfo(userInfo)
      })
    }
  },
  onShow() {
    this.pageInit()
  }
})
