// pages/my/my.js
var {
  wxRequest
} = require('../../utils/request.js');
// const {
//   authorize
// } = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    userData: null,
    showModal: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.processData();
  },
  onHide: function () {
    this.hideModal();
  },
  onShow:function(){
    let {userInfo} = app.globalData;
    let {userData} = app.globalData;
    this.setData({userInfo,userData});
  },
  // 下拉刷新时更新用户数据
  onPullDownRefresh() {
    this.processData();
    wx.stopPullDownRefresh();
  },
  // 处理数据
  processData: function () {
    if (app.globalData.userData && app.globalData.userInfo) {
      this.setData({
        userData: app.globalData.userData,
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }

  },
  //退出登录
  logOut: function (e) {
    wx.showModal({
      title: '退出登录',
      content: '确认退出登录吗？',
      confirmColor: '#ff0000',
      success: (res) => {
        if (res.confirm) {
          wxRequest({
            url: '/session',
            method: 'DELETE'
          }).then((res) => {
            // console.log(res);
            let logOut = {
              userInfo: null,
              userData: null,
              "X-Access-Token": '',
              logInWay: 0, // 登录方式，为0则小程序登录，为1则账号密码登录
            }
            app.globalData={...logOut};
            wx.removeStorageSync('signin');
            this.setData({
              userData: app.globalData.userData,
              userInfo: null
            })
            wx.showToast({
              title: res.data.message,
              icon: 'success'
            })

          })

        }
      }
    })



  },
  // 去登录
  goToSignIn: function () {

    wx.navigateTo({
      url: '../signin/signin',
    })
  },



  // 正在使用的获取用户信息，小程序一键登录
  getUserInfo: function (e) {
    // console.log(e.detail);
    let {
      userInfo
    } = e.detail;
    // console.log(userInfo);
    if (userInfo) {
      wx.login({
        success: (res) => {
          wxRequest({
            url: '/patient/account/wechat?code=' + res.code + '&name=' + userInfo.nickName,
            method: 'POST'
          }).then((res) => {
            // console.log(res);
            app.globalData.userInfo = userInfo;
            app.globalData.userData = res.data.user;
            this.processData();
          })

        }
      })
    } else {
      wx.showToast({
        title: '未获取授权，登陆失败',
        icon: 'none'
      })
    }

    // wx.showToast({
    //   title: '该功能即将上线，敬请期待',
    //   icon: 'none',
    // })
    this.hideModal();
  },
  // 显示模态框
  showModal: function () {
    this.setData({
      showModal: true
    })
  },
  // 隐藏模态框
  hideModal: function () {
    this.setData({
      showModal: false
    })
  }
})