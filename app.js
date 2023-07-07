App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'cloud1-7go51v8te374de35',
    })
    const db = wx.cloud.database()
    const _ = db.command
  }

})
