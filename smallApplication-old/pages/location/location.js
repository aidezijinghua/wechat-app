//mine.js
var app = getApp();
Page({
  data: {
    longitude: '',
    latitude : '',
    scale : 13,
    markers: [{
      iconPath: "../../images/location.png",
      id: 0,
      latitude: '23.099994',
      longitude: 113.324520,
      width: 30,
      height: 30
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
  },
  regionchange(e) {
    console.log('移动')
    console.log(e)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  onLoad(){
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var markers = _this.data.markers;
        markers.latitude = res.latitude
        markers.longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        console.log(res)
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: markers
        })
      },
      fail: function (res){
        console.log(res)
      }
    })
  }
})
