//order.js
var app = getApp()
Page({
  data: {
    page : 1,
    isHideLoadMore: false,
    orderList : null,
    firstLoad : true,
    isLogin : false,
    isRefresh : false
  },
  goShop(e){
    var tenantid = e.currentTarget.dataset.tenantid;
    wx.navigateTo({
      url: '/pages/shop/shop?tenant_id=' + tenantid
    })
  },
  //事件处理函数
  onReachBottom() {
    var _this = this;
    this.setData({
      isRefresh : true,
      page : this.data.page+1
    });
    if (!_this.data.isHideLoadMore){
      wx.request({
        url: app.globalData.host + '/api/order/list?' + 'accessToken=' + app.globalData.accessToken,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          limit: 10,
          page: _this.data.page
        },
        success: function (res) {
          _this.setData({
            orderList: _this.data.orderList.concat(res.data)
          });
          if (res.data.length < 10) {
            _this.setData({
              isHideLoadMore: true
            });
          }
        }
      })
    }
  },
  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading(); //显示加载圈圈
    var _this = this;
    this.setData({
      page: 1
    });
    wx.request({
      url: app.globalData.host + '/api/order/list?' + 'accessToken=' + app.globalData.accessToken,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        limit: 10,
        page: _this.data.page
      },
      success: function (res) {
        wx.hideNavigationBarLoading(); //隐藏加载圈圈
        wx.stopPullDownRefresh() //停止下拉刷新
        _this.setData({
          orderList: res.data
        });
        if (res.data.length < 10) {
          _this.setData({
            isHideLoadMore: true
          });
        } else {
          _this.setData({
            isHideLoadMore: false
          })
        }
      }
    })
  },
  pageInit() {
    wx.showNavigationBarLoading(); //显示加载圈圈
    var _this = this;
    wx.request({
      url: app.globalData.host + '/api/order/list?' + 'accessToken=' + app.globalData.accessToken,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        limit: 10,
        page: 1
      },
      success: function (res) {
        _this.setData({
          orderList: res.data
        });
        if (res.data.length < 10) {
          _this.setData({
            isHideLoadMore: true
          });
        } else {
          _this.setData({
            isHideLoadMore: false
          })
        }
        wx.hideNavigationBarLoading(); //隐藏加载圈圈
      }
    })
    _this.setData({
      page : 1,
      firstLoad: false
    })
  },
  onShow() {
  var _this = this;
  if (app.globalData.accessToken) {
    if (_this.data.firstLoad){
      _this.pageInit();
    }
    if (app.globalData.orderRefresh) {
      _this.pageInit();
      app.globalData.orderRefresh = false
    }
    _this.setData({
      isLogin: true
    });
  } else {
    _this.setData({
      isLogin: false
    });
  }
}
})
