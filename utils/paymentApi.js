const utils = require('../utils/comm')
const app = getApp()
const db = app.globalData.db
 
  function callWeChatPay(payArgs){
    wx.requestPayment({
      timeStamp: payArgs.payment.timeStamp,
      nonceStr: payArgs.payment.nonceStr,
      package: payArgs.payment.package,
      signType: payArgs.payment.signType,
      paySign: payArgs.payment.paySign,
      success: (res) => {
        wx.showToast({title: '支付成功'})
      },
      fail:(err)=>{
        console.error('支付失败：', err)
      }
    })
  }

  function putCashIn(cost){
    //
    wx.cloud.callFunction({
      name: 'payment',
      data: {
        theme: 'light',
        action: 'unifiedorder',
        userInfo: {
          openId: app.globalData.openid
        },
        rice : cost*100
      },
      success: res => {
        console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
        var result = res.result
        if(result.returnCode==='SUCCESS'){
          this.callWeChatPay(result)
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
  }

  function writeCashToBalance(wechatid, balance,cash){
    balance = Number(balance.toFixed(2))
    cash = Number(cash.toFixed(2))
    console.log('writeCashToBalance',balance,cash)
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
  }

  function writeCashRecord(wechatid, cash){
    cash = Number(cash.toFixed(2))
    console.log('writeCashRecord1',wechatid,cash)
    var strDate = utils.formatDateTime(new Date())
    console.log('strDate:',strDate)
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
        //console.log('add cash_records:',res)
      },
      fail: (err)=>{console.log('faild cash_records',err)},
      complete: console.log
    })
  }

  function queryUserinfo(openid, cost){
    db.collection('user_info').where({
        wechatid:openid
    }).get({
      success: function(res) {
        console.log('queryUserinfo:',openid,res)
        var balance = res.data[0].balance
        var cash = res.data[0].cash
        writeCashToBalance(openid,balance+cost,cash+cost)
        writeCashRecord(openid,cost)
      },
      fail:function(err){
        console.log('queryUserCash:',err)
      }
    })
  }

  function payToManager(managerid, amount){
    queryUserinfo(managerid, amount)
  }
  function payToUser(salerid, amount){
    console.log('payToUser',salerid, amount)
    queryUserinfo(salerid, amount)
  }
  function payToRecycler(recyclerid, amount){
    queryUserinfo(recyclerid, amount)
  }
  function payToServicer(servicerid, amount){
    this.queryUserinfo(servicerid, amount)
  }
  function updateMyself(amount){
    this.payToUser(app.globalData.openid, -amount*(1+app.globalData.recyclerate))
  }

  function ProfitAssign(amount, type, receivers){
    console.log('receivers',receivers)
    var due=0
    switch(type){
        case 'recycle':
            if(receivers.manager){
              due = amount*app.globalData.recyclerate*app.globalData.managerrecyclerate
              payToManager(receivers.manager, Number(due.toFixed(2)))
            }
            if(receivers.saler){
              due = amount.toFixed(2)
              this.payToUser(receivers.saler,Number(due))
              this.updateMyself(Number(due))
            }
                            
            break
        case 'service':

          if(receivers.manager){
            due = amount*app.globalData.servicerate*app.globalData.managerservicerate
            this.payToManager(receivers.manager, Number(due.toFixed(2)))
          }

          if(receivers.recycler){
            due = amount*app.globalData.servicerate*app.globalData.recyclerservicerate
            this.payToRecycler(receivers.recycler, Number(due.toFixed(2)))
          }

          if(receivers.servicer){
            due = amount*(1-app.globalData.servicerate)
            this.payToServicer(receivers.servicer, Number(due.toFixed(2)))
            this.updateMyself(Number(due.toFixed(2)))
          }
            break
    }
  }

    module.exports = {
      ProfitAssign,
      payToManager,
      queryUserinfo,
      payToUser,
      updateMyself,
      writeCashToBalance,
      writeCashRecord

    }