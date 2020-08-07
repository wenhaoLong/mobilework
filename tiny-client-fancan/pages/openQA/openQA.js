// pages/openQA/openQA.js
const {
  wxRequest
} = require('../../utils/request.js');
const {
  wxRequestForResponse
} = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft:0
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 请求数据
    wxRequest({
      url: '/patient/measure/test',
      method: 'POST',
      data: {
        
      }
    }).then((res) => {
      console.log(res)
      // let chosen = this.data.chosen;
      // if (chosen < this.data.questionLength - 1) {
      //   this.setData({
      //     chosen: chosen + 1
      //   }, () => {
      //     //切题后，停顿一秒开始读题
      //     if (testWay == 1) {
      //       setTimeout(this.readTitle, 1000);
      //     }
      //   })
      // } else if (chosen == this.data.questionLength - 1) {
      //   wxRequest({
      //     url: '/patient/measure/test/finish?reportId=' + this.data.reportId,
      //     method: 'POST'
      //   }).then((res) => {
      //     wx.redirectTo({
      //       url: '/pages/openQA/openQA',
      //     })
      //     // wx.redirectTo({
      //     //   url: '/pages/history/history',
      //     // })
      //   })
      // }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})