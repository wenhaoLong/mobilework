 const app = getApp();
 const {
   baseURL
 } = require('./config')
 const {
   adminURL
 } = require('./config')


 const wxRequest = (params) => {
   let header = params.header || {};
   header["X-Access-Token"] = app.globalData["X-Access-Token"];
   return new Promise((resolve, reject) => {
     wx.showLoading({
       title: '加载中',
       mask: true
     });
     wx.request({
       ...params,
       url: baseURL + params.url,
       header: header,
       success: (res) => {
         if (res.header["X-Access-Token"]) {
           app.globalData["X-Access-Token"] = res.header["X-Access-Token"]
         }
         if (res.statusCode >= 200 && res.statusCode <= 299) {
           resolve(res);
           wx.hideLoading();
         } else if (res.statusCode == 401) {
           wx.showToast({
             title: '没有权限访问，请先登录',
             icon: 'none'
           })
         } else {
           wx.showToast({
             title: JSON.stringify(res.data),
             icon: 'none'
           })
         }
       },
       fail: (err) => {
         wx.showToast({
           title: JSON.stringify(err.errMsg),
           icon: 'none',
           mask: true
         });
       },
     })

   })

 };

 const wxRequestForResponse = (params) => {
   let header = params.header || {};
   header["X-Access-Token"] = app.globalData["X-Access-Token"];
   return new Promise((resolve, reject) => {
     // wx.showLoading({
     //   title: '加载中',
     //   mask: true
     // });
     wx.request({
       ...params,
       url: baseURL + params.url,
       header: header,
       success: (res) => {
         if (res.header["X-Access-Token"]) {
           app.globalData["X-Access-Token"] = res.header["X-Access-Token"]
         }
         resolve(res);
         // wx.hideLoading();
       },
       fail: (err) => {
         wx.showToast({
           title: JSON.stringify(err.errMsg),
           icon: 'none',
           mask: true
         });
       }
     })

   })

 }

 // 模拟formData格式数据
 const formDataRequest = (params) => {
   let boundry = 'wxFormBoundary' + new Date().getTime().toString();
   // header内既要设置contentType，还要设置token
   let header = params.header || {
     "Content-Type": `multipart/form-data;boundary=${boundry}`
   };
   header["X-Access-Token"] = app.globalData["X-Access-Token"];
   //然后整理数据
   let formString = '';
   for (let key in params.formData) {
     formString += `\r\n--${boundry}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${params.formData[key]}`
   }
   formString += `\r\n--${boundry}--`

   return new Promise((resolve, reject) => {
     wx.showLoading({
       title: '加载中',
       mask: true
     });
     wx.request({
       url: baseURL + params.url,
       method: params.method ? params.method : 'POST',
       header: header,
       data: formString,
       success: (res) => {
         if (res.header["X-Access-Token"]) {
           app.globalData["X-Access-Token"] = res.header["X-Access-Token"]
         }
         if (res.statusCode >= 200 && res.statusCode <= 299) {
           resolve(res);
           wx.hideLoading();
         } else if (res.statusCode == 401) {
           wx.showToast({
             title: '没有权限访问，请先登录',
             icon: 'none'
           })
         } else {
           wx.showToast({
             title: JSON.stringify(res.data),
             icon: 'none'
           })
         }
       },
       fail: (err) => {
         wx.showToast({
           title: JSON.stringify(err.errMsg),
           icon: 'none',
           mask: true
         });
       },
     })

   })

 };

 // 管理员相关接口的请求
 const adminRequest = (params) => {
   let header = params.header || {};
   header["X-Access-Token"] = app.globalData["X-Access-Token"];
   return new Promise((resolve, reject) => {
     wx.showLoading({
       title: '加载中',
       mask: true
     });
     wx.request({
       ...params,
       url: adminURL + params.url,
       header: header,
       success: (res) => {
         if (res.header["X-Access-Token"]) {
           app.globalData["X-Access-Token"] = res.header["X-Access-Token"]
         }
         if (res.statusCode >= 200 && res.statusCode <= 299) {
           resolve(res);
           wx.hideLoading();
         } else if (res.statusCode == 401) {
           wx.showToast({
             title: '您还未登录,没有您的数据',
             icon: 'none'
           })
         } else {
           wx.showToast({
             title: JSON.stringify(res.data),
             icon: 'none'
           })
         }
       },
       fail: (err) => {
         wx.showToast({
           title: JSON.stringify(err.errMsg),
           icon: 'none',
           mask: true
         });
       },
     })

   })

 };

 module.exports = {
   wxRequest: wxRequest,
   wxRequestForResponse: wxRequestForResponse,
   adminRequest: adminRequest,
   formDataRequest: formDataRequest
 }