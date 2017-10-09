//login.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    tel: '',
    pwd : '',
    validTel : false,
    toastText : '',
    isShowToast : false,
    second : 0,
    showSecond : false,
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
  telInput(e){
    this.setData({
      tel: e.detail.value,
    });
    if (util.checkTelephone(this.data.tel)) {
      this.setData({
        validTel: true
      });
    } else {
      this.setData({
        validTel: false
      });
    }
  },
  pwdInput(e) {
    this.setData({
      pwd: e.detail.value,
    });
  },
  login(){
    var _this = this;
    if(util.checkTelephone(this.data.tel)){
      if (util.checkTelephonePwd(this.data.pwd)){
        //login
        wx.request({
          url: app.globalData.host + '/api/member/login',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            phone: _this.data.tel,
            sms: _this.data.pwd
          },
          success: function (res) {
            if(res.data.code == 200){
              wx.setStorageSync('accessToken', res.data.accessToken);
              wx.setStorageSync('tel', _this.data.tel);
              wx.setStorageSync('member_id', _this.data.member_id);
              app.globalData.accessToken = res.data.accessToken;
              app.globalData.tel = _this.data.tel;
              app.globalData.member_id = _this.data.member_id;
              wx.navigateBack()
            }else{
              _this.showToast({
                title: '登录失败',
                duration: 1000
              })
            }
            
          }
        })
      }else{
        this.showToast({
          title: '验证码格式有误',
          duration: 1000
        })
      }
    }else{
      this.showToast({
        title: '手机号码有误',
        duration: 1000
      })
    }
  },
  getPwd(){
    if (util.checkTelephone(this.data.tel)){
        //获取验证码，并倒计时
      var _this = this;
      wx.request({
        url: app.globalData.host + '/api/member/get-code',
        method: 'POST',
        header: {
        "Content-Type": "application/x-www-form-urlencoded"
        },
        data : {
          phone: _this.data.tel
        },
        success: function (res) {
          if(res.data.code != 200){
            if (res.data.code == 1002){
              _this.showToast({
                title: '短信发送频繁',
                duration: 1000
              })
            }else{
              _this.showToast({
                title: '发送验证码失败',
                duration: 1000
              })
            }
          }else{
            _this.setData({
              second: 60,
              showSecond: true
            });
            setInterval(function () {
              _this.setData({
                second: _this.data.second - 1
              });
              if (_this.data.second == 0) {
                _this.setData({
                  showSecond: false
                });
              }
            }, 1000);
          }
        }
      })
  
    }else{
      this.showToast({
        title: '手机号码有误',
        duration: 1000
      })
    }
  },
  onLoad() {
    
  },
  onUnload(){
    app.globalData.loginBack = true
  },
})
