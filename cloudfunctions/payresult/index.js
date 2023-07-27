// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    console.log(event)
    let {
        resultCode, // SUCCESS/FAIL
        outTradeNo,
        transactyonid,// 微信单号
        } = event
        let status = resultCode === 'SUCCESS' ? 1 : 2
        let params = {
            event,
            transactyonid,
            status
        }
    return {
        code:0,
        msg: 'SUCCESS'
    }
}