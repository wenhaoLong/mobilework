// components/globalfooter/globalfooter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    webUrl:{
      type: String,
      value: 'https://www.ccloudset.com'
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToWebView:function(){
      wx.navigateTo({
        url: '../web/web?url=' + this.properties.webUrl,
      })
      // console.log(this.properties.webUrl);
      
    }
  }
})
