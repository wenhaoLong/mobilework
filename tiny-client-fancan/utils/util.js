
// 将日期字符串转换。
const moment = require('./moment.min.js');
const formatTime = date => {
  // 兼容IOS的处理
  // let IOSDate = new Date(date.slice(0, 19).replace('T', ' ').replace(/-/g, "/")) ;
  // console.log(IOSDate);
  // let time = new Date(Date.parse(IOSDate) + 3600*8*1000*2).toISOString();
  // console.log(time);
  // return time.slice(0,19).replace('T', ' ');

  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

const authorize = ()=>{
  return new Promise((resolve, reject)=>{
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success: () => {
              // 用户同意小程序使用用户信息，后续调用 wx.getUserInfo 
              wx.getUserInfo({
                success:(e)=>{
                  let {userInfo} = e;
                  resolve(e); 
                },
              })
            },
            fail:(res)=>{
              // 用户拒绝了授权,回调失败
              console.log('为啥拒绝我');
              
              wx.showToast({
                title: '您已禁用个人信息，请打开设置页面开启授权',
                icon: 'none',
                duration: 1000
              })
              reject(res);
            }
          })
        } else {
          // 用户已经同意过小程序使用用户信息，后续调用 wx.startRecord 接口不会弹窗询问
          wx.getUserInfo({
            success:(e)=>{
              let {userInfo} = e;
              resolve(e); 
            },
          })
        }
      }
    })
  })
}

const formatUnixTimestamp = timeStamp=>{
  let time = new Date(timeStamp+3600*8*1000).toISOString();
  // console.log(time);
  return time.slice(0,19).replace('T', ' ');
  
}




module.exports = {
  formatTime: formatTime,
  authorize: authorize,
  formatUnixTimestamp
}
