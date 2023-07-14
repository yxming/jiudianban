// page/market/market.js
Component({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: true,
        visible: false,
        textPassword: '',
        tiao: false
    },
    methods: {
      handleGetPhoneNumber(event) {
        if (event.detail.errMsg === "getPhoneNumber:ok") {
          console.log(event);
          const encryptedData = event.detail.encryptedData;
          const iv = event.detail.iv;
    
          // 在这里处理获取到的手机号码
          wx.request({
            url: '解密手机号的后端接口URL',
            method: 'POST',
            data: {
              encryptedData: encryptedData,
              iv: iv,
              sessionKey: wx.getStorageSync('sessionKey') // 获取存储的 sessionKey
            },
            success(res) {
              // 在这里处理解密后的手机号数据
              console.log('解密后的手机号数据:', res.data.phoneNumber);
            },
            fail(err) {
              console.error('解密手机号失败:', err);
            }
          });
        } else {
          // 用户拒绝授权手机号，或者授权失败
          console.log("获取手机号失败");
        }
      },
        handlePopup(e) {
            console.log(e);
          const { item } = e.currentTarget.dataset;
    
          this.setData(
            {
              cur: item,
            },
            () => {
              this.setData({ visible: true });
            },
          );
        },
        onVisibleChange(e) {
          this.setData({
            visible: e.detail.visible,
          });
        },
        onClose() {
          this.setData({
            visible: false,
          });
        },
        tiaozhaun() {
          // wx.navigateTo({url: 'https://www.jd.com'})
          this.setData({
            tiao: true
          })
        }
      },
})