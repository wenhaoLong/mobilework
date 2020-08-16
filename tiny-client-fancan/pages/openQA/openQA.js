// pages/openQA/openQA.js
const {
  wxRequest
} = require('../../utils/request.js');
const {
  formDataRequest
} = require('../../utils/request.js');
const innerAudioContext = wx.createInnerAudioContext();
const app = getApp();
const plugin = requirePlugin('WechatSI');
//const manager = plugin.getRecordRecognitionManager();
const manager = wx.getRecorderManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft:0,
    // 是否打开摄像头
    camera:false,
    // 提示界面
    tip:true,
    base64:"",
    // 问题
    title:"",
    isRecording: false, // 正在录音 用于显示录音动画
    voiceResult: "", // 语音解析的结果
    id:"",
    reportId:""
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
    //let signin = wx.getStorageSync('signin');
    
    // if (signin) {
    //   wxRequest({
    //     url: '/session',
    //     method: 'POST',
    //     data: signin,
    //   }).then((res) => {
    //     //console.log(res);
    //     wxRequest({
    //       url: '/patient/measure/test',
    //       method: 'POST',
    //     }).then((res) => {
    //       //console.log(res);
    //       let reportId = res.data.lastReportId;
    //       console.log(reportId);
    //       wxRequest({
    //         url: '/patient/measure/test/audio?reportId=' + reportId,
    //         method: 'GET',
    //       }).then((res) => {
    //         console.log(res);
    //       })
          
    //     })
    //   });
    // }

  },

  // 开始测评
  startQA: function(e){
    var that = this;
    that.setData({
      tip: false
    })
    this.getQuestion();
  },

  // 打开摄像头
  handleCamera:function(e){
    console.log(e);
    if(e.detail.value == true){
      this.setData({
        camera: true
      })
    }
  },

  // 获取问题
  getQuestion: function(e){
    let signin = wx.getStorageSync('signin');
    
    if (signin) {
      wxRequest({
        url: '/session',
        method: 'POST',
        data: signin,
      }).then((res) => {
        //console.log(res);
        wxRequest({
          url: '/patient/measure/test',
          method: 'POST',
        }).then((res) => {
          console.log(res);
          let reportId = res.data.lastReportId;
          console.log(reportId);
          wxRequest({
            url: '/patient/measure/test/audio?reportId=' + reportId,
            method: 'GET',
          }).then((res) => {
            console.log(res);
            let title = res.data.next.text;
            let id = res.data.next.id
            this.setData({
              title,
              id,
              reportId
            })
            
            this.readTitle(title);
          })
          
        })
      });
    }
  },

  // 读题
  readTitle: function (title) {
    
    let text = title;
    innerAudioContext.onPlay(function(){
  
      innerAudioContext.onTimeUpdate(function(){
        var currentTime = innerAudioContext.currentTime  * 1000
     
        that.setData({ 
          msg: innerAudioContext.duration,
          msg2: innerAudioContext.currentTime  * 1000
        });

      })
    })
    innerAudioContext.onEnded(() => {
      console.log('readStop!');
      //this.beginRecord();
    })
   
    plugin.textToSpeech({
      lang: 'zh_CN',
      tts: true,
      content: text,
      
      success: (res) => {
        console.log("succ tts", res.filename)
        innerAudioContext.src = res.filename;
        
        innerAudioContext.play();
        
      },
      fail: function (res) {
        console.log("fail tts", res)
      }
    })
  },


   // 开始点击录音按钮
  /**
   * 长按录音开始
   */
  recordStart: function(e) {
   
    this.beginRecord();
    var n = this;
    n.setData({
      touchStart: e.timeStamp,
      isTouchStart: true,
      isTouchEnd: false,
      showPg: true,
      
    })


  },


  /**
   * 长按录音结束
   */
  recordTerm: function(e) {

    setTimeout(() => {
      manager.stop();
      // this.setData({
      //   restTime: 5
      // })
    }, 500)
    this.setData({
      isTouchEnd: true,
      isTouchStart: false,
      touchEnd: e.timeStamp,
      showPg: false,
      value: 100,
      
    })
    //clearInterval(this.timer);
  },


  // 录音
  beginRecord: function () {
    var that = this;
    manager.onStart = (res) => {
      console.log('onStart' + JSON.stringify(res));
      that.setData({
        isRecording: true
      })
    }
    manager.onStop(function(e) {
      console.log(e.tempFilePath)
      that.setData({
        tempFilePath: e.tempFilePath
      })
      that.postAnswer();
    }),
    // manager.onStop = (res) => {
    //   console.log('onStop' + JSON.stringify(res));
    //   console.log('result' + JSON.stringify(res.result));
    //   this.setData({
    //     isRecording: false,
    //     tempFilePath: res.tempFilePath,
    //     content: res.result
    //   })
    //   this.processResult();
    // };
    manager.onError = (res) => {
      console.log('onError' + JSON.stringify(res));
      if (res.retcode === -30001) {
        wx.showModal({
          cancelColor: 'cancelColor',
          title: '录音失败',
          content: '请检查您是否开启了录音权限',
          cancelText: '取消',
          cancelColor: '',
          confirmText: '打开设置',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                complete: (res) => {},
              })
            }
          }
        })
      }

    }
    manager.start({
      format: "pcm",
      sampleRate: 32e3,
      encodeBitRate: 192e3
    });
    // setTimeout(() => {
    //   this.endRecord();
    // }, 3000)
  },

  // 处理语音识别结果
  processResult: function () {
    let {
      content, // content为语音转文字的结果
    } = this.data;

    console.log(content);
  
    // wx.showToast({
    //   title: JSON.stringify(result),
    // })
    if (content) {
     
      this.setData({
        voiceResult: content
      })
      // 用户有三秒钟时间查看自己答案和修改
      // 三秒后调用提交答案方法，跳转下一题
      // setTimeout(() => {
      //   wx.hideToast({
      //     complete: (res) => {
      //       wx.showToast({
      //         title: '答案将自动提交',
      //         icon: 'none',
      //       })
      //     },
      //   })

      // }, 1300)

      this.postAnswer();
      // setTimeout(() => {
      //   this.postAnswer();
      // }, 3000)

    } else {
      this.postAnswer();
      wx.showToast({
        title: '抱歉，没有听取您在说什么',
        icon: 'none'
      })

      setTimeout(() => {
        wx.hideToast({
          complete: (res) => {
            wx.showToast({
              title: '请手动选择选项并提交',
              icon: 'none'
            })
          },
        })
      }, 2000)
    }

  },

  // 提交答案
  postAnswer: function () {
    var that = this;
    let tempFilePath = that.data.tempFilePath;
    
    console.log(tempFilePath);
    let id = parseInt(that.data.id);
    let boundry = 'wxFormBoundary' + new Date().getTime().toString();
   // header内既要设置contentType，还要设置token
   let header = {
     "Content-Type": `multipart/form-data;boundary=${boundry}`
   };
   header["X-Access-Token"] = app.globalData["X-Access-Token"];

    wx.uploadFile({
      filePath: tempFilePath,
      name: 'answer',
      header: header,
      url: 'https://v21.ihappy.ccloudset.com/api/v2_1/patient/measure/test/audio',
      formData :{
        id: id
      },
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
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