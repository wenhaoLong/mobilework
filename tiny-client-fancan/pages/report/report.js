// pages/report/report.js
var { wxRequest } = require('../../utils/request.js');
var util = require('../../utils/util.js');
const moment = require('../../utils/moment.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportId: 0,
    
    profile: {},
    timeConsumption: '',
    scales: {},
    reportScales: []



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let reportId = parseInt(options.reportid);
    // console.log(reportId);
    this.requestData(reportId);
  },

  onPullDownRefresh: function (e) {
    this.requestData(this.data.reportId);
    wx.stopPullDownRefresh();
  },
  // 请求数据
  requestData: function (args) {
    wxRequest({
        url: '/patient/measure/test/report/' + args,
      })
      .then((res) => {
        this.processData(res.data.report);
        wx.hideLoading();
      });
  },
  // 处理传送过来的数据
  processData: function (e) {
    let profile = e.profile;
    let scales = e.scales[0];
    let seconds = e.scales[0].timeConsumption;
    let timeConsumption = '';
    profile.birthday = profile.birthday?moment(profile.birthday).format('YYYY-MM-DD'):'无';
    if (seconds >= 3600) {
      timeConsumption = Math.floor(seconds / 3600) + '小时' + Math.floor(seconds % 3600 / 60) + '分' + Math.floor(seconds % 3600 % 60) + '秒'
    } else if (seconds >= 60 && seconds < 3600) {
      timeConsumption = Math.floor(seconds % 3600 / 60) + '分' + Math.floor(seconds % 3600 % 60) + '秒'
    } else {
      timeConsumption = Math.floor(seconds % 3600 % 60) + '秒'
    }
    scales.createdAt = util.formatTime(e.createdAt);
    scales.conclusion = e.conclusion;
    scales.timeConsumption = timeConsumption;
    scales.standardText = e.standardText;
    this.setData({
      profile: profile,
      scales: scales,
      reportScales: e.reportScales,
      reportId: e.id
    })

  },
  // 跳转到外部链接

  clipBoardData:function(){
    wx.setClipboardData({
      data: 'https://hd.guahao.com/u/26741',
      success: ()=>{
        wx.showToast({
          title: '内容已复制,请前往浏览器打开',
          icon: 'none'
        })
      }
    })
  }
})