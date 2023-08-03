var db
var _

function initDataBase(){
  wx.cloud.init({
    env: 'cloud1-7go51v8te374de35',
  })
    db = wx.cloud.database()
    _ = db.command
  // this.globalData.db = db
  // this.globalData._command = _
}

function writeNewItemToJunkedorders(item, fun){
  db.collection('junked_orders').add({
      // data 字段表示需新增的 JSON 数据
      data: {
          orederid : item.orederid,
          username : item.username,
          phone : item.phone,
          addr :item.addr,
          amount :item.amount,
          datetime :item.datetime,
          status:item.status,
          junkerId:item.junkerId,
          dealerId: '',
          junklist:item.junklist
      },
      success: function(res) {
        fun(0,'success')
      },
      fail: console.error,
      complete: console.log
    })
}

function queryItemStatusWithOrderId(orderid){
  //
}

function updateJunkedordersWithOrderid(orderid, status){
  //
}

function readItemFromJunkedordersWithJunkerId(openid){
  //
}
module.exports = {
  initDataBase,
  writeNewItemToJunkedorders,
}