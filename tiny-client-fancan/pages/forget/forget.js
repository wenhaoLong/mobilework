// pages/forget/forget.js
var { wxRequest } = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isGetCaptcha: false,
    isGetVerifyCode: false,
    everGetVerifyCode: false,
    formData: {
      mobile: '',
      verifyCode: '',
      password: '',
      secondPassword: '',
    },
    captchaUrl: '',
    captcha: '',
    timer: 60  //倒计时的计时器

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  allInput:function(e){
    console.log(e);
    
  },
  // 记录输入的手机号
  inputMobile:function(e){
    this.data.formData.mobile = e.detail.value
  },
  //获取图形验证码
  getCaptcha:function(){
    let mobile = this.data.formData.mobile;
    if (mobile.length<11) {
      wx.showToast({
        title: '输入手机号不符合规则',
        icon: 'none'
      })
    } else {
      wxRequest({
        url: '/patient/verify/captcha/resetPassword/' + mobile,
        responseType: 'arraybuffer'
      }).then((res)=>{
        this.setData({
          captchaUrl: wx.arrayBufferToBase64(res.data),
          isGetCaptcha: true
        })

      })
    }

  },
  // 更换图形验证码
  changeCaptcha:function(){
    wxRequest({
      url: '/patient/verify/captcha/resetPassword/' + this.data.formData.mobile + '?random=' + Math.random(),
      responseType: 'arraybuffer'
    }).then((res)=>{
      this.setData({
        captchaUrl: wx.arrayBufferToBase64(res.data)
      })
    })
  },
  // 记录输入的图形验证码
  inputCaptcha:function(e){
    this.setData({
      captcha: e.detail.value
    })
  },
  // 获取短信验证码
  getVerifyCode:function(){
    if (this.data.isGetCaptcha && this.data.captcha){
      wxRequest({
        url: '/patient/verify/sms/resetPassword',
        method: 'POST',
        data: {
          mobile: this.data.formData.mobile,
          captcha: this.data.captcha
        }
      }).then((res)=>{
        // console.log(res);
        this.setData({
          everGetVerifyCode: true
        })
        this.countDown(60);
        
      })
      
    } else {
      wx.showToast({
        title: '请先获取图形验证码并填入',
        icon: 'none'
      })
      
    }

  },
  // 倒计时函数
  countDown:function(e) {
    let timeOut = e || 60;
    this.setData({
      isGetVerifyCode: true
    })
    let timer = setInterval( () =>{
      this.setData({
        timer: timeOut--
      });
      if (timeOut === 0) {
        this.setData({
          isGetVerifyCode: false,
          timeOut: 60
        })
        clearInterval(timer);
      }
    },1000);
    
  },
  // 记录输入的短信验证码
  inputVerifyCode:function(e){
    this.data.formData.verifyCode = e.detail.value
  },
  // 记录输入的密码
  inputPassword:function(e){
    this.data.formData.password = e.detail.value
  },
  // 记录第二次输入的密码
  inputSecondPassword:function(e){
    this.data.formData.secondPassword = e.detail.value
  },
  // 提交数据
  submitInfo:function(){
    let { mobile, verifyCode, password, secondPassword } = this.data.formData;
    //进行数据校验，校验失败就将错误信息放入err中
    let err = [];
    let result = this.verifyPassword(password, secondPassword);
    if (!this.data.isGetCaptcha){
      err.push('请先获取验证码')
    } else if (!this.data.everGetVerifyCode || !verifyCode){
      err.push('请获取并输入短信验证码');
    } else if (result) {
      err.push(result);
    }
    // console.log(err);
    // 如果err长度为零，说明校验成功，请求数据  
    if (err.length!==0){
      wx.showToast({
        title: err.toString(),
        icon: 'none'
      })
    } else {
      // console.log("we are Here!");
      wxRequest({
        url: '/patient/account/'+ mobile+'/password',
        method: 'PUT',
        data: {
          mobile: mobile,
          verifyCode: verifyCode,
          password: password
        }
      }).then((res)=>{
        console.log(res);
        wx.showToast({
          title: JSON.stringify(res.data),
          icon: 'none',
          mask: true,
          duration: 2000,
          complete: ()=>{
            setTimeout(() => {
              wx.navigateBack();
            }, 2000);
          }
        })
        
      })
      
    }
  },
  //密码校验
  verifyPassword:function(passwordA,passwordB){
    if (!passwordA){
      return "密码不能为空"
    } else if (passwordA.length<6 || passwordA.length>20) {
      return "密码长度为6-20之间"
    } else if(passwordA != passwordB){
      return "两次密码不一致"
    } else {
      return "";
    }

  }

})