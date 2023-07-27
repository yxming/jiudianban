// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {

    const wxContext = cloud.getWXContext()
    let openid = wxContext.OPENID
    let body ='一袋生活网用户买米'
    let nonceStr = Math.random().toString(36).substr(2,13) // 32位以内的随机字符患，此处是11位
    let timeStamp = parseInt(Date.now() / 1800)
    let outTradeNo = 'user'+ timeStamp + nonceStr // 商户订单号，32位以内的随一字符用，此处是25位
    let tradeType ='JSAPI' // 交易类型，小程序政值如下: JSAPI
    let value = event.rice
    const res = await cloud.cloudPay.unifiedOrder({
        body,
        nonceStr,
        tradeType,
        outTradeNo,
        "spbillCreateIp" : "127.0.0.1",
        "subMchId" : "1643213793",
        "totalFee" : value,
        "envId": "cloud1-7go51v8te374de35",
        "functionName": "payresult"
      })
      console.log('cloud pay:',res)
      return res
}