// page/recycleopt/pages/recycleorders/recycleorders.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      orderlist:[],
      theme: 'light',
      role:app.globalData.role,
      isShow: true,
      visible: false,
      textPassword: '',
      index:0,
    },
    handlePopup(e) {
      console.log(e);
    this.setData(
      {
        index: e.currentTarget.id,
      },
      () => {
        this.setData({ visible: true });
      },
    );
  },

  submit(e){
    if(this.data.textPassword===app.globalData.paypwd){
      var index  = this.data.index
      var item = this.data.orderlist[index]
      this.onUpdateOreder()
      this.queryUserinfo(item.wechatbuy,-item.cost)
      this.queryUserinfo(item.wechatsale,item.cost)
       this.setData({
        visible: false
      })
    }else{
      this.setData({
        textPassword: ''
      })
    }
  },



  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },
  onClose() {
    this.setData({
      visible: false,
    });
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
        var coll = null
        if(app.globalData.role==2){
          coll=db.collection('recycle_orders').where({
            wechatbuy:app.globalData.openid
          })
        }else{
          coll=db.collection('recycle_orders').where({
            wechatsale:app.globalData.openid
          })
        }
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
    onUpdateOreder(){
      var _this = this
      var orderlist = this.data.orderlist
      var index  = this.data.index
      var item = orderlist[index]
      item.status = 1
      wx.cloud.init({
        env: 'cloud1-7go51v8te374de35',
      })
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('recycle_orders').where({
      orderid:item.orderid
    }).update({
      data:{
        cost:item.cost,
        amount:item.amount,
        status:item.status
      },
      success: function(res) {
        _this.setData({
          orderlist
        })
      },
      fail: function(err){
        item.status = 0
        console.log('payfor:',err)
      }
    })
    },
    writeCashToBalance(wechatid, balance,cash){
      wx.cloud.init({
        env: 'cloud1-7go51v8te374de35',
      })
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('user_info').where({
        wechatid:wechatid
    }).update({
      data:{
        balance:balance,
        cash:cash,
      },
      success: function(res) {
        console.log('payok:',res)
      },
      fail: function(err){
        console.log('payerr:',err)
      }
    })
    },
    queryUserinfo(wechatid,cost){
      console.log('wechatid:',wechatid, 'cost:', cost)
      var self = this
      wx.cloud.init({
        env: 'cloud1-7go51v8te374de35',
      })
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('user_info').where({
        wechatid:wechatid
    }).get({
      success: function(res) {
        self.writeCashToBalance(wechatid,res.data[0].balance+cost,res.data[0].cash+cost)
      },
      fail:function(err){
        console.log('queryUserCash:',err)
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