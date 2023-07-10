// pages/discount/discount.js
Page({
    onShow: function () {
        // 检查功能是否开放
        // if (!getApp().globalData.tabBarEnabled) {
          // 功能未开放，提示用户并跳转离开
          wx.showToast({
            title: '功能暂未开放',
            icon: 'loading',
            duration: 5000,
            complete: function () {
             setTimeout(() => {
                wx.switchTab({
                    url: '/page/home/home' // 跳转到其他页面
                  });
             }, 2000);
            }
          });
        }
    //   }
      
})