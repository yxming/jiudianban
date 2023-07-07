const app = getApp()

Page({
  jump: function () {
    wx.navigateTo({
      url: './test',
      events: {
        acceptDataFromOpenedPage: function (data) {
          console.log('accept event:',data)
        },
      },
      success: function (res) {
        console.log(res)
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'send from opener page：index' })
      }
    })
  },
})
