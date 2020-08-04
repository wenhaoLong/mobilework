//app.js

const { baseURL } = require('./utils/config');



App({
  

  onLaunch: function () {
    // 检测更新
    if (wx.canIUse("getUpdateManager")) {
      let updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调
        // console.log(res.hasUpdate);
      })
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已发布，请升级到最新版本体验新功能',
          success: (res) => {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            } else if (res.cancel) {
              return false;
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        wx.hideLoading();
        wx.showModal({
          title: '升级失败',
          content: '新版本下载失败，请检查网络！',
          showCancel: false
        });
      });
    }

    // 获取用户信息并登录
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 openid
              let { userInfo } = res;
              wx.login({
                success:(res)=>{
                  // console.log(res);
                  wx.request({
                    url: baseURL + '/patient/account/wechat?code=' + res.code + '&name=' + userInfo.nickName,
                    method: 'POST',
                    success:(res)=>{
                      if (res.header["X-Access-Token"]) {
                        this.globalData["X-Access-Token"] = res.header["X-Access-Token"]
                      }
                      if (res.statusCode==200){
                        this.globalData.userData = res.data.user;
                        this.globalData.userInfo = userInfo;
                        // console.log(res.data);                        
                      }
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  //记录下错误的信息
  onError: function (err) {
    console.log(err);
    var error = wx.getStorageSync('error') || [];
    error.unshift({
      timestamp: new Date(),
      detail: err
    });
    wx.setStorageSync('error', error);
  },
  globalData: {
    userInfo: null,
    userData: null,
    "X-Access-Token": '',
    logInWay: 1,   // 登录方式，为0则小程序登录，为1则账号密码登录
    role: 0// 角色 0为普通用户，1为管理员
  },

})