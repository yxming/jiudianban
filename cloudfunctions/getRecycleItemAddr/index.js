// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const db = cloud.database()
        const _ = db.command
        var $ = db.command.aggregate
        coll=db.collection('recycleaddr_list')
        coll.where({
            wechatid:'y7665'
        }).get({
          success: function(res) {
            console.log(res)
          }
        })
        coll.aggregate()
          .lookup({
            from: "community_info",
            localField: "communitycode",
            foreignField: "communitycode",
            as: "communityList"
          })
          .replaceRoot({
            newRoot: $.mergeObjects([ $.arrayElemAt(['$communityList', 0]), '$$ROOT' ])
          })
          .project({
            communityList: 0
          })
          .end()
          .then(res => console.log(res))
          .catch(err => console.error(err))

    return {
        event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID
    }
}