// pages/logManagement/accessLog.js
const {
  adminRequest
} = require('../../utils/request');
const {
  formatTime
} = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logType: 1, // 日志类型，为1则为正常日志，为0则为异常日志
    currentPage: 1, // 要跳转的页码
    pageSize: 10, // Table尺寸
    searchParams: null, //搜索栏参数 Object
    dataSource: null, // 存放列表数据 Object
    columns: [{
        title: '用户',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '请求方式',
        dataIndex: 'method',
        key: 'method',
      },
      {
        title: '路径',
        dataIndex: 'url',
        key: 'url',
      },
      {
        title: 'IP地址',
        dataIndex: 'ip',
        key: 'ip',
        // width: '150rpx'
      },
      {
        title: '输入数据',
        dataIndex: 'requestData',
        key: 'requestData',
        ellipsis: true,
        width: '250rpx'
      },
      {
        title: '输出数据',
        dataIndex: 'response',
        key: 'response',
        ellipsis: true,
        width: '250rpx'
      },
      {
        title: '日期',
        dataIndex: 'createdAt',
        key: 'createdAt',
        // width: '270rpx',
        render: (text) => {
          console.log(text);

          return formatTime(text);
        },
      },
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestLogs({});


  },

  // 获取菜单树
  getMenu: function () {
    adminRequest({
      url: '/menu',
    }).then((res) => {
      console.log(res);
      this.setData({
        menuList: res.data.menus
      })

    })
  },

  // 封装一个请求函数
  requestLogs: function ({
    params,
    callback
  }) {

    let {
      logType,
      currentPage,
      pageSize,
    searchParams
    } = this.data;
    adminRequest({
      url: '/admin/log',
      data: {
        ...searchParams,
        logType: logType,
        page: currentPage,
        pageSize: pageSize,
        ...params
      }
    }).then((res) => {
      let {
        list,
        pagination
      } = res.data;
      list.forEach((item) => {
        // console.log(item);
        item.createdAt = formatTime(item.createdAt);
      });
      this.setData({
        dataSource: list,
        pagination: pagination
      });
      // 回调函数
      if (callback) callback(res);
    })

  },

  // 通过Pagination组件，改变页码
  pageChange: function (e) {
    let {
      detail
    } = e;
    // console.log(detail);
    this.requestLogs({
      params: {
        page: detail
      },
      callback: (res) => {
        this.setData({
          currentPage: detail
        })
      }
    })

  },

  // picker改变
  startPicker: function (e) {


    let {
      searchParams
    } = this.data;
    console.log(e);

    this.setData({
      searchParams: {
        ...searchParams,
        startDate: e.detail.value
      }
    });
  },
  // picker改变
  endPicker: function (e) {
    let {
      searchParams
    } = this.data;
    console.log(e);

    this.setData({
      searchParams: {
        ...searchParams,
        endDate: e.detail.value
      }
    });
  },

  // 重置表单
  formReset: function (e) {
    console.log("重置表单", e);
    this.setData({
      searchParams: null
    });

  }


})