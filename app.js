App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'cloud1-7go51v8te374de35',
    })
    const db = wx.cloud.database()
    const _ = db.command
    wx.checkSession({
      success () {
        console.log('checkSession success')
        //session_key 未过期，并且在本生命周期一直有效
        wx.getUserInfo({
          success: function(res) {
            var userInfo = res.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女
            var province = userInfo.province
            var city = userInfo.city
            var country = userInfo.country
            console.log('userinfo:',userInfo)
          }
        })
      },
      fail () {
        console.log('checkSession fail')
        // session_key 已经失效，需要重新执行登录流程
        wx.login() //重新登录
      }
    })
  }

})
