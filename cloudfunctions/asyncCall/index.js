// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    return new Promise((resolve, reject) => {
        // 在 3 秒后返回结果给调用方（小程序 / 其他云函数）
        const wxContext = cloud.getWXContext()
        const db = cloud.database()
        const _ = db.command
        var $ = db.command.aggregate
        console.log('db:',db)
        db.collection('recycleaddr_list').get({
            success: function(res) {
              console.log(res)
              //resolve(res)
            }
          })
      })
}