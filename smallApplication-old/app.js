//app.js
App({
  onLaunch: function() {
    var that = this;
    wx.login({   //获取openid
      success: function (res) {
        that.globalData.code = res.code;
        var d = that.globalData;
        var url = that.globalData.host+'/api/member/openid?code=' + d.code;
        that.getOpenId(url)
      }
    });
    if (that.globalData.userInfo) {
     
    } else {
      that.getUserInfo(function (userInfo) {
        
      })
    }
  },
  getOpenId(url){
    var that = this;
    wx.request({
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      url: url,
      data: {},
      method: 'GET',
      success: function (res) {
        that.globalData.openid = res.data.openid
      },
      fail: function () {
        that.getOpenId(url)
      }
    })
  },
  checkToken(){
    var _this = this;
    //调用API从本地缓存中获取数据
    var accessToken = wx.getStorageSync('accessToken');
    var tel = wx.getStorageSync('tel');
    // 检查token是否过期
    wx.request({
      url: this.globalData.host + '/api/order/list?accessToken=' + accessToken,
      method: 'GET',
      success: function (res) {
        if (res.statusCode == '401') {
          console.log('token过期')
          _this.globalData.accessToken = '';
          _this.globalDatsss
        } else {
          _this.globalData.accessToken = accessToken;
          _this.globalData.tel = tel;
        }
      }
    })
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    host: 'https://wechat-shop.hubovip.cn',
    accessToken: '',
    userInfo: null,
    tel : '',
    loginBack :false,
    orderRefresh :false,
    openid: ''
  }
})
