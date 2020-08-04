// pages/test/test.js
var { wxRequest } = require('../../utils/request.js');
var { wxRequestForResponse } = require('../../utils/request.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenu: [],
    rightContent: [],
    selectedMenu: 0, 
    showModel: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
 //获取用户的test信息
  onShow: function(e) {
    if (app.globalData.userData) {
      this.requestData();
    }else {
      this.setData({
        leftMenu: [],
        rightContent: []
      })

    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wxRequestForResponse({
      url: '/patient/measure/test',
      method: 'POST'
    }).then((res) => {
      app.globalData.reportId = res.data.reportId || res.data.lastReportId;
      let { breakPoint } = res.data;
      
      if (res.statusCode == 401){
        wx.showToast({
          title: '您还未登录，没有访问权限',
          icon: 'none'
        })
      } else if (breakPoint==null) {
        wx.showToast({
          title: JSON.stringify(res.data),
          icon: 'none'
        })
      } else if (breakPoint != -1) {
        this.setData({
          showModel: true
        })
        wx.hideLoading();
      } else{
        wx.hideLoading();
      }

    })
  },
  //隐藏蒙层
  onHide: function(){
    this.setData({
      showModel: false
    })
  },
  //删除报告
  deleteReport:function() {
    wxRequest({
      url: '/patient/measure/report?reportId=' + app.globalData.reportId,
      method: 'DELETE',
    }).then((res) => {
      wxRequestForResponse({
        url: '/patient/measure/test',
        method: 'POST'
      }).then((res)=> {
        app.globalData.reportId = res.data.reportId || res.data.lastReportId;
        this.setData({
          showModel:false
        });
        wx.showToast({
          title: '删除量表成功',
        })
      })
    })
  },
  // 继续测评
  continueReport:function() {
    wx.navigateTo({
      url: '../scale/scale?reportId=' + app.globalData.reportId,
    })
  },

  // 下拉刷新
  onPullDownRefresh:function(e) {
    this.requestData();
    wx.stopPullDownRefresh();
  },

  //请求数据
  requestData: function (e) {
      wxRequest({
        url: '/patient/measure/test/types'
      }).then((res) => {
        this.processData(res.data);
        wx.hideLoading();
      })
  },
  //处理数据
  processData: function (e) {
    let leftMenu = [];
    let rightContent = [];
    e.List.forEach(element => {
      leftMenu.push({
        id: element.id,
        name: element.name
      });
      rightContent.push(element.scales);
    });
    this.setData({
      leftMenu: leftMenu,
      rightContent: rightContent
    });

  },

  // 左菜单联动右侧
  selectMenu: function(e) {
    // console.log(e);
    this.setData({
      selectedMenu: e.currentTarget.dataset.index
    });
    
  },

  // 传递量表ID，进入量表测评界面
  goToScale: function(e) {
    wx.navigateTo({
      url: '/pages/scale/scale?scaleId=' + e.currentTarget.dataset.id,
    })
    // console.log(e.currentTarget.dataset.id);
  }
})