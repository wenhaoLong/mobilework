// pages/setting/setting.js
var {
  wxRequest,
  formDataRequest
} = require('../../utils/request.js');
const app = getApp();
const moment = require('../../utils/moment.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuIndex: 0,
    canIChange: false,
    userInfo: {}, // 用户信息
    genderContent: ['隐藏', '男', '女'],
    today: '',
    formData: { //修改个人信息时要提交的数据
      gender: 0,
      birthday: '2016-09-01',
      name: '...'
    },
    formForMobile: {},
    mobile: '',
    showModel: false,
    modelItem: 0, //模态框内容，为零时表示修改密码，为1表示修改手机号
    changeMobileStep: 1,
    captchaImg: '',
    timer: 60,
    isGetVerifyCode: false,
    logInWay: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userData,
      logInWay: app.globalData.logInWay
    })
    if (this.data.userInfo) {
      this.processData();
    } else {
      wx.showToast({
        title: '您还未登录，没有您的数据',
        icon: 'none'
      })
    }

  },
  // 处理数据
  processData: function () {
    let today = new Date();
    let {
      userInfo
    } = this.data;
    let mobile = userInfo.mobile ? this.data.userInfo.mobile.slice(0, 3) + '****' + this.data.userInfo.mobile.slice(7, 11) : "****";
    let formData = {};
    formData.gender = userInfo.gender;
    formData.birthday = userInfo.birthday ? moment(userInfo.birthday).format('YYYY-MM-DD') : null;
    formData.name = userInfo.name ? userInfo.name : "";
    // console.log(formData);
    
    this.setData({
      formData: formData,
      today: today.toISOString().slice(0, 10),
      mobile: mobile
    })

  },
  // 菜单选择器
  toSelectMenu: function (e) {
    // console.log(e);
    this.setData({
      menuIndex: parseInt(e.currentTarget.dataset.index)
    })
  },
  //修改姓名
  inputName: function (e) {
    let name = e.detail.value.replace(/\s/g, "");
    // console.log("1"+name + "1");
    let formData = this.data.formData;
    formData.name = name;
    this.setData({
      formData: formData
    })

  },
  //性别选择器
  pickerGender: function (e) {
    // console.log(e.detail.value);
    let formData = this.data.formData;
    formData.gender = parseInt(e.detail.value);
    this.setData({
      formData: formData
    })
  },
  //日期选择器
  pickerDate: function (e) {
    // console.log(e.detail.value);
    let formData = this.data.formData;
    formData.birthday = e.detail.value;
    this.setData({
      formData: formData
    })
  },
  // 开始更新
  canUpdateInfo: function (e) {
    this.setData({
      canIChange: true
    })
  },
  //取消更新/重新渲染数据
  redoRenderInfo: function (e) {
    this.setData({
      canIChange: false
    })
    this.processData();

  },
  // 提交更新
  submitForm: function (e) {
    let formData = this.data.formData;
    console.log(formData);

    if (formData.name === "") {
      wx.showToast({
        title: '您的姓名输入不合法',
        icon: 'none',
        mask: true
      })
    } else {
      formDataRequest({
        url: '/account/basic',
        method: 'PUT',
        formData: formData
      }).then((res) => {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
        })
        console.log(res);
        app.globalData.userData = res.data.data;
        this.setData({
          userInfo: res.data.data
        });
        this.redoRenderInfo();

      })




    }
  },
  // 重置密码
  resetPassword: function (e) {
    // console.log(e);
    this.setData({
      modelItem: 0,
      showModel: true,
    })
  },
  //重置手机号
  resetMobile: function (e) {
    this.setData({
      modelItem: 1,
      showModel: true,
      changeMobileStep: 1,
    })


  },
  // 隐藏模态框
  hideModel: function (e) {
    this.setData({
      showModel: false
    })
  },
  //提交密码
  submitpassword: function (e) {
    // console.log(e);
    let oldPassword = e.detail.value.oldPassword;
    let newPassword = e.detail.value.newPassword;
    let secondPassword = e.detail.value.secondPassword;
    let error = '';
    if (oldPassword === "" || newPassword === "" || secondPassword === "") {
      error = "输入不能为空";
    } else if (oldPassword.length < 6 || newPassword.length < 6 || secondPassword.length < 6) {
      error = "密码长度应在6-20之间";
    } else if (newPassword !== secondPassword) {
      error = "两次密码输入不一致";
    }
    if (error) {
      wx.showToast({
        title: error.toString(),
        icon: 'none',
        mask: true
      })
    } else {
      wxRequest({
        url: '/patient/account/password',
        method: 'PUT',
        data: {
          oldPassword: oldPassword,
          password: newPassword
        }
      }).then((res) => {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          mask: true
        })
        this.hideModel();
        wx.removeStorage({
          key: 'signin',
        });
      })

    }

  },
  // 提交旧手机号获取验证码
  submitMobile: function (e) {
    // console.log(e);
    let mobile = e.detail.value.mobile;
    if (mobile.length === 11) {
      wxRequest({
        url: '/patient/verify/captcha/changeMobile/' + mobile,
        responseType: 'arraybuffer'
      }).then((res) => {
        this.data.formForMobile.mobile = mobile;
        this.setData({
          captchaImg: wx.arrayBufferToBase64(res.data),
          changeMobileStep: 2,
        })
      })
    } else {
      wx.showToast({
        title: '您的输入不符合规则',
        icon: 'none'
      })
    }


  },
  // 返回上一步
  previousStep: function () {
    this.setData({
      changeMobileStep: this.data.changeMobileStep - 1
    })
  },
  // 更新图形验证码
  changeCaptcha: function () {
    wxRequest({
      url: '/patient/verify/captcha/changeMobile/' + this.data.formData.mobile + '?random=' + Math.random(),
      responseType: 'arraybuffer'
    }).then((res) => {
      // console.log(res);
      this.setData({
        captchaImg: wx.arrayBufferToBase64(res.data),
      })

    })

  },
  // 输入图形验证码 
  inputCaptcha: function (e) {
    let captcha = e.detail.value;
    // console.log(captcha);
    this.data.formForMobile.captcha = captcha;
  },
  // 获取短信验证码
  getVerifyCode: function () {
    let formForMobile = this.data.formForMobile;
    if (formForMobile.captcha) {
      // console.log(captcha);
      wxRequest({
        url: '/patient/verify/sms/changeMobile',
        method: 'POST',
        data: {
          mobile: formForMobile.mobile,
          captcha: formForMobile.captcha
        }
      }).then((res) => {
        wx.showToast({
          title: '发送短信成功',
        })
        this.countDown(60);
      })
    } else {
      wx.showToast({
        title: '请输入图形验证码',
        icon: 'none'
      })


    }


  },
  // 倒计时函数
  countDown: function (e) {
    let timeOut = e || 60;
    this.setData({
      isGetVerifyCode: true
    })
    let timer = setInterval(() => {
      this.setData({
        timer: timeOut--
      });
      if (timeOut === 0) {
        this.setData({
          isGetVerifyCode: false,
          timer: 60
        })
        clearInterval(timer);
      }
    }, 1000);

  },
  // 提交全部数据修改手机号
  submitNewMobile: function (e) {
    // console.log(e.detail.value);
    let {
      verifyCode
    } = e.detail.value;
    let {
      newMobile
    } = e.detail.value;
    let mobile = this.data.formForMobile.mobile
    if (mobile == '' || newMobile == '' || verifyCode == '') {
      wx.showToast({
        title: '输入不能为空',
        icon: 'none'
      })
    } else if (newMobile.length < 11) {
      wx.showToast({
        title: '手机号输入不符合规则',
        icon: 'none'
      })
    } else {
      wxRequest({
        url: '/patient/account/mobile',
        method: 'PUT',
        data: {
          mobile: mobile,
          newMobile: newMobile,
          verifyCode: verifyCode
        }
      }).then((res) => {
        // console.log(res);
        app.globalData.userData = res.data;
        this.setData({
          userInfo: res.data
        })
        this.processData();
        this.hideModel();
      })
    }

  }

})