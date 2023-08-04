// page/user/balance/balance.js
const util = require('../../../../utils/utils.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      rices:100,
      addRice:true,
      balance:app.globalData.balance,
      cash:app.globalData.cash,
      inputValue: '', //用于显示输入语句
      searchinput: '', //用户输入的查询语
      cashrecord:[],
      dataList: [
          { title: '2023-07-01', amount: '+100', type: 'income' },
          { title: '2023-07-02', amount: '-200', type: 'expense' },
          { title: '2023-07-03', amount: '+300', type: 'income' },
          // 其他数据项...
        ],
      activeType: 'all', // 默认展示全部数据
      buttons: [
        {
          type: 'primary',
          className: '',
          text: '好！',
          value: 0,
        }
      ],
      // 滑块
      indicatorLeft: '0%',
      // 滑块内容
      nametexts:'全部',
      // 底部弹框
      cur: {},
      position: [
        { value: 'bottom', text: '底部弹出' }
      ],
      // 
      inputValue: '',
      textx:"请输入取米数量",
      value:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.loadBalance(app.globalData.openid)
        this.loadRecords(app.globalData.openid)
        this.setData({
          balance:app.globalData.balance,
          cash:app.globalData.cash
        })
    },
    // 滑块的代码
    onClickSlider: function(event) {
      var index = event.currentTarget.dataset.index;
      var left = index * 33.33 + '%';
      console.log(index);
      if(index==0){
        this.setData({
          indicatorLeft: left,
          nametexts:'全部',
          activeType:'all'
        });
      }else if(index==1){
        this.setData({
          indicatorLeft: left,
          nametexts:'收入',
          activeType:'income'
        });
      }else{
        this.setData({
          indicatorLeft: left,
          nametexts:'支出',
          activeType:'expense'
        });
      }
    },
    // 底部弹框
    // 取钱
    handlePopup(e) {
      const { item } = e.currentTarget.dataset;
        const value = e.currentTarget.dataset.value;
if(value=='1'){
  this.setData({
    textx:"请输入取米数量"
  }
  )
  this.setData(
    {
      cur: item,
      value:''
    },
    () => {
      this.setData({ visible: true });
    },
  );
}else{
  this.setData({
    textx:"请输入存米数量"
  }
  )
  this.setData(
    {
      cur: item,
      value:''
    },
    () => {
      this.setData({ visible: true });
    },
  );
}
      
    },
    onVisibleChange(e) {
      this.setData({
        visible: e.detail.visible,
      });
    },
    // 输入框内容
    handleInput: function (e) {
      this.setData({
        inputValue: e.detail.value
      });
    },
    submit: function () {
      const inputValue = this.data.inputValue;
      // 在这里可以对输入的内容进行处理或提交操作
      console.log('输入的内容是：', inputValue);
    },


    
    loadBalance(wechatid){
      const db = app.globalData.db
        db.collection('user_info')
        .where({
           wechatid: wechatid
        })
        .field({
          _id:0,
          balance:1,
          cash:1
        })
        .get({
          success : (res)=>{
            if(res.data.length>0){
              var balance = res.data[0].balance
              var cash = res.data[0].cash
              app.globalData.balance = balance
              app.globalData.cash = cash
              this.setData({
                balance,
                cash
              })
            }
            console.log(res)
          },
          fail : (err)=>{
            console.log(err)
          }
        })
    },

    loadRecords(wechatid){
      var _this = this
      console.log('wechatid:',wechatid)
        const db = app.globalData.db
        /*
        const countResult =  db.collection('cash_records').count()
        const total = countResult.total
        // 计算需分几次取
        const batchTimes = Math.ceil(total / 100)
        */
        db.collection('cash_records')
        .orderBy('date', 'desc')
        .where({
           wechatid: wechatid
        })
        .field({
          _id:0,
          date:1,
          cash:1,
          type:1
        })
        .get({
          success: function(res) {
              console.log('cashrecords:',res.data)
              _this.setData({
                cashrecord:res.data
              })
            },
            fail:function(err){
              console.log(err)
            }
          })
    },

    addRiceAction(obj){
      console.log('addRiceAction',obj)
      this.setData({
        // 这个改了
        addRice:true
      })
    },

    callPayAction(){
      console.log('add rices:',this.data.rices)
      this.putCashIn()
      this.setData({
        addRice:false
      })
    },

    callWeChatPay(payArgs){
      wx.requestPayment({
        timeStamp: payArgs.payment.timeStamp,
        nonceStr: payArgs.payment.nonceStr,
        package: payArgs.payment.package,
        signType: payArgs.payment.signType,
        paySign: payArgs.payment.paySign,
        success: (res) => {
          wx.showToast({title: '支付成功'})
          this.addCashRecord(Number(this.data.rices),'income')
        },
        fail:(err)=>{
          console.error('支付失败：', err)
        }
      })
    },

    putCashIn(){
      //
      wx.cloud.callFunction({
        name: 'payment',
        data: {
          theme: 'light',
          action: 'unifiedorder',
          userInfo: {
            openId: app.globalData.openid
          },
          rice : this.data.rices*100
        },
        success: res => {
          console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
          var result = res.result
          if(result.returnCode==='SUCCESS'){
            this.callWeChatPay(result)
            //this.addCashRecord(Number(this.data.rices),'income')
          }else{
            console.log('payment:',result)
          }
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '支付失败',
          })
          console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
        }
      })
    },

    getCashOut(val){
      //
      //this.addCashRecord(val,'expense')
    },

    toUseCash(){
      //
    },

    addCashRecord(val,tag){
      var cash,balance
      switch(tag){
        case 'expense':
          cash = this.data.cash - val
          balance = this.data.balance - val
          app.globalData.cash = cash
          app.globalData.balance = balance
          break
        case 'income':
          cash = this.data.cash + val
          balance = this.data.balance + val
          app.globalData.cash = cash
          app.globalData.balance = balance
          break
      }

      var strDate = util.formatDateTime(new Date())
      const db = app.globalData.db
      db.collection('cash_records')
      .add({
        data:{
          cash:val,
          date:strDate,
          role:app.globalData.role,
          type:tag,
          wechatid:app.globalData.openid
        },
        success: function(res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res)
        },
        fail: console.error,
        complete: console.log
      })

      db.collection('user_info').where({
        wechatid:app.globalData.openid
      }).update({
        data:{
          balance:balance,
          cash:cash
       },
       success: function(res) {
         console.log(res)
       },
       fail: function(err){
         console.log(err)
       }
      })

      var  cashrecord = this.data.cashrecord
      cashrecord.splice(0,0,{date:strDate,cash:val,type:tag})

      this.setData({
        balance,
        cash,
        cashrecord
      })
    },

    onShow(){
    },
    onUnload(){
    },
    
    handleTabChange(event) {
        const type = event.currentTarget.dataset.type;
        this.setData({
          activeType: type
        });
      },
})