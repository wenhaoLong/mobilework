// components/Table/Table.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    columns: {
      type: Array,
      value: []
    },
    dataSource: {
      type: Array,
      value: []
    },

  },
  /**
   * 组件的初始数据
   */
  data: {

  },
  attached: function () {
    let {
      columns,
      dataSource
    } = this.data;
    console.log(columns, dataSource);
    for (let i in columns) {
      let item = columns[i]
      if (item.render) {
        for (let j in dataSource) {
          dataSource[j][item.key] = item.render(dataSource[j][item.title], dataSource[j]);
          // console.log('??');
        }
      }
    }

    this.setData({
      dataSource: dataSource
    })

  },
  observers: {

    'dataSource': function (dataSource) {
      let {
        columns
      } = this.data;
      console.log("watching change:",columns, dataSource);
      // for (let i in columns) {
      //   let item = columns[i]
      //   if (item.render) {
      //     for (let j in dataSource) {
      //       console.log(dataSource[j]);
      //       console.log(item.dataIndex);
      //       console.log(dataSource[j][item.dataIndex]);
            
            
            
      //       dataSource[j][item.key] = item.render(dataSource[j][item.dataIndex], dataSource[j]);
      //       // console.log('??');
      //     }
      //   }
      // }

      this.setData({
        dataSource: dataSource
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

})