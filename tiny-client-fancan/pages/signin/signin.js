// pages/signin/signin.js
var { wxRequest, adminRequest } = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: 0, // 角色，0为用户登录，1为管理员登录

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let signin = wx.getStorageSync('signin');
    // console.log(signin);
    if (signin) {
      wxRequest({
        url: '/session',
        method: 'POST',
        data: signin,
      })
      .then((res) => {
        // console.log(res);
          app.globalData.userData = res.data.user;
          // wx.hideLoading();
          wx.switchTab({
            url: '/pages/home/home',
          })
      });

    }

  },
  // 提交登录数据
  submitSignIn: function (e) {
    // console.log(e);
    let { role } = this.data;
    if (role === 0){
      wxRequest({
        url: '/session',
        method: 'POST',
        data: {
          username:e.detail.value.mobile,
          password:e.detail.value.password
        },
      })
      .then((res) => {
        // console.log(res);
          app.globalData.userData = res.data.user;
          // wx.hideLoading();
          wx.switchTab({
            url: '/pages/my/my',
          })
          wx.setStorage({
            data: {
              username:e.detail.value.mobile,
              password:e.detail.value.password
            },
            key: 'signin',
          })
      });
    } else if (role === 1){
      // 管理员登录
      adminRequest({
        url: '/session',
        method: 'POST',
        data:{
          username: e.detail.value.mobile,
          password: e.detail.value.password
        }
      })
      .then((res) => {
        // console.log(res);
          app.globalData.userData = res.data;
          app.globalData.role = 1;
          // wx.hideLoading();
          wx.reLaunch({
            url: '/pages/logManagement/accessLog',
          })
          wx.setStorage({
            data: e.detail.value,
            key: 'signin',
          })
      });
    }
    
  },
  // 修改登录方式，改变渲染
  userSignIn:function(){
    this.setData({
      role:0
    })
  },
  adminSignIn:function(){
    this.setData({
      role:1
    })
  },

})