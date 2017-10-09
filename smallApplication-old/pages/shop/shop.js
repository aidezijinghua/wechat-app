//shop.js
var util = require('../../utils/util.js')   //通用方法
//获取应用实例
var app = getApp()
Page({
  data: {
    activeIndex: 0,  //当前激活tab
    dishes : {}, //当前店的菜品
    productTypeActive: '',//当前店的菜品分类的激活id
    selectedDishes: {}, //该店购物车数据
    selectedTotal: {num : 0 , sum : 0}, //该店购物车数据总计
    chooseDish: {},//当前选择规格的菜品
    chooseType: {},//当前选择规格的id组
    chooseTypePrice: '',//当前选择规格的价格
    chooseTypeModal : false,  //规格选择模态窗
    productsCartShow : false,  //购物车模态窗
    isShowToast : false,//自定义toast
    toastText: '',//自定义文本
    tenantData : {},  //商户信息
    isOver : true,  //是否有未完成订单
    order_num : ''
  },
  setselectedTotal(){   //设置总数据信息（总数，总价）
    var num = 0;
    var sum = 0;
    var selectedDishes = this.data.selectedDishes;
    util.objectValues(selectedDishes).forEach(function(dish){
      num = num + Number(dish.num);
      if (dish.spec){
        util.objectValues(dish.spec).forEach(function (spec) {
          sum = sum + spec.spec_price * spec.num
        })
      }else{
        sum = sum + dish.price * dish.num
      }
    })
    this.setData({
      selectedTotal: { num: num, sum: sum}
    });
  },
  getCurrentPrice(chooseDish,spec){
    var price = Number(chooseDish.price);
    util.objectKeys(spec).forEach(function (key) {
      price = price + Number(chooseDish.spec[key].child[spec[key]].spec_price);
    })
    return price
  },
  tabClick(e) {   //tab切换
    this.setData({
      activeIndex: e.currentTarget.dataset.tab
    });
  },
  changeTab(e){   //滑动改变tab回调
    this.setData({
      activeIndex: e.detail.current
    });
  },  
  dishChange(e){   //改变菜品分组
    this.setData({
      productTypeActive: e.currentTarget.dataset.tab
    });
  },
  showModal(){   //显示购物车
    this.setData({
      productsCartShow: !this.data.productsCartShow
    });
  },
  closeproductsCart(){ //隐藏购物车
    this.setData({
      productsCartShow: false
    });
  },
  showchooseTypeModal(e) {   //有规格的选择规格模态窗
    var chooseDish = e.currentTarget.dataset.dish;
    var orginchooseType = {};
    var orginchooseTypePrice = Number(chooseDish.price);
    util.objectKeys(chooseDish.spec).forEach(function (key){
      orginchooseType[key] = chooseDish.spec[key].child[util.objectKeys(chooseDish.spec[key].child)[0]].spec_id;
      orginchooseTypePrice = orginchooseTypePrice + Number(chooseDish.spec[key].child[util.objectKeys(chooseDish.spec[key].child)[0]].spec_price);
    })
    
    this.setData({
      chooseTypeModal: true,
      chooseDish: chooseDish,
      chooseType: orginchooseType,    //默认都选择第一个规格
      chooseTypePrice: orginchooseTypePrice
    });
  },
  getValues(obj){
    var arr = [];
    util.objectKeys(obj).forEach(function(value){
      arr.push(obj[value])
    })
    return arr
  },
  chooseConfirm() { //有规格的选择确认
    var dish = this.data.chooseDish;
    var dish_id = this.data.chooseDish.dish_id;
    var chooseType = this.data.chooseType;
    var chooseTypePrice = this.data.chooseTypePrice;
    var spec_id = this.getValues(chooseType).join('-');
    var selectedDishes = this.data.selectedDishes;
    var specsArr = {};
    util.objectKeys(chooseType).forEach(function (key) {
      specsArr[chooseType[key]] = dish.spec[key].child[chooseType[key]]
    })
    if (this.data.selectedDishes[dish_id]) {
      selectedDishes[dish_id].num = Number(selectedDishes[dish_id].num) + 1;//总和添加
      if (selectedDishes[dish_id].spec[spec_id]){  //已经添加过该规格
        selectedDishes[dish_id].spec[spec_id].num = Number(selectedDishes[dish_id].spec[spec_id].num) + 1   //具体规格数量添加
      }else{
        selectedDishes[dish_id].spec[spec_id] = Object.assign({ num: 1, spec_price: chooseTypePrice }, { specs: specsArr });//具体规格数量添加
      }
    } else {  //之前没添加过
      selectedDishes[dish_id] = Object.assign({ num: 1 }, dish);
      selectedDishes[dish_id].spec = {};
      selectedDishes[dish_id].spec[spec_id] = Object.assign({ num: 1, spec_price: chooseTypePrice}, { specs: specsArr});
    }
    this.setData({
      selectedDishes: selectedDishes
    });
    this.setselectedTotal();
    this.closechooseTypeModal()
  },
  closechooseTypeModal(){  //关闭规格选择，默认重置
    this.setData({
      chooseTypeModal: false,
      chooseType : ''
    });
  },
  chooseTypeChange(e){   //规格变更
    var chooseDish = this.data.chooseDish;
    var chooseType = this.data.chooseType;
    console.log(e.detail.value)
    chooseType[e.detail.value.split('-')[0]] = e.detail.value.split('-')[1]
    this.setData({
      chooseType: chooseType,
      chooseTypePrice: this.getCurrentPrice(chooseDish, chooseType)
    });
    
  },
  addCart(e){   //无规格的添加购物车
    var dish = e.currentTarget.dataset.dish;
    var dish_id = dish.dish_id;
    var selectedDishes = this.data.selectedDishes;
    if (selectedDishes[dish_id]){
      selectedDishes[dish_id].num = Number(selectedDishes[dish_id].num) + 1
    }else{
      selectedDishes[dish_id] = Object.assign({ num: 1 }, dish); 
    }
    this.setData({
      selectedDishes: selectedDishes
    });
    this.setselectedTotal();
  },
  addCartSpec(e) {  //有规格的添加购物车
    var dish_id = e.currentTarget.dataset.dishid;
    var specId = e.currentTarget.dataset.specid;
    var selectedDishes = this.data.selectedDishes;
    selectedDishes[dish_id].num = Number(selectedDishes[dish_id].num) + 1;
    selectedDishes[dish_id].spec[specId].num = Number(selectedDishes[dish_id].spec[specId].num) + 1;
    this.setData({
      selectedDishes: selectedDishes
    });
    this.setselectedTotal();
  },
  removeCartSpec(e) {  //有规格的减少购物车数量
    var dish_id = e.currentTarget.dataset.dishid;
    var specId = e.currentTarget.dataset.specid;
    var selectedDishes = this.data.selectedDishes;
    if (selectedDishes[dish_id].spec[specId].num > 1) {
      selectedDishes[dish_id].spec[specId].num = Number(selectedDishes[dish_id].spec[specId].num) - 1;
    } else {
      delete selectedDishes[dish_id].spec[specId]
    }
    if (selectedDishes[dish_id].num > 1){
      selectedDishes[dish_id].num = Number(selectedDishes[dish_id].num) - 1;
    }else{
      delete selectedDishes[dish_id]
    }
    this.setData({
      selectedDishes: selectedDishes
    });
    this.setselectedTotal();
  },
  removeCart(e) { //无规格的减少购物车数量
    var dish_id = e.currentTarget.dataset.dish.dish_id;
    var selectedDishes = this.data.selectedDishes;
    if (this.data.selectedDishes[dish_id].num > 1) {
      selectedDishes[dish_id].num = Number(selectedDishes[dish_id].num) - 1
    } else {
      delete selectedDishes[dish_id]
    }
    this.setData({
      selectedDishes: selectedDishes
    });
    this.setselectedTotal();
  },
  emptyCart(e){  //清空购物车
    this.setData({
      selectedDishes: {},
      productsCartShow : false
    });
    this.setselectedTotal()
  },
  notRemove(){   //含规格提示去购物车删除
    this.showToast({
      title: '含规格去购物车删除',
      duration: 1000
    })
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
  callPhone(e){  //直接拨打商家电话
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  previewImage: function (e) {  //预览图片
    var current = e.currentTarget.dataset.src;
    console.log(current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [current] // 需要预览的图片http链接列表  
    })
  },
  disMove(e){
    // 阻止滑动冒泡
  },
  goPay(){
    var _this = this;
    if (app.globalData.accessToken) {
      var tenant_id = this.data.tenantData.tenant_id;
      wx.request({  //获取该店正在进行的订单情况
        url: app.globalData.host + '/api/order/get-state?tenant_id=' + tenant_id + '&accessToken=' + app.globalData.accessToken,
        method: 'GET',
        success: function (res) {
          if (res.data.data[0] && res.data.data[0].order_state != '17' && res.data.data[0].order_state != '11') {
            _this.setData({
              isOver: false,
              order_num: res.data.data[0].order_num
            });
          }
          var selectedDishes = JSON.stringify(_this.data.selectedDishes);
          var tenantData = JSON.stringify(_this.data.tenantData);
          var isOver = _this.data.isOver;
          var order_num = _this.data.order_num;
          wx.navigateTo({
            url: '/pages/order-confirm/order-confirm?selectedDishes=' + selectedDishes
            + '&tenantData=' + tenantData + '&isOver=' + isOver + '&order_num=' + order_num
          })
        }
      });
    } else {
      _this.toastLogin()
    }
  },
  toastLogin() {  //提示登录
    wx.showModal({
      title: '提示',
      content: '请登录后再下单',
      confirmText: '去登录',
      confirmColor: '#f65b25',
      cancelColor: '#666',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })
  },
  onLoad: function (options) {
    var _this = this;
    var tenant_id = options.tenant_id;
    wx.showNavigationBarLoading(); //显示加载圈圈
    wx.request({
      url: app.globalData.host + '/api/tenant/tenant-detail?id=' + tenant_id,
      method: 'GET',
      success: function (res) {
        _this.setData({
          tenantData: res.data,
        });
      }
    });
    wx.request({
      url: app.globalData.host + '/api/dish/dish?tenant_id=' + tenant_id,
      method: 'GET',
      success: function (res) {
        _this.setData({
          dishes: res.data,
          productTypeActive: util.objectKeys(res.data)[0]
        });
        wx.hideNavigationBarLoading(); //隐藏加载圈圈
      }   
    })
  },
});
