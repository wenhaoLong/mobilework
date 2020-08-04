// components/Pagination/Pagination.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    current:{ // 当前页数
      type:Number,
      value:1
    },
    pageSize:{ // 每页条数
      type: Number,
      value:10
    },
    total:{ // 数据总数
      type:Number,
      value:0
    },
    size:{ // 按钮尺寸,只有默认和small
      type:String,
      // value:'small'
      value:'dafault'
    },
    showTotal:{ // 展示total时的文字
      type:Function
    }


  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached:function(){
  },

  observers:{
    'total':function(total){
      // console.log(total);
      let totalContent = '';

      let {pageSize, showTotal} = this.data;
      
      if (showTotal){
          totalContent = showTotal(total);
      } else {
        totalContent = 'Total ' + total + ' items'
      }
      this.setData({
        totalContent:totalContent,
        pagesAccount: Math.ceil(total/pageSize)
      })
      
    }

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toPreviousPage:function(){
      let {current} = this.data;
      // console.log(current);
      
      this.onChange(current-1);

    },
    toNextPage:function(){

      let {current} = this.data;
      this.onChange(current+1);
    },
    // 对input进行处理
    inputPage:function(e){
      let { page } = e.detail.value;
      let { pagesAccount } = this.data;
      parseInt(page);
      if (page >= 1 && page <= pagesAccount){
        // console.log('你输入对了');
        this.onChange(page);
      } else {
        wx.showToast({
          title: '您的输入不合法',
          icon:'none'
        })
      }

    },
    // 子组件向父组件通信
    onChange:function(page){
      
      this.triggerEvent('onChange',page,{}) // 三个参数，触发的事件名， 传递的参数和触发事件的选项
    }


  }
})
