// page/user/mine/mine.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        showMakePhone: false,
        userInfo: {
            avatarUrl: '',
            nickName: '正在登录...',
            phoneNumber: '',
        },
        customerServiceInfo: {},
        currAuthStep: 1,
        showKefu: true,
        versionNo: '',
        menuData : [
            [
              {
                title: '地址管理',
                tit: '',
                url: '',
                type: 'address',
              },
              {
                title: '回收订单',
                tit: '',
                url: '',
                type: 'recycleorder',
              },
              {
                title: '家政订单',
                tit: '',
                url: '',
                type: 'domesticorder',
              },
              // {
              //   title: '本地生活订单',
              //   tit: '',
              //   url: '',
              //   type: 'domesticorder',
              // },
              {
                title: '优惠券',
                tit: '',
                url: '',
                type: 'coupon',
              },
              {
                title: '余额',
                tit: '',
                url: '',
                type: 'point',
              },
            ],
            [
              // {
              //   title: '帮助中心',
              //   tit: '',
              //   url: '',
              //   type: 'help-center',
              // },
              {
                title: '客服热线',
                tit: '',
                url: '',
                type: 'service',
                icon: 'service',
              },
              {
                title: '站点列表',
                tit: '',
                url: '',
                type: 'nodelist',
                icon: 'service',
              },
              {
                title: '新建小区',
                tit: '',
                url: '',
                type: 'community',
                icon: 'service',
              },
            ],
          ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    onClickCell({ currentTarget }) {
        const { type } = currentTarget.dataset;
        console.log('type:',type)
        switch (type) {
          case 'address': {
            wx.navigateTo({ url: '../recycleopt/pages/recycleaddrlist/recycleaddrlist' });
            break;
          }
          case 'service': {
            this.openMakePhone();
            break;
          }
          case 'help-center': {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '你点击了帮助中心',
              icon: '',
              duration: 1000,
            });
            break;
          }
          case 'point': {
            wx.navigateTo({ url: '../user/pages/balance/balance' });
            break;
          }
          case 'coupon': {
            wx.navigateTo({ url: '/pages/coupon/coupon-list/index' });
            break;
          }
          case 'nodelist': {
            wx.navigateTo({ url: '../manage/pages/recyclenodelist/recyclenodelist' });
            break;
          }
          default: {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '未知跳转',
              icon: '',
              duration: 1000,
            });
            break;
          }
        }
    }
})