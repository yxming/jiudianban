
const app = getApp()
const db = app.globalData.db
const _ = app.globalData._

function payForJunk(cost, fun){
  if(cost>app.globalData.cash){
    wx.navigateTo({
      url: '../page/user/pages/balance/balance.js',
    })
  }else{
    app.globalData.cash = app.globalData.cash - cost
    app.globalData.balance = app.globalData.balance - cost
    db.collection('user_info').where({
      wechatid:app.globalData.openid
    }).update({
      data:{
        cash:app.globalData.cash,
        balance:app.globalData.balance
      },
      success:(res)=>{
        fun(0, 'success')
      },
      fail:(err)=>{
        fun(-1, 'failed')
      }
    })
  }
}

function confirmOrder(orderid){
  //
}

function writeNewItemToJunkedorders(item, fun){
  db.collection('junked_orders').add({
      // data 字段表示需新增的 JSON 数据
      data: {
          orderid : item.orderid,
          username : item.username,
          phone : item.phone,
          addr :item.addr,
          amount :item.amount,
          datetime :item.datetime,
          status:item.status,
          junkerid:item.junkerid,
          dealerid: '',
          junklist:item.junklist
      },
      success: (res)=> {fun(0,'success')},
      fail: (err)=>{fun(-1,err)},
      complete: console.log
    })
}

function queryItemStatusWithOrderId(orderid,fun){
  db.collection('junked_orders').where({
    orderid:orderid
  }).field({
    _id:0,
    status:1
  }).get({
    success:(res)=>{
      if(res.data.length>0){
        fun(orderid,res.data[0].status)
      }else{
        fun(orderid,-1)
        console.log('record not found with orderid:',orderid)
      }
    },
    fail:(err)=>{
      fun(orderid,-1)
      console.log('query junked order status failed:',err)
    }
  })
}

function updateJunkedordersWithOrderId(orderid, status){
  db.collection('junked_orders').where({
    orderid:orderid
  }).update({
    data:{
      dealerid:app.globalData.openid,
      status:status
    },
    success:(res)=>{
      console.log('update junkedorder status:',res)
    },
    fail:(err)=>{
      console.log('update junkedorder failed:',err)
    }
  })
}

function readItemFromJunkedordersWithJunkerId(fun){
  db.collection('junked_orders').where({
    junkerid:app.globalData.openid
  }).field({
    _id:0,
    _openid:0
  }).get({
    success:(res)=>{
      fun(openid, res.data)
    },
    fail:(err)=>{
      fun(openid, [])
    }
  })
}

function readItemFromJunkedordersWithStatus(status, fun){
  db.collection('junked_orders').where({
    status:status
  }).get({
    success:(res)=>{
      fun(status, res.data)
    },
    fail:(err)=>{
      fun(status, [])
    }
  })
}
module.exports = {
  // initDataBase,
  writeNewItemToJunkedorders,
  queryItemStatusWithOrderId,
  updateJunkedordersWithOrderId,
  readItemFromJunkedordersWithJunkerId,
  readItemFromJunkedordersWithStatus
}