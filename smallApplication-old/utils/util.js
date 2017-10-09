function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function checkTelephone(tel) {   //验证电话号码
  var regex = /^1[345678]\d{9}$/;
  if (regex.test(tel)) {
    return true;
  } else {
    return false;
  }
}
function checkTelephonePwd(tel) {   //验证电话号码验证码
  var regex = /^\d{4}$/;
  if (regex.test(tel)) {
    return true;
  } else {
    return false;
  }
}
function objectDiff(){
  if (!Object.keys) {
    Object.keys = (function () {
      var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

      return function (obj) {
        if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

        var result = [];

        for (var prop in obj) {
          if (hasOwnProperty.call(obj, prop)) result.push(prop);
        }

        if (hasDontEnumBug) {
          for (var i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
          }
        }
        return result;
      }
    })()
  };
}
function objectValues(obj){
  var arr = [];
  for (var i in obj){
    arr.push(obj[i])
  }
  return arr
}
function objectKeys(obj) {
  var arr = [];
  for (var i in obj) {
    arr.push(i)
  }
  return arr
}
module.exports = {
  formatTime: formatTime,
  checkTelephone: checkTelephone,
  checkTelephonePwd: checkTelephonePwd,
  objectDiff : objectDiff,
  objectValues: objectValues,
  objectKeys: objectKeys
}
