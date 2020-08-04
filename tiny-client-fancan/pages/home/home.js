// pages/home/home.js
var { wxRequestForResponse } = require('../../utils/request.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ['智能心理健康测评系统iHappy, 是一种融合文本（量表）、语音和视频多模态特征的心理健康检测系统。','团队与华西医院专家合作，各种测评题目（含疫情期心理测评三套）和调节咨询建议均由领域专家制定和推荐。测试者可通过Web，Pad、手机等方式使用，为被测试人员节约时间和成本并提供便利，及时发现可能的心理健康问题以减少隐患和危害。系统给测试者提供重要参考价值的测评综合分析报告和必要的咨询建议，适合政府、教育机构、学校及企业进行在线心理健康测试，心理疾病测评，心理健康普查等应用。','（目前免费版本暂未提供语音和视频功能、未支持Pad和手机等移动设备）']



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
    wxRequestForResponse({
      url: '/patient/measure/test',
      method: 'POST'
    }).then((res) => {
      app.globalData.reportId = res.data.reportId || res.data.lastReportId;
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

  },
  // 跳转到量表列表页面
  goToTest: function(){
    wx.switchTab({
      url: '../scalelist/scalelist',
    })
  }

})