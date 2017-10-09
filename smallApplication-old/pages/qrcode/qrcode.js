//mine.js
var app = getApp();
var wait = null;
Page({
  data: {
    toastText: '',
    isShowToast: false,
    scanType : '1',
    shop : '',
    firstLoad : true
  }, 
  qrcode() {
    var _this = this;
    // 只允许从相机扫码
    wait = new Promise(function (resolve, reject) {
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          resolve(res.result)
        },
        fail: function (res) {
          reject(res)
        }
      })
    })   
  },
  cancel(){
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '您取消了扫一扫',
      showCancel: true,
      confirmText: '重新扫码',
      cancelText: '回首页',
      cancelColor: '#666',
      confirmColor: '#f65b25',
      success: function (res) {
        if (res.confirm) {
          _this.qrcode()
        } else if (res.cancel) {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      }
    })
  },
  error() {
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '非有效店铺二维码',
      showCancel: true,
      confirmText: '重新扫码',
      cancelText: '回首页',
      cancelColor: '#666',
      confirmColor: '#f65b25',
      success: function (res) {
        if (res.confirm) {
          _this.qrcode()
        } else if (res.cancel) {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      }
    })
  },
  getTime(){
    var time = new Date();
    return time.getMinutes() + '-' + time.getSeconds() + '-' + time.getMilliseconds()
  },
  onReady(){
    var _this = this;
    // 只允许从相机扫码
    wait = new Promise(function (resolve, reject) {
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          resolve(res.result)
        },
        fail: function (res) {
          reject(res)
        }
      })
    })
    setTimeout(function () {
      _this.setData({
        firstLoad: false
      })
    }, 200)
  },
  onShow(){
    var _this = this;
    if(!this.data.firstLoad){
      if (wait) {
        wx.showLoading({
          title: '耐心等待...',
        })
        wait.then(function (res) {
          wx.hideLoading()
          if (typeof res == 'string' && res.indexOf("tenant_id") > 0) {
            var tenant_id = JSON.parse(res)['tenant_id']
            console.log(tenant_id)
            wx.navigateTo({
              url: '/pages/shop/shop?tenant_id=' + tenant_id
            })
          } else {
            _this.error()
          }
        }, function (error) {
          wx.hideLoading()
          console.log(error.errMsg)
          if (error.errMsg == "scanCode:fail cancel") {
            _this.cancel()
          } else {
            _this.error()
          }
        }).then(function () {
          wait = null
        })
      } else {
        _this.qrcode()
      }
    }
  }
})
