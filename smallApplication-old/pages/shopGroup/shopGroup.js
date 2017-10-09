//shopGroup.js
var util = require('../../utils/util.js')   //通用方法
//获取应用实例
var app = getApp()
Page({
  data: {
    array: {},
    classifySub : '',
    classify_id : '',
    businessList : {},
    page : 1,
    type : 1,
    isHideLoadMore : false,
    index : 0,
    isRefresh : false
  },
  toggleDiscount(e) {
    var businessList = this.data.businessList;
    businessList[e.currentTarget.dataset.id].normal = !businessList[e.currentTarget.dataset.id].normal
    this.setData({
      businessList: businessList
    })
  },
  //事件处理函数
  onReachBottom() {
    var _this = this;
    this.setData({
      isRefresh: true
    });
    if (!this.data.isHideLoadMore) {
      this.setData({
        page: _this.data.page + 1
      });
      var postData = {};
      if (this.data.classifySub) {
        postData = {
          classify_id: this.data.classifySub,
          type: 2,
          size: 10,
          page: 1
        }
      } else {
        postData = {
          classify_id: this.data.classify_id,
          type: 1,
          size: 10,
          page: 1
        }
      }
      wx.request({
        url: app.globalData.host + '/api/index/tenant',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: postData,
        success: function (res) {
          var _this = this;
          for (var i in res.data) {
            res.data[i].discount = util.objectValues(res.data[i].discount)
          }
          _this.setData({
            businessList: Object.assign(_this.data.businessList, res.data)
          })
          if (util.objectValues(res.data).length < 10) {
            _this.setData({
              isHideLoadMore: true
            })
          }else{
            _this.setData({
              isHideLoadMore: false
            })
          }
        }
      })
    }
  },
  bindPickerChange: function (e) {
    var _this = this;
    this.setData({
      index: e.detail.value,
      classifySub: this.data.array[e.detail.value].classify_sub_id
    })
    var postData = {};
    if (this.data.classifySub) {
      postData = {
        classify: this.data.classifySub,
        type: 2,
        size: 10,
        page: 1
      }
    }else{
      postData = {
        classify: this.data.classify_id,
        type: 1,
        size: 10,
        page: 1
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({  //获取当前小分类数据
      url: app.globalData.host + '/api/tenant/tenant-list',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: postData,
      success: function (res) {
        for (var i in res.data) {
          res.data[i].discount = util.objectValues(res.data[i].discount)
        }
        _this.setData({
          businessList: res.data
        })
        wx.hideLoading();
        if (util.objectValues(res.data).length < 10) {
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
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: options.name})
    var _this = this;
    //调用应用实例的方法获取全局数据
    var classify_id = options.classify_id;
    _this.setData({
      classify_id: classify_id
    })
    wx.showNavigationBarLoading(); //显示加载圈圈
    wx.request({  //获取当前大分类数据
      url: app.globalData.host + '/api/tenant/tenant-list',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        classify: classify_id,
        type: 1,
        size: 10,
        page: 1
      },
      success: function (res) {
        for (var i in res.data) {
          res.data[i].discount = util.objectValues(res.data[i].discount)
        }
        _this.setData({
          businessList: res.data
        })
        if (util.objectValues(res.data).length < 10) {
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
     wx.request({   //获取小分类
      url: app.globalData.host + '/api/tenant/classify-sub',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        classify: classify_id,
      },
      success: function (res) {
        _this.setData({
          array: [{ classify_sub_id: '', name:'全部'}].concat(util.objectValues(res.data))
        })
      }
    })
  }
})
