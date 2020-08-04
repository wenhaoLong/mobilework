// components/Router/Router.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userAvatar: {
      type: String,
      value: '/resources/image/populartest_1.jpg'
    },
    menuStatus: {
      type: Boolean,
      value: false // 为true则显示菜单。为false则隐藏菜单
    },
    currentMenu: {
      type: Object,
      value: {
        id: 40,
        name: '用户列表',
        parentId: 4,
        path: '/ere/ere',
        icon: 'iconfont iconbiaoge',
        roleIds: [],
        sort: -1,
        children: []
      }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    menus: [{
        id: 2,
        name: '用户管理',
        parentId: 3,
        path: '/ere/ere',
        icon: 'iconfont iconbiaoge',
        roleIds: [],
        sort: -1,
        children: [{
          id: 20,
          name: '用户列表',
          parentId: 2,
          path: '/ere/ere',
          icon: 'iconfont iconbiaoge',
          roleIds: [],
          sort: -1,
          children: []
        }]
      },
      {
        id: 4,
        name: '用户管理',
        parentId: 3,
        path: '/ere/ere',
        icon: 'iconfont iconbiaoge',
        roleIds: [],
        sort: -1,
        children: [{
          id: 40,
          name: '用户列表',
          parentId: 4,
          path: '/ere/ere',
          icon: 'iconfont iconbiaoge',
          roleIds: [],
          sort: -1,
          children: []
        }]
      }
    ],

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showMenu: function () {

      this.showAnimation();
    },
    hiddenMenu: function () {
      this.hideAnimation();
    },
    // 这函数没用，仅仅用来阻止点击事件冒泡
    stopBubble: function () {

    },
    showAnimation: function () {
      this.setData({
        menuStatus: true
      })
      let animation = wx.createAnimation({
        delay: 0,
        duration: 200
      });
      animation.translateX(0).step();
      this.setData({
        drawer: animation.export()
      })


    },
    hideAnimation: function () {
      let animation = wx.createAnimation({
        delay: 0,
        duration: 200
      });
      animation.translateX(-350).step();
      this.setData({
        drawer: animation.export()
      })
      setTimeout(() => {
        this.setData({
          menuStatus: false
        })
      }, 200)


    },
    // 开关，通过啥子展示啥子
    switchMenu: function (e) {
      // console.log(e.currentTarget.dataset.id);
      let { id } = e.currentTarget.dataset;
      let { switchId }  = this.data;
      switchId = switchId=== id? null : id;
      // console.log(switchId);
      
        this.setData({
          switchId
        })


    },
    //
    routePage:function(e){
      let { id } = e.currentTarget.dataset;
      console.log("我要去这儿啦",id);
    },
    // 动画


  }
})