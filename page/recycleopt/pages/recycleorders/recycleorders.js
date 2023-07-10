// page/recycleopt/pages/recycleorders/recycleorders.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      orderlist:[],
      theme: 'light'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.setData({
        theme: wx.getSystemInfoSync().theme || 'light'
      })
      if (wx.onThemeChange) {
        wx.onThemeChange(({theme}) => {
          this.setData({theme})
        })
      }
      var _this = this
        wx.cloud.init({
          env: 'cloud1-7go51v8te374de35',
        })
        const db = wx.cloud.database()
        const _ = db.command
        var coll=db.collection('order_recycle').where({
          wechatsale:'y7668'
        })

        coll.field({
          _id:0,
          _openid:0
        })
        .get({
          success: function(res) {
            if(res.data.length>0){
              var list=[]
              var index = 0
              res.data.forEach(element=>{
                list.push({
                  'index':index++,
                  'orderid':element.orderid,
                  'communityname':element.communityname,
                  'flat':element.flat,
                  'caller':element.caller,
                  'phonenum':element.phonenum,
                  'amount':element.amount,
                  'cost':element.cost,
                  'price':element.price,
                  'message':element.message,
                  'wechatbuy':element.wechatbuy,
                  'wechatsale':element.wechatsale,
                  'date':element.date,
                  'type':element.type,
                  'status':element.status,
                  'open':false
                })
              })
              console.log('orderlist:',list)
              _this.setData({
                orderlist:list
              })
            }
          }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    kindToggle(e) {
        const id = e.currentTarget.id
        const orderlist = this.data.orderlist
        
        for (let i = 0, len = orderlist.length; i < len; ++i) {
          if (orderlist[i].orderid === id) {
            orderlist[i].open = !orderlist[i].open
          } else {
            orderlist[i].open = false
          }
        }
        this.setData({
          orderlist
        })
    },
    onPayClicked(e){
      console.log('pay:',e.currentTarget.id)
      var _this = this
      var orderlist = this.data.orderlist
      var index  = e.currentTarget.id
      var item = orderlist[index]
      item.status = 1
      wx.cloud.init({
        env: 'cloud1-7go51v8te374de35',
      })
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('order_recycle').where({
      orderid:item.orderid
    }).update({
      data:{
        cost:item.cost,
        amount:item.amount,
        status:item.status
      },
      success: function(res) {
        console.log(res.data)
        _this.setData({
          orderlist
        })
      },
      fail: function(res){
        item.status = 0
      }
    })
    },

    onCostChanged(e){
      var index  = e.currentTarget.id
      var item = this.data.orderlist[index]
      item.cost = e.detail.value
    },

    onAmountChanged(e){
      var index  = e.currentTarget.id
      var item = this.data.orderlist[index]
      item.amount = e.detail.value
    }
})