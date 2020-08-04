// pages/register/register.js
var { wxRequest } = require('../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    vcodeImg: '',
    canInputmobile: true,
    canGetVerifyCode: true,
    waitMessage: false,
    timeOut: 60,
    formData: {

    },
    rules: [
      {
        name: 'mobile',
        rules: [{required: true,message: '手机号必填'}, {mobile: true, message: '手机号格式不对'}],
      }, {
        name: 'verifyCode',
        rules: {required: true,message: '短信验证码必填'},
      }, {
        name: 'password',
        rules: [{ required: true, message: '请输入密码'},{ minlength: 6, message: '密码长度在6-20之间'},{ maxlength: 20, message: '密码长度在6-20之间'}],
      }, {
        name: 'verifyPassword',
        rules: [{required: true,message: '请再次输入密码'},{equalTo: 'password', message: '两次密码输入不一致'}],
      }
    ]


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //将输入添加到formData中
  formInputChange(e) {
      const { field } = e.currentTarget.dataset;
      // console.log(e);
      
      this.setData({
        [`formData.${field}`]: e.detail.value
      })
  },
    //获取图形验证码
    getCaptcha: function(e) {
      let mobile= this.data.formData.mobile;
      // console.log( mobile);
      if ( parseInt(mobile) && mobile.length === 11) {
        // console.log(mobile);
        wxRequest({
          url: '/patient/verify/captcha/register/' + mobile,
          responseType: 'arraybuffer'
        }).then( (res) => {
          // console.log(res);
          this.setData({
            vcodeImg: wx.arrayBufferToBase64(res.data),
            canInputmobile: false
          })
          
        })
        
        
      } else {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          mask: true
        })
      }

    },
    //更新图形验证码
    changeCaptcha:function(e) {
      wxRequest({
        url: '/patient/verify/captcha/register/' + this.data.formData.mobile + '?random=' + Math.random(),
        responseType: 'arraybuffer'
      }).then( (res) => {
        // console.log(res);
        this.setData({
          vcodeImg: wx.arrayBufferToBase64(res.data),
          canInputmobile: false
        })
        
      })
    },
    // 获取短信验证码
    getVerifyCode:function (e) {
      // console.log(e);
      let {captcha} = this.data.formData;
      let timeOut = 60;
      if (captcha) {
        console.log(captcha);
        wxRequest({
          url: '/patient/verify/sms/register',
          method: 'POST',
          data: {
            mobile: this.data.formData.mobile,
            captcha: this.data.formData.captcha
          }
        }).then( (res) => {
          console.log(res);
          wx.showToast({
            title: '短信发送成功',
            icon: 'success'
          })
          this.countDown(60);
          
        } )
      } else{
        wx.showToast({
          title: '请输入图形验证码',
          icon: 'none',
          mask: true
        })
      }
      
    },
    // 倒计时函数
    countDown:function(e) {
      let timeOut = e || 60;
      this.setData({
        waitMessage: true
      })
      let timer = setInterval( () =>{
        this.setData({
          timeOut: timeOut--
        });

        if (timeOut === 0) {
          this.setData({
            waitMessage: false,
            timeOut: 60
          })
          clearInterval(timer);
        }
      },1000);
      
    },

    // 提交数据
    submitForm() {
      this.selectComponent('#form').validate((valid, errors) => {
        console.log('valid', valid, errors)
        if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
            this.setData({
              error: errors[firstError[0]].message
            })
          }
        } else {
          wxRequest({
            url: '/account',
            method: 'POST',
            header: {
              "Content-Type": "multipart/form-data;boundary=WebKitFormBoundaryNDol8pnRpdhLBVAi"
            },
            data: 
                '\r\n--WebKitFormBoundaryNDol8pnRpdhLBVAi' +
                '\r\nContent-Disposition: form-data; name="mobile"' +
                '\r\n' +
                '\r\n' + 
                this.data.formData.mobile +
                '\r\n--WebKitFormBoundaryNDol8pnRpdhLBVAi' +
                '\r\nContent-Disposition: form-data; name="password"' +
                '\r\n' +
                '\r\n' + 
                this.data.formData.password +
                '\r\n--WebKitFormBoundaryNDol8pnRpdhLBVAi' +
                '\r\nContent-Disposition: form-data; name="verifyCode"' +
                '\r\n' +
                '\r\n' + 
                this.data.formData.verifyCode +
                '\r\n--WebKitFormBoundaryNDol8pnRpdhLBVAi--'
          }).then( (res) => {
            console.log(res);
            wx.showToast({
              title: '注册成功',
              complete: () => {
                wx.navigateBack();
              }
            })
          })

        }
      })
    }

})