//order.js
var util = require('../../utils/util.js')   //通用方法
var app = getApp()
Page({
  data: {
    number : '',
    remark : '',
    isShowToast : false,
    toastText : '',
    orderInfo : {},
    isOver : true,
    order_num : ''
  },
  showToast: function (options) {   //自定义的toast提醒
    var _this = this;
    // toast时间 
    var count = parseInt(options.duration) ? parseInt(options.duration) : 1000;
    // 显示toast 
    _this.setData({
      toastText: '????',
    });
    _this.setData({
      toastText: options.title,
      isShowToast: true,
    });
    // 定时器关闭 
    setTimeout(function () {
      _this.setData({
        isShowToast: false
      });
    }, count);
  },
  //事件处理函数
  setNumber(e){
    this.setData({
      number : e.detail.value
    })
  },
  setRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  confirmPay(){
    var _this = this;
    if(this.data.isOver == 'false'){
      wx.request({
        url: app.globalData.host + '/api/order/renew?accessToken=' + app.globalData.accessToken,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          order_num: _this.data.order_num,
          tenant_id: _this.data.tenantData.tenant_id,
          dish: _this.getPostData(_this.data.selectedDishes),
          number: _this.data.number,
          remark: _this.data.remark
        },
        success: function (res) {
          app.globalData.orderRefresh = true;
          wx.switchTab({
            url: '/pages/order/order'
          })
        }
      })
    }else {
      if(_this.data.number && _this.data.number > 0 && /\d+/.test(_this.data.number)){
        wx.request({
          url: app.globalData.host + '/api/order/create?accessToken=' + app.globalData.accessToken,
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            tenant_id: _this.data.tenantData.tenant_id,
            dish: _this.getPostData(_this.data.selectedDishes),
            number: _this.data.number,
            remark: _this.data.remark
          },
          success: function (res) {
            app.globalData.orderRefresh = true
            wx.switchTab({
              url: '/pages/order/order'
            })
          }
        })
      }else{
        this.showToast({
          title: '请输入正确的人数',
          duration: 1000
        })
      }
    }
  },
  getPostData(selectedDishes){   //获取提交格式数据
    var returnDish = [];
    var postData = {};
    util.objectKeys(selectedDishes).forEach(function (key) {
      var dish = selectedDishes[key];
      if (dish.spec) {
        util.objectKeys(dish.spec).forEach(function (specKey) {
          returnDish.push({
            dish_id: dish.dish_id,
            spec: dish.spec[specKey].specs,
            num: dish.spec[specKey].num
          })
        })
      } else {
        returnDish.push({ 
          dish_id: dish.dish_id , 
          spec : {},
          num: dish.num})
      }
    })
    returnDish.forEach(function(value,key){
      postData[key] = value
    })
    return JSON.stringify(postData)
  },
  getOrderInfo(tenantData, selectedDishes){
    var _this = this;
    wx.request({
      url: app.globalData.host + '/api/order/get-price?' + 'accessToken=' + app.globalData.accessToken,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        tenant_id: tenantData.tenant_id,
        dish: _this.getPostData(selectedDishes),
        order_num: _this.data.order_num
      },
      success: function (res) {
        res.data.data.subOrder = [];
        util.objectValues(_this.data.selectedDishes).forEach(function(dish){
          if (dish.spec){
            util.objectValues(dish.spec).forEach(function (dishSpec) {
              var data = {};
              var specDescArr = [];
              var specDesc = '';
              util.objectValues(dishSpec.specs).forEach(function (spec) {  
                specDescArr.push(spec.spec_name)
              })
              specDesc = specDescArr.join(',');
              data.dish_name = dish.dish_name + '(' + specDesc+')';
              data.dish_num = dishSpec.num;
              data.dish_sum = Number(dishSpec.num * dishSpec.spec_price).toFixed(2);
              res.data.data.subOrder.push(data)
            })
          }else{
            var data = {};
            data.dish_name = dish.dish_name;
            data.dish_num = dish.num;
            data.dish_sum = Number(dish.num * dish.price).toFixed(2);
            res.data.data.subOrder.push(data)
          }
        })
        _this.setData({
            orderInfo: res.data.data
          });
        wx.hideNavigationBarLoading(); //隐藏加载圈圈
      }
    })
  },
  onLoad: function (options) {
    wx.showNavigationBarLoading(); //显示加载圈圈
    var _this = this;
    var tenantData = JSON.parse(options.tenantData);
    var selectedDishes = JSON.parse(options.selectedDishes);
    var isOver = options.isOver;
    if(isOver == 'false'){
      wx.setNavigationBarTitle({ title: '加菜确认' })
    }
    var order_num = options.order_num;
    _this.setData({
      tenantData: tenantData,
      selectedDishes: selectedDishes,
      isOver: isOver,
      order_num: order_num
    })
    _this.getOrderInfo(tenantData, selectedDishes);
  },
})
