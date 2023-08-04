// page/recycleopt/pages/recycleorders/recycleorders.js
const util = require('../../../../utils/utils.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    options: {
      styleIsolation: 'apply-shared',
    },
    data: {
      orderlist:[],
      theme: 'light',
      role:app.globalData.role,
      isShow: true,
      visible: false,
      textPassword: '',
      index:0,
      value: '',
      // z
      bianhuan:0
    },
    // 搜索框
    onChange(e) {
      console.log(e.detail.value);
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
      this.onUpdateOrder(item)
      this.queryUserinfo(item.wechatbuy,Number(-item.cost))
      this.queryUserinfo(item.wechatsale,Number(item.cost))
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
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff'
      });
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
        if(app.globalData.role==2 || app.globalData.role==0){
          coll=db.collection('recycle_orders').orderBy('status', 'asc').where({
            wechatbuy:app.globalData.openid
          })
        }else{
          coll=db.collection('recycle_orders').orderBy('status', 'asc').where({
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
                  'saler':element.caller,
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
    switchtwe(e) {
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

    kindToggle(e) {
      console.log(e);
        const id = e.currentTarget.id
        const orderlist = this.data.orderlist

        for (let i = 0, len = orderlist.length; i < len; ++i) {
          if (orderlist[i].orderid === id) {
            orderlist[i].open = !orderlist[i].open
            console.log(orderlist[i].open);
          } else {
            orderlist[i].open = false
          }
        }
        this.setData({
          orderlist
        })
    },
    onUpdateOrder(item){
      var self = this
      const db = app.globalData.db
      db.collection('recycle_orders').where({
        orderid:item.orderid
    })
    .update({
      data:{
        cost:item.cost,
        amount:item.amount,
        status:1
      },
      success: function(res) {
        var orderlist = self.data.orderlist
        item.status = 1
        self.setData({
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
      const db = app.globalData.db
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
      var self = this
      const db = app.globalData.db
      db.collection('user_info').where({
        wechatid:wechatid
    }).get({
      success: function(res) {
        var balance = res.data[0].balance
        var cash = res.data[0].cash
        self.writeCashToBalance(wechatid,balance+cost,cash+cost)
        self.writeCashRecord(wechatid,cost)
      },
      fail:function(err){
        console.log('queryUserCash:',err)
      }
    })
    },

    writeCashRecord(wechatid, cash){
      var strDate = util.formatDateTime(new Date())
      var tag = cash>0?'income':'expense'
      const db = app.globalData.db
      db.collection('cash_records')
      .add({
        data:{
          cash:cash,
          date:strDate,
          role:app.globalData.role,
          type:tag,
          wechatid:wechatid
        },
        success: function(res) {
          console.log(res)
        },
        fail: console.error,
        complete: console.log
      })
    },

    onCostChanged(e){
      var index  = e.currentTarget.id
      var item = this.data.orderlist[index]
      item.cost = Number(e.detail.value)
    },

    onAmountChanged(e){
      var index  = e.currentTarget.id
      var item = this.data.orderlist[index]
      item.amount = Number(e.detail.value)
    }
})