// pages/scale/scale.js
const {
  wxRequest
} = require('../../utils/request.js');
const {
  wxRequestForResponse
} = require('../../utils/request.js');
const plugin = requirePlugin('WechatSI');
const manager = plugin.getRecordRecognitionManager();
const innerAudioContext = wx.createInnerAudioContext();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scaleDetail: {}, //量表描述
    showModal: false, // 展示模态框，用户选择测试方式
    testWay: null, // 测试方式，为0则手动测试，为1则语音测试
    scale: {},
    chosen: 0, // 题目序号
    scaleId: 0, // 量表Id
    reportId: 0,
    questionLength: 14, // 量表题目的数量
    isStart: false, // 为假则说明还未开始测试，显示量表详情；为真则说明开始测试，显示量表题目
    voiceResult: null, // 语音解析的结果
    isRecording: false, // 正在录音 用于显示录音动画

    restTime: 5,
    hasRecord: false,
    isDot: "block",
    isTouchStart: false,
    isTouchEnd: false,
    value: '100',
    touchStart:0,
    touchEnd:0,
    vd:''
  },


  /**判断是新的测试或者继续旧的测试
   *  参数是scaleId，说明是新的测试，参数是reportId，说明是继续旧的测试
   */
  onLoad: function (options) {
    // console.log(options);
    if (options.scaleId) { // 新测试入口，请求scaleDetail
      wxRequest({
          url: '/patient/measure/test/scaleDetail',
          data: {
            scaleId: options.scaleId
          }
        })
        .then((res) => {
          // console.log(res);
          this.setData({
            scaleDetail: res.data.scale,
            scaleId: res.data.scale.id
          })
        })

    } else if (options.reportId) { // 继续旧测试
      // this.startScale();
      this.showModal();
    }


  },
  // 页面卸载，停止播放
  onUnload: function () {
    innerAudioContext.stop();

  },
  // 页面隐藏，暂停播放
  onHide: function () {
    innerAudioContext.pause();
  },
  //页面显示，如果是测试到中途退出，继续播放
  onShow: function () {
   
    innerAudioContext.volume = 1;
    let {
      isStart
    } = this.data;
    if (isStart) {
     
      
      innerAudioContext.play();
      
    }

  },


  // 显示选择Modal，让用户选择测试方式。
  showModal: function () {

    this.setData({
      showModal: true
    })
  },

  hideModal: function () {
    this.setData({
      showModal: false
    })
  },

  // 选择测试方式为手动测试
  testInManual: function () {
    this.setData({
      testWay: 0,
      showModal: false,
    })
    this.startScale(0);

  },

  // 选择测试方式为语音测试
  testInAuto: function () {

    this.setData({
      testWay: 1,
      showModal: false,
    })

    this.startScale(1, () => {
      wx.showToast({
        title: '对于选项，您只需回答相应选项的的数字即可',
        icon: 'none',
        duration: 3000
      })
    });


  },
  // 无用的函数，只是为了阻止冒泡
  uselessFun: function () {

  },

  // 语音朗读题目
  readTitle: function () {
    let {
      scale,
      chosen
    } = this.data;
    let {
      choices
    } = scale.questions[chosen];
    let choicesText = '';
    //将题目和文字拼接成完成一段，调用一次文本转语音接口，减少接口请求次数。
    // 缺点是语速过快，选项之间没有停顿
    for (let i in choices) {
      choicesText += `${Number(i) + 1}、${choices[i].text}        `;
    }
    let text = `${chosen + 1}、${scale.questions[chosen].question}, ` + choicesText;
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
    innerAudioContext.pause();
    var n = this;
    n.setData({
      touchStart: e.timeStamp,
      isTouchStart: true,
      isTouchEnd: false,
      showPg: true,
      
    })

    // var a = 5;
   
    // this.timer = setInterval(function () {
    //   n.setData({
    //     value: n.data.value - 10000 / 500,
    //     restTime: n.data.restTime - 1
    //   })
    //   a -= 1
    //   if (a<=0) {
      
        
    //     //manager.stop()
    //     clearInterval(n.timer)
    //     n.setData({
    //       showPg: false,
    //     })
    //   }
    // }, 1000);

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
    //manager.stop();
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
    manager.onStart = (res) => {
      console.log('onStart' + JSON.stringify(res));
      this.setData({
        isRecording: true
      })
    }
    manager.onStop = (res) => {
      console.log('onStop' + JSON.stringify(res));
      console.log('result' + JSON.stringify(res.result));
      this.setData({
        isRecording: false,
        tempFilePath: res.tempFilePath,
        content: res.result
      })
      this.processResult();
    };
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
      lang: 'zh_CN'
    });
    // setTimeout(() => {
    //   this.endRecord();
    // }, 3000)
  },
  //停止录音
  endRecord: function () {


    manager.stop();
  },
  // 处理语音识别结果
  processResult: function () {
    let {
      content, // content为语音转文字的结果
      scale,
      chosen
    } = this.data;
    let {
      choices
    } = scale.questions[chosen];
    // 语音转文字效果足够好，一般只需判断返回文字里有没有一二三四五
    let map = {
      "一": 1,
      "二": 2,
      "三": 3,
      "四": 4,
      "五": 5,
      "六": 6,
      "七": 7,
    }
    //正则匹配
    let result = content.match(/[一二三四五六七1234567]/g);
    console.log(result);
    wx.showToast({
      title: JSON.stringify(result),
    })
    if (result) {
      let index = map[result[result.length - 1]];
      console.log(choices[index - 1].id);
      let choicesId = choices[index - 1].id;
      wx.showToast({
        title: `您的选项是：选项${index}`,
        icon: 'none',
        duration: 1000
      })
      this.setData({
        voiceResult: choicesId
      })
      // 用户有三秒钟时间查看自己答案和修改
      // 三秒后调用提交答案方法，跳转下一题
      setTimeout(() => {
        wx.hideToast({
          complete: (res) => {
            wx.showToast({
              title: '答案将自动提交',
              icon: 'none',
            })
          },
        })

      }, 1300)


      setTimeout(() => {
        this.postAnswer(choicesId);
      }, 3000)

    } else {
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

  // 开始测试
  startScale: function (testWay, callback) {
    let {
      scaleId
    } = this.data;
    let reportId = app.globalData.reportId;
    wxRequestForResponse({
      url: '/patient/measure/test/certainScales?scaleId=' + scaleId + '&reportId=' + reportId,
      method: 'POST'
    }).then((res) => {
      return wxRequest({
        url: '/patient/measure/test/scales',
        method: 'GET',
        data: {
          reportId: reportId
        }
      })
    }).then((res) => {
      // console.log("Im here!");
      // console.log(res);
      this.setData({
        reportId: reportId,
        chosen: res.data.chosen,
        scale: res.data.scales,
        questionLength: res.data.scales.questionNumber,
        isStart: true
      }, () => {
        // 数据渲染完成后,停顿一秒再开始读题
        if (testWay == 1) {
          setTimeout(this.readTitle, 1000)
        }
        if (callback) callback();
      })


    })

  },


  // 提交答案
  postAnswer: function (e) {
    let {
      testWay
    } = this.data;
    // console.log(e);
    let answerId = e.detail ? e.detail.value.radio : e;
    if (!answerId) {
      wx.showToast({
        title: '您还未作答',
        icon: 'none'
      })
    } else {

      // 如果是语音答题，那么中断语音
      // 主要是为了防止用户还没听完语音就答题，这样两段语音就会重合
      if (this.data.testWay == 1) {
        innerAudioContext.stop();
      }

      // console.log(answerId);
      wxRequest({
        url: '/patient/measure/test/scale',
        method: 'POST',
        data: {
          reportId: this.data.reportId,
          choiceId: answerId
        }
      }).then((res) => {
        let chosen = this.data.chosen;
        if (chosen < this.data.questionLength - 1) {
          this.setData({
            chosen: chosen + 1
          }, () => {
            //切题后，停顿一秒开始读题
            if (testWay == 1) {
              setTimeout(this.readTitle, 1000);
            }
          })
        } else if (chosen == this.data.questionLength - 1) {
          wxRequest({
            url: '/patient/measure/test/finish?reportId=' + this.data.reportId,
            method: 'POST'
          }).then((res) => {
            wx.redirectTo({
              url: '/pages/openQA/openQA',
            })
            // wx.redirectTo({
            //   url: '/pages/history/history',
            // })
          })
        }
      })

    }

  }
})