// page/home/home.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgSrcs:  [
            'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner1.png',
            'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner2.png',
            'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner3.png',
            'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner4.png',
            'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner5.png',
            'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner6.png'
          ],
        tabList: [],
        goodsList: [],
        goodsListLoadStatus: 0,
        pageLoading: false,
        current: 1,
        autoplay: true,
        duration: '500',
        interval: 5000,
        navigation: { type: 'dots' },
        swiperImageProps: { mode: 'scaleToFill' },
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
        this.getTabBar().init();
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
    gotoRecycle(){
        wx.navigateTo({
          url: '../user/recyclerequest/recyclerequest'
        })
    },

    gotoCategory(){
        wx.navigateTo({
            url: '../document/category'
          })
    },

    gotoBalance(){
        wx.navigateTo({
            url: '../user/balance/balance'
          })
    },

    gotoService(){
        wx.navigateTo({
            url: '../customer/service'
          })
    },
})