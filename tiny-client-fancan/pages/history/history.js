// pages/history/history.js
var {
  wxRequest
} = require('../../utils/request.js');
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportsList: [],
    pagination: 0,
    pagesAcount: 1,
    page: 1,
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestData(1);

  },

  //请求数据
  requestData: function (args) {
    wxRequest({
        url: '/patient/measure/history',
        data: {
          page: args,
          pageSize: 10
        }
      })
      .then((res) => {
        this.processData(res.data, args);
      })


  },
  // 处理数据
  processData: function (e, page) {
    let list = e.list;
    list.forEach((element) => {
      element.finishedAt = util.formatTime(element.finishedAt);
      // console.log(element.finishedAt);
    });
    this.setData({
      pagination: e.pagination,
      reportsList: list,
      page: page,
      pagesAcount: Math.ceil(e.pagination / 10)
    })

  },

  //上一页
  toPreviousPage: function (e) {
    this.requestData(this.data.page - 1);
  },
  //下一页
  toNextPage: function (e) {
    this.requestData(this.data.page + 1);
  },
  //去指定页码
  toInputPage: function (e) {
    let page = parseInt(e.detail.value.page);
    console.log(isNaN(page));
    if (!isNaN(page)) {
      let target;
      if (page < 1) {
        target = 1;
      } else if (page > this.data.pagesAcount) {
        target = this.data.pagesAcount;
      } else {
        target = page;
      }
      this.requestData(target);
      this.setData({
        inputValue: ''
      })
    }
  },
  //   
  goToReport: function (e) {
    wx.navigateTo({
      url: '/pages/report/report?reportid=' + e.currentTarget.dataset.show,
    })
  }




})