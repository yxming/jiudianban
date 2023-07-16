// page/user/balance/balance.js
const util = require('../../../../util/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputValue: '', //用于显示输入语句
        searchinput: '', //用户输入的查询语
        cashrecord:[],
        dataList: [
            { title: '2023-07-01', amount: '+100', type: 'income' },
            { title: '2023-07-02', amount: '-200', type: 'expense' },
            { title: '2023-07-03', amount: '+300', type: 'income' },
            // 其他数据项...
          ],
          activeType: 'all' // 默认展示全部数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getCashRecord('testid987')
        //this.addCashRecord()
    },

    addCashRecord(){
      
      wx.cloud.init({
        env: 'cloud1-7go51v8te374de35',
      })
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('record_getcash')
      .add({
        data:{
          cash:190,
          date:util.formatDateTime(new Date()),
          role:3,
          wechatid:'testid987'
        },
        success: function(res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res)
        },
        fail: console.error,
        complete: console.log
      })
    },
    handleTabChange(event) {
        const type = event.currentTarget.dataset.type;
        this.setData({
          activeType: type
        });
      },
    getCashRecord(wechatid){
      var _this = this
        console.log('wechatid:',wechatid)
        wx.cloud.init({
            env: 'cloud1-7go51v8te374de35',
          })
          const db = wx.cloud.database()
          const _ = db.command
          db.collection('record_getcash')
          .where({
             wechatid: wechatid
          })
          .field({
            _id:0,
            date:1,
            cash:1
          })
          .get({
            success: function(res) {
                console.log(res.data)
                _this.setData({
                  cashrecord:res.data
                })
              },
              fail:function(err){
                console.log(err)
              }
            })
    }
})