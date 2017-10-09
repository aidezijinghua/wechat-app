//index.js
var util = require('../../utils/util.js')   //通用方法
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrls: [],
    navImgUrLS : [],
    businessList : {},
    isHideLoadMore : false,
    firstLoad : true,
    page : 1,
    isRefresh: false
  },
  toggleDiscount(e){
    var businessList = this.data.businessList;
    businessList[e.currentTarget.dataset.id].normal = !businessList[e.currentTarget.dataset.id].normal;
    this.setData({
      businessList: businessList
    })
  },
  //事件处理函数
  onReachBottom() {
    var _this = this;
    this.setData({
      isRefresh: true,
    });
    if (!this.data.isHideLoadMore){
      this.setData({
        page: _this.data.page + 1
      });
      wx.request({
        url: app.globalData.host + '/api/index/tenant',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          size: 10,
          page: _this.data.page,
        },
        success: function (res) {
          for (var i in res.data) {
            res.data[i].discount = util.objectValues(res.data[i].discount)
          }
          _this.setData({
            businessList: Object.assign(_this.data.businessList, res.data)
          })
          if (util.objectKeys(res.data).length < 10) {
            _this.setData({
              isHideLoadMore: true
            })
          } else {
            _this.setData({
              isHideLoadMore: false
            })
          }
        }
      })
    }
  },
  pageInit(){
    var _this = this;
    wx.showNavigationBarLoading(); //显示加载圈圈
    wx.request({
      url: app.globalData.host + '/api/index/banner',
      method: 'GET',
      success: function (res) {
        _this.setData({
          imgUrls: res.data
        })
      }
    })
    wx.request({
      url: app.globalData.host + '/api/index/classify',
      method: 'GET',
      success: function (res) {
        _this.setData({
          navImgUrLS: res.data
        })
      }
    })
    wx.request({
      url: app.globalData.host + '/api/index/tenant',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        size: 10,
        page: 1,
      },
      success: function (res) {
        for(var i in res.data){
          res.data[i].discount = util.objectValues(res.data[i].discount)
        }
        _this.setData({
          businessList: res.data
        })
        if (util.objectKeys(res.data).length < 10) {
          _this.setData({
            isHideLoadMore: true
          })
        } else {
          _this.setData({
            isHideLoadMore: false
          })
        }
        wx.hideNavigationBarLoading(); //隐藏加载圈圈
      }
    })
  },
  toastLogin(){  //提示登录
    wx.showModal({
      title: '提示',
      content: '登录后享受更多特权！',
      showCancel: false,
      confirmText: '去登录',
      confirmColor: '#f65b25',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onLoad(){
    var _this = this;
    _this.pageInit();
    app.checkToken()
  }
})
